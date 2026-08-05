import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetCollection } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Layers, ArrowLeft, Compass } from "lucide-react";

export default function CollectionDetailPage() {
  const { slug } = useParams();

  const { data: collection, isLoading } = useGetCollection(slug ?? "", {
    query: {
      queryKey: ["collection", slug],
      enabled: !!slug,
    },
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 bg-[#FAFAFA] min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          {/* Skeleton Header */}
          <div className="max-w-3xl space-y-4 mb-12 animate-pulse">
            <div className="h-4 bg-neutral-200 w-32 rounded-full" />
            <div className="h-10 bg-neutral-200 w-2/3 rounded-lg" />
            <div className="h-5 bg-neutral-200 w-full rounded" />
          </div>

          {/* Skeleton Hero Banner */}
          <div className="animate-pulse rounded-3xl bg-neutral-200 aspect-[21/9] w-full mb-16" />

          {/* Skeleton Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-neutral-200 aspect-square rounded-2xl w-full" />
                <div className="h-6 bg-neutral-200 w-3/4 rounded" />
                <div className="h-4 bg-neutral-200 w-1/3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="relative pt-32 pb-24 bg-[#FAFAFA] min-h-screen flex flex-col items-center justify-center text-center px-6 selection:bg-amber-500/20 selection:text-amber-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md p-10 rounded-3xl border border-neutral-200/90 bg-white shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-700">
            <Layers className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-neutral-900 mb-3">
            Collection not found
          </h1>
          <p className="text-neutral-500 text-sm font-light mb-8 leading-relaxed">
            This collection doesn't exist or may have been removed.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900 text-white hover:bg-amber-600 transition-colors duration-300 font-mono text-xs uppercase tracking-widest font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </Link>
        </motion.div>
      </div>
    );
  }

  const products = collection.products ?? [];

  return (
    <div className="relative pt-32 pb-28 md:pb-36 bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Ambient Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Collections
          </Link>
        </motion.div>

        {/* Collection Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono text-[10px] text-amber-800 tracking-wider uppercase mb-4">
            <Compass className="w-3 h-3 text-amber-600" />
            Curated Series
          </span>
          
          <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-tight text-neutral-900 mb-4">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed">
              {collection.description}
            </p>
          )}
        </motion.div>

        {/* Hero Cover Image */}
        {collection.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-neutral-200/90 aspect-[16/9] md:aspect-[21/9] mb-16 shadow-xs"
          >
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-full object-cover filter contrast-[1.02] brightness-[0.98]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 to-transparent" />
          </motion.div>
        )}

        {/* Products Grid */}
        <div>
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-24 text-center rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-700">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-neutral-900 mb-2">
                No products in this collection yet
              </h3>
              <p className="text-neutral-500 text-sm font-light">
                Check back soon for new additions to this series.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}