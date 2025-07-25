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
  ShoppingBag,
  Loader,
  type LucideIcon,
  Home,
  Store
} from 'lucide-react';
import { useGetDriverOrders } from '@/hooks/driverHook';
import { toast } from 'react-hot-toast';
import { AssignmentStatus } from '@/api/driver';
import { useUpdateOrderItem } from '@/hooks/ordersHook';
import { OrderStatus } from '@/routes/dashboard/orders/vendor-orders';

const statusIcons: Record<AssignmentStatus, LucideIcon> = {
  [AssignmentStatus.ACCEPTED]: Clock,
  [AssignmentStatus.COMPLETED]: CheckCircle,
  [AssignmentStatus.REJECTED]: XCircle,
  [AssignmentStatus.IN_PROGRESS]: Truck,
};

const statusColors: Record<AssignmentStatus, string> = {
  [AssignmentStatus.ACCEPTED]: 'bg-amber-100 text-amber-800',
  [AssignmentStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [AssignmentStatus.REJECTED]: 'bg-red-100 text-red-800',
  [AssignmentStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
};

const DriverDeliveriesPage = () => {
  const { data, isLoading, error, refetch } = useGetDriverOrders(AssignmentStatus.ACCEPTED);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    type: 'pickup' | 'delivery';
    orderId?: string;
    assignmentId?: string;
    itemId?: string;
  }>({ open: false, type: 'pickup' });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const updateItemMutate = useUpdateOrderItem();
  // const updateAssignmentMutate = updateItemMutate();

  const toggleAssignment = (assignmentId: string) => {
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleItemStatusUpdate = async (itemId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await updateItemMutate.mutateAsync({
        id: itemId,
        itemStatus: newStatus
      });
      toast.success(`Item status updated to ${newStatus.replace(/_/g, ' ')}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update item status');
      console.error('Error updating item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignmentStatusUpdate = async (assignmentId: string, newStatus: AssignmentStatus) => {
    setIsUpdating(true);
    try {
      // await updateAssignmentMutate.mutateAsync({
      //   id: assignmentId,
      //   status: newStatus
      // });
      toast.success(`Assignment status updated to ${newStatus.replace(/_/g, ' ')}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update assignment status');
      console.error('Error updating assignment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openConfirmationModal = (
    type: 'pickup' | 'delivery',
    options: { orderId?: string; assignmentId?: string; itemId?: string }
  ) => {
    setConfirmationModal({ open: true, type, ...options });
  };

  const submitConfirmation = async () => {
    try {
      if (confirmationModal.type === 'pickup') {
        if (confirmationModal.itemId) {
          // Single item pickup
          await handleItemStatusUpdate(confirmationModal.itemId, OrderStatus.IN_TRANSIT);
        } else if (confirmationModal.orderId) {
          // Whole order pickup
          // Find all items in the order that are ready for pickup
          const assignment = data?.data.assignments.find((a:any) => 
            a.orders.some((o:any) => o.orderId === confirmationModal.orderId)
          );
          const order = assignment?.orders.find((o:any) => o.orderId === confirmationModal.orderId);
          const itemsToUpdate = order?.items.filter((i:any) => i.itemStatus === 'ready_for_pickup');
          
          if (itemsToUpdate && itemsToUpdate.length > 0) {
            for (const item of itemsToUpdate) {
              await handleItemStatusUpdate(item.id, OrderStatus.IN_TRANSIT);
            }
          }
        } else if (confirmationModal.assignmentId) {
          // Whole assignment pickup
          const assignment = data?.data.assignments.find((a:any) => a.assignmentId === confirmationModal.assignmentId);
          const itemsToUpdate = assignment?.orders.flatMap((o:any) => 
            o.items.filter((i:any) => i.itemStatus === 'ready_for_pickup')
          );
          
          if (itemsToUpdate && itemsToUpdate.length > 0) {
            for (const item of itemsToUpdate) {
              await handleItemStatusUpdate(item.id, OrderStatus.IN_TRANSIT);
            }
          }
          
          // Update assignment status to in_progress
          await handleAssignmentStatusUpdate(confirmationModal.assignmentId, AssignmentStatus.IN_PROGRESS);
        }
      } else {
        // Delivery confirmation
        if (confirmationModal.itemId) {
          await handleItemStatusUpdate(confirmationModal.itemId, OrderStatus.COMPLETED);
        } else if (confirmationModal.orderId) {
          // Whole order delivery
          const assignment = data?.data.assignments.find((a: any) => 
            a.orders.some((o: any) => o.orderId === confirmationModal.orderId)
          );
          const order = assignment?.orders.find((o:any) => o.orderId === confirmationModal.orderId);
          const itemsToUpdate = order?.items.filter((i:any) => i.itemStatus === 'in_transit');
          
          if (itemsToUpdate && itemsToUpdate.length > 0) {
            for (const item of itemsToUpdate) {
              await handleItemStatusUpdate(item.id, OrderStatus.COMPLETED);
            }
          }
        } else if (confirmationModal.assignmentId) {
          // Whole assignment delivery
          const assignment = data?.data.assignments.find((a:any) => a.assignmentId === confirmationModal.assignmentId);
          const itemsToUpdate = assignment?.orders.flatMap((o: any) => 
            o.items.filter((i: any) => i.itemStatus === 'in_transit')
          );
          
          if (itemsToUpdate && itemsToUpdate.length > 0) {
            for (const item of itemsToUpdate) {
              await handleItemStatusUpdate(item.id, OrderStatus.COMPLETED);
            }
          }
          
          // Update assignment status to completed
          await handleAssignmentStatusUpdate(confirmationModal.assignmentId, AssignmentStatus.COMPLETED);
        }
      }
      
      setConfirmationModal({ open: false, type: 'pickup' });
      setConfirmationCode('');
    } catch (error) {
      console.error('Error in confirmation process:', error);
      toast.error('Failed to complete confirmation');
    }
  };

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
          {data?.data.assignments?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No assignments</h3>
              <p className="mt-1 text-gray-500">You currently don't have any assignments.</p>
            </div>
          ) : (
            data?.data.assignments?.map((assignment: any) => (
              <motion.div
                key={assignment.assignmentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleAssignment(assignment.assignmentId)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${statusColors[assignment.assignmentStatus as AssignmentStatus]}`}>
                      {statusIcons[assignment.assignmentStatus as AssignmentStatus] &&
                        React.createElement(statusIcons[assignment.assignmentStatus as AssignmentStatus], { size: 20 })}
                    </div>
                    <div>
                      <h3 className="font-medium">Assignment #{assignment.assignmentId.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-500">
                        Vendor: {assignment.vendor.name} • {assignment.orders.length} orders
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[assignment.assignmentStatus as AssignmentStatus]}`}>
                      {assignment.assignmentStatus.replace(/_/g, ' ')}
                    </span>
                    {expandedAssignment === assignment.assignmentId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedAssignment === assignment.assignmentId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-4">
                        {/* Vendor Information */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
                          <h4 className="font-medium text-green-700 mb-3 flex items-center">
                            <Store className="mr-2" size={18} />
                            Vendor Information
                          </h4>
                          <div className="space-y-2">
                            <p className="font-medium">{assignment.vendor.name}</p>
                            <p className="flex items-center">
                              <Phone className="mr-1" size={14} /> {assignment.vendor.contactPhone}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Location:</span> {assignment.vendor.location.constituency}, {assignment.vendor.location.county}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Address:</span> {assignment.vendor.location.fullAddress}
                            </p>
                          </div>
                        </div>

                        {/* Orders */}
                        <div className="space-y-4">
                          {assignment.orders.map((order: any) => (
                            <div key={order.orderId} className="border rounded-lg overflow-hidden">
                              <div
                                className="p-3 cursor-pointer flex justify-between items-center bg-gray-50"
                                onClick={() => toggleOrder(order.orderId)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="p-1.5 rounded-full bg-gray-200">
                                    <ShoppingBag size={16} className="text-gray-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Order #{order.orderId.slice(0, 8)}</h4>
                                    <p className="text-xs text-gray-500">
                                      {order.items.length} items • {order.deliveryOption}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  {expandedOrder === order.orderId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                              </div>

                              <AnimatePresence>
                                {expandedOrder === order.orderId && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t"
                                  >
                                    <div className="p-3">
                                      {/* Customer/Destination Info */}
                                      <div className="mb-4">
                                        {order.deliveryOption === 'pickup' && order.destination.station ? (
                                          <div className="bg-blue-50 p-3 rounded-lg">
                                            <h5 className="font-medium text-blue-700 flex items-center mb-2">
                                              <MapPin className="mr-2" size={16} />
                                              Pickup Station
                                            </h5>
                                            <p className="font-medium">{order.destination.station.name}</p>
                                            <p className="text-sm">{order.destination.station.location.fullAddress}</p>
                                            <p className="text-sm flex items-center">
                                              <Phone className="mr-1" size={14} /> {order.destination.station.contactPhone}
                                            </p>
                                          </div>
                                        ) : (
                                          <div className="bg-purple-50 p-3 rounded-lg">
                                            <h5 className="font-medium text-purple-700 flex items-center mb-2">
                                              <Home className="mr-2" size={16} />
                                              Delivery Address
                                            </h5>
                                            <p className="font-medium">{order.customer.name}</p>
                                            <p className="text-sm flex items-center">
                                              <Phone className="mr-1" size={14} /> {order.customer.phone}
                                            </p>
                                            <p className="text-sm">{order.destination.location.fullAddress}</p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Order Items */}
                                      <div className="space-y-3">
                                        {order.items.map((item: any) => (
                                          <div key={item.id} className="flex items-start border-b pb-3 last:border-0 last:pb-0">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                                              {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                              )}
                                            </div>
                                            <div className="flex-1">
                                              <p className="font-medium">{item.productName}</p>
                                              <p className="text-sm text-gray-600">KSh {item.price} × {item.quantity}</p>
                                              <div className="flex items-center justify-between mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                  item.itemStatus === 'ready_for_pickup' ? 'bg-blue-100 text-blue-800' :
                                                  item.itemStatus === 'in_transit' ? 'bg-indigo-100 text-indigo-800' :
                                                  item.itemStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                  'bg-gray-100 text-gray-800'
                                                }`}>
                                                  {item.itemStatus.replace(/_/g, ' ')}
                                                </span>
                                                {item.randomCode && (
                                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    Code: {item.randomCode}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="ml-2">
                                              {item.itemStatus === 'ready_for_pickup' && (
                                                <button
                                                  onClick={() => openConfirmationModal('pickup', { itemId: item.id })}
                                                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                                >
                                                  Pickup
                                                </button>
                                              )}
                                              {item.itemStatus === 'in_transit' && (
                                                <button
                                                  onClick={() => openConfirmationModal('delivery', { itemId: item.id })}
                                                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                                >
                                                  Deliver
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Order Actions */}
                                      <div className="mt-4 flex flex-wrap gap-2">
                                        {order.items.some((i: any) => i.itemStatus === 'ready_for_pickup') && (
                                          <button
                                            onClick={() => openConfirmationModal('pickup', { orderId: order.orderId })}
                                            className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 flex items-center"
                                          >
                                            <Package size={16} className="mr-1" />
                                            Pickup Entire Order
                                          </button>
                                        )}
                                        {order.items.some((i: any) => i.itemStatus === 'in_transit') && (
                                          <button
                                            onClick={() => openConfirmationModal('delivery', { orderId: order.orderId })}
                                            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center"
                                          >
                                            <CheckCircle size={16} className="mr-1" />
                                            Deliver Entire Order
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>

                        {/* Assignment Actions */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {assignment.assignmentStatus === AssignmentStatus.ACCEPTED && (
                            <button
                              onClick={() => openConfirmationModal('pickup', { assignmentId: assignment.assignmentId })}
                              className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                            >
                              <Package size={16} className="mr-1" />
                              Pickup Entire Assignment
                            </button>
                          )}
                          {assignment.assignmentStatus === AssignmentStatus.IN_PROGRESS && (
                            <button
                              onClick={() => openConfirmationModal('delivery', { assignmentId: assignment.assignmentId })}
                              className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                            >
                              <CheckCircle size={16} className="mr-1" />
                              Complete Entire Assignment
                            </button>
                          )}
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
            onClick={() => !isUpdating && setConfirmationModal({ open: false, type: 'pickup' })}
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
                  <p>Processing...</p>
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
                        setConfirmationModal({ open: false, type: 'pickup' });
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

export default DriverDeliveriesPage;