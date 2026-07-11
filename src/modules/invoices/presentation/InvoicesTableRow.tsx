import { Badge, Table } from "@radix-ui/themes";
import type { Invoice } from "@/types/invoice";
import { formatAmount, formatDate, statusColor, statusLabel } from "./format";

export function InvoicesTableRow({ invoice }: { invoice: Invoice }) {
  return (
    <Table.Row>
      <Table.Cell>{invoice.invoiceNumber}</Table.Cell>
      <Table.Cell>
        <Badge
          color={statusColor(invoice.status)}
          style={{ width: 76, justifyContent: "center" }}
        >
          {statusLabel(invoice.status)}
        </Badge>
      </Table.Cell>
      <Table.Cell>{formatAmount(invoice.totalAmount, invoice.currency)}</Table.Cell>
      <Table.Cell>{formatDate(invoice.dueDate)}</Table.Cell>
      <Table.Cell>{formatDate(invoice.createdAt)}</Table.Cell>
    </Table.Row>
  );
}
