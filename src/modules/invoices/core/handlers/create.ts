import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice } from "../../repository";
import { invoiceQueryKeys } from "@/context/query-keys/invoice";

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all });
    },
  });
}
