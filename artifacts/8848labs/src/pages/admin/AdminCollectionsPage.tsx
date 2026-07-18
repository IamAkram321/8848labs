import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Layers, Upload, X } from 'lucide-react';
import { API_URL } from '@/lib/api-url';

interface CollectionForm {
  name: string;
  description: string;
  image: string;
  featured: boolean;
  productIds: number[];
}

const emptyForm: CollectionForm = {
  name: '',
  description: '',
  image: '',
  featured: false,
  productIds: [],
};

export default function AdminCollectionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCollection, setEditCollection] = useState<any>(null);
  const [form, setForm] = useState<CollectionForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-collections'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/collections`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products-picker'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/products-picker`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const collections = data?.collections ?? [];
  const allProducts = productsData?.products ?? [];

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const body = new FormData();
      body.append('files', file);

      const res = await fetch(`${API_URL}/api/uploads`, {
        method: 'POST',
        credentials: 'include',
        body,
      });
      const uploadData = await res.json();

      if (!res.ok) {
        toast({ title: uploadData.error ?? 'Image upload failed', variant: 'destructive' });
        return;
      }

      setForm((prev) => ({ ...prev, image: uploadData.urls[0] }));
    } catch {
      toast({ title: 'Image upload failed. Please try again.', variant: 'destructive' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const toggleProduct = (id: number) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((p) => p !== id)
        : [...prev.productIds, id],
    }));
  };

  const createCollection = useMutation({
    mutationFn: async (body: any) => {
      const res = await fetch(`${API_URL}/api/admin/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Collection created' });
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      setDialogOpen(false);
    },
    onError: () => toast({ title: 'Error', description: 'Failed to create collection', variant: 'destructive' }),
  });

  const updateCollection = useMutation({
    mutationFn: async ({ id, body }: { id: number; body: any }) => {
      const res = await fetch(`${API_URL}/api/admin/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Collection updated' });
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      setDialogOpen(false);
    },
    onError: () => toast({ title: 'Error', description: 'Failed to update collection', variant: 'destructive' }),
  });

  const deleteCollection = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/api/admin/collections/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Collection deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      setDeleteId(null);
    },
    onError: () => toast({ title: 'Error', description: 'Failed to delete collection', variant: 'destructive' }),
  });

  const openAdd = () => {
    setEditCollection(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (collection: any) => {
    setEditCollection(collection);
    setForm({
      name: collection.name ?? '',
      description: collection.description ?? '',
      image: collection.image ?? '',
      featured: collection.featured ?? false,
      productIds: Array.isArray(collection.productIds) ? collection.productIds : [],
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const body = {
      name: form.name,
      description: form.description,
      image: form.image,
      featured: form.featured,
      productIds: form.productIds,
    };
    if (editCollection) {
      updateCollection.mutate({ id: editCollection.id, body });
    } else {
      createCollection.mutate(body);
    }
  };

  const isPending = createCollection.isPending || updateCollection.isPending;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-foreground">Collections</h1>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Collection
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-6 py-3 font-medium text-muted-foreground">Image</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Name</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Products</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Featured</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading...</td>
              </tr>
            ) : collections.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <Layers className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  No collections yet. Create your first one.
                </td>
              </tr>
            ) : (
              collections.map((c: any) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4">
                    <div className="h-12 w-12 rounded-md bg-muted overflow-hidden flex items-center justify-center">
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                      ) : (
                        <Layers className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{c.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.productIds?.length ?? 0}</td>
                  <td className="px-6 py-4">
                    {c.featured ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Featured</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editCollection ? 'Edit Collection' : 'Add Collection'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Collection name" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Cover Image</label>
              <input
                ref={imageInputRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={handleImageSelect}
              />
              {form.image ? (
                <div className="relative w-full aspect-video rounded-md overflow-hidden border border-border group">
                  <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isUploadingImage ? 'Uploading...' : 'Click to upload a cover image'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" rows={3} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
              <label className="text-sm">Featured</label>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Products in this Collection</label>
              <div className="border border-border rounded-md max-h-48 overflow-y-auto divide-y divide-border">
                {allProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4">No products yet — add products first.</p>
                ) : (
                  allProducts.map((p: any) => (
                    <label key={p.id} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(p.id)}
                        onChange={() => toggleProduct(p.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{p.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{p.category}</span>
                    </label>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground">{form.productIds.length} selected</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending || !form.name}>
              {editCollection ? 'Save Changes' : 'Create Collection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this collection. Products in it will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId !== null && deleteCollection.mutate(deleteId)}
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