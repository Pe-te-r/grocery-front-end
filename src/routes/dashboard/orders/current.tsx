import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle,
  MapPin,
  CreditCard,
  ShoppingBasket,
  Info,
  ChevronDown,
  ChevronUp,
  Leaf,
  Box,
  ShoppingCart,
  List
} from 'lucide-react';
import { useGetCustomerOrders } from '@/hooks/customerHook';
import { getUserIdHelper } from '@/lib/authHelper';

enum OrderStatus {
  PENDING = 'pending',
  READY_FOR_PICKUP = 'ready_for_pickup',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

interface Product {
  id: string;
  name: string;
  price: string;
}

interface Vendor {
  id: string;
  businessName: string;
  location: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  itemStatus: string;
  product: Product;
  vendor: Vendor;
  randomCode: string;
}

interface PickUpLocation {
  id: string;
  name: string;
  contactPhone: string;
  openingTime: string;
  closingTime: string;
  isOpenNow: boolean;
  constituency: string;
  country: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  deliveryOption: string;
  deliveryFee: string;
  deliveryInstructions: string;
  paymentMethod: string;
  paymentPhone: string;
  createdAt: string;
  itemCount: number;
  pickUpLocation: PickUpLocation;
  constituency: string | null;
  items: OrderItem[];
}

const OrderTrackingPage = () => {
  const userId = getUserIdHelper() ?? '';
  const { data: orderData, isLoading } = useGetCustomerOrders(userId);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Package className="w-5 h-5" />;
      case OrderStatus.READY_FOR_PICKUP:
        return <Clock className="w-5 h-5" />;
      case OrderStatus.IN_TRANSIT:
        return <Truck className="w-5 h-5" />;
      case OrderStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5" />;
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        return <XCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Packaging';
      case OrderStatus.READY_FOR_PICKUP:
        return 'Waiting for transportation';
      case OrderStatus.IN_TRANSIT:
        return 'In transit to pickup location';
      case OrderStatus.COMPLETED:
        return 'Ready for pickup';
      case OrderStatus.CANCELLED:
        return 'Order Cancelled';
      case OrderStatus.REJECTED:
        return 'Order Rejected';
      default:
        return status;
    }
  };

  const getItemStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ready';
      case 'pending':
        return 'Preparing';
      default:
        return status;
    }
  };

  const getStatusColor = (status: OrderStatus | string) => {
    if (typeof status === 'string' && !Object.values(OrderStatus).includes(status as OrderStatus)) {
      return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
    }
    
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-amber-100 text-amber-800';
      case OrderStatus.READY_FOR_PICKUP:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.IN_TRANSIT:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orderData?.data?.filter((order: any) => 
    activeTab === 'all' || order.status === activeTab
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!orderData || !orderData.data || orderData.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-green-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-gray-500">You don't have any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-green-800 mb-2 flex items-center gap-2">
            <Leaf className="text-green-600" /> Your Order History
          </h1>
          <p className="text-green-700">Track your orders and their current status</p>
        </motion.div>

        {/* Status Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${activeTab === 'all' ? 'bg-green-600 text-white' : 'bg-white text-green-700 border border-green-200'}`}
            >
              <List className="w-4 h-4" /> All Orders
            </button>
            {Object.values(OrderStatus).map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${activeTab === status ? 'bg-green-600 text-white' : 'bg-white text-green-700 border border-green-200'}`}
              >
                {getStatusIcon(status)} {getOrderStatusText(status)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders.map((order: any) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-green-100"
              >
                {/* Order Header */}
                <div 
                  className="px-6 py-4 border-b border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div>
                    <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                      <Box className="text-green-600" />
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h2>
                    <p className="text-sm text-green-700">
                      Placed on {formatDate(order.createdAt)} • {order.itemCount} items • KES {order.totalAmount}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} flex items-center gap-2`}>
                      {getStatusIcon(order.status)}
                      {getOrderStatusText(order.status)}
                    </div>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
                
                {/* Order Details - Collapsible */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-green-50">
                        {/* Delivery Info */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-green-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-600" />
                            Delivery Information
                          </h3>
                          <div className="space-y-2 text-sm text-green-800">
                            <p>
                              <span className="font-medium">Method:</span> {order.deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}
                            </p>
                            {order.deliveryOption === 'pickup' && order.pickUpLocation && (
                              <div className="mt-2 p-3 bg-white rounded-lg border border-green-200">
                                <p className="font-medium">Pickup Location:</p>
                                <p>{order.pickUpLocation.name}</p>
                                <p>{order.pickUpLocation.constituency}, {order.pickUpLocation.country}</p>
                                <p className="mt-2">
                                  <span className="font-medium">Hours:</span> {order.pickUpLocation.openingTime} - {order.pickUpLocation.closingTime}
                                </p>
                                <p className={order.pickUpLocation.isOpenNow ? 'text-green-600' : 'text-red-600'}>
                                  {order.pickUpLocation.isOpenNow ? 'Currently Open' : 'Currently Closed'}
                                </p>
                                <p className="mt-2">
                                  <span className="font-medium">Contact:</span> {order.pickUpLocation.contactPhone}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Payment Info */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-green-900 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-green-600" />
                            Payment Information
                          </h3>
                          <div className="space-y-2 text-sm text-green-800">
                            <div className="p-3 bg-white rounded-lg border border-green-200">
                              <p>
                                <span className="font-medium">Method:</span> {order.paymentMethod === 'mpesa' ? 'M-Pesa' : order.paymentMethod}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span> {order.paymentPhone}
                              </p>
                              <p className="mt-2">
                                <span className="font-medium">Subtotal:</span> KES {(parseFloat(order.totalAmount) - parseFloat(order.deliveryFee)).toFixed(2)}
                              </p>
                              <p>
                                <span className="font-medium">Delivery Fee:</span> KES {order.deliveryFee}
                              </p>
                              <p className="font-medium mt-2">
                                <span className="font-medium">Total:</span> KES {order.totalAmount}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Summary */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-green-900 flex items-center gap-2">
                            <ShoppingBasket className="w-5 h-5 text-green-600" />
                            Order Summary
                          </h3>
                          <div className="space-y-2 text-sm text-green-800">
                            <div className="p-3 bg-white rounded-lg border border-green-200">
                              <p>
                                <span className="font-medium">Items:</span> {order.itemCount}
                              </p>
                              {order.deliveryInstructions && (
                                <p className="mt-2">
                                  <span className="font-medium">Instructions:</span> {order.deliveryInstructions}
                                </p>
                              )}
                              <p className="mt-2">
                                <span className="font-medium">Status:</span> {getOrderStatusText(order.status)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="border-t border-green-200">
                        <h3 className="px-6 py-3 bg-green-50 text-sm font-medium text-green-900 flex items-center gap-2">
                          <Package className="w-4 h-4" /> Items in this order
                        </h3>
                        <div className="divide-y divide-green-100">
                          {order.items.map((item: any, index) => (
                            <div key={item.id} className="px-6 py-4">
                              <div 
                                className="flex justify-between items-start cursor-pointer"
                                onClick={() => toggleItemExpand(item.id)}
                              >
                                <div className="flex items-start space-x-4">
                                  <div className={`flex-shrink-0 rounded-md p-2 ${item.itemStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    <Package className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-green-900">{item.product.name}</h4>
                                    <p className="text-sm text-green-700">Vendor: {item.vendor.businessName}</p>
                                    <p className="text-sm text-green-700">Location: {item.vendor.location}</p>
                                  </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-green-900">KES {item.product.price}</p>
                                    <p className="text-sm text-green-700">Qty: {item.quantity}</p>
                                    <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.itemStatus)}`}>
                                      {getItemStatusText(item.itemStatus)}
                                    </div>
                                  </div>
                                  {expandedItems[item.id] ? (
                                    <ChevronUp className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-green-600" />
                                  )}
                                </div>
                              </div>
                              
                              {/* Item Details - Collapsible */}
                              <AnimatePresence>
                                {expandedItems[item.id] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-4 pl-14 pr-4 py-3 bg-green-50 rounded-lg">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                                        <div>
                                          <p className="font-medium">Product Details:</p>
                                          <p>Name: {item.product.name}</p>
                                          <p>Price: KES {item.product.price}</p>
                                          <p>Quantity: {item.quantity}</p>
                                          <p>Total: KES {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <div>
                                          <p className="font-medium">Vendor Information:</p>
                                          <p>Business: {item.vendor.businessName}</p>
                                          <p>Location: {item.vendor.location}</p>
                                          <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.itemStatus)}`}>
                                            Status: {getItemStatusText(item.itemStatus)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};



export const Route = createFileRoute('/dashboard/orders/current')({
  component: OrderTrackingPage,
})