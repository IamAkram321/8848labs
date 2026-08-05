import { Link } from "wouter";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HelpCircle, Sparkles, MessageCircle } from "lucide-react";

const faqs = [
  {
    category: "Ordering",
    items: [
      {
        q: "How does 3D printing work for custom orders?",
        a: "Submit your idea through our Custom Studio with as much detail as possible — sketches, references, or dimensions. Our team reviews it, confirms feasibility and pricing, and once approved, we move straight into printing.",
      },
      {
        q: "Can I order more than one of the same product?",
        a: "Yes — just adjust the quantity on the product page before adding it to your cart. For larger bulk orders, reach out through our Contact page and we'll quote accordingly.",
      },
      {
        q: "Do you offer design consultations for custom projects?",
        a: "Yes. For complex custom pieces, we're happy to discuss design direction before production begins. Mention this when submitting your request in the Custom Studio.",
      },
    ],
  },
  {
    category: "Production & Materials",
    items: [
      {
        q: "What materials do you print with?",
        a: "We primarily use PLA+ and PETG, chosen for their strength, finish quality, and reliability. Specific material options are listed on each product page.",
      },
      {
        q: "How long does production take?",
        a: "Most in-stock items are made to order and ship within 3-5 business days. Custom Studio projects vary based on complexity — we'll give you a timeline once your request is reviewed.",
      },
      {
        q: "Can I request a specific color?",
        a: "Where available, color options are shown on the product page. For custom projects, mention your preferred color when submitting your request.",
      },
    ],
  },
  {
    category: "Payment & Orders",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We currently operate on Cash on Delivery (COD) — you pay when your order arrives at your doorstep.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "If production hasn't started yet, we're happy to help. Contact us as soon as possible with your order number and we'll do our best to accommodate changes.",
      },
      {
        q: "How do I track my order?",
        a: "If you have an account, you can view your order status by signing in. Otherwise, we'll keep you updated by email as your order moves through production and shipping.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="relative pt-32 pb-28 md:pb-36 bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Ambient Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <SectionHeading title="Frequently Asked Questions" label="01 / Support" />
          <p className="mt-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-2xl">
            Answers to the questions we hear most often. Can't find what you're looking for?{" "}
            <Link href="/contact" className="text-amber-800 font-medium underline underline-offset-4 hover:text-amber-600 transition-colors">
              Get in touch with our team
            </Link>
            .
          </p>
        </div>

        {/* FAQ Categories Stack */}
        <div className="space-y-12">
          {faqs.map((section, sectionIdx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: sectionIdx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-6 md:p-8 rounded-3xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs"
            >
              <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-4 mb-4 text-amber-800 font-mono text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{section.category}</span>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.category}-${i}`}
                    className="border-b border-neutral-200/60 last:border-b-0 py-1"
                  >
                    <AccordionTrigger className="text-left font-serif text-lg md:text-xl py-5 text-neutral-900 hover:text-amber-700 transition-colors duration-300 hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-600 font-light leading-relaxed text-sm md:text-base pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* Help Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 rounded-3xl border border-neutral-200/90 bg-white/60 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-neutral-900">Have a custom inquiry?</h3>
              <p className="text-xs text-neutral-500 font-light mt-0.5">We help bring unique physical designs to life.</p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-amber-600 transition-colors duration-300 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Ask Us Anything</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}