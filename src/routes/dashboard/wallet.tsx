import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wallet, ArrowDownUp, Plus, Minus, ChevronDown, Check, X, Info } from 'lucide-react';
import { getUserIdHelper } from '@/lib/authHelper';
import { userByIdHook } from '@/hooks/userHook';

function WalletPage() {
  const userId = getUserIdHelper() ?? '';
  const { data,  isLoading } = userByIdHook(userId);
  const user = data?.data;

  // Static balance since it's not in user data yet
  const [balance, setBalance] = useState(1250.50);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel' | 'paypal' | 'stripe'>('mpesa');
  const [useDefaultNumber, setUseDefaultNumber] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate transaction processing
    setTimeout(() => {
      console.log(`Amount: ${amount}, Number: ${phoneNumber}`);

      if (activeTab === 'deposit') {
        setBalance(prev => prev + parseFloat(amount));
      } else {
        setBalance(prev => prev - parseFloat(amount));
      }

      setIsProcessing(false);
      setTransactionSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => setTransactionSuccess(null), 3000);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', available: true },
    { id: 'airtel', name: 'Airtel Money', available: false },
    { id: 'paypal', name: 'PayPal', comingSoon: true },
    { id: 'stripe', name: 'Stripe', comingSoon: true },
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* User Wallet Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-green-50 rounded-xl p-6 mb-6 shadow-sm border border-green-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-700">Wallet Balance</h2>
            <motion.p
              key={balance}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-green-600"
            >
              KSh {balance.toLocaleString()}
            </motion.p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-full bg-green-100 text-green-600"
          >
            <Wallet className="w-6 h-6" />
          </motion.div>
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${activeTab === 'deposit'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 border border-green-200'
              }`}
          >
            <Plus className="w-4 h-4" />
            <span>Deposit</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${activeTab === 'withdraw'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 border border-green-200'
              }`}
          >
            <Minus className="w-4 h-4" />
            <span>Withdraw</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Payment Method Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="text-md font-medium text-gray-700 mb-3">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <motion.button
              key={method.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => method.available && setPaymentMethod(method.id as any)}
              disabled={!method.available}
              className={`p-3 rounded-lg border flex flex-col items-center ${paymentMethod === method.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
                } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-300'
                }`}
            >
              <span className="font-medium text-gray-700">{method.name}</span>
              {method.comingSoon && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 mt-1"
                >
                  Coming soon
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Transaction Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-md font-medium text-gray-700 mb-4">
          {activeTab === 'deposit' ? 'Deposit to Wallet' : 'Withdraw from Wallet'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex space-x-2 mb-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setUseDefaultNumber(true);
                  setPhoneNumber(user?.phone || '');
                }}
                className={`px-3 py-2 rounded-lg text-sm ${useDefaultNumber
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                  }`}
              >
                Default
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setUseDefaultNumber(false)}
                className={`px-3 py-2 rounded-lg text-sm ${!useDefaultNumber
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                  }`}
              >
                Custom
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {useDefaultNumber ? (
                <motion.div
                  key="default-number"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <input
                    type="tel"
                    value={phoneNumber}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="ml-2 text-green-600"
                    title="This is your registered phone number"
                  >
                    <Info className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="custom-number"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (KSh)
            </label>
            <motion.input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min="10"
              required
              whileFocus={{ scale: 1.01 }}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center text-sm text-green-600 mb-4"
          >
            <span>How it works</span>
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-green-50 p-4 rounded-lg mb-6 text-sm text-gray-700"
              >
                <p className="mb-2 flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2">
                    <Info className="w-3 h-3" />
                  </span>
                  {activeTab === 'deposit'
                    ? '1. You will receive an M-Pesa push notification to your phone.'
                    : '1. We will send money to your M-Pesa account.'}
                </p>
                <p className="mb-2 flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2">
                    <Info className="w-3 h-3" />
                  </span>
                  2. Enter your M-Pesa PIN when prompted.
                </p>
                <p className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2">
                    <Info className="w-3 h-3" />
                  </span>
                  3. The transaction will complete automatically.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowDownUp className="w-4 h-4 mr-2" />
                {activeTab === 'deposit' ? 'Deposit Now' : 'Withdraw Now'}
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Transaction Status */}
      <AnimatePresence>
        {transactionSuccess !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex items-center ${transactionSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
          >
            {transactionSuccess ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Check className="w-5 h-5 mr-2" />
              </motion.div>
            ) : (
              <X className="w-5 h-5 mr-2" />
            )}
            <span>
              {transactionSuccess
                ? `${activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`
                : 'Transaction failed. Please try again.'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Route = createFileRoute('/dashboard/wallet')({
  component: WalletPage,
});