import { useGetCustomerDashboardStat } from '@/hooks/customerHook';
import { getUserIdHelper } from '@/lib/authHelper';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Package, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ShoppingCart, 
  DollarSign, 
  User, 
  CreditCard,
  Truck
} from 'lucide-react';
import { useState } from 'react';

const CustomerDashboard = () => {
    const userId = getUserIdHelper() ?? '';
  const { data, isLoading, isError } = useGetCustomerDashboardStat(userId);
  const [activeTab, setActiveTab] = useState<'stats' | 'orders'>('stats');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-green-500" />
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Error loading dashboard</h2>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const { user, stats, recent_orders } = data?.data;
  console.log('Customer Dashboard Data:', data);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* display only if data?.data is avalable */}
            {!data?.data ? (
      <div className="flex items-center justify-center h-full">
        {isLoading ? (
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        ) : (
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              {isError ? 'Error loading dashboard' : 'No data available'}
            </h2>
          </div>
        )}
      </div>):
        <>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, <span className="text-green-600">{user?.first_name}</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Member since {new Date(user?.member_since).toLocaleDateString()}
        </p>
      </motion.header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
        >
          Recent Orders
        </button>
      </div>

      {/* Main Content */}
      {activeTab === 'stats' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold mt-2">{stats?.total_orders}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Spent</p>
                <h3 className="text-2xl font-bold mt-2">KES {stats?.total_spent.toFixed(2)}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Pending Orders</p>
                <h3 className="text-2xl font-bold mt-2">{stats?.pending_orders}</h3>
              </div>
              <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Completed Orders</p>
                <h3 className="text-2xl font-bold mt-2">{stats?.completed_orders}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* User Info Card */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {user?.first_name} {user?.last_name || ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">
                  {new Date(user?.last_login).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="font-medium capitalize">{user?.account_status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verification</p>
                <p className="font-medium">
                  {user?.is_verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Order Status Chart */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Order Status Breakdown
            </h3>
            <div className="space-y-4">
              {[
                { status: 'Pending', count: stats?.pending_orders, color: 'bg-yellow-500' },
                { status: 'Processing', count: stats?.processing_orders, color: 'bg-blue-500' },
                { status: 'Completed', count: stats?.completed_orders, color: 'bg-green-500' },
                { status: 'Cancelled', count: stats?.cancelled_orders, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.status}</span>
                    <span>{item.count} ({Math.round((item?.count / stats?.total_orders) * 100 || 0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item?.count / stats?.total_orders) * 100 || 0}%` }}
                      transition={{ duration: 1 }}
                      className={`h-2 rounded-full ${item?.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <h3 className="text-lg font-semibold p-6 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Recent Orders
          </h3>
          <div className="divide-y divide-gray-100">
            {recent_orders.length > 0 ? (
              recent_orders.map((order: any) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">Order #{order.id.slice(0, 8)}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.date).toLocaleDateString()} • {order.itemCount} items
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <p className="font-bold text-lg">KES {order.totalAmount}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {order.deliveryOption === 'pickup' ? (
                          <span className="flex items-center text-sm text-gray-600">
                            <Package className="w-4 h-4 mr-1" /> Pickup
                          </span>
                        ) : (
                          <span className="flex items-center text-sm text-gray-600">
                            <Truck className="w-4 h-4 mr-1" /> Delivery
                          </span>
                        )}
                        <span className="flex items-center text-sm text-gray-600">
                          <CreditCard className="w-4 h-4 mr-1" /> {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                  {order.vendors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Vendors:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.vendors.map((vendor: any) => (
                          <span key={vendor} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {vendor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recent orders found
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>}
    </div>
  );
};

export default CustomerDashboard;