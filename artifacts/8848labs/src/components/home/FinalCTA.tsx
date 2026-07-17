import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-32 md:py-48 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Topographic lines background effect using SVG */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 25 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M0 20 Q 25 -5 50 20 T 100 20" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M0 80 Q 25 55 50 80 T 100 80" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl mb-10 max-w-4xl"
        >
          Have an idea worth creating?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-primary-foreground/80 text-xl mb-12 max-w-2xl"
        >
          Upload your files for a quote, or describe your concept and let our engineers design it from scratch.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/custom-studio" className="bg-background text-foreground px-10 py-5 uppercase tracking-widest text-sm font-medium hover:bg-transparent hover:text-background border border-transparent hover:border-background transition-all duration-300 flex items-center gap-3 group">
            Open Custom Studio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
