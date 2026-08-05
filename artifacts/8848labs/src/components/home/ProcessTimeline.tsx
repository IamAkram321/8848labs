import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";
import { FaCheckCircle, FaMicrochip, FaCogs, FaCube, FaLayerGroup, FaMagic } from "react-icons/fa";

const steps = [
  {
    num: "01",
    title: "Consultation",
    tagline: "Vision & Material Analysis",
    desc: "Share your initial sketches, CAD files, or reference images. We evaluate geometric feasibility, stress requirements, and material selection (PLA, PETG, TPU, SLA Resin).",
    icon: FaCube,
    specs: ["File Formats: .STL, .STEP, .OBJ", "Consultation: 1-on-1 Studio Sync", "Tolerance Target: Custom"],
    badge: "Discovery Stage",
  },
  {
    num: "02",
    title: "Engineering",
    tagline: "Geometry & DfAM Optimization",
    desc: "Our engineers optimize your model specifically for additive manufacturing—adjusting wall thicknesses, lattice infills, and support structures to maximize strength-to-weight ratio.",
    icon: FaCogs,
    specs: ["Design for Additive Mfg", "Lattice & Infill Tuning", "FEA Structural Analysis"],
    badge: "Optimization",
  },
  {
    num: "03",
    title: "Prototyping",
    tagline: "Rapid Physical Verification",
    desc: "A rapid test print confirms mechanical fit, scale, and tactile ergonomic response before committing to batch runs.",
    icon: FaMicrochip,
    specs: ["Speed: 24-48 Hours", "Layer Height: 0.12mm - 0.2mm", "Fit Test Validation"],
    badge: "Validation",
  },
  {
    num: "04",
    title: "Production",
    tagline: "Industrial Additive Execution",
    desc: "Industrial multi-axis printing executed with specialized engineering filaments, continuous temperature management, and calibrated extrusion.",
    icon: FaLayerGroup,
    specs: ["Industrial Polymer Farm", "High Precision Extrusion", "Batch Consistency"],
    badge: "Manufacturing",
  },
  {
    num: "05",
    title: "Finishing",
    tagline: "Craftsmanship & Inspection",
    desc: "Post-processing treatment including support removal, vapor smoothing, manual sanding, priming, custom paint finishes, and quality control.",
    icon: FaMagic,
    specs: ["Vapor & Hand Smoothing", "Custom Paint & Anodizing", "Final QC Certification"],
    badge: "Refinement",
  },
];

export function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const current = steps[activeStep];
  const IconComponent = current.icon;

  return (
    <section className="relative py-28 md:py-36 bg-[#FAFAFA] text-neutral-900 border-y border-neutral-200/80 overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Dynamic Ambient Glow behind active card */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: (activeStep - 2) * 120,
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full bg-gradient-to-r from-amber-300/30 via-orange-200/40 to-transparent blur-[130px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <SectionHeading
          label="03 / Methodology"
          title="The Process"
          align="center"
        />

        {/* STEP SELECTION NODES BAR */}
        <div className="mt-16 relative">
          
          {/* Connector Line */}
          <div className="absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 h-0.5 bg-neutral-200 hidden md:block z-0" />

          <div className="grid grid-cols-5 gap-2 md:gap-4 relative z-10">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className="group flex flex-col items-center focus:outline-none"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-mono text-xs md:text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-neutral-900 text-amber-300 shadow-xl shadow-amber-900/10 border border-neutral-800"
                        : "bg-white text-neutral-500 border border-neutral-200/80 hover:border-amber-500/50 hover:text-neutral-900 shadow-sm"
                    }`}
                  >
                    {step.num}

                    {/* Active pulse indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-2 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      />
                    )}
                  </motion.div>

                  <span className={`mt-3 text-[11px] md:text-xs font-medium uppercase tracking-wider transition-colors hidden sm:block ${
                    isActive ? "text-neutral-900 font-semibold" : "text-neutral-400 group-hover:text-neutral-600"
                  }`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEATURED INTERACTIVE HERO STAGE */}
        <div className="mt-12 md:mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-xl p-8 md:p-12 shadow-xl shadow-neutral-200/50 overflow-hidden"
            >
              {/* Background Number Watermark */}
              <span className="absolute -right-4 -bottom-10 font-serif text-[180px] md:text-[240px] text-neutral-100 font-bold select-none pointer-events-none z-0">
                {current.num}
              </span>

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center">
                
                {/* Left Overview Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 font-mono text-xs tracking-wider uppercase">
                    <IconComponent className="text-amber-600 text-sm" />
                    <span>{current.badge}</span>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                      Phase {current.num}
                    </span>
                    <h3 className="font-serif text-3xl md:text-5xl text-neutral-900 tracking-tight font-normal">
                      {current.title}
                    </h3>
                    <p className="font-serif italic text-amber-700 text-lg md:text-xl mt-1">
                      {current.tagline}
                    </p>
                  </div>

                  <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-light max-w-xl">
                    {current.desc}
                  </p>
                </div>

                {/* Right Technical Specs Box */}
                <div className="lg:col-span-5 bg-neutral-900 text-neutral-100 rounded-2xl p-6 md:p-8 space-y-5 border border-neutral-800 shadow-xl">
                  <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                    Technical Deliverables
                  </h4>

                  <div className="space-y-4">
                    {current.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-neutral-300 font-light border-b border-neutral-800/80 pb-3 last:border-none last:pb-0">
                        <FaCheckCircle className="text-amber-400/80 flex-shrink-0 text-xs" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-neutral-500 font-mono flex justify-between items-center border-t border-neutral-800">
                    <span>8848 Standard</span>
                    <span className="text-neutral-400">Step {activeStep + 1} of 5</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}