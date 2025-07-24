import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUsersFn } from '@/api/users'
import { motion } from 'framer-motion'
import { Loader2, Check, X, UserCog, Search, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { UserRole } from '@/util/types'
import { useUpdateUserHook } from '@/hooks/userHook'

const PromoteButton = ({
  userId,
  isPending,
  promotingId,
  onClick,
}: {
  userId: string
  isPending: boolean
  promotingId: string | null
  onClick: (userId: string) => void
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(userId)}
      disabled={isPending && promotingId === userId}
      className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md ${
        isPending && promotingId === userId
          ? 'bg-gray-200 text-gray-700'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {isPending && promotingId === userId ? (
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
  )
}

const DemoteButton = ({
  userId,
  isPending,
  promotingId,
  onClick,
}: {
  userId: string
  isPending: boolean
  promotingId: string | null
  onClick: (userId: string) => void
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(userId)}
      disabled={isPending && promotingId === userId}
      className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md ${
        isPending && promotingId === userId
          ? 'bg-gray-200 text-gray-700'
          : 'bg-red-300 text-white hover:bg-red-500'
      }`}
    >
      {isPending && promotingId === userId ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Demoting...
        </>
      ) : (
        <>
          <ArrowLeft className="w-4 h-4" />
          Demote to Customer
        </>
      )}
    </motion.button>
  )
}

const AdminToSuperAdminPage = () => {
  // Fetch admins data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: () => getUsersFn({ admin: true }),
  })
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter admins based on search term
  const filteredAdmins = (data?.data || []).filter((admin: any) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      admin.email.toLowerCase().includes(searchLower) ||
      admin.first_name.toLowerCase().includes(searchLower) ||
      (admin.last_name && admin.last_name.toLowerCase().includes(searchLower))
  )})

  // Mutation for updating user role
  const { mutate, isPending, error } = useUpdateUserHook()

  // State for tracking promotion/demotion status
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

  // Handle demotion to customer
  const handleDemoteToCustomer = (userId: string) => {
    setPromotingId(userId)
    setPromotionStatus(null)
    
    mutate(
      { id: userId, role: UserRole.CUSTOMER },
      {
        onSuccess: () => {
          setPromotionStatus({ success: true, message: 'Demotion to Customer successful!' })
          refetch()
        },
        onError: () => {
          setPromotionStatus({
            success: false,
            message: error?.message || 'Demotion failed',
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
          Manage admin roles and permissions
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

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search admins by name or email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

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
                  Demote to customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Promote to admin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No matching admins found' : 'No admins found'}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin: any) => (
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
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <DemoteButton
                        userId={admin.id}
                        isPending={isPending}
                        promotingId={promotingId}
                        onClick={handleDemoteToCustomer}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <PromoteButton
                        userId={admin.id}
                        isPending={isPending}
                        promotingId={promotingId}
                        onClick={handlePromoteToSuperAdmin}
                      />
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