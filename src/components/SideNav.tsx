import { getUserEmailHelper, getUserRoleHelper, logoutUserHelper } from '@/lib/authHelper';
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
  User,
  Truck,
  ShoppingBag,
  ListOrdered,
  FileSignature,
  LocationEditIcon,
  ShoppingBagIcon,
  LucideShoppingBag,
  PickaxeIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/util/types';
import { useNavigate } from '@tanstack/react-router';


// Role-based user display info


type UserDisplayInfo = {
  roleName: string;
  initials: string;
};

export const getUserDisplayInfo = (role: UserRole | null): UserDisplayInfo | null => {
  if (!UserRole) return null;
  if (!role) return null
  const roleDisplayNames: Record<UserRole, string> = {
    [UserRole.CUSTOMER]: 'Customer',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.VENDOR]: 'Vendor',
    [UserRole.SUPERADMIN]: 'Super Admin',
    [UserRole.DRIVER]: 'Driver',
    [UserRole.PICKUPSTATION]: 'pickupstation'
  };

  return {
    roleName: roleDisplayNames[role] ?? 'Unknown',
    initials: roleDisplayNames[role]
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('')
  };
};

type Props = {
  role: UserRole;
};

export const SidebarDashboard = (role: Props) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
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
      setCollapsed(false);
      setTimeout(() => {
        setExpandedMenus(prev => ({
          ...prev,
          [menuName]: true
        }));
        setActiveMenu(menuName);
      }, 300);
    } else {
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
      if (!collapsed) {
        setExpandedMenus({});
      }
    }
  };

const sharedUserSubItems = [
  { name: "Admins", path: "/dashboard/users/admins" },
  { name: "Customers", path: "/dashboard/users/customers" },
  { name: "Vendors", path: "/dashboard/users/vendors" },
  { name: "Drivers", path: "/dashboard/users/drivers" },
];

const sharedSystemSubItems = [
  { name: "Admins", path: "/dashboard/system/admins" },
  { name: "Drivers", path: "/dashboard/system/drivers" },
];

const getNavItems = () => {
  const commonItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.VENDOR, UserRole.SUPERADMIN, UserRole.DRIVER],
    },
    {
      name: "Profile",
      icon: User,
      path: "/dashboard/settings",
      roles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.VENDOR, UserRole.SUPERADMIN, UserRole.DRIVER],
    },
  ];

  const customerItems = [
    {
      name: "Shop",
      icon: ShoppingBag,
      path: "/dashboard/products",
      roles: [UserRole.CUSTOMER],
    },
    {
      name: "My Orders",
      icon: ListOrdered,
      path: "/dashboard/orders/current",
      roles: [UserRole.CUSTOMER],
    },
    {
      name: "Vendor Applications",
      icon: FileSignature,
      path: "/dashboard/applications",
      roles: [UserRole.CUSTOMER],
    },
  ];

  const vendorItems = [
    {
      name: "Orders",
      icon: ShoppingCart,
      path: "/dashboard/orders/vendor-orders",
      roles: [UserRole.VENDOR],
    },
    {
      name: "My Shop",
      icon: LucideShoppingBag,
      path: "/dashboard/products",
      roles: [UserRole.VENDOR],
      subItems: [
        { name: "My Products", path: "/dashboard/vendor/my_products" },
        { name: "Add Product", path: "/dashboard/vendor/add" },
      ],
    },
  ];

  const adminItems = [
    {
      name: "Locations",
      icon: LocationEditIcon,
      path: "/dashboard/locations",
      roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    },
    {
      name: "Shops",
      icon: ShoppingBagIcon,
      path: "/dashboard/shops",
      roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    },
    {
      name: "Pickup Stations",
      icon: PickaxeIcon,
      path: "/dashboard/pickstation",
      roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      path: "/dashboard/orders",
      roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    },
    {
      name: "Products",
      icon: Package,
      path: "/dashboard/products",
      roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
      subItems: [
        { name: "All Products", path: "/dashboard/products" },
        { name: "Categories", path: "/dashboard/products/category" },
      ],
    },
    {
      name: "Users",
      icon: Users,
      path: "/dashboard/users",
      roles: [UserRole.ADMIN],
      subItems: sharedUserSubItems,
    },
    {
      name: "System",
      icon: Settings,
      roles: [UserRole.ADMIN],
      subItems: sharedSystemSubItems,
    }
  ];

  const superAdminExtraItems = [
    {
      name: "Users",
      icon: Users,
      path: "/dashboard/users",
      roles: [UserRole.SUPERADMIN],
      subItems: [
        { name: "SuperAdmin", path: "/dashboard/users/super_admin" },
        ...sharedUserSubItems,
      ],
    },
    {
      name: "System",
      icon: Settings,
      path: "/dashboard/system",
      roles: [UserRole.SUPERADMIN],
      subItems: [
        { name: "Super Admin", path: "/dashboard/system/super_admin" },
        ...sharedSystemSubItems,
      ],
    },
  ];

  const driverItems = [
    {
      name: "Deliveries",
      icon: Truck,
      path: "/dashboard/deliveries",
      roles: [UserRole.DRIVER],
    },
  ];

  // Combine all
  return [
    ...commonItems,
    ...customerItems,
    ...vendorItems,
    ...adminItems,
    ...superAdminExtraItems,
    ...driverItems,
  ].filter(item => item.roles.includes(role.role));
};
  const navItems = getNavItems();
const navigate = useNavigate();
const handleLogout = () => {
  logoutUserHelper()
    navigate({to:'/'})

}


  const userInfo = getUserDisplayInfo(getUserRoleHelper());
  console.log('userInfo', userInfo)

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <motion.button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-700 md:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      )}

      {/* Sidebar */}
      <motion.div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobile && !mobileOpen ? '-translate-x-full' : 'translate-x-0'}
          bg-white shadow-lg flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out
        `}
        initial={{ x: isMobile ? '-100%' : 0 }}
        animate={{
          x: isMobile ? (mobileOpen ? 0 : '-100%') : 0,
          width: collapsed ? '5rem' : '16rem'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2 min-w-max">
            <motion.div
              className="bg-green-600 text-white p-2 rounded-lg"
              whileHover={{ rotate: 10 }}
            >
              <ShoppingCart size={24} />
            </motion.div>
            {!collapsed && (
              <h1 className="text-xl font-bold text-green-800">
                Grocery<span className="text-green-600">Store</span>
              </h1>
            )}
          </Link>
          {!isMobile && (
            <motion.button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </motion.button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                {Array.isArray(item.subItems) && item.subItems?.length > 0 ? (
                  <>
                    <motion.button
                      onClick={() => toggleMenu(item.name.toLowerCase())}
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors ${expandedMenus[item.name.toLowerCase()] ? 'bg-green-50 text-green-700' : ''
                        }`}
                      whileHover={{ scale: collapsed ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                    </motion.button>

                    <AnimatePresence>
                      {(!collapsed || activeMenu === item.name.toLowerCase()) &&
                        expandedMenus[item.name.toLowerCase()] && (
                          <motion.ul
                            className={`${collapsed ? 'ml-2' : 'ml-8'} mt-1 space-y-1`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {Array.isArray(item.subItems) && item.subItems.map((subItem) => (
                              <motion.li
                                key={subItem.name}
                                whileHover={{ x: 5 }}
                              >
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
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: collapsed ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                  </motion.div>
                )}
              </li>
            ))}
          </ul>
        </nav>

  

        {/* User & Help Section */}
        <div className="border-t border-gray-200 p-4">
          {!collapsed ? (
            <>
              <motion.div
                className="flex items-center space-x-3 mb-4"
                whileHover={{ backgroundColor: 'rgba(240, 253, 244, 0.5)' }}
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
                  {userInfo?.initials}
                </div>
                <div>
                  <p className="font-medium text-sm">{userInfo?.roleName}</p>
                  <p className="text-xs text-gray-500">{getUserEmailHelper()}</p>
                </div>
              </motion.div>
              <div className="flex justify-between text-gray-500">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link to='/about' className="p-2 hover:bg-gray-100 rounded-lg">
                    <HelpCircle size={18} />
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link to='/dashboard/settings' className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings size={18} />
                  </Link>
                </motion.button>
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell size={18} />
                </motion.button>
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => handleLogout()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
                {userInfo?.initials}
              </div>
              <div className="flex flex-col space-y-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link to='/about' className="p-2 hover:bg-gray-100 rounded-lg">
                    <HelpCircle size={18} />
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link to='/dashboard/settings' className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings size={18} />
                  </Link>
                </motion.button>
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell size={18} />
                </motion.button>
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => logoutUserHelper()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};