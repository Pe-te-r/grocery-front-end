import { useOrderById } from '@/hooks/ordersHook'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Package, CreditCard, Phone, Mail, MapPin, Loader2, AlertCircle, Home, Store, Truck, Clock } from 'lucide-react'
import { useState } from 'react'

interface OrderDetailsModalProps {
  orderId: string
  onClose: () => void
  viewType?: 'admin' | 'customer'
}

export const OrderDetailsModal = ({
  orderId,
  onClose,
  viewType = 'admin'
}: OrderDetailsModalProps) => {
  const { data, isLoading, isError, error } = useOrderById(orderId)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 300) // Match animation duration
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'ready_for_pickup': return 'bg-blue-100 text-blue-800'
      case 'in_transit': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderDeliveryInfo = (order: any) => {
    if (order.deliveryOption === 'pickup' && order.pickupDetails) {
      return (
        <div className="flex items-start gap-3">
          <Store className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium">Pickup Station</h4>
            <p>{order.pickupDetails.name}</p>
            <div className="mt-1 text-sm text-gray-600 space-y-1">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {order.pickupDetails.contactPhone}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {order.pickupDetails.openingHours}
              </p>
              <p>{order.pickupDetails.fullAddress}</p>
            </div>
          </div>
        </div>
      )
    } else if (order.deliveryOption === 'delivery' && order.deliveryDetails) {
      return (
        <div className="flex items-start gap-3">
          <Home className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium">Delivery Address</h4>
            <p>{order.deliveryDetails.fullAddress}</p>
          </div>
        </div>
      )
    }
    return null
  }

  const renderCustomerInfo = (customer: any) => {
    return (
      <div className="space-y-2">
        <p className="font-medium">{customer.name}</p>
        {viewType === 'admin' && (
          <>
            <p className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              {customer.email}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              {customer.phone}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span>Status:</span>
              <span className={`px-2 py-1 text-xs rounded-full ${customer.accountStatus === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {customer.accountStatus}
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  const renderItemDetails = (item: any) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
        {/* Product Image */}
        <div className="md:col-span-2">
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded-md border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-product.png'
            }}
          />
        </div>

        {/* Product Info */}
        <div className="md:col-span-4">
          <h5 className="font-medium">{item.product.name}</h5>
          <p className="text-green-700 font-medium">KSh {item.product.price}</p>
          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          <div className="mt-2">
            <span className="font-medium">Status:</span>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
              {item.status.replace(/_/g, ' ')}
            </span>
          </div>
          {item.estimatedDelivery && item.status === 'in_transit' && (
            <div className="text-sm mt-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Est. delivery: {formatDateTime(item.estimatedDelivery)}</span>
            </div>
          )}
        </div>

        {/* Vendor Info (admin only) */}
        {viewType === 'admin' && (
          <div className="md:col-span-6">
            <div className="flex items-start gap-2">
              <Store className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="font-medium">{item.vendor.businessName}</p>
                <p className="text-sm text-gray-600">{item.vendor.address}</p>
                <p className="text-sm flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3" /> {item.vendor.contact}
                </p>
                {item.vendor.location && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.vendor.location.constituency}, {item.vendor.location.county}
                  </p>
                )}
              </div>
            </div>
            {item.assignedDriver && (
              <div className="mt-3 flex items-start gap-2">
                <Truck className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">Driver: {item.assignedDriver.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.assignedDriver.vehicleType} • {item.assignedDriver.licensePlate}
                  </p>
                  <p className="text-sm flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {item.assignedDriver.phone}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-green-800">
                Order #{orderId.slice(0, 8)} Details
                <span className="ml-2 text-sm font-normal bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {viewType === 'admin' ? 'Admin View' : 'Customer View'}
                </span>
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition p-1"
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
                        <User className="w-5 h-5" /> Customer
                      </h4>
                      {renderCustomerInfo(data.data.customer)}
                    </div>

                    {/* Order Info */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5" /> Order
                      </h4>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Date:</span> {formatDateTime(data.data.createdAt)}
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
                        <p>
                          <span className="font-medium">Items:</span> {data.data.itemCount}
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
                          <span className="font-medium">Method:</span> {data.data.paymentMethod}
                        </p>
                        <p>
                          <span className="font-medium">Type:</span> {data.data.deliveryOption}
                        </p>
                        <p>
                          <span className="font-medium">Fee:</span> KSh {data.data.deliveryFee || '0.00'}
                        </p>
                        {renderDeliveryInfo(data.data)}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border rounded-lg overflow-hidden">
                    <h4 className="font-semibold text-green-700 bg-green-50 p-4 flex items-center gap-2">
                      <Package className="w-5 h-5" /> Items ({data.data.items?.length || 0})
                    </h4>
                    <div className="divide-y">
                      {data.data.items?.map((item: any) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {renderItemDetails(item)}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {(data.data.deliveryInstructions || data.data.specialInstructions) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        {data.data.deliveryInstructions ? 'Delivery Instructions' : 'Special Instructions'}
                      </h4>
                      <p className="text-yellow-700">
                        {data.data.deliveryInstructions || data.data.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Support Info for customers */}
                  {viewType === 'customer' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" /> +254712345678
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <Mail className="w-4 h-4" /> support@example.com
                      </div>
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
      )}
    </AnimatePresence>
  )
}