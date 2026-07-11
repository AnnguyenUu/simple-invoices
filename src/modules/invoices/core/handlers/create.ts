import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice } from "../../repository";
import { invoiceQueryKeys } from "@/context/query-keys/invoice";

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      // Any cached invoice list pages are now stale — refetch on next view
      // instead of manually patching them in.
      queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all });
    },
  });
}
