import { authActions } from '@/store/authStore';
import { X, LogOut, Shield, ShieldOff, Edit } from 'lucide-react';
import { useState } from 'react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
  const [userData] = useState({
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    isTwoFactorEnabled: true,
    joinedAt: '2023-05-15T10:30:00Z',
    lastLogin: '2024-02-20T14:45:00Z',
    role: 'Super Admin',
    status: 'Active',
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(148,194,147,0.7)]  transition-opacity overflow-y-auto">
      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header */}
          <div className="bg-green-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="text-white cursor-pointer hover:text-green-100 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-lg leading-6 font-medium text-white sm:flex-1">
              Account Details
            </h3>
          </div>

          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Profile image */}
              <div className="flex flex-col items-center">
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
                />
                <button className="mt-3 text-sm text-green-600 hover:text-green-800 flex items-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Change Photo
                </button>
              </div>

              {/* User details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p className="mt-1 text-sm text-gray-900">{userData.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p className="mt-1 text-sm text-gray-900">{userData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1 text-sm text-gray-900">{userData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">2FA Status</p>
                    <div className="mt-1 flex items-center">
                      {userData.isTwoFactorEnabled ? (
                        <>
                          <Shield className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-sm text-gray-900">Enabled</span>
                        </>
                      ) : (
                        <>
                          <ShieldOff className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">Disabled</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="mt-1 text-sm text-gray-900">{userData.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joined At</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(userData.joinedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(userData.lastLogin)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${userData.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {userData.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                authActions.deleteUser()
                onClose();
              }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center cursor-pointer rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};