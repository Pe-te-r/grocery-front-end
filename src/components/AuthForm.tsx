import { useForm } from '@tanstack/react-form'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'

type AuthFormProps = {
  mode?: 'modal' | 'page'
  onSubmit: (values: { email: string; password: string }) => Promise<void>
  onSuccess?: () => void
}

export const AuthForm = ({ mode = 'page', onSubmit, onSuccess }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
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

  return (
    <div className={`${mode === 'modal' ? 'w-full' : 'max-w-md mx-auto'} space-y-6`}>
      {/* Header */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-gray-900"
        >
          Welcome back
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-2 text-gray-600"
        >
          Sign in to your account
        </motion.p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-5"
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
          {(field) => (
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
                  className={`block w-full rounded-lg border-0 py-3 px-4 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${field.state.meta.errors
                      ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 bg-red-50'
                      : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
                    }`}
                  placeholder="you@example.com"
                />
              </div>
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{field.state.meta.errors.join(', ')}</p>
              )}
            </motion.div>
          )}
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
          {(field) => (
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
                  className={`block w-full rounded-lg border-0 py-3 px-4 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset pr-10 ${field.state.meta.errors
                      ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 bg-red-50'
                      : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
                    }`}
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
              </div>
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{field.state.meta.errors.join(', ')}</p>
              )}
            </motion.div>
          )}
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
            >
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`flex w-full justify-center items-center rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${isSubmitting
                    ? 'bg-green-700'
                    : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 hover:shadow-md'
                  } focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-green-600`}
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
          className="flex items-center justify-between text-sm"
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

      {/* Optional Social Login */}
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

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="#"
            className="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
          >
            <span className="sr-only">Sign in with Google</span>
            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#EA4335" />
            </svg>
          </a>

          <a
            href="#"
            className="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
          >
            <span className="sr-only">Sign in with Facebook</span>
            <svg className="h-5 w-5" aria-hidden="true" fill="#1877F2" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  )
}