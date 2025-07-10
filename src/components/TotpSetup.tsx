import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Smartphone } from 'lucide-react';
import QRCode from 'react-qr-code';
import { getUserEmailHelper } from '@/lib/authHelper';

interface TotpSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  totpData: {
    secret: string;
  };
  onComplete: (code: string) => void;
}

export const TotpSetupModal = ({
  isOpen,
  onClose,
  totpData,
  onComplete
}: TotpSetupModalProps) => {
  const [code, setCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpData.secret);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const ref = useRef('')
  const handleSubmit = () => {
    if (code.length === 6) {
      onComplete(code);
    }
  };

  const generateOtpAuthUri = () => {
    const issuer = 'GroceryStore';
    const secret = totpData.secret;

    return encodeURI(
      `otpauth://totp/${issuer}:${getUserEmailHelper()}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`
    );
  };
  ref.current = generateOtpAuthUri()

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center p-4 z-50"
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
                Set Up Authenticator App
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Smartphone className="mr-2 h-5 w-5 text-green-600" />
                  Step 1: Scan the QR code
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-center">
                  <QRCode
                    value={ref.current}
                    size={180}
                    level="H"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Or enter this secret key manually:
                </h3>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <code className="font-mono text-gray-800">{totpData.secret}</code>
                  <button
                    onClick={handleCopySecret}
                    className="ml-2 p-1 text-gray-500 hover:text-green-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Step 2: Enter verification code
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Enter the 6-digit code from your authenticator app to confirm setup.
                </p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={code.length !== 6}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};