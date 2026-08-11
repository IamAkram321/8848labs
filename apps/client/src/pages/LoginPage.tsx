import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-url';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
// Client-side heuristic only — the server independently enforces its own
// CAPTCHA requirement once an account has failed enough real attempts. This
// local counter just decides when to proactively show the widget so a
// legitimate user isn't surprised by a hidden server-side gate.
const SHOW_CAPTCHA_AFTER_FAILURES = 2;

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function LoginPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  const captchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (!isLoading && user) {
      window.location.href = isAdmin ? '/admin' : '/';
    }
  }, [isLoading, user, isAdmin]);

  const showCaptcha = failureCount >= SHOW_CAPTCHA_AFTER_FAILURES && !!RECAPTCHA_SITE_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const captchaToken = captchaRef.current?.getValue() || undefined;

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, captchaToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFailureCount((c) => c + 1);
        captchaRef.current?.reset();
        toast({ title: data.error ?? 'Could not sign in', variant: 'destructive' });
        return;
      }

      // Full reload so AuthContext re-fetches /auth/me with the new session cookie.
      window.location.href = data.user?.role === 'ADMIN' ? '/admin' : '/';
    } catch {
      toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center mb-8">
          <img src="/logo.jpeg" alt="8848LABS" className="h-16 w-auto" />
        </Link>

        <h1 className="text-3xl font-serif text-foreground mb-2 text-center">Welcome back</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Sign in to track orders, save favorites, and manage your custom projects.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-card px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-card px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          {showCaptcha && (
            <div className="flex justify-center pt-1">
              <ReCAPTCHA ref={captchaRef} sitekey={RECAPTCHA_SITE_KEY!} />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-foreground text-background py-3 rounded-lg text-sm font-medium hover:bg-primary transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center text-muted-foreground mb-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-background px-3 text-muted-foreground">Or</span>
          </div>
        </div>

        <button
          onClick={() => {
            window.location.href = `${API_URL}/api/auth/google`;
          }}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-primary">Terms</Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}