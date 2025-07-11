import { Check, Mail, Phone, User } from "lucide-react";

export interface FormData{
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  businessInfo: {
    businessName: string;
    businessDescription: string;
    businessType: 'individual' | 'company';
    businessContact: string;
  };
  locationInfo: {
    county: string;
    constituency: string;
    streetAddress: string;
  };
  termsAccepted: boolean;
};

// Components
export const PersonalInfoStep = ({ userInfo }: { userInfo: FormData['userInfo'] }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
        <User className="w-5 h-5 mr-2 text-green-600" />
        Personal Information
      </h3>

      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-green-800 mb-2 flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Information from your profile
        </h4>
        <p className="text-sm text-green-700">
          This information is taken from your account profile and cannot be edited here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={userInfo.fullName}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={userInfo.email}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={userInfo.phone}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};