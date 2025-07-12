import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Phone, Store, User, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Shop {
  id: string;
  businessName: string;
  businessDescription: string;
  businessType: string;
  businessContact: string;
  streetAddress: string;
  approved: boolean;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  constituency: {
    name: string;
  };
}

const ShopCard = ({ shop, isAdmin = false }: { shop: Shop; isAdmin?: boolean }) => {
  const [isApproved, setIsApproved] = useState(shop.approved);

  const handleApprove = () => {
    console.log(`Approving shop with ID: ${shop.id}`);
    setIsApproved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg overflow-hidden shadow-md border transition-all ${isApproved ? "border-green-200 hover:shadow-green-100" : "border-amber-200 hover:shadow-amber-100"
        } hover:shadow-lg`}
    >
      <div className={`p-4 ${isApproved ? "bg-gradient-to-r from-green-50 to-green-100" : "bg-gradient-to-r from-amber-50 to-amber-100"}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isApproved ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
              <Store size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {shop.businessName}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {shop.businessType}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white shadow-sm ${isApproved ? "text-green-600" : "text-amber-600"}`}>
            {isApproved ? (
              <>
                <CheckCircle2 size={14} className="text-green-500" />
                <span>Approved</span>
              </>
            ) : (
              <>
                <Clock size={14} className="text-amber-500" />
                <span>Pending</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white">
        <p className="text-gray-600 mb-4 line-clamp-3">{shop.businessDescription}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-gray-700 truncate">
              {shop.user.first_name} {shop.user.last_name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-green-600 flex-shrink-0" />
            <a
              href={`tel:${shop.businessContact}`}
              className="text-gray-700 hover:text-green-600 truncate"
            >
              {shop.businessContact}
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-gray-700 line-clamp-1">
              {shop.streetAddress}, {shop.constituency.name}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {isAdmin && !isApproved && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApprove}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              Approve Shop
              <CheckCircle2 size={16} />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`py-2 px-3 border border-green-600 text-green-600 hover:bg-green-50 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-1 ${isAdmin && !isApproved ? "w-1/3" : "w-full"}`}
          >
            View
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopCard;