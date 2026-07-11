import { CreateInvoiceForm } from "@/modules/invoices/presentation/CreateInvoiceForm";
import { PageLayout } from "@/libs/ui/PageLayout";

export default function NewInvoicePage() {
  return (
    <PageLayout title="New Invoice">
      <CreateInvoiceForm />
    </PageLayout>
  );
}
