import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const fetchInvoicesMock = vi.fn();

vi.mock("../../../repository", () => ({
  fetchInvoices: (...args: unknown[]) => fetchInvoicesMock(...args),
}));

const { useInvoice } = await import("../useInvoices");

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useInvoice", () => {
  beforeEach(() => {
    fetchInvoicesMock.mockReset();
    fetchInvoicesMock.mockResolvedValue({
      data: [{ invoiceId: "1" }, { invoiceId: "2" }],
      paging: { totalRecords: 45 },
    });
  });

  it("computes totalPages from totalRecords and the current page size", async () => {
    const { result } = renderHook(() => useInvoice(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalRecords).toBe(45);
    expect(result.current.totalPages).toBe(Math.ceil(45 / result.current.filters.pageSize));
    expect(result.current.invoices).toHaveLength(2);
  });

  it("toggleSort resets to page 1, switches field, then flips ordering on repeat", async () => {
    const { result } = renderHook(() => useInvoice(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.setPageNum(3));
    expect(result.current.pageNum).toBe(3);

    act(() => result.current.toggleSort("DUE_DATE"));
    expect(result.current.sortBy).toBe("DUE_DATE");
    expect(result.current.ordering).toBe("DESCENDING");
    expect(result.current.pageNum).toBe(1);

    act(() => result.current.toggleSort("DUE_DATE"));
    expect(result.current.ordering).toBe("ASCENDING");

    act(() => result.current.toggleSort("DUE_DATE"));
    expect(result.current.ordering).toBe("DESCENDING");
  });

  it("handleFiltersChange resets to page 1 and applies the new filters", async () => {
    const { result } = renderHook(() => useInvoice(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.setPageNum(2));

    act(() =>
      result.current.handleFiltersChange({
        keyword: "acme",
        status: "Paid",
        fromDate: "2026-01-01",
        toDate: "2026-01-31",
        pageSize: 10,
      })
    );

    expect(result.current.pageNum).toBe(1);
    expect(result.current.filters).toEqual({
      keyword: "acme",
      status: "Paid",
      fromDate: "2026-01-01",
      toDate: "2026-01-31",
      pageSize: 10,
    });
  });

  it("omits the status filter from the query params when set to ALL", async () => {
    const { result } = renderHook(() => useInvoice(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await waitFor(() =>
      expect(fetchInvoicesMock).toHaveBeenCalledWith(
        expect.objectContaining({ status: undefined })
      )
    );
  });
});
