import { Grid, Heading, Text, TextField } from "@radix-ui/themes";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateInvoiceValues } from "@/shared/server-constract/invoice";
import { Field } from "./CreateInvoiceField";

export function BankAccountSection({
  register,
  errors,
}: {
  register: UseFormRegister<CreateInvoiceValues>;
  errors: FieldErrors<CreateInvoiceValues>;
}) {
  return (
    <section>
      <Heading as="h2" size="3" mb="3">
        Bank account
      </Heading>
      <Text as="p" size="1" color="gray" mb="3">
        Optional — leave blank to omit.
      </Text>
      <Grid columns={{ initial: "1", sm: "2" }} gap="3">
        <Field
          name="bankAccountName"
          label="Account name"
          error={errors.bankAccountName?.message}
        >
          <TextField.Root {...register("bankAccountName")} />
        </Field>
        <Field
          name="bankAccountNumber"
          label="Account number"
          error={errors.bankAccountNumber?.message}
        >
          <TextField.Root {...register("bankAccountNumber")} />
        </Field>
        <Field
          name="bankSortCode"
          label="Sort code"
          error={errors.bankSortCode?.message}
        >
          <TextField.Root
            placeholder="09-01-01"
            {...register("bankSortCode")}
          />
        </Field>
        <Field
          name="bankId"
          label="Bank ID (required if any bank field is filled in)"
          error={errors.bankId?.message}
        >
          <TextField.Root {...register("bankId")} />
        </Field>
      </Grid>
    </section>
  );
}
