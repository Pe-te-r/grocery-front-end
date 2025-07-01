interface CategoryItem {
  name: string;
  image: string;
}

const CategoryCard = ({ name, image }: CategoryItem) => (
  <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
    <img
      src={image}
      alt={name}
      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
      <h3 className="text-white font-bold text-lg">{name}</h3>
    </div>
  </div>
);

export const CategorySection = () => {
  const categories: CategoryItem[] = [
    { name: "Fruits & Vegetables", image: "/images/fruits-veg.jpg" },
    { name: "Dairy & Eggs", image: "/images/dairy.jpg" },
    { name: "Meat & Fish", image: "/images/meat.jpg" },
    { name: "Bakery", image: "/images/bakery.jpg" },
    { name: "Pantry Staples", image: "/images/pantry.jpg" },
    { name: "Beverages", image: "/images/beverages.jpg" },
    { name: "Snacks", image: "/images/snacks.jpg" },
    { name: "Household", image: "/images/household.jpg" }
  ];

  return (
    <section className="py-16 px-4 bg-green-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};