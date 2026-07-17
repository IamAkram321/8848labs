import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

const steps = [
  { num: "01", title: "Consultation", desc: "Share your idea, sketches, or 3D files. We discuss materials, tolerances, and finishes." },
  { num: "02", title: "Engineering", desc: "Our team optimizes your geometry for additive manufacturing to ensure structural integrity." },
  { num: "03", title: "Prototyping", desc: "A rapid test print confirms fit, scale, and function before final production." },
  { num: "04", title: "Production", desc: "High-resolution manufacturing using industrial-grade polymers and specialized filaments." },
  { num: "05", title: "Finishing", desc: "Post-processing, sanding, painting, and quality control before delivery." }
];

export function ProcessTimeline() {
  return (
    <section className="py-24 md:py-32 bg-card border-y border-border overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <SectionHeading 
          label="03 / Methodology"
          title="The Process"
          align="center"
        />
        
        <div className="relative mt-20 max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border hidden md:block transform -translate-y-1/2">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-primary origin-left"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-4 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="flex flex-col items-center text-center flex-1"
              >
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center font-serif text-xl mb-6 relative group hover:border-primary hover:text-primary transition-colors">
                  {step.num}
                  <div className="absolute inset-1 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-serif text-xl mb-3">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
