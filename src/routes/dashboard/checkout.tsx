import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/checkout')({
  component: CheckoutPage,
})

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cartHelper';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { OrderSuccess } from '@/components/checkout/OrderSuccess';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { ProductsStep } from '@/components/checkout/ProductsStep';
import { DeliveryStep } from '@/components/checkout/DeliveryStep';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { useGetconstituenciesByCounty } from '@/hooks/constituencyHook';
import { useCountyQuery } from '@/hooks/countyHook';
import { getUserIdHelper } from '@/lib/authHelper';
import { LocationStep } from '@/components/checkout/LocationStep';
import { useCreateOrder } from '@/hooks/ordersHook';
import toast from 'react-hot-toast';

const initialState ={
    county: '',
    subCounty: '',
    pickStation: null,
    pickupStationId:'',
    deliveryOption: 'pickup' as 'pickup' | 'delivery',
    deliveryInstructions: '',
    paymentMethod: 'mpesa' as 'mpesa' | 'wallet' | 'card',
    phoneNumber: '',
    useSystemNumber: true,
    store: ''
  }

export function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<'products' | 'location' | 'delivery' | 'payment'>('products');
  const [orderData, setOrderData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { data: countiesData } = useCountyQuery();
  const { data: constituenciesData } = useGetconstituenciesByCounty(orderData.county);


  // Calculate fees
  // const pickupFee = Number(totalPrice) * 0.10;
  // const deliveryFee = Number(totalPrice) * 0.15;
  const [totalAmount, setTotalAmount] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [pickupFee, sePickupFee] = useState(0)
  const createOrderMutate = useCreateOrder()
  useEffect(() => {
    setDeliveryFee(Number(totalPrice) * 0.15)
    sePickupFee(Number(totalPrice) * 0.10)
    setTotalAmount(Number(totalPrice) +
      (orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee))
  }, [])
  const handleSubmitOrder = () => {
    setIsSubmitting(true);

    // Simulate API call
    // setTimeout(() => {
    //   const orderPayload = {
    //     products: cartItems,
    //     location: {
    //       county: orderData.county,
    //       subCounty: orderData.subCounty,
    //     },
    //     delivery: {
    //       option: orderData.deliveryOption,
    //       instructions: orderData.deliveryInstructions,
    //       fee: orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee
    //     },
    //     payment: {
    //       method: orderData.paymentMethod,
    //       ...(orderData.paymentMethod === 'mpesa' && {
    //         phone: orderData.useSystemNumber ? 'SYSTEM_NUMBER' : orderData.phoneNumber
    //       })
    //     },
    //     totalAmount,
    //     createdAt: new Date().toISOString()
    //   };
    //   clearCart();
    // }, 2000);

    const products: { item_id: string, quantity: number, store_id: string }[] = []
    cartItems.forEach((item) => {
      products.push({
        item_id: item.id,
        quantity: item.quantity,
        store_id: item.store_id
      })
    })
    let location_id: string ='';
    if (orderData.deliveryOption == 'delivery') {
      location_id = orderData.subCounty
    } else if (orderData.deliveryOption == 'pickup') {
      location_id = orderData.pickupStationId
    }
    const order_data = {
      customer_id: getUserIdHelper() ?? '',
      delivery: {
        option: orderData.deliveryOption,
        instructions: orderData.deliveryInstructions,
        fee: orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee
      },
      products,
      payment: {
        method: orderData.paymentMethod,
        ...(orderData.paymentMethod === 'mpesa' && {
          phone: orderData.useSystemNumber ? 'SYSTEM_NUMBER' : orderData.phoneNumber
        })
      },
      subCounty: location_id,
      totalAmount
    }
    console.log('order data', order_data)
    createOrderMutate.mutate(order_data, {
      onSuccess: (data) => {
        console.log('success data', data)
        setIsSubmitting(false);
        setOrderSuccess(true);
        clearCart()
      },
      onError: (error) => {
        console.error('error message', error)
        toast.error('an error occured')
      }
    })
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
              //  add fee based on delivery option
              totalAmount={totalAmount + (orderData.deliveryOption === 'pickup' ? pickupFee : deliveryFee)}
              onSubmit={handleSubmitOrder}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}