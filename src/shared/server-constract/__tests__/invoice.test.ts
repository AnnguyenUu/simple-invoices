import { describe, expect, it } from "vitest";
import { createInvoiceSchema } from "../invoice";

const validInvoice = {
  invoiceNumber: "INV-001",
  currency: "GBP",
  invoiceDate: "2026-01-01",
  dueDate: "2026-01-15",
  customerFirstName: "Jane",
  customerLastName: "Doe",
  customerEmail: "jane@example.com",
  customerMobileNumber: "+447123456789",
  itemReference: "ITEM-1",
  itemName: "Consulting",
  quantity: "2",
  rate: "100",
};

describe("createInvoiceSchema", () => {
  it("accepts a minimal valid invoice", () => {
    const result = createInvoiceSchema.safeParse(validInvoice);
    expect(result.success).toBe(true);
  });

  it("rejects a 3-letter currency that isn't uppercase", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      currency: "gbp",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed dates", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      invoiceDate: "01/01/2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a due date before the invoice date", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      invoiceDate: "2026-01-15",
      dueDate: "2026-01-01",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "dueDate");
      expect(issue?.message).toBe(
        "Due date must be on or after the invoice date."
      );
    }
  });

  it("accepts a due date equal to the invoice date", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      invoiceDate: "2026-01-01",
      dueDate: "2026-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid customer email", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      customerEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid mobile number", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      customerMobileNumber: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects quantity that isn't greater than 0", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      quantity: "0",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative rate", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      rate: "-1",
    });
    expect(result.success).toBe(false);
  });

  it("requires bankId when any other bank field is provided", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      bankAccountName: "Jane Doe",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "bankId");
      expect(issue?.message).toBe(
        "Bank ID is required when providing bank account details."
      );
    }
  });

  it("accepts full bank account details when bankId is present", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      bankAccountName: "Jane Doe",
      bankAccountNumber: "12345678",
      bankSortCode: "12-34-56",
      bankId: "bank-1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid bank account number", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      bankId: "bank-1",
      bankAccountNumber: "!!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a percentage tax value above 100", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      taxType: "PERCENTAGE",
      taxValue: "150",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a fixed-value tax above 100", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      taxType: "FIXED_VALUE",
      taxValue: "150",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a negative discount value", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      discountType: "FIXED_VALUE",
      discountValue: "-5",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-2-letter country code", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      addressCountryCode: "VNM",
    });
    expect(result.success).toBe(false);
  });
});
