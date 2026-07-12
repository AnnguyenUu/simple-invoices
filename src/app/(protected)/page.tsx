"use client";

import { InvoicesTable } from "@/modules/invoices/presentation";
import { InvoiceProvider } from "@/modules/invoices/core/handlers/useInvoices";
import { PageLayout } from "@/libs/ui/PageLayout";

export default function Home() {
  return (
    <InvoiceProvider>
      <PageLayout title="Invoices">
        <InvoicesTable />
      </PageLayout>
    </InvoiceProvider>
  );
}
