import { useStoreOrderQuery } from '@/hooks/storeHook'
import { getUserIdHelper } from '@/lib/authHelper'
import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Check,  RefreshCw, X, User, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/orders/vendor-orders')({
  component: VendorOrdersPage,
})
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  ASSEMBLING = 'assembling',
  READY_FOR_PICKUP = 'ready_for_pickup',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}


function VendorOrdersPage() {
  const { data: orders, isLoading, error } = useStoreOrderQuery(getUserIdHelper() ?? '')
  console.log('data', orders)
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING)

  const filteredOrders = orders?.data?.filter((order: any) =>
    order.itemStatus === activeTab
  ) || []

  const updateOrderStatus = async (orderItemId: string, newStatus: OrderStatus) => {
    // Implement your status update logic here
    console.log(`Updating order ${orderItemId} to ${newStatus}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded flex items-center gap-2">
        <X className="w-5 h-5" />
        <span>{error.message}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-800">Your Orders</h1>
      </div>

      {/* Status Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6">
        {Object.values(OrderStatus).map(status => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 whitespace-nowrap border-b-2 font-medium text-sm ${activeTab === status
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((orderItem: any) => (
              <motion.div
                key={orderItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderItem.itemStatus === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                      orderItem.itemStatus === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                        orderItem.itemStatus === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                    }`}>
                    {orderItem.itemStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                  {/* Product Info */}
                  <div className="flex items-start gap-4">
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
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" /> Customer
                    </h4>
                    <p>{orderItem.order.customer.first_name} {orderItem.order.customer.last_name}</p>
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      {orderItem.order.customer.phone}
                    </p>
                    {orderItem.order.deliveryInstructions && (
                      <p className="text-sm text-yellow-700 mt-2">
                        <span className="font-medium">Note:</span> {orderItem.order.deliveryInstructions}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Delivery
                      </h4>
                      <p className="text-sm mt-1">
                        {orderItem.order.deliveryOption === 'pickup'
                          ? 'Customer pickup'
                          : 'Delivery to customer'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {orderItem.itemStatus === OrderStatus.PENDING && (
                        <button
                          onClick={() => updateOrderStatus(orderItem.id, OrderStatus.READY_FOR_PICKUP)}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Ready for Pickup
                        </button>
                      )}

                      {orderItem.itemStatus === OrderStatus.READY_FOR_PICKUP && (
                        <button
                          onClick={() => updateOrderStatus(orderItem.id, OrderStatus.COMPLETED)}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Mark as Completed
                        </button>
                      )}

                      <button className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Customer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border rounded-lg p-8 text-center"
            >
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No {activeTab} orders</h3>
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