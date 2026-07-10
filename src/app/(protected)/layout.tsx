import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Box } from "@radix-ui/themes";
import {
  LOGIN_URL,
  SESSION_COOKIE,
} from "@modules/login/configuration/constraints";
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

  return (
    <>
      <ProtectedHeader />
      <Box p="6">{children}</Box>
    </>
  );
}
