import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import image1 from '../../assets/home/hero/hero1.jpeg'
import image2 from '../../assets/home/hero/hero2.jpeg'
import image3 from '../../assets/home/hero/hero3.jpeg'
import image4 from '../../assets/home/hero/hero4.jpeg'
import image5 from '../../assets/home/hero/hero5.jpeg'
import { AuthForm } from '../AuthForm'
import { useLoginHook } from '@/hooks/authHook'
import { isAuthenticatedHelper, loginUserHelper, logoutUserHelper } from '@/lib/authHelper'
import type { FormApi } from '@tanstack/react-form'
import { useSearch } from '@tanstack/react-router'

const heroImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
]

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
    const search = useSearch({from:'/(auth)/login'}) as {redirect:string}
    console.log('search',search?.redirect)
    const redirectOption = search?.redirect ?? '/dashboard'
    console.log('redirectOption: ', redirectOption);
  
  const mutate = useLoginHook(redirectOption)
  
  //
  useEffect(() => {
    console.log('hero section',isAuthenticatedHelper())
    setIsVerified(isAuthenticatedHelper())
  }, [logoutUserHelper, loginUserHelper, isAuthenticatedHelper])


  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!isAutoScrolling) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoScrolling])

  const [isOpen, setIsOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)


const handleSubmit = async (
    values: { email: string; password: string },
    formApi: FormApi<{ email: string; password: string }, undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined>
  ) => {
    try {
      const response = await mutate.mutateAsync(values)

      if (response.status === 'error') {
        formApi.setFieldValue('password', '')
        setSubmitError(response.message || 'Invalid credentials')
        throw new Error(response.message)
      }

      // Handle successful login
      console.log('Login successful', response.data)

    } catch (error) {
      formApi.setFieldValue('password', '')
      setSubmitError('Invalid email or password')
      throw error
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    setIsAutoScrolling(false)
    setTimeout(() => setIsAutoScrolling(true), 10000) // Resume auto-scroll after 10s
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
    setIsAutoScrolling(false)
    setTimeout(() => setIsAutoScrolling(true), 10000) // Resume auto-scroll after 10s
  }

  return (
    <>
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-4 overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="md:w-1/2 mb-8 md:mb-0 z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fresh Groceries Delivered to Your Doorstep
            </h1>
            <p className="text-xl mb-8">
              Kenya's fastest grocery delivery service. Order from local markets and supermarkets with just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to='/products'
                className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition hover:scale-105 transform"
              >
                Shop Now <ArrowRight className="ml-2" size={18} />
              </Link>
              {
                isVerified ? 
                  <>
                    <Link
                      to='/dashboard'
                      className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition hover:scale-105 transform"
                    >
                      Dashboard
                    </Link>
                  </>
                :
                  <>
                    {/* Sign Up Button */}
                    <Link
                      to='/register'
                      className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition hover:scale-105 transform"
                    >
                      Sign Up
                    </Link>
                    {/* Login Button */}
                    <button
                      onClick={() => setIsOpen(true)}
                      className="bg-transparent cursor-pointer border-2 border-white hover:bg-white hover:text-green-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition hover:scale-105 transform"
                    >
                      Login
                    </button>
                  </>
              }
            </div>
          </div>

          {/* Image Carousel */}
          <div className="md:w-1/2 w-full flex justify-center relative">
            <div className="relative w-full max-w-md h-96 md:h-[28rem] overflow-hidden  rounded-xl shadow-2xl">
              {/* Images with sliding animation */}
              {heroImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Fresh groceries ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === currentImageIndex
                    ? 'opacity-100 translate-x-0'
                    : index < currentImageIndex
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                    }`}
                />
              ))

              }{/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all z-20"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all z-20"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index)
                      setIsAutoScrolling(false)
                      setTimeout(() => setIsAutoScrolling(true), 10000)
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Floating animation elements */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-400/20 rounded-full filter blur-xl animate-pulse"></div>
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-300/20 rounded-full filter blur-lg animate-pulse delay-300"></div>
            </div>
          </div>
        </div>

        {/* Add to your global CSS */}
        <style>{`
        .animate-pulse {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
      `}</style>
      </section>
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl lg:w-1/4 md:w-2/4 sm:w-full relative p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <AuthForm
                mode="modal"
                isLoading={mutate.isPending}
                error={submitError}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
       
      </>
    </>
  )
}