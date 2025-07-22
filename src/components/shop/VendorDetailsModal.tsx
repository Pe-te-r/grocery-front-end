import { motion, AnimatePresence } from "framer-motion";
import { X, Store, User, MapPin, Package, CheckCircle, Clock } from "lucide-react";

interface VendorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    businessName: string;
    businessDescription: string;
    businessType: string;
    businessContact: string;
    streetAddress: string;
    approved: boolean;
    hasProducts: boolean;
    productCount: number;
    orderCount: number;
    location: {
      constituency: string;
      county: string;
    };
    createdAt: string;
    updatedAt: string;
    vendorDetails: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: string;
      isVerified: boolean;
      accountStatus: string;
    };
    termsAccepted: boolean;
    approvalStatus: boolean;
  } | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

export const VendorDetailsModal = ({
  isOpen,
  onClose,
  data,
  isLoading,
  isError,
  error,
}: VendorDetailsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-800"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {isLoading ? (
              <div className="p-8 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : isError ? (
              <div className="p-8 text-center">
                <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Error loading vendor details
                </h3>
                <p className="text-gray-600 mt-2">
                  {error?.message || "Please try again later"}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : data ? (
              <div className="divide-y divide-gray-100">
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {data.businessName}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        {data.businessDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Store className="w-5 h-5 text-green-600" />
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Business Type</p>
                      <p className="font-medium capitalize">{data.businessType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{data.businessContact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{data.streetAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <div className="flex items-center gap-1">
                        {data.approvalStatus ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="font-medium">
                          {data.approvalStatus ? "Approved" : "Pending Approval"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Terms Accepted</p>
                      <p className="font-medium">
                        {data.termsAccepted ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Constituency</p>
                      <p className="font-medium">{data.location.constituency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">County</p>
                      <p className="font-medium">{data.location.county}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Package className="w-5 h-5 text-green-600" />
                    Business Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Products</p>
                      <p className="font-medium">
                        {data.hasProducts ? `${data.productCount} products` : "No products"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="font-medium">{data.orderCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="font-medium">
                        {new Date(data.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {new Date(data.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <User className="w-5 h-5 text-green-600" />
                    Vendor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {data.vendorDetails.firstName}{" "}
                        {data.vendorDetails.lastName || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{data.vendorDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{data.vendorDetails.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <p className="font-medium capitalize">
                        {data.vendorDetails.accountStatus}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Verification</p>
                      <p className="font-medium">
                        {data.vendorDetails.isVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium capitalize">
                        {data.vendorDetails.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};