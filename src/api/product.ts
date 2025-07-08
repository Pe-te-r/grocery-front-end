import { getAuthTokens } from "@/lib/authHelper";
import { url } from "./url";
import type { ProductForm } from "@/util/types";

export const createProductFn = async (data: ProductForm) => {
   const token = getAuthTokens()?.accessToken
  
  const response = await fetch(`${url}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return await response.json();
}