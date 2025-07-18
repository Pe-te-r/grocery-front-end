import { useOrderById } from '@/hooks/ordersHook';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Package, CreditCard, Phone, Mail, MapPin, Loader2, AlertCircle, Home, Store } from 'lucide-react';

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

export const OrderDetailsModal = ({ orderId, onClose }: OrderDetailsModalProps) => {
  const { data, isLoading, isError, error } = useOrderById(orderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready_for_pickup':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-green-800">Order Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading order details...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-12 text-red-500">
                <AlertCircle className="w-8 h-8 mb-4" />
                <p className="text-center">{error?.message || 'Failed to load order details'}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : data?.data ? (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                      <User className="w-5 h-5" /> Customer Information
                    </h4>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Name:</span>
                        {data.data.customer.first_name} {data.data.customer.last_name}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {data.data.customer.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {data.data.customer.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${data.data.customer.account_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {data.data.customer.account_status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5" /> Order Information
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Order ID:</span> {data.data.id}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {new Date(data.data.created_at).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(data.data.status)}`}>
                          {data.data.status.replace(/_/g, ' ')}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Total:</span> KSh {data.data.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Payment & Delivery */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                      <CreditCard className="w-5 h-5" /> Payment & Delivery
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Payment Method:</span> {data.data.paymentMethod}
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="font-medium">Delivery:</span>
                        <span className="capitalize">{data.data.deliveryOption}</span>
                      </p>
                      <p>
                        <span className="font-medium">Delivery Fee:</span> KSh {data.data.deliveryFee}
                      </p>

                      {/* Enhanced Delivery/Pickup Details */}
                      <div className="mt-2 border-t pt-2">
                        {data.data.deliveryOption === 'pickup' && data.data.pickupDetails ? (
                          <div className="flex items-start gap-2">
                            <Store className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Pickup Station</p>
                              <p className="text-sm">{data.data.pickupDetails.name}</p>
                              {data.data.pickupDetails.location && (
                                <p className="text-sm text-gray-600">{data.data.pickupDetails.location}</p>
                              )}
                              {data.data.pickupDetails.contact && (
                                <p className="text-sm flex items-center gap-1 mt-1">
                                  <Phone className="w-3 h-3" /> {data.data.pickupDetails.contact}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : data.data.deliveryOption === 'delivery' && data.data.deliveryDetails ? (
                          <div className="flex items-start gap-2">
                            <Home className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Delivery Area</p>
                              <p className="text-sm">{data.data.deliveryDetails.name}</p>
                              {data.data.deliveryDetails.deliveryFee && (
                                <p className="text-sm text-gray-600">
                                  Delivery fee: KSh {data.data.deliveryDetails.deliveryFee}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {data.data.deliveryInstructions && (
                        <p className="mt-2">
                          <span className="font-medium">Instructions:</span> {data.data.deliveryInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border rounded-lg overflow-hidden">
                  <h4 className="font-semibold text-green-700 bg-green-50 p-4 flex items-center gap-2">
                    <Package className="w-5 h-5" /> Order Items
                  </h4>
                  <div className="divide-y">
                    {data.data.items.map((item: any) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4"
                      >
                        {/* Product Image */}
                        <div className="md:col-span-2">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="md:col-span-4">
                          <h5 className="font-medium">{item.product.name}</h5>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                          <p className="text-green-700 font-medium mt-1">KSh {item.product.price}</p>
                          <div className="mt-2">
                            <span className="font-medium">Item Status:</span>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(item.itemStatus)}`}>
                              {item.itemStatus.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Quantity & Subtotal */}
                        <div className="md:col-span-2 flex flex-col justify-center">
                          <p>Qty: {item.quantity}</p>
                          <p className="font-medium">
                            Subtotal: KSh {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Vendor Info */}
                        <div className="md:col-span-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 text-gray-500 flex-shrink-0" />
                            <div>
                              <p className="font-medium">{item.vendor.businessName}</p>
                              <p className="text-sm text-gray-600">{item.vendor.streetAddress}</p>
                              <p className="text-sm flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" /> {item.vendor.businessContact}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {data.data.specialInstructions && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Special Instructions</h4>
                    <p className="text-yellow-700">{data.data.specialInstructions}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <AlertCircle className="w-8 h-8 mb-4" />
                <p>No order data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};