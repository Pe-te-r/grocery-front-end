import {  authStore } from '@/store/authStore';
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Plus,
  Search
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async() => {
    const isVerified =await authStore.state.isVerified
    console.log(isVerified)
    if (!isVerified) {
      throw redirect({ to:'/login'})
    }
  },
  component: SuperAdminDashboard,
})




function SuperAdminDashboard() {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    products: true,
    users: false,
    // Add more menu states as needed
  });

  // Main navigation items
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Products",
      icon: Package,
      path: "/products",
      subItems: [
        { name: "All Products", path: "/products" },
        { name: "Categories", path: "/products/categories" },
        { name: "Inventory", path: "/products/inventory" },
      ],
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      path: "/orders",
      subItems: [
        { name: "All Orders", path: "/orders" },
        { name: "Pending", path: "/orders/pending" },
        { name: "Completed", path: "/orders/completed" },
      ],
    },
    {
      name: "Users",
      icon: Users,
      path: "/users",
      subItems: [
        { name: "Admins", path: "/users/admins" },
        { name: "Customers", path: "/users/customers" },
        { name: "Staff", path: "/users/staff" },
      ],
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            <h1 className="text-xl font-bold text-green-800">
              Grocery<span className="text-green-600">Admin</span>
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.name.toLowerCase())}
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors ${expandedMenus[item.name.toLowerCase()] ? 'bg-green-50 text-green-700' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={18} className="flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {expandedMenus[item.name.toLowerCase()] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {expandedMenus[item.name.toLowerCase()] && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              activeProps={{ className: 'text-green-600 font-medium' }}
                              className="block p-2 pl-4 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-700 text-sm transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    activeProps={{ className: 'bg-green-50 text-green-700' }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors"
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Add New Button (Flexible for different contexts) */}
        <div className="px-4 pb-4">
          <button className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
            <Plus size={18} />
            <span>Add New</span>
          </button>
        </div>

        {/* User & Help Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
              SA
            </div>
            <div>
              <p className="font-medium text-sm">Super Admin</p>
              <p className="text-xs text-gray-500">admin@grocerystore.com</p>
            </div>
          </div>
          <div className="flex justify-between text-gray-500">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <HelpCircle size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

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