import type { ApiResponse, Category, Subcategory } from "@/util/types";
import { url } from "./url";
import { getAccessTokenHelper, getAuthTokens } from "@/lib/authHelper";

export const getAllCategory = async (): Promise<ApiResponse<Category[]>> => {
  const response = await fetch(`${url}/category`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await response.json();
}

export const getAllSubcategoryByCategory = async (id: string): Promise<ApiResponse<Subcategory[]>> => {
  const response = await fetch(`${url}/category/${id}/subcategories`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await response.json();
}

export const deleteCategory = async (id: string): Promise<ApiResponse<null>> => {
  const token = await getAccessTokenHelper()
  const response = await fetch(`${url}/category/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`

    }
  });
  return await response.json();
}

export const createCategory = async(data: { name: string }) => {
  const token = await getAccessTokenHelper()

  const response = await fetch(`${url}/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return await response.json();

}


export const editCategory = async (id:string,data: { name: string }) => {
  const token = await getAccessTokenHelper()

  const response = await fetch(`${url}/category/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  const response_data = await response.json();
  console.log('reponse data',response_data)
  return response_data;

}