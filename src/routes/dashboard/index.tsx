import AdminDashboard from '@/components/dashboard/AdminDashboard'
import CustomerDashboard from '@/components/dashboard/CustomerDashboard'
import DriverDashboard from '@/components/dashboard/DriverDashboard'
import VendorDashboard from '@/components/dashboard/VendorDashboard'
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
        return <VendorDashboard />
      case UserRole.SUPERADMIN:
        return <AdminDashboard />
      case UserRole.DRIVER:
        return <DriverDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  )
}

export default DashboardPage