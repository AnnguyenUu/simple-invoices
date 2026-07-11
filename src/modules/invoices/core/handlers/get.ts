import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInvoices } from "../../repository";
import { invoiceQueryKeys } from "@/context/query-keys/invoice";
import type { InvoiceListParams } from "@/types/invoice";

export function useGetInvoices(params: InvoiceListParams) {
  const query = useQuery({
    queryKey: invoiceQueryKeys.list(params),
    queryFn: () => fetchInvoices(params),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    invoices: query.data?.data ?? [],
  };
}
