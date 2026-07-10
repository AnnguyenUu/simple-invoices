import { loginSchema, LoginValues } from "@/shared/server-constract/login";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  formAction: (payload: FormData) => void;
}

export const useLoginForm = ({ formAction }: Props) => {
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onValid = (values: LoginValues) => {
    const formData = new FormData();
    formData.set("username", values.username);
    formData.set("password", values.password);
    startTransition(() => formAction(formData));
  };

  return {
    form,
    onSubmit: form.handleSubmit(onValid)
  };
};
