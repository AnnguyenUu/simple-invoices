import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
const withMethodSpy = vi.fn();
const withUrlSpy = vi.fn();

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
    send() {
      return sendMock();
    }
  }
  return { RequestBuilder };
});

const { fetchUserProfile } = await import("../index");

describe("fetchUserProfile", () => {
  beforeEach(() => {
    sendMock.mockReset();
    withMethodSpy.mockReset();
    withUrlSpy.mockReset();
  });

  it("requests the current user's profile from /users/me", async () => {
    sendMock.mockResolvedValueOnce({ userId: "u1" });

    const result = await fetchUserProfile();

    expect(withMethodSpy).toHaveBeenCalledWith("get");
    expect(withUrlSpy).toHaveBeenCalledWith("/users/me");
    expect(result).toEqual({ userId: "u1" });
  });
});
