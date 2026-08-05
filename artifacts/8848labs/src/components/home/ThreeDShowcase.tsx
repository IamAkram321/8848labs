import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { isWebGLAvailable } from "@/lib/webgl";

const ShowcaseScene = lazy(() => import("../three/ShowcaseScene"));

function ShowcaseFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-amber-500/20 animate-ping absolute" />
        <div className="w-32 h-32 rounded-full border border-amber-500/40 animate-pulse" />
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
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const leftY = useTransform(smoothProgress, [0, 1], [50, -50]);
  const rightY = useTransform(smoothProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 0.08, 0.08, 0]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#050505] min-h-screen py-20 flex items-center justify-center selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* Background Ambient Glow & Watermark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-amber-600/10 via-amber-900/5 to-transparent rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />

        <motion.h1
          style={{ opacity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-serif font-light tracking-[0.15em] text-amber-100/10 whitespace-nowrap select-none pointer-events-none z-0"
        >
          DIGITAL
        </motion.h1>
      </div>

      {/* Main Container - Extended Width */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 lg:px-12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[320px_1fr_320px] gap-8 lg:gap-12 items-center">
          
          {/* Left Column Cards */}
          <motion.div style={{ y: leftY }} className="space-y-6 z-20 max-w-sm mx-auto lg:max-w-none w-full">
            <FeatureCard
              number="01"
              title="Precision"
              description="Industrial-grade manufacturing with exceptional dimensional accuracy and repeatability."
            />
            <FeatureCard
              number="02"
              title="Engineering"
              description="Every layer is calculated, optimized, and manufactured with exacting standards."
            />
          </motion.div>

          {/* Center 3D Model Area */}
          <div className="relative h-[450px] sm:h-[550px] lg:h-[650px] w-full flex items-center justify-center pointer-events-auto">
            <div className="absolute inset-16 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full h-full relative z-10">
              {webglReady === false ? (
                <div className="w-full h-full flex items-center justify-center text-neutral-500 font-light text-sm tracking-wider uppercase border border-neutral-800/80 rounded-2xl bg-neutral-900/20">
                  WebGL Unsupported
                </div>
              ) : (
                <Suspense fallback={<ShowcaseFallback />}>
                  <ShowcaseScene scrollProgress={smoothProgress} />
                </Suspense>
              )}
            </div>
          </div>

          {/* Right Column Cards */}
          <motion.div style={{ y: rightY }} className="space-y-6 z-20 max-w-sm mx-auto lg:max-w-none w-full">
            <FeatureCard
              number="03"
              title="Innovation"
              description="Pushing boundaries with cutting-edge additive techniques and advanced materials."
            />
            <FeatureCard
              number="04"
              title="Scale"
              description="Seamless transition from rapid functional prototypes to full production runs."
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
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-6 rounded-2xl border border-white/[0.06] bg-neutral-950/40 backdrop-blur-md transition-all duration-500 hover:border-amber-500/40 hover:bg-neutral-900/50 shadow-2xl">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-serif text-3xl lg:text-4xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 bg-clip-text text-transparent font-light tracking-tight">
          {number}
        </span>
        <div className="h-2 w-2 rounded-full bg-amber-500/40 group-hover:bg-amber-400 group-hover:shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-300" />
      </div>
      <h3 className="text-lg font-serif tracking-wide text-neutral-100 group-hover:text-amber-200 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-xs lg:text-sm leading-relaxed text-neutral-400 group-hover:text-neutral-300 transition-colors">
        {description}
      </p>
    </div>
  );
}