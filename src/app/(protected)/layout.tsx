import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Box } from "@radix-ui/themes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  LOGIN_URL,
  SESSION_COOKIE,
} from "@modules/login/configuration/constraints";
import { userQueryKeys } from "@modules/users-profile/configuration/constraints";
import { fetchUserProfileServer } from "@modules/users-profile/repository/server";
import { getQueryClient } from "@/app/get-query-client";
import { ProtectedHeader } from "./protected-header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session) {
    redirect(LOGIN_URL);
  }
  
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: userQueryKeys.me,
    queryFn: fetchUserProfileServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProtectedHeader />
      <Box p={{ initial: "4", sm: "6" }}>{children}</Box>
    </HydrationBoundary>
  );
}
