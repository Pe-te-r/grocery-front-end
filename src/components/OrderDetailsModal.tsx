import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideX,
  LucidePackage,
  LucidePackageCheck,
  LucidePackageX,
  LucidePackageSearch,
  LucideTruck,
  LucideCheckCircle2,
  LucideXCircle,
  LucideClock,
  LucideMapPin,
  LucideStore,
  LucidePhone,
  LucideCalendarClock,
  LucideChevronDown
} from 'lucide-react';
import { useGetCustomerOrderId } from '@/hooks/customerHook';

const OrderDetailsModal = ({ orderId, onClose }: { orderId: string; onClose: () => void }) => {
  const { data: orderDetails, isLoading } = useGetCustomerOrderId(orderId);
  const [selectedItemStatus, setSelectedItemStatus] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <LucideClock className="text-amber-500" />;
      case 'ready_for_pickup':
        return <LucidePackageSearch className="text-blue-500" />;
      case 'in_transit':
        return <LucideTruck className="text-indigo-500" />;
      case 'delivered':
      case 'completed':
        return <LucidePackageCheck className="text-green-500" />;
      case 'cancelled':
      case 'rejected':
        return <LucidePackageX className="text-red-500" />;
      default:
        return <LucidePackage className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Processing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'in_transit':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'ready_for_pickup':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = orderDetails?.data?.items
    ? selectedItemStatus === 'all'
      ? orderDetails.data.items
      : orderDetails.data.items.filter((item:any) => item.itemStatus === selectedItemStatus)
    : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        {isLoading ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 p-6 flex items-center justify-center h-64"
          >
            <div className="animate-spin">
              <LucidePackage className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>
        ) : orderDetails ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <p className="text-gray-600">Order #{orderDetails.data.id.slice(0, 8)}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              >
                <LucideX className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <LucideCalendarClock className="w-5 h-5 text-green-600" />
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${getStatusColor(orderDetails.data.status)} px-2 py-0.5 rounded-full text-xs`}>
                        {getStatusText(orderDetails.data.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">
                        {new Date(orderDetails.data.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Items:</span>
                      <span className="font-medium">{orderDetails.data.itemCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-medium">KES {orderDetails.data.totalAmount}</span>
                    </div>
                  </div>
                </div>
                
                {/* Delivery Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <LucideTruck className="w-5 h-5 text-green-600" />
                    Delivery Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method:</span>
                      <span className="font-medium capitalize">
                        {orderDetails.data.deliveryOption}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fee:</span>
                      <span className="font-medium">KES {orderDetails.data.deliveryFee}</span>
                    </div>
                    {orderDetails.data.deliveryOption === 'pickup' && orderDetails.data.pickUpLocation && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pickup Point:</span>
                          <span className="font-medium">{orderDetails.data.pickUpLocation.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Location:</span>
                          <span className="font-medium">
                            {orderDetails.data.pickUpLocation.constituency}, {orderDetails.data.pickUpLocation.county}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <LucideCheckCircle2 className="w-5 h-5 text-green-600" />
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method:</span>
                      <span className="font-medium uppercase">
                        {orderDetails.data.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">
                        {orderDetails.data.paymentPhone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium">
                        KES {parseFloat(orderDetails.data.totalAmount) + parseFloat(orderDetails.data.deliveryFee)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
                  <div className="relative">
                    <select
                      value={selectedItemStatus}
                      onChange={(e) => setSelectedItemStatus(e.target.value)}
                      className="px-3 py-1 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white text-sm"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Processing</option>
                      <option value="ready_for_pickup">Waiting for transport</option>
                      <option value="in_transit">On the Way</option>
                      <option value="delivered">Ready for pick up</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <LucideChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {filteredItems.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <LucidePackageSearch className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No items with this status</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((item: any) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                {getStatusIcon(item.itemStatus)}
                                <div>
                                  <h4 className="font-medium text-gray-800">{item.product.name}</h4>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(item.itemStatus)}`}>
                                      {getStatusText(item.itemStatus)}
                                    </span>
                                    <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                    <span className="text-sm text-gray-500">Code: {item.randomCode}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:items-end">
                              <span className="font-medium">KES {item.product.price}</span>
                              <span className="text-sm text-gray-500">Total: KES {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <LucideStore className="w-4 h-4" />
                              <span>{item.vendor.businessName}</span>
                              <span className="mx-1">•</span>
                              <LucideMapPin className="w-4 h-4" />
                              <span>{item.vendor.location}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end z-10">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center"
          >
            <LucideXCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Order Not Found</h3>
            <p className="text-gray-600 mb-4">We couldn't find details for this order.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;