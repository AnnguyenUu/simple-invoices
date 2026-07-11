import type { InvoiceListParams } from "@/types/invoice";

// Centralized React Query keys for the invoices domain — components never
// hand-write a query key. `all` is a shared prefix so
// invalidateQueries({ queryKey: invoiceQueryKeys.all }) (see
// core/handlers/create.ts) invalidates every list page/filter combination.
export const invoiceQueryKeys = {
  all: ["invoices"] as const,
  list: (params: InvoiceListParams) => ["invoices", "list", params] as const,
};
