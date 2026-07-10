import { logout } from "@/api/auth/logout";
import { SESSION_COOKIE } from "@/variables/constant";
import { LOGIN_URL } from "@/variables/pages-url";
import { Button, Flex, Text } from "@radix-ui/themes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session) {
    redirect(LOGIN_URL);
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="4"
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <Text as="p" size="4">
        You&apos;re signed in.
      </Text>
      <form action={logout}>
        <Button type="submit">Sign out</Button>
      </form>
    </Flex>
  );
}
