import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Plus, Minus, RotateCw, AlertCircle, Package, PackageCheck, PackageX, Save, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { productsByUserIdHook } from '@/hooks/userHook';
import { getUserIdHelper } from '@/lib/authHelper';

export const Route = createFileRoute('/dashboard/vendor/my_products')({
  component: VendorProductsPage,
})

// Product Card Component
function ProductCard({
  product,
  onDelete,
  onSaveChanges
}: {
  product: any;
  onUpdateStock: (id: string, stock: number) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
  onSaveChanges: (product: any) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev: any) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    onSaveChanges(editedProduct);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {editedProduct.stock} in stock
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              name="description"
              value={editedProduct.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <input
              type="number"
              name="price"
              value={editedProduct.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">{editedProduct.name}</h3>
              <span className="text-green-600 font-bold">KES {editedProduct.price}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">{editedProduct.description}</p>
          </div>
        )}

        {/* Stock Management */}
        <div className="mt-4">
          {isEditing ? (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <button
                  onClick={() => setEditedProduct((prev: any) => ({
                    ...prev,
                    stock: Math.max(0, prev.stock - 1)
                  }))}
                  className="p-1 rounded-md text-green-600 hover:bg-green-50"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  name="stock"
                  value={editedProduct.stock}
                  onChange={handleInputChange}
                  className="mx-2 w-12 text-center border border-gray-300 rounded-md px-1 py-1"
                />
                <button
                  onClick={() => setEditedProduct((prev: any) => ({
                    ...prev,
                    stock: prev.stock + 1
                  }))}
                  className="p-1 rounded-md text-green-600 hover:bg-green-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditedProduct((prev: any) => ({
                    ...prev,
                    isAvailable: !prev.isAvailable
                  }))}
                  className={`p-2 rounded-full ${editedProduct.isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                  title={editedProduct.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {editedProduct.isAvailable ? (
                    <PackageCheck size={16} />
                  ) : (
                    <PackageX size={16} />
                  )}
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  title="Delete product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  Stock: {editedProduct.stock}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${editedProduct.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {editedProduct.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Save className="mr-2" size={16} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Edit className="mr-2" size={16} />
              Edit Product
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function VendorProductsPage() {
  const userId = getUserIdHelper() ?? ''

  const [activeTab, setActiveTab] = useState<'available' | 'outOfStock'>('available');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = productsByUserIdHook(userId)

  // Filter products based on active tab
  const filteredProducts = data?.data?.filter((product: any) =>
    activeTab === 'available' ? product.stock > 0 : product.stock === 0
  ) || [];

  const totalPages = Math.ceil((data?.pagination?.total || 0) / pageSize);

  const handleUpdateStock = (productId: string, newStock: number) => {
    console.log(`Updating product ${productId} stock to ${newStock}`);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log(`Deleting product ${productId}`);
  };

  const handleToggleAvailability = (productId: string, isAvailable: boolean) => {
    console.log(`Setting product ${productId} availability to ${isAvailable}`);
  };

  const handleSaveChanges = (product: any) => {
    console.log('Saving changes for product:', product);
    // Here you would typically make an API call to update the product
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen p-4"
      >
        <RotateCw className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Loading your products...</p>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen p-4"
      >
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg text-gray-700">Error loading products</p>
        <p className="text-sm text-gray-500">{error.message}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
        <Link
          to="/dashboard/vendor/add"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="mr-2" size={16} />
          Add New Product
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 font-medium flex items-center ${activeTab === 'available' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <PackageCheck className="mr-2" size={16} />
          Available ({data?.data?.filter((p: any) => p.stock > 0).length || 0})
        </button>
        <button
          onClick={() => setActiveTab('outOfStock')}
          className={`px-4 py-2 font-medium flex items-center ${activeTab === 'outOfStock' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <PackageX className="mr-2" size={16} />
          Out of Stock ({data?.data?.filter((p: any) => p.stock === 0).length || 0})
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 bg-green-50 rounded-lg"
        >
          <Package className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {activeTab === 'available' ? 'No available products' : 'No out of stock products'}
          </h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'available'
              ? 'All your products are currently out of stock'
              : 'All your products are currently available'}
          </p>
          {activeTab === 'outOfStock' && (
            <button
              onClick={() => setActiveTab('available')}
              className="px-4 py-2 text-green-600 hover:text-green-700 font-medium"
            >
              View available products
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdateStock={handleUpdateStock}
                onDelete={handleDeleteProduct}
                onToggleAvailability={handleToggleAvailability}
                onSaveChanges={handleSaveChanges}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-green-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </motion.div>
  );
};

export default VendorProductsPage;