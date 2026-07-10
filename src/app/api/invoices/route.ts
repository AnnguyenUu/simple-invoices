import type { NextRequest } from "next/server";
import { proxyToNeobank } from "@api/http/neobank-proxy";
import { NEOBANK_SERVICES } from "@/context/request-url/neobank-services";

// Query params (sortBy, ordering, pageNum, pageSize, ...) are forwarded
// as-is from the incoming request — see proxyToNeobank.
export async function GET(request: NextRequest) {
  return proxyToNeobank(request, `${NEOBANK_SERVICES.invoice}/invoices`, {
    token: "org",
  });
}
