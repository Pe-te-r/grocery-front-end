import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/pickstation')({
  component: AdminPickupStations,
})
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCountyQuery } from '@/hooks/countyHook';
import PickupStationCard from '@/components/PickupStation/PickupStationCard';
import PaginationControls from '@/components/PickupStation/PaginationControls';
import AddEditStationModal from '@/components/PickupStation/AddEditStationModal';
import SearchBar from '@/components/PickupStation/SearchBar';
import { useCreatePickupStation, usePickupStationsQuery } from '@/hooks/pickStationHook';
import toast from 'react-hot-toast';

// Mock data - replace with your API calls
interface mockPickupStations {
  id: '',
  name: '',
  contactPhone: '',
  constituency: {
    id: '',
    name: ''
  },
  county: {
    id: '',
    county_code: '',
    county_name: '',
    county_initials: ''
  },
  openingTime: '',
  closingTime: ''
}
function AdminPickupStations() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  const { data: countiesData } = useCountyQuery();
  const [pickupStations, setPickupStations] = useState<mockPickupStations[]>([]);

  // Filter stations based on search term
  const filteredStations = pickupStations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.constituency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { data, isSuccess } = usePickupStationsQuery()
  const createMutate = useCreatePickupStation()
  useEffect(() => {
    console.log('data',data)
    if (data) setPickupStations(data)
  }, [data, isSuccess])

  // Pagination logic
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const paginatedStations = filteredStations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddStation = (newStation: any) => {
    console.log('Adding new station:', newStation);
    createMutate.mutate(newStation, {
      onSuccess: () => {
        toast.success('Pick station added success')
      }
    })
    // In a real app: setPickupStations([...pickupStations, newStation]);
  };

  const handleEditStation = (updatedStation: any) => {
    console.log('Updating station:', updatedStation);
    // In a real app:
    // setPickupStations(pickupStations.map(station => 
    //   station.id === updatedStation.id ? updatedStation : station
    // ));
  };

  const handleDeleteStation = (stationId: string) => {
    console.log('Deleting station with id:', stationId);
    // In a real app:
    // setPickupStations(pickupStations.filter(station => station.id !== stationId));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-green-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-green-800">Pickup Stations</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <button
              onClick={() => {
                setEditingStation(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              Add New Station
            </button>
          </div>
        </div>

        {/* Stations Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {paginatedStations.map((station: any) => (
            <PickupStationCard
              key={station.id}
              station={station}
              onEdit={() => {
                setEditingStation(station);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteStation}
            />
          ))}
        </motion.div>

        {/* Pagination */}
        <PaginationControls
          page={page}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        {/* Add/Edit Modal */}
        <AddEditStationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          counties={countiesData?.data || []}
          initialData={editingStation}
          onSubmit={editingStation ? handleEditStation : handleAddStation}
        />
      </div>
    </motion.div>
  );
};

