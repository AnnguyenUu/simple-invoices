import type { InvoiceListParams } from "@/types/invoice";

export const invoiceQueryKeys = {
  all: ["invoices"] as const,
  list: (params: InvoiceListParams) => ["invoices", "list", params] as const,
};
