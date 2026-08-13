import { useParams, Link } from 'wouter';
import { useGetProduct, useAddCartItem } from '@workspace/api-client-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductModelViewer } from '@/components/three/ProductModelViewer';
import { ProductReviews } from '@/components/ui/ProductReviews';
import { 
  View, 
  Image as ImageIcon, 
  ShoppingBag, 
  Minus, 
  Plus, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [viewMode, setViewMode] = useState<'photos' | '3d'>('photos');
  const [quantity, setQuantity] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  const { data: product, isLoading } = useGetProduct(slug as unknown as number, {
    query: {
      queryKey: ['product', slug],
      enabled: !!slug,
    },
  });

  const { refreshCart } = useCart();
  const { toast } = useToast();
  const addCartItem = useAddCartItem();

  const displayProduct = product;

  const handleAddToCart = () => {
    if (!displayProduct) return;

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
          toast({ title: 'Added to cart successfully' });
          refreshCart();
        },
        onError: () => {
          toast({ title: 'Could not add to cart', variant: 'destructive' });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-12 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <div className="bg-muted/50 h-112.5 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted/40 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <div className="h-4 w-24 bg-muted/60 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-muted/60 rounded animate-pulse" />
              <div className="h-6 w-28 bg-muted/60 rounded animate-pulse" />
              <div className="h-16 w-full bg-muted/40 rounded-xl animate-pulse" />
              <div className="h-12 w-full bg-muted/60 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !displayProduct) {
    return (
      <div className="pt-28 pb-20 min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-background">
        <div className="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Product Not Found
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
          The requested product could not be found or may have been removed from our catalog.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-primary transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const activeMaterial = selectedMaterial || displayProduct.materials?.[0] || '';

  return (
    <div className="pt-20 pb-12 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb - Compact */}
        <div className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="capitalize">{displayProduct.category}</span>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{displayProduct.name}</span>
        </div>

        {/* Main Single-Screen Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Media Display (Height Limited) */}
          <div className="lg:col-span-6 space-y-3">
            
            {/* View Mode Toggles */}
            {displayProduct.model3dUrl && (
              <div className="flex gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/50 w-fit">
                <button
                  type="button"
                  onClick={() => setViewMode('photos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                    viewMode === 'photos'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Photos
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                    viewMode === '3d'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <View className="w-3.5 h-3.5" /> 3D View
                </button>
              </div>
            )}

            {/* Compact Main Image Viewport */}
            <div className="bg-card border border-border/80 rounded-2xl relative overflow-hidden shadow-sm h-95 sm:h-112.5 lg:h-120 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {viewMode === '3d' && displayProduct.model3dUrl ? (
                  <motion.div
                    key="3d-viewer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <ProductModelViewer url={displayProduct.model3dUrl} />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border/60 pointer-events-none shadow-sm">
                      Drag to rotate &middot; Scroll to zoom
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                  >
                    <img
                      src={displayProduct.images[selectedImage]}
                      alt={displayProduct.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Thumbnail Navigation */}
            {viewMode === 'photos' && displayProduct.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2.5">
                {displayProduct.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 sm:h-20 border rounded-xl bg-card overflow-hidden transition-all relative ${
                      selectedImage === i
                        ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                        : 'border-border/70 opacity-70 hover:opacity-100 hover:border-foreground/40'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Compact Details Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            
            {/* Header info */}
            <div className="space-y-1.5 border-b border-border/60 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full w-fit inline-block">
                {displayProduct.category}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug">
                {displayProduct.name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-foreground pt-1">
                NPR {displayProduct.price.toFixed(2)}
              </p>
            </div>

            {/* Compact Description */}
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3">
              {displayProduct.description}
            </p>

            {/* Selection Options */}
            <div className="space-y-4 border-y border-border/60 py-4">
              
              {/* Material Selector */}
              {displayProduct.materials && displayProduct.materials.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold uppercase tracking-wider text-foreground/80 text-[11px]">
                      Material Option
                    </span>
                    <span className="text-muted-foreground font-medium text-[11px]">{activeMaterial}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displayProduct.materials.map((mat) => {
                      const isSelected = activeMaterial === mat;
                      return (
                        <button
                          key={mat}
                          type="button"
                          onClick={() => setSelectedMaterial(mat)}
                          className={`px-3.5 py-2 rounded-xl border text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10 font-semibold'
                              : 'border-border/80 text-muted-foreground hover:border-foreground/40 bg-background'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                          {mat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 text-[11px]">
                  Quantity
                </span>
                <div className="flex items-center border border-border/80 rounded-xl w-32 bg-background p-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center font-semibold text-xs text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Add to Cart CTA */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addCartItem.isPending}
                className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-primary transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {addCartItem.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Delivery Info Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-muted/30 border border-border/50 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-foreground leading-none">Made in Kathmandu</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Ships in 3-5 days</p>
                  </div>
                </div>
                <div className="bg-muted/30 border border-border/50 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-foreground leading-none">Quality Assured</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Handcrafted quality</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Product Reviews Section */}
        <div className="mt-16 border-t border-border/60 pt-12">
          <ProductReviews productId={displayProduct.id} />
        </div>

      </div>
    </div>
  );
}