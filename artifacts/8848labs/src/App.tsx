import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CustomStudioPage from './pages/CustomStudioPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
// import JournalPage from './pages/JournalPage';
// import JournalPostPage from './pages/JournalPostPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginPage from './pages/LoginPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import FAQPage from './pages/FAQPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import NotFound from '@/pages/not-found';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminCustomRequestsPage from './pages/admin/AdminCustomRequestsPage';
import AdminCustomRequestDetailPage from './pages/admin/AdminCustomRequestDetailPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCollectionsPage from './pages/admin/AdminCollectionsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminCustomerDetailPage from './pages/admin/AdminCustomerDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [location] = useLocation();

  if (location.startsWith('/admin')) {
    return (
      <Switch>
        <Route path="/admin" component={AdminDashboardPage} />
        <Route path="/admin/orders" component={AdminOrdersPage} />
        <Route path="/admin/orders/:id" component={AdminOrderDetailPage} />
        <Route path="/admin/custom-requests" component={AdminCustomRequestsPage} />
        <Route path="/admin/custom-requests/:id" component={AdminCustomRequestDetailPage} />
        <Route path="/admin/products" component={AdminProductsPage} />
        <Route path="/admin/collections" component={AdminCollectionsPage} />
        <Route path="/admin/customers" component={AdminCustomersPage} />
        <Route path="/admin/customers/:id" component={AdminCustomerDetailPage} />
      </Switch>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/custom-studio" component={CustomStudioPage} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/projects/:slug" component={ProjectDetailPage} />
          <Route path="/product/:slug" component={ProductDetailPage} />
          <Route path="/collections" component={CollectionsPage} />
          <Route path="/collections/:slug" component={CollectionDetailPage} />
          {/* <Route path="/journal" component={JournalPage} />
          <Route path="/journal/:slug" component={JournalPostPage} /> */}
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/orders" component={OrdersPage} />
          <Route path="/orders/:id" component={OrderTrackingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/shipping" component={ShippingPage} />
          <Route path="/returns" component={ReturnsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <AppContent />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;