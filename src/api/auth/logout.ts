"use server";

import { LOGIN_URL, SESSION_COOKIE } from "@/modules/login/configuration/constraints";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect(LOGIN_URL);
}