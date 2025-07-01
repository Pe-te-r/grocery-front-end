import { ShoppingBasket, Truck, ShieldCheck } from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureItem) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const FeaturesSection = () => {
  const features: FeatureItem[] = [
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
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
          Why Choose GroceryStore?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};