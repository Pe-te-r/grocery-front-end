import { useUpdateOrderItem } from '@/hooks/ordersHook'
import { useStoreOrderQuery } from '@/hooks/storeHook'
import { getUserIdHelper } from '@/lib/authHelper'
import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Check, RefreshCw, X, User, Store, Home, MapPin, ChevronDown, ChevronUp, Grid, List } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/dashboard/orders/vendor-orders')({
  component: VendorOrdersPage,
})

export enum OrderStatus {
  PENDING = 'pending',
  READY_FOR_PICKUP = 'ready_for_pickup',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected'
}

function VendorOrdersPage() {
  const vendorId = getUserIdHelper() ?? ''
  const { data, isLoading, error, refetch } = useStoreOrderQuery(vendorId)
  const updateItemMutate = useUpdateOrderItem()
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [expandedBatches, setExpandedBatches] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const [visibleGroupCodes, setVisibleGroupCodes] = useState<Record<string, boolean>>({})

  // Transform and group the data by status and batchId
  const groupedOrders = data?.data && data?.data?.reduce((groups: any[], orderItem: any) => {
    // console.log('data infor',orderItem.order.)
    
    // Skip if not matching active tab
    if (orderItem.status !== activeTab) return groups

    const batchId = orderItem.order.batchId || 'no-batch'
    const status = orderItem.status
    const deliveryType = orderItem.order.deliveryOption
    const countyName = orderItem.order.location.county.name
    const deliveryPoint = deliveryType === 'pickup' 
      ? orderItem.order.location.station.id 
      : orderItem.order.location.id

    const groupKey = `${status}-${batchId}`
    const batchKey = `${groupKey}-${deliveryPoint}`

    let existingGroup = groups.find(g => g.key === groupKey)

    if (!existingGroup) {
      existingGroup = {
        key: groupKey,
        status,
        batchId,
        batches: []
      }
      groups.push(existingGroup)
    }

    let existingBatch = existingGroup.batches.find((b: any) => b.key === batchKey)

    if (!existingBatch) {
      existingBatch = {
        key: batchKey,
        deliveryType,
        countyName,
        deliveryPointId: deliveryPoint,
        deliveryPointName: deliveryType === 'pickup' 
          ? orderItem.order.location.station.name 
          : 'Home Delivery',
        orders: []
      }
      existingGroup.batches.push(existingBatch)
    }

    existingBatch.orders.push(orderItem)

    return groups
  }, []) || []

  // Sort groups by status and batchId
  groupedOrders.sort((a: any, b: any) => {
    if (a.status !== b.status) return a.status.localeCompare(b.status)
    return (a.batchId || '').localeCompare(b.batchId || '')
  })

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
  }

  const toggleBatch = (batchKey: string) => {
    setExpandedBatches(prev => ({
      ...prev,
      [batchKey]: !prev[batchKey]
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

  const markBatchAsReady = async (orders: any[]) => {
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

  const toggleGroupCodeVisibility = (orderItemId: string) => {
    setVisibleGroupCodes(prev => ({
      ...prev,
      [orderItemId]: !prev[orderItemId]
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
        <div className="flex items-center gap-4">
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
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-white shadow' : 'text-gray-500'}`}
              title="Card view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
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
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {groupedOrders.map((group: any) => {
            const isGroupExpanded = expandedGroups[group.key]

            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
              >
                <div 
                  className="p-4 border-b bg-green-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleGroup(group.key)}
                >
                  <div className="flex items-center gap-3">
                    <Package className="text-green-600 w-5 h-5" />
                    <div>
                      <h3 className="font-medium text-green-800">
                        {group.status.replace(/_/g, ' ')} ({group.batches.reduce((acc: number, batch: any) => acc + batch.orders.length, 0)} orders)
                      </h3>
                      <p className="text-sm text-green-600">
                        Batch: {group.batchId || 'No batch assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {activeTab === OrderStatus.PENDING && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          group.batches.forEach((batch: any) => markBatchAsReady(batch.orders))
                        }}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Mark All Ready
                      </motion.button>
                    )}

                    {isGroupExpanded ? <ChevronUp className="text-green-600" /> : <ChevronDown className="text-green-600" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isGroupExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="divide-y"
                    >
                      {group.batches.map((batch: any) => {
                        const isBatchExpanded = expandedBatches[batch.key]

                        return (
                          <div key={batch.key} className="border-b">
                            <div 
                              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleBatch(batch.key)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {batch.deliveryType === 'pickup' ? (
                                  <Store className="text-gray-600 w-5 h-5" />
                                ) : (
                                  <Home className="text-gray-600 w-5 h-5" />
                                )}
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {batch.deliveryPointName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {batch.countyName} • {batch.orders.length} orders
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {activeTab === OrderStatus.PENDING && (
                                  <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      markBatchAsReady(batch.orders)
                                    }}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-2"
                                  >
                                    <Check className="w-4 h-4" />
                                    Mark Ready
                                  </motion.button>
                                )}

                                {isBatchExpanded ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
                              </div>
                            </div>

                            <AnimatePresence>
                              {isBatchExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="divide-y"
                                >
                                  {batch.orders.map((orderItem: any) => (
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
                                        {activeTab === OrderStatus.READY_FOR_PICKUP && batch.deliveryType === 'pickup' && (
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
                          </div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedOrders.map((group: any) => {
            const isGroupExpanded = expandedGroups[group.key]

            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
              >
                <div 
                  className="p-4 border-b bg-green-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleGroup(group.key)}
                >
                  <div className="flex items-center gap-3">
                    <Package className="text-green-600 w-5 h-5" />
                    <div>
                      <h3 className="font-medium text-green-800">
                        {group.status.replace(/_/g, ' ')} ({group.batches.reduce((acc: number, batch: any) => acc + batch.orders.length, 0)} orders)
                      </h3>
                      <p className="text-sm text-green-600">
                        Batch: {group.batchId || 'No batch assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isGroupExpanded ? <ChevronUp className="text-green-600" /> : <ChevronDown className="text-green-600" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isGroupExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4"
                    >
                      {group.batches.map((batch: any) => {
                        const isBatchExpanded = expandedBatches[batch.key]

                        return (
                          <div key={batch.key} className="mb-6 last:mb-0">
                            <div 
                              className="flex justify-between items-center mb-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleBatch(batch.key)
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {batch.deliveryType === 'pickup' ? (
                                  <Store className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <Home className="w-4 h-4 text-gray-600" />
                                )}
                                <h4 className="font-medium">
                                  {batch.deliveryPointName} ({batch.orders.length})
                                </h4>
                                <span className="text-sm text-gray-500 ml-2">{batch.countyName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {activeTab === OrderStatus.PENDING && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      markBatchAsReady(batch.orders)
                                    }}
                                    className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    Mark All
                                  </button>
                                )}
                                {isBatchExpanded ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
                              </div>
                            </div>

                            <AnimatePresence>
                              {isBatchExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                >
                                  {batch.orders.map((orderItem: any) => (
                                    <motion.div
                                      key={orderItem.id}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-start gap-3 mb-3">
                                        <img
                                          src={orderItem.product.imageUrl}
                                          alt={orderItem.product.name}
                                          className="w-16 h-16 object-cover rounded-md border"
                                        />
                                        <div>
                                          <h4 className="font-medium line-clamp-1">{orderItem.product.name}</h4>
                                          <p className="text-green-600">KSh {orderItem.product.price}</p>
                                          <p className="text-sm">Qty: {orderItem.quantity}</p>
                                        </div>
                                      </div>

                                      <div className="space-y-2 text-sm mb-3">
                                        <div className="flex items-center gap-2">
                                          <User className="w-4 h-4" />
                                          <span>
                                            {orderItem.order.customer.first_name} {orderItem.order.customer.last_name}
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Order #{orderItem.order.id.slice(0, 8)}
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center">
                                        <div className={`px-2 py-1 rounded-full text-xs ${orderItem.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                          orderItem.status === OrderStatus.READY_FOR_PICKUP ? 'bg-purple-100 text-purple-800' :
                                            orderItem.status === OrderStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-800' :
                                              orderItem.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                          }`}>
                                          {orderItem.status.replace(/_/g, ' ')}
                                        </div>

                                        <div className="flex items-center gap-2">
                                          {activeTab === OrderStatus.READY_FOR_PICKUP && batch.deliveryType === 'pickup' && (
                                            <button
                                              onClick={() => toggleGroupCodeVisibility(orderItem.id)}
                                              className="text-xs text-green-600 hover:text-green-800"
                                            >
                                              {visibleGroupCodes[orderItem.id] ? orderItem.randomCode : 'Show Code'}
                                            </button>
                                          )}

                                          {activeTab === OrderStatus.PENDING && (
                                            <button
                                              onClick={() => updateOrderStatus(orderItem.id, OrderStatus.READY_FOR_PICKUP)}
                                              className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                                            >
                                              <Check className="w-3 h-3" />
                                              Ready
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
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