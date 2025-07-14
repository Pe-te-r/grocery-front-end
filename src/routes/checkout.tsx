import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cartHelper';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { OrderSuccess } from '@/components/checkout/OrderSuccess';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { ProductsStep } from '@/components/checkout/ProductsStep';
import { LocationStep } from '@/components/checkout/LocationStep';
import { DeliveryStep } from '@/components/checkout/DeliveryStep';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { useGetconstituenciesByCounty } from '@/hooks/constituencyHook';
import { useCountyQuery } from '@/hooks/countyHook';

export function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<'products' | 'location' | 'delivery' | 'payment'>('products');
  const [orderData, setOrderData] = useState({
    county: '',
    subCounty: '',
    deliveryOption: 'pickup' as 'pickup' | 'delivery',
    deliveryInstructions: '',
    paymentMethod: 'mpesa' as 'mpesa' | 'wallet' | 'card',
    phoneNumber: '',
    useSystemNumber: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { data: countiesData } = useCountyQuery ();
  const { data: constituenciesData } = useGetconstituenciesByCounty(orderData.county);

  // Mock pickup stations
  const PICKUP_STATIONS = [
    { id: '1', name: 'Nairobi CBD', address: 'Moi Avenue, Shop No. 5' },
    { id: '2', name: 'Westlands', address: 'Westgate Mall, Food Court' },
    { id: '3', name: 'Kasarani', address: 'Thika Road Mall, Ground Floor' },
  ];

  // Calculate fees
  const pickupFee = Number(totalPrice) * 0.10;
  const deliveryFee = Number(totalPrice) * 0.15;
  const totalAmount = Number(totalPrice) +
    (orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee);

  const handleSubmitOrder = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const orderPayload = {
        products: cartItems,
        location: {
          county: orderData.county,
          subCounty: orderData.subCounty,
          ...(orderData.deliveryOption === 'pickup' && { pickupStation: PICKUP_STATIONS[0] })
        },
        delivery: {
          option: orderData.deliveryOption,
          instructions: orderData.deliveryInstructions,
          fee: orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee
        },
        payment: {
          method: orderData.paymentMethod,
          ...(orderData.paymentMethod === 'mpesa' && {
            phone: orderData.useSystemNumber ? 'SYSTEM_NUMBER' : orderData.phoneNumber
          })
        },
        totalAmount,
        createdAt: new Date().toISOString()
      };

      console.log('Order submitted:', orderPayload);
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart();
    }, 2000);
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return <EmptyCart />;
  }

  if (orderSuccess) {
    return <OrderSuccess
      totalAmount={totalAmount}
      deliveryOption={orderData.deliveryOption}
      deliveryFee={orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee}
      location={orderData.subCounty ? `${orderData.subCounty}, ${orderData.county}` : orderData.county}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <CheckoutSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100"
        >
          {currentStep === 'products' && (
            <ProductsStep
              cartItems={cartItems}
              totalPrice={parseFloat(totalPrice)}
              onNext={() => setCurrentStep('location')}
            />
          )}

          {currentStep === 'location' && (
            <LocationStep
              orderData={orderData}
              setOrderData={setOrderData}
              pickupStations={PICKUP_STATIONS}
              onBack={() => setCurrentStep('products')}
              onNext={() => setCurrentStep('delivery')}
              counties={countiesData?.data || []}
              constituencies={constituenciesData?.data || []}
            />
          )}

          {currentStep === 'delivery' && (
            <DeliveryStep
              orderData={orderData}
              setOrderData={setOrderData}
              totalPrice={parseFloat(totalPrice)}
              pickupFee={pickupFee}
              deliveryFee={deliveryFee}
              onBack={() => setCurrentStep('location')}
              onNext={() => setCurrentStep('payment')}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentStep
              orderData={orderData}
              setOrderData={setOrderData}
              totalAmount={totalAmount}
              deliveryOption={orderData.deliveryOption}
              deliveryFee={orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee}
              onBack={() => setCurrentStep('delivery')}
              onSubmit={handleSubmitOrder}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}