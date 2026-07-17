import { useParams, Link } from 'wouter';
import { useGetProduct, useAddCartItem } from '@workspace/api-client-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  // The backend now accepts either a numeric id or a slug on this route.
  // The generated hook's TS types only allow `number`, so we cast — the
  // slug is interpolated straight into the URL at runtime and works fine.
  const { data: product, isLoading } = useGetProduct(slug as unknown as number, {
    query: {
      queryKey: ['product', slug],
      enabled: !!slug,
    },
  });

  const { refreshCart } = useCart();
  const { toast } = useToast();
  const addCartItem = useAddCartItem();

  const handleAddToCart = () => {
    addCartItem.mutate(
      {
        data: {
          productId: displayProduct.id,
          quantity,
          material: selectedMaterial || displayProduct.materials?.[0] || null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: 'Added to cart' });
          refreshCart();
        },
        onError: () => {
          toast({ title: 'Could not add to cart', variant: 'destructive' });
        },
      }
    );
  };

  if (isLoading) {
    return <div className="pt-32 pb-24 min-h-screen container mx-auto px-6">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-3xl mb-3">Product not found</h1>
        <p className="text-muted-foreground mb-8">
          This product doesn't exist or may have been removed.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const displayProduct = product;

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-card aspect-4/5 border border-border relative overflow-hidden">
              <img 
                src={displayProduct.images[selectedImage]} 
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            {displayProduct.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayProduct.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square border ${selectedImage === i ? 'border-primary' : 'border-border'} bg-card overflow-hidden`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col pt-8">
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{displayProduct.category}</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">{displayProduct.name}</h1>
            <p className="text-2xl font-medium mb-8">${displayProduct.price.toFixed(2)}</p>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              {displayProduct.description}
            </p>

            <div className="space-y-8 mb-12">
              {displayProduct.materials && displayProduct.materials.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-wider mb-4 font-semibold">Material</h3>
                  <div className="flex gap-4">
                    {displayProduct.materials.map(mat => (
                      <button 
                        key={mat}
                        onClick={() => setSelectedMaterial(mat)}
                        className={`px-6 py-3 border text-sm uppercase tracking-widest transition-colors ${selectedMaterial === mat || (!selectedMaterial && mat === displayProduct.materials[0]) ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:border-foreground'}`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm uppercase tracking-wider mb-4 font-semibold">Quantity</h3>
                <div className="flex items-center border border-border w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">-</button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">+</button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={addCartItem.isPending}
              className="w-full bg-foreground text-background py-5 uppercase tracking-widest font-medium hover:bg-primary transition-colors mb-6 disabled:opacity-60"
            >
              {addCartItem.isPending ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <div className="text-xs text-muted-foreground uppercase tracking-wider text-center">
              Made to order in Kathmandu. Ships in 3-5 days.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}