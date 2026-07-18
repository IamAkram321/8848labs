import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api-url';

interface OrderSummary {
  id: number;
  status: string;
  total: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  confirmed: 'bg-primary/10 text-primary',
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-destructive/10 text-destructive',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'In Production',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/api/orders/mine`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setIsLoading(false));
  }, [authLoading, user]);

  if (!authLoading && !user) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-3xl mb-3">Sign in to view your orders</h1>
        <p className="text-muted-foreground mb-8">
          You'll need an account to see your order history.
        </p>
        <Link
          href="/login"
          className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-12">Your Orders</h1>

        {isLoading || authLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center border border-border bg-card">
            <Package className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-serif text-2xl mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-8">Once you place an order, it'll show up here.</p>
            <Link
              href="/shop"
              className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between border border-border p-6 hover:border-foreground transition-colors"
              >
                <div>
                  <p className="font-serif text-xl mb-1">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium mb-2">${Number(order.total).toFixed(2)}</p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider ${STATUS_STYLES[order.status] ?? 'bg-muted text-muted-foreground'}`}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}