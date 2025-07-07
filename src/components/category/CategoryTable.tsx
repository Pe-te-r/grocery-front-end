import { useDeleteCategoryHook } from "@/hooks/categoryHook"
import type { Category } from "@/util/types"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { MoreVertical, Pen, Trash2 } from "lucide-react"
import { useState } from "react"
import { motion } from 'framer-motion';


export function CategoryTable({
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
                      deleteMutate.mutate(id, { onSuccess: () => refetch() })
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