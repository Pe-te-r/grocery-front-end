import { useForm } from '@tanstack/react-form'
import { ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'

type AuthFormProps = {
  mode?: 'modal' | 'page'
  onSubmit: (values: { email: string; password: string }) => Promise<void>
  onSuccess?: () => void
}

export const AuthForm = ({ mode = 'page', onSubmit, onSuccess }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [backgroundImages] = useState([
    'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ])
  const [currentBgImage, setCurrentBgImage] = useState(0)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value)
        onSuccess?.()
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
  })

  // Rotate background images
  useEffect(() => {
    if (mode === 'page') {
      const interval = setInterval(() => {
        setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  },[mode])

  return (
    <div className={`${mode === 'page' ? 'w-full' : 'max-w-4xl mx-auto'}`}>
      <div className={`${mode === 'page' ? 'flex flex-col md:flex-row gap-8' : ''}`}>
        {/* Left Column - Form */}
        <div className={`${mode === 'page' ? 'w-full md:w-1/2' : 'w-full'}`}>
        <div className="text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-gray-900"
            >
              Welcome back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="mt-1 text-gray-600"
            >
              Sign in to your account
            </motion.p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="mt-6 space-y-4"
          >
            {/* Email Field */}
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Email is required'
                  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return 'Invalid email address'
                  return undefined
                },
              }}
            >
              {(field) => {
                const hasErrors = field.state.meta.errors?.length > 0
                const isTouched = field.state.meta.isTouched
                const isValid = !hasErrors && isTouched
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-1"
                  >
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="email"
                        className={`block w-full rounded-lg border-2 py-2 px-3 shadow-sm focus:ring-2 focus:ring-inset ${hasErrors
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50'
                            : isValid
                              ? 'border-green-400 focus:border-green-500 focus:ring-green-100'
                              : 'border-gray-200 focus:border-green-500 focus:ring-green-100'
                          } transition-colors duration-200`}
                        placeholder="you@example.com"
                      />
                      {isValid && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {hasErrors && (
                      <p className="mt-1 text-sm text-red-600 animate-pulse">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </motion.div>
                )
              }}
            </form.Field>

            {/* Password Field */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Password is required'
                  if (value.length < 6) return 'Password must be at least 6 characters'
                  return undefined
                },
              }}
            >
              {(field) => {
                const hasErrors = field.state.meta.errors?.length > 0
                const isTouched = field.state.meta.isTouched
                const isValid = !hasErrors && isTouched
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={`block w-full rounded-lg border-2 py-2 px-3 shadow-sm focus:ring-2 focus:ring-inset pr-10 ${hasErrors
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50'
                            : isValid
                              ? 'border-green-400 focus:border-green-500 focus:ring-green-100'
                              : 'border-gray-200 focus:border-green-500 focus:ring-green-100'
                          } transition-colors duration-200`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                      {isValid && (
                        <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {hasErrors && (
                      <p className="mt-1 text-sm text-red-600 animate-pulse">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </motion.div>
                )
              }}
            </form.Field>

            {/* Submit Button */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-2"
                >
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className={`flex w-full justify-center items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${isSubmitting
                        ? 'bg-green-700'
                        : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 hover:shadow-md'
                      } focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-600`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <>
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </form.Subscribe>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between text-sm pt-2"
            >
              <Link
                to="/forgot-password"
                className="font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                Forgot password?
              </Link>
              <div className="text-gray-500">
                New user?{' '}
                <Link
                  to="/register"
                  className="font-medium text-green-600 hover:text-green-500 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </motion.div>
          </form>

          {/* Social Login */}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href="#"
                className="inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#EA4335" />
                </svg>
              </a>

              <a
                href="#"
                className="inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
              >
                <span className="sr-only">Sign in with Facebook</span>
                <svg className="h-5 w-5" aria-hidden="true" fill="#1877F2" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Additional Info */}
        {mode === 'page' && (
          <div className="hidden md:flex md:w-1/2 flex-col justify-center rounded-lg p-8 relative overflow-hidden">
            {/* Background images with transition */}
            <div className="absolute inset-0 z-0">
              {backgroundImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentBgImage ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
              <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
            </div>

            {/* Content on top of the background */}
            <div className="relative z-10 text-center text-white">
              <div className="mx-auto h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">New to GroceryStore?</h3>
              <p className="mb-6 opacity-90">
                Create an account to enjoy faster checkout, save your shopping lists, and track your orders.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg bg-white bg-opacity-90 px-4 py-2 text-sm font-medium text-green-600 shadow-sm ring-1 ring-inset ring-white ring-opacity-20 hover:bg-opacity-100 transition-all"
              >
                Create account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Contact page route implementation
// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/login')({
//   component: () => (
//     <div className="max-w-7xl mx-auto px-4 py-12">
//       <AuthForm mode="page" onSubmit={async (values) => {
//         console.log('Login submitted:', values)
//         await new Promise(resolve => setTimeout(resolve, 1000))
//       }} />
//     </div>
//   ),
// })