"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Form from "@radix-ui/react-form";
import { Button, Callout, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { InputPassword } from "@/libs/input-password";
import { login, LoginState } from "@/modules/login/repository/login";
import { loginSchema, LoginValues } from "@/shared/server-constract/login";

const initialState: LoginState = {};

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onValid = (values: LoginValues) => {
    const formData = new FormData();
    formData.set("username", values.username);
    formData.set("password", values.password);
    startTransition(() => formAction(formData));
  };

  return (
    <Card size="4" style={{ width: 380 }}>
      <Heading as="h1" size="5" mb="1">
        Sign in
      </Heading>
      <Text as="p" size="2" color="gray" mb="5">
        Use your email or phone number to continue.
      </Text>

      <Form.Root onSubmit={handleSubmit(onValid)}>
        <Flex direction="column" gap="4">
          <Form.Field name="username">
            <Flex direction="column" gap="1">
              <Form.Label asChild>
                <Text as="label" size="2" weight="medium">
                  Email or phone number
                </Text>
              </Form.Label>
              <Form.Control asChild>
                <TextField.Root
                  type="text"
                  autoComplete="username"
                  color={errors.username ? "red" : undefined}
                  {...register("username")}
                />
              </Form.Control>
              {errors.username ? (
                <Text as="p" size="1" color="red">
                  {errors.username.message}
                </Text>
              ) : null}
            </Flex>
          </Form.Field>

          <Form.Field name="password">
            <Flex direction="column" gap="1">
              <Form.Label asChild>
                <Text as="label" size="2" weight="medium">
                  Password
                </Text>
              </Form.Label>
              <Form.Control asChild>
                <InputPassword
                  autoComplete="current-password"
                  color={errors.password ? "red" : undefined}
                  {...register("password")}
                />
              </Form.Control>
              {errors.password ? (
                <Text as="p" size="1" color="red">
                  {errors.password.message}
                </Text>
              ) : null}
            </Flex>
          </Form.Field>

          {state.error ? (
            <Callout.Root color="red" size="1">
              <Callout.Text>{state.error}</Callout.Text>
            </Callout.Root>
          ) : null}

          <Form.Submit asChild>
            <Button size="3" mt="2" loading={pending}>
              Sign in
            </Button>
          </Form.Submit>
        </Flex>
      </Form.Root>
    </Card>
  );
}


export default function LoginPresentation() {
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
