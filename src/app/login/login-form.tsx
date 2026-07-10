"use client";

import { startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Form from "@radix-ui/react-form";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import {
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { z } from "zod";
import { login, type LoginState } from "./actions";

const loginSchema = z.object({
  username: z.string().min(1, "Email or phone number is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  
  const [showPassword, setShowPassword] = useState(false);

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
                <TextField.Root
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  color={errors.password ? "red" : undefined}
                  {...register("password")}
                >
                  <TextField.Slot side="right">
                    <IconButton
                      type="button"
                      size="1"
                      variant="ghost"
                      color="gray"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
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
