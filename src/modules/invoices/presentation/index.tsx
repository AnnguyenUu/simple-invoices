"use client";

import { useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Box, Callout, Flex, Spinner, Table, Text } from "@radix-ui/themes";
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

  const { invoices, data, isLoading, isFetching, isError, isPlaceholderData } =
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

  // True first load, nothing on screen yet — no prior layout to preserve,
  // so a simple centered spinner is fine here (unlike the blur overlay
  // below, which exists specifically to avoid disturbing existing layout).
  if (isLoading) {
    return (
      <Flex align="center" justify="center" py="8">
        <Spinner size="3" />
      </Flex>
    );
  }

  return (
    <Box>
      <Box style={{ position: "relative" }}>
        <Box
          style={{
            filter: isFetching ? "blur(2px)" : undefined,
            opacity: isFetching ? 0.6 : 1,
            pointerEvents: isFetching ? "none" : undefined,
            transition: "filter 150ms ease, opacity 150ms ease",
          }}
        >
          <Table.Root variant="surface">
            <InvoicesTableHeader
              sortBy={sortBy}
              ordering={ordering}
              onSort={toggleSort}
            />
            <InvoicesTableBody invoices={invoices} />
          </Table.Root>
        </Box>

        {isFetching && (
          <Flex
            align="center"
            justify="center"
            style={{ position: "absolute", inset: 0 }}
          >
            <Spinner size="3" />
          </Flex>
        )}
      </Box>

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
