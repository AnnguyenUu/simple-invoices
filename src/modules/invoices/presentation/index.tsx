"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Box, Callout, Flex, Spinner, Table, Text } from "@radix-ui/themes";
import { InvoicesFilters } from "./InvoicesFilters";
import { useInvoiceContext } from "../core/handlers/useInvoices";

const InvoicesTableHeader = dynamic(() =>
  import("./InvoicesTableHeader").then((mod) => mod.InvoicesTableHeader),
);

const InvoicesTableBody = dynamic(() =>
  import("./InvoicesTableBody").then((mod) => mod.InvoicesTableBody),
);

const Pagination = dynamic(() =>
  import("./Pagination").then((mod) => mod.Pagination),
);

export function InvoicesTable() {
  const facade = useInvoiceContext();

  return (
    <Box>
      <InvoicesFilters
        value={facade.filters}
        onChange={facade.handleFiltersChange}
      />
      <Invoices />
    </Box>
  );
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

const Invoices = () => {
  const facade = useInvoiceContext();

  if (facade.isError) {
    return <InvoiceError />;
  }

  if (facade.isLoading) {
    return <InvoiceLoading />;
  }

  return (
    <>
      <Box style={{ position: "relative" }}>
        <Box
          className={clsx(
            "overflow-x-auto transition-[filter,opacity] duration-150 ease-in-out",
            facade.isFetching
              ? "pointer-events-none opacity-60 blur-[2px]"
              : "opacity-100",
          )}
        >
          <Table.Root variant="surface">
            <InvoicesTableHeader
              sortBy={facade.sortBy}
              ordering={facade.ordering}
              onSort={facade.toggleSort}
            />
            <InvoicesTableBody invoices={facade.invoices} />
          </Table.Root>
        </Box>

        {facade.isFetching && (
          <Flex
            align="center"
            justify="center"
            style={{ position: "absolute", inset: 0 }}
          >
            <Spinner size="3" />
          </Flex>
        )}
      </Box>

      <Flex
        align={{ initial: "start", sm: "center" }}
        justify="between"
        direction={{ initial: "column", sm: "row" }}
        gap="3"
        mt="4"
      >
        <Text size="2" color="gray">
          {`${facade.totalRecords} ${pluralized("invoice", facade.totalRecords)}`} 
        </Text>

        <Pagination
          pageNum={facade.pageNum}
          totalPages={facade.totalPages}
          disableNext={facade.isPlaceholderData}
          onChange={facade.setPageNum}
        />
      </Flex>
    </>
  );
};

const pluralized = (text: string, count: number) => {
  if(count > 1) {
    return `${text}s`
  }
  return text
}
