import { createFileRoute } from '@tanstack/react-router'
import { ShoppingBasket, Truck, ShieldCheck, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div >

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fresh Groceries Delivered to Your Doorstep
            </h1>
            <p className="text-xl mb-8">
              Kenya's fastest grocery delivery service. Order from local markets and supermarkets with just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition">
                Shop Now <ArrowRight className="ml-2" size={18} />
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition">
                Sign Up / Login
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/grocery-basket.png"
              alt="Fresh groceries"
              className="w-full max-w-md animate-float"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-700">Why Choose GroceryStore?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingBasket size={48} className="text-green-600" />,
                title: "Wide Selection",
                description: "From fresh produce to household essentials, we've got everything you need."
              },
              {
                icon: <Truck size={48} className="text-green-600" />,
                title: "Fast Delivery",
                description: "Get your groceries delivered in as little as 2 hours across major Kenyan cities."
              },
              {
                icon: <ShieldCheck size={48} className="text-green-600" />,
                title: "Quality Guaranteed",
                description: "We source directly from trusted farmers and suppliers for the freshest products."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 px-4 bg-green-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-700">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Fruits & Vegetables", image: "/images/fruits-veg.jpg" },
              { name: "Dairy & Eggs", image: "/images/dairy.jpg" },
              { name: "Meat & Fish", image: "/images/meat.jpg" },
              { name: "Bakery", image: "/images/bakery.jpg" },
              { name: "Pantry Staples", image: "/images/pantry.jpg" },
              { name: "Beverages", image: "/images/beverages.jpg" },
              { name: "Snacks", image: "/images/snacks.jpg" },
              { name: "Household", image: "/images/household.jpg" }
            ].map((category, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to shop the easy way?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers enjoying convenient grocery shopping.
          </p>
          <button className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition">
            Get Started - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-green-400">GroceryStore</h2>
              <p className="text-gray-400">Your trusted grocery partner in Kenya</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-green-400 transition">About Us</a>
              <a href="#" className="hover:text-green-400 transition">Contact</a>
              <a href="#" className="hover:text-green-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition">Terms</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} GroceryStore Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}