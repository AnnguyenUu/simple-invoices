import { describe, expect, it } from "vitest";
import { loginSchema } from "../login";

describe("loginSchema", () => {
  it("accepts a valid username/password", () => {
    const result = loginSchema.safeParse({
      username: "user@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty username", () => {
    const result = loginSchema.safeParse({
      username: "",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Email or phone number is required."
      );
    }
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      username: "user@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Password must be at least 8 characters."
      );
    }
  });

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
