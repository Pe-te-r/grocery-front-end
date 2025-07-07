import { getAuthTokens } from "@/lib/authHelper";
import { url } from "./url";
import type { createSubcategory } from "@/util/types";

export const createSubFn = async (data: createSubcategory) => {
   const token = getAuthTokens()?.accessToken
  
    const response = await fetch(`${url}/sub-category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return await response.json();
}