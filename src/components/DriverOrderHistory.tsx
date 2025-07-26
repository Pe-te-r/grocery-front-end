import React, { useState, useMemo } from 'react';
import { Clock, CheckCircle, XCircle, Truck,  MapPin, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetDriverOrders, useUpdateDriverOrderItem } from '@/hooks/driverHook';

type AssignmentStatus = 'ACCEPTED' | 'COMPLETED' | 'REJECTED' | 'IN_PROGRESS';
type OrderStatus = 'PENDING' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

const statusIcons: Record<AssignmentStatus, any> = {
  ACCEPTED: Clock,
  COMPLETED: CheckCircle,
  REJECTED: XCircle,
  IN_PROGRESS: Truck,
};

const statusColors: Record<AssignmentStatus, string> = {
  ACCEPTED: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
};

const itemStatusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  READY_FOR_PICKUP: 'bg-blue-100 text-blue-800',
  IN_TRANSIT: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const DriverDeliveriesPage = () => {
  const { data, isLoading, error, refetch } = useGetDriverOrders();
  const updateItemMutation = useUpdateDriverOrderItem();
  
  const [activeAssignment, setActiveAssignment] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<'pickup' | 'delivery' | null>(null);
  const [currentBatch, setCurrentBatch] = useState<any[]>([]);

  // Group assignments by delivery type
  const groupedAssignments = useMemo(() => {
    if (!data?.data?.assignments) return { delivery: [], pickup: [] };

    const deliveryAssignments: any[] = [];
    const pickupAssignments: any[] = [];

    data.data.assignments.forEach((assignment: any) => {
      assignment.orders.forEach((order: any) => {
        if (order.deliveryOption === 'delivery') {
          deliveryAssignments.push({ ...assignment, orders: [order] });
        } else {
          pickupAssignments.push({ ...assignment, orders: [order] });
        }
      });
    });

    return { delivery: deliveryAssignments, pickup: pickupAssignments };
  }, [data]);

  const handleConfirmAction = (action: 'pickup' | 'delivery', batch: any[]) => {
    setCurrentAction(action);
    setCurrentBatch(batch);
    setShowVerificationModal(true);
  };

  const verifyCodeAndUpdateStatus = () => {
    const expectedCode = currentBatch[0]?.items[0]?.randomCode;
    
    if (verificationCode === expectedCode) {
      const updates = currentBatch.flatMap((assignment: any) => 
        assignment.orders.flatMap((order: any) => 
          order.items.map((item: any) => ({
            orderItemId: item.id,
            status: currentAction === 'pickup' ? 'IN_TRANSIT' : 'DELIVERED'
          }))
        )
      );

      // Assuming all assignments in a batch have the same assignmentId
      const assignmentId = currentBatch[0].assignmentId;
      
      updateItemMutation.mutate(
        { id: assignmentId, data: updates },
        {
          onSuccess: () => {
            setShowVerificationModal(false);
            setVerificationCode('');
            refetch();
          }
        }
      );
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  const toggleAssignment = (assignmentId: string) => {
    setActiveAssignment(activeAssignment === assignmentId ? null : assignmentId);
  };

  if (isLoading) return <div className="p-4 text-center text-green-700">Loading assignments...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error loading assignments</div>;

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Your Deliveries</h1>
        
        {data?.data?.driver && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-green-200">
            <h2 className="text-lg font-semibold text-green-700 mb-2">Driver Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700"><span className="font-medium">Name:</span> {data.data.driver.name}</p>
                <p className="text-gray-700"><span className="font-medium">Vehicle:</span> {data.data.driver.vehicleType}</p>
              </div>
              <div>
                <p className="text-gray-700"><span className="font-medium">License Plate:</span> {data.data.driver.licensePlate}</p>
                <p className="text-gray-700"><span className="font-medium">Contact:</span> {data.data.driver.contactPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Assignments */}
        {groupedAssignments.delivery.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <MapPin className="mr-2" /> Delivery Assignments
            </h2>
            {groupedAssignments.delivery.map((assignment: any) => (
              <motion.div 
                key={assignment.assignmentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden mb-4 border border-green-200"
              >
                <div 
                  className={`p-4 cursor-pointer flex justify-between items-center ${statusColors[assignment.assignmentStatus as AssignmentStatus]}`}
                  onClick={() => toggleAssignment(assignment.assignmentId)}
                >
                  <div className="flex items-center">
                    {React.createElement(statusIcons[assignment.assignmentStatus as AssignmentStatus], { className: "mr-2" })}
                    <span className="font-medium">Delivery to {assignment.orders[0].destination.location.constituency}</span>
                  </div>
                  <div className="text-sm">
                    {assignment.orders[0].items.length} items
                  </div>
                </div>
                
                {activeAssignment === assignment.assignmentId && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border-t border-green-100"
                  >
                    <div className="mb-4">
                      <h3 className="font-medium text-green-700 mb-2">Customer Details</h3>
                      <div className="bg-green-50 p-3 rounded">
                        {assignment.orders[0].customer ? (
                          <>
                            <p>Name: {assignment.orders[0].customer.name}</p>
                            <p>Phone: {assignment.orders[0].customer.phone}</p>
                            <p>Delivery Address: {assignment.orders[0].destination.location.fullAddress}</p>
                          </>
                        ) : (
                          <p>No customer details available</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-medium text-green-700 mb-2">Items</h3>
                      <div className="space-y-2">
                        {assignment.orders[0].items.map((item: any) => (
                          <div key={item.id} className={`p-2 rounded ${itemStatusColors[item.itemStatus as OrderStatus]}`}>
                            <div className="flex justify-between">
                              <span>Item ID: {item.id.slice(0, 8)}...</span>
                              <span className="capitalize">{item.itemStatus.toLowerCase().replace('_', ' ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {assignment.orders[0].items.every((item: any) => item.itemStatus === 'READY_FOR_PICKUP') && (
                      <button
                        onClick={() => handleConfirmAction('pickup', [assignment])}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                      >
                        Confirm Pickup
                      </button>
                    )}
                    
                    {assignment.orders[0].items.every((item: any) => item.itemStatus === 'IN_TRANSIT') && (
                      <button
                        onClick={() => handleConfirmAction('delivery', [assignment])}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                      >
                        Confirm Delivery
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Pickup Assignments */}
        {groupedAssignments.pickup.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <Package className="mr-2" /> Pickup Assignments
            </h2>
            {groupedAssignments.pickup.map((assignment: any) => (
              <motion.div 
                key={assignment.assignmentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden mb-4 border border-green-200"
              >
                <div 
                  className={`p-4 cursor-pointer flex justify-between items-center ${statusColors[assignment.assignmentStatus as AssignmentStatus]}`}
                  onClick={() => toggleAssignment(assignment.assignmentId)}
                >
                  <div className="flex items-center">
  {(() => {
    const StatusIcon = statusIcons[assignment.assignmentStatus as AssignmentStatus];
    return <StatusIcon className="mr-2" />;
  })()}
  <span className="font-medium">Pickup from {assignment.vendor.name}</span>
</div>
                  <div className="text-sm">
                    {assignment.orders[0].items.length} items
                  </div>
                </div>
                
                {activeAssignment === assignment.assignmentId && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border-t border-green-100"
                  >
                    <div className="mb-4">
                      <h3 className="font-medium text-green-700 mb-2">Pickup Station</h3>
                      <div className="bg-green-50 p-3 rounded">
                        <p>Name: {assignment.orders[0].destination.station.name}</p>
                        <p>Address: {assignment.orders[0].destination.station.location.fullAddress}</p>
                        <p>Contact: {assignment.orders[0].destination.station.contactPhone}</p>
                        <p>Hours: {assignment.orders[0].destination.station.openingHours}</p>
                        <p>Status: {assignment.orders[0].destination.station.isOpenNow ? 'Open' : 'Closed'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-medium text-green-700 mb-2">Items</h3>
                      <div className="space-y-2">
                        {assignment.orders[0].items.map((item: any) => (
                          <div key={item.id} className={`p-2 rounded ${itemStatusColors[item.itemStatus as OrderStatus]}`}>
                            <div className="flex justify-between">
                              <span>Item ID: {item.id.slice(0, 8)}...</span>
                              <span className="capitalize">{item.itemStatus.toLowerCase().replace('_', ' ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {assignment.orders[0].items.every((item: any) => item.itemStatus === 'READY_FOR_PICKUP') && (
                      <button
                        onClick={() => handleConfirmAction('pickup', [assignment])}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                      >
                        Confirm Pickup
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {groupedAssignments.delivery.length === 0 && groupedAssignments.pickup.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No assignments available at the moment.</p>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-medium text-green-700 mb-4">
              {currentAction === 'pickup' ? 'Confirm Pickup' : 'Confirm Delivery'}
            </h3>
            <p className="mb-4 text-gray-600">
              Please enter the 4-digit verification code provided by the {currentAction === 'pickup' ? 'vendor' : 'customer'}:
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={4}
              className="w-full p-2 border border-gray-300 rounded mb-4 text-center text-lg"
              placeholder="1234"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationCode('');
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={verifyCodeAndUpdateStatus}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={verificationCode.length !== 4 || updateItemMutation.isPending}
              >
                {updateItemMutation.isPending ? 'Processing...' : 'Verify'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DriverDeliveriesPage;