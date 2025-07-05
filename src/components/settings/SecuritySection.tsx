import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, Calendar } from 'lucide-react';
import type { PasswordFormData } from './types';

const SecuritySection = ({
  isTwoFactorEnabled,
  lastLogin
}: {
  isTwoFactorEnabled: boolean;
  lastLogin: string;
}) => {
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setPasswordError('');
    console.log('Changing password:', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleToggle2FA = (enable: boolean) => {
    console.log(`2FA ${enable ? 'enabled' : 'disabled'}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Last Login */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-2">
          <Calendar className="mr-2 h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-800">Last Login</h3>
        </div>
        <p className="text-gray-600">{formatDate(lastLogin)}</p>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800 flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Two-Factor Authentication (2FA)
          </h3>
          <div className="flex items-center">
            <span className={`mr-2 text-sm font-medium ${isTwoFactorEnabled ? 'text-green-600' : 'text-gray-500'
              }`}>
              {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <motion.button
              animate={isTwoFactorEnabled ? "on" : "off"}
              variants={{
                on: { backgroundColor: '#10B981' },
                off: { backgroundColor: '#E5E7EB' }
              }}
              onClick={() => handleToggle2FA(!isTwoFactorEnabled)}
              className="relative inline-flex h-6 w-11 items-center rounded-full"
            >
              <motion.span
                variants={{
                  on: { x: 20 },
                  off: { x: 0 }
                }}
                className="inline-block h-4 w-4 rounded-full bg-white"
              />
            </motion.button>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Two-factor authentication adds an additional layer of security to your account.
        </p>
      </div>

      {/* Change Password */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-medium text-gray-800 flex items-center mb-4">
          <Key className="mr-2 h-5 w-5" />
          Change Password
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {passwordError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm"
            >
              {passwordError}
            </motion.div>
          )}
          {passwordSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 text-sm"
            >
              Password changed successfully!
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitPassword}
            className="mt-2 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;