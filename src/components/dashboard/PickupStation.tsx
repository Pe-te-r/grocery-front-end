import { useGetPickupDashboardStat } from "@/hooks/pickStationHook"
import { getUserIdHelper } from "@/lib/authHelper"
import { motion } from "framer-motion"
import { 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  RefreshCw, 
  Package,
} from "lucide-react"
import { useState } from "react"
import { Loading } from "../Loading"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

export const PickUpStationDash = () => {
  const userId = getUserIdHelper() ?? ''
  const { data, refetch,isLoading } = useGetPickupDashboardStat(userId)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  if (!data || isLoading) return <div className="flex justify-center items-center h-screen"><Loading/></div>

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pickup Station Dashboard</h1>
            <p className="text-gray-600">Welcome back, {data.data.ownerDetails.name}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isRefreshing ? 'bg-gray-200' : 'bg-emerald-100 text-emerald-700'} transition-colors`}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>
        </motion.div>

        {/* Station Info Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Station Name */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800">Station Name</h3>
            </div>
            <p className="text-gray-700 text-lg">{data.data.stationDetails.name}</p>
          </motion.div>

          {/* Contact */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800">Contact</h3>
            </div>
            <p className="text-gray-700 text-lg">{data.data.stationDetails.contactPhone}</p>
          </motion.div>

          {/* Operating Hours */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800">Operating Hours</h3>
            </div>
            <p className="text-gray-700 text-lg">
              {data.data.stationDetails.openingTime} - {data.data.stationDetails.closingTime}
            </p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${data.data.stationDetails.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {data.data.stationDetails.isOpen ? 'Open Now' : 'Currently Closed'}
            </span>
          </motion.div>

          {/* Location */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800">Location</h3>
            </div>
            <p className="text-gray-700 text-lg">{data.data.stationDetails.constituency}</p>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Total Orders */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Orders</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{data.data.statistics.totalOrders}</h3>
              </div>
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

        </motion.div> 

        {/* Owner Info */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Owner Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500">Name</p>
                <p className="text-gray-800 font-medium">{data.data.ownerDetails.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{data.data.ownerDetails.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="text-gray-800 font-medium">{data.data.ownerDetails.phone}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <p className="text-emerald-600 font-medium">{data.data.statistics.orderStatusCounts.delivered} Delivered</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.data.recentOrders.map((order: any) => (
                  <motion.tr 
                    key={order.id}
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p>{order.customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.itemCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KSh {order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}