import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Phone, UserCog, BadgeCheck, Edit, Check, X } from 'lucide-react';
import type { UserData } from './types';
import { useForm } from '@tanstack/react-form';
import { getUserIdHelper } from '@/lib/authHelper';
import { useUpdateUserHook } from '@/hooks/userHook';
import { VerificationModal } from '../codes/VerificationModal';
import toast from 'react-hot-toast';

const ProfileSection = ({ userData, refetch }: { userData: UserData; refetch: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [verifyBeforeSave, setVerifyBeforeSave] = useState(false);
  const [formValues, setFormValues] = useState({
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const { mutate, isPending, error } = useUpdateUserHook();
  const id = getUserIdHelper() ?? '';

  const form = useForm({
    defaultValues: {
      id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
    },
    onSubmit: async ({ value }) => {
      // Store form values and trigger verification
      setFormValues(value);
      setVerifyBeforeSave(true);
    },
  });

  const handleVerified = () => {
    // This is called after successful verification
    mutate(formValues, {
      onSuccess: (data) => {
        toast.success('Profile updated successfully');
        refetch();
        setIsEditing(false);
        setVerifyBeforeSave(false);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update profile');
      }
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {!isEditing ? (
        <motion.div
          key="profile-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center">
            <span className="text-gray-600 w-32">First Name:</span>
            <span className="font-medium">{userData.firstName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 w-32">Last Name:</span>
            <span className="font-medium">{userData.lastName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 w-32">Email:</span>
            <span className="font-medium flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              {userData.email}
            </span>
          </div>
          {userData.phone && (
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Phone:</span>
              <span className="font-medium flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {userData.phone}
              </span>
            </div>
          )}
          <div className="flex items-center">
            <span className="text-gray-600 w-32">Account Created:</span>
            <span className="font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(userData.joinedAt)}
            </span>
          </div>
          {userData.role && (
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Role:</span>
              <span className="font-medium flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                {userData.role}
              </span>
            </div>
          )}
          {userData.status && (
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Status:</span>
              <span
                className={`font-medium flex items-center ${userData.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                <BadgeCheck className="mr-2 h-4 w-4" />
                {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
              </span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="mt-4 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key="edit-form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="firstName"
              children={(field) => (
                <div className="flex flex-col">
                  <label className="text-gray-600 mb-1">First Name</label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            />
            <form.Field
              name="lastName"
              children={(field) => (
                <div className="flex flex-col">
                  <label className="text-gray-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            />
            <form.Field
              name="phone"
              children={(field) => (
                <div className="flex flex-col">
                  <label className="text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 p-2 rounded bg-red-50"
              >
                {error.message}
              </motion.div>
            )}

            <div className="flex space-x-3 mt-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit]) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isPending}
                    className={`flex items-center px-4 py-2 ${isPending
                      ? 'bg-green-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                      } text-white rounded-lg transition`}
                  >
                    {isPending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                )}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Verification Modal */}
      <VerificationModal
        isOpen={verifyBeforeSave}
        onClose={() => setVerifyBeforeSave(false)}
        isOTPEnabled={userData.isTwoFactorEnabled}
        is2FAEnabled={false}
        onVerified={handleVerified}
      />
    </div>
  );
};

export default ProfileSection;