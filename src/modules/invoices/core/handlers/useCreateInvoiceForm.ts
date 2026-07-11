import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createInvoiceSchema,
  type CreateInvoiceValues,
} from "@/shared/server-constract/invoice";
import type {
  CreateInvoiceExtension,
  CreateInvoiceRequest,
} from "@/types/invoice";
import { useCreateInvoice } from "./create";

export function useCreateInvoiceForm() {
  const form = useForm<CreateInvoiceValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      currency: "GBP",
      quantity: "1",
      rate: "0",
      taxType: "PERCENTAGE",
      discountType: "PERCENTAGE",
    },
  });

  const mutation = useCreateInvoice();

  const onSubmit = form.handleSubmit((values) => {
    const bankAccount =
      values.bankAccountName ||
      values.bankAccountNumber ||
      values.bankSortCode ||
      values.bankId
        ? {
            accountName: values.bankAccountName || undefined,
            accountNumber: values.bankAccountNumber || undefined,
            sortCode: values.bankSortCode || undefined,
            bankId: values.bankId || undefined,
          }
        : undefined;

    const addresses =
      values.addressPremise ||
      values.addressCity ||
      values.addressCounty ||
      values.addressPostcode ||
      values.addressCountryCode
        ? [
            {
              premise: values.addressPremise || undefined,
              city: values.addressCity || undefined,
              county: values.addressCounty || undefined,
              postcode: values.addressPostcode || undefined,
              countryCode: values.addressCountryCode || undefined,
              addressType: "BILLING" as const,
            },
          ]
        : undefined;

    const extensions: CreateInvoiceExtension[] = [];
    if (values.taxValue) {
      extensions.push({
        addDeduct: "ADD",
        type: values.taxType ?? "PERCENTAGE",
        value: Number(values.taxValue),
        name: "tax",
      });
    }
    if (values.discountValue) {
      extensions.push({
        addDeduct: "DEDUCT",
        type: values.discountType ?? "PERCENTAGE",
        value: Number(values.discountValue),
        name: "discount",
      });
    }

    const payload: CreateInvoiceRequest = {
      bankAccount,
      invoiceNumber: values.invoiceNumber,
      invoiceReference: values.invoiceReference || undefined,
      currency: values.currency,
      invoiceDate: values.invoiceDate,
      dueDate: values.dueDate,
      description: values.description || undefined,
      extensions: extensions.length > 0 ? extensions : undefined,
      customer: {
        firstName: values.customerFirstName,
        lastName: values.customerLastName,
        contact: {
          email: values.customerEmail,
          mobileNumber: values.customerMobileNumber,
        },
        addresses,
      },
      items: [
        {
          itemReference: values.itemReference,
          itemName: values.itemName,
          description: values.itemDescription || undefined,
          quantity: Number(values.quantity),
          rate: Number(values.rate),
          itemUOM: values.itemUOM || undefined,
        },
      ],
    };

    mutation.mutate(payload, {
      onSuccess: () => form.reset(),
    });
  });

  return { form, onSubmit, mutation };
}
