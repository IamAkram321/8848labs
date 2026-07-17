import { Link } from 'wouter';

export default function ReturnsPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Support
        </span>
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Returns & Refunds</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-16">
          Because every piece is made to order, our return policy works a little differently
          from typical retail. Here's how it works.
        </p>

        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-2xl mb-3">Made-to-Order Items</h2>
            <p className="text-muted-foreground leading-relaxed">
              Most of our products are 3D printed specifically for your order rather than pulled
              from stock. Because of this, we're generally unable to accept returns for change of
              mind. We'd rather you love what you ordered — if you have questions about size,
              material, or finish before buying, reach out and we'll help you decide.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">Damaged or Defective Items</h2>
            <p className="text-muted-foreground leading-relaxed">
              If your order arrives damaged, defective, or doesn't match what you ordered, let us
              know within 48 hours of delivery with photos of the issue. We'll arrange a
              replacement or refund at no extra cost to you.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">Custom Studio Orders</h2>
            <p className="text-muted-foreground leading-relaxed">
              Custom-designed pieces are non-refundable once production has started, since they're
              built specifically to your specifications. We'll always confirm final design details
              with you before printing begins to avoid surprises.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">How Refunds Work</h2>
            <p className="text-muted-foreground leading-relaxed">
              Approved refunds are processed within a few business days. Since orders are paid via
              Cash on Delivery, refunds for undelivered issues are typically handled directly with
              our team rather than through a payment provider.
            </p>
          </div>
        </div>

        <div className="border border-border p-8 mt-16">
          <h3 className="font-serif text-xl mb-3">Have an issue with your order?</h3>
          <p className="text-muted-foreground leading-relaxed">
            <Link href="/contact" className="text-primary underline underline-offset-4">
              Contact us
            </Link>{' '}
            with your order number and details — we'll sort it out as quickly as we can.
          </p>
        </div>
      </div>
    </div>
  );
}