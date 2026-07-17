import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useGetCart } from '@workspace/api-client-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { refreshCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: cart, isLoading } = useGetCart({
    query: { queryKey: ['cart'] },
  });

  const [form, setForm] = useState({
    customerName: user?.name ?? '',
    customerEmail: user?.email ?? '',
    customerPhone: '',
    shippingAddress: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{ id: number } | null>(null);

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.error ?? 'Could not place order', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      setOrderPlaced({ id: data.id });
      refreshCart();
    } catch {
      toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' });
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-4xl mb-4">Order Placed!</h1>
        <p className="text-muted-foreground mb-2">
          Thank you — your order <span className="font-medium text-foreground">#{orderPlaced.id}</span> has been received.
        </p>
        <p className="text-muted-foreground mb-8">
          We'll reach out by email to confirm details. Payment is cash on delivery.
        </p>
        <Link
          href="/"
          className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen container mx-auto px-6">
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-3xl mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add something to your cart before checking out.</p>
        <Link
          href="/shop"
          className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inputClasses =
    'w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors';

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="font-serif text-4xl md:text-5xl mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                Full Name
              </label>
              <input
                required
                type="text"
                value={form.customerName}
                onChange={handleChange('customerName')}
                className={inputClasses}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                Email
              </label>
              <input
                required
                type="email"
                value={form.customerEmail}
                onChange={handleChange('customerEmail')}
                className={inputClasses}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                Phone
              </label>
              <input
                type="tel"
                value={form.customerPhone}
                onChange={handleChange('customerPhone')}
                className={inputClasses}
                placeholder="Optional, but helps with delivery"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                Shipping Address
              </label>
              <textarea
                required
                rows={3}
                value={form.shippingAddress}
                onChange={handleChange('shippingAddress')}
                className={inputClasses}
                placeholder="Street, city, postal code"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                Order Notes
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={handleChange('notes')}
                className={inputClasses}
                placeholder="Optional"
              />
            </div>

            <div className="border border-border p-4 text-sm text-muted-foreground">
              Payment: <span className="text-foreground font-medium">Cash on Delivery</span> — pay when your order arrives.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-foreground text-background py-5 uppercase tracking-widest font-medium hover:bg-primary transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border p-6 sticky top-32">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-card border border-border shrink-0 overflow-hidden">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cart?.subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Shipping cost confirmed at delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}