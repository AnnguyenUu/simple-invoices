import { InvoiceOrdering, InvoiceSortField } from "@/types/invoice";
import { useState } from "react";
import { InvoiceFiltersValue } from "../../presentation/InvoicesFilters";
import { DEFAULT_PAGE_SIZE } from "../../presentation/constants";
import { useGetInvoices } from "./get";
import { context } from "@/context/createContext";
import { FEATURE_NAME } from "../../configuration/constraints";

export const DEFAULT_FILTERS: InvoiceFiltersValue = {
  keyword: "",
  status: "ALL",
  fromDate: "",
  toDate: "",
  pageSize: DEFAULT_PAGE_SIZE,
};

export const useInvoice = () => {
  const [pageNum, setPageNum] = useState(1);
  const [sortBy, setSortBy] = useState<InvoiceSortField>("CREATED_DATE");
  const [ordering, setOrdering] = useState<InvoiceOrdering>("DESCENDING");
  const [filters, setFilters] = useState<InvoiceFiltersValue>(DEFAULT_FILTERS);

  const { invoices, data, ...query } = useGetInvoices({
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

  return {
    toggleSort,
    setPageNum,
    isError: query?.isError,
    isLoading: query?.isLoading,
    isFetching: query?.isFetching,
    sortBy,
    ordering,
    invoices,
    totalRecords,
    pageNum,
    totalPages,
    isPlaceholderData: query?.isPlaceholderData,
    handleFiltersChange,
    filters,
    setFilters
  }
};

export const [InvoiceProvider, useInvoiceContext] = context(
  FEATURE_NAME,
  useInvoice
);
