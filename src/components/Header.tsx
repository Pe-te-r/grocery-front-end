import { Link } from '@tanstack/react-router';
import { ShoppingCart, User, Phone, MapPin, Search } from 'lucide-react';

const GroceryStoreHeader = () => {
  // Assuming user is not logged in for this example
  const isLoggedIn = false;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-green-800 text-white text-sm py-1 px-4 text-center">
        <p>Free delivery on orders above Ksh 2,000 in Nairobi | Order before 3PM for same-day delivery</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo and Name */}
          <Link to='/' className="flex items-center space-x-2">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <ShoppingCart size={28} />
            </div>
            <h1 className="text-2xl font-bold text-green-700">
              Grocery<span className="text-green-500">Store</span>
            </h1>
          </Link>

          {/* Location Selector */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="text-green-600" size={18} />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                defaultValue="nairobi"
              >
                <option value="nairobi">Nairobi</option>
                <option value="mombasa">Mombasa</option>
                <option value="kisumu">Kisumu</option>
                <option value="nakuru">Nakuru</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search for fresh groceries..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to='/login' className="flex flex-col items-center text-gray-700 hover:text-green-600">
                  <User className="mb-1" size={20} />
                  <span className="text-xs">Sign In</span>
                </Link>
                <button className="flex flex-col items-center text-gray-700 hover:text-green-600">
                  <Phone className="mb-1" size={20} />
                  <span className="text-xs">Contact</span>
                </button>
              </>
            ) : (
              // Would show user profile and other options if logged in
              null
            )}

            <button className="relative flex flex-col items-center text-gray-700 hover:text-green-600">
              <ShoppingCart className="mb-1" size={20} />
              <span className="text-xs">Cart</span>
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="mt-4 hidden md:block">
          <ul className="flex space-x-6 overflow-x-auto pb-2">
            {['Fruits & Vegetables', 'Dairy & Eggs', 'Meat & Fish', 'Bakery', 'Pantry', 'Beverages', 'Snacks', 'Household'].map((category) => (
              <li key={category}>
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 whitespace-nowrap font-medium text-sm transition-colors"
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default GroceryStoreHeader;