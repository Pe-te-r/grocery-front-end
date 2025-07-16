import { motion } from 'framer-motion';
import { Calendar, User, CreditCard, Package } from 'lucide-react';

interface OrdersTableProps {
  orders: {
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
  }[];
  onViewDetails: (orderId: string) => void;
}

export const OrdersTable = ({ orders, onViewDetails }: OrdersTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-green-50 text-green-800">
          <th className="p-3 text-left text-sm font-medium">Order ID</th>
          <th className="p-3 text-left text-sm font-medium">Customer</th>
          <th className="p-3 text-left text-sm font-medium">Date</th>
          <th className="p-3 text-left text-sm font-medium">Amount</th>
          <th className="p-3 text-left text-sm font-medium">Status</th>
          <th className="p-3 text-left text-sm font-medium">Payment</th>
          <th className="p-3 text-left text-sm font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <motion.tr
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border-b hover:bg-green-50 transition"
          >
            <td className="p-3 text-sm">#{order.id.slice(0, 8)}</td>
            <td className="p-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                {order.customer.first_name} {order.customer.last_name}
              </div>
            </td>
            <td className="p-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                {new Date(order.created_at).toLocaleDateString()}
              </div>
            </td>
            <td className="p-3 text-sm font-medium text-green-700">${order.totalAmount}</td>
            <td className="p-3 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }`}>
                {order.status}
              </span>
            </td>
            <td className="p-3 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                {order.paymentMethod}
              </div>
            </td>
            <td className="p-3 text-sm">
              <button
                onClick={() => onViewDetails(order.id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
              >
                <Package className="w-3 h-3" />
                Details
              </button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);