import { createFileRoute, useMatchRoute, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/products/')({
  component: ProductsRouteComponent,
})

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useGetProductQuery } from '@/hooks/productHook';
import { ProductCard } from '@/components/Product';


// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-green-200 text-green-700 disabled:opacity-50 hover:bg-green-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`w-10 h-10 rounded-md ${1 === currentPage ? 'bg-green-600 text-white' : 'border border-green-200 text-green-700 hover:bg-green-50'}`}
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-md ${page === currentPage
              ? 'bg-green-600 text-white'
              : 'border border-green-200 text-green-700 hover:bg-green-50'
            }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`w-10 h-10 rounded-md ${totalPages === currentPage
                ? 'bg-green-600 text-white'
                : 'border border-green-200 text-green-700 hover:bg-green-50'
              }`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-green-200 text-green-700 disabled:opacity-50 hover:bg-green-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Main ProductsPage component
export function ProductsRouteComponent(){


  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
const matchRoute = useMatchRoute();
const isProducts = matchRoute({ to: '/products' })
console.log('isProducts:', isProducts);
const param_url = isProducts ? '/products/' :  '/dashboard/products/' 


const searchParams = useSearch({
  from: param_url,      
}) as { category?: string };

const category = searchParams.category;

  const { data, isLoading, isError } = useGetProductQuery(category);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Our Products</h1>
            <p className="text-green-600">Loading our fresh products...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 h-64 animate-pulse">
                <div className="bg-gray-200 h-32 rounded-md mb-4"></div>
                <div className="bg-gray-200 h-4 rounded-md mb-2"></div>
                <div className="bg-gray-200 h-4 rounded-md w-3/4 mb-4"></div>
                <div className="bg-gray-200 h-8 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-4">Error Loading Products</h1>
          <p className="text-green-600">We couldn't load the products. Please try again later.</p>
        </div>
      </div>
    );
  }

  const products = data?.data || [];
  const sortedProducts = [...products].sort((a, b) => {
    const aSoldOut = a.stock <= 0;
    const bSoldOut = b.stock <= 0;
    if (aSoldOut === bSoldOut) return 0;
    return aSoldOut ? 1 : -1;
  });
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center bg-green-100 px-6 py-2 rounded-full mb-4">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">GroceryStore</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">{category ? `${category}` : "Our Fresh Products"}</h1>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">No Products Available</h2>
            <p className="text-green-600">Check back later for our latest offerings.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};