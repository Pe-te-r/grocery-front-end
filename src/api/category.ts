import type { ApiResponse, Category, Subcategory } from "@/util/types";
import { url } from "./url";

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
  const response = await fetch(`${url}/category/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await response.json();
}