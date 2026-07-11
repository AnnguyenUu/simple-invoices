import type { InvoiceSortField } from "@/types/invoice";

export const PAGE_SIZE = 10;

export const INVOICE_COLUMNS: { field: InvoiceSortField; label: string }[] = [
  { field: "INVOICE_NUMBER", label: "Invoice #" },
  { field: "STATUS", label: "Status" },
  { field: "TOTAL_AMOUNT", label: "Amount" },
  { field: "DUE_DATE", label: "Due date" },
  { field: "CREATED_DATE", label: "Created" },
];
