"use client";

import { useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Box, Callout, Flex, Table, Text } from "@radix-ui/themes";
import { useGetInvoices } from "@/modules/invoices/core/handlers/get";
import type { InvoiceOrdering, InvoiceSortField } from "@/types/invoice";
import { PAGE_SIZE } from "./constants";
import { InvoicesTableHeader } from "./InvoicesTableHeader";
import { InvoicesTableBody } from "./InvoicesTableBody";
import { Pagination } from "./Pagination";

export function InvoicesTable() {
  const [pageNum, setPageNum] = useState(1);
  const [sortBy, setSortBy] = useState<InvoiceSortField>("CREATED_DATE");
  const [ordering, setOrdering] = useState<InvoiceOrdering>("DESCENDING");

  const { invoices, data, isFetching, isError, isPlaceholderData } =
    useGetInvoices({ sortBy, ordering, pageNum, pageSize: PAGE_SIZE });

  const totalRecords = data?.paging.totalRecords ?? invoices.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));

  const toggleSort = (field: InvoiceSortField) => {
    setPageNum(1);
    if (field !== sortBy) {
      setSortBy(field);
      setOrdering("DESCENDING");
      return;
    }
    setOrdering((prev) => (prev === "DESCENDING" ? "ASCENDING" : "DESCENDING"));
  };

  if (isError) {
    return (
      <Callout.Root color="red">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>Failed to load invoices.</Callout.Text>
      </Callout.Root>
    );
  }

  return (
    <Box>
      <Table.Root variant="surface">
        <InvoicesTableHeader
          sortBy={sortBy}
          ordering={ordering}
          onSort={toggleSort}
        />
        <InvoicesTableBody invoices={invoices} isFetching={isFetching} />
      </Table.Root>

      <Flex align="center" justify="between" mt="4">
        <Text size="2" color="gray">
          {totalRecords} invoice{totalRecords === 1 ? "" : "s"}
        </Text>

        <Pagination
          pageNum={pageNum}
          totalPages={totalPages}
          disableNext={isPlaceholderData}
          onChange={setPageNum}
        />
      </Flex>
    </Box>
  );
}
