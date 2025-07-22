import { createFileRoute } from '@tanstack/react-router'

import { useQuery } from '@tanstack/react-query'
import { getUsersFn } from '@/api/users'
import { motion } from 'framer-motion'
import { Loader2, Check, X, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { useUpdateUserHook } from '@/hooks/userHook'
import { UserRole } from '@/util/types'

const AdminPromotionPage = () => {
  // Fetch customers data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getUsersFn({ customers: true }),
  })
  const customers = data?.data || []

  // Mutation for updating user role
  const { mutate, isPending, error } = useUpdateUserHook()

  // State for tracking promotion status
  const [promotingId, setPromotingId] = useState<string | null>(null)
  const [promotionStatus, setPromotionStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // Handle promotion to admin
  const handlePromoteToAdmin = (userId: string) => {
    setPromotingId(userId)
    setPromotionStatus(null)
    
    mutate(
      { id: userId, role: UserRole.ADMIN },
      {
        onSuccess: (data) => {
          console.log('Promotion successful:', data)
          setPromotionStatus({ success: true, message: 'Promotion successful!' })
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
        Failed to fetch customers. Please try again.
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
          <Users className="w-8 h-8" /> Customer Management
        </h1>
        <p className="text-gray-600 mt-2">
          Promote customers to admin roles with elevated privileges
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
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer: any) => (
                  <motion.tr
                    key={customer.id}
                    variants={itemVariants}
                    className="hover:bg-green-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          {customer.first_name.charAt(0)}
                          {customer.last_name?.charAt(0) || ''}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.account_status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {customer.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePromoteToAdmin(customer.id)}
                        disabled={isPending && promotingId === customer.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                          isPending && promotingId === customer.id
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {isPending && promotingId === customer.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Promoting...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Promote to Admin
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


export const Route = createFileRoute('/dashboard/system/admins')({
  component: AdminPromotionPage,
})
