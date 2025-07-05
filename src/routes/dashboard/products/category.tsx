import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllSubcategoryByCategory } from '@/api/category'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
// import { zodValidator } from '@tanstack/zod-form-adapter'
import { Pen, Trash2, MoreVertical, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetCategoryHook } from '@/hooks/subCategoryHook'
import { createCategoryHook, useDeleteCategoryHook, useEditCategoryHook } from '@/hooks/categoryHook'

export const Route = createFileRoute('/dashboard/products/category')({
  component: CategoryManagement,
})

type Category = {
  id: string
  name: string
}

type Subcategory = {
  id: string
  name: string
}

function CategoryManagement() {
  const { data: categories, isLoading, error, refetch } = useGetCategoryHook()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentEditCategory, setCurrentEditCategory] = useState<Category | null>(null)

  if (isLoading) return <div className="p-4">Loading categories...</div>
  if (error) return <div className="p-4 text-red-500">Error loading categories</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <CategoryTable
        categories={categories?.data || []}
        onSelectCategory={(category) => {
          setSelectedCategory(category)
          setIsModalOpen(true)
        }}
        refetch={() => refetch()}
        onEditCategory={(category) => {
          setCurrentEditCategory(category)
          setIsEditModalOpen(true)
        }}
      />

      {/* Subcategory Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCategory && (
          <SubcategoryModal
            category={selectedCategory}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Create Category Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateCategoryModal onClose={() => setIsCreateModalOpen(false)} refetch={() => refetch()} />
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentEditCategory && (
          <EditCategoryModal
            category={currentEditCategory}
            onClose={() => setIsEditModalOpen(false)}
            refetch={() => refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryTable({
  categories,
  onSelectCategory,
  onEditCategory,
  refetch
}: {
  categories: Category[]
  onSelectCategory: (category: Category) => void
  onEditCategory: (category: Category) => void
  refetch: () => void
}) {

  const [actionDropdown, setActionDropdown] = useState<string | null>(null)

  const deleteMutate = useDeleteCategoryHook()

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Category Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-800">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="relative">
          <button
            onClick={() => setActionDropdown(actionDropdown === row.original.id ? null : row.original.id)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>

          {actionDropdown === row.original.id && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onSelectCategory(row.original)
                    setActionDropdown(null)
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 w-full text-left"
                >
                  <span>View Subcategories</span>
                </button>
                <button
                  onClick={() => {
                    onEditCategory(row.original)
                    setActionDropdown(null)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 w-full text-left"
                >
                  <Pen size={14} className="text-green-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    const id = row.original.id
                    if (id) {
                      deleteMutate.mutate(id)
                      refetch()
                      setActionDropdown(null)
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-green-50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SubcategoryModal({ category, onClose }: { category: Category; onClose: () => void }) {
  const { data: subcategories, isLoading } = useQuery({
    queryKey: ['categories', category.id],
    queryFn: () => getAllSubcategoryByCategory(category.id),
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Subcategories for {category.name}
          </h2>
          <button onClick={onClose} className="text-white hover:text-green-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">Loading subcategories...</div>
          ) : subcategories?.data.length ? (
            <ul className="space-y-3">
              {subcategories.data.map((sub: Subcategory) => (
                <li
                  key={sub.id}
                  className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100"
                >
                  <span className="font-medium text-green-800">{sub.name}</span>
                  <div className="flex gap-2">
                    <button className="p-1 text-green-600 hover:text-green-800">
                      <Pen size={16} />
                    </button>
                    <button className="p-1 text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No subcategories found for this category
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus size={18} />
              Add Subcategory
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CreateCategoryModal({ onClose, refetch }: { onClose: () => void, refetch: () => void }) {
  const queryClient = useQueryClient()
  const mutation = createCategoryHook()
  const form = useForm({
    defaultValues: {
      name: '',
    },
    // validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      mutation.mutate(value, {
        onSuccess: () => {
          onClose()
          refetch()
          queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
      })
    },
  })


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-transparent bg-opacity-100 flex items-center justify-center z-50"
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
          <h2 className="text-xl font-semibold text-white">Create New Category</h2>
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
              {mutation.isPending ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function EditCategoryModal({ category, onClose, refetch }: { category: Category; onClose: () => void, refetch: () => void }) {
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

