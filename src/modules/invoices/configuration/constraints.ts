import type { InvoiceListParams } from "@/types/invoice";

export const invoiceQueryKeys = {
  all: ["invoices"] as const,
  list: (params: InvoiceListParams) => ["invoices", "list", params] as const,
};


export const FEATURE_NAME = "INVOICES"
export const INVOICE_URL = {
  REQUEST: "/invoices"
}