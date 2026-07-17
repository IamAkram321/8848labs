import { Suspense, lazy, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { isWebGLAvailable } from '@/lib/webgl';

const HeroScene = lazy(() => import('../three/HeroScene'));

function HeroSceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-72 h-72 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-primary/10 animate-[ping_4s_ease-in-out_infinite]" />
        <div className="absolute inset-8 rounded-full border border-primary/20 animate-[ping_3.5s_ease-in-out_0.5s_infinite]" />
        <div className="absolute inset-16 rounded-full border border-primary/30 animate-[ping_3s_ease-in-out_1s_infinite]" />
        <div className="absolute inset-24 rounded-full border border-primary/40 animate-[ping_2.5s_ease-in-out_1.5s_infinite]" />
        <div className="w-20 h-20 rounded-full border border-primary/60 bg-primary/5 backdrop-blur-sm flex items-center justify-center">
          <span className="font-serif text-primary/80 text-xl italic">3D</span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [webglReady, setWebglReady] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglReady(isWebGLAvailable());
  }, []);

  return (
    <section className="relative w-full h-dvh min-h-150 flex items-center bg-background overflow-hidden">
      <div className="container mx-auto px-6 h-full flex flex-col md:flex-row relative z-10">

        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center pt-20 md:pt-0 z-20">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] text-foreground tracking-tight mb-8"
          >
            Ideas. <br />
            <span className="italic text-muted-foreground/80">Made</span> <br />
            Tangible.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-md text-muted-foreground leading-relaxed mb-10 text-lg"
          >
            We turn digital concepts into physical objects with absolute precision. A premium 3D manufacturing studio bridging design and reality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/custom-studio" className="bg-foreground text-background px-8 py-4 uppercase tracking-widest text-xs hover:bg-primary transition-colors flex items-center justify-center gap-2 group">
              Start a Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/shop" className="border border-border text-foreground px-8 py-4 uppercase tracking-widest text-xs hover:bg-muted transition-colors flex items-center justify-center">
              Explore Shop
            </Link>
          </motion.div>
        </div>

        {/* Right 3D Scene */}
        <div className="flex-1 relative h-[50vh] md:h-full w-full -mr-6 md:-mr-20 mt-10 md:mt-0 cursor-grab active:cursor-grabbing hidden md:block">
          {webglReady === false ? (
            <HeroSceneFallback />
          ) : webglReady === true ? (
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 border-t-2 border-primary rounded-full animate-spin opacity-20" />
              </div>
            }>
              <HeroScene />
            </Suspense>
          ) : null}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-6 md:left-auto md:right-10 flex flex-col items-center gap-4 z-20 md:flex"
      >
        <span className="text-[10px] uppercase tracking-widest rotate-90 origin-bottom transform translate-y-8 text-muted-foreground">Scroll</span>
        <div className="w-px h-16 bg-linear-to-b from-transparent via-border to-transparent">
          <motion.div
            animate={{ y: [0, 64] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-px h-4 bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
