import { useState } from 'react';
import { motion } from 'framer-motion';
import { useListProducts, useListCategories } from '@workspace/api-client-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const { data: categoriesData } = useListCategories({
    query: { queryKey: ['categories'] },
  });

  const { data: productsData, isLoading } = useListProducts(
    {
      category: activeCategory !== 'all' ? activeCategory : undefined,
      search: search.trim() ? search.trim() : undefined,
    },
    {
      query: {
        queryKey: ['products', activeCategory, search],
      },
    }
  );

  const products = productsData?.products || [];

  const categories = ['all', ...(categoriesData?.map((c) => c.name) ?? [])];

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <SectionHeading 
            title="Shop" 
            label="Standard Collection"
            className="mb-0"
          />
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..." 
                className="w-full bg-card border border-border pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button className="p-2 border border-border bg-card hover:bg-muted transition-colors flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-32">
              <div className="mb-8">
                <h3 className="font-serif text-xl mb-4">Categories</h3>
                <ul className="space-y-3">
                  {categories.map(category => (
                    <li key={category}>
                      <button 
                        onClick={() => setActiveCategory(category)}
                        className={`text-sm uppercase tracking-wider transition-colors ${activeCategory === category ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h3 className="font-serif text-xl mb-4">Material</h3>
                <ul className="space-y-3">
                  {['PLA+', 'PETG', 'ABS', 'Resin'].map(material => (
                    <li key={material}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="accent-primary rounded-none border-border w-4 h-4" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{material}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
          
          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted aspect-4/5 mb-4 w-full" />
                    <div className="h-6 bg-muted w-3/4 mb-2" />
                    <div className="h-4 bg-muted w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-border bg-card">
                <h3 className="font-serif text-2xl mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}