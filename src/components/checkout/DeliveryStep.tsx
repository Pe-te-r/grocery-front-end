import { ChevronRight } from 'lucide-react';

export function DeliveryStep({
  orderData,
  setOrderData,
  totalPrice,
  pickupFee,
  deliveryFee,
  onBack,
  onNext
}: {
  orderData: any;
  setOrderData: (data: any) => void;
  totalPrice: number;
  pickupFee: number;
  deliveryFee: number;
  onBack: () => void;
  onNext: () => void;
}) {
  const totalAmount = Number(totalPrice) +
    (orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee);

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Delivery Details</h2>

      {orderData.deliveryOption === 'pickup' ? (
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-green-800 mb-2">Pickup Information</h4>
          <p className="text-sm text-green-700">
            You'll collect your order at the selected station. A 10% fee (KES {pickupFee.toFixed(2)}) applies for pickup service.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Delivery Information</h4>
            <p className="text-sm text-green-700">
              Delivery to {orderData.subCounty}, {orderData.county}. A 15% delivery fee (KES {deliveryFee.toFixed(2)}) applies.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Instructions
            </label>
            <textarea
              value={orderData.deliveryInstructions}
              onChange={(e) => setOrderData({ ...orderData, deliveryInstructions: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. Building name, landmarks, gate color, etc."
            />
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-medium">
          <span>Total:</span>
          <span>KES {totalAmount.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-600 text-right">
          (Includes KES {(orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee).toFixed(2)} {orderData.deliveryOption === 'pickup' ? 'pickup' : 'delivery'} fee)
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          Continue to Payment <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}