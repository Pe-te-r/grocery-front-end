import { createProductFn, getProductFn } from "@/api/product";
import type { ProductForm } from "@/util/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProductHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data:ProductForm) => createProductFn(data),
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};


export const useGetProductQuery = (category?: string) => {
  return useQuery({
    queryKey: ['products', category], // Include category in queryKey
    queryFn: () => getProductFn(category),
    refetchInterval: 30 * 1000 
  })
}
