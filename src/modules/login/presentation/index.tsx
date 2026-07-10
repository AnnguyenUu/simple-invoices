"use client";

import { useActionState } from "react";
import * as Form from "@radix-ui/react-form";
import {
  Card,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import { login, LoginState } from "@modules/login/repository/login";
import { useLoginForm } from "../core/handler/useLoginForm";
import LoginFormItems from "./LoginFormItems";

const initialState: LoginState = {};

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  const { form, onSubmit } = useLoginForm({
    formAction,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card size="4" style={{ width: 380 }}>
      <Heading as="h1" size="5" mb="1">
        SIGN IN
      </Heading>
      <Text as="p" size="2" color="gray" mb="5">
      Enter your credentials to access your account.
      </Text>

      <Form.Root onSubmit={onSubmit}>
        <LoginFormItems
          register={register}
          errors={errors}
          loading={pending}
          state={state}
        />
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
