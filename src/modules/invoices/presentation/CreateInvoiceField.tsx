import type { ReactNode } from "react";
import * as Form from "@radix-ui/react-form";
import { Flex, Text } from "@radix-ui/themes";

export function Field({
  name,
  label,
  error,
  asControl = true,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  asControl?: boolean;
  children: ReactNode;
}) {
  return (
    <Form.Field name={name}>
      <Flex direction="column" gap="1" mb="3">
        <Form.Label asChild>
          <Text as="label" size="2" weight="medium">
            {label}
          </Text>
        </Form.Label>
        {asControl ? <Form.Control asChild>{children}</Form.Control> : children}
        {error ? (
          <Text as="p" size="1" color="red">
            {error}
          </Text>
        ) : null}
      </Flex>
    </Form.Field>
  );
}
