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
  const pickupFee=10
  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Payment Method</h2>

      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <label className={`block p-4 cursor-pointer ${orderData.paymentMethod === 'wallet' ? 'bg-green-50 border-l-4 border-green-500' : ''}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                checked={orderData.paymentMethod === 'wallet'}
                onChange={() => setOrderData({ ...orderData, paymentMethod: 'wallet' })}
                className="h-4 w-4 text-green-600 focus:ring-green-500"
              />
              <div className="ml-3 flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-green-600" />
                <span className="block font-medium text-gray-800">Pay with Wallet</span>
              </div>
            </div>
            {orderData.paymentMethod === 'wallet' && (
              <p className="text-sm text-gray-600 mt-2 ml-7">
                Pay directly from your wallet balance
              </p>
            )}
          </label>

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
                      value={orderData.phoneNumber}
                      onChange={(e) => setOrderData({ ...orderData, phoneNumber: e.target.value })}
                      placeholder="e.g. 254712345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                )}
              </div>
            )}
          </label>

          <label className={`block p-4 border-t border-gray-200 cursor-pointer ${orderData.paymentMethod === 'card' ? 'bg-green-50 border-l-4 border-green-500' : ''}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                checked={orderData.paymentMethod === 'card'}
                onChange={() => setOrderData({ ...orderData, paymentMethod: 'card' })}
                className="h-4 w-4 text-green-600 focus:ring-green-500"
                disabled
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
            <span>KES {Number(totalAmount - (deliveryOption === 'pickup' ? pickupFee : deliveryFee)).toFixed(2)}</span>
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
          disabled={isSubmitting || (orderData.paymentMethod === 'mpesa' && mpesaOption === 'custom' && !orderData.phoneNumber)}
          className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${isSubmitting || (orderData.paymentMethod === 'mpesa' && mpesaOption === 'custom' && !orderData.phoneNumber)
              ? 'opacity-70 cursor-not-allowed' : ''
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