import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, LogOut, Package, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Shop", path: "/shop" },
  { label: "Collections", path: "/collections" },
  { label: "Custom Studio", path: "/custom-studio", accent: true },
  { label: "Projects", path: "/projects" },
  { label: "About", path: "/about" },
  { label: "Contact Us", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "100%" },
};

const mobileLinkListVariants = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const mobileLinkItemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Navbar() {
  const [location] = useLocation();
  const { cartItemCount } = useCart();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomepage = location === "/";
  const isSolid = isScrolled || !isHomepage;
  const navBg = isSolid ? "bg-background/90 backdrop-blur-md border-b border-border/50" : "bg-transparent border-transparent";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div
        className={`container mx-auto px-6 flex items-center justify-between transition-[height] duration-300 ${
          isSolid ? "h-20" : "h-24"
        }`}
      >
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <img
            src="/logo.jpeg"
            alt="8848LABS"
            className={`w-auto object-contain transition-all duration-300 ${isSolid ? "h-14" : "h-16"}`}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`group relative text-sm uppercase tracking-widest transition-colors hover:text-primary py-1 ${
                  isActive || link.accent ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-px bg-primary transition-transform duration-300 ease-out origin-left ${
                    isActive ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-6">
          <Link
            href="/cart"
            className="relative text-foreground transition-all hover:text-primary hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Account */}
          <div className="relative hidden md:block">
            {user ? (
              <>
                <button
                  onClick={() => setIsAccountMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-foreground transition-all hover:text-primary hover:-translate-y-0.5"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-transparent transition-all group-hover:ring-primary/30"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isAccountMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isAccountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-3 w-48 rounded-lg border border-border bg-card shadow-xl py-2"
                    >
                      <div className="px-4 py-2 text-sm text-foreground truncate">{user.name}</div>
                      <Link
                        href="/orders"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm uppercase tracking-widest text-foreground transition-colors hover:text-primary"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-foreground transition-transform hover:scale-110"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-border">
              <img src="/logo.jpeg" alt="8848LABS" className="h-10 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>

            <motion.nav
              variants={mobileLinkListVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto"
            >
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={mobileLinkItemVariants}>
                  <Link
                    href={link.path}
                    className={`text-2xl font-serif transition-colors border-b border-border/50 pb-4 block ${
                      link.accent ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={mobileLinkItemVariants} className="border-b border-border/50 pb-4">
                {user ? (
                  <div className="space-y-4">
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 text-2xl font-serif text-foreground hover:text-primary transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-2xl font-serif text-foreground hover:text-primary transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-2xl font-serif text-foreground hover:text-primary transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}