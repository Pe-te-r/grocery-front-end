// hooks/useGetCustomerOrders.ts
import { getOrderbyCustomerId } from '@/api/customer'
import { useQuery } from '@tanstack/react-query'

export const useGetCustomerOrders = (id: string) => {
  return useQuery({
    queryKey: ['customer-orders', id],
    queryFn: () => getOrderbyCustomerId(id),
    enabled: !!id,
    refetchInterval: 1000 * 60 * 5,
  })
}
