import { AxiosResponseListType } from "./responseType";

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

export type InvoiceListResponse = AxiosResponseListType<Invoice>

export type InvoiceSortField =
  | "CREATED_DATE"
  | "DUE_DATE"
  | "TOTAL_AMOUNT"
  | "STATUS"
  | "INVOICE_NUMBER";

export type InvoiceOrdering = "ASCENDING" | "DESCENDING";

export type InvoiceStatus = "Due" | "Overdue" | "Paid";

export type InvoiceListParams = {
  sortBy: InvoiceSortField;
  ordering: InvoiceOrdering;
  pageNum: number;
  pageSize: number;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  status?: InvoiceStatus;
  keyword?: string;
};

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

export type CreateInvoiceExtension = {
  addDeduct: "ADD" | "DEDUCT";
  type: "PERCENTAGE" | "FIXED_VALUE";
  value: number;
  name: "tax" | "discount";
};

export type CreateInvoiceItem = {
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
  items: [CreateInvoiceItem];
};

export type CreateInvoicesPayload = {
  invoices: [CreateInvoiceRequest];
};
