import { Grid, Heading, Text, TextField } from "@radix-ui/themes";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateInvoiceValues } from "@/shared/server-constract/invoice";
import { Field } from "./CreateInvoiceField";

export function ItemSection({
  register,
  errors,
}: {
  register: UseFormRegister<CreateInvoiceValues>;
  errors: FieldErrors<CreateInvoiceValues>;
}) {
  return (
    <section>
      <Heading as="h2" size="3" mb="3">
        Item
      </Heading>
      <Text as="p" size="1" color="gray" mb="3">
        Each invoice supports a single line item.
      </Text>
      <Grid columns={{ initial: "1", sm: "2" }} gap="3">
        <Field
          name="itemReference"
          label="Item reference"
          error={errors.itemReference?.message}
        >
          <TextField.Root {...register("itemReference")} />
        </Field>
        <Field
          name="itemName"
          label="Item name"
          error={errors.itemName?.message}
        >
          <TextField.Root {...register("itemName")} />
        </Field>
        <Field
          name="itemDescription"
          label="Item description (optional)"
          error={errors.itemDescription?.message}
        >
          <TextField.Root {...register("itemDescription")} />
        </Field>
        <Field name="quantity" label="Quantity" error={errors.quantity?.message}>
          <TextField.Root
            type="number"
            min="0"
            step="1"
            {...register("quantity")}
          />
        </Field>
        <Field name="rate" label="Rate" error={errors.rate?.message}>
          <TextField.Root
            type="number"
            min="0"
            step="0.01"
            {...register("rate")}
          />
        </Field>
        <Field
          name="itemUOM"
          label="Unit of measure (optional)"
          error={errors.itemUOM?.message}
        >
          <TextField.Root placeholder="KG" {...register("itemUOM")} />
        </Field>
      </Grid>
    </section>
  );
}
