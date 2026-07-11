import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Flex, Table, Text } from "@radix-ui/themes";
import type { InvoiceOrdering, InvoiceSortField } from "@/types/invoice";
import { INVOICE_COLUMNS } from "./constants";

export function InvoicesTableHeader({
  sortBy,
  ordering,
  onSort,
}: {
  sortBy: InvoiceSortField;
  ordering: InvoiceOrdering;
  onSort: (field: InvoiceSortField) => void;
}) {
  return (
    <Table.Header>
      <Table.Row>
        {INVOICE_COLUMNS.map(({ field, label }) => (
          <Table.ColumnHeaderCell key={field}>
            <Flex
              align="center"
              gap="1"
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => onSort(field)}
            >
              <Text weight="medium">{label}</Text>
              {sortBy === field &&
                (ordering === "DESCENDING" ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronUpIcon />
                ))}
            </Flex>
          </Table.ColumnHeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
  );
}
