import { useQuery } from "@tanstack/react-query"
import { getUserByIdFn } from "@/api/users"

export const userByIdHook = (id: string, params: Record<string, boolean> = {}) => {
  return useQuery({
    queryKey: ['user', id, params],
    queryFn: () => getUserByIdFn(id, params),
  })
}
