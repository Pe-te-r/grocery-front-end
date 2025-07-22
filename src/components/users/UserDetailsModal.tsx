// components/users/UserDetailsModal.tsx
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { AdminDetails } from './AdminDetails'
import { DriverDetails } from './DriverDetails'
import { CustomerDetails } from './CustomerDetails'
import { VendorDetails } from './VendorDetails'
import type { allUserQuery } from '@/util/types'
import { useUserDetails } from '@/hooks/userHook'

interface UserDetailsModalProps {
  userId: string
  roleQuery: allUserQuery
  onClose: () => void
}

export const UserDetailsModal = ({ userId, roleQuery, onClose }: UserDetailsModalProps) => {
  const { data, isLoading, error } = useUserDetails(userId, roleQuery)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-red-500">Error loading user details</div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-800">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {roleQuery.admin && <AdminDetails data={data} />}
          {roleQuery.superadmin && <AdminDetails data={data} />}
          {roleQuery.vendor && <VendorDetails data={data} />}
          {roleQuery.driver && <DriverDetails data={data} />}
          {roleQuery.customers && <CustomerDetails data={data} />}
        </div>
      </motion.div>
    </div>
  )
}