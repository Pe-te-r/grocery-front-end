import ShopCard from '@/components/shop/ShopCard';
import { useAdminShopsdHook, useGetStoreByIdHook } from '@/hooks/storeHook';
import { createFileRoute } from '@tanstack/react-router'
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, List, Store } from 'lucide-react';
import { VendorDetailsModal } from '@/components/shop/VendorDetailsModal';

export const Route = createFileRoute('/dashboard/shops/')({
  component: ShopsPage,
})

type TabType = 'all' | 'approved' | 'pending';

function ShopsPage({ isAdmin = true }: { isAdmin?: boolean }) {
     const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const { data:storeData, isLoading, isError, error } = useGetStoreByIdHook(selectedStoreId || '');

    const saveStoreId = (id: string) => {
    setSelectedStoreId(id);
  };
  
  const { data, refetch } = useAdminShopsdHook();
  const [activeTab, setActiveTab] = useState<TabType>('approved');
  const [sampleShops, setSampleShops] = useState([
    {
      id: "",
      businessName: "",
      businessDescription: "",
      businessType: "",
      businessContact: "",
      streetAddress: "",
      approved: false,
      user: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      },
      constituency: {
        name: "",
      },
    },
  ]);

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setSampleShops(data.data);
    }
  }, [data]);

  const filteredShops = sampleShops.filter(shop => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approved') return shop.approved;
    if (activeTab === 'pending') return !shop.approved;
    return true;
  });

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {isAdmin ? "Manage Shops" : "Local Shops"}
          </h1>
          <p className="text-green-600">
            {isAdmin
              ? "Review and approve new shop applications"
              : "Discover eco-friendly businesses in your area"}
          </p>
        </motion.div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex border-b border-green-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center px-4 py-2 text-sm font-medium relative ${activeTab === 'all' ? 'text-green-600' : 'text-green-500 hover:text-green-700'}`}
              >
                <List className="w-4 h-4 mr-2" />
                All Shops
                {activeTab === 'all' && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`flex items-center px-4 py-2 text-sm font-medium relative ${activeTab === 'approved' ? 'text-green-600' : 'text-green-500 hover:text-green-700'}`}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approved
                {activeTab === 'approved' && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex items-center px-4 py-2 text-sm font-medium relative ${activeTab === 'pending' ? 'text-green-600' : 'text-green-500 hover:text-green-700'}`}
              >
                <Clock className="w-4 h-4 mr-2" />
                Pending
                {activeTab === 'pending' && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                  />
                )}
              </button>
            </div>
          </motion.div>
        )}

        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} setSelectedStoreId={saveStoreId} refetch={refetch} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Store className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              No shops found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'approved'
                ? "No approved shops available"
                : activeTab === 'pending'
                  ? "No pending shops awaiting approval"
                  : "No shops registered yet"}
            </p>
          </motion.div>
        )}
                  <VendorDetailsModal
        isOpen={!!selectedStoreId}
        onClose={() => setSelectedStoreId(null)}
        data={storeData?.data}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      </div>
    </div>
  );
};

export default ShopsPage;