import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Search, SlidersHorizontal, Sparkles, Layers, RotateCcw } from "lucide-react";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { data: categoriesData } = useListCategories({
    query: { queryKey: ["categories"] },
  });

  const { data: productsData, isLoading } = useListProducts(
    {
      category: activeCategory !== "all" ? activeCategory : undefined,
      search: search.trim() ? search.trim() : undefined,
    },
    {
      query: {
        queryKey: ["products", activeCategory, search],
      },
    }
  );

  const rawProducts = productsData?.products || [];

  const products = selectedMaterials.length
    ? rawProducts.filter((p) => {
        const productMaterials = Array.isArray(p.materials)
          ? p.materials.join(" ")
          : (p.materials as string) || "";
        return selectedMaterials.some((mat: string) =>
          productMaterials.toUpperCase().includes(mat.toUpperCase())
        );
      })
    : rawProducts;

  const categories = ["all", ...(categoriesData?.map((c) => c.name) ?? [])];

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials((prev: string[]) =>
      prev.includes(material)
        ? prev.filter((m: string) => m !== material)
        : [...prev, material]
    );
  };

  return (
    <div className="relative pt-32 pb-28 md:pb-36 bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8 border-b border-neutral-200/80 pb-8">
          <div>
            <SectionHeading title="Catalog" label="01 / Standard Collection" />
            <p className="mt-2 text-neutral-500 font-light text-sm max-w-md">
              Precision 3D printed artifacts engineered with high-grade PLA+, PETG, and composite materials.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full pl-11 pr-4 py-2.5 text-xs font-mono placeholder:text-neutral-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2.5 rounded-full border border-neutral-200/90 bg-white/80 backdrop-blur-md text-neutral-700 hover:text-amber-800 transition-colors shadow-xs"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside
            className={`w-full lg:w-64 shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-32 space-y-8">
              
              {/* Category Filters */}
              <div>
                <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-3 mb-4 text-amber-800 font-mono text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Categories</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-1.5 rounded-full border font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                          isActive
                            ? "border-amber-600/80 bg-amber-500/10 text-amber-900 font-semibold shadow-xs ring-2 ring-amber-500/20"
                            : "border-neutral-200/90 bg-white/80 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material Filters */}
              <div>
                <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-3 mb-4 text-amber-800 font-mono text-xs uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Materials</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["PLA+", "PETG", "ABS", "Resin"].map((material) => {
                    const isSelected = selectedMaterials.includes(material);
                    return (
                      <button
                        key={material}
                        onClick={() => handleMaterialToggle(material)}
                        className={`px-4 py-1.5 rounded-full border font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                          isSelected
                            ? "border-amber-600/80 bg-neutral-900 text-white shadow-xs"
                            : "border-neutral-200/90 bg-white/80 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                        }`}
                      >
                        {material}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-3xl border border-neutral-200/80 bg-white/60 animate-pulse space-y-4"
                  >
                    <div className="bg-neutral-200/70 aspect-[4/5] rounded-3xl w-full" />
                    <div className="h-5 bg-neutral-200/70 rounded-full w-3/4" />
                    <div className="h-4 bg-neutral-200/70 rounded-full w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${search}-${selectedMaterials.join("-")}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10"
                >
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs"
              >
                <h3 className="font-serif text-2xl font-normal text-neutral-900 mb-2">
                  No artifacts found
                </h3>
                <p className="text-neutral-500 font-light text-sm max-w-sm mx-auto">
                  Try clearing your search term or resetting your material and category filters.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearch("");
                    setSelectedMaterials([]);
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-amber-600 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              </motion.div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}