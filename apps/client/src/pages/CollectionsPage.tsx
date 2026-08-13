import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListCollections } from "@workspace/api-client-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight, Compass, Layers, Search } from "lucide-react";

export default function CollectionsPage() {
  const { data: collections, isLoading } = useListCollections({
    query: { queryKey: ["collections"] },
  });

  const [searchQuery, setSearchQuery] = useState("");

  const rawCollections = Array.isArray(collections) ? collections : [];

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return rawCollections;
    return rawCollections.filter(
      (col) =>
        col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rawCollections, searchQuery]);

  return (
    <div className="relative pt-24 md:pt-28 pb-16 md:pb-24 bg-[#F4F3EF] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Structural Atelier Lighting & Blueprint Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />
        <div className="absolute -right-20 top-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/25 via-orange-100/15 to-transparent blur-[120px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/20 to-transparent blur-[130px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
        
        {/* Compact & Tightened Header Layout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-neutral-300/70 pb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-600/20 font-mono text-[10px] uppercase tracking-widest text-amber-900 mb-2">
              <Layers className="w-3 h-3 text-amber-600" />
              <span>Series Archive</span>
            </div>
            
            <SectionHeading title="Curated Series" label="01 / Catalogue" />
            
            <p className="mt-2 text-neutral-600 text-xs md:text-sm font-light leading-relaxed">
              Explore our curated collections of precision 3D print series—engineered for structural integrity and crafted for refined aesthetics.
            </p>
          </div>

          {/* Compact Search Input */}
          <div className="w-full sm:w-72 shrink-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections..."
                className="w-full pl-9 pr-4 py-2 bg-white/80 backdrop-blur-2xl border border-neutral-300/80 rounded-xl text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-600/50 transition-all duration-300 shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Loading Skeleton Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-neutral-300/70 bg-neutral-200/50 aspect-[16/10] w-full"
              />
            ))}
          </div>
        ) : filteredCollections.length === 0 ? (
          
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 md:py-20 text-center rounded-2xl border border-neutral-300/80 bg-white/80 backdrop-blur-2xl shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3 text-amber-800 shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-normal text-neutral-900 mb-1">
              No series found
            </h3>
            <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider max-w-sm mx-auto">
              {searchQuery
                ? "No collections match your search term."
                : "Check back soon for new curated series."}
            </p>
          </motion.div>
        ) : (

          /* Collections Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCollections.map((col, index) => {
              const isWide = index % 3 === 0;
              const cardColSpan = isWide ? "col-span-1 md:col-span-2" : "col-span-1";
              const cardAspect = isWide
                ? "aspect-[16/9] md:aspect-[21/9]"
                : "aspect-[4/3] md:aspect-[16/10]";

              return (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className={`group block ${cardColSpan}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`relative overflow-hidden rounded-2xl border border-neutral-300/80 bg-neutral-900 shadow-md transition-all duration-500 group-hover:border-amber-600/50 group-hover:shadow-xl ${cardAspect}`}
                  >
                    {col.image ? (
                      <img
                        src={col.image}
                        alt={col.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter contrast-[1.03] brightness-[0.9]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                        <Layers className="h-10 w-10 text-neutral-600" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/10 opacity-85 group-hover:opacity-90 transition-opacity duration-500" />

                    <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900/70 border border-white/15 backdrop-blur-md font-mono text-[9px] text-amber-300 tracking-wider uppercase">
                        <Compass className="w-2.5 h-2.5 text-amber-400" />
                        {col.productCount} {col.productCount === 1 ? "Piece" : "Pieces"}
                      </span>

                      <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                        SERIES / 0{index + 1}
                      </span>
                    </div>

                    <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
                      <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="flex items-end justify-between gap-4 mb-1.5">
                          <h2 className="font-serif text-xl md:text-3xl text-white font-normal tracking-tight group-hover:text-amber-200 transition-colors duration-300">
                            {col.name}
                          </h2>

                          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-amber-500 group-hover:border-amber-400 text-white transition-all duration-300 transform group-hover:scale-105 shrink-0 shadow-xs">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {col.description && (
                          <p className="text-neutral-300 font-light text-xs leading-relaxed max-w-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                            {col.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}