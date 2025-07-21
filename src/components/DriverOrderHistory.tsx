import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Info,
  ShoppingBag,
  Loader,
  type LucideIcon
} from 'lucide-react';
import { useGetDriverOrders } from '@/hooks/driverHook';
import { useUpdateOrderItem } from '@/hooks/ordersHook';
import { OrderStatus } from '@/routes/dashboard/orders/vendor-orders';
import { toast } from 'react-hot-toast';

const statusIcons: Record<OrderStatus, LucideIcon> = {
  [OrderStatus.PENDING]: Clock,
  [OrderStatus.READY_FOR_PICKUP]: Package,
  [OrderStatus.IN_TRANSIT]: Truck,
  [OrderStatus.COMPLETED]: CheckCircle,
  [OrderStatus.CANCELLED]: XCircle,
  [OrderStatus.REJECTED]: XCircle,
};

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-amber-100 text-amber-800',
  [OrderStatus.READY_FOR_PICKUP]: 'bg-blue-100 text-blue-800',
  [OrderStatus.IN_TRANSIT]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [OrderStatus.REJECTED]: 'bg-red-100 text-red-800',
};

const DriverDeliveriesPage = () => {
  const { data, isLoading, error, refetch } = useGetDriverOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    type: 'pickup' | 'delivery';
    orderId: string;
    batchId?: string;
  }>({ open: false, type: 'pickup', orderId: '', batchId: '' });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const updateItemMutate = useUpdateOrderItem();

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusUpdate = async (order_id: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const order = data?.data.orders.find((o: any) => o.orderId === order_id);
      const order_ids = order.orderItemIds;
      if (!order_ids) return;

      for (const id of order_ids) {
        try {
          await updateItemMutate.mutateAsync(
            {
              id,
              itemStatus: newStatus
            }, {
            onSuccess: () => refetch()
          }
          );
        } catch (error) {
          toast.error(`Failed to update item`);
          console.error(`Error updating item:`, error);
        }
      }

      toast.success(`All items updated to ${newStatus.replace(/_/g, ' ')}`);
      setConfirmationModal({ open: false, type: 'pickup', orderId: '', batchId: '' });
      setConfirmationCode('');
    } catch (error) {
      console.error('Error in status update process:', error);
      toast.error('Failed to complete all updates');
    } finally {
      setIsUpdating(false);
    }
  };

  const openConfirmationModal = (type: 'pickup' | 'delivery', orderId: string, batchId: string) => {
    setConfirmationModal({ open: true, type, orderId, batchId });
  };

  const submitConfirmation = async () => {
    const order = data?.data.orders.find((o: any) => o.orderId === confirmationModal.orderId);
    if (!order) return;

    const expectedCode = order.verification.pickupCode;
    if (confirmationCode !== expectedCode) {
      toast.error('Invalid confirmation code. Please try again.');
      return;
    }

    const newStatus = confirmationModal.type === 'pickup'
      ? OrderStatus.IN_TRANSIT
      : OrderStatus.COMPLETED;

    await handleStatusUpdate(confirmationModal.orderId, newStatus);
  };

  // Sort orders: pending first, completed last
  const sortedOrders = data?.data.orders?.sort((a: any, b: any) => {
    if (a.orderStatus === OrderStatus.COMPLETED) return 1;
    if (b.orderStatus === OrderStatus.COMPLETED) return -1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Failed to load orders. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Your Deliveries</h1>
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Truck className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{data?.data.driver.name}</h2>
                <p className="text-gray-600">{data?.data.driver.licensePlate}</p>
                <span className={`px-2 py-1 rounded-full text-xs ${data?.data.driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {data?.data.driver.status}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {sortedOrders?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders assigned</h3>
              <p className="mt-1 text-gray-500">You currently don't have any orders to deliver.</p>
            </div>
          ) : (
            sortedOrders?.map((order: any) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleOrder(order.orderId)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${statusColors[order.orderStatus as OrderStatus]}`}>
                      {statusIcons[order.orderStatus as OrderStatus] &&
                        React.createElement(statusIcons[order.orderStatus as OrderStatus], { size: 20 })}
                    </div>
                    <div>
                      <h3 className="font-medium">Order #{order.orderId.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.orderCreatedAt).toLocaleDateString()} • {order.totalQuantity} items •
                        <span className="ml-1 capitalize">{order.deliveryOption}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.orderStatus as OrderStatus]}`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    {expandedOrder === order.orderId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order.orderId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Pickup Location */}
                          {order.pickupLocations && order.pickupLocations.length > 0 && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                              <h4 className="font-medium text-green-700 mb-3 flex items-center">
                                <MapPin className="mr-2" size={18} />
                                Pickup From Vendor
                              </h4>
                              <div className="space-y-2">
                                <p className="font-medium">{order.pickupLocations[0].name}</p>
                                <p className="flex items-center">
                                  <Phone className="mr-1" size={14} /> {order.pickupLocations[0].contactPhone}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Location:</span> {order.pickupLocations[0].location.constituency}, {order.pickupLocations[0].location.county}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Address:</span> {order.pickupLocations[0].location.fullAddress}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Delivery Station */}
                          {order.deliveryOption === 'pickup' && order.destination?.station && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <h4 className="font-medium text-blue-700 mb-3 flex items-center">
                                <MapPin className="mr-2" size={18} />
                                Delivery Station
                              </h4>
                              <div className="space-y-2">
                                <p className="font-medium">{order.destination.station.name}</p>
                                <p className="flex items-center">
                                  <Phone className="mr-1" size={14} /> {order.destination.station.contactPhone}
                                </p>
                                <p className="text-sm">
                                  {order.destination.station.isOpenNow ? (
                                    <span className="text-green-600">Open now</span>
                                  ) : (
                                    <span className="text-red-600">Currently closed</span>
                                  )}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Location:</span> {order.destination.station.location.constituency}, {order.destination.station.location.county}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Address:</span> {order.destination.station.location.fullAddress}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Customer Info (only for delivery orders) */}
                          {order.deliveryOption === 'delivery' && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-green-700 mb-3 flex items-center">
                                <ShoppingBag className="mr-2" size={18} />
                                Customer Details
                              </h4>
                              <div className="space-y-2">
                                <p className="flex items-center">
                                  <span className="font-medium w-24">Name:</span>
                                  <span>{order.customer.name}</span>
                                </p>
                                <p className="flex items-center">
                                  <span className="font-medium w-24">Phone:</span>
                                  <a href={`tel:${order.customer.phone}`} className="flex items-center text-blue-600">
                                    <Phone className="mr-1" size={14} /> {order.customer.phone}
                                  </a>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Order Status Information */}
                        <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <h4 className="font-medium text-amber-700 mb-2 flex items-center">
                            <Info className="mr-2" size={18} />
                            Order Status
                          </h4>
                          <p className="text-sm">
                            {order.orderStatus === OrderStatus.PENDING && 'Order is pending confirmation'}
                            {order.orderStatus === OrderStatus.READY_FOR_PICKUP && 'Ready for pickup from vendor'}
                            {order.orderStatus === OrderStatus.IN_TRANSIT && 'Order is in transit to destination'}
                            {order.orderStatus === OrderStatus.COMPLETED && 'Order has been completed'}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6">
                          {order.products.some((p: any) => p.itemStatus === OrderStatus.READY_FOR_PICKUP) && (
                            <button
                              onClick={() => openConfirmationModal('pickup', order.orderId, order.batchId)}
                              className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                            >
                              <Package size={18} />
                              <span>Confirm Pickup</span>
                            </button>
                          )}
                          {order.products.some((p: any) => p.itemStatus === OrderStatus.IN_TRANSIT) && (
                            <button
                              onClick={() => openConfirmationModal('delivery', order.orderId, order.batchId)}
                              className="w-full md:w-auto mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                            >
                              <CheckCircle size={18} />
                              <span>Confirm Delivery</span>
                            </button>
                          )}
                        </div>

                        {/* Timeline */}
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-700 mb-3">Order Timeline</h4>
                          <div className="relative">
                            <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
                            <div className="space-y-4">
                              <TimelineItem
                                date={order.timeline.created}
                                status="Order created"
                                icon={Clock}
                                active
                              />
                              {order.timeline.readyForPickup && (
                                <TimelineItem
                                  date={order.timeline.readyForPickup}
                                  status="Ready for pickup"
                                  icon={Package}
                                  active
                                />
                              )}
                              {order.timeline.pickedUp && (
                                <TimelineItem
                                  date={order.timeline.pickedUp}
                                  status="Picked up"
                                  icon={Truck}
                                  active
                                />
                              )}
                              {order.timeline.delivered && (
                                <TimelineItem
                                  date={order.timeline.delivered}
                                  status="Delivered"
                                  icon={CheckCircle}
                                  active
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmationModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => !isUpdating && setConfirmationModal({ open: false, type: 'pickup', orderId: '', batchId: '' })}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative bg-white rounded-lg p-6 max-w-md w-full ${confirmationModal.type === 'pickup' ? 'border-t-4 border-green-500' : 'border-t-4 border-blue-500'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium mb-4">
                {confirmationModal.type === 'pickup' ? 'Confirm Pickup' : 'Confirm Delivery'}
              </h3>

              {isUpdating ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader className="animate-spin text-green-600 mb-4" size={32} />
                  <p>Updating items...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Please enter the 4-digit confirmation code provided by the{' '}
                    {confirmationModal.type === 'pickup' ? 'vendor' : 'customer'}:
                  </p>

                  <div className="mb-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-xl tracking-widest"
                      placeholder="____"
                      autoFocus
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setConfirmationModal({ open: false, type: 'pickup', orderId: '', batchId: '' });
                        setConfirmationCode('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitConfirmation}
                      disabled={confirmationCode.length !== 4 || isUpdating}
                      className={`px-4 py-2 rounded-lg text-white ${confirmationModal.type === 'pickup' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} transition disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-20`}
                    >
                      {isUpdating ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        'Confirm'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimelineItem = ({ date, status, icon: Icon, active }: { date: string | null; status: string; icon: LucideIcon; active: boolean }) => {
  if (!date) return null;

  return (
    <div className="flex items-start">
      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
        <Icon size={16} />
      </div>
      <div className="ml-4">
        <p className={`text-sm ${active ? 'text-gray-900' : 'text-gray-500'}`}>{status}</p>
        <p className="text-xs text-gray-500">{new Date(date).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DriverDeliveriesPage;