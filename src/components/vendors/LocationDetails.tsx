import { Home, MapPin } from "lucide-react";
import { Loader2 } from 'lucide-react';
import { useState } from "react";

export const LocationInfoStep = ({
  locationInfo,
  setLocationInfo,
  counties,
  constituencies,
  errors
}: {
  locationInfo: {
    county: string;
    countyId: string;
    constituency: string;
    constituencyId: string;
    streetAddress: string;
  },
  setLocationInfo: (data: {
    county: string;
    countyId: string;
    constituency: string;
    constituencyId: string;
    streetAddress: string;
  }) => void,
  counties: Array<{ id: string; county_name: string }>,
  constituencies: Array<{ id: string; name: string }>,
  errors: Record<string, string>
}) => {
  const [isCountiesLoading] = useState(false);
  const [isConstituenciesLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'county') {
      const selectedCounty = counties.find(c => c.id === value);
      setLocationInfo({
        ...locationInfo,
        countyId: value,
        county: selectedCounty?.county_name || '',
        constituencyId: '',
        constituency: ''
      });
    } else if (name === 'constituency') {
      const selectedConstituency = constituencies.find(c => c.id === value);
      setLocationInfo({
        ...locationInfo,
        constituencyId: value,
        constituency: selectedConstituency?.name || ''
      });
    } else {
      setLocationInfo({
        ...locationInfo,
        [name]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-green-600" />
        Business Location
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
            County *
          </label>
          {isCountiesLoading ? (
            <div className="flex items-center justify-center h-10 border border-gray-300 rounded-lg">
              <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
            </div>
          ) : (
            <>
              <select
                id="county"
                name="county"
                value={locationInfo.countyId}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border ${errors.county ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              >
                <option value="">Select County</option>
                {counties.map(county => (
                  <option key={county.id} value={county.id}>
                    {county.county_name}
                  </option>
                ))}
              </select>
              {errors.county && (
                <p className="mt-1 text-sm text-red-600">{errors.county}</p>
              )}
            </>
          )}
        </div>

        <div>
          <label htmlFor="constituency" className="block text-sm font-medium text-gray-700 mb-1">
            Constituency *
          </label>
          {isConstituenciesLoading && locationInfo.countyId ? (
            <div className="flex items-center justify-center h-10 border border-gray-300 rounded-lg">
              <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
            </div>
          ) : (
            <>
              <select
                id="constituency"
                name="constituency"
                value={locationInfo.constituencyId}
                onChange={handleChange}
                required
                disabled={!locationInfo.countyId || constituencies.length === 0}
                className={`w-full px-4 py-2 border ${errors.constituency ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50`}
              >
                <option value="">Select Constituency</option>
                {constituencies.map(constituency => (
                  <option key={constituency.id} value={constituency.id}>
                    {constituency.name}
                  </option>
                ))}
              </select>
              {errors.constituency && (
                <p className="mt-1 text-sm text-red-600">{errors.constituency}</p>
              )}
            </>
          )}
        </div>

        <div>
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address/Building *
          </label>
          <div className="relative">
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={locationInfo.streetAddress}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              placeholder="e.g. Moi Avenue, Plaza 123"
            />
            <Home className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.streetAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>
          )}
        </div>
      </div>
    </div>
  );
};