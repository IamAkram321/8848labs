const sections = [
  {
    title: '1. Overview',
    body: `These Terms & Conditions govern your use of the 8848LABS website and any products or services ordered through it. By placing an order or creating an account, you agree to these terms.`,
  },
  {
    title: '2. Orders & Pricing',
    body: `All prices listed are subject to change without notice. We reserve the right to refuse or cancel any order at our discretion, including in cases of suspected fraud, pricing errors, or inability to fulfil production. If an order is cancelled after payment, we'll notify you and issue a refund where applicable.`,
  },
  {
    title: '3. Custom Studio Orders',
    body: `Custom Studio submissions are reviewed by our team before production begins. Submitting a request does not guarantee we can produce it — we'll confirm feasibility, pricing, and timeline before any work starts. Once you approve a custom design and production begins, the order cannot be cancelled.`,
  },
  {
    title: '4. Payment',
    body: `We currently accept payment via Cash on Delivery (COD). Payment is due in full at the time of delivery.`,
  },
  {
    title: '5. Product Accuracy',
    body: `We make every effort to display product colors, textures, and dimensions accurately. However, due to the nature of 3D printing and photography, slight variations between the listing and the final product may occur.`,
  },
  {
    title: '6. Intellectual Property',
    body: `All designs, images, and content on this site are the property of 8848LABS unless otherwise stated. For Custom Studio orders where you provide your own design or reference, you confirm you have the right to use and share that material with us for production purposes.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `8848LABS is not liable for indirect, incidental, or consequential damages arising from the use of our products. Our liability in all cases is limited to the value of the order in question.`,
  },
  {
    title: '8. Changes to These Terms',
    body: `We may revise these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.`,
  },
];

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Legal
        </span>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-16">Last updated: July 2026</p>

        <p className="text-muted-foreground leading-relaxed mb-12">
          Please read these terms carefully before using 8848LABS or placing an order with us.
        </p>

        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-serif text-xl mb-3">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="border border-border p-8 mt-16">
          <h3 className="font-serif text-xl mb-3">Questions about these terms?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Reach out through our Contact page and we'll be happy to clarify.
          </p>
        </div>
      </div>
    </div>
  );
}