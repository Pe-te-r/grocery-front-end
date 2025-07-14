import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <Package className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
      <p className="text-gray-500 mb-4">Add some products to your cart before checkout</p>
      <Link
        to="/products"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Browse Products
      </Link>
    </motion.div>
  );
}