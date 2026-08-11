import { useState } from "react";
import { Mail, MapPin, Instagram, Facebook, Linkedin, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(form.subject || "Website inquiry");
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );

    window.location.href = `mailto:8848labs@gmail.com?subject=${subject}&body=${body}`;
    toast({ title: "Opening your email client..." });
  };

  const inputClasses =
    "w-full rounded-2xl border border-neutral-200/90 bg-white/80 px-5 py-3.5 text-sm font-sans text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 shadow-2xs";

  return (
    <div className="relative pt-32 pb-28 md:pb-36 bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Ambient Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <SectionHeading title="Contact Us" label="01 / Get In Touch" />
          <p className="mt-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-2xl">
            Have a question about an order, a custom parametric project in mind, or want to collaborate? Send us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 p-8 md:p-10 rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-medium text-neutral-600">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    className={inputClasses}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-medium text-neutral-600">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className={inputClasses}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-medium text-neutral-600">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={handleChange("subject")}
                  className={inputClasses}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-medium text-neutral-600">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange("message")}
                  className={`${inputClasses} resize-none`}
                  placeholder="Tell us a bit more about your project..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors duration-300 shadow-md group"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Contact Info Card */}
            <div className="p-8 rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs space-y-8">
              
              <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-4 text-amber-800 font-mono text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Direct Channels</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Email Enquiries
                  </h3>
                  <a
                    href="mailto:8848labs@gmail.com"
                    className="text-base font-serif text-neutral-900 hover:text-amber-700 transition-colors"
                  >
                    8848labs@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Fabrication Studio
                  </h3>
                  <p className="text-base font-serif text-neutral-900">
                    Kathmandu, Nepal
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="p-8 rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
                Follow Our Process
              </h3>
              
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/wattheprint?igsh=MTRodXNlcjh5cXR2NA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-11 h-11 rounded-2xl border border-neutral-200/90 bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-amber-700 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all duration-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-11 h-11 rounded-2xl border border-neutral-200/90 bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-amber-700 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-11 h-11 rounded-2xl border border-neutral-200/90 bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-amber-700 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}