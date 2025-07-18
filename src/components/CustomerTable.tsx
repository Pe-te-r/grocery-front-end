import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronRight, Loader2, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUsersFn } from '@/api/users';
import { DriverStatus, VehicleType, type CreateDriverDto } from '@/api/driver';
import { useCreateDriver } from '@/hooks/driverHook';
import toast from 'react-hot-toast';

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_verified: boolean;
  account_status: 'active' | 'inactive' | 'suspended';
  created_at: string;
};

const CustomerTable = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [driverFormData, setDriverFormData] = useState<Omit<CreateDriverDto, 'userId'>>({
    vehicle_type: VehicleType.CAR,
    license_plate: '',
    status: DriverStatus.AVAILABLE,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getUsersFn({ customers: true }),
  });

  const { mutate, isPending } = useCreateDriver();

  const customers = data?.data?.filter((customer: Customer) => customer.account_status === 'active') || [];

  const handleMakeDriver = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDriverForm(true);
  };

  const handleSubmit = () => {
    if (!selectedCustomer) return;

    const driverData: CreateDriverDto = {
      userId: selectedCustomer.id,
      ...driverFormData,
    };

    mutate(driverData, {
      onSuccess: () => {
        toast.success('Driver created successfully!');
        setShowDriverForm(false);
        refetch();
      },
      onError: (error) => {
        toast.error(`Error creating driver: ${error.message}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <X className="w-8 h-8 mr-2" />
        <span>Failed to load customers</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">

      <h2 className="text-2xl font-bold text-green-800 mb-6">Active users to be drivers</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer: Customer) => (
              <motion.tr
                key={customer.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-green-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.first_name} {customer.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${customer.account_status === 'active' ? 'bg-green-100 text-green-800' :
                      customer.account_status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                    {customer.account_status}
                  </span>
                </td>
                <td className="px-6 py-4  whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleMakeDriver(customer)}
                    className="flex cursor-pointer items-center gap-2 px-5 py-2 rounded-2xl font-semibold shadow-md text-white bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out"
                  >
                    Make Driver
                    <ChevronRight className="h-4 w-4" />
                  </button>

                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Driver Form Modal */}
      {showDriverForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowDriverForm(false)}
        >

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-green-800 mb-4">
              Make {selectedCustomer?.first_name} a Driver
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={driverFormData.vehicle_type}
                  onChange={(e) => setDriverFormData({
                    ...driverFormData,
                    vehicle_type: e.target.value as VehicleType
                  })}
                >
                  {Object.values(VehicleType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={driverFormData.license_plate}
                  onChange={(e) => setDriverFormData({
                    ...driverFormData,
                    license_plate: e.target.value
                  })}
                  placeholder="ABC-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={driverFormData.status}
                  onChange={(e) => setDriverFormData({
                    ...driverFormData,
                    status: e.target.value as DriverStatus
                  })}
                >
                  {Object.values(DriverStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {/* Cancel Button */}
              <button
                onClick={() => setShowDriverForm(false)}
                className="px-6 py-2 cursor-pointer rounded-2xl font-semibold shadow-sm border border-green-600 text-green-600 hover:bg-green-50 transition duration-300 ease-in-out"
              >
                Cancel
              </button>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className={`px-6 cursor-pointer py-2 rounded-2xl font-semibold shadow-md flex items-center justify-center gap-2 transition duration-300 ease-in-out
      ${isPending ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} 
      text-white`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create Driver
                  </>
                )}
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomerTable;