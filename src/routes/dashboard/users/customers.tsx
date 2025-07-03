import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUsersFn } from '@/api/users'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState
} from '@tanstack/react-table'
import { useState } from 'react'
import { Loading } from '@/components/Loading'
import { UserTable } from '@/components/users/Usertable'

export const Route = createFileRoute('/dashboard/users/customers')({
  component: CustomersComponent,
})

type Customer = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  is_verified: boolean
  account_status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

function CustomersComponent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getUsersFn({ customers: true }),
  })
  const customers = data?.data
  console.log('customers data',customers)

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'first_name',
      header: 'First Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-800">
          {row.getValue('first_name')}
        </span>
      ),
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-800">
          {row.getValue('last_name')}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-gray-600">{row.getValue('email')}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-gray-600">{row.getValue('phone')}</span>
      ),
    },
    {
      accessorKey: 'account_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('account_status') as string
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'active'
                ? 'bg-green-100 text-green-800'
                : status === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
          >
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Joined Date',
      cell: ({ row }) => (
        <span className="text-gray-500">
          {new Date(row.getValue('created_at')).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <button
          onClick={() => {
            console.log('Viewing details for customer ID:', row.original.id)
            // You can add modal opening logic here
          }}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
        >
          Details
        </button>
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const handleRowClick = (userId: string) => {
    console.log('Vendor ID:', userId)
    // Navigate to vendor details: `/dashboard/users/vendors/${userId}`
  }

  const table = useReactTable({
    data: customers || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading/>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Failed to load customers</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
      </div>
      <UserTable
        data={customers || []}
        isLoading={isLoading}
        isError={isError}
        role="customers"
        onRowClick={handleRowClick}
      />
     

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </button>
        </div>
        <span className="flex items-center gap-1 text-sm text-gray-700">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <select
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}