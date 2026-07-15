import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const proxyToNeobankMock = vi.fn();

vi.mock("@api/http/neobank-proxy", () => ({
  proxyToNeobank: (...args: unknown[]) => proxyToNeobankMock(...args),
}));

const { GET, POST } = await import("../route");

function makeRequest(body?: unknown) {
  return {
    nextUrl: new URL("http://localhost/api/invoices"),
    json: async () => body,
  } as unknown as NextRequest;
}

describe("GET /api/invoices", () => {
  beforeEach(() => proxyToNeobankMock.mockReset());

  it("proxies to the invoice-service invoices endpoint using the org token", async () => {
    proxyToNeobankMock.mockResolvedValueOnce(new Response(null));

    await GET(makeRequest());

    expect(proxyToNeobankMock).toHaveBeenCalledWith(
      expect.anything(),
      "invoice-service/1.0.0/invoices",
      { token: "org" }
    );
  });
});

describe("POST /api/invoices", () => {
  beforeEach(() => proxyToNeobankMock.mockReset());

  it("forwards the parsed body and SYNC operation mode with the org token", async () => {
    proxyToNeobankMock.mockResolvedValueOnce(new Response(null));
    const body = { invoices: [{ invoiceNumber: "INV-1" }] };

    await POST(makeRequest(body));

    expect(proxyToNeobankMock).toHaveBeenCalledWith(
      expect.anything(),
      "invoice-service/1.0.0/invoices",
      {
        method: "post",
        token: "org",
        headers: { "Operation-Mode": "SYNC" },
        data: body,
      }
    );
  });
});
