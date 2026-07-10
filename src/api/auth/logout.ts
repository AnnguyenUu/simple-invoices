"use server";

import { SESSION_COOKIE } from "@/variables/constant";
import { LOGIN_URL } from "@/variables/pages-url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect(LOGIN_URL);
}