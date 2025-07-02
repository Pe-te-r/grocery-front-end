import { Link } from '@tanstack/react-router';
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
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const SidebarDashboard = () => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    products: false,
    orders: false,
    users: false,
  });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (!isMobile && mobileOpen) setMobileOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, mobileOpen]);

  const toggleMenu = (menuName: string) => {
    if (collapsed) {
      // If sidebar is collapsed, expand it and open the menu
      setCollapsed(false);
      setTimeout(() => {
        setExpandedMenus(prev => ({
          ...prev,
          [menuName]: true
        }));
        setActiveMenu(menuName);
      }, 300); // Wait for the sidebar to finish expanding
    } else {
      // Normal behavior when not collapsed
      setExpandedMenus(prev => ({
        ...prev,
        [menuName]: !prev[menuName]
      }));
      setActiveMenu(menuName);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
      // Close all menus when collapsing
      if (!collapsed) {
        setExpandedMenus({
          products: false,
          orders: false,
          users: false,
        });
      }
    }
  };

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

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-700 md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobile && !mobileOpen ? '-translate-x-full' : 'translate-x-0'}
          bg-white shadow-lg flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2 min-w-max">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold text-green-800">
                Grocery<span className="text-green-600">Admin</span>
              </h1>
            )}
          </Link>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
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
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors ${expandedMenus[item.name.toLowerCase()] ? 'bg-green-50 text-green-700' : ''
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={18} className="flex-shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                      {!collapsed && (
                        expandedMenus[item.name.toLowerCase()] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )
                      )}
                    </button>

                    {(!collapsed || activeMenu === item.name.toLowerCase()) && expandedMenus[item.name.toLowerCase()] && (
                      <ul className={`${collapsed ? 'ml-2' : 'ml-8'} mt-1 space-y-1`}>
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              activeProps={{ className: 'text-green-600 font-medium' }}
                              className={`block p-2 ${collapsed ? 'pl-2' : 'pl-4'} rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-700 text-sm transition-colors`}
                              onClick={() => {
                                if (isMobile) setMobileOpen(false);
                              }}
                            >
                              {!collapsed ? subItem.name : <item.icon size={16} />}
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
                    onClick={() => {
                      if (isMobile) setMobileOpen(false);
                    }}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Add New Button */}
        <div className="px-4 pb-4">
          <button className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
            <Plus size={18} />
            {!collapsed && <span>Add New</span>}
          </button>
        </div>

        {/* User & Help Section */}
        <div className="border-t border-gray-200 p-4">
          {!collapsed ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
                SA
              </div>
              <div className="flex flex-col space-y-2">
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
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};