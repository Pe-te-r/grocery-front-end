import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

export const OrderDetailsModal = ({ orderId, onClose }: OrderDetailsModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg w-full max-w-md"
    >
      <div className="flex justify-between items-center border-b p-4">
        <h3 className="text-lg font-semibold text-green-800">Order Details</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-center text-lg font-medium">Order ID: {orderId}</p>
        <p className="text-center text-sm text-gray-500 mt-2">
          More details will be shown here in future
        </p>
      </div>

      <div className="border-t p-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);