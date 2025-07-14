import { useState } from 'react';
import { MapPin, Store, Home, ChevronRight } from 'lucide-react';

type LocationOption = 'pickup' | 'delivery';

export function LocationStep({
  orderData,
  setOrderData,
  pickupStations,
  onBack,
  onNext
}: {
  orderData: any;
  setOrderData: (data: any) => void;
  pickupStations: any[];
  onBack: () => void;
  onNext: () => void;
}) {
  const [activeTab, setActiveTab] = useState<LocationOption>(orderData.deliveryOption);
  const [selectedStation, setSelectedStation] = useState('');

  

  // Mock counties data - replace with your API data
  const COUNTIES = [
    { name: 'Nairobi', subCounties: ['Westlands', 'Dagoretti', 'Langata', 'Kasarani', 'Embakasi'] },
    { name: 'Mombasa', subCounties: ['Mvita', 'Kisauni', 'Likoni', 'Changamwe'] },
  ];

  const handleCountySelect = (county: string) => {
    setOrderData({ ...orderData, county, subCounty: '' });
  };

  const canProceed = activeTab === 'pickup'
    ? selectedStation !== ''
    : orderData.county && orderData.subCounty;

  return (
    <div className="p-6 md:p-8">
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
          onClick={() => setActiveTab('delivery')}
        >
          <Home className="w-5 h-5 mr-2" />
          Home Delivery
        </button>
      </div>

      {activeTab === 'pickup' ? (
        <div className="space-y-4 mb-6">
          <h3 className="font-medium text-gray-800">Select Pickup Station</h3>
          {pickupStations.map((station) => (
            <div
              key={station.id}
              onClick={() => {
                setSelectedStation(station.id);
                setOrderData({
                  ...orderData,
                  deliveryOption: 'pickup',
                  county: 'Nairobi', // Default county for pickup
                  subCounty: station.name
                });
              }}
              className={`p-4 border rounded-lg cursor-pointer ${selectedStation === station.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            >
              <h4 className="font-medium">{station.name}</h4>
              <p className="text-sm text-gray-600">{station.address}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
            <div className="relative">
              <select
                value={orderData.county}
                onChange={(e) => handleCountySelect(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="">Select County</option>
                {COUNTIES.map((county) => (
                  <option key={county.name} value={county.name}>{county.name}</option>
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
                onChange={(e) => setOrderData({ ...orderData, subCounty: e.target.value, deliveryOption: 'delivery' })}
                disabled={!orderData.county}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none disabled:opacity-50"
              >
                <option value="">Select Sub-County</option>
                {orderData.county && COUNTIES
                  .find(c => c.name === orderData.county)
                  ?.subCounties.map((subCounty: string) => (
                    <option key={subCounty} value={subCounty}>{subCounty}</option>
                  ))}
              </select>
              <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Continue to Delivery <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}