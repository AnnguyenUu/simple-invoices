import { RequestBuilder } from "@/api/http/request-builder";
import type {
  CreateInvoiceRequest,
  InvoiceListParams,
  InvoiceListResponse,
} from "@/types/invoice";

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
    .withUrl("/invoices")
    .withParams(compact(params))
    .send();
}

export function createInvoice(invoice: CreateInvoiceRequest): Promise<unknown> {
  return new RequestBuilder<unknown>()
    .withRedirectOn401(false)
    .withMethod("post")
    .withUrl("/invoices")
    .withData({ invoices: [invoice] })
    .send();
}
