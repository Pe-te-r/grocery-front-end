import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllCategory, getAllSubcategoryByCategory, deleteCategory } from "@/api/category"

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategory
  })
}

export const useGetSubcategories = (categoryId: string) => {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => getAllSubcategoryByCategory(categoryId),
    enabled: !!categoryId
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  })
}