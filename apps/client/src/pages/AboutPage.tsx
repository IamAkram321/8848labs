import { motion } from "framer-motion";
import { Compass, ShieldCheck, Sparkles, Mountain, Cpu, UserCheck, Rocket, HeartHandshake, Layers } from "lucide-react";

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
      "We let the intrinsic qualities of the additive manufacturing process shine when it enhances aesthetics, refining it to perfection where seamlessness is required.",
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
    <div className="relative pt-32 lg:pt-36 pb-24 bg-[#F7F6F2] text-neutral-900 min-h-screen selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Background Architectural Blueprint Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
        <div className="absolute -right-20 top-1/6 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/10 to-transparent blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-5xl">
        
        {/* 1. HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 pb-12 border-b border-neutral-300/60">
          
          {/* Main Title & Brand Identifier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/20 font-mono text-[11px] uppercase tracking-widest text-amber-900">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>01 / Studio Manifesto</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-neutral-900 tracking-tight leading-none">
              Our Story
            </h1>

            {/* Prominent Pathak and Sons Logo Banner */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white/90 border border-neutral-300/80 shadow-xs backdrop-blur-md"
            >
              <img
                src="/images/pathak-and-sons.png"
                alt="Pathak and Sons Logo"
                className="h-9 md:h-11 w-auto object-contain shrink-0"
              />
              <div className="h-7 w-px bg-neutral-200" />
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-700">
                  A Venture of Pathak and Sons
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Dark Hero Quote Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="lg:col-span-5 relative p-8 rounded-2xl bg-neutral-950 text-white shadow-xl overflow-hidden min-h-[200px] flex items-center transition-all duration-300"
          >
            <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-10 pointer-events-none">
              <Cpu className="w-36 h-36 text-amber-400" />
            </div>
            <p className="font-serif text-lg sm:text-xl text-neutral-200 italic leading-relaxed relative z-10">
              "At 8848 Labs, we don’t just print objects—we engineer possibilities."
            </p>
          </motion.div>
        </div>

        {/* 2. NARRATIVE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start">
          
          {/* Who We Are */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/20 font-mono text-[11px] text-amber-900 tracking-wider uppercase font-medium">
                <Mountain className="w-3.5 h-3.5 text-amber-700" />
                Who We Are
              </span>
            </div>

            <p className="text-base sm:text-lg text-neutral-800 font-normal leading-relaxed">
              Named after the elevation of Mount Everest, <strong className="font-semibold text-neutral-950">8848 Labs</strong> is a Nepal-based design and manufacturing studio specializing in high-quality 3D printing and end-to-end product development.
            </p>

            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              We combine engineering expertise with modern additive manufacturing to transform abstract ideas into functional prototypes, personalized products, and precision-crafted parts for individuals, creators, startups, and enterprises.
            </p>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -3 }}
            className="lg:col-span-5 p-7 rounded-2xl border border-amber-900/15 bg-amber-500/5 backdrop-blur-xs space-y-3 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-600/20 font-mono text-[10px] text-amber-900 tracking-wider uppercase font-medium">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                Our Mission
              </span>
            </div>
            <h2 className="font-serif text-xl font-normal text-neutral-900 leading-snug">
              Empowering Innovators One Layer at a Time
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Our mission is to empower creators, businesses, students, and engineers by delivering premium-quality 3D printing, thoughtful CAD product design, and dependable manufacturing services with absolute precision.
            </p>
          </motion.div>
        </div>

        {/* 3. FEATURE BLOCK: Why We Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.005 }}
          className="p-8 sm:p-10 rounded-2xl bg-neutral-900 text-white shadow-xl mb-16 relative overflow-hidden transition-all duration-300"
        >
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">Origin</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">Why We Started</h2>
            <p className="text-neutral-300 font-light text-sm sm:text-base leading-relaxed">
              We founded 8848 Labs with a singular vision: to make advanced 3D printing accessible, reliable, and affordable in Nepal. We recognized a growing need for rapid prototyping and custom manufacturing paired with technical engineering support and uncompromising quality.
            </p>
          </div>
        </motion.div>

        {/* 4. LEADERSHIP & CORE ETHOS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Founder Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -3 }}
            className="lg:col-span-5 p-7 rounded-2xl border border-neutral-300/80 bg-white/80 backdrop-blur-md shadow-2xs space-y-3 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-600/20 font-mono text-[10px] text-amber-900 tracking-wider uppercase font-medium">
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                Leadership
              </span>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-normal text-neutral-900">
                Himanshu Mohan Mishra
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-semibold mt-0.5">
                Founder & Mechanical Engineer
              </p>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed pt-2">
              A Mechanical Engineer with a lifelong passion for design, engineering, and digital manufacturing. Driven by the possibilities of 3D printing, Himanshu established 8848 Labs to make modern additive manufacturing accessible across Nepal.
            </p>
          </motion.div>

          {/* Core Values / Ethos - Rounded Horizontal Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-600/20 font-mono text-[10px] text-amber-900 tracking-wider uppercase font-medium">
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                Guiding Principles
              </span>
            </div>
            <h2 className="font-serif text-2xl font-normal text-neutral-900">Our Core Ethos</h2>

            {/* Horizontal Rounded Ethos Cards */}
            <div className="space-y-3 pt-1">
              {values.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className="p-5 sm:p-6 rounded-2xl border border-neutral-300/80 bg-white/90 shadow-2xs hover:border-amber-500/40 hover:shadow-md transition-all duration-300 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-neutral-900">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
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