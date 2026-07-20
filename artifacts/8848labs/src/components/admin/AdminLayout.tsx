import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, ShoppingBag, Printer, Package, Layers, Star, Users, Menu, X, LogOut, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navGroups = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Fulfillment',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { href: '/admin/custom-requests', label: 'Custom Requests', icon: Printer },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/collections', label: 'Collections', icon: Layers },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
    ],
  },
  {
    label: 'People',
    items: [{ href: '/admin/customers', label: 'Customers', icon: Users }],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === '/admin') return location === '/admin';
    return location.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1714] text-[#F5F0E8]">
      <div className="p-6 border-b border-[#F5F0E8]/10 flex items-center gap-3">
        <img src="/logo.jpeg" className="h-10 w-auto rounded-sm" alt="8848LABS" />
        <div className="leading-tight">
          <p className="font-serif text-sm text-[#F5F0E8]">8848LABS</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#F5F0E8]/50">Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-7 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-[#F5F0E8]/35 font-medium">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                      active
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-[#F5F0E8]/65 hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/5'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-primary" />
                    )}
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#F5F0E8]/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[#F5F0E8]/65 hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to Store
        </Link>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1714]">
        <div className="text-[#F5F0E8] font-serif text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    window.location.href = `${apiUrl}/api/auth/google`;
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-4xl font-serif text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have admin privileges to view this page.</p>
          <Button asChild variant="outline">
            <Link href="/">Return to Site</Link>
          </Button>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-[#1A1714] border-0">
                <SidebarContent onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="font-serif text-lg text-foreground font-semibold md:hidden">Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mr-1"
            >
              View Store
              <ExternalLink className="h-3 w-3" />
            </a>
            <div className="flex items-center gap-2">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                  {initials}
                </div>
              )}
              <span className="text-sm font-medium text-foreground hidden sm:block">{user.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}