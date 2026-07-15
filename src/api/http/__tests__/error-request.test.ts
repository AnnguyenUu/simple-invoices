import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const { ErrorRequest } = await import("../error-request");

class TestErrorRequest extends ErrorRequest {
  trigger(error: unknown, redirectOn401?: boolean) {
    this.handleError(error, redirectOn401);
  }
}

function axiosError(status: number) {
  const error = new Error("request failed") as Error & {
    isAxiosError: true;
    response: { status: number };
  };
  error.isAxiosError = true;
  error.response = { status };
  return error;
}

describe("ErrorRequest.handleError", () => {
  const request = new TestErrorRequest();

  beforeEach(() => {
    redirectMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rethrows non-axios errors without redirecting", () => {
    const error = new Error("boom");
    expect(() => request.trigger(error)).toThrow("boom");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("rethrows axios errors that aren't 401", () => {
    const error = axiosError(500);
    expect(() => request.trigger(error)).toThrow();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("does not redirect on 401 when redirectOn401 is false", () => {
    const error = axiosError(401);
    expect(() => request.trigger(error, false)).toThrow();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("calls next/navigation redirect on the server for a 401", () => {
    vi.stubGlobal("window", undefined);

    const error = axiosError(401);
    expect(() => request.trigger(error, true)).toThrow(error.message);
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("hard-navigates via window.location on the client for a 401", () => {
    const locationStub = { pathname: "/", href: "" };
    vi.stubGlobal("window", { location: locationStub });

    const error = axiosError(401);
    expect(() => request.trigger(error, true)).toThrow();
    expect(locationStub.href).toBe("/login");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("does not hard-navigate on the client if already on /login", () => {
    const locationStub = { pathname: "/login", href: "" };
    vi.stubGlobal("window", { location: locationStub });

    const error = axiosError(401);
    expect(() => request.trigger(error, true)).toThrow();
    expect(locationStub.href).toBe("");
  });

  it("recognizes real axios errors via axios.isAxiosError", () => {
    expect(axios.isAxiosError(axiosError(401))).toBe(true);
  });
});
