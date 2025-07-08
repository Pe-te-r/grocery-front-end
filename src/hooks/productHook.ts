import { createProductFn } from "@/api/product";
import type { ProductForm } from "@/util/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProductHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data:ProductForm) => createProductFn(data),
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};