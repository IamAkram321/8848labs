import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function BrandStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  const words = "We turn digital ideas into physical objects.".split(" ");

  return (
    <section ref={containerRef} className="py-32 md:py-48 bg-card border-y border-border relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-gradient-radial from-primary/5 to-transparent opacity-50 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] text-foreground text-center">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);
            const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
            const y = useTransform(scrollYProgress, [start, end], [20, 0]);
            
            return (
              <motion.span 
                key={i} 
                className="inline-block mr-3 md:mr-5 mb-2"
                style={{ opacity, y }}
              >
                {word === "ideas" || word === "objects." ? (
                  <span className="italic text-primary/90">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            );
          })}
        </h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 md:mt-24 text-center"
        >
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Every object begins as a thought. At 8848LABS, we treat 3D printing not as a novelty, but as a precision craft. Whether it's an architectural model, a functional prototype, or an artistic sculpture, we obsess over the details.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
