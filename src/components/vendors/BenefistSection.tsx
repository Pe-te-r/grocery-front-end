import {motion} from 'framer-motion'
export const BenefitsSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="mt-16"
  >
    <h3 className="text-2xl font-bold text-center text-green-800 mb-8">Why Become a GroceryStore Vendor?</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: "Reach More Customers",
          description: "Access thousands of customers looking for quality products every day.",
          icon: "👥"
        },
        {
          title: "Easy Management",
          description: "Our vendor dashboard makes it simple to manage your products and orders.",
          icon: "📊"
        },
        {
          title: "Fast Payments",
          description: "Get paid quickly with our reliable payment processing system.",
          icon: "💳"
        }
      ].map((benefit, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-md border border-green-100 text-center"
        >
          <div className="text-4xl mb-4">{benefit.icon}</div>
          <h4 className="text-lg font-semibold text-green-700 mb-2">{benefit.title}</h4>
          <p className="text-gray-600">{benefit.description}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);
