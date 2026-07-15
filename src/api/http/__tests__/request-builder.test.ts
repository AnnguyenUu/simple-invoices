import { beforeEach, describe, expect, it, vi } from "vitest";

const requestMock = vi.fn();

vi.mock("../client", () => ({
  apiClient: { request: requestMock },
}));

const { RequestBuilder } = await import("../request-builder");

describe("RequestBuilder", () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it("chains method/url/data/params/headers into a single axios call", async () => {
    requestMock.mockResolvedValueOnce({ data: { ok: true } });

    const result = await new RequestBuilder()
      .withMethod("post")
      .withUrl("/invoices")
      .withData({ invoiceNumber: "INV-1" })
      .withParams({ pageNum: 1 })
      .withHeaders({ "X-Test": "1" })
      .send();

    expect(result).toEqual({ ok: true });
    expect(requestMock).toHaveBeenCalledWith({
      method: "post",
      url: "/invoices",
      data: { invoiceNumber: "INV-1" },
      params: { pageNum: 1 },
      headers: { "X-Test": "1" },
    });
  });

  it("merges successive withHeaders calls instead of overwriting", async () => {
    requestMock.mockResolvedValueOnce({ data: {} });

    await new RequestBuilder()
      .withMethod("get")
      .withUrl("/invoices")
      .withHeaders({ A: "1" })
      .withHeaders({ B: "2" })
      .send();

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ headers: { A: "1", B: "2" } })
    );
  });

  it("propagates non-401 errors from handleError", async () => {
    const error = Object.assign(new Error("server error"), {
      isAxiosError: true,
      response: { status: 500 },
    });
    requestMock.mockRejectedValueOnce(error);

    await expect(
      new RequestBuilder().withMethod("get").withUrl("/invoices").send()
    ).rejects.toThrow("server error");
  });
});
