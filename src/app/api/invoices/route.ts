import type { NextRequest } from "next/server";
import { proxyToNeobank } from "@api/http/neobank-proxy";
import { NEOBANK_SERVICES } from "@/context/request-url/neobank-services";

// BFF route for invoice-service. Both handlers require the org token
// (token: "org") since invoices are scoped to the user's organisation.

// Query params (sortBy, ordering, pageNum, pageSize, fromDate, toDate,
// status, keyword, ...) are forwarded as-is from the incoming request —
// see proxyToNeobank.
export async function GET(request: NextRequest) {
  return proxyToNeobank(request, `${NEOBANK_SERVICES.invoice}/invoices`, {
    token: "org",
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  return proxyToNeobank(request, `${NEOBANK_SERVICES.invoice}/invoices`, {
    method: "post",
    token: "org",
    // Required by invoice-service for a synchronous create (the request
    // gets a final status back immediately instead of needing a webhook/
    // poll) — see src/hooks/create_invice.md's sample curl.
    headers: { "Operation-Mode": "SYNC" },
    data,
  });
}
