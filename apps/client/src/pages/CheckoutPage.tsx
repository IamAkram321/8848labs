import { useState } from 'react';
import { Link } from 'wouter';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  ShoppingBag,
  Sparkles,
  Info
} from 'lucide-react';
import { useGetCart } from '@workspace/api-client-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-url';

type PaymentMethod = 'cash_on_delivery' | 'esewa' | 'khalti' | 'qr';

interface QrData {
  orderId: number;
  amount: number;
  qrImageUrl: string;
  accountName: string;
  instructions: string;
}

export default function CheckoutPage() {
  const { refreshCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: cart, isLoading } = useGetCart({
    query: { queryKey: ['cart'] },
  });

  const [form, setForm] = useState({
    customerName: user?.name ?? '',
    customerEmail: user?.email ?? '',
    customerPhone: '',
    shippingAddress: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{ id: number; method: PaymentMethod } | null>(null);
  const [qrModalData, setQrModalData] = useState<QrData | null>(null);

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const submitEsewaForm = (url: string, formData: Record<string, string>) => {
    const formEl = document.createElement('form');
    formEl.method = 'POST';
    formEl.action = url;

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      formEl.appendChild(input);
    });

    document.body.appendChild(formEl);
    formEl.submit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, paymentMethod }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({ title: data.error ?? `Server error (${res.status})`, variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      refreshCart();

      if (paymentMethod === 'cash_on_delivery') {
        setOrderPlaced({ id: data.id, method: 'cash_on_delivery' });
      } else if (paymentMethod === 'esewa') {
        const esewaRes = await fetch(`${API_URL}/api/payment/esewa/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ orderId: data.id, amount: data.total }),
        });
        
        const esewaData = await esewaRes.json().catch(() => ({}));

        if (!esewaRes.ok) {
          toast({ title: esewaData.error ?? 'Failed to initiate eSewa payment', variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }

        if (esewaData.isMock && esewaData.redirectUrl) {
          window.location.href = esewaData.redirectUrl;
          return;
        }

        if (esewaData.esewaUrl && esewaData.formData) {
          submitEsewaForm(esewaData.esewaUrl, esewaData.formData);
        }
      } else if (paymentMethod === 'khalti') {
        const khaltiRes = await fetch(`${API_URL}/api/payment/khalti/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            orderId: data.id,
            amount: data.total,
            customerName: form.customerName,
            customerEmail: form.customerEmail,
            customerPhone: form.customerPhone,
          }),
        });

        const khaltiData = await khaltiRes.json().catch(() => ({}));

        if (khaltiRes.ok && khaltiData.paymentUrl) {
          window.location.href = khaltiData.paymentUrl;
        } else {
          toast({ title: khaltiData.error ?? 'Failed to launch Khalti payment', variant: 'destructive' });
          setIsSubmitting(false);
        }
      } else if (paymentMethod === 'qr') {
        const qrRes = await fetch(`${API_URL}/api/payment/qr/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ orderId: data.id, amount: data.total }),
        });

        const qrData = await qrRes.json().catch(() => ({}));

        if (!qrRes.ok) {
          toast({ title: qrData.error ?? 'Failed to generate QR payment code', variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }

        setQrModalData(qrData);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error('[Checkout Error Details]:', err);
      toast({
        title: 'Network or Server Error',
        description: err?.message || 'Check browser console and backend terminal logs.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="pt-28 pb-20 min-h-[80vh] flex flex-col items-center justify-center px-4 bg-background">
        <div className="max-w-md w-full text-center bg-card border border-border p-8 rounded-2xl shadow-xl space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Order Confirmed!</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Order ID: <span className="font-semibold text-foreground">#{orderPlaced.id}</span>
            </p>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl text-xs text-muted-foreground leading-relaxed text-left space-y-2 border border-border/50">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="w-4 h-4 text-primary" /> What happens next?
            </p>
            <p>
              {orderPlaced.method === 'cash_on_delivery'
                ? 'We are preparing your items. Our team will get in touch via email or phone to confirm exact delivery timing.'
                : 'Your payment was recorded successfully. A digital receipt has been sent to your email.'}
            </p>
          </div>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background py-3.5 rounded-xl font-medium text-sm tracking-wide hover:bg-primary transition-all shadow-md"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen container mx-auto px-6 flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
          <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Preparing checkout...
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm">
          Explore our collection and add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-primary transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  const inputClasses =
    'w-full border border-border bg-background/50 focus:bg-background rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/60';

  return (
    <div className="pt-28 pb-20 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header section */}
        <div className="mb-8 border-b border-border/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Checkout</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Secure SSL Encrypted Checkout
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Form Section */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Info */}
            <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <span className="w-7 h-7 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                <h2 className="text-base font-semibold text-foreground tracking-wide uppercase">
                  Shipping & Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-foreground/80">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.customerName}
                    onChange={handleChange('customerName')}
                    className={inputClasses}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-foreground/80">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.customerEmail}
                    onChange={handleChange('customerEmail')}
                    className={inputClasses}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-foreground/80">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={handleChange('customerPhone')}
                  className={inputClasses}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-foreground/80">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.shippingAddress}
                  onChange={handleChange('shippingAddress')}
                  className={`${inputClasses} resize-none`}
                  placeholder="Street address, city, ward number, landmarks"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-foreground/80">
                  Special Notes <span className="text-muted-foreground/60 lowercase">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={handleChange('notes')}
                  className={`${inputClasses} resize-none`}
                  placeholder="Drop off instructions or delivery preferences"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <span className="w-7 h-7 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                <h2 className="text-base font-semibold text-foreground tracking-wide uppercase">
                  Select Payment Option
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                
                {/* Cash on Delivery Option */}
                <label
                  className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                      : 'border-border/70 hover:border-foreground/30 bg-background/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="accent-primary w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay with cash upon package receipt</p>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </label>

                {/* eSewa Option (Coming Soon) */}
                <label
                  className="border border-border/40 rounded-xl p-4 flex items-center justify-between cursor-not-allowed bg-muted/20 opacity-60"
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      disabled
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={paymentMethod === 'esewa'}
                      className="accent-emerald-600 w-4 h-4 cursor-not-allowed"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        eSewa Wallet
                        <span className="text-[10px] bg-muted text-muted-foreground font-medium px-2 py-0.5 rounded-md border border-border/50">
                          Coming Soon
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">Online gateway integration in progress</p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </label>

                {/* Khalti Option (Coming Soon) */}
                <label
                  className="border border-border/40 rounded-xl p-4 flex items-center justify-between cursor-not-allowed bg-muted/20 opacity-60"
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      disabled
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      checked={paymentMethod === 'khalti'}
                      className="accent-purple-600 w-4 h-4 cursor-not-allowed"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Khalti Digital Wallet
                        <span className="text-[10px] bg-muted text-muted-foreground font-medium px-2 py-0.5 rounded-md border border-border/50">
                          Coming Soon
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">Khalti payment portal support coming soon</p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </label>

                {/* Fonepay / QR Option (Coming Soon) */}
                <label
                  className="border border-border/40 rounded-xl p-4 flex items-center justify-between cursor-not-allowed bg-muted/20 opacity-60"
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      disabled
                      type="radio"
                      name="paymentMethod"
                      value="qr"
                      checked={paymentMethod === 'qr'}
                      className="accent-rose-600 w-4 h-4 cursor-not-allowed"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Fonepay / Bank Mobile App QR
                        <span className="text-[10px] bg-muted text-muted-foreground font-medium px-2 py-0.5 rounded-md border border-border/50">
                          Coming Soon
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">Dynamic QR scanning support coming soon</p>
                    </div>
                  </div>
                  <QrCode className="w-5 h-5 text-muted-foreground" />
                </label>

              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-foreground text-background py-4 rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-primary transition-all shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Confirm & Place Order
                </>
              )}
            </button>
          </form>

          {/* Sticky Order Summary Side Panel */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-bold text-foreground pb-4 border-b border-border/60">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3.5 items-center">
                    <div className="w-14 h-14 bg-muted rounded-lg border border-border shrink-0 overflow-hidden relative">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0 right-0 bg-foreground/80 text-background text-[10px] font-bold px-1.5 py-0.5 rounded-bl">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Unit: NPR {item.price.toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      NPR {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/60 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">NPR {cart?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="text-xs text-emerald-600 font-medium">Calculated at delivery</span>
                </div>
                <div className="border-t border-border/60 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-base text-foreground">Total Amount</span>
                  <span className="font-bold text-xl text-primary">
                    NPR {cart?.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-muted/40 rounded-xl p-3.5 border border-border/40 text-xs text-muted-foreground flex items-start gap-2.5">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>All transactions are guarded by 256-bit encryption. Cash payments can be verified on arrival.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modernized QR Payment Dialog / Modal */}
      {qrModalData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border p-6 rounded-2xl max-w-sm w-full text-center space-y-5 shadow-2xl relative">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Scan & Pay
              </span>
              <h3 className="font-serif text-2xl font-bold text-foreground mt-2">Fonepay / Bank QR</h3>
              <p className="text-xs text-muted-foreground">Order Reference #{qrModalData.orderId}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-border shadow-inner inline-block relative">
              <img src={qrModalData.qrImageUrl} alt="Payment QR" className="w-48 h-48 mx-auto" />
            </div>

            <div className="space-y-1.5 bg-muted/30 p-3 rounded-xl border border-border/50 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-semibold text-foreground">{qrModalData.accountName}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Total Payable:</span>
                <span className="font-bold text-base text-primary">NPR {qrModalData.amount.toFixed(2)}</span>
              </div>
              {qrModalData.instructions && (
                <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/40 mt-1">
                  {qrModalData.instructions}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setQrModalData(null);
                setOrderPlaced({ id: qrModalData.orderId, method: 'qr' });
              }}
              className="w-full bg-foreground text-background py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-primary transition-all shadow-md"
            >
              I Have Completed Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}