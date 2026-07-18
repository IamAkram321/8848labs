import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { API_URL } from '@/lib/api-url';

export default function AdminCustomersPage() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const params = new URLSearchParams();
  if (debouncedSearch) params.set('search', debouncedSearch);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/customers?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-foreground">Customers</h1>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total Spent (NPR)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-muted animate-pulse rounded w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (data?.customers ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No customers found</td>
                  </tr>
                ) : (
                  (data?.customers ?? []).map((customer: any) => {
                    const initials = (customer.name ?? '')
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-muted/20 cursor-pointer"
                        onClick={() => navigate(`/admin/customers/${customer.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {customer.avatar ? (
                              <img src={customer.avatar} alt={customer.name} className="h-8 w-8 rounded-full object-cover" />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                                {initials}
                              </div>
                            )}
                            <span className="font-medium">{customer.name ?? '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{customer.email ?? '—'}</td>
                        <td className="px-6 py-4">{customer.orderCount ?? customer._count?.orders ?? 0}</td>
                        <td className="px-6 py-4">{Number(customer.totalSpent ?? 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(customer.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}