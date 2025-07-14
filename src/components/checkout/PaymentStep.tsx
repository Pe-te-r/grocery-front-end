import { useState } from 'react';
import { CreditCard, Loader2, ChevronLeft, Wallet } from 'lucide-react';

export function PaymentStep({
  orderData,
  setOrderData,
  totalAmount,
  deliveryOption,
  deliveryFee,
  onBack,
  onSubmit,
  isSubmitting
}: {
  orderData: any;
  setOrderData: (data: any) => void;
  totalAmount: number;
  deliveryOption: string;
  deliveryFee: number;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const [mpesaOption, setMpesaOption] = useState<'system' | 'custom'>('system');
  const pickupFee = 10;

  // Set M-Pesa as the only allowed payment method initially
  useState(() => {
    if (orderData.paymentMethod !== 'mpesa') {
      setOrderData({ ...orderData, paymentMethod: 'mpesa' });
    }
  });

  // Validate phone number when custom option is selected
  const isValidPhone = mpesaOption === 'system' ||
    (mpesaOption === 'custom' && orderData.phoneNumber?.length >= 9);

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Payment Method</h2>

      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Wallet Option - Disabled */}
          <label className={`block p-4 cursor-not-allowed ${orderData.paymentMethod === 'wallet' ? 'bg-gray-100' : ''}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                checked={false}
                disabled
                className="h-4 w-4 text-gray-400"
              />
              <div className="ml-3 flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-gray-400" />
                <span className="block font-medium text-gray-400">Pay with Wallet (Coming Soon)</span>
              </div>
            </div>
          </label>

          {/* M-Pesa Option - Only working option */}
          <label className={`block p-4 border-t border-gray-200 cursor-pointer ${orderData.paymentMethod === 'mpesa' ? 'bg-green-50 border-l-4 border-green-500' : ''}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                checked={orderData.paymentMethod === 'mpesa'}
                onChange={() => setOrderData({ ...orderData, paymentMethod: 'mpesa' })}
                className="h-4 w-4 text-green-600 focus:ring-green-500"
              />
              <div className="ml-3 flex items-center">
                <img src="/mpesa-logo.png" alt="M-Pesa" className="h-5 mr-2" />
                <span className="block font-medium text-gray-800">M-Pesa</span>
              </div>
            </div>
            {orderData.paymentMethod === 'mpesa' && (
              <div className="mt-2 ml-7 space-y-3">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mpesaOption"
                      checked={mpesaOption === 'system'}
                      onChange={() => {
                        setMpesaOption('system');
                        setOrderData({ ...orderData, useSystemNumber: true });
                      }}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Use system registered number</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mpesaOption"
                      checked={mpesaOption === 'custom'}
                      onChange={() => {
                        setMpesaOption('custom');
                        setOrderData({ ...orderData, useSystemNumber: false });
                      }}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Use different number</span>
                  </label>
                </div>
                {mpesaOption === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={orderData.phoneNumber || ''}
                      onChange={(e) => setOrderData({ ...orderData, phoneNumber: e.target.value })}
                      placeholder="e.g. 254712345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    {!isValidPhone && mpesaOption === 'custom' && (
                      <p className="mt-1 text-sm text-red-600">Please enter a valid phone number</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </label>

          {/* Card Option - Disabled */}
          <label className={`block p-4 border-t border-gray-200 cursor-not-allowed ${orderData.paymentMethod === 'card' ? 'bg-gray-100' : ''}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                checked={false}
                disabled
                className="h-4 w-4 text-gray-400"
              />
              <div className="ml-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                <span className="block font-medium text-gray-400">Credit/Debit Card (Coming Soon)</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>KES {(totalAmount - (deliveryOption === 'pickup' ? pickupFee : deliveryFee)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{deliveryOption === 'pickup' ? 'Pickup Fee (10%)' : 'Delivery Fee (15%)'}:</span>
            <span>KES {(deliveryOption === 'pickup' ? pickupFee : deliveryFee).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span>KES {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>  
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !isValidPhone}
          className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${isSubmitting || !isValidPhone ? 'opacity-70 cursor-not-allowed' : ''
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 w-4 h-4" />
              Complete Order
            </>
          )}
        </button>
      </div>
    </div>
  );
}