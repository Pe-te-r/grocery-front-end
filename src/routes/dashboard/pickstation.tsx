import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/pickstation')({
  component: AdminPickupStations,
})
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCountyQuery } from '@/hooks/countyHook';
import PickupStationCard from '@/components/PickupStation/PickupStationCard';
import PaginationControls from '@/components/PickupStation/PaginationControls';
import AddEditStationModal from '@/components/PickupStation/AddEditStationModal';
import SearchBar from '@/components/PickupStation/SearchBar';

// Mock data - replace with your API calls
const mockPickupStations = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    name: 'Westlands Grocery Hub',
    contactPhone: '+254712345678',
    constituency: {
      id: '7aa72fe6-5d59-4258-9d03-107777296db1',
      name: 'Changamwe'
    },
    county: {
      id: '3a8d56df-031b-4164-b060-f6b25cda8629',
      county_code: '01',
      county_name: 'Mombasa County',
      county_initials: 'MSA'
    },
    openingTime: '08:00',
    closingTime: '18:00'
  },
  // Add more mock data as needed
];

function AdminPickupStations(){
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  const { data: countiesData } = useCountyQuery();
  const [pickupStations, setPickupStations] = useState(mockPickupStations);

  // Filter stations based on search term
  const filteredStations = pickupStations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.constituency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const paginatedStations = filteredStations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddStation = (newStation: any) => {
    console.log('Adding new station:', newStation);
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

