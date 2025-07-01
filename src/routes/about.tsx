import { createFileRoute } from '@tanstack/react-router'
import { Leaf, Store, HeartHandshake, Users, Phone, Mail, MapPin } from 'lucide-react';

export const Route = createFileRoute('/about')({
  component: AboutUsPage,
})



function AboutUsPage(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-green-700 mb-4">About <span className="text-orange-500">GroceryStore</span></h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Your trusted neighborhood grocery store providing fresh, high-quality products with a personal touch.
        </p>
      </section>

      {/* Story Section with Image */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
        <div className="md:w-1/2">
          {/* Replace with your actual image */}
          <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">[Store Front Photo]</span>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold text-green-700 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2015, GroceryStore began as a small family-owned shop with a simple mission: to bring fresh, affordable groceries to our community while supporting local farmers.
          </p>
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-700 mb-2 flex items-center gap-2">
              <Leaf className="text-green-600" /> Inspired by Kenya's Resilience
            </h3>
            <p className="text-gray-600">
              In Nairobi's Kibera neighborhood, Mama Atieno ran a small grocery stall that became a lifeline during the pandemic. When supplies ran low, she organized a cooperative with other women vendors to source directly from farmers, ensuring her community never went hungry. Her story reminds us that even the smallest grocery store can make the biggest difference.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-green-700 mb-8">Our Mission & Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Store className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Freshness Guaranteed</h3>
            <p className="text-gray-600">We source produce daily and maintain strict quality controls so you get the freshest items.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <HeartHandshake className="text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community First</h3>
            <p className="text-gray-600">5% of our profits go back to local food banks and youth nutrition programs.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Partnerships</h3>
            <p className="text-gray-600">Over 60% of our products come from farmers and producers within 50 miles.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-green-700 mb-8">Meet Our Family</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Team Member 1 */}
          <div className="text-center">
            <div className="bg-gray-200 h-48 rounded-full mx-auto mb-4 flex items-center justify-center w-48">
              <span className="text-gray-500">[Team Photo]</span>
            </div>
            <h3 className="font-semibold text-lg">Sarah K.</h3>
            <p className="text-gray-500">Founder & CEO</p>
          </div>
          {/* Add more team members similarly */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Experience the GroceryStore Difference</h2>
        <p className="max-w-2xl mx-auto mb-6">Join thousands of happy customers who shop with confidence knowing they're supporting local businesses.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#" className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
            Visit Our Store
          </a>
          <a href="#" className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition">
            Contact Us
          </a>
        </div>
      </section>

      {/* Contact Info */}
      <section className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Phone className="text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Call Us</h3>
            <p className="text-gray-600">(123) 456-7890</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <Mail className="text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold">Email Us</h3>
            <p className="text-gray-600">hello@grocerystore.com</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <MapPin className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Visit Us</h3>
            <p className="text-gray-600">123 Market St, Your City</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;