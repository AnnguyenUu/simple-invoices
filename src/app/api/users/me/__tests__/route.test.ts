import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const proxyToNeobankMock = vi.fn();

vi.mock("@api/http/neobank-proxy", () => ({
  proxyToNeobank: (...args: unknown[]) => proxyToNeobankMock(...args),
}));

const cookieSetMock = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({ set: cookieSetMock }),
}));

const { GET } = await import("../route");

function makeRequest() {
  return {
    nextUrl: new URL("http://localhost/api/users/me"),
  } as unknown as NextRequest;
}

describe("GET /api/users/me", () => {
  beforeEach(() => {
    proxyToNeobankMock.mockReset();
    cookieSetMock.mockReset();
  });

  it("proxies to the membership-service users/me endpoint with the session token", async () => {
    proxyToNeobankMock.mockResolvedValueOnce(new Response(null));

    await GET(makeRequest());

    expect(proxyToNeobankMock).toHaveBeenCalledWith(
      expect.anything(),
      "membership-service/1.0.0/users/me",
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });

  it("onSuccess sets the org cookie from the first membership and returns the user", async () => {
    proxyToNeobankMock.mockResolvedValueOnce(new Response(null));

    await GET(makeRequest());

    const { onSuccess } = proxyToNeobankMock.mock.calls[0][2];
    const user = {
      memberships: [{ token: "org-token-1" }, { token: "org-token-2" }],
    };

    const result = await onSuccess({ data: user });

    expect(cookieSetMock).toHaveBeenCalledWith(
      "_uctx_ort",
      "org-token-1",
      expect.objectContaining({ httpOnly: true })
    );
    expect(result).toBe(user);
  });

  it("onSuccess skips setting the cookie when there are no memberships", async () => {
    proxyToNeobankMock.mockResolvedValueOnce(new Response(null));

    await GET(makeRequest());

    const { onSuccess } = proxyToNeobankMock.mock.calls[0][2];
    const user = { memberships: [] };

    const result = await onSuccess({ data: user });

    expect(cookieSetMock).not.toHaveBeenCalled();
    expect(result).toBe(user);
  });
});
