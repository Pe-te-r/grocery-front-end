import { useGetVendorDashboard } from "@/hooks/vendorHook";
import { getUserIdHelper } from "@/lib/authHelper";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  XCircle,
  Store,
  User,
  MapPin,
  Phone,
  Mail,
  Loader2,
  AlertCircle
} from "lucide-react";

const VendorDashboard = () => {
    const vendorId = getUserIdHelper() ?? ''
  const { data: vendorDashboard, isLoading, error } = useGetVendorDashboard(vendorId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-8 h-8 mr-2" />
        <p>Failed to load dashboard data</p>
      </div>
    );
  }

  if (!vendorDashboard) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No dashboard data available</p>
      </div>
    );
  }
  console.log('Vendor Dashboard Data:', vendorDashboard);
  const { storeInfo, vendorInfo, stats } = vendorDashboard?.data;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-green-800">Vendor Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Store className="text-green-600" />
          <span className="font-medium">{storeInfo.businessName}</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Products Card */}
        <StatCard
          icon={<Package className="w-6 h-6" />}
          title="Total Products"
          value={stats.totalProducts}
          color="bg-green-100 text-green-800"
        />

        {/* Available Products Card */}
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Available"
          value={stats.availableProducts}
          color="bg-green-50 text-green-700"
        />

        {/* Unavailable Products Card */}
        <StatCard
          icon={<XCircle className="w-6 h-6" />}
          title="Unavailable"
          value={stats.unavailableProducts}
          color="bg-amber-50 text-amber-700"
        />

        {/* Orders Card */}
        <StatCard
          icon={<Package className="w-6 h-6" />}
          title="Total Orders"
          value={stats.totalOrders}
          color="bg-green-100 text-green-800"
        />

        {/* Completed Orders Card */}
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Completed"
          value={stats.completedOrders}
          color="bg-green-50 text-green-700"
        />
      </motion.div>

      {/* Store & Vendor Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="p-4 border rounded-lg shadow-sm bg-white"
        >
          <h2 className="flex items-center text-lg font-semibold text-green-800 mb-4">
            <Store className="w-5 h-5 mr-2" />
            Store Information
          </h2>
          <div className="space-y-3">
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={storeInfo.streetAddress} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Contact" value={storeInfo.businessContact} />
            <InfoRow 
              icon={<MapPin className="w-4 h-4" />} 
              label="Location" 
              value={`${storeInfo.constituency.name}, ${storeInfo.county.name}`} 
            />
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${storeInfo.approved ? 'bg-green-500' : 'bg-amber-500'}`} />
              </div>
              <span className="text-sm text-gray-600">
                Status: {storeInfo.approved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Vendor Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="p-4 border rounded-lg shadow-sm bg-white"
        >
          <h2 className="flex items-center text-lg font-semibold text-green-800 mb-4">
            <User className="w-5 h-5 mr-2" />
            Vendor Information
          </h2>
          <div className="space-y-3">
            <InfoRow 
              icon={<User className="w-4 h-4" />} 
              label="Name" 
              value={`${vendorInfo.firstName} ${vendorInfo.lastName}`} 
            />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={vendorInfo.email} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={vendorInfo.phone} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }: { 
  icon: React.ReactNode; 
  title: string; 
  value: number; 
  color: string; 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-4 rounded-lg shadow-sm ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-white bg-opacity-30">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// Info Row Component
const InfoRow = ({ icon, label, value }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
}) => {
  return (
    <div className="flex items-start">
      <div className="w-4 h-4 mr-2 mt-0.5 text-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};

export default VendorDashboard;