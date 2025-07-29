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
  const { data, isLoading, error } = useStoreOrderQuery(vendorId)
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
                          {location.deliveryOption === 'pickup' && 
  location.items.every((item: any) => item.status === OrderStatus.READY_FOR_PICKUP) && (
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
                              {location.items.every((item: any) => item.status === OrderStatus.READY_FOR_PICKUP) && 
  showCodes[location.locationKey] && (
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

