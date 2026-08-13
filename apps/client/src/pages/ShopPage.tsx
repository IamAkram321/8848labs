import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Search, SlidersHorizontal, Sparkles, Layers, RotateCcw, X, Filter, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

// Interface accommodating various backend API response formats
interface Product {
  id: string | number;
  name: string;
  price?: number;
  category?: string;
  materials?: string | string[];
  imageUrl?: string;
  image_url?: string;
  image?: string;
  images?: string[];
}

// Helper to safely resolve image URLs across different API response formats
function getImageUrl(product: Product): string {
  if (product.imageUrl) return product.imageUrl;
  if (product.image_url) return product.image_url;
  if (product.image) return product.image;
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  return "/placeholder.jpg";
}

// --- Refined Product Card Component ---
function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const materialLabel = Array.isArray(product.materials)
    ? product.materials[0]
    : product.materials;

  const imageSrc = getImageUrl(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group flex flex-col"
    >
      <Link href={`/product/${product.id}`} className="block overflow-hidden">
        {/* Aspect 3/4 Portrait Container with Soft Rounded Corners */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-neutral-300/80 shadow-2xs transition-all duration-500 group-hover:shadow-md group-hover:border-amber-500/50">
          
          {/* Image with Soft Zoom Effect */}
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600";
            }}
          />

          {/* Glassmorphism Material Badge */}
          {materialLabel && (
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="inline-block rounded-full bg-white/90 backdrop-blur-md px-3 py-1 font-mono text-[10px] font-semibold tracking-wider text-neutral-800 uppercase border border-neutral-200/60 shadow-2xs">
                {materialLabel}
              </span>
            </div>
          )}

          {/* Quick View Corner Action */}
          <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-neutral-900/80 text-white backdrop-blur-md flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      {/* Product Details */}
      <div className="mt-3.5 px-1 flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-base font-normal text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.price !== undefined && (
            <span className="font-mono text-xs font-semibold text-neutral-900 shrink-0">
              Rs. {product.price}
            </span>
          )}
        </div>

        {product.category && (
          <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
            {product.category}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// --- Main Shop Page Component ---
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

  const activeFiltersCount = (activeCategory !== "all" ? 1 : 0) + selectedMaterials.length + (search ? 1 : 0);

  return (
    <div className="relative pt-32 lg:pt-36 pb-24 bg-[#F7F6F2] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Background Blueprint Grid & Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
        <div className="absolute -right-20 top-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/10 to-transparent blur-[140px]" />
        <div className="absolute -left-20 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/20 to-transparent blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-7xl">
        
        {/* Page Header & Search Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-6 border-b border-neutral-300/80 gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-mono text-xs uppercase tracking-widest mb-2 font-medium">
              <span>01 / Standard Collection</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-neutral-900 tracking-tight">
              Catalog
            </h1>
            <p className="mt-2 text-neutral-600 font-light text-sm md:text-base max-w-xl leading-relaxed">
              Precision 3D printed artifacts engineered with high-grade PLA+, PETG, and structural composite materials.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-white/90 backdrop-blur-md border border-neutral-300/80 rounded-2xl pl-10 pr-8 py-3 text-xs font-mono placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-2xs"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-mono uppercase tracking-wider transition-all shadow-2xs cursor-pointer ${
                showFilters || selectedMaterials.length > 0
                  ? "border-amber-500 bg-amber-500/10 text-amber-900 font-semibold"
                  : "border-neutral-300/80 bg-white/90 text-neutral-700 hover:border-neutral-400 hover:bg-white"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Category Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mr-2 shrink-0 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Category:
          </span>
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-2xl border font-mono text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "border-neutral-900 bg-neutral-900 text-white font-medium shadow-sm"
                    : "border-neutral-300/80 bg-white/90 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Expandable Material Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white/90 backdrop-blur-md border border-neutral-300/80 rounded-3xl p-5 md:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-800 font-semibold">
                    <Layers className="w-4 h-4 text-amber-700" />
                    <span>Filter By Material</span>
                  </div>
                  {selectedMaterials.length > 0 && (
                    <button
                      onClick={() => setSelectedMaterials([])}
                      className="text-[11px] font-mono text-neutral-500 hover:text-amber-800 underline transition-colors cursor-pointer"
                    >
                      Clear materials
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {["PLA+", "PETG", "ABS", "Resin"].map((material) => {
                    const isSelected = selectedMaterials.includes(material);
                    return (
                      <button
                        key={material}
                        onClick={() => handleMaterialToggle(material)}
                        className={`px-4 py-2 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? "border-amber-500 bg-amber-500/10 text-amber-900 font-semibold ring-1 ring-amber-500/20"
                            : "border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:border-neutral-300 hover:bg-white"
                        }`}
                      >
                        {material}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid Area */}
        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-3xl border border-neutral-300/70 bg-white/70 animate-pulse space-y-4"
                >
                  <div className="bg-neutral-200/80 aspect-[3/4] rounded-2xl w-full" />
                  <div className="h-4 bg-neutral-200/80 rounded-full w-3/4" />
                  <div className="h-3 bg-neutral-200/80 rounded-full w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${search}-${selectedMaterials.join("-")}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10"
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
              className="py-16 text-center rounded-3xl border border-neutral-300/80 bg-white/90 backdrop-blur-md shadow-2xs max-w-lg mx-auto"
            >
              <Filter className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-normal text-neutral-900 mb-1">
                No products found
              </h3>
              <p className="text-neutral-500 font-light text-xs max-w-xs mx-auto mb-6">
                We couldn't find anything matching your search or active filters.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearch("");
                  setSelectedMaterials([]);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}