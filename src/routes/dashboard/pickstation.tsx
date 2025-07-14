import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCountyQuery } from '@/hooks/countyHook';
import PickupStationCard from '@/components/PickupStation/PickupStationCard';
import PaginationControls from '@/components/PickupStation/PaginationControls';
import AddEditStationModal from '@/components/PickupStation/AddEditStationModal';
import SearchBar from '@/components/PickupStation/SearchBar';
import {
  useCreatePickupStation,
  usePickupStationsQuery,
  useUpdatePickupStation,
  useDeletePickupStation
} from '@/hooks/pickStationHook';
import toast from 'react-hot-toast';
import type { PickupStation } from '@/util/types';

export const Route = createFileRoute('/dashboard/pickstation')({
  component: AdminPickupStations,
})

function AdminPickupStations() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<PickupStation | null>(null);

  // Data fetching
  const { data: countiesData } = useCountyQuery();
  const {
    data: pickupStationsData,
    isLoading,
    isError,
    refetch
  } = usePickupStationsQuery();

  // Mutations
  const createMutation = useCreatePickupStation();
  const updateMutation = useUpdatePickupStation();
  const [is24Hour, setIs24Hour] = useState(false)
  const deleteMutation = useDeletePickupStation();

  // Filter stations based on search term (now handled by API)
  const filteredStations =Array.isArray(pickupStationsData) && pickupStationsData.filter((station: any) =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.constituency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.county.county_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const totalPages = pickupStationsData?.totalPages || 1;

  const handleAddStation = async (newStation: Omit<PickupStation, 'id'>) => {
    try {
      await createMutation.mutateAsync(newStation, {
        onSuccess: () => {
          toast.success('Pickup station added successfully');
          refetch();
          setIsModalOpen(false);
        },
        onError: (error) => {
          toast.error(`Error adding station: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('Error adding station:', error);
    }
  };

  const handleEditStation = async (updatedStation: PickupStation) => {
    if (!editingStation) return;

    try {
      await updateMutation.mutateAsync({
        id: editingStation.id,
        data: {
          name: updatedStation.name,
          contactPhone: updatedStation.contactPhone,
          openingTime: updatedStation.openingTime,
          closingTime: updatedStation.closingTime
        }
      }, {
        onSuccess: () => {
          toast.success('Pickup station updated successfully');
          refetch();
          setIsModalOpen(false);
        },
        onError: (error) => {
          toast.error(`Error updating station: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };

  const handleDeleteStation = async (stationId: string) => {
    try {
      await deleteMutation.mutateAsync(stationId, {
        onSuccess: () => {
          toast.success('Pickup station deleted successfully');
          refetch();
        },
        onError: (error) => {
          toast.error(`Error deleting station: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('Error deleting station:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-800">Loading pickup stations...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading pickup stations</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              setSearchTerm={(term) => {
                setSearchTerm(term);
                setPage(1); // Reset to first page when searching
              }}
            />
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">Time Format:</span>
              <button
                onClick={() => setIs24Hour(false)}
                className={`px-2 py-1 text-sm rounded-md ${!is24Hour ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
              >
                12h
              </button>
              <button
                onClick={() => setIs24Hour(true)}
                className={`px-2 py-1 text-sm rounded-md ${is24Hour ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
              >
                24h
              </button>
            </div>
            <button
              onClick={() => {
                setEditingStation(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              disabled={createMutation.isPending}
            >
              <Plus size={18} />
              {createMutation.isPending ? 'Adding...' : 'Add New Station'}
            </button>
          </div>
        </div>

        {/* Stations Grid */}
        {filteredStations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No pickup stations found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-green-600 hover:text-green-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {filteredStations.map((station: PickupStation) => (
                <PickupStationCard
                  is24Hour={is24Hour}
                  key={station.id}
                  station={station}
                  onEdit={() => {
                    setEditingStation(station);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDeleteStation}
                  isDeleting={deleteMutation.isPending && deleteMutation.variables === station.id}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            <PaginationControls
              page={page}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              onItemsPerPageChange={(newLimit) => {
                setItemsPerPage(newLimit);
                setPage(1); // Reset to first page when changing items per page
              }}
            />
          </>
        )}

        {/* Add/Edit Modal */}
        <AddEditStationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          counties={countiesData?.data || []}
          initialData={editingStation}
          onSubmit={editingStation ? handleEditStation : handleAddStation}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </motion.div>
  );
};