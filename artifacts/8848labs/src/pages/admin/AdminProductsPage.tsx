import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Pencil, Trash2, Package, Upload, X } from 'lucide-react';

interface ProductForm {
  name: string;
  price: string;
  compareAtPrice: string;
  category: string;
  description: string;
  shortDescription: string;
  stock: string;
  inStock: boolean;
  featured: boolean;
  images: string[];
}

const emptyForm: ProductForm = {
  name: '',
  price: '',
  compareAtPrice: '',
  category: '',
  description: '',
  shortDescription: '',
  stock: '',
  inStock: true,
  featured: false,
  images: [],
};

export default function AdminProductsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (selected.length === 0) return;

    setIsUploadingImage(true);
    try {
      const body = new FormData();
      selected.forEach((file) => body.append('files', file));

      const res = await fetch('/api/uploads', {
        method: 'POST',
        credentials: 'include',
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.error ?? 'Image upload failed', variant: 'destructive' });
        return;
      }

      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch {
      toast({ title: 'Image upload failed. Please try again.', variant: 'destructive' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const params = new URLSearchParams();
  if (debouncedSearch) params.set('search', debouncedSearch);
  if (lowStock) params.set('lowStock', 'true');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', debouncedSearch, lowStock],
    queryFn: async () => {
      const res = await fetch(`/api/admin/products?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const createProduct = useMutation({
    mutationFn: async (body: any) => {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Product created' });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDialogOpen(false);
    },
    onError: () => toast({ title: 'Error', description: 'Failed to create product', variant: 'destructive' }),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, body }: { id: number; body: any }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Product updated' });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDialogOpen(false);
    },
    onError: () => toast({ title: 'Error', description: 'Failed to update product', variant: 'destructive' }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Product deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDeleteId(null);
    },
    onError: () => toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' }),
  });

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: any) => {
    setEditProduct(product);
    setForm({
      name: product.name ?? '',
      price: product.price != null ? String(product.price) : '',
      compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : '',
      category: product.category ?? '',
      description: product.description ?? '',
      shortDescription: product.shortDescription ?? '',
      stock: product.stock != null ? String(product.stock) : '',
      inStock: product.inStock ?? true,
      featured: product.featured ?? false,
      images: Array.isArray(product.images) ? product.images : [],
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const body = {
      name: form.name,
      price: form.price !== '' ? Number(form.price) : undefined,
      compareAtPrice: form.compareAtPrice !== '' ? Number(form.compareAtPrice) : undefined,
      category: form.category,
      description: form.description,
      shortDescription: form.shortDescription,
      stock: form.stock !== '' ? Number(form.stock) : undefined,
      inStock: form.inStock,
      featured: form.featured,
      images: form.images,
    };
    if (editProduct) {
      updateProduct.mutate({ id: editProduct.id, body });
    } else {
      createProduct.mutate(body);
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif text-foreground">Products</h1>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" />
          </div>
          <button
            onClick={() => setLowStock(!lowStock)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${lowStock ? 'bg-red-100 border-red-300 text-red-800' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
          >
            Low Stock Only
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Price (NPR)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">In Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded w-16" /></td>)}</tr>
                  ))
                ) : (data?.products ?? []).length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No products found</td></tr>
                ) : (
                  (data?.products ?? []).map((product: any) => {
                    const img = (product.images ?? [])[0];
                    const stock = product.stock ?? 0;
                    return (
                      <tr key={product.id} className="hover:bg-muted/20">
                        <td className="px-6 py-4">
                          {img ? (
                            <img src={img} alt={product.name} className="h-10 w-10 object-cover rounded border border-border" />
                          ) : (
                            <div className="h-10 w-10 bg-muted rounded border border-border flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{product.category ?? '—'}</td>
                        <td className="px-6 py-4">{Number(product.price ?? 0).toLocaleString()}</td>
                        <td className={`px-6 py-4 font-medium ${stock < 5 ? 'text-red-600' : ''}`}>{stock}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.inStock ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Product Images</label>
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={handleImageSelect}
              />
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isUploadingImage ? 'Uploading...' : 'Click to upload PNG or JPG images'}
                </p>
              </div>
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-border group">
                      <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Price (NPR)</label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Compare At Price</label>
                <Input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Figurines" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Short Description</label>
              <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief summary" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Full description" rows={4} />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="rounded" />
                In Stock
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                Featured
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Saving...' : editProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId !== null && deleteProduct.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}