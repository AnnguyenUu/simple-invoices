import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInvoices } from "../../repository";
import { invoiceQueryKeys } from "@/context/query-keys/invoice";
import type { InvoiceListParams } from "@/types/invoice";

// The one hook InvoicesTable (and friends) call for the paginated/filtered
// list — components never call fetchInvoices or useQuery directly.
export function useGetInvoices(params: InvoiceListParams) {
  const query = useQuery({
    queryKey: invoiceQueryKeys.list(params),
    queryFn: () => fetchInvoices(params),
    // Keeps the current page's rows on screen while the next page loads
    // instead of flashing an empty table on every sort/page/filter change.
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    invoices: query.data?.data ?? [],
  };
}
