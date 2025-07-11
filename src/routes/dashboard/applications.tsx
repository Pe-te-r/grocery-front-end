import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard/applications')({
  component: VendorApplicationPage,
})

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Store, User,  MapPin, FileText, Loader2 } from 'lucide-react';
import { PersonalInfoStep } from '@/components/vendors/VendorProfile';
import { BenefitsSection } from '@/components/vendors/BenefistSection';
import { BusinessInfoStep } from '@/components/vendors/BusinessDetails';
import { ReviewStep } from '@/components/vendors/Review';
import { LocationInfoStep } from '@/components/vendors/LocationDetails';
import { userByIdHook } from '@/hooks/userHook';
import { getUserIdHelper } from '@/lib/authHelper';
import { useCountyQuery } from '@/hooks/countyHook';
import { useGetconstituenciesByCounty } from '@/hooks/constituencyHook';

type FormData = {
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  businessInfo: {
    businessName: string;
    businessDescription: string;
    businessType: 'individual' | 'company';
    businessContact: string;
  };
  locationInfo: {
    county: string;
    countyId: string;
    constituency: string;
    constituencyId: string;
    streetAddress: string;
  };
  termsAccepted: boolean;
};

function VendorApplicationPage() {
  const [formData, setFormData] = useState<FormData>({
    userInfo: {
      fullName: '',
      email: '',
      phone: ''
    },
    businessInfo: {
      businessName: '',
      businessDescription: '',
      businessType: 'individual',
      businessContact: ''
    },
    locationInfo: {
      county: '',
      countyId: '',
      constituency: '',
      constituencyId: '',
      streetAddress: ''
    },
    termsAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const userId = getUserIdHelper() ?? '';
  const { data, isSuccess } = userByIdHook(userId);

  // Fetch counties
  const { data: countiesData } = useCountyQuery();
  const counties = countiesData?.data || [];

  // Fetch constituencies when county is selected
  const { data: constituenciesData } = useGetconstituenciesByCounty(formData.locationInfo.county);
  const constituencies = constituenciesData?.data || [];

  useEffect(() => {
    if (data) {
      const user = data.data;
      const userInfo = {
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone
      };
      setFormData(prev => ({
        ...prev,
        userInfo: {
          ...prev.userInfo,
          ...userInfo
        }
      }));
    }
  }, [data, isSuccess]);

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (step === 2) { // Business info validation
      if (!formData.businessInfo.businessName.trim()) {
        errors.businessName = 'Business name is required';
      }
      if (!formData.businessInfo.businessContact.trim()) {
        errors.businessContact = 'Business contact is required';
      }
      if (!formData.businessInfo.businessDescription.trim()) {
        errors.businessDescription = 'Business description is required';
      }
    } else if (step === 3) { // Location validation
      if (!formData.locationInfo.countyId) {
        errors.county = 'County is required';
      }
      if (!formData.locationInfo.constituencyId) {
        errors.constituency = 'Constituency is required';
      }
      if (!formData.locationInfo.streetAddress.trim()) {
        errors.streetAddress = 'Street address is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep(4)) { // Final validation
      setIsSubmitting(true);

      const submissionData = {
        user: formData.userInfo,
        business: {
          ...formData.businessInfo,
          location: {
            countyId: formData.locationInfo.countyId,
            countyName: formData.locationInfo.county,
            constituencyId: formData.locationInfo.constituencyId,
            constituencyName: formData.locationInfo.constituency,
            streetAddress: formData.locationInfo.streetAddress
          }
        },
        termsAccepted: formData.termsAccepted
      };

      console.log('Submitting application:', submissionData);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 1500);
    }
  };

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Business Details', icon: Store },
    { id: 3, name: 'Location', icon: MapPin },
    { id: 4, name: 'Review & Submit', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Store className="w-10 h-10 text-green-600 mr-2" />
            <h1 className="text-4xl font-bold text-green-800">GroceryStore</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Vendor Application</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Join our marketplace and start selling your products to thousands of customers
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${currentStep >= step.id ? 'bg-green-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}
                >
                  <step.icon className="w-6 h-6" />
                </motion.div>
                <span className={`text-sm font-medium ${currentStep >= step.id ? 'text-green-600' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100"
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for applying to become a GroceryStore vendor. Our team will review your application and contact you within 3-5 business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Back to Home
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: currentStep === 1 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentStep === 1 ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 md:p-8"
                >
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <PersonalInfoStep userInfo={formData.userInfo} />
                  )}

                  {/* Step 2: Business Details */}
                  {currentStep === 2 && (
                    <BusinessInfoStep
                      businessInfo={formData.businessInfo}
                      setBusinessInfo={(data) => setFormData({ ...formData, businessInfo: data })}
                      errors={formErrors}
                    />
                  )}

                  {/* Step 3: Location */}
                  {currentStep === 3 && (
                    <LocationInfoStep
                      locationInfo={formData.locationInfo}
                      setLocationInfo={(data) => setFormData({ ...formData, locationInfo: data })}
                      counties={counties}
                      constituencies={constituencies}
                      errors={formErrors}
                    />
                  )}

                  {/* Step 4: Review & Submit */}
                  {currentStep === 4 && (
                    <ReviewStep
                      formData={formData}
                      setTermsAccepted={(accepted) => setFormData({ ...formData, termsAccepted: accepted })}
                      counties={counties}
                        constituencies={constituencies}
                        errors={formErrors}
                    />
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        Next <ChevronRight className="ml-2 w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.termsAccepted}
                        className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${(!formData.termsAccepted || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        <BenefitsSection />
      </div>
    </div>
  );
};

export default VendorApplicationPage;