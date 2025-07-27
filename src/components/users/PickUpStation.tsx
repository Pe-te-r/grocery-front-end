import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Phone, 
  Mail, 
  List, 
  LayoutGrid,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { OrderDetails } from '@/components/pick_up_stations/OrderDetails'; 

export const PickupStationView = ({ data }:{data:any}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  console.log('data',data)

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(prev => prev === orderId ? null : orderId);
  };

  const openOrderModal = (order:any) => {
    setSelectedOrder(order);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = useMemo(() => {
    if (!data?.orders) return [];
    if (!searchQuery.trim()) return data.orders;
    
    return data.orders.filter((order: any) => {
      const customerName = `${order.customer.first_name} ${order.customer.last_name}`.toLowerCase();
      return customerName.includes(searchQuery.toLowerCase());
    });
  }, [data?.orders, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-green-800">{data.name} Orders</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-8 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={toggleViewMode}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
          >
            {viewMode === 'list' ? (
              <>
                <LayoutGrid size={18} />
                <span>Grid View</span>
              </>
            ) : (
              <>
                <List size={18} />
                <span>List View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No orders match your search.' : 'No orders available.'}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredOrders.map((order:any) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              <div className="p-4 bg-green-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Package className="text-green-600" />
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-1">
                      {order.customer.first_name} {order.customer.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrderExpansion(order.id);
                    }}
                    className="p-1 rounded-full hover:bg-green-100 transition-colors"
                  >
                    <ChevronDown className={`transition-transform ${
                      expandedOrder === order.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                            <User size={16} /> Customer Details
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <span className="text-gray-500">Name:</span>
                              <span>{order.customer.first_name} {order.customer.last_name}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail size={14} className="text-gray-500" />
                              <span>{order.customer.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-500" />
                              <span>{order.customer.phone}</span>
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-green-800 mb-2">Delivery Info</h3>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-gray-500">Option:</span> {order.deliveryOption}
                            </p>
                            {order.deliveryInstructions && (
                              <p>
                                <span className="text-gray-500">Instructions:</span> {order.deliveryInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderModal(order);
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          View Full Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order:any) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              onClick={() => openOrderModal(order)}
            >
              <div className="p-4 bg-green-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-green-800 mb-1">Customer</h4>
                    <p className="text-sm">{order.customer.first_name} {order.customer.last_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-800 mb-1">Delivery</h4>
                    <p className="text-sm capitalize">{order.deliveryOption}</p>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openOrderModal(order);
                  }}
                  className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetails 
            order={selectedOrder} 
            onClose={closeOrderModal} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Usage in your RouteComponent
// function RouteComponent() {
//   const userId = getUserIdHelper() ?? '';
//   const { data } = useGetPickUpStations(userId);
  
//   if (!data) return <div><Loading/></div>;
  
//   return <PickupStationView data={data.data} />;
// }

// export default RouteComponent