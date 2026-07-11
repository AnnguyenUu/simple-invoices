import { InvoicesTable } from "@/modules/invoices/presentation";
import { PageLayout } from "@/libs/ui/PageLayout";

export default function Home() {
  return (
    <PageLayout title="Invoices">
      <InvoicesTable />
    </PageLayout>
  );
}
