import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Magnetic } from '@/components/ui/Magnetic';


const heroSlides = [
  {
    id: 1,
    url: '/images/laptop-stand.png', 
    title: 'Precision Additive Manufacturing',
    subtitle: 'Industrial SLA & FDM Engineering',
  },
  {
    id: 2,
    url: '/images/2.png', 
    title: 'Bespoke Architectural Models',
    subtitle: 'Intricate Scale Prototyping',
  },
  {
    id: 3,
    url: '/images/3.png', 
    title: 'Custom Functional Hardware',
    subtitle: 'High-Durability Polymer Prints',
  },
  {
    id: 4,
    url: '/images/4.png',
    title: 'Generative Design & Art',
    subtitle: 'Complex Geometric Sculptures',
  },
  {
    id: 5,
    url: '/images/5.png', 
    title: 'Product Engineering Stage',
    subtitle: 'From CAD Concept to Physical Artifact',
  },
];

// slide-show
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: '0%',
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
  }),
};

// Motion Variants
const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

const headlineItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

export function HeroSection() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentIndex = ((page % heroSlides.length) + heroSlides.length) % heroSlides.length;

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  // Auto-slide timer management
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        paginate(1);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, paginate]);

  const handleManualSelect = (index: number) => {
    const dir = index > currentIndex ? 1 : -1;
    setPage([index, dir]);
  };

  return (
    <section className="relative w-full h-dvh min-h-[720px] flex items-center bg-[#FAFAFA] text-neutral-900 overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Background Mesh Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-20 top-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/30 to-transparent blur-[140px]" />
        <div className="absolute right-0 bottom-10 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-amber-300/15 via-amber-100/20 to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 md:px-12 h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10 pt-20 lg:pt-0"
      >
        {/* Left Content Column */}
        <div className="flex-1 flex flex-col justify-center z-20 max-w-xl">

          {/* Headline */}
          <motion.h1
            variants={headlineItem}
            className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-neutral-900 tracking-tight mb-6"
          >
            Ideas. <br />
            <span className="italic font-normal text-amber-800/80">Made</span> <br />
            Tangible.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={heroItem}
            className="max-w-md text-neutral-600 leading-relaxed mb-8 text-base md:text-lg font-light"
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
                className="rounded-full border border-neutral-300/80 bg-white/60 backdrop-blur-md text-neutral-800 px-8 py-4 font-mono text-xs uppercase tracking-widest hover:border-amber-500/50 hover:bg-white hover:text-amber-900 shadow-xs transition-all duration-300 flex items-center justify-center"
              >
                Explore Shop
              </Link>
            </Magnetic>
          </motion.div>

        </div>

        {/* Right Carousel Column */}
        <motion.div
          variants={heroItem}
          className="flex-1 w-full max-w-2xl h-[380px] sm:h-[460px] lg:h-[520px] relative flex flex-col justify-center"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Main Card Frame */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-neutral-950 group">
            
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
                }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={heroSlides[currentIndex].url}
                  alt={heroSlides[currentIndex].title}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/20 to-transparent pointer-events-none z-10" />

            {/* Slide Details & Control */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300 font-semibold mb-1 block">
                  {heroSlides[currentIndex].subtitle}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal drop-shadow-sm">
                  {heroSlides[currentIndex].title}
                </h3>
              </div>

              {/* Pause / Play Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-300 shrink-0"
                title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>

            {/* Navigation Chevrons */}
            <div className="absolute inset-y-0 left-4 flex items-center z-20">
              <button
                onClick={() => paginate(-1)}
                className="w-10 h-10 rounded-full bg-neutral-900/40 hover:bg-neutral-900/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center z-20">
              <button
                onClick={() => paginate(1)}
                className="w-10 h-10 rounded-full bg-neutral-900/40 hover:bg-neutral-900/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Dot Indicators */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center gap-2">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleManualSelect(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-amber-700'
                      : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest font-medium">
              0{currentIndex + 1} / 0{heroSlides.length}
            </span>
          </div>

        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-6 md:left-12 hidden sm:flex items-center gap-3 z-20 pointer-events-none"
      >
        <div className="w-5 h-9 rounded-full border border-neutral-300 bg-white/50 backdrop-blur-xs p-1 flex justify-center shadow-xs">
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