import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const numericStringIfPresent = (message: string) =>
  z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), message);

// Format-checks a required date string: must match YYYY-MM-DD and be a
// real calendar date (the regex alone would still accept e.g. 2026-13-45).
const dateField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required.`)
    .regex(DATE_REGEX, "Enter a valid date.")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Enter a valid date."
    );

// Validation for the create-invoice form. Field-by-field this mirrors
// CreateInvoiceForm's six sections; three cross-field .refine()s below
// encode constraints the live API enforces but the sample payload in
// src/hooks/create_invice.md doesn't make obvious (dueDate ordering,
// bankId, and tax/discount value bounds).
export const createInvoiceSchema = z
  .object({
    invoiceNumber: z.string().min(1, "Invoice number is required."),
    invoiceReference: z.string().optional(),
    currency: z
      .string()
      .min(1, "Currency is required.")
      .regex(/^[A-Z]{3}$/, "Currency must be a 3-letter code."),
    invoiceDate: dateField("Invoice date"),
    dueDate: dateField("Due date"),
    description: z.string().optional(),

    // Bank account — every field optional; the section as a whole is
    // omitted from the payload unless at least one is filled in (see
    // useCreateInvoiceForm.ts). bankId is conditionally required — see
    // the cross-field refine below.
    bankAccountName: z.string().optional(),
    bankAccountNumber: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[A-Za-z0-9]{4,34}$/.test(value),
        "Enter a valid account number."
      ),
    bankSortCode: z.string().optional(),
    bankId: z.string().optional(),

    customerFirstName: z.string().min(1, "First name is required."),
    customerLastName: z.string().min(1, "Last name is required."),
    customerEmail: z
      .string()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    customerMobileNumber: z
      .string()
      .min(1, "Mobile number is required.")
      .regex(
        /^\+?[0-9]{7,15}$/,
        "Enter a valid mobile number (7-15 digits, optional leading +)."
      ),

    // Billing address — same all-optional-section pattern as bank account.
    addressPremise: z.string().optional(),
    addressCity: z.string().optional(),
    addressCounty: z.string().optional(),
    addressPostcode: z.string().optional(),
    addressCountryCode: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[A-Za-z]{2}$/.test(value),
        "Country code must be a 2-letter code (e.g. VN)."
      ),

    // Confirmed required by the live API (400s with "itemReference must
    // not be blank" otherwise) — not obvious from the sample alone.
    itemReference: z.string().min(1, "Item reference is required."),
    itemName: z.string().min(1, "Item name is required."),
    itemDescription: z.string().optional(),
    itemUOM: z.string().optional(),
    // Kept as strings (matching what a text input actually holds) rather
    // than z.coerce.number() — mixing a coerced field into a react-hook-form
    // + zodResolver form requires threading separate input/output generics
    // through useForm, which isn't worth it for two fields. Converted to
    // real numbers in useCreateInvoiceForm's onSubmit instead.
    quantity: z
      .string()
      .min(1, "Quantity is required.")
      .refine((value) => Number(value) > 0, "Quantity must be greater than 0."),
    rate: z
      .string()
      .min(1, "Rate is required.")
      .refine((value) => Number(value) >= 0, "Rate can't be negative."),

    // Tax/discount — each an optional ADD/DEDUCT extension entry, sent
    // only when its value is filled in (see useCreateInvoiceForm.ts).
    taxType: z.enum(["PERCENTAGE", "FIXED_VALUE"]).optional(),
    taxValue: numericStringIfPresent("Tax value must be a number."),
    discountType: z.enum(["PERCENTAGE", "FIXED_VALUE"]).optional(),
    discountValue: numericStringIfPresent("Discount value must be a number."),
  })
  .refine((data) => data.dueDate >= data.invoiceDate, {
    message: "Due date must be on or after the invoice date.",
    path: ["dueDate"],
  })
  // Confirmed by the live API: whenever bankAccount is sent at all, bankId
  // must be non-empty — the sample payload's `"bankId": ""` is misleading.
  .refine(
    (data) => {
      const anyBankField =
        data.bankAccountName ||
        data.bankAccountNumber ||
        data.bankSortCode ||
        data.bankId;
      return !anyBankField || !!data.bankId;
    },
    {
      message: "Bank ID is required when providing bank account details.",
      path: ["bankId"],
    }
  )
  .refine(
    (data) => {
      if (!data.taxValue) return true;
      const value = Number(data.taxValue);
      if (value < 0) return false;
      return data.taxType !== "PERCENTAGE" || value <= 100;
    },
    {
      message: "Tax must be 0-100 for a percentage, or 0 or more for a fixed value.",
      path: ["taxValue"],
    }
  )
  .refine(
    (data) => {
      if (!data.discountValue) return true;
      const value = Number(data.discountValue);
      if (value < 0) return false;
      return data.discountType !== "PERCENTAGE" || value <= 100;
    },
    {
      message:
        "Discount must be 0-100 for a percentage, or 0 or more for a fixed value.",
      path: ["discountValue"],
    }
  );

export type CreateInvoiceValues = z.infer<typeof createInvoiceSchema>;
