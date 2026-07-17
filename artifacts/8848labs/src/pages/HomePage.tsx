import { HeroSection } from '@/components/home/HeroSection';
import { BrandStatement } from '@/components/home/BrandStatement';
import { WhatWeCreate } from '@/components/home/WhatWeCreate';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ThreeDShowcase } from '@/components/home/ThreeDShowcase';
import { WorkshopGallery } from '@/components/home/WorkshopGallery';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { StatsSection } from '@/components/home/StatsSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-background">
      {/* Global Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-100"
        style={{ scaleX }}
      />
      
      <HeroSection />
      <BrandStatement />
      <WhatWeCreate />
      <ThreeDShowcase />
      <FeaturedProjects />
      <ProcessTimeline />
      <WorkshopGallery />
      <StatsSection />
      <FinalCTA />
    </div>
  );
}
