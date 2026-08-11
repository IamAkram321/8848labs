import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTiktok,
  FaArrowRight,
} from "react-icons/fa";

const socials = [
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/wattheprint?igsh=MTRodXNlcjh5cXR2NA==",
  },
  {
    icon: FaFacebookF,
    label: "Facebook",
    href: "https://www.facebook.com",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    href: "https://www.linkedin.com",
  },
  {
    icon: FaTiktok,
    label: "TikTok",
    href: "https://www.tiktok.com/@watheprint?_r=1&_t=ZS-980FNhow3im",
  },
];

const exploreLinks = [
  { title: "Shop Studio", href: "/shop" },
  { title: "Collections", href: "/collections" },
  { title: "Custom Lab", href: "/custom-studio" },
  { title: "Selected Projects", href: "/projects" },
];

const companyLinks = [
  { title: "About 8848", href: "/about" },
  { title: "Get in Touch", href: "/contact" },
  { title: "FAQ & Guide", href: "/faq" },
  { title: "Shipping & Terms", href: "/shipping" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#050505] text-neutral-200 pt-24 pb-12 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* ================= Ambient Background Effects ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Bronze Glow */}
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-b from-amber-600/10 via-amber-900/5 to-transparent blur-[160px]" />

        {/* Minimalist Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />

        {/* Giant Watermark Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 0.03, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 font-serif text-[28vw] font-light tracking-[0.1em] text-amber-100 whitespace-nowrap select-none pointer-events-none z-0"
        >
          8848
        </motion.h1>
      </div>

      <div className="container mx-auto max-w-7xl px-6 lg:px-12 relative z-10">

        {/* ================= Hero CTA Card ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-24 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-neutral-900/60 via-neutral-950/80 to-black/90 p-8 sm:p-12 lg:p-16 backdrop-blur-xl overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-[0.4em] font-mono text-amber-400/80">
                Precision & Innovation
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight leading-tight">
                Ready to bring your <br />
                <span className="italic font-normal bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent pr-2">
                  vision into reality?
                </span>
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-lg leading-relaxed pt-1">
                From high-precision rapid prototypes to additive batch production, our team is equipped to engineer your standard.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-4">
              <Link href="/custom-studio">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-medium text-sm px-8 py-4 rounded-full shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:shadow-[0_0_35px_rgba(251,191,36,0.4)] transition-all cursor-pointer"
                >
                  Start Custom Order
                  <FaArrowRight className="text-xs" />
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ================= Main Footer Grid ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/[0.08]">
          
          {/* Brand Info (Left) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <img
                  src="/logo.jpeg"
                  alt="8848LABS Logo"
                  className="h-14 w-auto rounded-lg border border-white/10 p-1 bg-black/50 backdrop-blur-md"
                />
                <span className="font-serif text-2xl font-light tracking-widest text-white uppercase">
                  8848<span className="text-amber-400 font-normal">LABS</span>
                </span>
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400/90 pl-1 font-medium">
                A Venture of Pathak and Sons
              </p>
            </div>

            <p className="text-neutral-400 leading-relaxed text-sm max-w-md font-light">
              Ideas become physical reality through high-grade additive engineering, precision digital manufacturing, and refined craftsmanship. Built at 8848 standard.
            </p>

            {/* Social Icons */}
            <div className="space-y-4">
              <p className="uppercase tracking-[0.35em] text-[10px] text-amber-400/80 font-mono">
                Connect With Us
              </p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative w-11 h-11 rounded-full border border-white/10 bg-neutral-900/50 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-amber-500/50 hover:bg-neutral-800/80"
                    aria-label={label}
                  >
                    <Icon
                      size={16}
                      className="text-neutral-400 transition-colors duration-300 group-hover:text-amber-300"
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {/* Explore */}
            <div className="space-y-6">
              <p className="uppercase tracking-[0.3em] text-[11px] text-amber-400/80 font-mono">
                Explore
              </p>
              <ul className="space-y-4">
                {exploreLinks.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <p className="uppercase tracking-[0.3em] text-[11px] text-amber-400/80 font-mono">
                Company
              </p>
              <ul className="space-y-4">
                {companyLinks.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Studio Detail (Right) */}
          <div className="lg:col-span-3 space-y-6">
            <p className="uppercase tracking-[0.3em] text-[11px] text-amber-400/80 font-mono">
              Contact Studio
            </p>

            <div className="space-y-5 text-sm">
              <div>
                <span className="text-neutral-500 text-xs block mb-1 font-mono uppercase tracking-wider">Direct Mail</span>
                <a
                  href="mailto:hello@8848labs.com"
                  className="font-serif text-lg text-neutral-200 hover:text-amber-300 transition-colors"
                >
                  hello@8848labs.com
                </a>
              </div>

              <div>
                <span className="text-neutral-500 text-xs block mb-1 font-mono uppercase tracking-wider">Headquarters</span>
                <p className="text-neutral-300 font-light">Kathmandu, Nepal</p>
              </div>

              <div>
                <span className="text-neutral-500 text-xs block mb-1 font-mono uppercase tracking-wider">Capabilities</span>
                <p className="text-neutral-400 text-xs leading-relaxed font-light">
                  Additive Manufacturing • Rapid Prototyping • Custom Industrial Design
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ================= Bottom Bar ================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div>
            © {currentYear} <span className="text-neutral-300 font-medium">8848LABS</span>. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
            <span>Designed Digitally</span>
            <span className="h-1 w-1 rounded-full bg-amber-500/40" />
            <span>Engineered Physically</span>
          </div>

          <div>
            Kathmandu, Nepal
          </div>
        </div>

      </div>
    </footer>
  );
}