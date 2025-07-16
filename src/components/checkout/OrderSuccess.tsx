import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function OrderSuccess({
  totalAmount,
  deliveryOption,
  deliveryFee,
  location
}: {
  totalAmount: number;
  deliveryOption: string;
  deliveryFee: number;
  location: string;
  }) {
  console.log({
    totalAmount,
    deliveryOption,
    deliveryFee,
    location
  })
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We've received it and will process it shortly.
        </p>
        <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-medium text-green-800 mb-2">Order Summary</h4>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Total:</span> KES {(totalAmount +   deliveryFee).toFixed(2)}
            {deliveryOption === 'delivery' && (
              <span className="block">(Including KES {deliveryFee.toFixed(2)} delivery fee)</span>
            )}
            {deliveryOption === 'pickup' && (
              <span className="block">(Including KES {deliveryFee.toFixed(2)} pickup fee)</span>
            )}
          </p>
          {deliveryOption === 'delivery' && (
            <p className="text-sm text-gray-700 mt-2">
              Your order will be delivered to {location}
            </p>
          )}
          {deliveryOption === 'pickup' && (
            <p className="text-sm text-gray-700 mt-2">
              You'll collect your order at {location}
            </p>
          )}
        </div>
        <Link
          to="/products"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    </motion.div>
  );
}