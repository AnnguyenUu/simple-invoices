export type InvoiceParty = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  addresses: unknown[];
};

export type InvoiceStatusFlag = {
  key: string;
  value: boolean;
};

export type InvoiceCustomField = {
  key: string;
  value: string;
};

// Verified against a real GET /invoice-service/1.0.0/invoices response.
export type Invoice = {
  invoiceId: string;
  invoiceNumber: string;
  invoiceReference?: string;
  referenceNo?: string;
  description?: string;
  status: InvoiceStatusFlag[];
  subStatus: InvoiceStatusFlag[];
  type: string;
  currency: string;
  currencySymbol: string;
  invoiceSubTotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  totalPaid: number;
  balanceAmount: number;
  invoiceGrossTotal: number;
  invoiceDate: string;
  dueDate: string;
  createdAt: string;
  createdBy: string;
  customer: InvoiceParty;
  merchant: InvoiceParty;
  customFields: InvoiceCustomField[];
};

// The envelope uses "paging", not "pagination", and has no totalPages —
// compute it from totalRecords/pageSize.
export type InvoiceListResponse = {
  data: Invoice[];
  paging: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
  };
};

// Only CREATED_DATE is confirmed against the real API (from the URL this
// was built from) — the rest are unverified guesses.
export type InvoiceSortField =
  | "CREATED_DATE"
  | "DUE_DATE"
  | "TOTAL_AMOUNT"
  | "STATUS"
  | "INVOICE_NUMBER";

export type InvoiceOrdering = "ASCENDING" | "DESCENDING";

export type InvoiceListParams = {
  sortBy: InvoiceSortField;
  ordering: InvoiceOrdering;
  pageNum: number;
  pageSize: number;
};
