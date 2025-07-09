import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, MapPin, Truck, Home, Loader2, Package, CreditCard } from 'lucide-react';
import { useCart } from '@/lib/cartHelper';
import { Link } from '@tanstack/react-router';

// Sample location data (replace with API data)
const COUNTIES = [
  { name: 'Nairobi', subCounties: ['Westlands', 'Dagoretti', 'Langata', 'Kasarani', 'Embakasi'] },
  { name: 'Mombasa', subCounties: ['Mvita', 'Kisauni', 'Likoni', 'Changamwe'] },
  { name: 'Kisumu', subCounties: ['Kisumu Central', 'Kisumu East', 'Kisumu West'] },
  { name: 'Nakuru', subCounties: ['Nakuru Town', 'Naivasha', 'Molo', 'Njoro'] },
];

const DELIVERY_RATE_PER_KM = 60; // 60 KES per km

function CheckoutPage(){
  const { cartItems, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<'products' | 'location' | 'delivery' | 'payment'>('products');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Calculate delivery fee (60 KES per km)
  const deliveryFee = deliveryOption === 'delivery' ? estimatedDistance * DELIVERY_RATE_PER_KM : 0;
  const totalAmount = Number(totalPrice) + deliveryFee;

  // Sample distance calculation (replace with actual distance API)
  const calculateDistance = (county: string) => {
    // This is a mock - in reality you'd use a mapping service API
    const distances: Record<string, number> = {
      'Nairobi': 0,
      'Mombasa': 480,
      'Kisumu': 265,
      'Nakuru': 160
    };
    return distances[county] || 0;
  };

  const handleCountySelect = (county: string) => {
    setSelectedCounty(county);
    setSelectedSubCounty('');
    setEstimatedDistance(calculateDistance(county));
  };

  const handleSubmitOrder = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const orderData = {
        products: cartItems,
        location: {
          county: selectedCounty,
          subCounty: selectedSubCounty
        },
        delivery: {
          option: deliveryOption,
          instructions: deliveryInstructions,
          fee: deliveryFee
        },
        totalAmount,
        paymentMethod: 'mpesa' // This would be dynamic in a real app
      };

      console.log('Order submitted:', orderData);
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart();
    }, 2000);
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen p-4"
      >
        <Package className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-4">Add some products to your cart before checkout</p>
        <Link
          to="/products"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Browse Products
        </Link>
      </motion.div>
    );
  }

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen p-4"
      >
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received it and will process it shortly.
          </p>
          <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-green-800 mb-2">Order Summary</h4>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Total:</span> KES {totalAmount.toFixed(2)}
              {deliveryOption === 'delivery' && (
                <span className="block">(Including KES {deliveryFee.toFixed(2)} delivery fee)</span>
              )}
            </p>
            {deliveryOption === 'delivery' && (
              <p className="text-sm text-gray-700 mt-2">
                Your order will be delivered to {selectedSubCounty}, {selectedCounty}
              </p>
            )}
          </div>
          <Link
            to="/products"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex justify-between relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          {['products', 'location', 'delivery', 'payment'].map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = ['products', 'location', 'delivery', 'payment'].indexOf(currentStep) > index;

            return (
              <div key={step} className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: isActive || isCompleted ? 1.1 : 1 }}
                  onClick={() => {
                    // Only allow navigation to completed steps
                    if (isCompleted) {
                      setCurrentStep(step as any);
                    }
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 cursor-pointer ${isActive ? 'bg-green-600 text-white' :
                      isCompleted ? 'bg-green-100 text-green-600' : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                >
                  {index + 1}
                </motion.div>
                <span className={`text-sm font-medium ${isActive ? 'text-green-600' :
                    isCompleted ? 'text-green-700' : 'text-gray-500'
                  }`}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100"
        >
          {/* Products Verification Step */}
          {currentStep === 'products' && (
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Review Your Order</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">KES {item.price} x {item.quantity}</p>
                    </div>
                    <div className="text-green-600 font-medium">
                      KES {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-medium">
                  <span>Subtotal:</span>
                  <span>KES {totalPrice}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep('location')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  Continue to Location <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Location Selection Step */}
          {currentStep === 'location' && (
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Select Your Location</h2>
              <p className="text-gray-600 mb-6">
                We deliver to all major counties in Kenya. Select your county and sub-county to proceed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                  <div className="relative">
                    <select
                      value={selectedCounty}
                      onChange={(e) => handleCountySelect(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                    >
                      <option value="">Select County</option>
                      {COUNTIES.map((county) => (
                        <option key={county.name} value={county.name}>{county.name}</option>
                      ))}
                    </select>
                    <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-County</label>
                  <div className="relative">
                    <select
                      value={selectedSubCounty}
                      onChange={(e) => setSelectedSubCounty(e.target.value)}
                      disabled={!selectedCounty}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none disabled:opacity-50"
                    >
                      <option value="">Select Sub-County</option>
                      {selectedCounty && COUNTIES
                        .find(c => c.name === selectedCounty)
                        ?.subCounties.map((subCounty) => (
                          <option key={subCounty} value={subCounty}>{subCounty}</option>
                        ))}
                    </select>
                    <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {selectedCounty && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Delivery Information
                  </h4>
                  <p className="text-sm text-green-700">
                    {selectedSubCounty
                      ? `Delivery to ${selectedSubCounty}, ${selectedCounty} will cost approximately KES ${deliveryFee.toFixed(2)}`
                      : `Delivery to ${selectedCounty} will cost approximately KES ${deliveryFee.toFixed(2)}`}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('products')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep('delivery')}
                  disabled={!selectedCounty || !selectedSubCounty}
                  className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${!selectedCounty || !selectedSubCounty ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  Continue to Delivery <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Delivery Options Step */}
          {currentStep === 'delivery' && (
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Delivery Options</h2>

              <div className="space-y-4 mb-6">
                <label className={`block p-4 border rounded-lg cursor-pointer ${deliveryOption === 'pickup' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryOption"
                      checked={deliveryOption === 'pickup'}
                      onChange={() => setDeliveryOption('pickup')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-gray-800">Pick Up at Store</span>
                      <span className="block text-sm text-gray-600">Collect your order from our nearest store (Free)</span>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border rounded-lg cursor-pointer ${deliveryOption === 'delivery' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryOption"
                      checked={deliveryOption === 'delivery'}
                      onChange={() => setDeliveryOption('delivery')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-gray-800">Door Delivery</span>
                      <span className="block text-sm text-gray-600">KES {deliveryFee.toFixed(2)} (Approx. {estimatedDistance} km from store)</span>
                    </div>
                  </div>
                </label>
              </div>

              {deliveryOption === 'delivery' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Instructions</label>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g. Building name, landmarks, gate color, etc."
                  />
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total:</span>
                  <span>KES {totalAmount.toFixed(2)}</span>
                </div>
                {deliveryOption === 'delivery' && (
                  <div className="text-sm text-gray-600 text-right">
                    (Includes KES {deliveryFee.toFixed(2)} delivery fee)
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('location')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  Continue to Payment <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Payment Details</h2>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">KES {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {deliveryOption === 'delivery' && (
                    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">Delivery Fee</span>
                      <span className="font-medium">KES {deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 font-bold text-lg">
                    <span>Total</span>
                    <span>KES {totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {deliveryOption === 'pickup' ? (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-800 mb-1 flex items-center">
                      <Home className="w-5 h-5 mr-2" />
                      Pickup Information
                    </h4>
                    <p className="text-sm text-green-700">
                      You'll receive an SMS with pickup details once your order is ready.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-800 mb-1 flex items-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Delivery Information
                    </h4>
                    <p className="text-sm text-green-700">
                      Delivery to {selectedSubCounty}, {selectedCounty}
                      {deliveryInstructions && (
                        <span className="block mt-1">
                          <span className="font-medium">Instructions:</span> {deliveryInstructions}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Payment Method</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="mpesa"
                      name="paymentMethod"
                      defaultChecked
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="mpesa" className="ml-3 block">
                      <span className="font-medium">M-Pesa</span>
                      <span className="block text-sm text-gray-600">You'll receive a payment prompt on your phone</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('delivery')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
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
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;