import { Link } from "wouter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useListFeaturedProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowUpRight, Compass, FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useListFeaturedProjects();

  const displayProjects = Array.isArray(projects) && projects.length > 0
    ? projects
    : [
        {
          title: "Himalayan Topography",
          slug: "himalayan-topography",
          description: "High-precision 3D topographic relief mapping showcasing complex geographical contours.",
          images: ["/images/project-hero-3.jpg"],
          tags: ["Cartography"],
        },
        {
          title: "Parametric Pavilion",
          slug: "parametric-pavilion",
          description: "Algorithmic spatial structure designed for optimized load distribution and aesthetic fluidity.",
          images: ["/images/project-hero-1.jpg"],
          tags: ["Architecture"],
        },
        {
          title: "Fluid Installation",
          slug: "fluid-installation",
          description: "Organic sculptural form exploring the intersection of generative geometry and modern materials.",
          images: ["/images/project-hero-2.jpg"],
          tags: ["Art"],
        },
      ];

  return (
    <div className="relative pt-32 pb-28 md:pb-36 bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Ambient Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <SectionHeading title="Selected Works" label="01 / Portfolio" />
          <p className="mt-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-xl">
            A gallery of bespoke physical fabrications, parametric explorations, and architectural prototypes engineered across multiple disciplines.
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-neutral-200/80 bg-neutral-200/60 aspect-[4/3] w-full"
              />
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-700">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-neutral-900 mb-2">
              No projects featured yet
            </h3>
            <p className="text-neutral-500 text-sm font-light">
              Check back soon for new case studies and spatial prototypes.
            </p>
          </motion.div>
        ) : (

          /* Projects Bento Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayProjects.map((project, index) => {
              const mainTag = project.tags?.[0] ?? "Featured";
              const coverImg = project.images?.[0];

              return (
                <motion.div
                  key={project.slug ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-neutral-100 shadow-xs aspect-[4/3] transition-all duration-500 group-hover:border-amber-500/40 group-hover:shadow-2xl group-hover:shadow-amber-900/10">
                      
                      {/* Project Image */}
                      {coverImg ? (
                        <img
                          src={coverImg}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter contrast-[1.02] brightness-[0.95]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                          <FolderKanban className="h-10 w-10 text-neutral-400" />
                        </div>
                      )}

                      {/* Dark Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                      {/* Tag Badge */}
                      <div className="absolute top-6 left-6 z-20">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/40 border border-white/20 backdrop-blur-md font-mono text-[10px] text-amber-200/90 tracking-wider uppercase">
                          <Compass className="w-3 h-3 text-amber-400" />
                          {mainTag}
                        </span>
                      </div>

                      {/* Content Box */}
                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="font-serif text-2xl md:text-3xl text-white font-normal tracking-tight group-hover:text-amber-200 transition-colors duration-300">
                              {project.title}
                            </h2>

                            {/* Arrow Button */}
                            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-amber-500 group-hover:border-amber-400 text-white transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 shrink-0">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>

                          {"description" in project && project.description && (
                            <p className="text-neutral-300 font-light text-xs md:text-sm leading-relaxed max-w-md opacity-80 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
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
          </div>
        )}

      </div>
    </div>
  );
}