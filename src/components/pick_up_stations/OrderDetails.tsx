// src/components/OrderDetails.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, X } from 'lucide-react';

interface OrderDetailsProps {
  order: any;
  onClose: () => void;
}

export const OrderDetails = ({ order, onClose }: OrderDetailsProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-green-800">Order Details</h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-green-800 mb-2">Order Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">ID:</span> {order.id}</p>
                  <p><span className="text-gray-500">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                  <p><span className="text-gray-500">Status:</span> 
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <User size={16} /> Customer Details
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Name:</span> {order.customer.first_name} {order.customer.last_name}</p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-500" />
                    <span>{order?.customer.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-500" />
                    <span>{order.customer.phone}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-green-800 mb-2">Delivery Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Option:</span> {order.deliveryOption}</p>
                  {order.deliveryInstructions && (
                    <p><span className="text-gray-500">Instructions:</span> {order.deliveryInstructions}</p>
                  )}
                  {order.specialInstructions && (
                    <p><span className="text-gray-500">Special Instructions:</span> {order.specialInstructions}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};