import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { proxyToNeobank } from "@api/http/neobank-proxy";
import { ORG_COOKIE } from "@modules/users-profile/configuration/constraints";
import type { UserResponse } from "@/types/user";

export async function GET(request: NextRequest) {
  return proxyToNeobank<UserResponse>(
    request,
    "membership-service/1.0.0/users/me",
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
