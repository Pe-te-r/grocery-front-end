import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Key, Calendar, Loader2, Check } from 'lucide-react';
import { useCreateTotp, useResetPassword, useVerifyTotp } from '@/hooks/authHook';
import { VerificationModal } from '../codes/VerificationModal';
import { TotpSetupModal } from '../TotpSetup';
import toast from 'react-hot-toast';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecuritySection = ({
  isTwoFactorEnabled,
  lastLogin,
  userID
}: {
  isTwoFactorEnabled: boolean;
  lastLogin: string;
  userID: string;
}) => {
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [verifyForOtpSetup, setVerifyForOtpSetup] = useState(false);
  const [showSetOtp, setShowSetOtp] = useState(false);
  const [verifyForPassword, setVerifyForPassword] = useState(false);
  const [isVerifiedForPassword, setIsVerifiedForPassword] = useState(false);

  const { data } = useCreateTotp({ enabled: showSetOtp });
  const { mutate: resetPassword, isPending } = useResetPassword();
  const totpMutate = useVerifyTotp();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError('');
  };

  const handleSubmitTotp = (code: string) => {
    totpMutate.mutate(code, {
      onSuccess: (data) => {
        if (data.status == 'success') {
          toast.success('TOTP verified successfully');
          setShowSetOtp(false);
        } else if (data.status === 'error') {
          toast.error('Verification failed. Please try again.');
        }
      }
    });
  };

  const handleSubmitPassword = () => {
    // If 2FA is enabled and not yet verified, show verification modal
    if (isTwoFactorEnabled && !isVerifiedForPassword) {
      setVerifyForPassword(true);
      return;
    }

    // Proceed with password change after verification (or if 2FA is disabled)
    submitPasswordChange();
  };

  const submitPasswordChange = () => {
    // Reset previous states
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    // Prepare data for API
    const passwordData = {
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      userID: userID
    };

    // Call the mutation
    resetPassword(passwordData, {
      onSuccess: (data) => {
        if (data.status == 'success') {
          setPasswordSuccess(true);
          setIsVerifiedForPassword(false); // Reset verification for next time
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else if (data.status == 'error') {
          setPasswordError(data.message || 'Failed to change password');
        }
      },
      onError: (error: any) => {
        setPasswordError(error.message || 'Failed to change password');
      }
    });
  };

  const handleToggle2FA = (enable: boolean) => {
    setVerifyForOtpSetup(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Last Login */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 p-6 rounded-lg"
      >
        <div className="flex items-center mb-2">
          <Calendar className="mr-2 h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-800">Last Login</h3>
        </div>
        <p className="text-gray-600">{formatDate(lastLogin)}</p>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gray-50 p-6 rounded-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800 flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Two-Factor Authentication (2FA)
          </h3>
          <div className="flex items-center">
            <span className={`mr-2 text-sm font-medium ${isTwoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
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
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                variants={{
                  on: { x: 20 },
                  off: { x: 0 }
                }}
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                className="inline-block h-4 w-4 rounded-full bg-white"
              />
            </motion.button>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Two-factor authentication adds an additional layer of security to your account.
        </p>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gray-50 p-6 rounded-lg"
      >
        <h3 className="font-medium text-gray-800 flex items-center mb-4">
          <Key className="mr-2 h-5 w-5" />
          Change Password
        </h3>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <label className="text-gray-600 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              disabled={isTwoFactorEnabled && !isVerifiedForPassword}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col"
          >
            <label className="text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              disabled={isTwoFactorEnabled && !isVerifiedForPassword}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col"
          >
            <label className="text-gray-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              disabled={isTwoFactorEnabled && !isVerifiedForPassword}
            />
          </motion.div>

          {isTwoFactorEnabled && !isVerifiedForPassword && (
            <div className="text-sm text-blue-600">
              Please verify your identity with your 2FA code to change your password.
            </div>
          )}

          <AnimatePresence>
            {passwordError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="text-red-500 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {passwordError}
                </div>
              </motion.div>
            )}

            {passwordSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="text-green-600 text-sm flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Password changed successfully!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitPassword}
            disabled={isPending}
            className={`mt-2 flex items-center justify-center px-4 py-2 rounded-lg transition ${isPending
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
              } text-white`}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Verification Modals */}
      <VerificationModal
        isOpen={verifyForOtpSetup}
        onClose={() => setVerifyForOtpSetup(false)}
        isOTPEnabled={false}
        is2FAEnabled={false}
        onVerified={() => setShowSetOtp(true)}
      />

      <VerificationModal
        isOpen={verifyForPassword}
        onClose={() => setVerifyForPassword(false)}
        isOTPEnabled={isTwoFactorEnabled}
        is2FAEnabled={isTwoFactorEnabled}
        onVerified={() => {
          setIsVerifiedForPassword(true);
          setVerifyForPassword(false);
        }}
      />

      {showSetOtp && (
        <TotpSetupModal
          isOpen={showSetOtp}
          onClose={() => setShowSetOtp(false)}
          totpData={{ secret: data?.data?.secret }}
          onComplete={(code) => handleSubmitTotp(code)}
        />
      )}
    </div>
  );
};

export default SecuritySection;