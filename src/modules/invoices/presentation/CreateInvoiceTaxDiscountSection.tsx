import { Grid, Heading, Select, Text, TextField } from "@radix-ui/themes";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { CreateInvoiceValues } from "@/shared/server-constract/invoice";
import { Field } from "./CreateInvoiceField";

export function TaxDiscountSection({
  register,
  errors,
  watch,
  setValue,
}: {
  register: UseFormRegister<CreateInvoiceValues>;
  errors: FieldErrors<CreateInvoiceValues>;
  watch: UseFormWatch<CreateInvoiceValues>;
  setValue: UseFormSetValue<CreateInvoiceValues>;
}) {
  return (
    <section>
      <Heading as="h2" size="3" mb="3">
        Tax &amp; discount
      </Heading>
      <Text as="p" size="1" color="gray" mb="3">
        Optional — leave a value blank to omit that adjustment.
      </Text>
      <Grid columns={{ initial: "1", sm: "2" }} gap="3">
        <Field
          name="taxType"
          label="Tax type"
          error={errors.taxType?.message}
          asControl={false}
        >
          <Select.Root
            value={watch("taxType")}
            onValueChange={(value) =>
              setValue("taxType", value as CreateInvoiceValues["taxType"], {
                shouldValidate: true,
              })
            }
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="PERCENTAGE">Percentage</Select.Item>
              <Select.Item value="FIXED_VALUE">Fixed value</Select.Item>
            </Select.Content>
          </Select.Root>
        </Field>
        <Field
          name="taxValue"
          label="Tax value (optional)"
          error={errors.taxValue?.message}
        >
          <TextField.Root
            type="number"
            min="0"
            step="0.01"
            {...register("taxValue")}
          />
        </Field>
        <Field
          name="discountType"
          label="Discount type"
          error={errors.discountType?.message}
          asControl={false}
        >
          <Select.Root
            value={watch("discountType")}
            onValueChange={(value) =>
              setValue(
                "discountType",
                value as CreateInvoiceValues["discountType"],
                { shouldValidate: true }
              )
            }
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="PERCENTAGE">Percentage</Select.Item>
              <Select.Item value="FIXED_VALUE">Fixed value</Select.Item>
            </Select.Content>
          </Select.Root>
        </Field>
        <Field
          name="discountValue"
          label="Discount value (optional)"
          error={errors.discountValue?.message}
        >
          <TextField.Root
            type="number"
            min="0"
            step="0.01"
            {...register("discountValue")}
          />
        </Field>
      </Grid>
    </section>
  );
}
