import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api-url';

interface OrderItem {
  id: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: string;
  material: string | null;
  color: string | null;
}

interface OrderDetail {
  id: number;
  status: string;
  total: string;
  customerName: string;
  shippingAddress: string;
  createdAt: string;
}

const STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'In Production' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (authLoading || !user || !id) return;

    fetch(`${API_URL}/api/orders/mine/${id}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setOrder(data.order);
          setItems(data.items ?? []);
        }
      })
      .finally(() => setIsLoading(false));
  }, [authLoading, user, id]);

  if (!authLoading && !user) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-3xl mb-3">Sign in to track this order</h1>
        <Link
          href="/login"
          className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors mt-4"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading || authLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen container mx-auto px-6">
        <p className="text-muted-foreground">Loading order...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-3xl mb-3">Order not found</h1>
        <p className="text-muted-foreground mb-8">
          This order doesn't exist, or doesn't belong to your account.
        </p>
        <Link
          href="/orders"
          className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-6 inline-block">
          &larr; Back to Orders
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl mb-2">Order #{order.id}</h1>
        <p className="text-muted-foreground mb-12">
          Placed on{' '}
          {new Date(order.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Status Timeline */}
        {isCancelled ? (
          <div className="flex items-center gap-3 border border-destructive/30 bg-destructive/5 text-destructive px-6 py-4 mb-12">
            <X className="w-5 h-5 shrink-0" />
            <span className="font-medium">This order has been cancelled.</span>
          </div>
        ) : (
          <div className="flex items-start justify-between mb-16 relative">
            <div className="absolute top-4 left-0 right-0 h-px bg-border" style={{ zIndex: 0 }} />
            {STEPS.map((step, i) => {
              const isDone = i <= currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-3 ${
                      isDone ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                  </div>
                  <span className={`text-xs text-center uppercase tracking-wider ${isDone ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-border pb-4">
              <div className="w-16 h-16 bg-card border border-border shrink-0 overflow-hidden">
                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                {item.material && <p className="text-sm text-muted-foreground">{item.material}</p>}
                <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <span className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t border-border pt-4 mb-12">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium text-lg">${Number(order.total).toFixed(2)}</span>
        </div>

        <div className="border border-border p-6">
          <h3 className="font-serif text-lg mb-2">Shipping Address</h3>
          <p className="text-muted-foreground">{order.shippingAddress}</p>
        </div>
      </div>
    </div>
  );
}