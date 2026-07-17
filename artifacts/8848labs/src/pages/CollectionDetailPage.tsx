import { useParams, Link } from 'wouter';
import { useGetCollection } from '@workspace/api-client-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Layers } from 'lucide-react';

export default function CollectionDetailPage() {
  const { slug } = useParams();

  const { data: collection, isLoading } = useGetCollection(slug ?? '', {
    query: {
      queryKey: ['collection', slug],
      enabled: !!slug,
    },
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen container mx-auto px-6">
        <p className="text-muted-foreground">Loading collection...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-3xl mb-3">Collection not found</h1>
        <p className="text-muted-foreground mb-8">
          This collection doesn't exist or may have been removed.
        </p>
        <Link
          href="/collections"
          className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
        >
          Back to Collections
        </Link>
      </div>
    );
  }

  const products = collection.products ?? [];

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      {/* Cover */}
      <div className="container mx-auto px-6 mb-16">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Curated Series
        </span>
        <h1 className="font-serif text-4xl md:text-5xl mb-6">{collection.name}</h1>
        {collection.description && (
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-8">
            {collection.description}
          </p>
        )}
        {collection.image && (
          <div className="bg-card border border-border aspect-21/9 overflow-hidden">
            <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Products */}
      <div className="container mx-auto px-6">
        {products.length === 0 ? (
          <div className="py-20 text-center border border-border bg-card">
            <Layers className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-serif text-2xl mb-2">No products in this collection yet</h3>
            <p className="text-muted-foreground">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}