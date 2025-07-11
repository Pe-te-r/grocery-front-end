import { FileText, Phone, Store } from "lucide-react";
import type { FormData } from "./VendorProfile";

export const BusinessInfoStep = ({
  businessInfo,
  setBusinessInfo,
  errors
}: {
  businessInfo: FormData['businessInfo'],
  setBusinessInfo: (data: FormData['businessInfo']) => void,
  errors: Record<string, string>
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessInfo({
      ...businessInfo,
      [name]: value
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo({
      ...businessInfo,
      [name]: value as 'individual' | 'company'
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
        <Store className="w-5 h-5 mr-2 text-green-600" />
        Business Details
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        This information will be visible to buyers when they visit your shop page.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Business Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${businessInfo.businessType === 'individual' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}>
            <input
              type="radio"
              name="businessType"
              value="individual"
              checked={businessInfo.businessType === 'individual'}
              onChange={handleRadioChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <span className="ml-3 block text-sm font-medium text-gray-700">
              Individual/Sole Proprietor
            </span>
          </label>

          <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${businessInfo.businessType === 'company' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}>
            <input
              type="radio"
              name="businessType"
              value="company"
              checked={businessInfo.businessType === 'company'}
              onChange={handleRadioChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <span className="ml-3 block text-sm font-medium text-gray-700">
              Registered Company
            </span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
          Business Name *
        </label>
        <div className="relative">
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={businessInfo.businessName}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border ${errors.businessName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            placeholder="Your business name"
          />
          <Store className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.businessName && (
          <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessContact" className="block text-sm font-medium text-gray-700 mb-1">
          Business Contact Phone *
        </label>
        <div className="relative">
          <input
            type="tel"
            id="businessContact"
            name="businessContact"
            value={businessInfo.businessContact}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border ${errors.businessContact ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            placeholder="Official business contact number"
          />
          <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.businessContact && (
          <p className="mt-1 text-sm text-red-600">{errors.businessContact}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Business Description *
        </label>
        <div className="relative">
          <textarea
            id="businessDescription"
            name="businessDescription"
            value={businessInfo.businessDescription}
            onChange={handleChange}
            required
            rows={4}
            className={`w-full px-4 py-2 border ${errors.businessDescription ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            placeholder="Describe your business, products you plan to sell, etc."
          />
          <FileText className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.businessDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.businessDescription}</p>
        )}
      </div>
    </div>
  );
};