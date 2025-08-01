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
import veg1 from '../../assets/home/category/vegetables/img1.jpeg'
import veg2 from '../../assets/home/category/vegetables/img2.jpeg'
// dairy
import dairy1 from '../../assets/home/category/dairy/img1.jpeg'
import dairy2 from '../../assets/home/category/dairy/img2.jpeg'

// Snacks
import snacks1 from '../../assets/home/category/snacks/img1.jpeg'
import snacks2 from '../../assets/home/category/snacks/img2.jpeg'
// Household
import { Link } from "@tanstack/react-router";



export const CategorySection = () => {
  const categories: CategoryItem[] = [
    {
      name: "Fruits & Vegetables",
      images: [
        veg1,
        veg2
      ]
    },
    {
      name: "Dairy & Eggs",
      images: [
        dairy1,
        dairy2
      ]
    },
    // Add more categories with multiple images
    {
      name: "Meat & Seafood",
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
      name: "Beverages",
      images: [
        bev1,
        bev2
      ]
    },
    {
      name: "Snacks",
      images: [
        snacks1,
        snacks2
      ]
    },
  ];

  return (
    <section className="py-16 px-4 bg-green-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link to='/products' search={{ category: category.name }} className="group" key={index}>
            <CategoryCard key={index} {...category} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};