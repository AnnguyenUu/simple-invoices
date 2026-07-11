import { Grid, Heading, TextField } from "@radix-ui/themes";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateInvoiceValues } from "@/shared/server-constract/invoice";
import { Field } from "./CreateInvoiceField";

export function CustomerSection({
  register,
  errors,
}: {
  register: UseFormRegister<CreateInvoiceValues>;
  errors: FieldErrors<CreateInvoiceValues>;
}) {
  return (
    <section>
      <Heading as="h2" size="3" mb="3">
        Customer
      </Heading>
      <Grid columns={{ initial: "1", sm: "2" }} gap="3">
        <Field
          name="customerFirstName"
          label="First name"
          error={errors.customerFirstName?.message}
        >
          <TextField.Root {...register("customerFirstName")} />
        </Field>
        <Field
          name="customerLastName"
          label="Last name"
          error={errors.customerLastName?.message}
        >
          <TextField.Root {...register("customerLastName")} />
        </Field>
        <Field
          name="customerEmail"
          label="Email"
          error={errors.customerEmail?.message}
        >
          <TextField.Root type="email" {...register("customerEmail")} />
        </Field>
        <Field
          name="customerMobileNumber"
          label="Mobile number"
          error={errors.customerMobileNumber?.message}
        >
          <TextField.Root
            type="tel"
            placeholder="+65..."
            {...register("customerMobileNumber")}
          />
        </Field>
      </Grid>
    </section>
  );
}
