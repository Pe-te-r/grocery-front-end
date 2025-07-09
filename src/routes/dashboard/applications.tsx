import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/applications')({
  component: VendorApplicationPage,
})

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Store, User, Mail, Phone, Home, MapPin, FileText, AlertCircle, Loader2 } from 'lucide-react';

function VendorApplicationPage(){
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    businessName: '',
    businessDescription: '',
    businessType: 'individual', // 'individual' or 'company'
    termsAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          businessName: '',
          businessDescription: '',
          businessType: 'individual',
          termsAccepted: false
        });
        setCurrentStep(1);
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  const steps = [
    { id: 1, name: 'Personal Information', icon: User },
    { id: 2, name: 'Business Details', icon: Store },
    { id: 3, name: 'Review & Submit', icon: FileText }
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
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <User className="w-5 h-5 mr-2 text-green-600" />
                        Personal Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Address
                        </label>
                        <div className="relative">
                          <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                          <Home className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Business Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Store className="w-5 h-5 mr-2 text-green-600" />
                        Business Details
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Business Type
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.businessType === 'individual' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                            <input
                              type="radio"
                              name="businessType"
                              value="individual"
                              checked={formData.businessType === 'individual'}
                              onChange={handleChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-3 block text-sm font-medium text-gray-700">
                              Individual/Sole Proprietor
                            </span>
                          </label>

                          <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.businessType === 'company' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                            <input
                              type="radio"
                              name="businessType"
                              value="company"
                              checked={formData.businessType === 'company'}
                              onChange={handleChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-3 block text-sm font-medium text-gray-700">
                              Registered Company
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                          Business Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="businessName"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                          <Store className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Business Description
                        </label>
                        <div className="relative">
                          <textarea
                            id="businessDescription"
                            name="businessDescription"
                            value={formData.businessDescription}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Describe your business, products you plan to sell, etc."
                          />
                          <FileText className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-green-600" />
                        Review Your Application
                      </h3>

                      <div className="bg-green-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          Important Information
                        </h4>
                        <p className="text-sm text-green-700">
                          By submitting this application, you agree to GroceryStore's Vendor Terms and Conditions.
                          Our team will review your application and contact you within 3-5 business days.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Personal Information</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-medium">{formData.fullName || '-'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{formData.email || '-'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{formData.phone || '-'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">City</p>
                                <p className="font-medium">{formData.city || '-'}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{formData.address || '-'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Business Information</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Business Type</p>
                                <p className="font-medium capitalize">{formData.businessType || '-'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Business Name</p>
                                <p className="font-medium">{formData.businessName || '-'}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Business Description</p>
                                <p className="font-medium">{formData.businessDescription || '-'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="termsAccepted"
                            name="termsAccepted"
                            type="checkbox"
                            checked={formData.termsAccepted || false}
                            onChange={handleChange}
                            required
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                            I agree to the <a href="#" className="text-green-600 hover:text-green-800">Vendor Terms and Conditions</a>
                          </label>
                        </div>
                      </div>
                    </div>
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

                    {currentStep < 3 ? (
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

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center text-green-800 mb-8">Why Become a GroceryStore Vendor?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Reach More Customers",
                description: "Access thousands of customers looking for quality products every day.",
                icon: "👥"
              },
              {
                title: "Easy Management",
                description: "Our vendor dashboard makes it simple to manage your products and orders.",
                icon: "📊"
              },
              {
                title: "Fast Payments",
                description: "Get paid quickly with our reliable payment processing system.",
                icon: "💳"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md border border-green-100 text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h4 className="text-lg font-semibold text-green-700 mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorApplicationPage;