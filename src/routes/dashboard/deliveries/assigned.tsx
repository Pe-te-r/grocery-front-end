import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deliveries/assigned')({
  component: RouteComponent,
})
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  CheckCircle,
  Truck,
  User,
  Phone,
  Home,
  Store,
  ChevronDown,
  ChevronUp,
  ClipboardList
} from 'lucide-react';

function RouteComponent(){
  const [activeTab, setActiveTab] = useState<'ready' | 'transit' | 'delivered'>('ready');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Static data for demonstration
  const orders = {
    ready: [
      {
        id: 'ORD-1001',
        customer: {
          name: 'John Mwangi',
          phone: '+254712345678',
          address: '123 Westlands, Nairobi'
        },
        pickupStation: {
          name: 'Westlands Pickup Point',
          address: 'Muthithi Rd, Westlands'
        },
        items: 3,
        totalAmount: 4500,
        deliveryOption: 'pickup',
        readyTime: '2023-06-15T10:30:00'
      },
      {
        id: 'ORD-1002',
        customer: {
          name: 'Sarah Kamau',
          phone: '+254722334455',
          address: '456 Kilimani, Nairobi'
        },
        pickupStation: {
          name: 'Kilimani Depot',
          address: 'Argwings Kodhek Rd'
        },
        items: 2,
        totalAmount: 3200,
        deliveryOption: 'pickup',
        readyTime: '2023-06-15T11:15:00'
      }
    ],
    transit: [
      {
        id: 'ORD-1003',
        customer: {
          name: 'David Ochieng',
          phone: '+254733445566',
          address: '789 Kileleshwa, Nairobi'
        },
        items: 4,
        totalAmount: 6800,
        deliveryOption: 'delivery',
        pickupTime: '2023-06-15T09:00:00',
        status: 'in_transit',
        estimatedDelivery: '30-45 mins'
      },
      {
        id: 'ORD-1004',
        customer: {
          name: 'Grace Wambui',
          phone: '+254744556677',
          address: '321 Lavington, Nairobi'
        },
        items: 1,
        totalAmount: 1500,
        deliveryOption: 'delivery',
        pickupTime: '2023-06-15T09:30:00',
        status: 'in_transit',
        estimatedDelivery: '15-30 mins'
      }
    ],
    delivered: [
      {
        id: 'ORD-1005',
        customer: {
          name: 'James Mutua',
          phone: '+254755667788',
          address: '654 Karen, Nairobi'
        },
        items: 2,
        totalAmount: 4200,
        deliveryOption: 'delivery',
        deliveredTime: '2023-06-15T08:45:00',
        status: 'completed',
        proof: 'customer_signature.jpg'
      },
      {
        id: 'ORD-1006',
        customer: {
          name: 'Mary Njeri',
          phone: '+254766778899',
          address: '987 Runda, Nairobi'
        },
        items: 3,
        totalAmount: 5600,
        deliveryOption: 'pickup',
        deliveredTime: '2023-06-15T10:00:00',
        status: 'completed',
        proof: 'station_confirmation.jpg'
      }
    ]
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const markAsPickedUp = (orderId: string) => {
    // In a real app, this would update the order status in the backend
    console.log(`Order ${orderId} marked as picked up`);
  };

  const markAsDelivered = (orderId: string) => {
    // In a real app, this would update the order status in the backend
    console.log(`Order ${orderId} marked as delivered`);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
        <p className="text-gray-600">Manage your delivery assignments</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('ready')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'ready' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          <Package className="w-5 h-5" />
          Ready for Pickup ({orders.ready.length})
        </button>
        <button
          onClick={() => setActiveTab('transit')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'transit' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          <Truck className="w-5 h-5" />
          In Transit ({orders.transit.length})
        </button>
        <button
          onClick={() => setActiveTab('delivered')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'delivered' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          <CheckCircle className="w-5 h-5" />
          Delivered ({orders.delivered.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {orders[activeTab].map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${activeTab === 'ready' ? 'bg-blue-100 text-blue-600' : activeTab === 'transit' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                    {activeTab === 'ready' ? (
                      <Package className="w-5 h-5" />
                    ) : activeTab === 'transit' ? (
                      <Truck className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {order.deliveryOption === 'pickup' ? 'Pickup order' : 'Delivery order'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(order.status || (activeTab === 'ready' ? 'ready_for_pickup' : activeTab === 'transit' ? 'in_transit' : 'completed'))}`}> */}
                    {/* {activeTab === 'ready' ? 'Ready' : activeTab === 'transit' ? 'In Transit' : 'Delivered'} */}
                  {/* </span> */}
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Expanded Order Details */}
              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                            <User className="w-5 h-5" /> Customer Information
                          </h4>
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <span className="font-medium">Name:</span>
                              {order.customer.name}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              {order.customer.phone}
                            </p>
                            {order.deliveryOption === 'delivery' && (
                              <p className="flex items-start gap-2">
                                <Home className="w-4 h-4 mt-0.5 text-gray-500" />
                                <span>
                                  <span className="font-medium">Address:</span> {order.customer.address}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                            <ClipboardList className="w-5 h-5" /> Order Details
                          </h4>
                          <div className="space-y-2">
                            <p>
                              <span className="font-medium">Items:</span> {order.items}
                            </p>
                            <p>
                              <span className="font-medium">Total:</span> KSh {order.totalAmount}
                            </p>
                            {order.deliveryOption === 'pickup' ? (
                              <>
                                <p className="flex items-start gap-2">
                                  <Store className="w-4 h-4 mt-0.5 text-gray-500" />
                                  <span>
                                    {/* <span className="font-medium">Pickup Station:</span> {order.pickupStation.name} */}
                                  </span>
                                </p>
                                {/* <p className="flex items-start gap-2 ml-6">
                                  <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                                  <span>{order.pickupStation.address}</span>
                                </p> */}
                                {/* {order.readyTime && (
                                  <p className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span>Ready by: {new Date(order.readyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </p>
                                )} */}
                              </>
                            ) : (
                              <>
                                {/* {order.estimatedDelivery && (
                                  <p className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span>Estimated delivery: {order.estimatedDelivery}</span>
                                  </p>
                                )} */}
                                {/* {order.pickupTime && (
                                  <p className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span>Picked up at: {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </p>
                                )} */}
                              </>
                            )}
                            {/* {order.deliveredTime && (
                              <p className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Delivered at: {new Date(order.deliveredTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </p>
                            )} */}
                            {/* {order.proof && (
                              <p className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-green-500" />
                                <span>Proof: {order.proof}</span>
                              </p>
                            )} */}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex justify-end gap-4">
                        {activeTab === 'ready' && (
                          <button
                            onClick={() => markAsPickedUp(order.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                          >
                            <Truck className="w-5 h-5" />
                            Mark as Picked Up
                          </button>
                        )}
                        {activeTab === 'transit' && (
                          <button
                            onClick={() => markAsDelivered(order.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders[activeTab].length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No orders found</h3>
            <p className="text-gray-500 mt-2">
              {activeTab === 'ready'
                ? 'No orders are ready for pickup at this time'
                : activeTab === 'transit'
                  ? 'You have no orders in transit'
                  : 'No delivered orders to show'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

