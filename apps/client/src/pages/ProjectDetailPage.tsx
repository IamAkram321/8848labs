import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetProject } from "@workspace/api-client-react";
import { ArrowLeft, Compass, Cpu, Layers, Sparkles } from "lucide-react";

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const { data: project, isLoading } = useGetProject(slug ?? "", {
    query: {
      queryKey: ["project", slug],
      enabled: !!slug,
    },
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 bg-[#FAFAFA] min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl space-y-4 mb-12 animate-pulse">
            <div className="h-4 bg-neutral-200 w-32 rounded-full" />
            <div className="h-12 bg-neutral-200 w-3/4 rounded-lg" />
            <div className="h-5 bg-neutral-200 w-full rounded" />
          </div>
          <div className="animate-pulse rounded-3xl bg-neutral-200 aspect-[21/9] w-full mb-12" />
        </div>
      </div>
    );
  }

  // Fallback demo data if project is not retrieved from API
  const activeProject = project || {
    title: slug ? slug.replace(/-/g, " ") : "Bespoke Architectural Installation",
    tags: ["Parametric Design", "Additive Manufacturing"],
    client: "Studio V",
    year: "2025",
    description:
      "A spatial exploration investigating high-precision polymer assemblies, structural lattice density, and light diffusion through bespoke geometric forms.",
    images: [
      "/images/project-hero-1.jpg",
      "/images/project-hero-2.jpg",
      "/images/project-hero-3.jpg",
    ],
    specs: [
      { label: "Material", value: "PETG / Amber Resin" },
      { label: "Layer Resolution", value: "0.12 mm" },
      { label: "Print Duration", value: "148 Hours" },
      { label: "Scale", value: "1:1 Functional Prototype" },
    ],
  };

  return (
    <div className="relative pt-32 pb-28 md:pb-36 bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Ambient Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-162.5 h-162.5 rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Title & Editorial Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              {(activeProject.tags || ["Project"]).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono text-[10px] text-amber-800 tracking-wider uppercase"
                >
                  <Compass className="w-3 h-3 text-amber-600" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-tight text-neutral-900 capitalize">
              {activeProject.title}
            </h1>

            <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed pt-2 max-w-2xl">
              {activeProject.description}
            </p>
          </motion.div>

          {/* Quick Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 p-6 rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-3 text-amber-800 font-mono text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Project Metadata</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-neutral-400 block uppercase tracking-wider text-[10px] mb-1">
                  Client
                </span>
                <span className="text-neutral-800 font-medium">
                  {activeProject.client || "Internal Lab"}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase tracking-wider text-[10px] mb-1">
                  Year
                </span>
                <span className="text-neutral-800 font-medium">
                  {activeProject.year || "2025"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Hero Gallery Showcase */}
        {activeProject.images && activeProject.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl border border-neutral-200/90 aspect-[16/9] md:aspect-[21/9] mb-16 shadow-xs bg-neutral-100"
          >
            <img
              src={activeProject.images[0]}
              alt={activeProject.title}
              className="w-full h-full object-cover filter contrast-[1.02] brightness-[0.98]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 via-transparent to-transparent" />
          </motion.div>
        )}

        {/* Technical Specs & Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Specifications Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 p-8 rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs space-y-6"
          >
            <div className="flex items-center gap-2 text-neutral-900 font-serif text-xl">
              <Cpu className="w-5 h-5 text-amber-600" />
              <h2>Fabrication Specs</h2>
            </div>

            <div className="space-y-4 divide-y divide-neutral-100">
              {(activeProject.specs || [
                { label: "Material", value: "PETG High-Temp Polymer" },
                { label: "Accuracy", value: "±0.05 mm Tolerance" },
                { label: "Infill Pattern", value: "Gyroid 18%" },
              ]).map((spec, i) => (
                <div key={i} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                  <span className="font-mono text-neutral-400 uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <span className="font-mono text-neutral-800 font-semibold">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Secondary Imagery */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeProject.images?.slice(1) || []).map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="overflow-hidden rounded-3xl border border-neutral-200/90 aspect-4/3 bg-neutral-100 shadow-xs"
              >
                <img
                  src={img}
                  alt={`${activeProject.title} detail ${idx + 1}`}
                  className="w-full h-full object-cover filter contrast-[1.02] brightness-[0.98] hover:scale-105 transition-transform duration-700 ease-out"
                />
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}