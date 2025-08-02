import { AlertCircle, FileText } from "lucide-react";
import type { FormData } from "./VendorProfile";

export const ReviewStep = ({
  formData,
  setTermsAccepted,
  errors
}: {
  formData: FormData,
  setTermsAccepted: (accepted: boolean) => void,
  counties: Array<{ id: string; county_name: string }>,
  constituencies: Array<{ id: string; name: string }>,
  errors: Record<string, string>
}) => {

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-green-600" />
        Review Your Application
      </h3>

      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-green-800 mb-2 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Important Information
        </h4>
        <p className="text-sm text-green-700">
          By submitting this application, you agree to our Vendor Terms and Conditions.
          Our team will review your application and contact you within 3-5 business days.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Personal Information</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{formData.userInfo.fullName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{formData.userInfo.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{formData.userInfo.phone || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">Business Information</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Business Type</p>
                <p className="font-medium capitalize">{formData.businessInfo.businessType || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Business Name</p>
                <p className="font-medium">{formData.businessInfo.businessName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Business Contact</p>
                <p className="font-medium">{formData.businessInfo.businessContact || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Business Description</p>
                <p className="font-medium">{formData.businessInfo.businessDescription || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">Location Information</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">County</p>
                <p className="font-medium">{formData.locationInfo.county}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Constituency</p>
                <p className="font-medium">{formData.locationInfo.constituency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Street Address</p>
                <p className="font-medium">{formData.locationInfo.streetAddress || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted || false}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
            className={`h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${errors.termsAccepted ? 'border-red-500' : ''
              }`}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="termsAccepted" className="font-medium text-gray-700">
            I agree to the <a href="#" className="text-green-600 hover:text-green-800">Vendor Terms and Conditions</a>
          </label>
          {errors.termsAccepted && (
            <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>
          )}
        </div>
      </div>
    </div>
  );
};