import { motion, type Variants } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Link } from 'wouter';
import { useListFeaturedProjects } from '@workspace/api-client-react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

export function FeaturedProjects() {
  const { data: projects } = useListFeaturedProjects({
    query: {
      queryKey: ["featured-projects"]
    }
  });

  const displayProjects = Array.isArray(projects) && projects.length > 0 ? projects : [
    {
      id: 1,
      title: "Himalayan Topography",
      slug: "himalayan-topography",
      description: "A 1.5m wide relief map of the Khumbu region, printed in 24 interlocking segments over 300 hours.",
      images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"],
      tags: ["Cartography", "PLA+"],
      number: "01"
    },
    {
      id: 2,
      title: "Parametric Pavilion",
      slug: "parametric-pavilion",
      description: "Scale architectural model demonstrating complex lattice structures that are impossible to build with traditional methods.",
      images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop"],
      tags: ["Architecture", "PETG"],
      number: "02"
    },
    {
      id: 3,
      title: "Bespoke Art Installation",
      slug: "bespoke-installation",
      description: "A custom fluid geometry piece for a boutique hotel lobby in Kathmandu.",
      images: ["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=2016&auto=format&fit=crop"],
      tags: ["Art", "Custom Finish"],
      number: "03"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-[#F7F6F2] text-neutral-900 border-t border-neutral-300/80 overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Blueprint Grid & Ambient Orbs Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
        <div className="absolute -left-32 top-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/10 to-transparent blur-[140px]" />
        <div className="absolute right-0 bottom-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-amber-300/15 via-amber-100/20 to-transparent blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-4">
          <SectionHeading 
            label="03 / Portfolio"
            title="Featured Projects"
            className="mb-0"
          />
          <Link 
            href="/projects" 
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-neutral-300/90 shadow-2xs hover:border-amber-500/60 transition-all duration-300 font-mono text-xs font-semibold uppercase tracking-widest text-neutral-800 group"
          >
            <span>View All Work</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Project Showcase Rows */}
        <div className="space-y-16 md:space-y-20">
          {displayProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            const projectNum = project.number || `0${index + 1}`;

            return (
              <div 
                key={project.id} 
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 lg:gap-14 items-center`}
              >
                
                {/* Image Showcase Frame */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -25 : 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full md:w-7/12"
                >
                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="group block relative overflow-hidden rounded-3xl border border-neutral-300/90 bg-neutral-100 aspect-[16/10] shadow-2xs hover:border-amber-500/50 hover:shadow-lg transition-all duration-500 cursor-pointer"
                  >
                    <img 
                      src={project.images[0] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000"} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.02] brightness-[0.97]"
                    />
                    
                    {/* Glassmorphic Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                    
                    {/* Floating Action Badge */}
                    <div className="absolute bottom-5 right-5 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-neutral-900 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>

                {/* Content & Metadata Column */}
                <motion.div 
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="w-full md:w-5/12 flex flex-col items-start"
                >
                  {/* Number Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-300/80 shadow-2xs mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span className="font-mono text-xs font-semibold text-amber-900 tracking-widest">
                      PROJECT // {projectNum}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 mb-3 tracking-tight leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-neutral-600 font-light text-sm sm:text-base leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Material / Subject Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.map(tag => (
                      <span 
                        key={tag} 
                        className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase bg-white border border-neutral-300/80 text-neutral-700 px-3 py-1 rounded-full shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Primary Project CTA */}
                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-neutral-900 text-white hover:bg-amber-600 transition-all duration-300 font-mono text-xs uppercase tracking-widest shadow-2xs border border-neutral-800 cursor-pointer"
                  >
                    <span>Explore Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </Link>
                </motion.div>

              </div>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 text-center md:hidden">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-neutral-300 shadow-2xs font-mono text-xs font-semibold uppercase tracking-widest text-neutral-900"
          >
            <span>View All Work</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
          </Link>
        </div>

      </div>
    </section>
  );
}