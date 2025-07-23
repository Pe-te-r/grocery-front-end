import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  Store, 
  Package, 
  Truck,  
  AlertCircle, 
  Loader2, 
  Activity 
} from 'lucide-react';
import { StatCard } from './DashboardComponents/StatCard';
import { adminDashboardHook } from '@/hooks/dashboardHook';
import { ProgressCard } from './DashboardComponents/ProgressCard';

type DashboardData = {
  users: {
    total: number;
    customers: number;
    storeOwners: number;
    drivers: number;
    admins: number;
    recent: number;
  };
  stores: {
    total: number;
    active: number;
  };
  products: {
    total: number;
    available: number;
    outOfStock: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    recent: number;
  };
  drivers: {
    total: number;
    available: number;
    onDelivery: number;
  };
};



const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data:response,  } = adminDashboardHook();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        if (response?.status === 'success') {
            console.log('Fetching dashboard data...',response);
          setDashboardData(response.data);
        } else if( response?.status === 'error') {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [response]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading dashboard</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={dashboardData.users.total} 
            icon={<Users className="h-5 w-5" />} 
            change={10} 
          />
          <StatCard 
            title="Total Stores" 
            value={dashboardData.stores.total} 
            icon={<Store className="h-5 w-5" />} 
            change={5} 
          />
          <StatCard 
            title="Total Products" 
            value={dashboardData.products.total} 
            icon={<Package className="h-5 w-5" />} 
            change={8} 
          />
          <StatCard 
            title="Total Orders" 
            value={dashboardData.orders.total} 
            icon={<ShoppingCart className="h-5 w-5" />} 
            change={15} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">User Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Customers</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{dashboardData.users.customers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Store Owners</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{dashboardData.users.storeOwners}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Drivers</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{dashboardData.users.drivers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{dashboardData.users.admins}</p>
              </div>
            </div>
          </div>

          <ProgressCard 
            title="Active Stores" 
            value={dashboardData.stores.active} 
            total={dashboardData.stores.total} 
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ProgressCard 
            title="Available Products" 
            value={dashboardData.products.available} 
            total={dashboardData.products.total} 
            color="blue"
          />
          <ProgressCard 
            title="Completed Orders" 
            value={dashboardData.orders.completed} 
            total={dashboardData.orders.total} 
            color="green"
          />
          <ProgressCard 
            title="Available Drivers" 
            value={dashboardData.drivers.available} 
            total={dashboardData.drivers.total} 
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Pending</span>
                  <span>{dashboardData.orders.pending}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(dashboardData.orders.pending / dashboardData.orders.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Processing</span>
                  <span>{dashboardData.orders.processing}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(dashboardData.orders.processing / dashboardData.orders.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Completed</span>
                  <span>{dashboardData.orders.completed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(dashboardData.orders.completed / dashboardData.orders.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Cancelled</span>
                  <span>{dashboardData.orders.cancelled}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(dashboardData.orders.cancelled / dashboardData.orders.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-4">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{dashboardData.users.recent} new users</p>
                  <p className="text-sm text-gray-500 mt-1">Signed up in the last 7 days</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-4">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{dashboardData.orders.recent} new orders</p>
                  <p className="text-sm text-gray-500 mt-1">Placed in the last 7 days</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600 mr-4">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{dashboardData.drivers.onDelivery} on delivery</p>
                  <p className="text-sm text-gray-500 mt-1">Active deliveries right now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;