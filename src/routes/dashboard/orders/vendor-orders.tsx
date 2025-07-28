import { createFileRoute } from '@tanstack/react-router'
import { useState, } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Package, Truck, CheckCircle, Clock, MapPin, Home, Box } from 'lucide-react'
import { useStoreOrderQuery  } from '@/hooks/storeHook'
import { getUserIdHelper } from '@/lib/authHelper'
import { useUpdateOrderItem } from '@/hooks/ordersHook'
import { OrderStatus } from './current'

const VendorOrdersPage = () => {
  const vendorId = getUserIdHelper() ?? ''
  const { data, isLoading, error, refetch } = useStoreOrderQuery(vendorId)
  const updateItemMutate = useUpdateOrderItem()
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING)
  const [expandedBatches, setExpandedBatches] = useState<Record<string, boolean>>({})
  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({})
  const [showCodes, setShowCodes] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')

  // Group orders by batch and then by location
  const groupedOrders = data?.data?.reduce((acc: any, item: any) => {
    if (item.status !== activeTab) return acc
    
    const batchId = item.order.batchId
    const locationKey = item.order.deliveryOption === 'pickup' 
      ? `pickup-${item.order.location.station.id}`
      : `delivery-${item.order.location.constituency.id}`

    if (!acc[batchId]) {
      acc[batchId] = {
        batchId,
        county: item.order.location.county,
        locations: {}
      }
    }

    if (!acc[batchId].locations[locationKey]) {
      acc[batchId].locations[locationKey] = {
        locationKey,
        deliveryOption: item.order.deliveryOption,
        station: item.order.location.station,
        constituency: item.order.location.constituency,
        deliveryInstructions: item.order.deliveryInstructions,
        randomCode: item.randomCode,
        items: []
      }
    }

    acc[batchId].locations[locationKey].items.push(item)
    return acc
  }, {})

  // Toggle batch expansion
  const toggleBatch = (batchId: string) => {
    setExpandedBatches(prev => ({
      ...prev,
      [batchId]: !prev[batchId]
    }))
  }

  // Toggle location expansion
  const toggleLocation = (locationKey: string) => {
    setExpandedLocations(prev => ({
      ...prev,
      [locationKey]: !prev[locationKey]
    }))
  }

  // Toggle code visibility
  const toggleCode = (locationKey: string) => {
    setShowCodes(prev => ({
      ...prev,
      [locationKey]: !prev[locationKey]
    }))
  }

  // Mark items as ready for pickup
  const markAsReady = (items: any[]) => {
    items.forEach(item => {
      if (item.status === OrderStatus.PENDING) {
        updateItemMutate.mutate({
          id: item.id,
          itemStatus: OrderStatus.READY_FOR_PICKUP
        })
      }
    })
  }

  // Status icon component
  const StatusIcon = ({ status }: { status: OrderStatus }) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-4 h-4 text-amber-500" />
      case OrderStatus.READY_FOR_PICKUP:
        return <Package className="w-4 h-4 text-blue-500" />
      case OrderStatus.IN_TRANSIT:
        return <Truck className="w-4 h-4 text-purple-500" />
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Box className="w-4 h-4 text-gray-500" />
    }
  }

  if (isLoading) return <div className="flex justify-center py-8">Loading orders...</div>
  if (error) return <div className="flex justify-center py-8 text-red-500">Error loading orders</div>

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        {Object.values(OrderStatus).map(status => (
          <button
            key={status}
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === status ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(status)}
          >
            <StatusIcon status={status} />
            {status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* View mode toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm font-medium rounded-l-lg ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-3 py-1 text-sm font-medium rounded-r-lg ${viewMode === 'card' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Card View
          </button>
        </div>
      </div>

      {!groupedOrders || Object.keys(groupedOrders).length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {activeTab.replace(/_/g, ' ')} orders found
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedOrders).map((batch: any) => (
            <motion.div 
              key={batch.batchId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                onClick={() => toggleBatch(batch.batchId)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-left">Batch: {batch.batchId.split('-').pop()}</h3>
                    <p className="text-sm text-gray-500 text-left">{batch.county.name}</p>
                  </div>
                </div>
                {expandedBatches[batch.batchId] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <AnimatePresence>
                {expandedBatches[batch.batchId] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    {Object.values(batch.locations).map((location: any) => (
                      <div key={location.locationKey} className="border-b border-gray-100 last:border-b-0">
                        <button
                          className="w-full p-4 bg-white hover:bg-gray-50 flex justify-between items-center"
                          onClick={() => toggleLocation(location.locationKey)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              {location.deliveryOption === 'pickup' ? (
                                <MapPin className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Home className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium">
                                {location.deliveryOption === 'pickup' 
                                  ? location.station.name 
                                  : `${location.constituency.name} Delivery`}
                              </h3>
                              {location.deliveryOption === 'delivery' && location.deliveryInstructions && (
                                <p className="text-sm text-gray-500 truncate max-w-md">{location.deliveryInstructions}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {activeTab === OrderStatus.PENDING && location.deliveryOption === 'pickup' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleCode(location.locationKey)
                                }}
                                className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200"
                              >
                                {showCodes[location.locationKey] ? 'Hide Code' : 'Show Code'}
                              </button>
                            )}
                            {expandedLocations[location.locationKey] ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedLocations[location.locationKey] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {/* Show pickup code if applicable */}
                              {activeTab === OrderStatus.PENDING && location.deliveryOption === 'pickup' && showCodes[location.locationKey] && (
                                <div className="px-4 py-3 bg-yellow-50 border-y border-yellow-100 flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-yellow-600" />
                                    <span className="font-medium">Pickup Code:</span>
                                  </div>
                                  <span className="text-2xl font-bold text-yellow-700">{location.randomCode}</span>
                                </div>
                              )}

                              {/* Action button for pending orders */}
                              {activeTab === OrderStatus.PENDING && (
                                <div className="px-4 py-3 bg-gray-50 border-y border-gray-100">
                                  <button
                                    onClick={() => markAsReady(location.items)}
                                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                                  >
                                    Mark as Ready for Pickup
                                  </button>
                                </div>
                              )}

                              {/* Order items */}
                              <div className={`p-4 ${viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}>
                                {location.items.map((item: any) => (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className={`${viewMode === 'card' ? 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow' : 'border-b border-gray-100 pb-4'}`}
                                  >
                                    <div className="flex gap-4">
                                      <div className="flex-shrink-0">
                                        <img 
                                          src={item.product.imageUrl} 
                                          alt={item.product.name}
                                          className="w-16 h-16 object-cover rounded-md"
                                        />
                                      </div>
                                      <div className="flex-grow">
                                        <h4 className="font-medium text-gray-800">{item.product.name}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        <p className="text-sm font-medium text-green-600">KSh {item.product.price}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                          <StatusIcon status={item.status} />
                                          <span className="text-xs text-gray-500 capitalize">{item.status.replace(/_/g, ' ')}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {viewMode === 'list' && (
                                      <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">
                                          Order ID: {item.order.id.split('-')[0]}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(item.order.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorOrdersPage
export const Route = createFileRoute('/dashboard/orders/vendor-orders')({
  component: VendorOrdersPage,
})

// export enum OrderStatus {
//   PENDING = 'pending',
//   READY_FOR_PICKUP = 'ready_for_pickup',
//   IN_TRANSIT = 'in_transit',
//   DELIVERED = 'delivered',
//   COMPLETED = 'completed',
//   CANCELLED = 'cancelled',
//   REJECTED = 'rejected'
// }

// function VendorOrdersPage() {
//   const vendorId = getUserIdHelper() ?? ''
//   const { data, isLoading, error, refetch } = useStoreOrderQuery(vendorId)
//   const updateItemMutate = useUpdateOrderItem()
//   const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING)
//   const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
//   const [expandedBatches, setExpandedBatches] = useState<Record<string, boolean>>({})
//   const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
//   const [visibleGroupCodes, setVisibleGroupCodes] = useState<Record<string, boolean>>({})

//   // Transform and group the data by status and batchId
//  // Transform and group the data by batchId, status, and delivery destination
// const groupedOrders = data?.data && data?.data?.reduce((groups: any[], orderItem: any) => {
//   const batchId = orderItem.order.batchId || 'no-batch'
//   const status = orderItem.status
  
//   // Determine delivery point key based on delivery type
//   const deliveryType = orderItem.order.deliveryOption
//   const deliveryPoint = deliveryType === 'pickup' 
//     ? orderItem.order.location.station.id 
//     : `${orderItem.order.location.constituency.id}-${orderItem.order.location.county.id}`

//   // Find or create batch group
//   let batchGroup = groups.find(g => g.batchId === batchId)
  
//   if (!batchGroup) {
//     batchGroup = {
//       batchId,
//       statusGroups: []
//     }
//     groups.push(batchGroup)
//   }

//   // Find or create status group within batch
//   let statusGroup = batchGroup.statusGroups.find((g: any) => g.status === status)
  
//   if (!statusGroup) {
//     statusGroup = {
//       status,
//       deliveryGroups: []
//     }
//     batchGroup.statusGroups.push(statusGroup)
//   }

//   // Find or create delivery group within status
//   let deliveryGroup = statusGroup.deliveryGroups.find((g: any) => 
//     g.deliveryType === deliveryType && g.deliveryPoint === deliveryPoint
//   )
  
//   if (!deliveryGroup) {
//     deliveryGroup = {
//       deliveryType,
//       deliveryPoint,
//       countyName: orderItem.order.location.county.name,
//       deliveryPointName: deliveryType === 'pickup' 
//         ? orderItem.order.location.station.name 
//         : `${orderItem.order.location.constituency.name} (Home Delivery)`,
//       orders: []
//     }
//     statusGroup.deliveryGroups.push(deliveryGroup)
//   }

//   deliveryGroup.orders.push(orderItem)

//   return groups
// }, []) || []

// // Sort groups
// groupedOrders.sort((a: any, b: any) => (a.batchId || '').localeCompare(b.batchId || ''))
// groupedOrders.forEach((batch: any) => {
//   batch.statusGroups.sort((a: any, b: any) => a.status.localeCompare(b.status))
//   batch.statusGroups.forEach((statusGroup: any) => {
//     statusGroup.deliveryGroups.sort((a: any, b: any) => 
//       a.deliveryPointName.localeCompare(b.deliveryPointName)
//     )
//   })
// })

//   const toggleGroup = (groupKey: string) => {
//     setExpandedGroups(prev => ({
//       ...prev,
//       [groupKey]: !prev[groupKey]
//     }))
//   }

//   const toggleBatch = (batchKey: string) => {
//     setExpandedBatches(prev => ({
//       ...prev,
//       [batchKey]: !prev[batchKey]
//     }))
//   }

//   const updateOrderStatus = async (orderItemId: string, newStatus: OrderStatus) => {
//     try {
//       await updateItemMutate.mutateAsync({ id: orderItemId, itemStatus: newStatus })
//       toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`)
//       refetch()
//     } catch (error) {
//       toast.error('Failed to update order status')
//     }
//   }

//   const markBatchAsReady = async (orders: any[]) => {
//     try {
//       await Promise.all(
//         orders.map(order =>
//           updateItemMutate.mutateAsync({
//             id: order.id,
//             itemStatus: OrderStatus.READY_FOR_PICKUP
//           })
//         )
//       )
//       toast.success(`${orders.length} orders marked as ready!`)
//       refetch()
//     } catch (error) {
//       toast.error('Failed to update some orders')
//     }
//   }

//   const toggleGroupCodeVisibility = (orderItemId: string) => {
//     setVisibleGroupCodes(prev => ({
//       ...prev,
//       [orderItemId]: !prev[orderItemId]
//     }))
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
//         <X className="w-5 h-5" />
//         <span>Failed to load orders</span>
//       </div>
//     )
//   }

//   // return (
//   // <div className="container mx-auto py-8">
//   //   <div className="flex justify-between items-center mb-8">
//   //     <h1 className="text-2xl font-bold text-green-800">Your Orders</h1>
//   //     <div className="flex items-center gap-4">
//   //       <div className="flex gap-2">
//   //         {Object.values(OrderStatus).map(status => (
//   //           <button
//   //             key={status}
//   //             onClick={() => setActiveTab(status)}
//   //             className={`px-3 py-1 rounded-lg text-sm transition-colors ${
//   //               activeTab === status
//   //                 ? 'bg-green-600 text-white shadow-md'
//   //                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//   //             }`}
//   //           >
//   //             {status.replace(/_/g, ' ')}
//   //           </button>
//   //         ))}
//   //       </div>
//   //       <div className="flex bg-gray-100 rounded-lg p-1">
//   //         <button
//   //           onClick={() => setViewMode('list')}
//   //           className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
//   //           title="List view"
//   //         >
//   //           <List className="w-4 h-4" />
//   //         </button>
//   //         <button
//   //           onClick={() => setViewMode('card')}
//   //           className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-white shadow' : 'text-gray-500'}`}
//   //           title="Card view"
//   //         >
//   //           <Grid className="w-4 h-4" />
//   //         </button>
//   //       </div>
//   //     </div>
//   //   </div>

//   //     {groupedOrders.length === 0 ? (
//   //       <div className="bg-gray-50 border rounded-lg p-8 text-center">
//   //         <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//   //         <h3 className="text-lg font-medium">No {activeTab.replace(/_/g, ' ')} orders</h3>
//   //         <p className="text-gray-600 mt-2">
//   //           You don't have any orders in this status
//   //         </p>
//   //       </div>
//   //     ) : viewMode === 'list' ? (
//   //       <div className="space-y-4">
//   //         {groupedOrders.map((group: any) => {
//   //           const isGroupExpanded = expandedGroups[group.key]

//   //           return (
//   //             <motion.div
//   //               key={group.key}
//   //               initial={{ opacity: 0, y: 10 }}
//   //               animate={{ opacity: 1, y: 0 }}
//   //               className="bg-white rounded-lg shadow-sm border overflow-hidden"
//   //             >
//   //               <div 
//   //                 className="p-4 border-b bg-green-50 flex justify-between items-center cursor-pointer"
//   //                 onClick={() => toggleGroup(group.key)}
//   //               >
//   //                 <div className="flex items-center gap-3">
//   //                   <Package className="text-green-600 w-5 h-5" />
//   //                   <div>
//   //                     <h3 className="font-medium text-green-800">
//   //                       {group.status.replace(/_/g, ' ')} ({group.batches.reduce((acc: number, batch: any) => acc + batch.orders.length, 0)} orders)
//   //                     </h3>
//   //                     <p className="text-sm text-green-600">
//   //                       Batch: {group.batchId || 'No batch assigned'}
//   //                     </p>
//   //                   </div>
//   //                 </div>

//   //                 <div className="flex items-center gap-3">
//   //                   {activeTab === OrderStatus.PENDING && (
//   //                     <motion.button
//   //                       whileHover={{ scale: 1.03 }}
//   //                       whileTap={{ scale: 0.98 }}
//   //                       onClick={(e) => {
//   //                         e.stopPropagation()
//   //                         group.batches.forEach((batch: any) => markBatchAsReady(batch.orders))
//   //                       }}
//   //                       className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-2"
//   //                     >
//   //                       <Check className="w-4 h-4" />
//   //                       Mark All Ready
//   //                     </motion.button>
//   //                   )}

//   //                   {isGroupExpanded ? <ChevronUp className="text-green-600" /> : <ChevronDown className="text-green-600" />}
//   //                 </div>
//   //               </div>

//   //               <AnimatePresence>
//   //                 {isGroupExpanded && (
//   //                   <motion.div
//   //                     initial={{ opacity: 0, height: 0 }}
//   //                     animate={{ opacity: 1, height: 'auto' }}
//   //                     exit={{ opacity: 0, height: 0 }}
//   //                     className="divide-y"
//   //                   >
//   //                     {group.batches.map((batch: any) => {
//   //                       const isBatchExpanded = expandedBatches[batch.key]

//   //                       return (
//   //                         <div key={batch.key} className="border-b">
//   //                           <div 
//   //                             className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
//   //                             onClick={(e) => {
//   //                               e.stopPropagation()
//   //                               toggleBatch(batch.key)
//   //                             }}
//   //                           >
//   //                             <div className="flex items-center gap-3">
//   //                               {batch.deliveryType === 'pickup' ? (
//   //                                 <Store className="text-gray-600 w-5 h-5" />
//   //                               ) : (
//   //                                 <Home className="text-gray-600 w-5 h-5" />
//   //                               )}
//   //                               <div>
//   //                                 <h4 className="font-medium text-gray-800">
//   //                                   {batch.deliveryPointName}
//   //                                 </h4>
//   //                                 <p className="text-sm text-gray-600">
//   //                                   {batch.countyName} • {batch.orders.length} orders
//   //                                 </p>
//   //                               </div>
//   //                             </div>

//   //                             <div className="flex items-center gap-3">
//   //                               {activeTab === OrderStatus.PENDING && (
//   //                                 <motion.button
//   //                                   whileHover={{ scale: 1.03 }}
//   //                                   whileTap={{ scale: 0.98 }}
//   //                                   onClick={(e) => {
//   //                                     e.stopPropagation()
//   //                                     markBatchAsReady(batch.orders)
//   //                                   }}
//   //                                   className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-2"
//   //                                 >
//   //                                   <Check className="w-4 h-4" />
//   //                                   Mark Ready
//   //                                 </motion.button>
//   //                               )}

//   //                               {isBatchExpanded ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
//   //                             </div>
//   //                           </div>

//   //                           <AnimatePresence>
//   //                             {isBatchExpanded && (
//   //                               <motion.div
//   //                                 initial={{ opacity: 0, height: 0 }}
//   //                                 animate={{ opacity: 1, height: 'auto' }}
//   //                                 exit={{ opacity: 0, height: 0 }}
//   //                                 className="divide-y"
//   //                               >
//   //                                 {batch.orders.map((orderItem: any) => (
//   //                                   <motion.div
//   //                                     key={orderItem.id}
//   //                                     initial={{ opacity: 0 }}
//   //                                     animate={{ opacity: 1 }}
//   //                                     className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
//   //                                   >
//   //                                     {/* Product Info */}
//   //                                     <div className="flex items-start gap-3">
//   //                                       <img
//   //                                         src={orderItem.product.imageUrl}
//   //                                         alt={orderItem.product.name}
//   //                                         className="w-14 h-14 object-cover rounded-md border"
//   //                                       />
//   //                                       <div>
//   //                                         <h4 className="font-medium">{orderItem.product.name}</h4>
//   //                                         <p className="text-green-600">KSh {orderItem.product.price}</p>
//   //                                         <p className="text-sm">Qty: {orderItem.quantity}</p>
//   //                                       </div>
//   //                                     </div>

//   //                                     {/* Order Details */}
//   //                                     <div className="space-y-2">
//   //                                       <div className="flex items-center gap-2 text-sm">
//   //                                         <User className="w-4 h-4" />
//   //                                         <span>
//   //                                           {orderItem.order.customer.first_name} {orderItem.order.customer.last_name}
//   //                                         </span>
//   //                                       </div>
//   //                                       <div className="text-xs text-gray-500">
//   //                                         Order #{orderItem.order.id.slice(0, 8)}
//   //                                       </div>
//   //                                     </div>

//   //                                     {/* Actions */}
//   //                                     <div className="flex flex-col items-end gap-2">
//   //                                       <div className={`px-2 py-1 rounded-full text-xs ${orderItem.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
//   //                                         orderItem.status === OrderStatus.READY_FOR_PICKUP ? 'bg-purple-100 text-purple-800' :
//   //                                           orderItem.status === OrderStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-800' :
//   //                                             orderItem.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
//   //                                               'bg-gray-100 text-gray-800'
//   //                                         }`}>
//   //                                         {orderItem.status.replace(/_/g, ' ')}
//   //                                       </div>
//   //                                       {/* code toggle */}
//   //                                       {activeTab === OrderStatus.READY_FOR_PICKUP && batch.deliveryType === 'pickup' && (
//   //                                         <div className="flex items-center gap-2">
//   //                                           {visibleGroupCodes[orderItem.id] ? (
//   //                                             <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">
//   //                                               {orderItem.randomCode}
//   //                                             </div>
//   //                                           ) : (
//   //                                             <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">
//   //                                               ••••
//   //                                             </div>
//   //                                           )}
//   //                                           <button
//   //                                             onClick={() => toggleGroupCodeVisibility(orderItem.id)}
//   //                                             className="text-green-600 hover:text-green-800 text-sm"
//   //                                           >
//   //                                             {visibleGroupCodes[orderItem.id] ? 'Hide' : 'Show'} Code
//   //                                           </button>
//   //                                         </div>
//   //                                       )}

//   //                                       {activeTab === OrderStatus.PENDING && (
//   //                                         <button
//   //                                           onClick={() => updateOrderStatus(orderItem.id, OrderStatus.READY_FOR_PICKUP)}
//   //                                           className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-1"
//   //                                         >
//   //                                           <Check className="w-3 h-3" />
//   //                                           Ready
//   //                                         </button>
//   //                                       )}
//   //                                     </div>
//   //                                   </motion.div>
//   //                                 ))}
//   //                               </motion.div>
//   //                             )}
//   //                           </AnimatePresence>
//   //                         </div>
//   //                       )
//   //                     })}
//   //                   </motion.div>
//   //                 )}
//   //               </AnimatePresence>
//   //             </motion.div>
//   //           )
//   //         })}
//   //       </div>
//   //     ) : (
//   //       <div className="space-y-4">
//   //         {groupedOrders.map((group: any) => {
//   //           const isGroupExpanded = expandedGroups[group.key]

//   //           return (
//   //             <motion.div
//   //               key={group.key}
//   //               initial={{ opacity: 0, y: 10 }}
//   //               animate={{ opacity: 1, y: 0 }}
//   //               className="bg-white rounded-lg shadow-sm border overflow-hidden"
//   //             >
//   //               <div 
//   //                 className="p-4 border-b bg-green-50 flex justify-between items-center cursor-pointer"
//   //                 onClick={() => toggleGroup(group.key)}
//   //               >
//   //                 <div className="flex items-center gap-3">
//   //                   <Package className="text-green-600 w-5 h-5" />
//   //                   <div>
//   //                     <h3 className="font-medium text-green-800">
//   //                       {group.status.replace(/_/g, ' ')} ({group.batches.reduce((acc: number, batch: any) => acc + batch.orders.length, 0)} orders)
//   //                     </h3>
//   //                     <p className="text-sm text-green-600">
//   //                       Batch: {group.batchId || 'No batch assigned'}
//   //                     </p>
//   //                   </div>
//   //                 </div>

//   //                 <div className="flex items-center gap-3">
//   //                   {isGroupExpanded ? <ChevronUp className="text-green-600" /> : <ChevronDown className="text-green-600" />}
//   //                 </div>
//   //               </div>

//   //               <AnimatePresence>
//   //                 {isGroupExpanded && (
//   //                   <motion.div
//   //                     initial={{ opacity: 0, height: 0 }}
//   //                     animate={{ opacity: 1, height: 'auto' }}
//   //                     exit={{ opacity: 0, height: 0 }}
//   //                     className="p-4"
//   //                   >
//   //                     {group.batches.map((batch: any) => {
//   //                       const isBatchExpanded = expandedBatches[batch.key]

//   //                       return (
//   //                         <div key={batch.key} className="mb-6 last:mb-0">
//   //                           <div 
//   //                             className="flex justify-between items-center mb-3 cursor-pointer"
//   //                             onClick={(e) => {
//   //                               e.stopPropagation()
//   //                               toggleBatch(batch.key)
//   //                             }}
//   //                           >
//   //                             <div className="flex items-center gap-2">
//   //                               {batch.deliveryType === 'pickup' ? (
//   //                                 <Store className="w-4 h-4 text-gray-600" />
//   //                               ) : (
//   //                                 <Home className="w-4 h-4 text-gray-600" />
//   //                               )}
//   //                               <h4 className="font-medium">
//   //                                 {batch.deliveryPointName} ({batch.orders.length})
//   //                               </h4>
//   //                               <span className="text-sm text-gray-500 ml-2">{batch.countyName}</span>
//   //                             </div>
//   //                             <div className="flex items-center gap-2">
//   //                               {activeTab === OrderStatus.PENDING && (
//   //                                 <button
//   //                                   onClick={(e) => {
//   //                                     e.stopPropagation()
//   //                                     markBatchAsReady(batch.orders)
//   //                                   }}
//   //                                   className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
//   //                                 >
//   //                                   <Check className="w-3 h-3" />
//   //                                   Mark All
//   //                                 </button>
//   //                               )}
//   //                               {isBatchExpanded ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
//   //                             </div>
//   //                           </div>

//   //                           <AnimatePresence>
//   //                             {isBatchExpanded && (
//   //                               <motion.div
//   //                                 initial={{ opacity: 0, height: 0 }}
//   //                                 animate={{ opacity: 1, height: 'auto' }}
//   //                                 exit={{ opacity: 0, height: 0 }}
//   //                                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//   //                               >
//   //                                 {batch.orders.map((orderItem: any) => (
//   //                                   <motion.div
//   //                                     key={orderItem.id}
//   //                                     initial={{ opacity: 0 }}
//   //                                     animate={{ opacity: 1 }}
//   //                                     className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//   //                                   >
//   //                                     <div className="flex items-start gap-3 mb-3">
//   //                                       <img
//   //                                         src={orderItem.product.imageUrl}
//   //                                         alt={orderItem.product.name}
//   //                                         className="w-16 h-16 object-cover rounded-md border"
//   //                                       />
//   //                                       <div>
//   //                                         <h4 className="font-medium line-clamp-1">{orderItem.product.name}</h4>
//   //                                         <p className="text-green-600">KSh {orderItem.product.price}</p>
//   //                                         <p className="text-sm">Qty: {orderItem.quantity}</p>
//   //                                       </div>
//   //                                     </div>

//   //                                     <div className="space-y-2 text-sm mb-3">
//   //                                       <div className="flex items-center gap-2">
//   //                                         <User className="w-4 h-4" />
//   //                                         <span>
//   //                                           {orderItem.order.customer.first_name} {orderItem.order.customer.last_name}
//   //                                         </span>
//   //                                       </div>
//   //                                       <div className="text-xs text-gray-500">
//   //                                         Order #{orderItem.order.id.slice(0, 8)}
//   //                                       </div>
//   //                                     </div>

//   //                                     <div className="flex justify-between items-center">
//   //                                       <div className={`px-2 py-1 rounded-full text-xs ${orderItem.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
//   //                                         orderItem.status === OrderStatus.READY_FOR_PICKUP ? 'bg-purple-100 text-purple-800' :
//   //                                           orderItem.status === OrderStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-800' :
//   //                                             orderItem.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
//   //                                               'bg-gray-100 text-gray-800'
//   //                                         }`}>
//   //                                         {orderItem.status.replace(/_/g, ' ')}
//   //                                       </div>

//   //                                       <div className="flex items-center gap-2">
//   //                                         {activeTab === OrderStatus.READY_FOR_PICKUP && batch.deliveryType === 'pickup' && (
//   //                                           <button
//   //                                             onClick={() => toggleGroupCodeVisibility(orderItem.id)}
//   //                                             className="text-xs text-green-600 hover:text-green-800"
//   //                                           >
//   //                                             {visibleGroupCodes[orderItem.id] ? orderItem.randomCode : 'Show Code'}
//   //                                           </button>
//   //                                         )}

//   //                                         {activeTab === OrderStatus.PENDING && (
//   //                                           <button
//   //                                             onClick={() => updateOrderStatus(orderItem.id, OrderStatus.READY_FOR_PICKUP)}
//   //                                             className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
//   //                                           >
//   //                                             <Check className="w-3 h-3" />
//   //                                             Ready
//   //                                           </button>
//   //                                         )}
//   //                                       </div>
//   //                                     </div>
//   //                                   </motion.div>
//   //                                 ))}
//   //                               </motion.div>
//   //                             )}
//   //                           </AnimatePresence>
//   //                         </div>
//   //                       )
//   //                     })}
//   //                   </motion.div>
//   //                 )}
//   //               </AnimatePresence>
//   //             </motion.div>
//   //           )
//   //         })}
//   //       </div>
//   //     )}
//   //   </div>
//   // )


//   return (
//   <div className="container mx-auto py-8">
//     <div className="flex justify-between items-center mb-8">
//       <h1 className="text-2xl font-bold text-green-800">Your Orders</h1>
//       <div className="flex items-center gap-4">
//         <div className="flex gap-2">
//           {Object.values(OrderStatus).map(status => (
//             <button
//               key={status}
//               onClick={() => setActiveTab(status)}
//               className={`px-3 py-1 rounded-lg text-sm transition-colors ${
//                 activeTab === status
//                   ? 'bg-green-600 text-white shadow-md'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               {status.replace(/_/g, ' ')}
//             </button>
//           ))}
//         </div>
//         <div className="flex bg-gray-100 rounded-lg p-1">
//           <button
//             onClick={() => setViewMode('list')}
//             className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
//             title="List view"
//           >
//             <List className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setViewMode('card')}
//             className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-white shadow' : 'text-gray-500'}`}
//             title="Card view"
//           >
//             <Grid className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>

//     {groupedOrders.length === 0 ? (
//       <div className="bg-gray-50 border rounded-lg p-8 text-center">
//         <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//         <h3 className="text-lg font-medium">No {activeTab.replace(/_/g, ' ')} orders</h3>
//         <p className="text-gray-600 mt-2">
//           You don't have any orders in this status
//         </p>
//       </div>
//     ) : viewMode === 'list' ? (
//       <div className="space-y-6">
//         {groupedOrders.map((batchGroup:any) => {
//           const isBatchExpanded = expandedGroups[batchGroup.batchId];

//           return (
//             <motion.div
//               key={batchGroup.batchId}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white rounded-lg shadow-sm border overflow-hidden"
//             >
//               <div 
//                 className="p-4 border-b bg-green-50 flex justify-between items-center cursor-pointer"
//                 onClick={() => toggleGroup(batchGroup.batchId)}
//               >
//                 <div className="flex items-center gap-3">
//                   <Package className="text-green-600 w-5 h-5" />
//                   <div>
//                     <h3 className="font-medium text-green-800">
//                       Batch: {batchGroup.batchId || 'No batch assigned'}
//                     </h3>
//                     <p className="text-sm text-green-600">
//                       {batchGroup.statusGroups.reduce((acc:any, statusGroup:any) => 
//                         acc + statusGroup.deliveryGroups.reduce((sum:any, deliveryGroup:any) => 
//                           sum + deliveryGroup.orders.length, 0), 0)} total orders
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   {isBatchExpanded ? <ChevronUp className="text-green-600" /> : <ChevronDown className="text-green-600" />}
//                 </div>
//               </div>

//               <AnimatePresence>
//                 {isBatchExpanded && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="divide-y"
//                   >
//                     {batchGroup.statusGroups
//                       .filter((statusGroup: any
                        
//                       ) => statusGroup.status === activeTab)
//                       .map((statusGroup: any) => {
//                         const statusOrderCount = statusGroup.deliveryGroups.reduce(
//                           (acc: any, deliveryGroup: any) => acc + deliveryGroup.orders.length, 0
//                         );

//                         return (
//                           <div key={`${batchGroup.batchId}-${statusGroup.status}`} className="p-4">
//                             <div className="flex justify-between items-center mb-3">
//                               <div className="flex items-center gap-2">
//                                 <div className={`w-3 h-3 rounded-full ${
//                                   statusGroup.status === OrderStatus.PENDING ? 'bg-yellow-500' :
//                                   statusGroup.status === OrderStatus.READY_FOR_PICKUP ? 'bg-purple-500' :
//                                   statusGroup.status === OrderStatus.IN_TRANSIT ? 'bg-blue-500' :
//                                   statusGroup.status === OrderStatus.COMPLETED ? 'bg-green-500' :
//                                   'bg-gray-500'
//                                 }`}></div>
//                                 <h4 className="font-medium">
//                                   {statusGroup.status.replace(/_/g, ' ')} ({statusOrderCount})
//                                 </h4>
//                               </div>
//                               {statusGroup.status === OrderStatus.PENDING && (
//                                 <button
//                                   onClick={() => statusGroup.deliveryGroups.forEach((group: any) => 
//                                     markBatchAsReady(group.orders)
//                                   )}
//                                   className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-1"
//                                 >
//                                   <Check className="w-3 h-3" />
//                                   Mark all ready
//                                 </button>
//                               )}
//                             </div>

//                             {statusGroup.deliveryGroups.map((deliveryGroup: any) => {
//                               const isDeliveryExpanded = expandedBatches[deliveryGroup.deliveryPoint];

//                               return (
//                                 <div 
//                                   key={`${batchGroup.batchId}-${statusGroup.status}-${deliveryGroup.deliveryPoint}`} 
//                                   className="mb-4"
//                                 >
//                                   <div 
//                                     className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer"
//                                     onClick={() => toggleBatch(deliveryGroup.deliveryPoint)}
//                                   >
//                                     {deliveryGroup.deliveryType === 'pickup' ? (
//                                       <Store className="text-gray-600 w-5 h-5" />
//                                     ) : (
//                                       <Home className="text-gray-600 w-5 h-5" />
//                                     )}
//                                     <div className="flex-1">
//                                       <h4 className="font-medium">{deliveryGroup.deliveryPointName}</h4>
//                                       <p className="text-sm text-gray-600">
//                                         {deliveryGroup.countyName} • {deliveryGroup.orders.length} orders
//                                       </p>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                       {statusGroup.status === OrderStatus.PENDING && (
//                                         <button
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             markBatchAsReady(deliveryGroup.orders);
//                                           }}
//                                           className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg flex items-center gap-1"
//                                         >
//                                           <Check className="w-3 h-3" />
//                                           Ready
//                                         </button>
//                                       )}
//                                       {isDeliveryExpanded ? (
//                                         <ChevronUp className="text-gray-600" />
//                                       ) : (
//                                         <ChevronDown className="text-gray-600" />
//                                       )}
//                                     </div>
//                                   </div>

//                                   <AnimatePresence>
//                                     {isDeliveryExpanded && (
//                                       <motion.div
//                                         initial={{ opacity: 0, height: 0 }}
//                                         animate={{ opacity: 1, height: 'auto' }}
//                                         exit={{ opacity: 0, height: 0 }}
//                                         className="divide-y"
//                                       >
//                                         {deliveryGroup.orders.map((orderItem: any) => (
//                                           <motion.div
//                                             key={orderItem.id}
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
//                                           >
//                                             {/* Product Info */}
//                                             <div className="flex items-start gap-3">
//                                               <img
//                                                 src={orderItem.product.imageUrl}
//                                                 alt={orderItem.product.name}
//                                                 className="w-14 h-14 object-cover rounded-md border"
//                                               />
//                                               <div>
//                                                 <h4 className="font-medium">{orderItem.product.name}</h4>
//                                                 <p className="text-green-600">KSh {orderItem.product.price}</p>
//                                                 <p className="text-sm">Qty: {orderItem.quantity}</p>
//                                               </div>
//                                             </div>

//                                             {/* Order Details */}
//                                             <div className="space-y-2">
//                                               <div className="flex items-center gap-2 text-sm">
//                                                 <User className="w-4 h-4" />
//                                                 <span>
//                                                   {orderItem.order.customer.first_name} {orderItem.order.customer.last_name}
//                                                 </span>
//                                               </div>
//                                               <div className="text-xs text-gray-500">
//                                                 Order #{orderItem.order.id.slice(0, 8)}
//                                               </div>
//                                             </div>

//                                             {/* Actions */}
//                                             <div className="flex flex-col items-end gap-2">
//                                               <div className={`px-2 py-1 rounded-full text-xs ${
//                                                 orderItem.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
//                                                 orderItem.status === OrderStatus.READY_FOR_PICKUP ? 'bg-purple-100 text-purple-800' :
//                                                 orderItem.status === OrderStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-800' :
//                                                 orderItem.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
//                                                 'bg-gray-100 text-gray-800'
//                                               }`}>
//                                                 {orderItem.status.replace(/_/g, ' ')}
//                                               </div>
                                              
//                                               {activeTab === OrderStatus.READY_FOR_PICKUP && deliveryGroup.deliveryType === 'pickup' && (
//                                                 <div className="flex items-center gap-2">
//                                                   {visibleGroupCodes[orderItem.id] ? (
//                                                     <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">
//                                                       {orderItem.randomCode}
//                                                     </div>
//                                                   ) : (
//                                                     <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">
//                                                       ••••
//                                                     </div>
//                                                   )}
//                                                   <button
//                                                     onClick={() => toggleGroupCodeVisibility(orderItem.id)}
//                                                     className="text-green-600 hover:text-green-800 text-sm"
//                                                   >
//                                                     {visibleGroupCodes[orderItem.id] ? 'Hide' : 'Show'} Code
//                                                   </button>
//                                                 </div>
//                                               )}

//                                               {activeTab === OrderStatus.PENDING && (
//                                                 <button
//                                                   onClick={() => updateOrderStatus(orderItem.id, OrderStatus.READY_FOR_PICKUP)}
//                                                   className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-1"
//                                                 >
//                                                   <Check className="w-3 h-3" />
//                                                   Ready
//                                                 </button>
//                                               )}
//                                             </div>
//                                           </motion.div>
//                                         ))}
//                                       </motion.div>
//                                     )}
//                                   </AnimatePresence>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         );
//                       })}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           );
//         })}
//       </div>
//     ) : (
//       <div className="space-y-6">
//         {groupedOrders.map((batchGroup: any) => {
//           const isBatchExpanded = expandedGroups[batchGroup.batchId];

//           return (
//             <motion.div
//               key={batchGroup.batchId}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white rounded-lg shadow-sm border overflow-hidden"
//             >
//               <div 
//                 className="p-4 border-b bg-green-50 flex justify-between items-center cursor-pointer"
//                 onClick={() => toggleGroup(batchGroup.batchId)}
//               >
//                 <div className="flex items-center gap-3">
//                   <Package className="text-green-600 w-5 h-5" />
//                   <div>
//                     <h3 className="font-medium text-green-800">
//                       Batch: {batchGroup.batchId || 'No batch assigned'}
//                     </h3>
//                   </div>
//                 </div>
//                 {isBatchExpanded ? <ChevronUp className="text-green-600" /> : <ChevronDown className="text-green-600" />}
//               </div>

//               <AnimatePresence>
//                 {isBatchExpanded && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="p-4"
//                   >
//                     {batchGroup.statusGroups
//                       .filter((statusGroup: any) => statusGroup.status === activeTab)
//                       .map((statusGroup: any) => (
//                         <div key={`${batchGroup.batchId}-${statusGroup.status}`} className="mb-6">
//                           <div className="flex justify-between items-center mb-3">
//                             <h4 className="font-medium">
//                               {statusGroup.status.replace(/_/g, ' ')} ({statusGroup.deliveryGroups.reduce((acc: any, group: any

//                               ) => acc + group.orders.length, 0)})
//                             </h4>
//                             {statusGroup.status === OrderStatus.PENDING && (
//                               <button
//                                 onClick={() => statusGroup.deliveryGroups.forEach((group: any) => 
//                                   markBatchAsReady(group.orders)
//                             )}
//                                 className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
//                               >
//                                 <Check className="w-3 h-3" />
//                                 Mark all ready
//                               </button>
//                             )}
//                           </div>

//                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {statusGroup.deliveryGroups.map((deliveryGroup: any) => (
//                               <div 
//                                 key={`${batchGroup.batchId}-${statusGroup.status}-${deliveryGroup.deliveryPoint}`}
//                                 className="border rounded-lg p-4"
//                               >
//                                 <div className="flex items-center gap-2 mb-3">
//                                   {deliveryGroup.deliveryType === 'pickup' ? (
//                                     <Store className="w-4 h-4 text-gray-600" />
//                                   ) : (
//                                     <Home className="w-4 h-4 text-gray-600" />
//                                   )}
//                                   <h5 className="font-medium">{deliveryGroup.deliveryPointName}</h5>
//                                 </div>
//                                 <p className="text-sm text-gray-500 mb-3">{deliveryGroup.countyName}</p>

//                                 {deliveryGroup.orders.map((orderItem: any) => (
//                                   <div key={orderItem.id} className="border-t pt-3 mt-3">
//                                     <div className="flex items-start gap-3 mb-2">
//                                       <img
//                                         src={orderItem.product.imageUrl}
//                                         alt={orderItem.product.name}
//                                         className="w-12 h-12 object-cover rounded-md border"
//                                       />
//                                       <div>
//                                         <h5 className="font-medium">{orderItem.product.name}</h5>
//                                         <p className="text-green-600 text-sm">KSh {orderItem.product.price}</p>
//                                         <p className="text-xs">Qty: {orderItem.quantity}</p>
//                                       </div>
//                                     </div>

//                                     <div className="flex justify-between items-center mt-2">
//                                       <div className={`px-2 py-1 rounded-full text-xs ${
//                                         orderItem.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
//                                         orderItem.status === OrderStatus.READY_FOR_PICKUP ? 'bg-purple-100 text-purple-800' :
//                                         orderItem.status === OrderStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-800' :
//                                         orderItem.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
//                                         'bg-gray-100 text-gray-800'
//                                       }`}>
//                                         {orderItem.status.replace(/_/g, ' ')}
//                                       </div>

//                                       <div className="flex items-center gap-2">
//                                         {activeTab === OrderStatus.READY_FOR_PICKUP && deliveryGroup.deliveryType === 'pickup' && (
//                                           <button
//                                             onClick={() => toggleGroupCodeVisibility(orderItem.id)}
//                                             className="text-xs text-green-600 hover:text-green-800"
//                                           >
//                                             {visibleGroupCodes[orderItem.id] ? orderItem.randomCode : 'Show Code'}
//                                           </button>
//                                         )}

//                                         {activeTab === OrderStatus.PENDING && (
//                                           <button
//                                             onClick={() => updateOrderStatus(orderItem.id, OrderStatus.READY_FOR_PICKUP)}
//                                             className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
//                                           >
//                                             <Check className="w-3 h-3" />
//                                             Ready
//                                           </button>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           );
//         })}
//       </div>
//     )}
//   </div>
// );

// }