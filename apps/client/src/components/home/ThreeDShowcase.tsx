import { Suspense, lazy, useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { isWebGLAvailable } from "@/lib/webgl";
import { Sparkles, Box, Compass, Activity } from "lucide-react";

const ShowcaseScene = lazy(() => import("../three/ShowcaseScene"));

function ShowcaseFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-amber-500/20 animate-ping absolute" />
        <div className="w-32 h-32 rounded-full border border-amber-500/40 animate-pulse" />
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/60 flex items-center justify-center backdrop-blur-md">
          <Box className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>
    </div>
  );
}

export function ThreeDShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglReady(isWebGLAvailable());
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // Parallax shifts for cards
  const leftY = useTransform(smoothProgress, [0, 1], [60, -60]);
  const rightY = useTransform(smoothProgress, [0, 1], [-60, 60]);
  const opacity = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0, 0.12, 0.12, 0]);

  // Dynamic watermark text based on scroll position
  const activeWordIndex = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [0, 1, 2, 3]);
  const watermarkWords = ["PRECISION", "ENGINEERING", "INNOVATION", "SCALE"];

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#040404] min-h-screen py-24 sm:py-32 flex items-center justify-center selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* Background Lighting & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-amber-600/15 via-orange-950/10 to-transparent rounded-full blur-[180px]" />
        
        {/* Fine Architectural Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Dynamic Watermark */}
        <motion.h1
          style={{ opacity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-light tracking-[0.2em] text-amber-100/10 whitespace-nowrap select-none pointer-events-none z-0 uppercase"
        >
          {watermarkWords[0]}
        </motion.h1>
      </div>

      <div className="relative z-10 w-full max-w-[1440px] px-6 lg:px-12 mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest font-semibold">
              3D Interactive Viewport
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-100 tracking-tight font-light">
            Architectural <span className="italic text-amber-400/90 font-normal">Geometry</span> & Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[340px_1fr_340px] gap-8 lg:gap-12 items-center">
          
          {/* Left Column Cards */}
          <motion.div style={{ y: leftY }} className="space-y-6 z-20 max-w-md mx-auto lg:max-w-none w-full">
            <FeatureCard
              number="01"
              title="Precision SLA"
              tag="TOLERANCE 0.05MM"
              description="Industrial additive manufacturing delivering micron-level dimensional fidelity across high-complexity builds."
            />
            <FeatureCard
              number="02"
              title="Parametric Design"
              tag="GENERATIVE MESH"
              description="Algorithmic spatial modeling optimized for maximum structural integrity and weight efficiency."
            />
          </motion.div>

          {/* Center 3D Interactive Stage */}
          <div className="relative h-[480px] sm:h-[580px] lg:h-[680px] w-full flex items-center justify-center group">
            
            {/* Viewport Reticle Framing */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-neutral-950/30 backdrop-blur-3xl overflow-hidden shadow-2xl">
              
              {/* Corner Reticle Marks */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-amber-500/50" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-amber-500/50" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-amber-500/50" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-amber-500/50" />

              {/* Status Header Bar */}
              <div className="absolute top-5 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
                    WebGL Renderer • 60 FPS
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-amber-400/80 uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>360° Orbit Mode</span>
                </div>
              </div>

              {/* Center Glow Effect */}
              <div className="absolute inset-12 bg-amber-600/10 rounded-full blur-[110px] pointer-events-none" />

              {/* 3D Scene Viewport */}
              <div className="w-full h-full relative z-10">
                {webglReady === false ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 font-mono text-xs tracking-widest uppercase gap-3">
                    <Activity className="w-6 h-6 text-amber-500/50" />
                    <span>WebGL Acceleration Unavailable</span>
                  </div>
                ) : (
                  <Suspense fallback={<ShowcaseFallback />}>
                    <ShowcaseScene scrollProgress={smoothProgress} />
                  </Suspense>
                )}
              </div>

              {/* Viewport Bottom Hint */}
              <div className="absolute bottom-5 inset-x-0 z-20 flex justify-center pointer-events-none">
                <span className="px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                  Drag to rotate • Scroll to expand
                </span>
              </div>

            </div>
          </div>

          {/* Right Column Cards */}
          <motion.div style={{ y: rightY }} className="space-y-6 z-20 max-w-md mx-auto lg:max-w-none w-full">
            <FeatureCard
              number="03"
              title="Material Matrix"
              tag="POLYMER / RESIN"
              description="High-temp resins, carbon composite filaments, and optical clear polymers engineered for harsh testing."
            />
            <FeatureCard
              number="04"
              title="Production Scale"
              tag="RAPID DEPLOYMENT"
              description="From single functional prototypes to low-volume serial production runs with full quality assurance."
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  number,
  title,
  tag,
  description,
}: {
  number: string;
  title: string;
  tag: string;
  description: string;
}) {
  return (
    <div className="group relative p-7 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-xl transition-all duration-500 hover:border-amber-500/50 hover:bg-neutral-900/70 shadow-2xl overflow-hidden">
      
      {/* Top Accent Light Bar on Hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-serif text-3xl lg:text-4xl bg-gradient-to-br from-amber-100 via-amber-300 to-amber-600 bg-clip-text text-transparent font-light tracking-tight">
          {number}
        </span>
        <span className="font-mono text-[9px] px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 uppercase tracking-widest font-medium">
          {tag}
        </span>
      </div>

      {/* Card Body */}
      <h3 className="text-lg font-serif tracking-wide text-neutral-100 group-hover:text-amber-200 transition-colors duration-300">
        {title}
      </h3>
      <p className="mt-2.5 text-xs lg:text-sm leading-relaxed text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 font-light">
        {description}
      </p>

      {/* Corner Decorative Dot */}
      <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-amber-500/20 group-hover:bg-amber-400 group-hover:shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-300" />
    </div>
  );
}