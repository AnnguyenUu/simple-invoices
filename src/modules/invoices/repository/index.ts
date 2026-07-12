import { RequestBuilder } from "@/api/http/request-builder";
import type {
  CreateInvoiceRequest,
  InvoiceListParams,
  InvoiceListResponse,
} from "@/types/invoice";
import { INVOICE_URL } from "../configuration/constraints";

function compact(params: InvoiceListParams): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  );
}

export function fetchInvoices(
  params: InvoiceListParams
): Promise<InvoiceListResponse> {
  return new RequestBuilder<InvoiceListResponse>()
    .withRedirectOn401(false)
    .withMethod("get")
    .withUrl(INVOICE_URL.REQUEST)
    .withParams(compact(params))
    .send();
}

export function createInvoice(invoice: CreateInvoiceRequest): Promise<unknown> {
  return new RequestBuilder<unknown>()
    .withRedirectOn401(false)
    .withMethod("post")
    .withUrl(INVOICE_URL.REQUEST)
    .withData({ invoices: [invoice] })
    .send();
}
