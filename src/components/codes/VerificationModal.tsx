import { useState, useEffect } from 'react';
import { X, Clock, Smartphone, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VerificationOption } from './VerificationOption';
import { CodeInput } from './CodeInput';

type VerificationOptionType = 'code' | 'otp' | 'phone';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (type: VerificationOptionType) => void;
  is2FAEnabled?: boolean;
  isOTPEnabled?: boolean; // New prop to control OTP availability
}

export const VerificationModal = ({
  isOpen,
  onClose,
  onVerified,
  is2FAEnabled = false,
  isOTPEnabled = true, // Default to true if not specified
}: VerificationModalProps) => {
  const [selectedOption, setSelectedOption] = useState<VerificationOptionType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifiedOptions, setVerifiedOptions] = useState<VerificationOptionType[]>([]);

  const availableOptions: VerificationOptionType[] = [
    'code',
    ...(isOTPEnabled ? ['otp' as VerificationOptionType] : []),
  ];
  
  const handleOptionSelect = (option: VerificationOptionType) => {
    if (!verifiedOptions.includes(option)) {
      setSelectedOption(option);
      setError(null);
    }
  };

  const handleVerification = (option: VerificationOptionType, isValid: boolean) => {
    if (isValid) {
      const newVerifiedOptions = [...verifiedOptions, option];
      setVerifiedOptions(newVerifiedOptions);
      setError(null);

      const isComplete = is2FAEnabled
        ? newVerifiedOptions.length === 2 // Need both methods
        : newVerifiedOptions.length === 1; // Only need one method

      if (isComplete) {
        onVerified(option);
        onClose();
      } else {
        setSelectedOption(null); // Return to options for next verification
      }
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleClose = () => {
    setSelectedOption(null);
    setError(null);
    setVerifiedOptions([]);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedOption(null);
      setError(null);
      setVerifiedOptions([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50"
        >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">
                {is2FAEnabled
                  ? verifiedOptions.length === 1
                    ? 'Second Verification Required'
                    : 'Two-Factor Authentication'
                  : 'Verify Your Identity'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                <X size={16} className="mr-2" />
                {error}
              </div>
            )}

            {!selectedOption ? (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  {is2FAEnabled
                    ? verifiedOptions.length === 1
                      ? 'Please complete your second verification method'
                      : 'Please verify using two methods for enhanced security'
                    : 'Select a verification method'}
                </p>

                {availableOptions.map(option => {
                  const props = {
                    title: option === 'code' ? 'Verification Code' : 'OTP',
                    description: option === 'code'
                      ? 'Enter your 4-digit verification code'
                      : 'Enter one-time password from your authenticator app',
                    icon: option === 'code'
                      ? <Key className="text-green-600" />
                      : <Clock className="text-green-600" />,
                    onClick: () => handleOptionSelect(option),
                    isVerified: verifiedOptions.includes(option),
                    disabled: verifiedOptions.includes(option),
                  };
                  return <VerificationOption key={option} {...props} />;
                })}

                <VerificationOption
                  title="Phone Verification"
                  description="Coming soon"
                  icon={<Smartphone className="text-gray-400" />}
                  disabled
                />
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedOption(null)}
                  className="flex items-center text-green-600 mb-4 hover:text-green-800 transition-colors"
                >
                  <X size={16} className="mr-1" />
                  Back to options
                </button>

                {selectedOption === 'code' && (
                  <CodeInput
                    type="code"
                    onVerify={(isValid) => handleVerification('code', isValid)}
                  />
                )}

                {selectedOption === 'otp' && (
                  <CodeInput
                    type="otp"
                    onVerify={(isValid) => handleVerification('otp', isValid)}
                  />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};