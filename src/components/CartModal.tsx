import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cartHelper';
import { Link } from '@tanstack/react-router';

export const CartModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col border border-green-100">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b border-green-100 bg-green-50 rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="text-green-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-green-100 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal body - Cart items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <ShoppingCart className="text-gray-300 mb-4" size={40} />
                    <p className="text-gray-500">Your cart is empty</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Start shopping to add items
                    </p>
                  </motion.div>
                ) : (
                  <ul className="space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item) => {
                        const itemTotal = parseFloat(item.price) * item.quantity;
                        return (
                          <motion.li
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col p-3 rounded-lg hover:bg-green-50 transition-colors border border-green-100"
                          >
                            <div className="flex items-start">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md border border-green-100"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                  <h3 className="font-medium text-gray-800 line-clamp-1">
                                    {item.name}
                                  </h3>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>

                                {/* Price per item */}
                                <div className="mt-1 text-sm text-gray-600">
                                  <span>KES {parseFloat(item.price).toFixed(2)} each</span>
                                </div>
                              </div>
                            </div>

                            {/* Quantity controls and subtotal */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-100">
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className={`p-1 rounded-md ${item.quantity <= 1 ? 'text-gray-300' : 'text-green-600 hover:bg-green-100'}`}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="mx-2 w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  className={`p-1 rounded-md ${item.quantity >= item.stock ? 'text-gray-300' : 'text-green-600 hover:bg-green-100'}`}
                                >
                                  <Plus size={16} />
                                </button>
                                <span className="text-xs text-gray-500 ml-2">
                                  {item.stock} available
                                </span>
                              </div>

                              {/* Item subtotal */}
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  {item.quantity} × KES {parseFloat(item.price).toFixed(2)}
                                </div>
                                <div className="text-green-600 font-semibold">
                                  KES {itemTotal.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {/* Modal footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-green-100 p-4 bg-green-50 rounded-b-lg">
                  {/* Summary */}
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="text-gray-800 font-medium">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="border-t border-green-100 my-2"></div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Total:</span>
                      <span className="text-green-600 font-bold text-lg">
                        KES {totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={clearCart}
                      className="flex-1 py-2 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Clear Cart
                    </button>
                    <Link
                      to='/checkout'
                      onClick={onClose}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      Checkout Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};