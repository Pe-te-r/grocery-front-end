import { Link } from "@tanstack/react-router";

export const CtaSection = () => (
  <section className="py-16 px-4 bg-green-700 text-white">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">Ready to shop the easy way?</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Join thousands of happy customers enjoying convenient grocery shopping.
      </p>
      <Link to='/register' className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition">
        Get Started - It's Free
      </Link>
    </div>
  </section>
);