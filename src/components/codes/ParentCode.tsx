import { useState } from 'react';
import { VerificationModal } from './VerificationModal';
export const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<string | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isOTPEnabled, setIsOTPEnabled] = useState(true);

  const handleVerification = (method: string) => {
    setIsVerified(true);
    setVerificationMethod(method);
    console.log(`Verified with ${method}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Account Security</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={is2FAEnabled}
              onChange={(e) => setIs2FAEnabled(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <span>Enable 2FA (requires both methods)</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isOTPEnabled}
              onChange={(e) => setIsOTPEnabled(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <span>Enable OTP verification</span>
          </label>
        </div>

        <p className="text-gray-700">
          {isVerified
            ? `You're verified via ${verificationMethod}!`
            : 'Please verify your identity to continue'}
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isVerified ? 'Re-verify' : 'Verify Now'}
        </button>
      </div>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVerified={handleVerification}
        is2FAEnabled={is2FAEnabled}
        isOTPEnabled={isOTPEnabled}
      />
    </div>
  );
};