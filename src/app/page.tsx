import { Button, Flex, Text } from "@radix-ui/themes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "./login/actions";
import { SESSION_COOKIE } from "./login/session";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session) {
    redirect("/login");
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
