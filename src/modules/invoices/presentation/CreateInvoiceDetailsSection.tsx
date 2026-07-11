import { Grid, Heading, Select, TextArea, TextField } from "@radix-ui/themes";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { CreateInvoiceValues } from "@/shared/server-constract/invoice";
import { Field } from "./CreateInvoiceField";
import { CURRENCY_OPTIONS } from "./constants";

export function InvoiceDetailsSection({
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
        Invoice details
      </Heading>
      <Grid columns={{ initial: "1", sm: "2" }} gap="3">
        <Field
          name="invoiceNumber"
          label="Invoice number"
          error={errors.invoiceNumber?.message}
        >
          <TextField.Root
            placeholder="INV-1001"
            {...register("invoiceNumber")}
          />
        </Field>
        <Field
          name="invoiceReference"
          label="Reference (optional)"
          error={errors.invoiceReference?.message}
        >
          <TextField.Root
            placeholder="#123456"
            {...register("invoiceReference")}
          />
        </Field>
        <Field
          name="currency"
          label="Currency"
          error={errors.currency?.message}
          asControl={false}
        >
          <Select.Root
            value={watch("currency")}
            onValueChange={(value) =>
              setValue("currency", value, { shouldValidate: true })
            }
          >
            <Select.Trigger />
            <Select.Content>
              {CURRENCY_OPTIONS.map((currency) => (
                <Select.Item key={currency} value={currency}>
                  {currency}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Field>
        <Field
          name="invoiceDate"
          label="Invoice date"
          error={errors.invoiceDate?.message}
        >
          <TextField.Root type="date" {...register("invoiceDate")} />
        </Field>
        <Field name="dueDate" label="Due date" error={errors.dueDate?.message}>
          <TextField.Root type="date" {...register("dueDate")} />
        </Field>
      </Grid>
      <Field
        name="description"
        label="Description (optional)"
        error={errors.description?.message}
      >
        <TextArea
          placeholder="What's this invoice for?"
          {...register("description")}
        />
      </Field>
    </section>
  );
}
