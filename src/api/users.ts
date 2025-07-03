import { authStore } from "@/store/authStore"
import { url } from "./url"
import type { allUserQuery } from "@/util/types"

function buildQueryParams(params: Record<string, boolean>): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === true) {
      query.append(key, 'true')
    }
  }
  return query.toString()
}

function buildQueryParams2(params: allUserQuery ): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === true) {
      query.append(key, 'true')
    }
  }
  return query.toString()
}




export const getUserByIdFn = async (id: string, params: Record<string, boolean> = {}) => {
  const token = authStore.state.user.tokens.accessToken
  const queryString = buildQueryParams(params)
  const fullUrl = `${url}/users/${id}${queryString ? `?${queryString}` : ''}`
  console.log('full url',fullUrl)
  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  const data = await response.json()
  console.log('response data',data)
  return data
}



// New function to get users with filters
export const getUsersFn = async (params: allUserQuery = {}) => {
  const token = authStore.state.user.tokens.accessToken
  const queryString = buildQueryParams2(params)
  const fullUrl = `${url}/users${queryString ? `?${queryString}` : ''}`
  console.log('full url',queryString)
  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  return await response.json()
}