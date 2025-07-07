import { useEditCategoryHook } from "@/hooks/categoryHook";
import { useForm } from "@tanstack/react-form";
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@/util/types";
import { X } from "lucide-react";
import { z } from "zod";

export function EditCategoryModal({ category, onClose, refetch }: { category: Category; onClose: () => void, refetch: () => void }) {
  const queryClient = useQueryClient()
  const editMutate = useEditCategoryHook()

  const form = useForm({
    defaultValues: {
      name: category.name,
    },
    onSubmit: async ({ value }) => {
      editMutate.mutate({ id: category.id, data: value }, {
        onSuccess: () => {
          onClose()
          refetch()
        }
      })
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: { name: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { status: 'success', message: 'Category updated', data: { id: category.id, name: values.name } }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Edit Category</h2>
          <button onClick={onClose} className="text-white hover:text-green-200">
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="p-6"
        >
          <form.Field
            name="name"
            validators={{
              onChange: z.string().min(1, "Category name is required"),
            }}
            children={(field) => (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Category Name
                </label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter category name"
                />
                {field.state.meta.errors ? (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 flex items-center gap-2"
            >
              {mutation.isPending ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
