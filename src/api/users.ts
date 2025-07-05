import { getAuthTokens } from "@/lib/authHelper"
import { url } from "./url"
import type { allUserQuery, updateSettingProfileType } from "@/util/types"

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
  const token = getAuthTokens()?.accessToken
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
  const token = getAuthTokens()?.accessToken
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

  const data =  await response.json()
  return data
}

export const updateUserFn = async (data: updateSettingProfileType) => {
  const token = getAuthTokens()?.accessToken;
  const fullUrl = `${url}/users/${data.id}`;

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Failed to update user');
  // }

  return await response.json();
};
