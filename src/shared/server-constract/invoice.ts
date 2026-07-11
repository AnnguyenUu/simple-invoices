import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const numericStringIfPresent = (message: string) =>
  z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), message);

const dateField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required.`)
    .regex(DATE_REGEX, "Enter a valid date.")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Enter a valid date."
    );
    
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

    itemReference: z.string().min(1, "Item reference is required."),
    itemName: z.string().min(1, "Item name is required."),
    itemDescription: z.string().optional(),
    itemUOM: z.string().optional(),
    quantity: z
      .string()
      .min(1, "Quantity is required.")
      .refine((value) => Number(value) > 0, "Quantity must be greater than 0."),
    rate: z
      .string()
      .min(1, "Rate is required.")
      .refine((value) => Number(value) >= 0, "Rate can't be negative."),

    taxType: z.enum(["PERCENTAGE", "FIXED_VALUE"]).optional(),
    taxValue: numericStringIfPresent("Tax value must be a number."),
    discountType: z.enum(["PERCENTAGE", "FIXED_VALUE"]).optional(),
    discountValue: numericStringIfPresent("Discount value must be a number."),
  })
  .refine((data) => data.dueDate >= data.invoiceDate, {
    message: "Due date must be on or after the invoice date.",
    path: ["dueDate"],
  })
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
