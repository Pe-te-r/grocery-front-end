import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideLoader2,
  LucidePackage,
  LucidePackageCheck,
  LucidePackageX,
  LucidePackageSearch,
  LucideTruck,
  LucideList,
  LucideGrid,
  LucideChevronDown,
  LucideInfo,
  LucideClock,
} from 'lucide-react';
import {  useGetCustomerOrders } from '@/hooks/customerHook';
import { getUserIdHelper } from '@/lib/authHelper';
import OrderDetailsModal from '@/components/OrderDetailsModal';

export enum OrderStatus {
  PENDING = 'pending',
  READY_FOR_PICKUP = 'ready_for_pickup',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

const OrderTrackingPage = () => {
  const userId = getUserIdHelper() ?? '';
  const { data: orderData, isLoading } = useGetCustomerOrders(userId);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = orderData?.data
    ? selectedStatus === 'all'
      ? orderData.data
      : orderData.data.filter((order:any) => order.status === selectedStatus)
    : [];

  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <LucideClock className="text-amber-500" />;
      case OrderStatus.READY_FOR_PICKUP:
        return <LucidePackageSearch className="text-blue-500" />;
      case OrderStatus.IN_TRANSIT:
        return <LucideTruck className="text-indigo-500" />;
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        return <LucidePackageCheck className="text-green-500" />;
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        return <LucidePackageX className="text-red-500" />;
      default:
        return <LucidePackage className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Processing';
      case OrderStatus.READY_FOR_PICKUP:
        return 'Waiting for transport';
      case OrderStatus.IN_TRANSIT:
        return 'On the Way';
      case OrderStatus.DELIVERED:
        return 'Ready for pickup';
      case OrderStatus.COMPLETED:
        return 'Completed';
      case OrderStatus.CANCELLED:
        return 'Cancelled';
      case OrderStatus.REJECTED:
        return 'Rejected';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-amber-100 text-amber-800';
      case OrderStatus.READY_FOR_PICKUP:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.IN_TRANSIT:
        return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <LucideLoader2 className="w-12 h-12 text-green-500" />
        </motion.div>
      </div>
    );
  }

  if (!orderData || orderData.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <LucidePackage className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">No Orders Found</h2>
        <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <LucideChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex rounded-lg overflow-hidden border border-gray-300 bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}
              >
                <LucideGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}
              >
                <LucideList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm"
          >
            <LucidePackageSearch className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No orders with this status</h3>
            <p className="text-gray-500 mt-2">Try selecting a different status</p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredOrders.map((order: any) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="font-medium">KES {order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Delivery</p>
                      <p className="font-medium capitalize">
                        {order.deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOrderClick(order.id)}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <LucideInfo className="w-4 h-4" />
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div layout className="space-y-4">
            {filteredOrders.map((order: any) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div className="text-center sm:text-right">
                        <p className="text-gray-500">Items</p>
                        <p className="font-medium">{order.itemCount}</p>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">KES {order.totalAmount}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOrderClick(order.id)}
                          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <LucideInfo className="w-4 h-4" />
                          Details
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <OrderDetailsModal
            orderId={selectedOrder}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};



export const Route = createFileRoute('/dashboard/orders/current')({
  component: OrderTrackingPage,
})