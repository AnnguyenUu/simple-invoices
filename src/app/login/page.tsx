import { Flex } from "@radix-ui/themes";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <LoginForm />
    </Flex>
  );
}
