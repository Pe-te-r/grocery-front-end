import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
// import { useSearchParams } from 'next/navigation';
import { useCreatePayment, useVerifyPayment } from '@/hooks/paymentHook';

export function PaymentStep({
  totalAmount,
  onSubmit,
  isSubmitting
}: {
  totalAmount: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const [paymentReference, setPaymentReference] = useState<string | null>(
  );
  
  // Convert amount to the smallest currency unit (kobo for NGN)
  const paystackAmount = Math.round(totalAmount * 100);
  
  // Payment mutation hook
  const createPaymentMutation = useCreatePayment(paystackAmount.toString());
  
  // Verification mutation hook (changed from query to mutation)
  const verifyPaymentMutation = useVerifyPayment();

  // Handle payment creation
  const handleProceedToPayment = async () => {
    try {
      const paymentData = await createPaymentMutation.mutateAsync();
      
      if (paymentData?.status && paymentData.data?.data.authorization_url) {
        setPaymentReference(paymentData.data.data.reference);
             window.open(
        paymentData.data.data.authorization_url,
        '_blank',
        'noopener,noreferrer'
      );
      
        // window.location.href = paymentData.data.data.authorization_url;
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  // Handle payment verification
  const handleVerifyPayment = async () => {
    if (!paymentReference) return;
    
    try {
      const verificationData = await verifyPaymentMutation.mutateAsync(paymentReference);
      
      if (verificationData?.status === 'success') {
        onSubmit();
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  };

  // Check if we have a reference param (returned from Paystack)
  const returnedFromPayment = !!paymentReference;

  return (
    <div className="p-6 md:p-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        {returnedFromPayment ? 'Confirm Your Payment' : 'Complete Your Payment'}
      </h2>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8 w-full max-w-md">
        <h3 className="font-medium text-gray-800 mb-4 text-center">Total Amount</h3>
        <p className="text-3xl font-bold text-center">KES {totalAmount.toFixed(2)}</p>
      </div>

      {!returnedFromPayment ? (
        <button
          onClick={handleProceedToPayment}
          disabled={isSubmitting || createPaymentMutation.isPending}
          className={`px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${
            isSubmitting || createPaymentMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {createPaymentMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Redirecting to Payment...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      ) : (
        <>
          <button
            onClick={handleVerifyPayment}
            disabled={isSubmitting || verifyPaymentMutation.isPending}
            className={`px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${
              isSubmitting || verifyPaymentMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {verifyPaymentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying Payment...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirm Payment
              </>
            )}
          </button>

          {verifyPaymentMutation.isError && (
            <p className="mt-4 text-sm text-red-600">
              Payment verification failed. Please try again or contact support.
            </p>
          )}

          {verifyPaymentMutation.data?.status !== 'success' && !verifyPaymentMutation.isError && (
            <p className="mt-4 text-sm text-gray-600">
              Please confirm your payment after completing the transaction.
            </p>
          )}
        </>
      )}
    </div>
  );
}