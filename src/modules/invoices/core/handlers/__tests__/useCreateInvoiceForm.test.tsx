import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const createInvoiceMock = vi.fn();

vi.mock("../../../repository", () => ({
  createInvoice: (...args: unknown[]) => createInvoiceMock(...args),
}));

const { useCreateInvoiceForm } = await import("../useCreateInvoiceForm");

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const baseValues = {
  invoiceNumber: "INV-1",
  currency: "GBP",
  invoiceDate: "2026-01-01",
  dueDate: "2026-01-15",
  customerFirstName: "Jane",
  customerLastName: "Doe",
  customerEmail: "jane@example.com",
  customerMobileNumber: "+447123456789",
  itemReference: "ITEM-1",
  itemName: "Consulting",
  quantity: "1",
  rate: "100",
};

describe("useCreateInvoiceForm", () => {
  beforeEach(() => {
    createInvoiceMock.mockReset();
    createInvoiceMock.mockResolvedValue({});
  });

  it("submits a minimal payload without bankAccount, addresses, or extensions", async () => {
    const { result } = renderHook(() => useCreateInvoiceForm(), { wrapper });

    act(() => {
      result.current.form.reset({ ...result.current.form.getValues(), ...baseValues });
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => expect(createInvoiceMock).toHaveBeenCalledTimes(1));
    const payload = createInvoiceMock.mock.calls[0][0];

    expect(payload.bankAccount).toBeUndefined();
    expect(payload.customer.addresses).toBeUndefined();
    expect(payload.extensions).toBeUndefined();
    expect(payload.customer).toMatchObject({
      firstName: "Jane",
      lastName: "Doe",
      contact: { email: "jane@example.com", mobileNumber: "+447123456789" },
    });
    expect(payload.items).toEqual([
      {
        itemReference: "ITEM-1",
        itemName: "Consulting",
        description: undefined,
        quantity: 1,
        rate: 100,
        itemUOM: undefined,
      },
    ]);
  });

  it("builds bankAccount and addresses when their fields are present", async () => {
    const { result } = renderHook(() => useCreateInvoiceForm(), { wrapper });

    act(() => {
      result.current.form.reset({
        ...result.current.form.getValues(),
        ...baseValues,
        bankId: "bank-1",
        bankAccountName: "Jane Doe",
        bankAccountNumber: "12345678",
        addressCity: "London",
      });
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => expect(createInvoiceMock).toHaveBeenCalledTimes(1));
    const payload = createInvoiceMock.mock.calls[0][0];

    expect(payload.bankAccount).toEqual({
      accountName: "Jane Doe",
      accountNumber: "12345678",
      sortCode: undefined,
      bankId: "bank-1",
    });
    expect(payload.customer.addresses).toEqual([
      {
        premise: undefined,
        city: "London",
        county: undefined,
        postcode: undefined,
        countryCode: undefined,
        addressType: "BILLING",
      },
    ]);
  });

  it("adds a tax and discount extension when their values are set", async () => {
    const { result } = renderHook(() => useCreateInvoiceForm(), { wrapper });

    act(() => {
      result.current.form.reset({
        ...result.current.form.getValues(),
        ...baseValues,
        taxType: "PERCENTAGE",
        taxValue: "20",
        discountType: "FIXED_VALUE",
        discountValue: "5",
      });
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => expect(createInvoiceMock).toHaveBeenCalledTimes(1));
    const payload = createInvoiceMock.mock.calls[0][0];

    expect(payload.extensions).toEqual([
      { addDeduct: "ADD", type: "PERCENTAGE", value: 20, name: "tax" },
      { addDeduct: "DEDUCT", type: "FIXED_VALUE", value: 5, name: "discount" },
    ]);
  });

  it("does not call createInvoice when required fields are missing", async () => {
    const { result } = renderHook(() => useCreateInvoiceForm(), { wrapper });

    let isValid = true;
    await act(async () => {
      isValid = await result.current.form.trigger();
      await result.current.onSubmit();
    });

    expect(isValid).toBe(false);
    expect(createInvoiceMock).not.toHaveBeenCalled();
  });
});
