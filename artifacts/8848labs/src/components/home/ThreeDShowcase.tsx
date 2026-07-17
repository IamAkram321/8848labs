import { Suspense, lazy, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { isWebGLAvailable } from '@/lib/webgl';

const ShowcaseScene = lazy(() => import('../three/ShowcaseScene'));

function ShowcaseFallback() {
  return (
    <div className="w-full h-full bg-foreground flex items-center justify-center">
      <div className="grid grid-cols-8 gap-2 opacity-10 rotate-12 scale-150">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 border border-primary/60 rounded-sm"
            style={{ opacity: ((i * 37 + 13) % 100) / 100 * 0.8 + 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

export function ThreeDShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState<boolean | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    setWebglReady(isWebGLAvailable());
  }, []);

  return (
    <section ref={containerRef} className="h-[120vh] bg-foreground relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        {webglReady === false ? (
          <ShowcaseFallback />
        ) : webglReady === true ? (
          <Suspense fallback={<div className="w-full h-full bg-foreground" />}>
            <ShowcaseScene />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-foreground" />
        )}
      </div>

      <motion.div
        style={{ y, opacity }}
        className="z-10 text-center pointer-events-none px-6"
      >
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-background mb-6 drop-shadow-lg">
          Designed digitally. <br />
          Built physically.
        </h2>
        <p className="text-background/70 max-w-xl mx-auto text-lg uppercase tracking-widest font-medium">
          Layer by layer perfection
        </p>
      </motion.div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-0" />
    </section>
  );
}
