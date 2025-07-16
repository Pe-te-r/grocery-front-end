import { motion } from 'framer-motion';
import { Calendar, User, CreditCard, Package } from 'lucide-react';

interface OrderCardProps {
  order: {
    id: string;
    customer: {
      first_name: string;
      last_name: string;
      email: string;
    };
    totalAmount: string;
    status: string;
    created_at: string;
    paymentMethod: string;
  };
  onViewDetails: () => void;
}

export const OrderCard = ({ order, onViewDetails }: OrderCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="p-4 bg-green-50 border-b">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-green-800">Order #{order.id.slice(0, 8)}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
          }`}>
          {order.status}
        </span>
      </div>
    </div>

    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-green-600" />
          <span>{order.customer.first_name} {order.customer.last_name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-green-600" />
          <span>{new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-green-600" />
          <span>{order.paymentMethod}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>Total:</span>
          <span className="text-green-700">KES. {order.totalAmount}</span>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        <Package className="w-4 h-4" />
        View Details
      </button>
    </div>
  </motion.div>
);