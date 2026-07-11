import type { NextRequest } from "next/server";
import { proxyToNeobank } from "@api/http/neobank-proxy";
import { NEOBANK_SERVICES } from "@/context/request-url/neobank-services";

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
    headers: { "Operation-Mode": "SYNC" },
    data,
  });
}
