import { formatDate } from '@/lib/utils'

interface CustomerDetailsProps {
  data: any
}

export const CustomerDetails = ({ data }: CustomerDetailsProps) => {
  const customer = data.data

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{customer.personalDetails.firstName} {customer.personalDetails.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{customer.personalDetails.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{customer.personalDetails.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="font-medium capitalize">{customer.personalDetails.accountStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <p className="font-medium">{customer.personalDetails.isVerified ? 'Verified' : 'Not Verified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">{formatDate(customer.personalDetails.memberSince)}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Session Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium">{formatDate(customer.sessionInfo.lastLogin)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">OTP Enabled</p>
            <p className="font-medium">{customer.sessionInfo.otpEnabled ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">IP Address</p>
            <p className="font-medium">{customer.sessionInfo.ipAddress}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Order Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="font-medium text-green-700">{customer.orderStatistics.totalOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="font-medium text-green-700">{customer.orderStatistics.pendingOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="font-medium text-green-700">{customer.orderStatistics.completedOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="font-medium text-green-700">{customer.orderStatistics.cancelledOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="font-medium text-green-700">KSh {customer.orderStatistics.totalSpent}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Average Order</p>
            <p className="font-medium text-green-700">KSh {customer.orderStatistics.averageOrderValue}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-green-700">Recent Orders</h3>
        {customer.recentOrders.length === 0 ? (
          <p className="text-gray-500 mt-2">No recent orders</p>
        ) : (
          <div className="mt-4 space-y-4">
            {customer.recentOrders.map((order: any) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">Date: {formatDate(order.date)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="font-medium">KSh {order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Item Count</p>
                    <p className="font-medium">{order.itemCount}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Vendors</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {order.vendors.map((vendor: string, index: number) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {vendor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}