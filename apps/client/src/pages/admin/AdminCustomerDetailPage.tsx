import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from '@/lib/api-url';

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

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customer', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/customers/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const customer = data?.customer;
  const orders = data?.orders ?? [];

  const initials = (customer?.name ?? '')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/customers')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Customers
          </Button>
          <h1 className="text-3xl font-serif text-foreground">Customer Details</h1>
        </div>

        {isLoading ? (
          <div className="h-64 bg-card border border-border rounded-lg animate-pulse" />
        ) : !customer ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">Customer not found</div>
        ) : (
          <div className="space-y-6">
            {/* Customer Info Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                {customer.avatar ? (
                  <img src={customer.avatar} alt={customer.name} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-semibold">
                    {initials}
                  </div>
                )}
                <div>
                  <h2 className="font-serif text-xl text-foreground">{customer.name}</h2>
                  <p className="text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pt-4 border-t border-border">
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Orders</p>
                  <p className="font-medium">{orders.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Spent (NPR)</p>
                  <p className="font-medium">{orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount ?? o.total ?? 0), 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-serif text-lg text-foreground">Order History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">#ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total (NPR)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders yet</td></tr>
                    ) : (
                      orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                          <td className="px-6 py-4 font-medium">#{order.id}</td>
                          <td className="px-6 py-4">{Number(order.totalAmount ?? order.total ?? 0).toLocaleString()}</td>
                          <td className="px-6 py-4 capitalize">{order.paymentMethod ?? '—'}</td>
                          <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                          <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}