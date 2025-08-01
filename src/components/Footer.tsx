import { isUserVerifiedHelper } from '@/lib/authHelper';
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ShoppingBag, Clock, Shield } from 'lucide-react'
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

export const AppFooter = () => {
  const param_url =!isUserVerifiedHelper() ?( '/products') : ('/dashboard/shops')

  return (
    <footer className="bg-green-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
           {/* Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-green-700 mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-green-700 p-2 rounded-full">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Fast Delivery</h4>
              <p className="text-sm text-green-200">Within 2 hours</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-green-700 p-2 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Secure Payment</h4>
              <p className="text-sm text-green-200">100% secure</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-green-700 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Easy Returns</h4>
              <p className="text-sm text-green-200">7-day policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-green-700 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Cash on Delivery</h4>
              <p className="text-sm text-green-200">Pay when you get it</p>
            </div>
          </div>
        </div>
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <ShoppingBag className="mr-2" />
              GroceryStore
            </h3>
            <p className="text-green-100">
              Kenya's favorite online grocery delivery service. Fresh produce delivered to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-200 hover:text-white transition">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-green-200 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-green-200 hover:text-white transition">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-200 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-green-200 hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-green-200 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-200 hover:text-white transition">
                  Contact
                </Link>
              </li>

            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Categories</h3>
           <ul>
  {categories.map((category) => (
    <li key={category}>
      <motion.div whileHover={{ scale: 1.05 }}>
        <Link 
              to={param_url}
              search={{ category }}
          className="text-green-200 hover:text-white transition block"
        >
          {category}
        </Link>
      </motion.div>
    </li>
  ))}
</ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-0.5 mr-3 text-green-300" />
                <div>
                  <p className="text-green-100">Customer Service</p>
                  <a href="tel:+254700000000" className="text-green-200 hover:text-white transition">
                    +254 700 000 000
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-0.5 mr-3 text-green-300" />
                <div>
                  <p className="text-green-100">Email Us</p>
                  <a href="mailto:info@grocerystore.com" className="text-green-200 hover:text-white transition">
                    info@grocerystore.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-0.5 mr-3 text-green-300" />
                <div>
                  <p className="text-green-100">Headquarters</p>
                  <p className="text-green-200">Nairobi, Kenya</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <a href="/privacy" className="text-green-200 hover:text-white transition text-sm">
              Privacy Policy
            </a>
            <a href="/terms" className="text-green-200 hover:text-white transition text-sm">
              Terms of Service
            </a>
            <a href="/refunds" className="text-green-200 hover:text-white transition text-sm">
              Refund Policy
            </a>
          </div>
          <div className="text-green-200 text-sm">
            © {new Date().getFullYear()} GroceryStore Kenya. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}