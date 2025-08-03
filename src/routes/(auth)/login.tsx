import { AuthForm } from '@/components/AuthForm';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShoppingBag, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLoginHook } from '@/hooks/authHook';
import { useState } from 'react';
import type { FormApi } from '@tanstack/react-form';
import { useSearch } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
})

function LoginPage() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const search = useSearch({from:'/(auth)/login'}) as {redirect:string}
  const navigate = useNavigate()
  const redirectOption = search?.redirect ?? '/dashboard'
  
  const redirect =()=>{

    navigate({ to:redirectOption , replace:true});
  }
  const mutate = useLoginHook(redirect)
  const handleSubmit = async (
    values: { email: string; password: string },
     formApi: FormApi<{ email: string; password: string }, any, any, any, any, any, any, any, any, unknown>

  ) => {
    try {
      const response = await mutate.mutateAsync(values)

      if (response.status === 'error') {
        formApi.setFieldValue('password', '')
        setSubmitError(response.message || 'Invalid credentials')
        throw new Error(response.message)
      }

    } catch (error) {
      formApi.setFieldValue('password', '')
      setSubmitError('Invalid email or password')
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <Leaf className="h-32 w-32 text-green-400" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <ShoppingBag className="h-32 w-32 text-green-400" />
      </div>

      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Animated Logo/Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full md:w-full sm:max-w-md text-center"
        >
          <ShoppingBag className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to <span className="text-green-600">GroceryStore</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Kenya's freshest groceries delivered to your doorstep
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 mx-auto w-full sm:w-[100%] lg:w-[70%] max-w-3xl"
        >

          <div className="bg-white py-8 px-6 shadow-lg rounded-2xl sm:px-10 border-2 border-black-100 w-[100%] mx-auto">
            {/* Main Auth Form */}
            <AuthForm
              mode="page"
              isLoading={mutate.isPending}
              error={submitError}
              onSubmit={handleSubmit}
            />

            {/* App Download CTA */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700">Get our mobile app</h3>
              <div className="mt-4 flex space-x-4">
                <a
                  href="#"
                  className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
                >
                  <svg className="-ml-0.5 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                  </svg>
                  App Store
                </a>
                <a
                  href="#"
                  className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
                >
                  
                  <svg className="-ml-0.5 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                  </svg>
                  Play Store
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p>
            By continuing, you agree to our{' '}
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