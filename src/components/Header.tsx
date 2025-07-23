import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, User, Phone, MapPin, Search, Menu, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AccountModal } from './AccountModal';
import { isAuthenticatedHelper, isUserVerifiedHelper, loginUserHelper, logoutUserHelper } from '@/lib/authHelper';
import { useCart } from '@/lib/cartHelper';
import { CartModal } from './CartModal';
import { useCountyQuery } from '@/hooks/countyHook';

const GroceryStoreHeader = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccountModal, setIsAccountModal] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate()
  const logOut = () => {
    logoutUserHelper()
    setIsLoggedIn(false)
    navigate({to:'/'})
  }
  const param_url =! isUserVerifiedHelper() ?( '/products') : ('/dashboard/shop')
  
  const categories = [
  'Fruits & Vegetables', 
  'Dairy & Eggs', 
  'Meat & Seafood', 
  'Bakery', 
  'Pantry', 
  'Beverages', 
  'Snacks', 
  'Household'
];


  const { data, isLoading } = useCountyQuery()
  const [counties, setCounty] = useState([])
  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setCounty(data.data)
    }
  }, [data])
  useEffect(() => {
    console.log('use Effect', isAuthenticatedHelper())
    setIsLoggedIn(isAuthenticatedHelper())
  }, [logoutUserHelper, loginUserHelper, logOut, isAuthenticatedHelper])

  // Array of announcements
  const announcements = [
    "Free delivery on orders above Ksh 2,000 in Nairobi",
    "Order before 3PM for same-day delivery",
    "New customers get 10% off first order - Use code WELCOME10",
    "Weekend special: Buy 2 get 1 free on selected items"
  ];

  // Rotate announcements every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) { // Only start hiding after some scroll
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          setHeaderVisible(false);
        } else {
          // Scrolling up
          setHeaderVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-green-800 text-white text-sm py-2 px-4 text-center">
        <div className="animate-fade">
          {announcements[currentAnnouncement]}
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-white shadow-md z-50 transition-transform duration-300 
        ${headerVisible ? 'translate-y-0' : '-translate-y-full'} 
        sticky top-0`}>

        <div className="container mx-auto px-4 py-3">
          {/* Mobile Top Row */}
          <div className="flex items-center justify-between md:hidden mb-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="text-gray-700" size={24} />
            </button>

            {/* Logo - Centered on mobile */}
            <Link to='/' className="flex items-center space-x-2">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <ShoppingCart size={24} />
              </div>
              <h1 className="text-xl font-bold text-green-700">
                Grocery<span className="text-green-500">Store</span>
              </h1>
            </Link>

            {/* Cart Icon - Right side on mobile */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2">
              <ShoppingCart className="text-gray-700" size={20} />
              <span className="absolute top-0 right-0 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>

          {/* Desktop/Mobile Main Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Logo - Hidden on mobile (shown in mobile top row) */}
            <Link to='/' className="hidden md:flex items-center space-x-2">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <ShoppingCart size={28} />
              </div>
              <h1 className="text-2xl font-bold text-green-700">
                Grocery<span className="text-green-500">Store</span>
              </h1>
            </Link>

            {/* Location Selector - Full width on mobile */}
            <div className="w-full md:flex-1 md:max-w-md order-3 md:order-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="text-green-600" size={18} />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm md:text-base"
                  defaultValue="nairobi"
                >
                  {
                    isLoading ?
                    <option>Counties are loading</option>
                    :counties.length > 0 ?
                    counties.map((county: any, index) => (
                      <option key={index} value={county?.county_name}>
                        {county.county_name}
                      </option>
                    )) :
                        <option>No counties found</option>
                  }


                </select>
              </div>
            </div>

            {/* Search Bar - Full width on mobile */}
            <div className="w-full md:flex-1 md:max-w-xl order-4 md:order-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search for fresh groceries..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm md:text-base"
                />
              </div>
            </div>

            {/* Navigation Icons - Hidden on mobile (except cart) */}
            <div className="hidden md:flex items-center space-x-4 order-5">
              {!isLoggedIn ? (
                <>
                  <Link to='/login' className="flex flex-col items-center text-gray-700 hover:text-green-600">
                    <User className="mb-1" size={20} />
                    <span className="text-xs">Sign In</span>
                  </Link>
                  <Link to='/contact' className="flex flex-col items-center text-gray-700 hover:text-green-600">
                    <Phone className="mb-1" size={20} />
                    <span className="text-xs">Contact</span>
                  </Link>
                </>
              ) : (
                // Would show user profile and other options if logged in
                <>
                  <button onClick={() => setIsAccountModal(true)} className="flex flex-col cursor-pointer items-center text-gray-700">
                    <User className="mb-1" size={20} />
                    <span className="text-xs">Account</span>
                  </button>
                  <button onClick={logOut} className="flex cursor-pointer flex-col items-center text-gray-700">
                    <LogOut className="mb-1" size={20} />
                    <span className="text-xs">Logout</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex flex-col items-center text-gray-700 hover:text-green-600">
                <ShoppingCart className="mb-1" size={20} />
                <span className="text-xs">Cart</span>
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              </button>
            </div>
          </div>

          {/* Categories Navigation - Desktop */}
          <nav className="mt-4 hidden md:block">
            <ul className="flex space-x-6 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <li key={category}>
                  <Link
          to={param_url}
          search={{ category }}
          className="text-gray-700 hover:text-green-600 whitespace-nowrap font-medium text-sm transition-colors hover:underline"
        >
          {category}
        </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu - Only shown when mobileMenuOpen is true */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <nav className="mb-4">
                <ul className="space-y-3">
                  {!isLoggedIn ? (
                    <>
                      <li>
                        <Link
                          to='/login'
                          className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-2" size={18} />
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='/contact'
                          className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Phone className="mr-2" size={18} />
                          Contact
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <button
                        className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setIsAccountModal(true)
                        }
                        }
                      >
                        <User className="mr-2" size={18} />
                        My Account
                      </button>
                    </li>
                  )}
                </ul>
              </nav>

              {/* Mobile Categories */}
              <nav>
                <h3 className="font-bold text-gray-700 px-2 py-1">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category}>
                          <Link
        to="/products"
        search={{ category }}
        className="block text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100 text-sm"
        onClick={() => setMobileMenuOpen(false)}
      >
        {category}
      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </header>
      {isAccountModal && (
        <AccountModal
          isOpen={isAccountModal}
          onClose={() => setIsAccountModal(false)}
        />
      )}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default GroceryStoreHeader;