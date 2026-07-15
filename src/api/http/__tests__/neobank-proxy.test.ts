import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const sendMock = vi.fn();
const withMethodSpy = vi.fn();
const withUrlSpy = vi.fn();
const withParamsSpy = vi.fn();
const withHeadersSpy = vi.fn();
const withDataSpy = vi.fn();
const withRedirectOn401Spy = vi.fn();

vi.mock("@api/http/request-builder", () => {
  class RequestBuilder {
    withMethod(...args: unknown[]) {
      withMethodSpy(...args);
      return this;
    }
    withUrl(...args: unknown[]) {
      withUrlSpy(...args);
      return this;
    }
    withParams(...args: unknown[]) {
      withParamsSpy(...args);
      return this;
    }
    withHeaders(...args: unknown[]) {
      withHeadersSpy(...args);
      return this;
    }
    withData(...args: unknown[]) {
      withDataSpy(...args);
      return this;
    }
    withRedirectOn401(...args: unknown[]) {
      withRedirectOn401Spy(...args);
      return this;
    }
    send() {
      return sendMock();
    }
  }
  return { RequestBuilder };
});

const cookiesMock = vi.fn();
vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

const { proxyToNeobank } = await import("../neobank-proxy");

function makeCookieJar(entries: Record<string, string>) {
  return {
    get: (name: string) =>
      name in entries ? { value: entries[name] } : undefined,
  };
}

function makeRequest(url = "http://localhost/api/invoices") {
  return { nextUrl: new URL(url) } as unknown as NextRequest;
}

describe("proxyToNeobank", () => {
  beforeEach(() => {
    sendMock.mockReset();
    withMethodSpy.mockReset();
    withUrlSpy.mockReset();
    withParamsSpy.mockReset();
    withHeadersSpy.mockReset();
    withDataSpy.mockReset();
    withRedirectOn401Spy.mockReset();
    cookiesMock.mockReset();
    process.env.NEOBANK_API_BASE_URL = "https://neobank.internal";
  });

  it("returns 401 when there is no session cookie", async () => {
    cookiesMock.mockResolvedValueOnce(makeCookieJar({}));

    const response = await proxyToNeobank(makeRequest(), "invoice-service/1.0.0/invoices");

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 401 when token='org' is requested but there is no org cookie", async () => {
    cookiesMock.mockResolvedValueOnce(makeCookieJar({ _uctx: "session-token" }));

    const response = await proxyToNeobank(
      makeRequest(),
      "invoice-service/1.0.0/invoices",
      { token: "org" }
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("builds the upstream request with bearer + org headers and forwards query params", async () => {
    cookiesMock.mockResolvedValueOnce(
      makeCookieJar({ _uctx: "session-token", _uctx_ort: "org-token" })
    );
    sendMock.mockResolvedValueOnce({ data: [] });

    const response = await proxyToNeobank(
      makeRequest("http://localhost/api/invoices?pageNum=1&pageSize=20"),
      "invoice-service/1.0.0/invoices",
      { token: "org", headers: { "Operation-Mode": "SYNC" } }
    );

    expect(withUrlSpy).toHaveBeenCalledWith(
      "https://neobank.internal/invoice-service/1.0.0/invoices"
    );
    expect(withHeadersSpy).toHaveBeenCalledWith({
      Authorization: "Bearer session-token",
      "Content-Type": "application/json",
      "Operation-Mode": "SYNC",
      "org-token": "org-token",
    });
    expect(withParamsSpy).toHaveBeenCalledWith({ pageNum: "1", pageSize: "20" });
    expect(withRedirectOn401Spy).toHaveBeenCalledWith(false);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: [] });
  });

  it("runs onSuccess to transform the upstream body before responding", async () => {
    cookiesMock.mockResolvedValueOnce(makeCookieJar({ _uctx: "session-token" }));
    sendMock.mockResolvedValueOnce({ data: { memberships: [{ token: "org-1" }] } });

    const response = await proxyToNeobank(makeRequest(), "membership-service/1.0.0/users/me", {
      onSuccess: async ({ data }: { data: { memberships: { token: string }[] } }) =>
        ({ firstMembership: data.memberships[0].token }),
    });

    expect(await response.json()).toEqual({ firstMembership: "org-1" });
  });

  it("passes through the upstream status and body on an axios error response", async () => {
    cookiesMock.mockResolvedValueOnce(makeCookieJar({ _uctx: "session-token" }));
    const error = Object.assign(new Error("bad request"), {
      isAxiosError: true,
      response: { status: 422, data: { error: "Validation failed" } },
    });
    sendMock.mockRejectedValueOnce(error);

    const response = await proxyToNeobank(makeRequest(), "invoice-service/1.0.0/invoices");

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ error: "Validation failed" });
  });

  it("returns a 502 when the upstream request fails without a response", async () => {
    cookiesMock.mockResolvedValueOnce(makeCookieJar({ _uctx: "session-token" }));
    sendMock.mockRejectedValueOnce(new Error("network down"));

    const response = await proxyToNeobank(makeRequest(), "invoice-service/1.0.0/invoices");

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Upstream request failed" });
  });
});
