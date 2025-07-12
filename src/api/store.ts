import { getAccessTokenHelper } from "@/lib/authHelper"
import { url } from "./url"

export const createStore = async (store: any) => {
  const token = getAccessTokenHelper()
  const response = await fetch(`${url}/stores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(store)
  })
  const data = response.json()
  return data
}

export const getStore = async (id: string) => {
  const token = getAccessTokenHelper()
  const response = await fetch(`${url}/stores/${id}/applied`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    
  })
  const data = response.json()
  return data
}

export const getAdminStore = async () => {
  const token = getAccessTokenHelper()
  const response = await fetch(`${url}/stores/admin`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  })
  const data = response.json()
  return data
}