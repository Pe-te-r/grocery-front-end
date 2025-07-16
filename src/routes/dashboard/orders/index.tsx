import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/orders/')({
  component: AdminOrdersPage,
})

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '@/hooks/ordersHook';
import { LoadingSpinner } from '@/components/orders/LoadingSpinner';
import { ErrorMessage } from '@/components/orders/ErrorMessage';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { OrderCard } from '@/components/orders/OrderCard';
import PaginationControls from '@/components/PickupStation/PaginationControls';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';

export default function AdminOrdersPage() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const { data, isLoading, error } = useOrders({
    page: currentPage,
    limit: itemsPerPage,
    sort: '-created_at'
  });

  const orders = data?.data || [];
  const totalOrders = orders.length;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-green-800 mb-2">Orders Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-l ${viewMode === 'table' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-r ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Card View
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <OrdersTable
          orders={orders}
          onViewDetails={setSelectedOrderId}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order: any) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={() => setSelectedOrderId(order.id)}
            />
          ))}
        </div>
      )}

      <PaginationControls
        totalPages={totalOrders}
        page={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}