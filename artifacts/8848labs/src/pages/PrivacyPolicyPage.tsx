const sections = [
  {
    title: '1. Information We Collect',
    body: `When you use 8848LABS, we may collect: your name and email address (via Google Sign-In or when you place an order), shipping address and phone number (when checking out), and order history. If you sign in with Google, we receive your basic profile information — name, email, and profile photo — from Google.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use your information to process and fulfil orders, communicate with you about your order status, respond to inquiries submitted through our Custom Studio or Contact page, and improve our products and services. We do not sell your personal information to third parties.`,
  },
  {
    title: '3. Cookies & Sessions',
    body: `We use cookies to keep track of your shopping cart and to keep you signed in between visits. These cookies are necessary for the site to function properly and are not used for third-party advertising.`,
  },
  {
    title: '4. Data Sharing',
    body: `We do not share your personal information with third parties except where necessary to fulfil your order (such as delivery coordination) or where required by law. Authentication is handled through Google Sign-In, subject to Google's own privacy policy.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain your account and order information for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes.`,
  },
  {
    title: '6. Your Rights',
    body: `You can request access to, correction of, or deletion of your personal data at any time by contacting us. If you signed in with Google, you can also revoke 8848LABS's access from your Google Account settings at any time.`,
  },
  {
    title: '7. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Legal
        </span>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-16">Last updated: July 2026</p>

        <p className="text-muted-foreground leading-relaxed mb-12">
          At 8848LABS, we respect your privacy and are committed to protecting the personal
          information you share with us. This policy explains what we collect, how we use it, and
          the choices you have.
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
          <h3 className="font-serif text-xl mb-3">Questions about your data?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Reach out through our Contact page and we'll be happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}