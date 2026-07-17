import { useState } from 'react';
import { Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(form.subject || 'Website inquiry');
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );

    window.location.href = `mailto:hello@8848labs.com?subject=${subject}&body=${body}`;
    toast({ title: 'Opening your email client...' });
  };

  const inputClasses =
    'w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors';

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Contact Us</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-16 max-w-2xl">
          Have a question about an order, a custom project in mind, or just want to say hello?
          Send us a message and we'll get back to you as soon as we can.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                  Name
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className={inputClasses}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={inputClasses}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                className={inputClasses}
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 font-semibold">
                Message
              </label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={handleChange('message')}
                className={inputClasses}
                placeholder="Tell us a bit more..."
              />
            </div>

            <button
              type="submit"
              className="bg-foreground text-background px-10 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider font-semibold mb-1">Email</h3>
                <a
                  href="mailto:hello@8848labs.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  hello@8848labs.com
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider font-semibold mb-1">Studio</h3>
                <p className="text-muted-foreground">Kathmandu, Nepal</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/wattheprint?igsh=MTRodXNlcjh5cXR2NA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}