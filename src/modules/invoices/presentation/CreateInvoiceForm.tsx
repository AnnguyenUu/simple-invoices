"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import * as Form from "@radix-ui/react-form";
import { CheckCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Box, Button, Callout, Card, Flex } from "@radix-ui/themes";
import { useCreateInvoiceForm } from "@/modules/invoices/core/handlers/useCreateInvoiceForm";
import { useDeviceContext } from "@/context/device";
import { InvoiceDetailsSection } from "./CreateInvoiceDetailsSection";
import { CustomerSection } from "./CreateInvoiceCustomerSection";

const ItemSection = dynamic(
  () => import("./CreateInvoiceItemSection").then((mod) => mod.ItemSection),
  { ssr: false },
);
const BillingAddressSection = dynamic(
  () =>
    import("./CreateInvoiceBillingAddressSection").then(
      (mod) => mod.BillingAddressSection,
    ),
  { ssr: false },
);
const BankAccountSection = dynamic(
  () =>
    import("./CreateInvoiceBankAccountSection").then(
      (mod) => mod.BankAccountSection,
    ),
  { ssr: false },
);
const TaxDiscountSection = dynamic(
  () =>
    import("./CreateInvoiceTaxDiscountSection").then(
      (mod) => mod.TaxDiscountSection,
    ),
  { ssr: false },
);

const DESKTOP_FOOTER_SPACER = "96px";

export function CreateInvoiceForm() {
  const { form, onSubmit, mutation } = useCreateInvoiceForm();
  const { isMobile } = useDeviceContext();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <Form.Root onSubmit={onSubmit}>
      <Card
        size="4"
        style={{
          width: "100%",
          paddingBottom: isMobile ? undefined : DESKTOP_FOOTER_SPACER,
        }}
      >
        <Flex direction="column" gap="5">
          <InvoiceDetailsSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
          <CustomerSection register={register} errors={errors} />
          <ItemSection register={register} errors={errors} />
          <BillingAddressSection register={register} errors={errors} />
          <BankAccountSection register={register} errors={errors} />
          <TaxDiscountSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

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

          {isMobile && (
            <Form.Submit asChild>
              <Button size="3" loading={mutation.isPending}>
                Create invoice
              </Button>
            </Form.Submit>
          )}
        </Flex>
      </Card>

      {!isMobile && (
        <Box
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: "var(--color-panel-solid)",
            borderTop: "1px solid var(--gray-a5)",
          }}
        >
          <Flex justify="between" align="center" px="6" py="4">
            <Button variant="soft" color="gray" size="3" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Form.Submit asChild>
              <Button size="3" loading={mutation.isPending}>
                Create invoice
              </Button>
            </Form.Submit>
          </Flex>
        </Box>
      )}
    </Form.Root>
  );
}
