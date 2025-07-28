import { formatDate } from '@/lib/utils'

interface DriverDetailsProps {
  data: any
}

export const DriverDetails = ({ data }: DriverDetailsProps) => {
  const driver = data.data
  console.log('driver',driver)

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{driver.personalDetails.firstName} {driver.personalDetails.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{driver.personalDetails.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{driver.personalDetails.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="font-medium capitalize">{driver.personalDetails.accountStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <p className="font-medium">{driver.personalDetails.isVerified ? 'Verified' : 'Not Verified'}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Vehicle Type</p>
            <p className="font-medium capitalize">{driver.vehicleDetails.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">License Plate</p>
            <p className="font-medium uppercase">{driver.vehicleDetails.licensePlate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium capitalize">{driver.vehicleDetails.status}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Activity Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Assignments</p>
            <p className="font-medium text-green-700">{driver.activityStats.totalAssignments}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="font-medium text-green-700">{driver.activityStats.pendingAssignments}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="font-medium text-green-700">{driver.activityStats.inProgressAssignments}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="font-medium text-green-700">{driver.activityStats.completedAssignments}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="font-medium text-green-700">{driver.activityStats.cancelledAssignments}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="font-medium text-green-700">{driver.activityStats.completionRate}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Recent Activity</h3>
        {driver.recentActivity.length === 0 ? (
          <p className="text-gray-500 mt-2">No recent activity</p>
        ) : (
          <div className="mt-4 space-y-4">
            {driver.recentActivity.map((activity: any) => (
              <div key={activity.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Status: <span className="capitalize">{activity.status}</span></p>
                    <p className="text-sm text-gray-500">Created: {formatDate(activity.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-2 border-t pt-2">
                  <p className="text-sm font-medium">Order Item Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Vendor</p>
                      <p className="text-sm">{activity.orderItem.vendor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm">{activity.orderItem.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Order Status</p>
                      <p className="text-sm capitalize">{activity.orderItem.orderStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-green-700">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium">{formatDate(driver.metadata.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{formatDate(driver.metadata.lastUpdated)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}