import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRequestBuilderModule } from "@/test/mock-request-builder";

const sendMock = vi.fn();
const cookieSetMock = vi.fn();
const redirectMock = vi.fn();

vi.mock("@api/http/request-builder", () =>
  mockRequestBuilderModule(sendMock)
);

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    set: cookieSetMock,
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const { login } = await import("../login");
const { SESSION_COOKIE } = await import("../../configuration/constraints");
const { ORG_COOKIE } = await import(
  "@modules/users-profile/configuration/constraints"
);

function formDataOf(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe("login server action", () => {
  beforeEach(() => {
    sendMock.mockReset();
    cookieSetMock.mockReset();
    redirectMock.mockReset();
  });

  it("returns an error when username or password is missing", async () => {
    const result = await login({}, formDataOf({ username: "user" }));

    expect(result).toEqual({
      error: "Email/phone number and password are required.",
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns an invalid-credentials error when the token request fails", async () => {
    sendMock.mockRejectedValueOnce(new Error("invalid_grant"));

    const result = await login(
      {},
      formDataOf({ username: "user@example.com", password: "wrong-pass" })
    );

    expect(result).toEqual({
      error: "Invalid email/phone number or password.",
    });
    expect(cookieSetMock).not.toHaveBeenCalled();
  });

  it("sets the session cookie and redirects to / on success", async () => {
    sendMock
      .mockResolvedValueOnce({
        access_token: "access-token",
        expires_in: 3600,
        token_type: "Bearer",
      })
      .mockResolvedValueOnce({
        data: { memberships: [{ token: "org-token" }] },
      });

    await login(
      {},
      formDataOf({ username: "user@example.com", password: "password123" })
    );

    expect(cookieSetMock).toHaveBeenCalledWith(
      SESSION_COOKIE,
      "access-token",
      expect.objectContaining({ httpOnly: true, maxAge: 3600 })
    );
    expect(cookieSetMock).toHaveBeenCalledWith(
      ORG_COOKIE,
      "org-token",
      expect.objectContaining({ httpOnly: true, maxAge: 3600 })
    );
    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("still redirects when fetching the org token fails", async () => {
    sendMock
      .mockResolvedValueOnce({
        access_token: "access-token",
        expires_in: 3600,
        token_type: "Bearer",
      })
      .mockRejectedValueOnce(new Error("org lookup failed"));

    await login(
      {},
      formDataOf({ username: "user@example.com", password: "password123" })
    );

    expect(cookieSetMock).toHaveBeenCalledTimes(1);
    expect(cookieSetMock).toHaveBeenCalledWith(
      SESSION_COOKIE,
      "access-token",
      expect.anything()
    );
    expect(redirectMock).toHaveBeenCalledWith("/");
  });
});
