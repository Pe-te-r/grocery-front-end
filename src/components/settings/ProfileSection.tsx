import { useState } from 'react';
import { motion } from 'framer-motion';
import {  Mail, Calendar, Phone, UserCog, BadgeCheck, Edit, Check, X } from 'lucide-react';
import type { UserData, ProfileFormData } from './types';

const ProfileSection = ({ userData }: { userData: UserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {!isEditing ? (
        <div className="space-y-4">
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
              <span className={`font-medium flex items-center ${userData.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
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
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(false)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileSection;