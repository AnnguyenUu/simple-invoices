import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
const withMethodSpy = vi.fn();
const withUrlSpy = vi.fn();
const withParamsSpy = vi.fn();
const withDataSpy = vi.fn();
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
    withParams(...args: unknown[]) {
      withParamsSpy(...args);
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

const { fetchInvoices, createInvoice } = await import("../index");

describe("invoices repository", () => {
  beforeEach(() => {
    sendMock.mockReset();
    withMethodSpy.mockReset();
    withUrlSpy.mockReset();
    withParamsSpy.mockReset();
    withDataSpy.mockReset();
    withRedirectOn401Spy.mockReset();
  });

  it("fetchInvoices strips out undefined and empty-string params", async () => {
    sendMock.mockResolvedValueOnce({ data: [], paging: { totalRecords: 0 } });

    await fetchInvoices({
      sortBy: "CREATED_DATE",
      ordering: "DESCENDING",
      pageNum: 1,
      pageSize: 20,
      keyword: undefined,
      fromDate: "",
      toDate: "2026-01-01",
    });

    expect(withMethodSpy).toHaveBeenCalledWith("get");
    expect(withUrlSpy).toHaveBeenCalledWith("/invoices");
    expect(withRedirectOn401Spy).toHaveBeenCalledWith(false);
    expect(withParamsSpy).toHaveBeenCalledWith({
      sortBy: "CREATED_DATE",
      ordering: "DESCENDING",
      pageNum: 1,
      pageSize: 20,
      toDate: "2026-01-01",
    });
  });

  it("createInvoice wraps the payload in an invoices array", async () => {
    sendMock.mockResolvedValueOnce({});

    const invoice = {
      invoiceNumber: "INV-1",
      currency: "GBP",
      invoiceDate: "2026-01-01",
      dueDate: "2026-01-15",
      customer: {
        firstName: "Jane",
        lastName: "Doe",
        contact: { email: "jane@example.com", mobileNumber: "+447123456789" },
      },
      items: [
        {
          itemReference: "ITEM-1",
          itemName: "Consulting",
          quantity: 1,
          rate: 100,
        },
      ],
    } as Parameters<typeof createInvoice>[0];

    await createInvoice(invoice);

    expect(withMethodSpy).toHaveBeenCalledWith("post");
    expect(withUrlSpy).toHaveBeenCalledWith("/invoices");
    expect(withRedirectOn401Spy).toHaveBeenCalledWith(false);
    expect(withDataSpy).toHaveBeenCalledWith({ invoices: [invoice] });
  });
});
