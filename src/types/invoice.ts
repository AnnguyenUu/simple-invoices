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

// Observed values so far (Due, Overdue, Paid) — same set used for the
// status badge colors in presentation/format.ts.
export type InvoiceStatus = "Due" | "Overdue" | "Paid";

export type InvoiceListParams = {
  sortBy: InvoiceSortField;
  ordering: InvoiceOrdering;
  pageNum: number;
  pageSize: number;
  // Optional filters — omitted from the request entirely when unset
  // (see fetchInvoices' compact()) rather than sent as "".
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  status?: InvoiceStatus;
  keyword?: string;
};

// Request contract for POST /invoice-service/1.0.0/invoices, from the
// sample in src/hooks/create_invice.md — trimmed to the fields the create
// form actually collects. `documents` (needs a file-upload flow) and the
// free-form `customFields` (arbitrary key/value, no fixed schema) are
// deliberately left out; everything else in the sample is covered.
export type CreateInvoiceBankAccount = {
  bankId?: string;
  sortCode?: string;
  accountNumber?: string;
  accountName?: string;
};

export type CreateInvoiceAddress = {
  premise?: string;
  countryCode?: string;
  postcode?: string;
  county?: string;
  city?: string;
  addressType: "BILLING";
};

export type CreateInvoiceCustomer = {
  firstName: string;
  lastName: string;
  contact: {
    email: string;
    mobileNumber: string;
  };
  addresses?: CreateInvoiceAddress[];
};

// One "tax" (ADD) and/or one "discount" (DEDUCT) entry — the sample shows
// exactly this pair; an open-ended extensions list isn't exposed in the UI.
export type CreateInvoiceExtension = {
  addDeduct: "ADD" | "DEDUCT";
  type: "PERCENTAGE" | "FIXED_VALUE";
  value: number;
  name: "tax" | "discount";
};

export type CreateInvoiceItem = {
  // Confirmed required by the live API (400s with "itemReference must not
  // be blank" otherwise) — not obvious from the sample alone.
  itemReference: string;
  itemName: string;
  description?: string;
  quantity: number;
  rate: number;
  itemUOM?: string;
};

export type CreateInvoiceRequest = {
  bankAccount?: CreateInvoiceBankAccount;
  invoiceNumber: string;
  invoiceReference?: string;
  currency: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  description?: string;
  extensions?: CreateInvoiceExtension[];
  customer: CreateInvoiceCustomer;
  // Spec requires exactly one line item per invoice.
  items: [CreateInvoiceItem];
};

// The API accepts a batch (`invoices: [...]`) — this app only ever sends
// a single invoice per submission.
export type CreateInvoicesPayload = {
  invoices: [CreateInvoiceRequest];
};
