import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})


import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Mail, User, MessageSquare, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react'

function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const form = useForm({
    defaultValues: {
      firstName: '',
      email: '',
      category: 'general',
      message: ''
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('Form submitted:', value)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setFormStatus('success')
        form.reset()
      } catch (error) {
        setFormStatus('error')
      }
    }
  })

  const validateName = ({ value }: { value: string }) => {
    if (!value) return 'Name is required'
    if (value.length < 2) return 'Name too short'
    return null
  }

  const validateEmail = ({ value }: { value: string }) => {
    if (!value) return 'Email is required'
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(value)) return 'Invalid email format'
    return null
  }

  const validateMessage = ({ value }: { value: string }) => {
    if (!value) return 'Message is required'
    if (value.length < 10) return 'Message too short (min 10 chars)'
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Illustration */}
          <div className="md:w-1/3 bg-gradient-to-br from-green-50 to-green-100 p-8 flex flex-col justify-center items-center">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800">We'd Love to Hear From You!</h2>
              <p className="text-green-600 mt-2">Our team is ready to assist with any questions.</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm w-full mt-auto">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">AI Assistant Coming Soon!</h4>
                  <p className="text-sm text-gray-600">Get instant answers to common questions with our upcoming AI bot.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact GroceryStore</h1>
            <p className="text-gray-600 mb-6">Have questions or feedback? Fill out the form below.</p>

            {formStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Thank you! Your message has been sent.</span>
                </div>
                <p className="text-green-700 text-sm mt-1">We'll get back to you within 24 hours.</p>
              </div>
            ) : formStatus === 'error' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Oops! Something went wrong.</span>
                </div>
                <p className="text-red-700 text-sm mt-1">Please try again later.</p>
              </div>
            ) : null}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void form.handleSubmit()
              }}
              className="space-y-5"
            >
              {/* First Name */}
              <form.Field
                name="firstName"
                validators={{ onChange: validateName }}
              >
                {(field) => {
                  const hasErrors = field.state.meta.errors?.length > 0
                  const isTouched = field.state.meta.isTouched
                  const isValid = !hasErrors && isTouched
                  return (
                    <div className="space-y-1.5">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className={`h-5 w-5 ${field.state.meta.errors?.length>0 ? 'text-red-500' :
                            isValid ? 'text-green-500' : 'text-gray-400'
                            }`} />
                        </div>
                        <input
                          id="firstName"
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`pl-10 pr-4 py-2 block w-full rounded-lg border-2 ${field.state.meta.errors?.length>0 ? 'border-red-400 focus:border-red-500' :
                            isValid ? 'border-green-400 focus:border-green-500' :
                              'border-gray-200 focus:border-green-500'
                            } shadow-sm transition-all duration-200 focus:ring-2 ${isValid ? 'focus:ring-green-200' : 'focus:ring-gray-200'
                            } outline-none`}
                        />
                        {isValid && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {field.state.meta.errors?.length>0 && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>

              {/* Email */}
              <form.Field
                name="email"
                validators={{ onChange: validateEmail }}
              >
                {(field) => {
                  const hasErrors = field.state.meta.errors?.length > 0
                  const isTouched = field.state.meta.isTouched
                  const isValid = !hasErrors && isTouched
                  return (
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className={`h-5 w-5 ${field.state.meta.errors?.length>0 ? 'text-red-500' :
                            isValid ? 'text-green-500' : 'text-gray-400'
                            }`} />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`pl-10 pr-4 py-2 block w-full rounded-lg border-2 ${field.state.meta.errors?.length>0 ? 'border-red-400 focus:border-red-500' :
                            isValid ? 'border-green-400 focus:border-green-500' :
                              'border-gray-200 focus:border-green-500'
                            } shadow-sm transition-all duration-200 focus:ring-2 ${isValid ? 'focus:ring-green-200' : 'focus:ring-gray-200'
                            } outline-none`}
                        />
                        {isValid && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {field.state.meta.errors?.length>0 && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>

              {/* Category */}
              <form.Field name="category">
                {(field) => (
                  <div className="space-y-1.5">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      What's this about?
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="block w-full py-2 pl-3 pr-10 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors duration-200 appearance-none bg-white"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="delivery">Delivery Issue</option>
                        <option value="product">Product Question</option>
                        <option value="feedback">Feedback/Suggestion</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              </form.Field>

              {/* Message */}
              <form.Field
                name="message"
                validators={{ onChange: validateMessage }}
              >
                {(field) => {
                  const hasErrors = field.state.meta.errors?.length > 0
                  const isTouched = field.state.meta.isTouched
                  const isValid = !hasErrors && isTouched
                  return (
                    <div className="space-y-1.5 relative">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={`px-4 py-2 block w-full rounded-lg border-2 ${field.state.meta.errors?.length>0 ? 'border-red-400 focus:border-red-500' :
                          isValid ? 'border-green-400 focus:border-green-500' :
                            'border-gray-200 focus:border-green-500'
                          } shadow-sm transition-all duration-200 focus:ring-2 ${isValid ? 'focus:ring-green-200' : 'focus:ring-gray-200'
                          } outline-none`}
                      />
                      {isValid && (
                        <div className="absolute right-3 top-9">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                      {field.state.meta.errors?.length>0 && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>


              <div className="pt-2">
                <button
                  type="submit"
                  disabled={form.state.isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {form.state.isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage