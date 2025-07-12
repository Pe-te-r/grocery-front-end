import { createStore, getAdminStore, getStore } from "@/api/store"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateStoreHook = () => {
  return useMutation<unknown, Error, unknown>({
    mutationKey: ['createStore'],
    mutationFn: (store) => createStore(store)
  })
}

export const useCheckAppliedHook = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => getStore(id),
    enabled: !!id
  });
};



export const useAdminShopsdHook = () => {
  return useQuery({
    queryKey: ['store'],
    queryFn: () => getAdminStore(),
  });
};