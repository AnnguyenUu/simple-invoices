import type { InvoiceListParams } from "@/types/invoice";

export const invoiceQueryKeys = {
  list: (params: InvoiceListParams) => ["invoices", "list", params] as const,
};
