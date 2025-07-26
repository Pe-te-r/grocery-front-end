import { useUpdateOrderItem } from '@/hooks/ordersHook'
import { useStoreOrderQuery } from '@/hooks/storeHook'
import { getUserIdHelper } from '@/lib/authHelper'
import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Check, RefreshCw, X, User, Store, Home, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
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
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected'
}

function VendorOrdersPage() {
  const vendorId = getUserIdHelper() ?? ''
  const { data, isLoading, error, refetch } = useStoreOrderQuery(vendorId)
  const updateItemMutate = useUpdateOrderItem()
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  // Transform and group the data
  const groupedOrders = data?.data && data?.data?.reduce((groups: any[], orderItem: any) => {
    // Skip if not matching active tab
    if (orderItem.status !== activeTab) return groups

    const location = orderItem.order.location
    const countyId = location.county.id
    const countyName = location.county.name
    const deliveryType = orderItem.order.deliveryOption

    const groupKey = `${countyId}-${deliveryType}`


    const existingGroup = groups.find(g => g.key === groupKey)

    if (existingGroup) {
      existingGroup.orders.push(orderItem)
    } else {
      groups.push({
        key: groupKey,
        countyId,
        countyName,
        deliveryType,
        orders: [orderItem]
      })
    }

    return groups
  }, []) || []

  // Sort groups by county name
  groupedOrders.sort((a: { countyName: string }, b: { countyName: any }) => a.countyName.localeCompare(b.countyName))

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
  }

  const updateOrderStatus = async (orderItemId: string, newStatus: OrderStatus) => {
    try {
      await updateItemMutate.mutateAsync({ id: orderItemId, itemStatus: newStatus })
      toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`)
      refetch()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const markGroupAsReady = async (orders: any[]) => {
    try {
      await Promise.all(
        orders.map(order =>
          updateItemMutate.mutateAsync({
            id: order.id,
            itemStatus: OrderStatus.READY_FOR_PICKUP
          })
        )
      )
      toast.success(`${orders.length} orders marked as ready!`)
      refetch()
    } catch (error) {
      toast.error('Failed to update some orders')
    }
  }
  const [visibleGroupCodes, setVisibleGroupCodes] = useState<Record<string, boolean>>({})

  const toggleGroupCodeVisibility = (groupKey: string) => {
    setVisibleGroupCodes(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
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
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <X className="w-5 h-5" />
        <span>Failed to load orders</span>
      </div>
    )
  }


 
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-800">Your Orders</h1>
        <div className="flex gap-2">
          {Object.values(OrderStatus).map(status => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${activeTab === status
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {groupedOrders.length === 0 ? (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No {activeTab.replace(/_/g, ' ')} orders</h3>
          <p className="text-gray-600 mt-2">
            You don't have any orders in this status
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedOrders.map((group: any) => {
            const isExpanded = expandedGroups[group.key]

            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
              >
                <div className="p-4 border-b bg-green-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-green-600 w-5 h-5" />
                    <div>
                      <h3 className="font-medium text-green-800">
                        {group.countyName} ({group.orders.length} orders)
                      </h3>
                      <p className="text-sm text-green-600 capitalize">
                        {group.deliveryType} • {group.countyId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {activeTab === OrderStatus.PENDING && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => markGroupAsReady(group.orders)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Mark All Ready
                      </motion.button>
                    )}

                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="text-green-600 hover:text-green-800"
                    >
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="divide-y"
                    >
                      {group.orders.map((orderItem: any) => (
                        <motion.div
                          key={orderItem.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          {/* Product Info */}
                          <div className="flex items-start gap-3">
                            <img
                              src={orderItem.product.imageUrl}
                              alt={orderItem.product.name}
                              className="w-14 h-14 object-cover rounded-md border"
                            />
                            <div>
                              <h4 className="font-medium">{orderItem.product.name}</h4>
                              <p className="text-green-600">KSh {orderItem.product.price}</p>
                              <p className="text-sm">Qty: {orderItem.quantity}</p>
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4" />
                              <span>
                                {orderItem.order.customer.first_name} {orderItem.order.customer.last_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {group.deliveryType === 'pickup' ? (
                                <>
                                  <Store className="w-4 h-4" />
                                  <span>{orderItem.order.location.station.name}</span>
                                </>
                              ) : (
                                <>
                                  <Home className="w-4 h-4" />
                                  <span>Home Delivery</span>
                                </>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Order #{orderItem.order.id.slice(0, 8)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end gap-2">
                            <div className={`px-2 py-1 rounded-full text-xs ${orderItem.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                              orderItem.status === OrderStatus.READY_FOR_PICKUP ? 'bg-purple-100 text-purple-800' :
                                orderItem.status === OrderStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-800' :
                                  orderItem.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                              }`}>
                              {orderItem.status.replace(/_/g, ' ')}
                            </div>
                            {/* code toggle */}
                            {activeTab === OrderStatus.READY_FOR_PICKUP && group.deliveryType === 'pickup' && (
                              <div className="flex items-center gap-2">
                                {visibleGroupCodes[orderItem.id] ? (
                                  <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">
                                    {orderItem.randomCode}
                                  </div>
                                ) : (
                                  <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">
                                    ••••
                                  </div>
                                )}
                                <button
                                  onClick={() => toggleGroupCodeVisibility(orderItem.id)}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                >
                                  {visibleGroupCodes[orderItem.id] ? 'Hide' : 'Show'} Code
                                </button>
                              </div>
                            )}

                            {activeTab === OrderStatus.PENDING && (
                              <button
                                onClick={() => updateOrderStatus(orderItem.id, OrderStatus.READY_FOR_PICKUP)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Ready
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}