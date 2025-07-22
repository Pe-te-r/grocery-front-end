import { formatDate } from "@/lib/utils"

interface AdminDetailsProps {
  data: any
}

export const AdminDetails = ({ data }: AdminDetailsProps) => {
  const admin = data.data

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{admin.personalDetails.firstName} {admin.personalDetails.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{admin.personalDetails.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{admin.personalDetails.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">{admin.personalDetails.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="font-medium capitalize">{admin.personalDetails.accountStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <p className="font-medium">{admin.personalDetails.isVerified ? 'Verified' : 'Not Verified'}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Security Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium">{formatDate(admin.securityDetails.lastLogin)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">OTP Enabled</p>
            <p className="font-medium">{admin.securityDetails.otpEnabled ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">IP Address</p>
            <p className="font-medium">{admin.securityDetails.ipAddress}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-green-700">Account Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium">{formatDate(admin.personalDetails.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{formatDate(admin.personalDetails.lastUpdated)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}