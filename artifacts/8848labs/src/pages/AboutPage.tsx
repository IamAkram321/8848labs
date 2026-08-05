import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Compass, ShieldCheck, Sparkles, Mountain, Cpu } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Precision Over Speed",
    description:
      "We don't optimize for the fastest print times; we optimize for structural integrity, dimensional accuracy, and flawless surface finishes.",
  },
  {
    icon: Sparkles,
    title: "Material Honesty",
    description:
      "We let the intrinsic qualities of the additive manufacturing process shine when it enhances the aesthetic, and refine it to perfection when seamlessness is required.",
  },
  {
    icon: Mountain,
    title: "Local Craft, Global Vision",
    description:
      "Proudly designed, engineered, and manufactured entirely in our Kathmandu facility, delivering world-class output for local and international innovators.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative pt-32 pb-28 md:pb-36 bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Ambient Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-5xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionHeading title="Our Story" label="01 / Studio Manifesto" align="center" />
        </div>

        {/* Hero Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative p-8 md:p-14 rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs text-center mb-16 overflow-hidden"
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
            <Cpu className="w-32 h-32 text-amber-900" />
          </div>

          <p className="font-serif text-2xl md:text-3xl text-neutral-800 font-normal italic leading-relaxed relative z-10">
            "We believe the bridge between a digital thought and a physical reality should be elegant, precise, and accessible."
          </p>
        </motion.div>

        {/* Narrative Section */}
        <div className="space-y-12 text-base md:text-lg font-light leading-relaxed text-neutral-600 max-w-3xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p>
              Named after the elevation of Mount Everest, <strong className="font-medium text-neutral-900">8848LABS</strong> was founded in Kathmandu with a singular mission: to elevate the standard of custom manufacturing in Nepal and beyond.
            </p>

            <p>
              We observed a wide divide between conceptual design and physical realization. Traditional industrial manufacturing requires massive scale and upfront tooling costs to be economical, while consumer-grade 3D printing often lacks the precision and material properties required for end-use engineering and luxury applications.
            </p>

            <p>
              Our studio operates at this intersection. We utilize industrial-grade additive manufacturing processes to create one-off pieces, small batch productions, and high-fidelity prototypes that rival injection-molded quality.
            </p>
          </motion.div>

          {/* Core Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="pt-8"
          >
            <div className="flex items-center gap-2 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono text-[10px] text-amber-800 tracking-wider uppercase">
                <Compass className="w-3 h-3 text-amber-600" />
                Guiding Principles
              </span>
            </div>

            <h3 className="font-serif text-3xl font-normal text-neutral-900 mb-8">
              Our Core Ethos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    className="p-6 rounded-2xl border border-neutral-200/90 bg-white/60 backdrop-blur-xs hover:border-amber-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 mb-4">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h4 className="font-mono text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}