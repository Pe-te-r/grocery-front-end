import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, User, Phone,  Menu, LogOut,  UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AccountModal } from './AccountModal';
import { getUserIdHelper, isAuthenticatedHelper, isUserVerifiedHelper, loginUserHelper, logoutUserHelper } from '@/lib/authHelper';
import { useCart } from '@/lib/cartHelper';
import { CartModal } from './CartModal';

const GroceryStoreHeader = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccountModal, setIsAccountModal] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  const logOut = () => {
    logoutUserHelper();
    setIsLoggedIn(false);
    navigate({to:'/'});
  };
  
  const param_url = !isUserVerifiedHelper() ? '/products' : '/dashboard/products';
  
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

  const mainNavLinks = [
    { to: "/", text: "Home" },
    { to: "/products", text: "Shop" },
    { to: "/about", text: "About Us" },
    { to: "/contact", text: "Contact" },
    {to:"/dashboard", text:"Dashboard",validate:true}
  ];


  
  useEffect(() => {
    setIsLoggedIn(isAuthenticatedHelper());
  }, [logoutUserHelper, loginUserHelper, logOut, isAuthenticatedHelper]);

  // Array of announcements
  const announcements = [
    "Free delivery on orders above Ksh 2,000 in Nairobi",
    "Order before 3PM for same-day delivery",
    // "New customers get 10% off first order - Use code WELCOME10",
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

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setHeaderVisible(false);
        } else {
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-green-800 text-white text-sm py-2 px-4 text-center"
      >
        <motion.div
          key={currentAnnouncement}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="animate-fade"
        >
          {announcements[currentAnnouncement]}
        </motion.div>
      </motion.div>

      {/* Main Header */}
    <motion.header 
      className={`bg-white shadow-md z-50 transition-transform duration-300 
        ${headerVisible ? 'translate-y-0' : '-translate-y-full'} 
        sticky top-0`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
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
              <motion.div 
                className="bg-green-600 text-white p-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={28} />
              </motion.div>
              <h1 className="text-2xl font-bold text-green-700">
                Grocery<span className="text-green-500">Store</span>
              </h1>
            </Link>

            {/* Main Navigation Links - Replacing county and search */}
            <nav className="hidden md:flex items-center space-x-6 order-3 md:order-2">
              {mainNavLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {
                    link.validate && getUserIdHelper() !== null?
                    <>
                      <Link 
                    to={link.to} 
                    className="text-green-700 hover:text-green-500 font-medium transition-colors"
                    activeProps={{ className: "text-green-600 font-bold" }}
                    >
                    {link.text}
                  </Link>
                    </>                   
                     : 
                     link?.validate === undefined &&
                    <Link 
                    to={link.to} 
                    className="text-green-700 hover:text-green-500 font-medium transition-colors"
                    activeProps={{ className: "text-green-600 font-bold" }}
                    >
                    {link.text}
                  </Link>
                  }
                </motion.div>
              ))}
            </nav>

            {/* Navigation Icons */}
            <div className="hidden md:flex items-center space-x-4 order-5">
              {!isLoggedIn ? (
                <>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link to='/login' className="flex flex-col items-center text-gray-700 hover:text-green-600">
                      <User className="mb-1" size={20} />
                      <span className="text-xs">Sign In</span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link to='/register' className="flex flex-col items-center text-gray-700 hover:text-green-600">
                      <UserPlus className="mb-1" size={20} />
                      <span className="text-xs">Registration</span>
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <button 
                      onClick={() => setIsAccountModal(true)} 
                      className="flex flex-col cursor-pointer items-center text-gray-700"
                    >
                      <User className="mb-1" size={20} />
                      <span className="text-xs">Account</span>
                    </button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <button 
                      onClick={logOut} 
                      className="flex cursor-pointer flex-col items-center text-gray-700"
                    >
                      <LogOut className="mb-1" size={20} />
                      <span className="text-xs">Logout</span>
                    </button>
                  </motion.div>
                </>
              )}

              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
              >
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex flex-col items-center text-gray-700 hover:text-green-600"
                >
                  <ShoppingCart className="mb-1" size={20} />
                  <span className="text-xs">Cart</span>
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Categories Navigation - Desktop */}
          <motion.nav 
            className="mt-4 hidden md:block"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ul className="flex space-x-6 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <motion.li 
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={param_url}
                    search={{ category }}
                    className="text-gray-700 hover:text-green-600 whitespace-nowrap font-medium text-sm transition-colors"
                  >
                    {category}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          {/* Mobile Menu - Only shown when mobileMenuOpen is true */}
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="mb-4">
                <h3 className="font-bold text-green-700 px-2 py-1 border-b border-green-100">Navigation</h3>
                <ul className="space-y-2 mt-2">
                  {mainNavLinks.map((link, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.to}
                        className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-green-50"
                        onClick={() => setMobileMenuOpen(false)}
                        activeProps={{ className: "text-green-600 font-medium bg-green-50" }}
                      >
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Account Links */}
              <nav className="mb-4">
                <h3 className="font-bold text-green-700 px-2 py-1 border-b border-green-100">Account</h3>
                <ul className="space-y-2 mt-2">
                  {!isLoggedIn ? (
                    <>
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          to='/login'
                          className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-green-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-2" size={18} />
                          Sign In
                        </Link>
                      </motion.li>
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          to='/contact'
                          className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-green-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Phone className="mr-2" size={18} />
                          Contact
                        </Link>
                      </motion.li>
                    </>
                  ) : (
                    <>
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <button
                          className="flex w-full items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-green-50"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setIsAccountModal(true);
                          }}
                        >
                          <User className="mr-2" size={18} />
                          My Account
                        </button>
                      </motion.li>
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <button
                          className="flex w-full items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-green-50"
                          onClick={() => {
                            logOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2" size={18} />
                          Logout
                        </button>
                      </motion.li>
                    </>
                  )}
                </ul>
              </nav>

              {/* Mobile Categories */}
              <nav>
                <h3 className="font-bold text-green-700 px-2 py-1 border-b border-green-100">Categories</h3>
                <ul className="space-y-2 mt-2">
                  {categories.map((category, index) => (
                    <motion.li
                      key={category}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      <Link
                        to="/products"
                        search={{ category }}
                        className="block text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>
      
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