import { cookies, headers } from "next/headers";
import { RequestBuilder } from "@/api/http/request-builder";
import { User } from "@/types/user";

// Server-side counterpart of fetchUserProfile (index.ts), for prefetching
// in a Server Component (see (protected)/layout.tsx). Kept in its own
// module — next/headers can't be pulled into the client bundle that
// index.ts's fetchUserProfile also ships in via protected-header.tsx.
//
// A Server Component can't resolve a relative URL against apiClient's
// baseURL — there's no browser origin to resolve it against — and doesn't
// forward the incoming request's cookies to an internal fetch
// automatically, so both are rebuilt by hand here.
export async function fetchUserProfileServer(): Promise<User> {
  const [headersList, cookieStore] = await Promise.all([
    headers(),
    cookies(),
  ]);
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");

  return new RequestBuilder<User>()
    // This backs a React Query prefetchQuery call, not a direct page
    // render — RequestBuilder's default redirect-on-401 throws a Next.js
    // redirect signal that React Query's internal fetch handling would
    // just swallow into query error state instead of letting it propagate,
    // so it's disabled here (same reasoning as neobank-proxy.ts).
    .withRedirectOn401(false)
    .withMethod("get")
    .withUrl(`${protocol}://${host}/api/users/me`)
    .withHeaders({ Cookie: cookieStore.toString() })
    .send();
}
