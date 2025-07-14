import { motion } from 'framer-motion';
import { Clock, Phone, MapPin, Edit, Trash2 } from 'lucide-react';

interface PickupStationCardProps {
  station: {
    id: string;
    name: string;
    contactPhone: string;
    constituency: {
      id: string;
      name: string;
    };
    county: {
      county_name: string;
    };
    openingTime: string;
    closingTime: string;
  };
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const PickupStationCard = ({ station, onEdit, onDelete }: PickupStationCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-green-800">{station.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-green-600 hover:text-green-800"
              aria-label="Edit station"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(station.id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Delete station"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3 text-gray-600">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-green-600" />
            <span>{station.contactPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            <div>
              <p>{station.constituency.name}</p>
              <p className="text-sm text-gray-500">{station.county.county_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-green-600" />
            <span>
              {station.openingTime} - {station.closingTime}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PickupStationCard;