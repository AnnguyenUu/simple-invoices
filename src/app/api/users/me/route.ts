import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { proxyToNeobank } from "@api/http/neobank-proxy";
import { ORG_COOKIE } from "@modules/users-profile/configuration/constraints";
import { NEOBANK_SERVICES } from "@/context/request-url/neobank-services";
import type { UserResponse } from "@/types/user";

// BFF route for membership-service's current-user endpoint. On success,
// also stashes the org token from the user's first membership into
// ORG_COOKIE — this is what powers org-scoped calls like invoice-service.
// (login() also fetches and sets this same cookie at login time directly,
// since a Server Component's SSR prefetch of this route can't itself
// deliver a Set-Cookie back to the browser — see README.md.)
export async function GET(request: NextRequest) {
  return proxyToNeobank<UserResponse>(
    request,
    `${NEOBANK_SERVICES.membership}/users/me`,
    {
      onSuccess: async ({ data: user }) => {
        const [membership] = user.memberships;

        if (membership) {
          const cookieStore = await cookies();
          cookieStore.set(ORG_COOKIE, membership.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }

        return user;
      },
    }
  );
}
