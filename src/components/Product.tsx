import {motion} from 'framer-motion'
import { Leaf } from 'lucide-react';
export const ProductCard = ({ product }: { product: any }) => {
  console.log('product', product)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-green-50"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <span className="text-green-600 font-bold">KES {product.price}</span>
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

        <button
          disabled={product.stock === 0}
          className={`mt-4 w-full py-2 rounded-md text-white font-medium transition-colors ${product.stock === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};
