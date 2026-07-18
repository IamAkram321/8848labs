import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from '@/lib/api-url';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/orders/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch order');
      return res.json();
    },
  });

  useEffect(() => {
    if ((data as any)?.order?.status) {
      setSelectedStatus((data as any).order.status);
    }
  }, [data]);

  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`${API_URL}/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Status updated', description: 'Order status has been updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update order status.', variant: 'destructive' });
    },
  });

  const order = (data as any)?.order;
  const items = (data as any)?.items ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>
          <h1 className="text-3xl font-serif text-foreground">Order #{id}</h1>
        </div>

        {isLoading ? (
          <div className="h-64 bg-card border border-border rounded-lg animate-pulse" />
        ) : !order ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">Order not found</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer & Order Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-lg text-foreground mb-4">Order Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer Name</p>
                    <p className="font-medium">{order.customerName ?? order.user?.name ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{order.customerEmail ?? order.user?.email ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.phone ?? order.shippingAddress?.phone ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{order.paymentMethod ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Status</p>
                    <p className="font-medium capitalize">{order.paymentStatus ?? '—'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-muted-foreground">Shipping Address</p>
                    <p className="font-medium">
                      {order.shippingAddress
                        ? typeof order.shippingAddress === 'string'
                          ? order.shippingAddress
                          : [
                              order.shippingAddress.street,
                              order.shippingAddress.city,
                              order.shippingAddress.state,
                              order.shippingAddress.country,
                            ]
                              .filter(Boolean)
                              .join(', ')
                        : '—'}
                    </p>
                  </div>
                  {order.notes && (
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">Notes</p>
                      <p className="font-medium">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-serif text-lg text-foreground">Order Items</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Qty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Price (NPR)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total (NPR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {items.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No items</td></tr>
                      ) : (
                        items.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 font-medium">{item.productName ?? item.product?.name ?? '—'}</td>
                            <td className="px-6 py-4">{item.quantity}</td>
                            <td className="px-6 py-4">{Number(item.price ?? item.unitPrice ?? 0).toLocaleString()}</td>
                            <td className="px-6 py-4">{Number((item.price ?? item.unitPrice ?? 0) * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="border-t border-border bg-muted/20">
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-right font-semibold">Total</td>
                        <td className="px-6 py-4 font-bold text-primary">{Number(order.totalAmount ?? order.total ?? 0).toLocaleString()} NPR</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Status Updater */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-serif text-lg text-foreground">Current Status</h2>
                <StatusBadge status={order.status} />
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium text-foreground">Update Status</label>
                  <Select
                    value={selectedStatus || order.status}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full"
                    onClick={() => updateStatus.mutate(selectedStatus || order.status)}
                    disabled={updateStatus.isPending}
                  >
                    {updateStatus.isPending ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}