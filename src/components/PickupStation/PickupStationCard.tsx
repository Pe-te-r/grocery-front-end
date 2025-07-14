import { formatTime } from '@/lib/utils';
import type { PickupStation } from '@/util/types';
import { Clock, Phone, MapPin, Edit, Trash2, Loader2 } from 'lucide-react';

interface PickupStationCardProps {
  station: PickupStation;
  onEdit: () => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  is24Hour: boolean;
}

const PickupStationCard = ({ station, onEdit, onDelete, isDeleting,is24Hour }: PickupStationCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow relative">
      {isDeleting && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <Loader2 className="animate-spin text-white" size={24} />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-green-800">{station.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-green-600 hover:text-green-800"
              disabled={isDeleting}
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(station.id)}
              className="text-red-500 hover:text-red-700"
              disabled={isDeleting}
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
              {formatTime(station.openingTime, is24Hour)} - {formatTime(station.closingTime, is24Hour)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupStationCard;