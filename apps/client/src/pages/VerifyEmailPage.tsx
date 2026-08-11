import { Link } from 'wouter';

export default function VerifyEmailPage() {
  const status = new URLSearchParams(window.location.search).get('status');
  const success = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center mb-8">
          <img src="/logo.jpeg" alt="8848LABS" className="h-16 w-auto" />
        </Link>

        {success ? (
          <>
            <h1 className="text-2xl font-serif text-foreground mb-4">Email verified</h1>
            <p className="text-muted-foreground mb-8">
              Your email has been confirmed. You can now sign in.
            </p>
            <Link
              href="/login"
              className="inline-block bg-foreground text-background px-8 py-3 rounded-lg text-sm font-medium hover:bg-primary transition-colors"
            >
              Sign In
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-serif text-foreground mb-4">Link expired or invalid</h1>
            <p className="text-muted-foreground mb-8">
              This verification link is no longer valid. Try signing up again to get a fresh one.
            </p>
            <Link href="/signup" className="text-sm text-primary hover:underline">
              Back to sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}