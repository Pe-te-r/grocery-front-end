import type { CategoryItem } from "@/util/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const CategoryCard = ({ name, images }: CategoryItem) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate images when hovered
  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <div
      className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-48 relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Image navigation dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
        <h3 className="text-white font-bold text-lg">{name}</h3>
      </div>
    </div>
  );
};