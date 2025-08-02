import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'
import { Suspense, lazy } from 'react'

import Header from '../components/Header'
import { AppFooter } from '@/components/Footer.tsx'
import useAuthStore from '@/store/authStore.ts'
import { useEffect } from 'react'

import type { QueryClient } from '@tanstack/react-query'
import { ChatbotProvider } from '@/components/ChatbotProvider.tsx'
import { ThemeProvider } from '@/context/theme-context.tsx'
import { MainNotFoundPage } from '@/components/notFound/MainNotFound.tsx'

// Lazy load components that aren't immediately needed
const LazyDevtools = lazy(() => import('@tanstack/react-router-devtools').then(m => ({
  default: m.TanStackRouterDevtools
})))


interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RouteComponent,
  notFoundComponent:MainNotFoundPage
})

function RouteComponent() {
  const reinitialize = useAuthStore((state) => state.reinitialize)

  useEffect(() => {
    reinitialize()
  }, [reinitialize])

  return (
    <>
    <ThemeProvider>   

          <Header />
      
      <Outlet />
      
      {/* Suspense for lazy-loaded components */}
      <Suspense fallback={null}>
        <ChatbotProvider>
          <LazyDevtools />
          {/* <TanStackQueryLayout /> */}
          <AppFooter />
          
          <Toaster
            toastOptions={{
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </ChatbotProvider>
      </Suspense>
      </ThemeProvider>
    </>
  )
}