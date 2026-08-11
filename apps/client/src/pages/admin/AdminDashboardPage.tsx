import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_URL } from '@/lib/api-url';

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

function StatCard({
  title,
  value,
  icon: Icon,
  emphasis = false,
}: {
  title: string;
  value: string | number;
  icon: any;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border p-5 ${
        emphasis ? 'bg-[#1A1714] border-[#1A1714] text-[#F5F0E8]' : 'bg-card border-border text-foreground'
      }`}
    >
      <Icon className={`absolute -right-2 -bottom-2 h-16 w-16 ${emphasis ? 'text-primary/20' : 'text-muted-foreground/10'}`} />
      <p className={`text-xs uppercase tracking-widest mb-2 relative ${emphasis ? 'text-[#F5F0E8]/60' : 'text-muted-foreground'}`}>
        {title}
      </p>
      <p className="text-3xl font-serif relative">{value}</p>
    </div>
  );
}

interface TrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1714] text-[#F5F0E8] px-4 py-3 rounded-md text-xs shadow-lg">
      <p className="text-[#F5F0E8]/60 mb-1">
        {new Date(label).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </p>
      <p className="font-serif text-sm">NPR {Number(payload[0]?.value ?? 0).toLocaleString()}</p>
      <p className="text-[#F5F0E8]/60">{payload[1]?.value ?? 0} order{payload[1]?.value === 1 ? '' : 's'}</p>
    </div>
  );
}

function RevenueTrendChart({ trend }: { trend: TrendPoint[] }) {
  if (trend.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
        Not enough order history yet to chart a trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={trend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8956A" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#B8956A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-muted-foreground"
          axisLine={false}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-muted-foreground"
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<RevenueTooltip />} />
        <Area type="monotone" dataKey="revenue" stroke="#B8956A" strokeWidth={2} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/dashboard`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      return res.json();
    },
  });

  const trend: TrendPoint[] = data?.trend ?? [];
  const trendRevenue = trend.reduce((sum, d) => sum + d.revenue, 0);
  const trendOrders = trend.reduce((sum, d) => sum + d.orders, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">An overview of your shop's activity.</p>
        </div>

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
              <StatCard title="Revenue (NPR)" value={Number(data?.revenue?.total ?? 0).toLocaleString()} icon={TrendingUp} emphasis />
              <StatCard title="Total Orders" value={data?.orders?.total ?? 0} icon={ShoppingBag} />
              <StatCard title="Pending" value={data?.orders?.pending ?? 0} icon={Clock} />
              <StatCard title="Processing" value={data?.orders?.processing ?? 0} icon={TrendingUp} />
              <StatCard title="Delivered" value={data?.orders?.delivered ?? 0} icon={CheckCircle} />
              <StatCard title="Customers" value={data?.customers?.total ?? 0} icon={Users} />
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-serif text-lg text-foreground">Revenue, Last 30 Days</h2>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{trendOrders} orders</p>
                </div>
              </div>
              <p className="text-2xl font-serif text-foreground mb-4">NPR {trendRevenue.toLocaleString()}</p>
              <RevenueTrendChart trend={trend} />
            </div>

            {/* Low Stock Warning */}
            {(data?.products?.lowStock ?? 0) > 0 && (
              <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 shrink-0" />
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