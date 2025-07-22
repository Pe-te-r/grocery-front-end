import { UserDetailsModalProvider } from '@/components/users/UserDetailsModalContext'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users')({
  component: RootLayout,
})





export default function RootLayout() {
  return (
    <UserDetailsModalProvider>
      <Outlet /> {/* Renders the matched child route */}
    </UserDetailsModalProvider>
  )
}
