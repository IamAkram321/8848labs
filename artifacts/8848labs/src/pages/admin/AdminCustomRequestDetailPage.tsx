import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download } from 'lucide-react';

const CUSTOM_REQUEST_STATUSES = ['pending', 'under_review', 'quotation_sent', 'approved', 'in_production', 'completed', 'cancelled'];

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

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

export default function AdminCustomRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [internalNotes, setInternalNotes] = useState('');
  const [quotationPrice, setQuotationPrice] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-custom-request', id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/custom-requests/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch request');
      return res.json();
    },
  });

  useEffect(() => {
    const req = (data as any)?.request;
    if (req) {
      setInternalNotes(req.internalNotes ?? '');
      setQuotationPrice(req.quotationPrice != null ? String(req.quotationPrice) : '');
      setStatus(req.status ?? '');
    }
  }, [data]);

  const updateRequest = useMutation({
    mutationFn: async () => {
      const body: any = { status };
      if (internalNotes !== undefined) body.internalNotes = internalNotes;
      if (quotationPrice !== '') body.quotationPrice = Number(quotationPrice);
      const res = await fetch(`/api/admin/custom-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Saved', description: 'Custom request updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['admin-custom-request', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-custom-requests'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update custom request.', variant: 'destructive' });
    },
  });

  const request = (data as any)?.request;
  const attachments: string[] = request?.fileUrls ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/custom-requests')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Custom Requests
          </Button>
          <h1 className="text-3xl font-serif text-foreground">Request #{id}</h1>
        </div>

        {isLoading ? (
          <div className="h-64 bg-card border border-border rounded-lg animate-pulse" />
        ) : !request ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">Request not found</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Request Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-lg text-foreground mb-4">Customer Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{request.fullName ?? request.user?.name ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{request.email ?? request.user?.email ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{request.phone ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preferred Contact</p>
                    <p className="font-medium">{request.preferredContact ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">{new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-lg text-foreground mb-4">Request Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Project Name', value: request.projectName ?? request.title },
                    { label: 'Material', value: request.material },
                    { label: 'Color', value: request.color },
                    { label: 'Finish', value: request.finish },
                    { label: 'Dimensions', value: request.dimensions },
                    { label: 'Quantity', value: request.quantity },
                    { label: 'Budget (NPR)', value: request.budget ? Number(request.budget).toLocaleString() : undefined },
                    { label: 'Delivery Date', value: request.deliveryDate ? new Date(request.deliveryDate).toLocaleDateString() : undefined },
                  ].map(({ label, value }) => value != null && (
                    <div key={label}>
                      <p className="text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                  {request.description && (
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">Description</p>
                      <p className="font-medium whitespace-pre-wrap">{request.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-serif text-lg text-foreground mb-4">Attachments</h2>
                  <div className="flex flex-wrap gap-3">
                    {attachments.map((url: string, idx: number) => (
                      isImageUrl(url) ? (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Attachment ${idx + 1}`} className="h-24 w-24 object-cover rounded-lg border border-border hover:opacity-80 transition-opacity" />
                        </a>
                      ) : (
                        <a
                          key={idx}
                          href={url}
                          download
                          className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-foreground hover:bg-muted/80 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          File {idx + 1}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Admin Actions */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-serif text-lg text-foreground">Admin Actions</h2>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CUSTOM_REQUEST_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Quotation Price (NPR)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount..."
                    value={quotationPrice}
                    onChange={(e) => setQuotationPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Internal Notes</label>
                  <Textarea
                    placeholder="Add internal notes..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    rows={5}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => updateRequest.mutate()}
                  disabled={updateRequest.isPending}
                >
                  {updateRequest.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}