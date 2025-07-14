import { useState } from 'react';
import { MapPin, Store, Home, ChevronRight, Clock, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPickupStationsByCounty } from '@/api/pickstation';
import { formatTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type LocationOption = 'pickup' | 'delivery';

export function LocationStep({
  orderData,
  setOrderData,
  onBack,
  onNext,
  counties,
  constituencies
}: {
  orderData: any;
  setOrderData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
  counties: { id: string; county_name: string }[];
  constituencies: { id: string; name: string }[];
}) {
  const [activeTab, setActiveTab] = useState<LocationOption>(orderData.deliveryOption);
  const [selectedStation, setSelectedStation] = useState('');
  const [is24Hour, setIs24Hour] = useState(true);

  // Fetch pickup stations when county is selected for pickup
  const { data: pickupStations = [], isLoading: isLoadingStations } = useQuery({
    queryKey: ['pickupStations', orderData.countyId],
    queryFn: () => fetchPickupStationsByCounty(orderData.countyId),
    enabled: activeTab === 'pickup' && !!orderData.countyId
  });

  const handleCountySelect = (countyId: string) => {
    const selectedCounty = counties.find(c => c.id === countyId);
    setOrderData({
      ...orderData,
      county: selectedCounty ? selectedCounty.county_name : '',
      countyId: countyId,
      subCounty: '',
      pickupStationId: ''
    });
  };

  const handleSelectStation = (station: any) => {
    setSelectedStation(station.id);
    setOrderData({
      ...orderData,
      deliveryOption: 'pickup',
      pickupStationId: station.id,
      subCounty: station.constituency.name
    });
  };

  const canProceed = activeTab === 'pickup'
    ? selectedStation !== ''
    : orderData.county && orderData.subCounty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-green-800 mb-6">Select Delivery Option</h2>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex-1 py-2 font-medium flex items-center justify-center ${activeTab === 'pickup' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('pickup')}
        >
          <Store className="w-5 h-5 mr-2" />
          Pickup Station
        </button>
        <button
          className={`flex-1 py-2 font-medium flex items-center justify-center ${activeTab === 'delivery' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('delivery');
            setOrderData({
              ...orderData,
              deliveryOption: 'delivery',
              pickupStationId: ''
            });
          }}
        >
          <Home className="w-5 h-5 mr-2" />
          Home Delivery
        </button>
      </div>

      {activeTab === 'pickup' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
              <div className="relative">
                <select
                  value={orderData.countyId || ''}
                  onChange={(e) => handleCountySelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                >
                  <option value="">Select County</option>
                  {counties.map((county) => (
                    <option key={county.id} value={county.id}>{county.county_name}</option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Time format toggle - Single toggle for all stations */}
          {orderData.countyId && pickupStations.length > 0 && (
            <div className="flex justify-end">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1.5">
                <span className="text-sm text-gray-700">Time Format:</span>
                <button
                  onClick={() => setIs24Hour(!is24Hour)}
                  className={`px-2 py-1 text-sm rounded-md transition-colors ${is24Hour ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'}`}
                >
                  24h
                </button>
                <button
                  onClick={() => setIs24Hour(!is24Hour)}
                  className={`px-2 py-1 text-sm rounded-md transition-colors ${!is24Hour ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'}`}
                >
                  12h
                </button>
              </div>
            </div>
          )}

          {orderData.countyId && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Available Pickup Stations</h3>

              <AnimatePresence>
                {isLoadingStations ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4"
                  >
                    Loading stations...
                  </motion.div>
                ) : pickupStations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4 text-gray-500"
                  >
                    No pickup stations available in this county
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {pickupStations.map((station: any) => (
                      <motion.div
                        key={station.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => handleSelectStation(station)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedStation === station.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{station.name}</h4>
                            <p className="text-sm text-gray-600">{station.constituency.name}</p>
                          </div>
                          {selectedStation === station.id && (
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Selected
                            </div>
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1.5" />
                            <span>{station.contactPhone}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            <span>
                              {formatTime(station.openingTime, is24Hour)} - {formatTime(station.closingTime, is24Hour)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'delivery' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
            <div className="relative">
              <select
                value={orderData.countyId || ''}
                onChange={(e) => handleCountySelect(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="">Select County</option>
                {counties.map((county) => (
                  <option key={county.id} value={county.id}>{county.county_name}</option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub-County</label>
            <div className="relative">
              <select
                value={orderData.subCounty}
                onChange={(e) => setOrderData({
                  ...orderData,
                  subCounty: e.target.value,
                  constituencyId: e.target.value,
                  deliveryOption: 'delivery',
                  pickupStationId: ''
                })}
                disabled={!orderData.countyId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none disabled:opacity-50"
              >
                <option value="">Select Sub-County</option>
                {orderData.countyId && constituencies.map((constituency) => (
                  <option key={constituency.id} value={constituency.id}>{constituency.name}</option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between mt-8"
      >
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => {
            console.log('Submitting with data:', orderData);
            onNext();
          }}
          disabled={!canProceed}
          className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Continue to Delivery <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}