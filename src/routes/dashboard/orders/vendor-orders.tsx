import { useUpdateOrderItem } from '@/hooks/ordersHook'
import { useStoreOrderQuery } from '@/hooks/storeHook'
import { getUserIdHelper } from '@/lib/authHelper'
import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Check, RefreshCw, X, User, Store, Home, Truck, ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/dashboard/orders/vendor-orders')({
  component: VendorOrdersPage,
})

export enum OrderStatus {
  PENDING = 'pending',
  READY_FOR_PICKUP = 'ready_for_pickup',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

const VerificationModal = ({
  isOpen,
  onClose,
  onVerify,
  orderId,
  onCodeChange
}: {
  isOpen: boolean
  onClose: () => void
  onVerify: () => void
  orderId: string
  onCodeChange: (code: string) => void
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <ClipboardCheck className="w-6 h-6" />
                Verify Pickup
              </h3>
              <p className="text-gray-600 mb-6">
                Please verify the customer's identity for order #{orderId.slice(0, 8)}
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">Verification Code</h4>
                  <input
                    type="text"
                    placeholder="Enter verification code (1234)"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={(e) => onCodeChange(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Use code: 1234 for verification</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={onVerify}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Verify Pickup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function VendorOrdersPage() {
  const vendorId = getUserIdHelper() ?? ''
  const { data: orders, isLoading, error, refetch } = useStoreOrderQuery(vendorId)
  const updateItemMutate = useUpdateOrderItem()
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING)
  const [verificationModal, setVerificationModal] = useState({
    isOpen: false,
    orderId: '',
    verificationCode: ''
  })

  const filteredOrders = orders?.data?.filter((order: any) =>
    order.itemStatus === activeTab
  ) || []

  const updateOrderStatus = async (orderItemId: string, newStatus: OrderStatus) => {
    try {
      updateItemMutate.mutate({ id: orderItemId, itemStatus: newStatus }, {
        onSuccess: (data) => {
          if (data && data?.status == 'success') {
            toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`)
            refetch()
          }
        },
        onError: () => {
          toast.error('Failed to update order status')
        }
      })
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleVerifyPickup = (orderId: string) => {
    setVerificationModal({
      isOpen: true,
      orderId,
      verificationCode: ''
    })
  }

  const handleCodeChange = (code: string) => {
    setVerificationModal(prev => ({
      ...prev,
      verificationCode: code
    }))
  }

  const confirmVerification = () => {
    if (verificationModal.verificationCode === '1234') {
      // Update to IN_TRANSIT after successful verification
      updateOrderStatus(verificationModal.orderId, OrderStatus.IN_TRANSIT)
      setVerificationModal({ isOpen: false, orderId: '', verificationCode: '' })
      toast.success('Pickup verified! Order is now in transit')
    } else {
      toast.error('Invalid verification code. Please try again.')
    }
  }

  const getStatusButton = (orderItem: any) => {
    switch (orderItem.itemStatus) {
      case OrderStatus.PENDING:
        return (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateOrderStatus(orderItem.id, OrderStatus.READY_FOR_PICKUP)}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Mark as Ready
          </motion.button>
        )
      case OrderStatus.READY_FOR_PICKUP:
        return (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVerifyPickup(orderItem.id)}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            Verify Pickup
          </motion.button>
        )
      case OrderStatus.IN_TRANSIT:
        return (
          <div className="text-sm text-gray-500">
            Status will update to completed by delivery team
          </div>
        )
      case OrderStatus.COMPLETED:
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        return (
          <div className="text-sm text-gray-500">
            Order {orderItem.itemStatus.replace(/_/g, ' ')}
          </div>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2"
      >
        <X className="w-5 h-5" />
        <span>{error.message}</span>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <VerificationModal
        isOpen={verificationModal.isOpen}
        onClose={() => setVerificationModal({ isOpen: false, orderId: '', verificationCode: '' })}
        onVerify={confirmVerification}
        orderId={verificationModal.orderId}
        onCodeChange={handleCodeChange}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-2xl font-bold text-green-800">Your Orders</h1>
        <div className="text-sm text-gray-600">
          Showing: <span className="font-medium capitalize">{activeTab.replace(/_/g, ' ')}</span>
        </div>
      </motion.div>

      {/* Status Tabs */}
      <motion.div
        layout
        className="flex overflow-x-auto pb-2 mb-6 gap-1"
      >
        {Object.values(OrderStatus).map(status => (
          <motion.button
            key={status}
            layout
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-medium text-sm transition-colors cursor-pointer ${activeTab === status
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            whileHover={{ scale: activeTab === status ? 1 : 1.05 }}
          >
            {status.replace(/_/g, ' ')}
          </motion.button>
        ))}
      </motion.div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((orderItem: any) => (
              <motion.div
                key={orderItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b flex justify-between items-center bg-green-50">
                  <div>
                    <h3 className="font-medium text-green-800">
                      Order #{orderItem.order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(orderItem.order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-default ${orderItem.itemStatus === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                      orderItem.itemStatus === OrderStatus.READY_FOR_PICKUP ? 'bg-purple-100 text-purple-800' :
                        orderItem.itemStatus === OrderStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-800' :
                          orderItem.itemStatus === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                            orderItem.itemStatus === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                      }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {orderItem.itemStatus.replace(/_/g, ' ')}
                  </motion.span>
                </div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4"
                  layout
                >
                  {/* Product Info */}
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <img
                      src={orderItem.product.imageUrl}
                      alt={orderItem.product.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div>
                      <h4 className="font-medium">{orderItem.product.name}</h4>
                      <p className="text-green-600">KSh {orderItem.product.price}</p>
                      <p className="text-sm">Quantity: {orderItem.quantity}</p>
                      <p className="font-medium mt-1">
                        Subtotal: KSh {(parseFloat(orderItem.product.price) * orderItem.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>

                  {/* Customer & Delivery Info */}
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ x: 5 }}
                    >
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" /> Customer
                      </h4>
                      <p>{orderItem.order.customer.first_name} {orderItem.order.customer.last_name}</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                    >
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        {orderItem.order.deliveryOption === 'pickup' ? (
                          <Store className="w-4 h-4" />
                        ) : (
                          <Home className="w-4 h-4" />
                        )}
                        {orderItem.order.deliveryOption === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
                      </h4>
                      {orderItem.order.deliveryOption === 'pickup' && orderItem.order.pickStation ? (
                        <div>
                          <p className="font-medium">{orderItem.order.pickStation.name}</p>
                          {orderItem.order.pickStation.constituency?.name && (
                            <p className="text-sm text-gray-600">{orderItem.order.pickStation.constituency.name}</p>
                          )}
                        </div>
                      ) : orderItem.order.constituency ? (
                        <div>
                          <p className="font-medium">{orderItem.order.constituency.name}</p>
                          <p className="text-sm text-gray-600">Home Delivery</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Location not specified</p>
                      )}
                    </motion.div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Order Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        {getStatusButton(orderItem)}
                      </div>
                    </div>

                    {orderItem.order.deliveryInstructions && (
                      <motion.div
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                        whileHover={{ scale: 1.01 }}
                      >
                        <h4 className="font-medium text-yellow-800 text-sm mb-1">Customer Notes</h4>
                        <p className="text-yellow-700 text-sm">{orderItem.order.deliveryInstructions}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-50 border rounded-lg p-8 text-center"
            >
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No {activeTab.replace(/_/g, ' ')} orders</h3>
              <p className="text-gray-600 mt-2">
                You don't have any orders in this status
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}