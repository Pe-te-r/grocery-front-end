import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { useGetconstituenciesByCounty } from '@/hooks/constituencyHook';

interface AddEditStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  counties: Array<{
    id: string;
    county_code: string;
    county_name: string;
    county_initials: string;
  }>;
  initialData: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;

}

const AddEditStationModal = ({
  isOpen,
  onClose,
  counties,
  initialData,
  onSubmit,
  isLoading
}: AddEditStationModalProps) => {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const { data } = useGetconstituenciesByCounty(selectedCounty || '');
  const constituenciesData= data?.data

  const form = useForm({
    defaultValues: {
      name: '',
      contactPhone: '',
      county_id: '',
      constituencyId: '',
      openingTime: '08:00',
      closingTime: '17:00',
    },
    onSubmit: ({ value }) => {
      if (!value.name || !value.contactPhone || !value.constituencyId) {
        return;
      }

      
      const stationData = {
        ...value,
      };

      onSubmit(stationData);
    },
  });

  // Set initial data when editing
  useEffect(() => {
    if (initialData) {
      form.setFieldValue('name', initialData.name);
      form.setFieldValue('contactPhone', initialData.contactPhone);
      form.setFieldValue('county_id', initialData.county.id);
      form.setFieldValue('constituencyId', initialData.constituency.id);
      form.setFieldValue('openingTime', initialData.openingTime);
      form.setFieldValue('closingTime', initialData.closingTime);
      setSelectedCounty(initialData.county.county_name);
    } else {
      form.reset();
      setSelectedCounty(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
            <h2 className="text-2xl font-bold text-green-800">
              {initialData ? 'Edit Pickup Station' : 'Add New Pickup Station'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <form.Field
                  name="name"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Station Name
                      </label>
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <form.Field
                  name="contactPhone"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <form.Field
                  name="county_id"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        County
                      </label>
                      <select
                        value={field.state.value}
                        onChange={(e) => {
                          const countyId = e.target.value;
                          field.handleChange(countyId);
                          setSelectedCounty(countyId);
                          form.setFieldValue('constituencyId', '');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        disabled={!!initialData}
                      >
                        <option value="">Select County</option>
                        {Array.isArray(counties) && counties.map((county) => (
                          <option key={county.id} value={county.county_name}>
                            {county.county_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                />
              </div>

              <div>
                <form.Field
                  name="constituencyId"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Constituency
                      </label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={!selectedCounty || !!initialData}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        required
                      >
                        <option value="">Select Constituency</option>
                        {constituenciesData?.map((constituency: any) => (
                          <option key={constituency.id} value={constituency.id}>
                            {constituency.name}
                          </option>
                        ))}
                      </select>
                      {initialData && (
                        <p className="mt-1 text-sm text-gray-500">
                          Constituency cannot be changed after creation
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <form.Field
                    name="openingTime"
                    children={(field) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Opening Time
                        </label>
                        <input
                          type="time"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    )}
                  />
                </div>
                <div>
                  <form.Field
                    name="closingTime"
                    children={(field) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Closing Time
                        </label>
                        <input
                          type="time"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                {initialData ? 'Update Station' :
                 isLoading ? <Loader2 className="animate-spin" size={18} />:
                  'Add Station'}
                </button>
              </div>
            </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddEditStationModal;