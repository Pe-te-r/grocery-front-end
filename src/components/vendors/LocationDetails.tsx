import type { LocationData } from "@/routes/dashboard/applications";
import type { FormData } from "./VendorProfile";
import { useState } from "react";
import { Home, MapPin } from "lucide-react";

export const LocationInfoStep = ({
  locationInfo,
  setLocationInfo,
  locationData
}: {
  locationInfo: FormData['locationInfo'],
  setLocationInfo: (data: FormData['locationInfo']) => void,
  locationData: LocationData
}) => {
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [selectedConstituency, setSelectedConstituency] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'county') {
      setSelectedCounty(value);
      setSelectedConstituency('');
      setLocationInfo({
        ...locationInfo,
        county: value,
        constituency: '',
        ward: ''
      });
    } else if (name === 'constituency') {
      setSelectedConstituency(value);
      setLocationInfo({
        ...locationInfo,
        constituency: value,
        ward: ''
      });
    } else {
      setLocationInfo({
        ...locationInfo,
        [name]: value
      });
    }
  };

  const selectedCountyData = locationData.counties.find(c => c.id === selectedCounty);
  const selectedConstituencyData = selectedCountyData?.constituencies.find(c => c.id === selectedConstituency);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-green-600" />
        Business Location
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
            County
          </label>
          <select
            id="county"
            name="county"
            value={selectedCounty}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select County</option>
            {locationData.counties.map(county => (
              <option key={county.id} value={county.id}>{county.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="constituency" className="block text-sm font-medium text-gray-700 mb-1">
            Constituency
          </label>
          <select
            id="constituency"
            name="constituency"
            value={selectedConstituency}
            onChange={handleChange}
            required
            disabled={!selectedCounty}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
          >
            <option value="">Select Constituency</option>
            {selectedCountyData?.constituencies.map(constituency => (
              <option key={constituency.id} value={constituency.id}>{constituency.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
            Ward
          </label>
          <select
            id="ward"
            name="ward"
            value={locationInfo.ward}
            onChange={handleChange}
            required
            disabled={!selectedConstituency}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
          >
            <option value="">Select Ward</option>
            {selectedConstituencyData?.wards.map(ward => (
              <option key={ward.id} value={ward.id}>{ward.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address/Building
          </label>
          <div className="relative">
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={locationInfo.streetAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. Moi Avenue, Plaza 123"
            />
            <Home className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};