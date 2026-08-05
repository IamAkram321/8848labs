import { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';
import { isWebGLAvailable } from '@/lib/webgl';
import { Magnetic } from '@/components/ui/Magnetic';

const HeroScene = lazy(() => import('../three/HeroScene'));

function HeroSceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Animated orbital rings */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-[ping_4s_ease-in-out_infinite]" />
        <div className="absolute inset-8 rounded-full border border-amber-600/25 animate-[ping_3.5s_ease-in-out_0.5s_infinite]" />
        <div className="absolute inset-16 rounded-full border border-neutral-300/60 animate-[ping_3s_ease-in-out_1s_infinite]" />
        
        {/* Inner glass orb */}
        <div className="w-24 h-24 rounded-full border border-neutral-200 bg-white/60 backdrop-blur-md shadow-xl flex flex-col items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
          <span className="font-serif text-amber-900 text-xs tracking-widest font-semibold uppercase">3D Stage</span>
        </div>
      </div>
    </div>
  );
}

// Explicit Variants types applied to ensure TS strict tuple compatibility
const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
};

const headlineItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  },
};

export function HeroSection() {
  const [webglReady, setWebglReady] = useState<boolean | null>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);

  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const springX = useSpring(parallaxX, { stiffness: 50, damping: 25 });
  const springY = useSpring(parallaxY, { stiffness: 50, damping: 25 });

  useEffect(() => {
    setWebglReady(isWebGLAvailable());
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const relX = (e.clientX / innerWidth - 0.5) * 2;
      const relY = (e.clientY / innerHeight - 0.5) * 2;
      parallaxX.set(relX * -18);
      parallaxY.set(relY * -18);
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [parallaxX, parallaxY]);

  return (
    <section className="relative w-full h-dvh min-h-[680px] flex items-center bg-[#FAFAFA] text-neutral-900 overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Luxury Light Mesh & Radial Texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-20 top-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/30 to-transparent blur-[140px]" />
        <div className="absolute right-0 bottom-10 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-amber-300/15 via-amber-100/20 to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row relative z-10"
      >
        {/* Left Content Column */}
        <div className="flex-1 flex flex-col justify-center pt-24 md:pt-0 z-20 max-w-2xl">
          
          {/* Top Editorial Badge */}
          <motion.div variants={heroItem} className="mb-6 inline-flex items-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-neutral-200/90 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                01 / Digital to Physical
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={headlineItem}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] text-neutral-900 tracking-tight mb-8"
          >
            Ideas. <br />
            <span className="italic font-normal text-amber-800/80">Made</span> <br />
            Tangible.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={heroItem}
            className="max-w-md text-neutral-600 leading-relaxed mb-10 text-base md:text-lg font-light"
          >
            We turn high-concept digital designs into luxury physical artifacts with industrial-grade additive precision.
          </motion.p>

          {/* Call to Actions */}
          <motion.div variants={heroItem} className="flex flex-wrap items-center gap-4">
            <Magnetic strength={12}>
              <Link
                href="/custom-studio"
                className="relative overflow-hidden rounded-full bg-neutral-900 text-amber-300 px-8 py-4 font-mono text-xs uppercase tracking-widest shadow-xl shadow-neutral-900/10 hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-3 group border border-neutral-800"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Magnetic>

            <Magnetic strength={12}>
              <Link
                href="/shop"
                className="rounded-full border border-neutral-300/80 bg-white/60 backdrop-blur-md text-neutral-800 px-8 py-4 font-mono text-xs uppercase tracking-widest hover:border-amber-500/50 hover:bg-white hover:text-amber-900 shadow-sm transition-all duration-300 flex items-center justify-center"
              >
                Explore Shop
              </Link>
            </Magnetic>
          </motion.div>

        </div>

        {/* Right Interactive 3D Canvas Column */}
        <motion.div
          ref={sceneWrapRef}
          variants={heroItem}
          style={{ x: springX, y: springY }}
          className="flex-1 relative h-[45vh] md:h-full w-full -mr-6 md:-mr-12 mt-6 md:mt-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          {/* Grounding Warm Glow */}
          <div
            className="absolute inset-0 -z-10 opacity-70 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(224, 169, 109, 0.25), transparent 65%)',
            }}
          />

          {/* Desktop WebGL Canvas Container */}
          <div className="hidden md:block w-full h-full">
            {webglReady === false ? (
              <HeroSceneFallback />
            ) : webglReady === true ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 border-2 border-amber-500/20 border-t-amber-600 rounded-full animate-spin" />
                  </div>
                }
              >
                <HeroScene />
              </Suspense>
            ) : null}
          </div>

          {/* Mobile Fallback Centerpiece */}
          <div className="md:hidden w-full h-full">
            <HeroSceneFallback />
          </div>
        </motion.div>
      </motion.div>

      {/* Editorial Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-6 md:left-12 flex items-center gap-3 z-20 pointer-events-none"
      >
        <div className="w-5 h-9 rounded-full border border-neutral-300 bg-white/50 backdrop-blur-sm p-1 flex justify-center shadow-xs">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-amber-600"
          />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
          Scroll To Discover
        </span>
      </motion.div>

    </section>
  );
}