import { useCart } from '@/lib/cartHelper';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Plus, Minus, ShoppingCart, Info } from 'lucide-react';
import { useState } from 'react';

export const ProductCard = ({ product }: { product: any }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleAddToCart = () => {
    if (!product.isAvailable || product.stock === 0) return;
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  const canAddToCart = product.isAvailable && product.stock > 0;

  return (
    <>
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
          {!product.isAvailable && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              Not Available
            </motion.div>
          )}
          {product.isAvailable && product.stock === 0 && (
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
            <button 
              onClick={() => setShowDetailsModal(true)}
              className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
            >
              <Info className="w-3 h-3 mr-1" /> More info
            </button>
            {product.isAvailable && product.stock > 0 && (
              <span className="flex items-center text-green-600 text-sm">
                <Leaf className="w-4 h-4 mr-1" /> {product.stock} available
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
                disabled={!canAddToCart}
                className={`mt-4 w-full py-2 rounded-md text-white font-medium transition-colors flex items-center justify-center space-x-2 ${
                  canAddToCart
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
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
                      {canAddToCart ? 'Add to Cart' : 'Unavailable'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Quick add on hover */}
        <AnimatePresence>
          {isHovered && canAddToCart && quantityInCart === 0 && (
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

      {/* Product Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowDetailsModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white/95 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">Price:</h3>
                        <p className="text-green-600 font-bold">KES {product.price}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800">Availability:</h3>
                        {product.isAvailable ? (
                          <p className="text-green-600 flex items-center">
                            <Leaf className="w-4 h-4 mr-1" /> 
                            {product.stock > 0 
                              ? `${product.stock} available in stock` 
                              : 'Currently out of stock'}
                          </p>
                        ) : (
                          <p className="text-red-500">Currently not available for sale</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800">Category:</h3>
                        <p>{product.subCategory?.name} ({product.subCategory?.category?.name})</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor Information */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Business Name:</h4>
                      <p>{product.store?.businessName}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Business Type:</h4>
                      <p>{product.store?.businessType}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Contact:</h4>
                      <p>{product.store?.businessContact}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Address:</h4>
                      <p>{product.store?.streetAddress}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-700">Description:</h4>
                      <p>{product.store?.businessDescription}</p>
                    </div>
                  </div>
                </div>

                {canAddToCart && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        handleAddToCart();
                        setShowDetailsModal(false);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};