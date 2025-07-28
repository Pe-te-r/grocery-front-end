// src/components/OrderDetails.tsx
import { usePickOrderId } from '@/hooks/pickStationHook';
import { motion } from 'framer-motion';
import { Box, Package, CreditCard, Info, X } from 'lucide-react';

interface OrderDetailsProps {
  order: any;
  onClose: () => void;
}

export const OrderDetails = ({ order, onClose }: OrderDetailsProps) => {
  const { data, isLoading } = usePickOrderId(order.id);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <Info className="text-red-500 w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">The requested order could not be loaded.</p>
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const orderData = data.data;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-green-800">Order Details</h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Order Information */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <Box size={18} /> Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono">{orderData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{new Date(orderData.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      orderData.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : orderData.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {orderData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items:</span>
                    <span>{orderData.itemCount}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment & Delivery */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <CreditCard size={18} /> Payment & Delivery
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="capitalize">{orderData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Option:</span>
                    <span className="capitalize">{orderData.deliveryOption}</span>
                  </div>
                  {orderData.deliveryFee && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Fee:</span>
                      <span>KES {orderData?.deliveryFee}</span>
                    </div>
                  )}
                  {orderData.deliveryInstructions && (
                    <div>
                      <span className="text-gray-500">Instructions:</span>
                      <p className="mt-1 bg-gray-50 p-2 rounded">{orderData.deliveryInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <Package size={18} /> Order Items
                </h3>
                <div className="space-y-3">
                  {orderData.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-800">Item #{item.randomCode}</div>
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            Qty: {item.quantity}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.itemStatus === 'ready_for_pickup' 
                              ? 'bg-green-100 text-green-800' 
                              : item.itemStatus === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.itemStatus}
                          </span>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        item.assignmentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : item.assignmentStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.assignmentStatus || 'Not assigned'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center font-bold">
              <span className="text-green-800">Total Amount:</span>
              <span className="text-lg">KES {orderData.totalAmount}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};