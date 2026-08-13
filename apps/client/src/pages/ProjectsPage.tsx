import { useState, useMemo } from "react";
import { Link } from "wouter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useListFeaturedProjects } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Compass, FolderKanban, Sparkles, SlidersHorizontal, Layers } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useListFeaturedProjects();
  const [activeTag, setActiveTag] = useState<string>("All");

  const fallbackProjects = [
    {
      title: "Himalayan Topography",
      slug: "himalayan-topography",
      description: "High-precision 3D topographic relief mapping showcasing complex geographical contours and physical elevation profiles.",
      images: ["/images/project-hero-3.jpg"],
      tags: ["Cartography"],
      featured: true,
    },
    {
      title: "Parametric Pavilion",
      slug: "parametric-pavilion",
      description: "Algorithmic spatial structure designed for optimized load distribution and aesthetic fluidity across modern spans.",
      images: ["/images/project-hero-1.jpg"],
      tags: ["Architecture"],
      featured: false,
    },
    {
      title: "Fluid Installation",
      slug: "fluid-installation",
      description: "Organic sculptural form exploring the intersection of generative geometry and modern polymer materials.",
      images: ["/images/project-hero-2.jpg"],
      tags: ["Art"],
      featured: false,
    },
    {
      title: "Kinetic Facade System",
      slug: "kinetic-facade-system",
      description: "Responsive building skin engineered for micro-climate shading and dynamic solar orientation.",
      images: ["/images/project-hero-1.jpg"],
      tags: ["Architecture"],
      featured: false,
    },
  ];

  const rawProjects = Array.isArray(projects) && projects.length > 0 ? projects : fallbackProjects;

  // Extract unique tags for filter tabs
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>(["All"]);
    rawProjects.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [rawProjects]);

  // Filter projects by selected tag
  const filteredProjects = useMemo(() => {
    if (activeTag === "All") return rawProjects;
    return rawProjects.filter((p) => p.tags?.includes(activeTag));
  }, [rawProjects, activeTag]);

  return (
    <div className="relative pt-32 pb-32 md:pb-40 bg-[#F4F3EF] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Structural Atelier Lighting & Blueprint Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />
        <div className="absolute -right-20 top-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-amber-200/25 via-orange-100/15 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/20 to-transparent blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
        
        {/* Header & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-neutral-300/70 pb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/20 font-mono text-[11px] uppercase tracking-widest text-amber-900 mb-3">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Architectural & Fabrication Index</span>
            </div>
            <SectionHeading title="Selected Works" label="01 / Portfolio" />
            <p className="mt-3 text-neutral-600 text-sm md:text-base font-light leading-relaxed max-w-xl">
              A curated archive of physical fabrications, parametric spatial structures, and algorithmic prototypes engineered across custom disciplines.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-2xl border border-neutral-300/80 rounded-2xl shadow-sm self-start md:self-auto overflow-x-auto max-w-full">
            <span className="px-3 py-1.5 text-neutral-400 font-mono text-[10px] uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Filter:
            </span>
            {allTags.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-md font-medium"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/80"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Skeleton Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-neutral-300/70 bg-neutral-200/50 aspect-[4/3] w-full"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center rounded-3xl border border-neutral-300/80 bg-white/80 backdrop-blur-2xl shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-800 shadow-sm">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-neutral-900 mb-2">
              No builds in this category
            </h3>
            <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider max-w-sm mx-auto">
              Select another domain filter or check back for new prototype drops.
            </p>
          </motion.div>
        ) : (

          /* Asymmetric Portfolio Bento Layout */
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTag}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredProjects.map((project, index) => {
                const mainTag = project.tags?.[0] ?? "Featured";
                const coverImg = project.images?.[0];
                const isFeaturedCard = index === 0 && activeTag === "All";

                return (
                  <motion.div
                    key={project.slug ?? index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={isFeaturedCard ? "md:col-span-2 lg:col-span-2" : "col-span-1"}
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block h-full"
                    >
                      <div className={`relative overflow-hidden rounded-3xl border border-neutral-300/80 bg-neutral-900 shadow-xl transition-all duration-500 group-hover:border-amber-600/50 group-hover:shadow-2xl ${
                        isFeaturedCard ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-[4/3]"
                      }`}>
                        
                        {/* Background Media */}
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter contrast-[1.03] brightness-[0.9]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                            <FolderKanban className="h-12 w-12 text-neutral-600" />
                          </div>
                        )}

                        {/* High-Contrast Gradient Backdrop */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/10 opacity-85 group-hover:opacity-90 transition-opacity duration-500" />

                        {/* Card Header Overlay */}
                        <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/70 border border-white/15 backdrop-blur-md font-mono text-[10px] text-amber-300 tracking-wider uppercase">
                            <Compass className="w-3 h-3 text-amber-400" />
                            {mainTag}
                          </span>

                          <span className="font-mono text-xs text-white/40 tracking-widest uppercase">
                            INDEX / 0{index + 1}
                          </span>
                        </div>

                        {/* Content Bottom Panel */}
                        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-20">
                          <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            
                            <div className="flex items-end justify-between gap-4 mb-2">
                              <h2 className={`font-serif text-white font-normal tracking-tight group-hover:text-amber-200 transition-colors duration-300 ${
                                isFeaturedCard ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                              }`}>
                                {project.title}
                              </h2>

                              {/* Corner Action Circle */}
                              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-amber-500 group-hover:border-amber-400 text-white transition-all duration-300 transform group-hover:scale-110 shrink-0 shadow-md">
                                <ArrowUpRight className="w-4 h-4" />
                              </div>
                            </div>

                            {"description" in project && project.description && (
                              <p className="text-neutral-300 font-light text-xs sm:text-sm leading-relaxed max-w-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                                {project.description as string}
                              </p>
                            )}

                          </div>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}