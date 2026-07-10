import { memo } from "react";

import * as Form from "@radix-ui/react-form";
import { Button, Callout, Flex, Text, TextField } from "@radix-ui/themes";
import { InputPassword } from "@/libs/input-password";
import { LoginState } from "../repository/login";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  loading: boolean;
  state: LoginState;
  errors: FieldErrors<{
    username: string;
    password: string;
  }>;
  register: UseFormRegister<{
    username: string;
    password: string;
  }>;
}

const LoginFormItems = ({ loading, state, errors, register }: Props) => {
  return (
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
        <Button size="3" mt="2" loading={loading}>
          Sign in
        </Button>
      </Form.Submit>
    </Flex>
  );
};

export default memo(LoginFormItems);
