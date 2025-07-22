import { formatDate } from '@/lib/utils'

interface VendorDetailsProps {
  data: any
}

export const VendorDetails = ({ data }: VendorDetailsProps) => {
  const vendor = data.data

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{vendor.personalDetails.firstName} {vendor.personalDetails.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{vendor.personalDetails.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{vendor.personalDetails.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="font-medium capitalize">{vendor.personalDetails.accountStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <p className="font-medium">{vendor.personalDetails.isVerified ? 'Verified' : 'Not Verified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium">{formatDate(vendor.personalDetails.lastLogin)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">{formatDate(vendor.personalDetails.memberSince)}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Store Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Business Name</p>
            <p className="font-medium">{vendor.storeDetails.businessName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business Type</p>
            <p className="font-medium capitalize">{vendor.storeDetails.businessType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium">{vendor.storeDetails.businessDescription}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium">{vendor.storeDetails.contact}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{vendor.storeDetails.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Approval Status</p>
            <p className="font-medium">{vendor.storeDetails.approvalStatus ? 'Approved' : 'Not Approved'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Terms Accepted</p>
            <p className="font-medium">{vendor.storeDetails.termsAccepted ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-medium text-green-600">Location</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">County</p>
              <p className="font-medium">{vendor.storeDetails.location.county}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Constituency</p>
              <p className="font-medium">{vendor.storeDetails.location.constituency}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-green-700">Business Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Has Products</p>
            <p className="font-medium text-green-700">{vendor.businessActivity.hasProducts ? 'Yes' : 'No'}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Product Count</p>
            <p className="font-medium text-green-700">{vendor.businessActivity.productCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="font-medium text-green-700">{vendor.businessActivity.totalOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Items Sold</p>
            <p className="font-medium text-green-700">{vendor.businessActivity.totalItemsSold}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-green-700">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{formatDate(vendor.metadata.lastUpdated)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}