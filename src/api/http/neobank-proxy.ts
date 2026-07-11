import axios from "axios";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { RequestBuilder, type HttpMethod } from "@api/http/request-builder";
import { SESSION_COOKIE } from "@modules/login/configuration/constraints";
import { ORG_COOKIE } from "@modules/users-profile/configuration/constraints";

// "session": Authorization: Bearer <identity access_token> only.
// "org": same Authorization header, plus an `org-token` header carrying the
// org-scoped membership token stashed in ORG_COOKIE after login — required
// by org-scoped services like invoice-service.
type NeobankAuthToken = "session" | "org";

type ProxyOptions<T> = {
  method?: HttpMethod;
  token?: NeobankAuthToken;
  data?: unknown;
  // Extra headers merged in on top of Authorization/org-token/Content-Type
  // — e.g. invoice-service's required `Operation-Mode: SYNC`.
  headers?: Record<string, string>;
  // Runs after a successful upstream call — use it to unwrap an envelope
  // (e.g. `{ data: ... }`) or apply a side effect (e.g. users/me stashing
  // the org token) before the response is sent to the client.
  onSuccess?: (data: T) => unknown | Promise<unknown>;
};

// Forwards a request to a 101 Digital neobank service (membership-service,
// invoice-service, ...), attaching the session/org Bearer token and any
// incoming query params, and maps upstream errors back to the client as-is.
// This is the single function every src/app/api/*/route.ts handler calls —
// see README.md's Architecture section for the request flow diagram.
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
      // This route backs a fetch/axios call from client code, not a page
      // navigation — see error-request.ts for why the 401 redirect is
      // skipped here in favor of forwarding the real upstream status.
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
      // Forward the upstream's real status/body (e.g. a 400 validation
      // error) instead of masking every failure as a generic 500.
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
