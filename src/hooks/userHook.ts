import { useQuery } from "@tanstack/react-query"
import { getUserByIdFn, getUsersFn } from "@/api/users"
import type { allUserQuery } from "@/util/types"

export const userByIdHook = (id: string, params: Record<string, boolean> = {}) => {
  return useQuery({
    queryKey: ['user', id, params],
    queryFn: () => getUserByIdFn(id, params),
  })
}

export const useUsers = (params: allUserQuery = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsersFn(params),
  })
}