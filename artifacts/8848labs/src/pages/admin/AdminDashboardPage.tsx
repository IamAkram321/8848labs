import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  under_review: 'bg-blue-100 text-blue-800',
  quotation_sent: 'bg-orange-100 text-orange-800',
  approved: 'bg-teal-100 text-teal-800',
  in_production: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-serif font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/admin/dashboard', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      return res.json();
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard title="Total Orders" value={data?.orders?.total ?? 0} icon={ShoppingBag} color="bg-primary/10 text-primary" />
              <StatCard title="Pending" value={data?.orders?.pending ?? 0} icon={Clock} color="bg-yellow-100 text-yellow-700" />
              <StatCard title="Processing" value={data?.orders?.processing ?? 0} icon={TrendingUp} color="bg-purple-100 text-purple-700" />
              <StatCard title="Delivered" value={data?.orders?.delivered ?? 0} icon={CheckCircle} color="bg-green-100 text-green-700" />
              <StatCard title="Customers" value={data?.customers?.total ?? 0} icon={Users} color="bg-blue-100 text-blue-700" />
              <StatCard title="Revenue (NPR)" value={`${Number(data?.revenue?.total ?? 0).toLocaleString()}`} icon={TrendingUp} color="bg-primary/10 text-primary" />
            </div>

            {/* Low Stock Warning */}
            {(data?.products?.lowStock ?? 0) > 0 && (
              <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {data.products.lowStock} product{data.products.lowStock > 1 ? 's are' : ' is'} low in stock
                </span>
                <Link href="/admin/products" className="ml-auto text-sm underline hover:no-underline">
                  View Products
                </Link>
              </div>
            )}

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-lg text-foreground">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total (NPR)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data?.recentOrders ?? []).length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No recent orders</td></tr>
                    ) : (
                      (data?.recentOrders ?? []).map((order: any) => (
                        <tr key={order.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4 font-medium">#{order.id}</td>
                          <td className="px-6 py-4">{order.customerName ?? order.user?.name ?? '—'}</td>
                          <td className="px-6 py-4">{Number(order.totalAmount ?? order.total ?? 0).toLocaleString()}</td>
                          <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                          <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Custom Requests */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-lg text-foreground">Recent Custom Requests</h2>
                <Link href="/admin/custom-requests" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Material</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data?.recentCustomRequests ?? []).length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No recent custom requests</td></tr>
                    ) : (
                      (data?.recentCustomRequests ?? []).map((req: any) => (
                        <tr key={req.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4">{req.customerName ?? req.user?.name ?? '—'}</td>
                          <td className="px-6 py-4">{req.projectName ?? req.title ?? '—'}</td>
                          <td className="px-6 py-4">{req.material ?? '—'}</td>
                          <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                          <td className="px-6 py-4 text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
