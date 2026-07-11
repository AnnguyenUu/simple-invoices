import { RequestBuilder } from "@/api/http/request-builder";
import type { InvoiceListParams, InvoiceListResponse } from "@/types/invoice";

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
    .withParams(params)
    .send();
}
