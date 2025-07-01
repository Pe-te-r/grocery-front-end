import { createFileRoute } from '@tanstack/react-router';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CategorySection } from '@/components/home/CategorySection';
import { CtaSection } from '@/components/home/CtaSection';
import HeroSection from '@/components/home/HeroSection';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CategorySection />
      <CtaSection />
    </div>
  );
}