import type { CategoryItem } from "@/util/types";
import { CategoryCard } from "./CategoryCard";

// meat and fish part
import fish1 from '../../assets/home/category/fish/img1.jpeg'
import fish2 from '../../assets/home/category/fish/img2.jpeg'
// bakery
import bakery1 from '../../assets/home/category/bakery/img1.jpeg'
import bakery2 from '../../assets/home/category/bakery/img2.jpeg'
import bakery3 from '../../assets/home/category/bakery/img3.jpeg'
// bevarages
import bev1 from '../../assets/home/category/bevarages/img1.jpeg'
import bev2 from '../../assets/home/category/bevarages/img2.jpeg'
// vegetables




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
        fish1,
        fish2,
      ]
    },
    {
      name: "Bakery",
      images: [
        bakery1,
        bakery2,
        bakery3,
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
        bev1,
        bev2
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