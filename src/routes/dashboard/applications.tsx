import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard/applications')({
  component: VendorApplicationPage,
})

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Store, User, Phone, Home, MapPin, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { PersonalInfoStep } from '@/components/vendors/VendorProfile';
import { BenefitsSection } from '@/components/vendors/BenefistSection';
import { BusinessInfoStep } from '@/components/vendors/BusinessDetails';
import { ReviewStep } from '@/components/vendors/Review';
import { LocationInfoStep } from '@/components/vendors/LocationDetails';
import { userByIdHook } from '@/hooks/userHook';
import { getUserIdHelper } from '@/lib/authHelper';
import { fullName } from '@/lib/demo-store';

// Types
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
    constituency: string;
    ward: string;
    streetAddress: string;
  };
  termsAccepted: boolean;
};

export type LocationData = {
  counties: {
    id: string;
    name: string;
    constituencies: {
      id: string;
      name: string;
      wards: {
        id: string;
        name: string;
      }[];
    }[];
  }[];
};

// Mock API data
const mockUserData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+254712345678'
};

export const locationData: LocationData = {
  counties: [
    {
      id: '1',
      name: 'Nairobi',
      constituencies: [
        {
          id: '101',
          name: 'Westlands',
          wards: [
            { id: '10101', name: 'Parklands' },
            { id: '10102', name: 'Karura' }
          ]
        },
        {
          id: '102',
          name: 'Dagoretti North',
          wards: [
            { id: '10201', name: 'Kilimani' },
            { id: '10202', name: 'Kawangware' }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Mombasa',
      constituencies: [
        {
          id: '201',
          name: 'Mvita',
          wards: [
            { id: '20101', name: 'Tudor' },
            { id: '20102', name: 'Old Town' }
          ]
        }
      ]
    }
  ]
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
      constituency: '',
      ward: '',
      streetAddress: ''
    },
    termsAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const userId = getUserIdHelper() ?? ''
  const { data,isSuccess } = userByIdHook(userId)
  console.log('data',data)
  useEffect(() => {
    if (data) {
      const user = data.data
      const userInfo = {
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone:user.phone
      }
      setFormData(prevState => ({
        ...prevState,
        userInfo: {
          ...prevState.userInfo,
          ...userInfo
        }
      }));    }
  }, [data, isSuccess])


  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data for API
    const submissionData = {
      user: formData.userInfo,
      business: {
        ...formData.businessInfo,
        location: {
          countyId: formData.locationInfo.county,
          constituencyId: formData.locationInfo.constituency,
          wardId: formData.locationInfo.ward,
          streetAddress: formData.locationInfo.streetAddress
        }
      },
      termsAccepted: formData.termsAccepted,
      applicationDate: new Date().toISOString()
    };

    console.log('Submitting application:', JSON.stringify(submissionData, null, 2));

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          userInfo: {
            fullName: mockUserData.fullName,
            email: mockUserData.email,
            phone: mockUserData.phone
          },
          businessInfo: {
            businessName: '',
            businessDescription: '',
            businessType: 'individual',
            businessContact: ''
          },
          locationInfo: {
            county: '',
            constituency: '',
            ward: '',
            streetAddress: ''
          },
          termsAccepted: false
        });
        setCurrentStep(1);
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
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
                    />
                  )}

                  {/* Step 3: Location */}
                  {currentStep === 3 && (
                    <LocationInfoStep
                      locationInfo={formData.locationInfo}
                      setLocationInfo={(data) => setFormData({ ...formData, locationInfo: data })}
                      locationData={locationData}
                    />
                  )}

                  {/* Step 4: Review & Submit */}
                  {currentStep === 4 && (
                    <ReviewStep
                      formData={formData}
                      setTermsAccepted={(accepted) => setFormData({ ...formData, termsAccepted: accepted })}
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
                        className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${(!formData.termsAccepted || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''}`}
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