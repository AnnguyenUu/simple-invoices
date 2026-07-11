import { RequestBuilder } from "@/api/http/request-builder";
import type {
  CreateInvoiceRequest,
  InvoiceListParams,
  InvoiceListResponse,
} from "@/types/invoice";

// Drop unset optional filters (fromDate/toDate/status/keyword) instead of
// sending them as "" — an empty string is a value the API would filter on,
// not "no filter".
function compact(params: InvoiceListParams): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  );
}

// Both functions call this app's own /api/invoices BFF route (never the
// upstream invoice-service directly) via RequestBuilder — see
// src/api/http/neobank-proxy.ts for what actually forwards the request.

export function fetchInvoices(
  params: InvoiceListParams
): Promise<InvoiceListResponse> {
  return new RequestBuilder<InvoiceListResponse>()
    // A 401 here can mean the org cookie hasn't landed yet rather than an
    // invalid session (see login.ts) — hard-redirecting the whole browser
    // to /login on every such case is the wrong failure mode; let it
    // surface as a normal query error instead (InvoicesTable already
    // renders a Callout for isError).
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
