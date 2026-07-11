import { Table, Text } from "@radix-ui/themes";
import type { Invoice } from "@/types/invoice";
import { INVOICE_COLUMNS } from "./constants";
import { InvoicesTableRow } from "./InvoicesTableRow";

export function InvoicesTableBody({
  invoices,
  isFetching,
}: {
  invoices: Invoice[];
  isFetching: boolean;
}) {
  if (isFetching) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={INVOICE_COLUMNS.length}>
            <Text color="gray">Loading invoices…</Text>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (invoices.length === 0) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={INVOICE_COLUMNS.length}>
            <Text color="gray">No invoices found.</Text>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {invoices.map((invoice) => (
        <InvoicesTableRow key={invoice.invoiceId} invoice={invoice} />
      ))}
    </Table.Body>
  );
}
