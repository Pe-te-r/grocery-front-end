import { UserDetailsModalProvider } from '@/components/users/UserDetailsModalContext'
import { getUserRoleHelper } from '@/lib/authHelper'
import { UserRole } from '@/util/types'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users')({
    beforeLoad: async() => {
        const userRole = getUserRoleHelper()
  
  // Only allow ADMIN and SUPERADMIN to proceed
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPERADMIN) {
        throw redirect({ to: '/Unauthorized' });
    }
    },
  component: RootLayout,
})





export default function RootLayout() {
  return (
    <UserDetailsModalProvider>
      <Outlet /> {/* Renders the matched child route */}
    </UserDetailsModalProvider>
  )
}
