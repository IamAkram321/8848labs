import { Link } from 'wouter';
import { useListCollections } from '@workspace/api-client-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Layers } from 'lucide-react';

export default function CollectionsPage() {
  const { data: collections, isLoading } = useListCollections({
    query: { queryKey: ['collections'] },
  });

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <SectionHeading title="Collections" label="Curated Series" />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted aspect-video mb-6 w-full" />
                <div className="h-8 bg-muted w-1/2" />
              </div>
            ))}
          </div>
        ) : !collections || collections.length === 0 ? (
          <div className="py-20 text-center border border-border bg-card">
            <Layers className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-serif text-2xl mb-2">No collections yet</h3>
            <p className="text-muted-foreground">Check back soon for curated series.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((col) => (
              <Link key={col.id} href={`/collections/${col.slug}`} className="group block">
                <div className="bg-card aspect-video border border-border relative overflow-hidden mb-6">
                  {col.image ? (
                    <img
                      src={col.image}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      alt={col.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h2 className="font-serif text-3xl group-hover:text-primary transition-colors">{col.name}</h2>
                {col.description && (
                  <p className="text-muted-foreground mt-2">{col.description}</p>
                )}
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
                  {col.productCount} {col.productCount === 1 ? 'Piece' : 'Pieces'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}