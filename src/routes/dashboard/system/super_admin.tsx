import { createFileRoute } from '@tanstack/react-router'

import { useQuery } from '@tanstack/react-query'
import { getUsersFn } from '@/api/users'
import { motion } from 'framer-motion'
import { Loader2, Check, X, UserCog } from 'lucide-react'
import { useState } from 'react'
import { UserRole } from '@/util/types'
import { useUpdateUserHook } from '@/hooks/userHook'

const AdminToSuperAdminPage = () => {
  // Fetch admins data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: () => getUsersFn({ admin: true }),
  })
  const admins = data?.data || []

  // Mutation for updating user role
  const { mutate, isPending, error } = useUpdateUserHook()

  // State for tracking promotion status
  const [promotingId, setPromotingId] = useState<string | null>(null)
  const [promotionStatus, setPromotionStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // Handle promotion to superadmin
  const handlePromoteToSuperAdmin = (userId: string) => {
    setPromotingId(userId)
    setPromotionStatus(null)
    
    mutate(
      { id: userId, role: UserRole.SUPERADMIN },
      {
        onSuccess: () => {
          setPromotionStatus({ success: true, message: 'Promotion to SuperAdmin successful!' })
          refetch()
        },
        onError: () => {
          setPromotionStatus({
            success: false,
            message: error?.message || 'Promotion failed',
          })
        },
        onSettled: () => {
          setPromotingId(null)
          setTimeout(() => setPromotionStatus(null), 3000)
        },
      }
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-red-500 bg-red-50 rounded-lg"
      >
        Failed to fetch admins. Please try again.
      </motion.div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
          <UserCog className="w-8 h-8" /> Admin Management
        </h1>
        <p className="text-gray-600 mt-2">
          Promote admins to superadmin roles with elevated privileges
        </p>
      </motion.div>

      {promotionStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-lg flex items-center gap-3 ${
            promotionStatus.success
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {promotionStatus.success ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          <span>{promotionStatus.message}</span>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No admins found
                  </td>
                </tr>
              ) : (
                admins.map((admin:any) => (
                  <motion.tr
                    key={admin.id}
                    variants={itemVariants}
                    className="hover:bg-green-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          {admin.first_name.charAt(0)}
                          {admin.last_name?.charAt(0) || ''}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.first_name} {admin.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.account_status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {admin.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePromoteToSuperAdmin(admin.id)}
                        disabled={isPending && promotingId === admin.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                          isPending && promotingId === admin.id
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {isPending && promotingId === admin.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Promoting...
                          </>
                        ) : (
                          <>
                            <UserCog className="w-4 h-4" />
                            Promote to SuperAdmin
                          </>
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/system/super_admin')({
  component: AdminToSuperAdminPage,
})

