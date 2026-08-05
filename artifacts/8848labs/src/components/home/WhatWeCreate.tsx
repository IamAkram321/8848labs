import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Link } from 'wouter';
import { ArrowUpRight, Compass } from 'lucide-react';

const categories = [
  {
    tag: "01 / Spatial & Scale",
    title: "Architecture",
    description: "High-fidelity topological models, building massing, and complex urban spatial prototypes.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    link: "/collections/architecture",
    colSpan: "col-span-1 md:col-span-2",
    aspect: "aspect-[16/10] md:aspect-[21/9]"
  },
  {
    tag: "02 / Precision & Fit",
    title: "Engineering",
    description: "Functional prototypes, structural lattices, and high-tolerance technical polymer assemblies.",
    image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=2136&auto=format&fit=crop",
    link: "/collections/engineering",
    colSpan: "col-span-1",
    aspect: "aspect-[4/5]"
  },
  {
    tag: "03 / Tactile & Organic",
    title: "Home & Decor",
    description: "Parametric vessels, sculptural lighting, and bespoke interior artifacts designed for luxury spaces.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop",
    link: "/collections/decor",
    colSpan: "col-span-1",
    aspect: "aspect-[4/5]"
  }
];

export function WhatWeCreate() {
  return (
    <section className="relative py-28 md:py-36 bg-[#FAFAFA] text-neutral-900 border-y border-neutral-200/80 overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Ambient Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Sticky Editorial Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <SectionHeading 
              label="02 / Disciplines"
              title="What We Create"
            />
            
            <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-md">
              We specialize in bringing complex geometries to life across three distinct disciplines—from the tight mechanical tolerances required for engineering to the aesthetic perfection demanded by bespoke interiors.
            </p>

            <div className="pt-2">
              <Link 
                href="/collections" 
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white border border-neutral-300/80 shadow-xs hover:border-amber-500/60 hover:shadow-md transition-all duration-300 font-mono text-xs font-semibold uppercase tracking-widest text-neutral-800"
              >
                <span>View All Collections</span>
                <ArrowUpRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
          
          {/* Bento Gallery Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {categories.map((category, index) => (
                <Link key={category.title} href={category.link} className={`group block ${category.colSpan}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-neutral-100 shadow-sm transition-all duration-500 group-hover:border-amber-500/40 group-hover:shadow-2xl group-hover:shadow-amber-900/10 ${category.aspect}`}
                  >
                    {/* Background Image with Dynamic Zoom */}
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter contrast-[1.02] brightness-[0.95]"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-90" />
                    
                    {/* Top Category Tag Badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/40 border border-white/20 backdrop-blur-md font-mono text-[10px] text-amber-200/90 tracking-wider uppercase">
                        <Compass className="w-3 h-3 text-amber-400" />
                        {category.tag}
                      </span>
                    </div>

                    {/* Content Box */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-serif text-3xl md:text-4xl text-white font-normal tracking-tight group-hover:text-amber-200 transition-colors duration-300">
                            {category.title}
                          </h3>

                          {/* Hover Arrow Circle */}
                          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-amber-500 group-hover:border-amber-400 text-white transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>

                        <p className="text-neutral-300 font-light text-xs md:text-sm leading-relaxed max-w-lg opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                          {category.description}
                        </p>

                      </div>
                    </div>

                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}