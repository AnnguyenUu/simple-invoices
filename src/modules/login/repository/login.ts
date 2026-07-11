"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RequestBuilder } from "@api/http/request-builder";
import { GRAND_TYPE, SCOPE, SESSION_COOKIE } from "../configuration/constraints";
import { ORG_COOKIE } from "@modules/users-profile/configuration/constraints";
import { NEOBANK_SERVICES } from "@/context/request-url/neobank-services";
import type { UserResponse } from "@/types/user";

export type LoginState = {
  error?: string;
};

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
};

async function fetchToken(
  username: string,
  password: string
): Promise<TokenResponse | null> {
  const body = new URLSearchParams({
    client_id: process.env.IDENTITY_CLIENT_ID!,
    client_secret: process.env.IDENTITY_CLIENT_SECRET!,
    grant_type: GRAND_TYPE,
    scope: SCOPE,
    username,
    password,
  });

  const request = new RequestBuilder<TokenResponse>()

  try {
    return await request
      .withMethod("post")
      .withUrl(`${process.env.IDENTITY_SERVER_URL}/oauth2/token`)
      .withHeaders({ "Content-Type": "application/x-www-form-urlencoded" })
      .withData(body)
      .send();
  } catch {
    return null;
  }
}

// Called from login() only — a Server Action, where cookies().set() is
// actually allowed to reach the browser. Fetching this via a self-fetch to
// /api/users/me from (protected)/layout.tsx instead would run the Route
// Handler's cookies().set(ORG_COOKIE, ...) inside that internal request's
// own (discarded) response, never the real one — confirmed by reproducing
// it end-to-end: after a real login, /api/invoices 401'd because
// _uctx_ort was never actually in the browser's cookie jar.
async function fetchOrgToken(accessToken: string): Promise<string | null> {
  try {
    const { data: user } = await new RequestBuilder<UserResponse>()
      .withRedirectOn401(false)
      .withMethod("get")
      .withUrl(
        `${process.env.NEOBANK_API_BASE_URL}/${NEOBANK_SERVICES.membership}/users/me`
      )
      .withHeaders({
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      })
      .send();

    return user.memberships[0]?.token ?? null;
  } catch {
    return null;
  }
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username ||
    !password
  ) {
    return { error: "Email/phone number and password are required." };
  }

  const token = await fetchToken(username, password);
  if (!token) {
    return { error: "Invalid email/phone number or password." };
  }

  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE, token.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: token.expires_in,
  });

  const orgToken = await fetchOrgToken(token.access_token);
  if (orgToken) {
    cookieStore.set(ORG_COOKIE, orgToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  redirect("/");
}