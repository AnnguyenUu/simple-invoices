import { RequestBuilder } from "@/api/http/request-builder";
import { User } from "@/types/user";

// Client-side fetch for the current user's profile, via this app's own
// /api/users/me BFF route (relative URL resolves against apiClient's
// same-origin baseURL — see request-builder.ts/client.ts). For the
// Server Component equivalent, see repository/server.ts.
export function fetchUserProfile(): Promise<User> {
  return new RequestBuilder<User>()
    .withMethod("get")
    .withUrl("/users/me")
    .send();
}
