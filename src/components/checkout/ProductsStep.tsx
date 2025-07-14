import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export function ProductsStep({
  cartItems,
  totalPrice,
  onNext
}: {
  cartItems: any[];
  totalPrice: number;
  onNext: () => void;
}) {
  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Review Your Order</h2>

      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-green-50 transition-colors"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600">KES {item.price} x {item.quantity}</p>
            </div>
            <div className="text-green-600 font-medium">
              KES {(item.price * item.quantity).toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-medium">
          <span>Subtotal:</span>
          <span>KES {totalPrice}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          Continue to Location <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}