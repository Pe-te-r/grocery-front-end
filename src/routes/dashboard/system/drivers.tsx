import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/system/drivers')({
  component: DriversPage,
})


import CustomerTable from '@/components/CustomerTable';

function DriversPage(){
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-900">Driver Management</h1>
        <p className="text-gray-600 mt-2">
          Select active customers to convert them to drivers
        </p>
      </div>

      <CustomerTable />
    </div>
  );
};
