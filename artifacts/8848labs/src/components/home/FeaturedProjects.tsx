import { motion, type Variants } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Link } from 'wouter';
import { useListFeaturedProjects } from '@workspace/api-client-react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
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
    <section className="relative py-28 md:py-36 bg-[#FAFAFA] text-neutral-900 border-t border-neutral-200/80 overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Ambient Aura Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-32 top-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[160px]" />
        <div className="absolute right-0 bottom-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-28 gap-6">
          <SectionHeading 
            label="03 / Portfolio"
            title="Featured Projects"
            className="mb-0"
          />
          <Link 
            href="/projects" 
            className="hidden md:inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white border border-neutral-300/80 shadow-xs hover:border-amber-500/60 hover:shadow-md transition-all duration-300 font-mono text-xs font-semibold uppercase tracking-widest text-neutral-800 group"
          >
            <span>View All Work</span>
            <ArrowUpRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Project Showcase Rows */}
        <div className="space-y-28 md:space-y-36">
          {displayProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            const projectNum = project.number || `0${index + 1}`;

            return (
              <div 
                key={project.id} 
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-20 items-center`}
              >
                
                {/* Image Showcase Frame */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full md:w-7/12"
                >
                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="group block relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-neutral-100 aspect-[4/3] shadow-md hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500"
                  >
                    <img 
                      src={project.images[0] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000"} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter contrast-[1.02] brightness-[0.96]"
                    />
                    
                    {/* Glassmorphic Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                    
                    {/* Floating Action Badge */}
                    <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 text-neutral-900 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-400">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </Link>
                </motion.div>

                {/* Content & Metadata Column */}
                <motion.div 
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="w-full md:w-5/12 flex flex-col items-start"
                >
                  {/* Number Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-neutral-200 shadow-2xs mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-mono text-xs font-semibold text-amber-900 tracking-wider">
                      PROJECT // {projectNum}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 mb-6 tracking-tight leading-[1.05]">
                    {project.title}
                  </h3>

                  <p className="text-neutral-600 font-light text-base md:text-lg leading-relaxed mb-8">
                    {project.description}
                  </p>

                  {/* Material / Subject Tags */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.tags?.map(tag => (
                      <span 
                        key={tag} 
                        className="font-mono text-[11px] font-medium tracking-wider uppercase bg-white border border-neutral-200/90 text-neutral-700 px-3.5 py-1.5 rounded-full shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Primary Project CTA */}
                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-neutral-900 text-amber-300 hover:bg-neutral-800 transition-all duration-300 font-mono text-xs uppercase tracking-widest shadow-lg shadow-neutral-900/10 border border-neutral-800"
                  >
                    <span>Explore Project</span>
                    <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </Link>
                </motion.div>

              </div>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-20 text-center md:hidden">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white border border-neutral-300 shadow-sm font-mono text-xs font-semibold uppercase tracking-widest text-neutral-900"
          >
            <span>View All Work</span>
            <ArrowUpRight className="w-4 h-4 text-amber-600" />
          </Link>
        </div>

      </div>
    </section>
  );
}