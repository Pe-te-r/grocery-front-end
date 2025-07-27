import { AssignmentStatus } from "@/api/driver";
import { useGetDriverOrders, useUpdateDriverOrderItem } from "@/hooks/driverHook";
import { OrderStatus } from "@/routes/dashboard/orders/vendor-orders";
import type { AssignmentUpdate } from "@/util/types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, 
  MapPin, 
  Package, 
  CheckCircle, 
  Clock, 
  Phone,
  Mail,
  Navigation,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Check
} from "lucide-react";
import { useState } from "react";

interface Driver {
  id: string;
  name: string;
  status: string;
  vehicleType: string;
  licensePlate: string;
  contactPhone: string;
}

interface Location {
  constituency: string;
  county: string;
  fullAddress: string;
  countyCode?: string;
}

interface Station {
  id: string;
  name: string;
  contactPhone: string;
  openingHours: string;
  isOpenNow: boolean;
  location: Location;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Destination {
  type: 'pickup' | 'delivery';
  station?: Station;
  location?: Location;
}

interface OrderItem {
  id: string;
  itemStatus: OrderStatus;
  randomCode: string;
}

interface Order {
  orderId: string;
  customer: Customer;
  status: OrderStatus;
  deliveryOption: 'pickup' | 'delivery';
  deliveryFee: string;
  totalAmount: string;
  specialInstructions: string;
  deliveryInstructions: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  destination: Destination;
  items: OrderItem[];
}

interface Vendor {
  id: string;
  name: string;
  contactPhone: string;
  location: Location;
}

interface Assignment {
  assignmentId: string;
  assignmentStatus: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
  vendor: Vendor;
  orders: Order[];
}

interface DriverOrdersResponse {
  status: string;
  message: string;
  data: {
    driver: Driver;
    assignments: Assignment[];
  };
}

const DriverDeliveriesPage = () => {
  const { data, isLoading, error, refetch } = useGetDriverOrders();
  const [expandedAssignments, setExpandedAssignments] = useState<Record<string, boolean>>({});

  const toggleAssignment = (assignmentId: string) => {
    setExpandedAssignments(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
  };

  if (isLoading) return <div className="p-6 text-center text-lg">Loading assignments...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-600">Error loading orders. Please try again.</div>;

  const assignments = (data as DriverOrdersResponse)?.data?.assignments || [];

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Delivery Assignments</h1>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          Refresh Assignments
        </button>
      </div>

      <DriverInfo driver={(data as DriverOrdersResponse)?.data?.driver} />

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <AssignmentCard 
            key={assignment.assignmentId} 
            assignment={assignment} 
            refetch={refetch}
            isExpanded={!!expandedAssignments[assignment.assignmentId]}
            onToggle={() => toggleAssignment(assignment.assignmentId)}
          />
        ))}
      </div>
    </div>
  );
};

const DriverInfo = ({ driver }: { driver: Driver }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6"
    >
      <div className="flex items-center space-x-6">
        <div className="p-4 bg-blue-50 rounded-full">
          <Truck className="text-blue-600" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{driver?.name}</h2>
          <p className="text-gray-600 flex items-center text-lg">
            <span className="capitalize">{driver?.vehicleType}</span>
            <span className="mx-3">•</span>
            {driver?.licensePlate}
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center space-x-6 text-lg">
        <a 
          href={`tel:${driver?.contactPhone}`} 
          className="flex items-center text-blue-700 hover:text-blue-900"
        >
          <Phone className="mr-2" size={20} />
          {driver?.contactPhone}
        </a>
        <span className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">
          {driver?.status}
        </span>
      </div>
    </motion.div>
  );
};

const AssignmentCard = ({ 
  assignment, 
  refetch,
  isExpanded,
  onToggle
}: { 
  assignment: Assignment;
  refetch: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const updateOrderItemStatus = useUpdateDriverOrderItem()
  const updateStatusItem =async (data:AssignmentUpdate[] )=>{
    await updateOrderItemStatus.mutate({id: assignment.assignmentId,data:data})
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
    >
      <button 
        onClick={onToggle}
        className="w-full p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <Package className="text-blue-600" size={24} />
          <div className="text-left">
            <h3 className="text-xl font-medium text-gray-800">{assignment.vendor.name}</h3>
            <p className="text-gray-600">
              {assignment.orders.length} order{assignment.orders.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            assignment.assignmentStatus === AssignmentStatus.ACCEPTED 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {assignment.assignmentStatus.replace('_', ' ')}
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="divide-y divide-gray-100"
          >
            {assignment.orders.map((order) => (
              <OrderCard key={order.orderId} order={order} refetch={refetch} updateOrderItems={updateStatusItem} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Location {
  constituency: string;
  county: string;
  fullAddress: string;
  countyCode?: string;
}

interface Station {
  id: string;
  name: string;
  contactPhone: string;
  openingHours: string;
  isOpenNow: boolean;
  location: Location;
}

interface OrderItem {
  id: string;
  itemStatus: OrderStatus;
  randomCode: string;
}

interface Destination {
  type: 'pickup' | 'delivery';
  station?: Station;
  location?: Location;
}

interface Order {
  orderId: string;
  customer: Customer;
  status: OrderStatus;
  deliveryOption: 'pickup' | 'delivery';
  deliveryFee: string;
  totalAmount: string;
  specialInstructions: string;
  deliveryInstructions: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  destination: Destination;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  refetch: () => void;
  updateOrderItems: ( data:AssignmentUpdate[] ) => Promise<void>;
}

const OrderCard = ({ order, refetch, updateOrderItems }: OrderCardProps) => {
  const isPickup = order.deliveryOption === 'pickup';
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBatchStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    
    try {
      await updateOrderItems(
        order.items.map(item => ({
          orderItemId: item.id,
          status: newStatus
        }))
      );
      refetch();
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatus = (): OrderStatus | null => {
    if (order.items.every(item => item.itemStatus === OrderStatus.READY_FOR_PICKUP)) {
      return OrderStatus.IN_TRANSIT;
    }
    if (order.items.every(item => item.itemStatus === OrderStatus.IN_TRANSIT)) {
      return OrderStatus.DELIVERED;
    }
    return null;
  };

  const nextStatus = getNextStatus();
  const allItemsSameStatus = order.items.every(
    item => item.itemStatus === order.items[0].itemStatus
  );
  const currentStatus = allItemsSameStatus ? order.items[0].itemStatus : 'mixed';

  const statusColors: Record<OrderStatus | 'mixed', string> = {
    [OrderStatus.PENDING]: 'bg-yellow-50 text-yellow-700',
    [OrderStatus.READY_FOR_PICKUP]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.IN_TRANSIT]: 'bg-blue-100 text-blue-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.COMPLETED]: 'bg-green-200 text-green-900',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [OrderStatus.REJECTED]: 'bg-red-200 text-red-900',
    'mixed': 'bg-gray-100 text-gray-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
    >
      {/* Order Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <motion.h4 
              className="font-medium text-gray-900 text-lg"
              whileHover={{ x: 2 }}
            >
              Order #{order.orderId.slice(0, 8)}
            </motion.h4>
            <p className="text-gray-500 text-base">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.span 
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                statusColors[currentStatus as keyof typeof statusColors]
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {currentStatus === 'mixed' ? 'Multiple Statuses' : currentStatus.replace('_', ' ')}
            </motion.span>
            
            {nextStatus && (
              <motion.button
                onClick={() => handleBatchStatusChange(nextStatus)}
                disabled={isUpdating}
                className={`px-4 py-2 flex items-center space-x-2 text-sm rounded-lg ${
                  nextStatus === OrderStatus.IN_TRANSIT
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isUpdating ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Clock size={16} />
                  </motion.span>
                ) : (
                  <>
                    {nextStatus === OrderStatus.IN_TRANSIT ? (
                      <ArrowRight size={16} />
                    ) : (
                      <Check size={16} />
                    )}
                    <span>
                      {nextStatus === OrderStatus.IN_TRANSIT 
                        ? "Mark All as Picked" 
                        : "Mark All as Delivered"}
                    </span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Customer and Location Info */}
      <div className="p-5 space-y-4">
        <motion.div 
          className="flex items-start space-x-4"
          whileHover={{ x: 3 }}
        >
          <div className="p-2 bg-blue-50 rounded-full mt-1">
            {isPickup ? (
              <MapPin className="text-blue-600" size={20} />
            ) : (
              <Navigation className="text-blue-600" size={20} />
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isPickup ? 'Pickup Station' : 'Delivery Address'}
            </p>
            <p className="text-gray-600 text-base">
              {isPickup 
                ? order.destination.station?.name 
                : order.destination.location?.fullAddress}
            </p>
            {isPickup && order.destination.station && (
              <div className="mt-2 text-sm text-gray-500">
                <p>Hours: {order.destination.station.openingHours}</p>
                <p>Status: {order.destination.station.isOpenNow ? 'Open' : 'Closed'}</p>
              </div>
            )}
          </div>
        </motion.div>

          {
        order.deliveryOption === 'delivery' && (

          <motion.div 
          className="flex items-start space-x-4"
          whileHover={{ x: 3 }}
          >
          <div className="p-2 bg-blue-50 rounded-full mt-1">
            <Mail className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">Customer</p>
            <p className="text-gray-600 text-base">
              {order.customer.name} • {order.customer.phone}
            </p>
            {order.customer.email && (
              <p className="text-gray-600 text-base">{order.customer.email}</p>
            )}
          </div>
        </motion.div>
        )
          }
      </div>

      {/* Items List */}
      <div className="p-5 pt-0">
        <motion.h5 
          className="font-medium text-gray-700 text-lg flex items-center space-x-2 mb-4"
          whileHover={{ x: 3 }}
        >
          <Package size={22} />
          <span>Items ({order.items.length})</span>
        </motion.h5>

        <motion.div 
          layout
          className="space-y-3"
        >
          {order.items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.01 }}
              className="p-4 bg-white border rounded-lg shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="p-2.5 bg-blue-50 rounded-full"
                  whileHover={{ rotate: 10 }}
                >
                  {item.itemStatus === OrderStatus.READY_FOR_PICKUP ? (
                    <Package className="text-blue-600" size={20} />
                  ) : item.itemStatus === OrderStatus.IN_TRANSIT ? (
                    <Navigation className="text-blue-600" size={20} />
                  ) : (
                    <CheckCircle className="text-green-600" size={20} />
                  )}
                </motion.div>
                <div>
                  <p className="font-medium text-lg">Item #{item.id.slice(0, 8)}</p>
                  <p className="text-gray-500 text-base">Code: {item.randomCode}</p>
                </div>
              </div>
              
              <motion.span 
                className={`px-3 py-1.5 text-sm rounded-full ${
                  statusColors[item.itemStatus]
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {item.itemStatus.replace('_', ' ')}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};


export default DriverDeliveriesPage;