import { userByIdHook } from '@/hooks/userHook';
import { X, LogOut, Shield, ShieldOff, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Loading } from './Loading';
import {  getUserIdHelper, logoutUserHelper } from '@/lib/authHelper';
import { useNavigate } from '@tanstack/react-router';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
  const userId = getUserIdHelper() ?? ''
  const navigate = useNavigate()
  const { data, isSuccess, isLoading } = userByIdHook(userId, { account_modal: true })
  const [userData, setUser] = useState({
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isTwoFactorEnabled: true,
    joinedAt: '',
    lastLogin: '',
    role: '',
    status: '',
  });
  useEffect(() => {
    setUser(
      {
        ...data?.data,
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      }
    )
  }, [isSuccess, data])
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
    <div className="fixed inset-0 z-50 bg-[rgba(148,194,147,0.7)] transition-opacity overflow-y-auto">
      {/* Modal container - full width on mobile */}
      <div className="flex items-center bordder-100 justify-center min-h-screen p-0 sm:p-4 text-center">
        <div className="inline-block w-full h-screen sm:h-auto sm:w-auto align-bottom bg-white rounded-none sm:rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3/4">

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

          {/* Modal content - scrollable on mobile */}
          {isLoading ? 
            <div className="flex items-center justify-center h-100 w-100">
            <Loading/>
            </div>
          : <>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-none">
                <div className="flex flex-col sm:flex-row gap-6">

                  {/* User details - single column on mobile */}
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">First Name</p>
                        <p className="mt-1 text-sm text-gray-900">{userData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Last Name</p>
                        <p className="mt-1 text-sm text-gray-900">{userData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-sm text-gray-900 break-all">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                        <p className="mt-1 text-sm text-gray-900">{userData.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">2FA Status</p>
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
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Role</p>
                        <p className="mt-1 text-sm text-gray-900">{userData.role}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Joined At</p>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(userData.joinedAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Last Login</p>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(userData.lastLogin)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Status</p>
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

              {/* Modal footer - stacked buttons on mobile */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col-reverse sm:flex-row  gap-2">
                <button
                  type="button"
                  className="w-full sm:w-auto justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none"
                  onClick={() => {
                    logoutUserHelper()
                    onClose();
                    navigate({to:'/'})
                  }}
                >
                  <LogOut className="w-5 h-5 mr-2 inline" />
                  Logout
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};