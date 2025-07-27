import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetPickUpStations } from '@/hooks/pickStationHook'
import { getUserIdHelper } from '@/lib/authHelper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/pickup_station/tsx/')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = getUserIdHelper() ?? ''
  const { data:dataDetails } = useGetPickUpStations(userId)
  const data= dataDetails?.data
  console.log('data: ', data);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list')
  }

  const openOrderModal = (orderId: string) => {
    setSelectedOrder(orderId)
  }

  const closeOrderModal = () => {
    setSelectedOrder(null)
  }

  if (!data) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">{data.name}</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">View Mode:</span>
         <button
  onClick={toggleViewMode}
  className={`relative w-16 h-9 rounded-full transition-colors duration-300 border-2 ${
    viewMode === 'card' ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'
  }`}
>
  <motion.span
    className="absolute top-0.5 left-0.5 w-7 h-7 bg-white rounded-full shadow-md"
    animate={{
      x: viewMode === 'card' ? 28 : 0
    }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
  />
  <span className="sr-only">Toggle view mode</span>
</button>
          <span className="text-gray-700 capitalize">{viewMode} view</span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
        <h2 className="text-xl font-semibold text-green-700 mb-2">Station Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-gray-500">Contact Phone</p>
            <p className="text-green-800 font-medium">{data.contactPhone}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-gray-500">Opening Time</p>
            <p className="text-green-800 font-medium">{data.openingTime}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-gray-500">Closing Time</p>
            <p className="text-green-800 font-medium">{data.closingTime}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-green-800 mb-4">Orders</h2>
      
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {Array.isArray(data.orders) && data.orders.map((order:any) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="text-green-700 font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="text-green-700 font-medium">KES {order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </p>
                </div>
                <button
                  onClick={() => openOrderModal(order.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  Show Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(data.orders)&&data.orders.map((order:any) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-green-800">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-green-700">KES {order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium text-green-700">KES {order.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium text-green-700">{order.paymentMethod}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => openOrderModal(order.id)}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  View Order Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={closeOrderModal}
              className="fixed inset-0 bg-black z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-green-800">Order Details</h3>
                <button 
                  onClick={closeOrderModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Order ID:</p>
                  <p className="text-green-800 font-medium">{selectedOrder}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">More order details would be displayed here...</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeOrderModal}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}