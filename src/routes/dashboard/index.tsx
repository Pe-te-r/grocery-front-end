import AdminDashboard from '@/components/dashboard/AdminDashboard'
import CustomerDashboard from '@/components/dashboard/CustomerDashboard'
import { getUserRoleHelper } from '@/lib/authHelper'
import { UserRole } from '@/util/types'
import { createFileRoute } from '@tanstack/react-router'

// Import all dashboard components

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const role = getUserRoleHelper() ?? ''
  
  const renderDashboard = () => {
    switch (role) {
      case UserRole.CUSTOMER:
        return <CustomerDashboard />
      case UserRole.ADMIN:
        return <AdminDashboard />
      case UserRole.VENDOR:
        // return <VendorDashboard />
      case UserRole.SUPERADMIN:
        return <AdminDashboard />
        // return <SuperAdminDashboard />
      case UserRole.DRIVER:
        // return <DriverDashboard />
      default:
        // return <Unauthorized />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  )
}

export default DashboardPage