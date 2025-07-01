import { useForm } from '@tanstack/react-form'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, ArrowRight, MapPin } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '', // Added location field
      password: '',
      confirmPassword: ''
    },
    onSubmit: async ({ value }) => {
      console.log('Registration data:', value)
      // await registerUser(value)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <User className="h-32 w-32 text-green-400" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <Lock className="h-32 w-32 text-green-400" />
      </div>

      <div className="flex min-h-full flex-col justify-center py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-3xl text-center"
        >
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Kenya's favorite grocery delivery service
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 sm:mx-auto sm:w-full sm:max-w-3xl"
        >
          <div className="bg-white py-6 px-6 shadow-lg rounded-2xl sm:px-8 border border-green-100">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-4"
            >
              {/* Row 1: Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <form.Field
                  name="firstName"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'First name is required' : undefined
                  }}
                >
                  {(field) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-1"
                    >
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`block w-full rounded-md border-0 py-2 pl-10 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${field.state.meta.errors
                            ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 bg-red-50'
                            : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
                            }`}
                          placeholder="John"
                        />
                      </div>
                      {field.state.meta.errors && (
                        <p className="mt-1 text-sm text-red-600 animate-pulse">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </motion.div>
                  )}
                </form.Field>

                {/* Last Name */}
                <form.Field
                  name="lastName"
                >
                  {(field) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-1"
                    >
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600"
                          placeholder="Doe"
                        />
                      </div>
                    </motion.div>
                  )}
                </form.Field>
              </div>

              {/* Row 2: Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Email is required' :
                        !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? 'Invalid email address' : undefined
                  }}
                >
                  {(field) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-1"
                    >
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`block w-full rounded-md border-0 py-2 pl-10 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${field.state.meta.errors
                            ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 bg-red-50'
                            : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
                            }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {field.state.meta.errors && (
                        <p className="mt-1 text-sm text-red-600 animate-pulse">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </motion.div>
                  )}
                </form.Field>

                {/* Phone */}
                <form.Field
                  name="phone"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Phone number is required' :
                        !/^[0-9]{10,15}$/.test(value) ? 'Invalid phone number' : undefined
                  }}
                >
                  {(field) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="space-y-1"
                    >
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`block w-full rounded-md border-0 py-2 pl-10 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${field.state.meta.errors
                            ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 bg-red-50'
                            : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
                            }`}
                          placeholder="0712345678"
                        />
                      </div>
                      {field.state.meta.errors && (
                        <p className="mt-1 text-sm text-red-600 animate-pulse">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </motion.div>
                  )}
                </form.Field>
              </div>

              {/* Row 3: Location */}
              <form.Field
                name="location"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Location is required' : undefined
                }}
              >
                {(field) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-1"
                  >
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      Your Location *
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={`block w-full rounded-md border-0 py-2 pl-10 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${field.state.meta.errors
                          ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 bg-red-50'
                          : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
                          }`}
                      >
                        <option value="">Select your area</option>
                        <option value="nairobi">Nairobi</option>
                        <option value="mombasa">Mombasa</option>
                        <option value="kisumu">Kisumu</option>
                        <option value="nakuru">Nakuru</option>
                        <option value="eldoret">Eldoret</option>
                      </select>
                    </div>
                    {field.state.meta.errors && (
                      <p className="mt-1 text-sm text-red-600 animate-pulse">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </motion.div>
                )}
              </form.Field>

              {/* Row 4: Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Password is required' :
                        value.length < 8 ? 'Password must be at least 8 characters' : undefined
                  }}
                >
                  {(field) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                      className="space-y-1"
                    >
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`block w-full rounded-md border-0 py-2 pl-10 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${field.state.meta.errors
                            ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 bg-red-50'
                            : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
                            }`}
                          placeholder="••••••••"
                        />
                      </div>
                      {field.state.meta.errors ? (
                        <p className="mt-1 text-sm text-red-600 animate-pulse">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least 8 characters
                        </p>
                      )}
                    </motion.div>
                  )}
                </form.Field>

                {/* Confirm Password */}
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Please confirm your password' :
                        value !== form.getFieldValue('password') ? 'Passwords do not match' : undefined
                  }}
                >
                  {(field) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-1"
                    >
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        Confirm Password *
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`block w-full rounded-md border-0 py-2 pl-10 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${field.state.meta.errors
                            ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 bg-red-50'
                            : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
                            }`}
                          placeholder="••••••••"
                        />
                      </div>
                      {field.state.meta.errors && (
                        <p className="mt-1 text-sm text-red-600 animate-pulse">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </motion.div>
                  )}
                </form.Field>
              </div>

              {/* Submit Button */}
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="pt-2"
                  >
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className={`flex w-full justify-center items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${isSubmitting
                        ? 'bg-green-700'
                        : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 hover:shadow-md'
                        } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        <>
                          Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              />
            </form>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center text-sm text-gray-600"
            >
              <p>
                Already have an account?{' '}
                <a href="/login" className="font-medium text-green-600 hover:text-green-500">
                  Sign in
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Terms and Conditions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          <p>
            By creating an account, you agree to our{' '}
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}