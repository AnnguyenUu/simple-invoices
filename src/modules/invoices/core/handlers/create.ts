import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice } from "../../repository";
import { invoiceQueryKeys } from "../../configuration/constraints";

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all });
    },
  });
}
