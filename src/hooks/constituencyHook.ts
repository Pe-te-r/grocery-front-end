import { getConstituenciesByCounty } from '@/api/constituency'
import { useQuery } from '@tanstack/react-query'

export const useGetconstituenciesByCounty = (county: string) => {
  return useQuery({
    queryKey: ['constituencies', county],
    queryFn: ({ queryKey }) => {
      const [_key, countyName] = queryKey
      return getConstituenciesByCounty(countyName)
    },
    enabled: !!county,
  })
}
