"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RequestBuilder } from "@api/http/request-builder";import { SESSION_COOKIE } from "@/variables/constant";

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
    grant_type: "password",
    client_id: process.env.IDENTITY_CLIENT_ID!,
    client_secret: process.env.IDENTITY_CLIENT_SECRET!,
    scope: "openid",
    username,
    password,
  });

  try {
    return await new RequestBuilder<TokenResponse>()
      .withMethod("post")
      .withUrl(`${process.env.IDENTITY_SERVER_URL}/oauth2/token`)
      .withHeaders({ "Content-Type": "application/x-www-form-urlencoded" })
      .withData(body)
      .send();
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

  redirect("/");
}