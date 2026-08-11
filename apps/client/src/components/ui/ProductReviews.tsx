import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-url';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

function StarRow({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= Math.round(rating) ? 'fill-primary text-primary' : 'text-border'}`}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star`}>
          <Star className={`w-7 h-7 transition-colors ${n <= value ? 'fill-primary text-primary' : 'text-border hover:text-muted-foreground'}`} />
        </button>
      ))}
    </div>
  );
}

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = () => {
    fetch(`${API_URL}/api/products/${productId}/reviews`)
      .then((res) => (res.ok ? res.json() : { reviews: [] }))
      .then((data) => setReviews(data.reviews ?? []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const existingReview = user ? reviews.find((r) => r.customerName === user.name) : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: 'Please select a star rating', variant: 'destructive' });
      return;
    }
    if (!comment.trim()) {
      toast({ title: 'Please write a comment', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating, title: title.trim() || undefined, comment: comment.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.error ?? 'Could not submit review', variant: 'destructive' });
        return;
      }

      toast({ title: 'Review submitted — thank you!' });
      setShowForm(false);
      setRating(0);
      setTitle('');
      setComment('');
      loadReviews();
    } catch {
      toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-border pt-16 mt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-serif text-3xl mb-3">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="flex items-center gap-3">
              <StarRow rating={average} size="w-5 h-5" />
              <span className="text-muted-foreground">
                {average.toFixed(1)} out of 5 &middot; {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet — be the first.</p>
          )}
        </div>

        {user && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-foreground text-background px-6 py-3 uppercase tracking-widest text-xs font-medium hover:bg-primary transition-colors self-start md:self-auto"
          >
            {existingReview ? 'Edit Your Review' : 'Write a Review'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-6 mb-12 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">Your Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Sum it up in a few words"
            />
          </div>
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">Your Review</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="What did you think of this product?"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-foreground text-background px-8 py-3 uppercase tracking-widest text-xs font-medium hover:bg-primary transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Loading reviews...</p>
      ) : (
        <div className="space-y-8 max-w-3xl">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <StarRow rating={review.rating} />
                  {review.verifiedPurchase && (
                    <span className="text-xs uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              {review.title && <h4 className="font-serif text-lg mb-1">{review.title}</h4>}
              <p className="text-muted-foreground leading-relaxed mb-2">{review.comment}</p>
              <p className="text-sm font-medium">{review.customerName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}