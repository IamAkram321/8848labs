import { Link } from 'wouter';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const faqs = [
  {
    category: 'Ordering',
    items: [
      {
        q: 'How does 3D printing work for custom orders?',
        a: 'Submit your idea through our Custom Studio with as much detail as possible — sketches, references, or dimensions. Our team reviews it, confirms feasibility and pricing, and once approved, we move straight into printing.',
      },
      {
        q: 'Can I order more than one of the same product?',
        a: 'Yes — just adjust the quantity on the product page before adding it to your cart. For larger bulk orders, reach out through our Contact page and we\'ll quote accordingly.',
      },
      {
        q: 'Do you offer design consultations for custom projects?',
        a: 'Yes. For complex custom pieces, we\'re happy to discuss design direction before production begins. Mention this when submitting your request in the Custom Studio.',
      },
    ],
  },
  {
    category: 'Production & Materials',
    items: [
      {
        q: 'What materials do you print with?',
        a: 'We primarily use PLA+ and PETG, chosen for their strength, finish quality, and reliability. Specific material options are listed on each product page.',
      },
      {
        q: 'How long does production take?',
        a: 'Most in-stock items are made to order and ship within 3-5 business days. Custom Studio projects vary based on complexity — we\'ll give you a timeline once your request is reviewed.',
      },
      {
        q: 'Can I request a specific color?',
        a: 'Where available, color options are shown on the product page. For custom projects, mention your preferred color when submitting your request.',
      },
    ],
  },
  {
    category: 'Payment & Orders',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We currently operate on Cash on Delivery (COD) — you pay when your order arrives at your doorstep.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'If production hasn\'t started yet, we\'re happy to help. Contact us as soon as possible with your order number and we\'ll do our best to accommodate changes.',
      },
      {
        q: 'How do I track my order?',
        a: 'If you have an account, you can view your order status by signing in. Otherwise, we\'ll keep you updated by email as your order moves through production and shipping.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Support
        </span>
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-16">
          Answers to the questions we hear most often. Can't find what you're looking for?{' '}
          <Link href="/contact" className="text-primary underline underline-offset-4">
            Get in touch
          </Link>
          .
        </p>

        <div className="space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="border-t border-border">
                {section.items.map((item, i) => (
                  <AccordionItem key={i} value={`${section.category}-${i}`} className="border-border">
                    <AccordionTrigger className="text-left font-serif text-lg py-6 hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}