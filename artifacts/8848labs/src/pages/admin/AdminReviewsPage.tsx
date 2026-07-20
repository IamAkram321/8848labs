import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Star, MessageSquare } from 'lucide-react';
import { API_URL } from '@/lib/api-url';

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/reviews`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/api/admin/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Review deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      setDeleteId(null);
    },
    onError: () => toast({ title: 'Error', description: 'Failed to delete review', variant: 'destructive' }),
  });

  const reviews = data?.reviews ?? [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-foreground">Reviews</h1>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-6 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Customer</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Rating</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Review</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading...</td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  No reviews yet.
                </td>
              </tr>
            ) : (
              reviews.map((r: any) => (
                <tr key={r.id} className="border-b border-border last:border-0 align-top">
                  <td className="px-6 py-4 font-medium text-foreground">{r.productName ?? '—'}</td>
                  <td className="px-6 py-4">
                    <div>{r.customerName}</div>
                    {r.verifiedPurchase && (
                      <span className="text-xs text-primary">Verified Purchase</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'fill-primary text-primary' : 'text-border'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    {r.title && <p className="font-medium text-foreground mb-1">{r.title}</p>}
                    <p className="text-muted-foreground line-clamp-3">{r.comment}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this review and update the product's rating.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId !== null && deleteReview.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}