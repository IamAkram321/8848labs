import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Compass, ShieldCheck, Sparkles, Mountain, Cpu, UserCheck, Rocket, HeartHandshake } from "lucide-react";

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
        <div className="absolute -right-20 top-1/4 w-162.5 h-162.5 rounded-full bg-linear-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-125 h-125 rounded-full bg-linear-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] bg-size-[36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-5xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <SectionHeading title="Our Story" label="01 / Studio Manifesto" align="center" />
        </div>

        {/* Venture Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-neutral-200 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-neutral-600">
              A Venture of Pathak and Sons
            </span>
          </div>
        </motion.div>

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
            "At 8848 Labs, we don’t just print objects—we engineer possibilities."
          </p>
        </motion.div>

        {/* Narrative Section */}
        <div className="space-y-16 text-base md:text-lg font-light leading-relaxed text-neutral-600 max-w-3xl mx-auto">
          
          {/* Who We Are */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono text-[10px] text-amber-800 tracking-wider uppercase">
                <Mountain className="w-3 h-3 text-amber-600" />
                Who We Are
              </span>
            </div>

            <p>
              Named after the elevation of Mount Everest, <strong className="font-medium text-neutral-900">8848 Labs</strong> is a Nepal-based design and manufacturing studio specializing in high-quality 3D printing and end-to-end product development.
            </p>

            <p>
              We combine engineering expertise with modern additive manufacturing to transform abstract ideas into functional prototypes, personalized products, and precision-crafted parts. From one-of-a-kind bespoke gifts to complex engineering solutions, we help individuals, creators, startups, and businesses bring their boldest concepts to life.
            </p>
          </motion.div>

          {/* Why We Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-neutral-900 text-white relative overflow-hidden shadow-xl"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-2xl text-white font-normal">Why We Started</h3>
              </div>
              <p className="text-neutral-300 font-light text-base leading-relaxed">
                We founded 8848 Labs with a clear, singular vision: to make advanced 3D printing accessible, reliable, and affordable in Nepal.
              </p>
              <p className="text-neutral-400 font-light text-base leading-relaxed">
                We recognized a growing need for rapid prototyping and custom manufacturing, paired with a distinct shortage of local options offering both technical engineering support and uncompromising quality. By blending creative design with rigorous engineering, we built a sanctuary where ideas quickly become tangible reality.
              </p>
            </div>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono text-[10px] text-amber-800 tracking-wider uppercase">
                <HeartHandshake className="w-3 h-3 text-amber-600" />
                Our Mission
              </span>
            </div>
            <h3 className="font-serif text-3xl font-normal text-neutral-900">
              Empowering Innovators One Layer at a Time
            </h3>
            <p className="text-neutral-600 font-light leading-relaxed">
              Our mission is to empower creators, businesses, students, and engineers by delivering premium-quality 3D printing, thoughtful CAD product design, and dependable manufacturing services. We strive for absolute precision and exceptional customer service—turning imagination into reality, layer by layer.
            </p>
          </motion.div>

          {/* Founder Section */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="p-8 md:p-10 rounded-3xl border border-neutral-200/90 bg-white/90 backdrop-blur-md shadow-sm relative"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono text-[10px] text-amber-800 tracking-wider uppercase">
                <UserCheck className="w-3 h-3 text-amber-600" />
                Leadership
              </span>
            </div>

            <h3 className="font-serif text-2xl font-normal text-neutral-900 mb-1">
              Himanshu Mohan Mishra
            </h3>
            <p className="font-mono text-xs uppercase tracking-widest text-amber-700 font-medium mb-6">
              Founder & Mechanical Engineer
            </p>

            <div className="space-y-4 text-sm md:text-base text-neutral-600 font-light leading-relaxed">
              <p>
                Himanshu Mohan Mishra is the founder of 8848 Labs and a Mechanical Engineer with a lifelong passion for design, engineering, and digital manufacturing.
              </p>
              <p>
                Driven by the limitless possibilities of 3D printing, he established 8848 Labs to make modern additive manufacturing accessible across Nepal. With a solid foundation in mechanical design, CAD modeling, and hands-on product development, Himanshu operates on the principle that every great idea deserves the chance to become a real physical product.
              </p>
            </div>
          </motion.div>

          {/* Core Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="pt-4"
          >
            <div className="flex items-center gap-2 mb-4">
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