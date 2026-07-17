import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';

const STATUS_TABS = ['all', 'pending', 'under_review', 'quotation_sent', 'approved', 'in_production', 'completed', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  quotation_sent: 'bg-orange-100 text-orange-800',
  approved: 'bg-teal-100 text-teal-800',
  in_production: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminCustomRequestsPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params = new URLSearchParams();
  if (activeTab !== 'all') params.set('status', activeTab);
  if (debouncedSearch) params.set('search', debouncedSearch);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-custom-requests', activeTab, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/admin/custom-requests?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch custom requests');
      return res.json();
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-foreground">Custom Requests</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-border">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-muted animate-pulse rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (data?.requests ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No custom requests found</td>
                  </tr>
                ) : (
                  (data?.requests ?? []).map((req: any) => (
                    <tr key={req.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium">#{req.id}</td>
                      <td className="px-6 py-4">{req.fullName ?? req.user?.name ?? '—'}</td>
                      <td className="px-6 py-4">{req.projectName ?? req.title ?? '—'}</td>
                      <td className="px-6 py-4">{req.material ?? '—'}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/custom-requests/${req.id}`)}
                          className="gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}