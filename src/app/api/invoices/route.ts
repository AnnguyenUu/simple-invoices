import type { NextRequest } from "next/server";
import { proxyToNeobank } from "@api/http/neobank-proxy";

// Query params (sortBy, ordering, pageNum, pageSize, ...) are forwarded
// as-is from the incoming request — see proxyToNeobank.
export async function GET(request: NextRequest) {
  return proxyToNeobank(request, "invoice-service/1.0.0/invoices", {
    token: "org",
  });
}
