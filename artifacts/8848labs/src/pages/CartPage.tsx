import { Link } from 'wouter';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useGetCart, useUpdateCartItem, useRemoveCartItem } from '@workspace/api-client-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { refreshCart } = useCart();
  const { toast } = useToast();

  const { data: cart, isLoading } = useGetCart({
    query: { queryKey: ['cart'] },
  });

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    updateItem.mutate(
      { itemId, data: { quantity } },
      {
        onSuccess: () => refreshCart(),
        onError: () => toast({ title: 'Could not update quantity', variant: 'destructive' }),
      }
    );
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate(
      { itemId },
      {
        onSuccess: () => {
          toast({ title: 'Item removed' });
          refreshCart();
        },
        onError: () => toast({ title: 'Could not remove item', variant: 'destructive' }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen container mx-auto px-6">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mb-6" />
        <h1 className="font-serif text-3xl mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
        <Link
          href="/shop"
          className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="font-serif text-4xl md:text-5xl mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 border-b border-border pb-6">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-card border border-border shrink-0 overflow-hidden">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg md:text-xl truncate">{item.productName}</h3>
                      {(item.material || item.color) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {[item.material, item.color].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {item.personalization && (
                        <p className="text-sm text-muted-foreground mt-1">
                          "{item.personalization}"
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removeItem.isPending}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border w-28">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updateItem.isPending}
                        className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updateItem.isPending}
                        className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border p-6 sticky top-32">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cart?.subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                className="block text-center w-full bg-foreground text-background py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors mb-3"
              >
                Checkout
              </Link>
              <Link
                href="/shop"
                className="block text-center w-full border border-border py-4 uppercase tracking-widest text-sm font-medium hover:border-foreground transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}