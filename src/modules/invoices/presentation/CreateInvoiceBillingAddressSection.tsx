import { Grid, Heading, Text, TextField } from "@radix-ui/themes";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateInvoiceValues } from "@/shared/server-constract/invoice";
import { Field } from "./CreateInvoiceField";

export function BillingAddressSection({
  register,
  errors,
}: {
  register: UseFormRegister<CreateInvoiceValues>;
  errors: FieldErrors<CreateInvoiceValues>;
}) {
  return (
    <section>
      <Heading as="h2" size="3" mb="3">
        Billing address
      </Heading>
      <Text as="p" size="1" color="gray" mb="3">
        Optional — leave blank to omit.
      </Text>
      <Grid columns={{ initial: "1", sm: "2" }} gap="3">
        <Field
          name="addressPremise"
          label="Premise"
          error={errors.addressPremise?.message}
        >
          <TextField.Root {...register("addressPremise")} />
        </Field>
        <Field
          name="addressCity"
          label="City"
          error={errors.addressCity?.message}
        >
          <TextField.Root {...register("addressCity")} />
        </Field>
        <Field
          name="addressCounty"
          label="County"
          error={errors.addressCounty?.message}
        >
          <TextField.Root {...register("addressCounty")} />
        </Field>
        <Field
          name="addressPostcode"
          label="Postcode"
          error={errors.addressPostcode?.message}
        >
          <TextField.Root {...register("addressPostcode")} />
        </Field>
        <Field
          name="addressCountryCode"
          label="Country code"
          error={errors.addressCountryCode?.message}
        >
          <TextField.Root
            placeholder="VN"
            {...register("addressCountryCode")}
          />
        </Field>
      </Grid>
    </section>
  );
}
