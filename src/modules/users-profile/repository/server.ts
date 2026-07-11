import { cookies, headers } from "next/headers";
import { RequestBuilder } from "@/api/http/request-builder";
import { User } from "@/types/user";

export async function fetchUserProfileServer(): Promise<User> {
  const [headersList, cookieStore] = await Promise.all([
    headers(),
    cookies(),
  ]);
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");

  return new RequestBuilder<User>()
    .withRedirectOn401(false)
    .withMethod("get")
    .withUrl(`${protocol}://${host}/api/users/me`)
    .withHeaders({ Cookie: cookieStore.toString() })
    .send();
}
