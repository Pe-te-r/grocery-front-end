import type { CategoryItem } from "@/util/types";
import { CategoryCard } from "./CategoryCard";



export const CategorySection = () => {
  const categories: CategoryItem[] = [
    {
      name: "Fruits & Vegetables",
      images: [
        "/images/fruits-veg1.jpg",
        "/images/fruits-veg2.jpg",
        "/images/fruits-veg3.jpg"
      ]
    },
    {
      name: "Dairy & Eggs",
      images: [
        "/images/dairy1.jpg",
        "/images/dairy2.jpg"
      ]
    },
    // Add more categories with multiple images
    {
      name: "Meat & Fish",
      images: [
        "/images/meat1.jpg",
        "/images/meat2.jpg",
        "/images/meat3.jpg"
      ]
    },
    {
      name: "Bakery",
      images: [
        "/images/bakery1.jpg",
        "/images/bakery2.jpg"
      ]
    },
    {
      name: "Pantry Staples",
      images: [
        "/images/pantry1.jpg",
        "/images/pantry2.jpg"
      ]
    },
    {
      name: "Beverages",
      images: [
        "/images/beverages1.jpg",
        "/images/beverages2.jpg"
      ]
    },
    {
      name: "Snacks",
      images: [
        "/images/snacks1.jpg",
        "/images/snacks2.jpg"
      ]
    },
    {
      name: "Household",
      images: [
        "/images/household1.jpg",
        "/images/household2.jpg"
      ]
    }
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