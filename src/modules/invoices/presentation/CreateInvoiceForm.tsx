"use client";

import type { ReactNode } from "react";
import * as Form from "@radix-ui/react-form";
import { CheckCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Button,
  Callout,
  Card,
  Flex,
  Grid,
  Heading,
  Select,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useCreateInvoiceForm } from "@/modules/invoices/core/handlers/useCreateInvoiceForm";
import type { CreateInvoiceValues } from "@/shared/server-constract/invoice";
import { CURRENCY_OPTIONS } from "./constants";

function Field({
  name,
  label,
  error,
  asControl = true,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  // Select doesn't render a real form input Form.Control can merge props
  // onto, so it's placed outside the asChild wrapper — see the currency
  // field below.
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

export function CreateInvoiceForm() {
  const { form, onSubmit, mutation } = useCreateInvoiceForm();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <Card size="4">
      <Form.Root onSubmit={onSubmit}>
        <Flex direction="column" gap="5">
          <section>
            <Heading as="h2" size="3" mb="3">
              Invoice details
            </Heading>
            <Grid columns="2" gap="3">
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
              <Field
                name="dueDate"
                label="Due date"
                error={errors.dueDate?.message}
              >
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

          <section>
            <Heading as="h2" size="3" mb="3">
              Customer
            </Heading>
            <Grid columns="2" gap="3">
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

          <section>
            <Heading as="h2" size="3" mb="3">
              Item
            </Heading>
            <Text as="p" size="1" color="gray" mb="3">
              Each invoice supports a single line item.
            </Text>
            <Grid columns="2" gap="3">
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
              <Field
                name="quantity"
                label="Quantity"
                error={errors.quantity?.message}
              >
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

          <section>
            <Heading as="h2" size="3" mb="3">
              Billing address
            </Heading>
            <Text as="p" size="1" color="gray" mb="3">
              Optional — leave blank to omit.
            </Text>
            <Grid columns="2" gap="3">
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
                <TextField.Root placeholder="VN" {...register("addressCountryCode")} />
              </Field>
            </Grid>
          </section>

          <section>
            <Heading as="h2" size="3" mb="3">
              Bank account
            </Heading>
            <Text as="p" size="1" color="gray" mb="3">
              Optional — leave blank to omit.
            </Text>
            <Grid columns="2" gap="3">
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
                <TextField.Root placeholder="09-01-01" {...register("bankSortCode")} />
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

          <section>
            <Heading as="h2" size="3" mb="3">
              Tax &amp; discount
            </Heading>
            <Text as="p" size="1" color="gray" mb="3">
              Optional — leave a value blank to omit that adjustment.
            </Text>
            <Grid columns="2" gap="3">
              <Field
                name="taxType"
                label="Tax type"
                error={errors.taxType?.message}
                asControl={false}
              >
                <Select.Root
                  value={watch("taxType")}
                  onValueChange={(value) =>
                    setValue(
                      "taxType",
                      value as CreateInvoiceValues["taxType"],
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

          {mutation.isError ? (
            <Callout.Root color="red">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>
                Failed to create the invoice. Please try again.
              </Callout.Text>
            </Callout.Root>
          ) : null}

          {mutation.isSuccess ? (
            <Callout.Root color="green">
              <Callout.Icon>
                <CheckCircledIcon />
              </Callout.Icon>
              <Callout.Text>Invoice created successfully.</Callout.Text>
            </Callout.Root>
          ) : null}

          <Form.Submit asChild>
            <Button size="3" loading={mutation.isPending}>
              Create invoice
            </Button>
          </Form.Submit>
        </Flex>
      </Form.Root>
    </Card>
  );
}
