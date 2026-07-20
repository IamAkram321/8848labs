import { Link } from "wouter";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTiktok } from "react-icons/fa";

const socials = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/wattheprint?igsh=MTRodXNlcjh5cXR2NA==" },
  { icon: FaFacebookF, label: "Facebook",  href: "https://www.facebook.com"  },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com"  },
  { icon: FaTiktok,    label: "TikTok",   href: "https://www.tiktok.com/@watheprint?_r=1&_t=ZS-980FNhow3im"    },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-foreground text-background py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.jpeg" alt="8848LABS" className="h-20 w-auto brightness-110" />
            </Link>
            <p className="text-muted/80 text-sm max-w-xs leading-relaxed mb-6">
              Ideas. Made Tangible.<br />
              Premium 3D printing and custom manufacturing studio based in Nepal.
            </p>
            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center text-muted/70 hover:text-primary hover:border-primary transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-6 text-muted">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-sm text-muted/80 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/collections" className="text-sm text-muted/80 hover:text-primary transition-colors">Collections</Link></li>
              <li><Link href="/custom-studio" className="text-sm text-muted/80 hover:text-primary transition-colors">Custom Order Studio</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-6 text-muted">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-muted/80 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/projects" className="text-sm text-muted/80 hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/contact" className="text-sm text-muted/80 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-6 text-muted">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm text-muted/80 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm text-muted/80 hover:text-primary transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="text-sm text-muted/80 hover:text-primary transition-colors">Returns</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted/80 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted/80 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted/60">
          <p>&copy; {currentYear} 8848LABS. All rights reserved.</p>
          <p className="mt-4 md:mt-0 uppercase tracking-widest">Designed digitally. Built physically.</p>
        </div>
      </div>
    </footer>
  );
}
