"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Box, Callout, Flex, Spinner, Table, Text } from "@radix-ui/themes";
import { useGetInvoices } from "@/modules/invoices/core/handlers/get";
import type {
  Invoice,
  InvoiceOrdering,
  InvoiceSortField,
} from "@/types/invoice";
import { DEFAULT_PAGE_SIZE } from "./constants";
import { InvoicesFilters, type InvoiceFiltersValue } from "./InvoicesFilters";
import { InvoicesTableHeader } from "./InvoicesTableHeader";
import { InvoicesTableBody } from "./InvoicesTableBody";
import { Pagination } from "./Pagination";

const DEFAULT_FILTERS: InvoiceFiltersValue = {
  keyword: "",
  status: "ALL",
  fromDate: "",
  toDate: "",
  pageSize: DEFAULT_PAGE_SIZE,
};

export function InvoicesTable() {
  const [pageNum, setPageNum] = useState(1);
  const [sortBy, setSortBy] = useState<InvoiceSortField>("CREATED_DATE");
  const [ordering, setOrdering] = useState<InvoiceOrdering>("DESCENDING");
  const [filters, setFilters] = useState<InvoiceFiltersValue>(DEFAULT_FILTERS);

  const { invoices, data, isLoading, isFetching, isError, isPlaceholderData } =
    useGetInvoices({
      sortBy,
      ordering,
      pageNum,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
      status: filters.status === "ALL" ? undefined : filters.status,
    });

  const totalRecords = data?.paging.totalRecords ?? invoices.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / filters.pageSize));

  const toggleSort = (field: InvoiceSortField) => {
    setPageNum(1);
    if (field !== sortBy) {
      setSortBy(field);
      setOrdering("DESCENDING");
      return;
    }
    setOrdering((prev) => (prev === "DESCENDING" ? "ASCENDING" : "DESCENDING"));
  };

  const handleFiltersChange = (next: InvoiceFiltersValue) => {
    setPageNum(1);
    setFilters(next);
  };

  return (
    <Box>
      <InvoicesFilters value={filters} onChange={handleFiltersChange} />

      <Invoices
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        sortBy={sortBy}
        ordering={ordering}
        toggleSort={toggleSort}
        invoices={invoices || []}
        totalRecords={totalRecords}
        pageNum={pageNum}
        totalPages={totalPages}
        isPlaceholderData={isPlaceholderData}
        onChange={setPageNum}
      />
    </Box>
  );
}

interface InvoicesProps {
  isError: boolean;
  isLoading: boolean;
  isFetching: boolean;
  sortBy: InvoiceSortField;
  ordering: InvoiceOrdering;
  toggleSort: (field: InvoiceSortField) => void;
  invoices: Invoice[];
  totalRecords: number;
  pageNum: number;
  totalPages: number;
  isPlaceholderData: boolean;
  onChange: (page: number) => void;
}

const InvoiceError = () => {
  return (
    <Callout.Root color="red">
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>Failed to load invoices.</Callout.Text>
    </Callout.Root>
  );
};

const InvoiceLoading = () => {
  return (
    <Flex align="center" justify="center" py="8">
      <Spinner size="3" />
    </Flex>
  );
};

const Invoices = ({
  isError,
  isLoading,
  isFetching,
  sortBy,
  ordering,
  toggleSort,
  invoices,
  totalRecords,
  onChange,
  pageNum,
  totalPages,
  isPlaceholderData,
}: InvoicesProps) => {
  if (isError) {
    return <InvoiceError />;
  }

  if (isLoading) {
    return (
      <Flex align="center" justify="center" py="8">
        <Spinner size="3" />
      </Flex>
    );
  }
  return (
    <>
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
          onChange={onChange}
        />
      </Flex>
    </>
  );
};
