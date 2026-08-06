import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LogOut,
  Package,
  ChevronDown,
  Sparkles,
} from "lucide-react";
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
  hidden: { opacity: 0, scale: 0.98, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -10 },
};

const mobileLinkListVariants = {
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const mobileLinkItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 pt-3">
      <div
        className={`mx-auto max-w-7xl rounded-full transition-all duration-500 ${isSolid
            ? "bg-white/80 backdrop-blur-xl border border-neutral-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] py-2"
            : "bg-transparent border border-transparent py-4"
          }`}
      >
        <div className="px-5 sm:px-8 flex items-center justify-between h-14 sm:h-16">

          {/* Transparent-Blend Logo Section */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-all duration-300 hover:opacity-90"
          >
            <div className="relative flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="8848LABS Logo"
                className={`w-auto object-contain transition-all duration-300 mix-blend-multiply filter contrast-125 brightness-95 ${isSolid ? "h-16 sm:h-20 lg:h-24" : "h-20 sm:h-24 lg:h-28"
                  }`}
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-serif text-lg font-semibold tracking-[0.18em] text-neutral-900 leading-none">
                8848<span className="text-amber-500 font-bold">LABS</span>
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-500 uppercase mt-1">
                Additive Studio
              </span>
            </div>
          </Link>

          {/* High-Contrast Desktop Nav Pill */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 bg-neutral-900/90 p-1.5 rounded-full border border-neutral-800 shadow-lg backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 ${isActive
                      ? "text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                      : link.accent
                        ? "text-amber-400 font-medium hover:text-amber-300 hover:bg-amber-500/10"
                        : "text-neutral-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {link.accent && <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full border border-neutral-200 bg-white/90 text-neutral-800 shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:text-amber-600 hover:shadow-md"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-[0_2px_8px_rgba(245,158,11,0.4)]"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Account Menu */}
            <div className="relative hidden md:block">
              {user ? (
                <>
                  <button
                    onClick={() => setIsAccountMenuOpen((v) => !v)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-neutral-200 bg-white/90 text-neutral-800 shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-md"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-amber-500/50"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 ${isAccountMenuOpen ? "rotate-180 text-amber-600" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-52 rounded-2xl border border-neutral-200 bg-white shadow-2xl p-2 z-50 overflow-hidden"
                      >
                        <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                          <p className="text-xs text-neutral-400 font-mono">Signed in as</p>
                          <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                        </div>
                        <Link
                          href="/orders"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-700 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-amber-500" />
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors"
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
                  className="px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 font-mono text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Navigation Toggle */}
            <button
              className="lg:hidden p-2.5 rounded-full border border-neutral-200 bg-white text-neutral-800 transition-colors hover:text-amber-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden mt-3 mx-auto max-w-7xl rounded-3xl border border-neutral-200 bg-white/95 backdrop-blur-2xl p-6 shadow-2xl overflow-hidden"
          >
            <motion.nav variants={mobileLinkListVariants} className="space-y-2">
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={mobileLinkItemVariants}>
                  <Link
                    href={link.path}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${link.accent
                        ? "bg-amber-50 text-amber-700 font-semibold"
                        : "text-neutral-800 hover:bg-neutral-100"
                      }`}
                  >
                    <span>{link.label}</span>
                    {link.accent && <Sparkles className="w-4 h-4 text-amber-500" />}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 border-t border-neutral-100">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 p-3 rounded-xl text-neutral-700 hover:bg-neutral-100"
                    >
                      <Package className="w-5 h-5 text-amber-500" />
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex justify-center items-center gap-2 p-3.5 rounded-xl bg-neutral-900 text-white font-semibold text-sm"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}