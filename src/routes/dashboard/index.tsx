import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})


// src/pages/dashboard.tsx
import { useState } from 'react'
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import useAuthStore from '@/store/authStore'
import { getUserIdHelper } from '@/lib/authHelper'

function DashboardPage(){
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Mock data - in a real app, this would come from API calls
  const stats = {
    totalOrders: 1245,
    newOrders: 42,
    completedOrders: 1180,
    pendingOrders: 23,
    totalCustomers: 856,
    newCustomers: 28,
    activeDrivers: 18,
    availableDrivers: 12,
    totalRevenue: 2456800,
    todayRevenue: 125600,
    popularProducts: [
      { name: 'Fresh Tomatoes', orders: 215 },
      { name: 'Rice 5kg', orders: 198 },
      { name: 'Cooking Oil 2L', orders: 176 },
      { name: 'Wheat Flour 2kg', orders: 154 },
      { name: 'Sugar 1kg', orders: 142 },
    ],
    recentOrders: [
      { id: '#ORD-1241', customer: 'John Mwangi', amount: 2450, status: 'Delivered', time: '2 hours ago' },
      { id: '#ORD-1240', customer: 'Susan Atieno', amount: 1850, status: 'In Transit', time: '3 hours ago' },
      { id: '#ORD-1239', customer: 'David Omondi', amount: 3200, status: 'Processing', time: '5 hours ago' },
      { id: '#ORD-1238', customer: 'Grace Wambui', amount: 1450, status: 'Delivered', time: '7 hours ago' },
      { id: '#ORD-1237', customer: 'Peter Kamau', amount: 2750, status: 'Cancelled', time: '1 day ago' },
    ],
    serviceAreas: [
      { name: 'Nairobi CBD', orders: 845 },
      { name: 'Westlands', orders: 342 },
      { name: 'Karen', orders: 278 },
      { name: 'Runda', orders: 195 },
      { name: 'Langata', orders: 185 },
    ]
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>12.5% from last month</span>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>8.3% from last month</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">KSh {stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>15.2% from last month</span>
          </div>
        </div>

        {/* Drivers Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Drivers</p>
              <h3 className="text-2xl font-bold">{stats.activeDrivers}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <MapPin size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>{stats.availableDrivers} available now</span>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order Status Chart */}
        <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Order Analytics</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded">Daily</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">Weekly</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">Monthly</button>
            </div>
          </div>

          {/* Placeholder for chart - in a real app, you'd use a charting library */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Order Trends Chart Visualization
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-green-600 font-bold">{stats.newOrders}</div>
              <div className="text-gray-500 text-sm">New Orders</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 font-bold">{stats.completedOrders}</div>
              <div className="text-gray-500 text-sm">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-600 font-bold">{stats.pendingOrders}</div>
              <div className="text-gray-500 text-sm">Pending</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Delivery Time</p>
                  <p className="font-medium">45 mins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="font-medium">94.7%</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issues Reported</p>
                  <p className="font-medium">12</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New Customers</p>
                  <p className="font-medium">{stats.newCustomers}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                  <DollarSign size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today's Revenue</p>
                  <p className="font-medium">KSh {stats.todayRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* Popular Products */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection('products')}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <h2 className="text-lg font-semibold text-gray-800">Popular Products</h2>
            {expandedSection === 'products' ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSection === 'products' && (
            <div className="p-4 border-t">
              <div className="space-y-3">
                {stats.popularProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-6 text-gray-500">{index + 1}.</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <span className="text-gray-600">{product.orders} orders</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Link to="/products" className="text-green-600 hover:underline text-sm">
                  View all products →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection('orders')}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            {expandedSection === 'orders' ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSection === 'orders' && (
            <div className="p-0 border-t">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">KSh {order.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 text-right">
                <Link to="/dashboard/orders" className="text-green-600 hover:underline text-sm">
                  View all orders →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Service Areas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => toggleSection('areas')}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <h2 className="text-lg font-semibold text-gray-800">Top Service Areas</h2>
            {expandedSection === 'areas' ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSection === 'areas' && (
            <div className="p-4 border-t">
              <div className="space-y-4">
                {stats.serviceAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{area.name}</span>
                      <span className="text-gray-600">{area.orders} orders</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(area.orders / stats.serviceAreas[0].orders) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Link to="/dashboard" className="text-green-600 hover:underline text-sm">
                  Manage service areas →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage