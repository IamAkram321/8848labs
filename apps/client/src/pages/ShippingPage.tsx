import { Link } from 'wouter';
import { Package, Clock, MapPin, Truck } from 'lucide-react';

const sections = [
  {
    icon: Clock,
    title: 'Production Time',
    body: 'Every piece is made to order — we don\'t hold mass inventory, so quality and precision come first. In-stock designs typically leave our workshop within 3-5 business days of your order. Custom Studio projects vary based on complexity, and we\'ll confirm a timeline once your request is reviewed.',
  },
  {
    icon: MapPin,
    title: 'Delivery Areas',
    body: 'We currently ship across Nepal, with delivery times depending on your location. Orders within Kathmandu Valley typically arrive faster than those to other regions. If you\'re outside Nepal and interested in an order, reach out through our Contact page and we\'ll see what\'s possible.',
  },
  {
    icon: Truck,
    title: 'Delivery Time',
    body: 'Once your order ships, expect delivery within 2-5 business days depending on your location. You\'ll be notified as your order moves through production and out for delivery.',
  },
  {
    icon: Package,
    title: 'Packaging',
    body: 'Every piece is carefully packed to prevent damage in transit — 3D printed items can be delicate, so we take extra care with padding and box selection, especially for larger or more intricate designs.',
  },
];

export default function ShippingPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Support
        </span>
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Shipping & Delivery</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-16">
          Everything you need to know about how your order gets from our workshop to your door.
        </p>

        <div className="space-y-12 mb-16">
          {sections.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-6">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl mb-3">{title}</h2>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border p-8">
          <h3 className="font-serif text-xl mb-3">Payment on Delivery</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We currently operate on Cash on Delivery (COD) — you only pay once your order arrives
            and you've had a chance to check it over.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Questions about a specific order?{' '}
            <Link href="/contact" className="text-primary underline underline-offset-4">
              Contact us
            </Link>{' '}
            and we'll help however we can.
          </p>
        </div>
      </div>
    </div>
  );
}