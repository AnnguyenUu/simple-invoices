import axios from "axios";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { RequestBuilder, type HttpMethod } from "@api/http/request-builder";
import { SESSION_COOKIE } from "@modules/login/configuration/constraints";
import { ORG_COOKIE } from "@modules/users-profile/configuration/constraints";

type NeobankAuthToken = "session" | "org";

type ProxyOptions<T> = {
  method?: HttpMethod;
  token?: NeobankAuthToken;
  data?: unknown;
  headers?: Record<string, string>;
  onSuccess?: (data: T) => unknown | Promise<unknown>;
};
export async function proxyToNeobank<T = unknown>(
  request: NextRequest,
  path: string,
  {
    method = "get",
    token = "session",
    data,
    headers: extraHeaders,
    onSuccess,
  }: ProxyOptions<T> = {}
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${sessionCookie.value}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (token === "org") {
    const orgCookie = cookieStore.get(ORG_COOKIE);

    if (!orgCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    headers["org-token"] = orgCookie.value;
  }

  try {
    const body = await new RequestBuilder<T>()
      .withRedirectOn401(false)
      .withMethod(method)
      .withUrl(`${process.env.NEOBANK_API_BASE_URL}/${path}`)
      .withParams(Object.fromEntries(request.nextUrl.searchParams))
      .withHeaders(headers)
      .withData(data)
      .send();

    return NextResponse.json(onSuccess ? await onSuccess(body) : body);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    return NextResponse.json(
      { error: "Upstream request failed" },
      { status: 502 }
    );
  }
}
