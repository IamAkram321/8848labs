import { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Send, 
  Sparkles, 
  Clock, 
  MessageSquare,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = encodeURIComponent(form.subject || "Website Inquiry - 8848 Labs");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    setTimeout(() => {
      window.location.href = `mailto:8848labs@gmail.com?subject=${subject}&body=${body}`;
      setIsSubmitting(false);
      setSubmitted(true);
      toast({ 
        title: "Dispatching Message",
        description: "Opening your default email client...",
      });
    }, 600);
  };

  const inputClasses =
    "w-full rounded-2xl border border-neutral-300/80 bg-white/90 px-5 py-3.5 text-sm font-sans text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 shadow-2xs";

  return (
    <div className="relative pt-32 lg:pt-36 pb-24 bg-[#F7F6F2] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Background Blueprint Grid & Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
        <div className="absolute -right-20 top-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/10 to-transparent blur-[140px]" />
        <div className="absolute -left-20 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/20 to-transparent blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-6xl">
        
        {/* Header Section with Fixed Tight Spacing */}
        <div className="mb-8 md:mb-10 max-w-3xl space-y-2">
          <SectionHeading title="Contact Us" label="01 / Get In Touch" />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-neutral-600 text-base md:text-lg font-light leading-relaxed !mt-2"
          >
            Have a parametric design project in mind, an additive manufacturing enquiry, or a custom order request? Drop us a line below and our engineering team will respond within 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border border-neutral-300/80 bg-white/90 backdrop-blur-md shadow-2xs relative"
          >
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-neutral-200/80">
              <MessageSquare className="w-4 h-4 text-amber-700" />
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                Direct Communication Portal
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-medium text-neutral-600">
                    Full Name <span className="text-amber-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    className={inputClasses}
                    placeholder="e.g. Alex Mercer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-medium text-neutral-600">
                    Email Address <span className="text-amber-600">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className={inputClasses}
                    placeholder="alex@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-medium text-neutral-600">
                  Subject Header
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={handleChange("subject")}
                  className={inputClasses}
                  placeholder="Custom Prototyping / General Enquiry"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-medium text-neutral-600">
                  Project Details / Message <span className="text-amber-600">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange("message")}
                  className={`${inputClasses} resize-none`}
                  placeholder="Tell us about your project dimensions, material preferences, or fabrication requirements..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors duration-300 shadow-md group disabled:opacity-50 cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.span 
                      key="submitted"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Client Opened
                    </motion.span>
                  ) : (
                    <motion.span 
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex items-center gap-2"
                    >
                      <span>{isSubmitting ? "Preparing Mail..." : "Send Message"}</span>
                      <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Channels Card */}
            <div className="p-8 rounded-3xl border border-neutral-300/80 bg-white/90 backdrop-blur-md shadow-2xs space-y-7">
              <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-4 text-amber-800 font-mono text-xs uppercase tracking-widest font-semibold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Direct Channels</span>
              </div>

              {/* Email Block */}
              <div className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-800 transition-colors duration-300 group-hover:bg-amber-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium">
                    Email Inquiries
                  </h3>
                  <a
                    href="mailto:8848labs@gmail.com"
                    className="inline-flex items-center gap-1 text-base font-serif text-neutral-900 hover:text-amber-700 transition-colors font-normal"
                  >
                    <span>8848labs@gmail.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </div>
              </div>

              {/* Location Block */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-800">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium">
                    Fabrication Facility
                  </h3>
                  <p className="text-base font-serif text-neutral-900 font-normal">
                    Kathmandu, Nepal
                  </p>
                </div>
              </div>

              {/* Response Time Indicator */}
              <div className="flex items-start gap-4 pt-2 border-t border-neutral-200/60">
                <div className="w-11 h-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium">
                    Operational Hours
                  </h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Mon — Sat: 09:00 - 18:00 NST<br />
                    Average Response Time: &lt; 12 hrs
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links Block */}
            <div className="p-8 rounded-3xl border border-neutral-300/80 bg-white/90 backdrop-blur-md shadow-2xs space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium">
                Follow Studio Process
              </h3>
              
              <div className="flex items-center gap-3">
                {[
                  {
                    name: "Instagram",
                    href: "https://www.instagram.com/wattheprint?igsh=MTRodXNlcjh5cXR2NA==",
                    icon: Instagram,
                  },
                  {
                    name: "Facebook",
                    href: "https://www.facebook.com",
                    icon: Facebook,
                  },
                  {
                    name: "LinkedIn",
                    href: "https://www.linkedin.com",
                    icon: Linkedin,
                  },
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-amber-800 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}