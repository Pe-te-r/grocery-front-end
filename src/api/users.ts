import { url } from "./url"

function buildQueryParams(params: Record<string, boolean>): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === true) {
      query.append(key, 'true') 
    }
  }
  return query.toString()
}

export const getUserByIdFn = async (id: string, params: Record<string, boolean> = {}) => {
  const queryString = buildQueryParams(params)
  const fullUrl = `${url}/users/${id}${queryString ? `?${queryString}` : ''}`
  console.log('full url',fullUrl)
  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  console.log('response data',data)
  return data
}
