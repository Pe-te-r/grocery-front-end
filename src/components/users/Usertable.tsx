// components/users/UserTable.tsx
import type { User, UserRoleEnum } from '@/util/types'
import  { AccountStatus } from '@/util/types'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Loading } from '../Loading'

interface UserTableProps {
  data: User[]
  isLoading: boolean
  isError: boolean
  role: UserRoleEnum
  onRowClick?: (userId: string) => void
}

export const UserTable = ({
  data,
  isLoading,
  isError,
  role,
  onRowClick,
}: UserTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const columns: ColumnDef<User>[] = [
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
        const status = row.getValue('account_status') as AccountStatus
        const statusConfig = {
          [AccountStatus.ACTIVE]: { bg: 'bg-green-100', text: 'text-green-800' },
          [AccountStatus.DEACTIVATED]: { bg: 'bg-gray-100', text: 'text-gray-800' },
          [AccountStatus.PENDING]: { bg: 'bg-blue-100', text: 'text-blue-800' },
          [AccountStatus.SUSPENDED]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
          [AccountStatus.BANNED]: { bg: 'bg-red-100', text: 'text-red-800' },
          [AccountStatus.DELETED]: { bg: 'bg-gray-200', text: 'text-gray-600' },
          [AccountStatus.LOCKED]: { bg: 'bg-orange-100', text: 'text-orange-800' },
          [AccountStatus.INACTIVE]: { bg: 'bg-purple-100', text: 'text-purple-800' },
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[status].bg} ${statusConfig[status].text}`}
          >
            {status}
          </span>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
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
          onClick={() => onRowClick?.(row.original.id)}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
        >
          Details
        </button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
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
        <p className="text-red-500">Failed to load {role}</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 capitalize">
          {role === 'admins' ? 'Administrators' : role}
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${role}...`}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

 
       <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? 'cursor-pointer select-none flex items-center'
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: (
                                  <svg
                                    className="ml-1 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                ),
                                desc: (
                                  <svg
                                    className="ml-1 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

      {/* Pagination controls same as before */}
      {/* ... */}
    </div>
  )
}