import { getAllCategory } from "@/api/category"
import { useQuery } from "@tanstack/react-query"

export const useGetCategoryHook = () => {
  return useQuery({
    queryKey: ['subcat'],
    queryFn: getAllCategory
  })
}