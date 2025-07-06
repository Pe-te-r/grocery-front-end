import { SidebarDashboard } from '@/components/SideNav';
import { getUserRoleHelper, isAuthenticatedHelper } from '@/lib/authHelper';
import { createFileRoute,  Outlet, redirect } from '@tanstack/react-router';
import {
  Bell,
  Search,
} from 'lucide-react';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async() => {
    console.log(isAuthenticatedHelper())
    if (!isAuthenticatedHelper()){
      throw redirect({ to:'/login'})
    }
  },
  component: SuperAdminDashboard,
})




function SuperAdminDashboard() {



  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {
      <SidebarDashboard role={getUserRoleHelper() }/>
      }
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;