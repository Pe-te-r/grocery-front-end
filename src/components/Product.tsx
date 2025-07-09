import { useCart } from '@/lib/cartHelper';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export const ProductCard = ({ product }: { product: any }) => {
  const { addToCart, removeFromCart, isInCart, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-green-50 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stock and in-cart indicators */}
      <div className="absolute top-2 right-2 flex flex-col space-y-1 z-10">
        {product.stock === 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-red-500 text-white text-xs px-2 py-1 rounded"
          >
            Out of Stock
          </motion.div>
        )}
        {quantityInCart > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-500 text-white text-xs px-2 py-1 rounded"
          >
            In Cart: {quantityInCart}
          </motion.div>
        )}
      </div>

      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <motion.span
            className="text-green-600 font-bold"
            whileHover={{ scale: 1.1 }}
          >
            KES {product.price}
          </motion.span>
        </div>

        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {/* Sold by: product.createdBy.first_name */}
          </span>
          {product.isAvailable && (
            <span className="flex items-center text-green-600 text-sm">
              <Leaf className="w-4 h-4 mr-1" /> Available
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <AnimatePresence>
          {quantityInCart > 0 ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex items-center justify-between bg-green-50 rounded-md p-1"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleRemoveFromCart}
                className="p-2 rounded-md text-green-700 hover:bg-green-100"
                disabled={quantityInCart <= 0}
              >
                <Minus size={16} />
              </motion.button>

              <motion.span
                className="font-medium text-green-700"
                key={quantityInCart}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {quantityInCart}
              </motion.span>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2 rounded-md text-green-700 hover:bg-green-100"
                disabled={quantityInCart >= product.stock}
              >
                <Plus size={16} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`mt-4 w-full py-2 rounded-md text-white font-medium transition-colors flex items-center justify-center space-x-2 ${product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.span
                    key="adding"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Added!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Quick add on hover */}
      <AnimatePresence>
        {isHovered && quantityInCart === 0 && product.stock > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 left-4"
          >
            <button
              onClick={handleAddToCart}
              className="p-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};