import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
const withMethodSpy = vi.fn();
const withUrlSpy = vi.fn();
const withHeadersSpy = vi.fn();
const withRedirectOn401Spy = vi.fn();

vi.mock("@/api/http/request-builder", () => {
  class RequestBuilder {
    withMethod(...args: unknown[]) {
      withMethodSpy(...args);
      return this;
    }
    withUrl(...args: unknown[]) {
      withUrlSpy(...args);
      return this;
    }
    withHeaders(...args: unknown[]) {
      withHeadersSpy(...args);
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

const headersMock = vi.fn();
const cookiesMock = vi.fn();

vi.mock("next/headers", () => ({
  headers: () => headersMock(),
  cookies: () => cookiesMock(),
}));

const { fetchUserProfileServer } = await import("../server");

describe("fetchUserProfileServer", () => {
  beforeEach(() => {
    sendMock.mockReset();
    withMethodSpy.mockReset();
    withUrlSpy.mockReset();
    withHeadersSpy.mockReset();
    withRedirectOn401Spy.mockReset();
    headersMock.mockReset();
    cookiesMock.mockReset();
  });

  it("builds an absolute same-origin URL from request headers and forwards the cookie jar", async () => {
    headersMock.mockResolvedValueOnce(
      new Map([
        ["x-forwarded-proto", "https"],
        ["host", "app.example.com"],
      ])
    );
    cookiesMock.mockResolvedValueOnce({
      toString: () => "_uctx=token123",
    });
    sendMock.mockResolvedValueOnce({ userId: "u1" });

    const result = await fetchUserProfileServer();

    expect(withMethodSpy).toHaveBeenCalledWith("get");
    expect(withUrlSpy).toHaveBeenCalledWith(
      "https://app.example.com/api/users/me"
    );
    expect(withHeadersSpy).toHaveBeenCalledWith({ Cookie: "_uctx=token123" });
    expect(withRedirectOn401Spy).toHaveBeenCalledWith(false);
    expect(result).toEqual({ userId: "u1" });
  });

  it("defaults to http when x-forwarded-proto is absent", async () => {
    headersMock.mockResolvedValueOnce(new Map([["host", "localhost:3000"]]));
    cookiesMock.mockResolvedValueOnce({ toString: () => "" });
    sendMock.mockResolvedValueOnce({});

    await fetchUserProfileServer();

    expect(withUrlSpy).toHaveBeenCalledWith("http://localhost:3000/api/users/me");
  });
});
