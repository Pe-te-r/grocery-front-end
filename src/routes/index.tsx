import { createFileRoute } from '@tanstack/react-router';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CategorySection } from '@/components/home/CategorySection';
import { CtaSection } from '@/components/home/CtaSection';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >      <HeroSection />
      <FeaturesSection />
      <CategorySection />
      <CtaSection />
    </motion.div>
  );
}