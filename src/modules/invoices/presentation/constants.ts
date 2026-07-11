import type { InvoiceSortField, InvoiceStatus } from "@/types/invoice";

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const STATUS_FILTER_OPTIONS: { value: InvoiceStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "Due", label: "Due" },
  { value: "Overdue", label: "Overdue" },
  { value: "Paid", label: "Paid" },
];

export const CURRENCY_OPTIONS = ["GBP", "USD", "EUR", "LKR", "SGD"];

export const INVOICE_COLUMNS: { field: InvoiceSortField; label: string }[] = [
  { field: "INVOICE_NUMBER", label: "Invoice #" },
  { field: "STATUS", label: "Status" },
  { field: "TOTAL_AMOUNT", label: "Amount" },
  { field: "DUE_DATE", label: "Due date" },
  { field: "CREATED_DATE", label: "Created" },
];
