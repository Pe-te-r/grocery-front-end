import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'react-hot-toast';

import Header from '../components/Header'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { AppFooter } from '@/components/Footer.tsx'
import useAuthStore from '@/store/authStore.ts';
import { useEffect } from 'react';
// import { useEffect } from 'react'
// import { authActions } from '@/store/authStore.ts'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RouteComponent
})

function RouteComponent() {
  const reinitialize = useAuthStore((state) => state.reinitialize);

  useEffect(() => {
    reinitialize()
  }, [reinitialize])
  return (
    <>
      <Header />

      <Outlet />
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
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
    </>
  )
}