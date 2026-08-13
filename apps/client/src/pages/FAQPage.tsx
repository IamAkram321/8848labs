import { Link } from "wouter";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HelpCircle, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

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
    <div className="relative pt-32 lg:pt-36 pb-24 md:pb-32 bg-[#F7F6F2] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Background Blueprint Grid & Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
        <div className="absolute -right-20 top-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/10 to-transparent blur-[140px]" />
        <div className="absolute -left-20 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/20 to-transparent blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-4xl">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <SectionHeading 
            title="Frequently Asked Questions" 
            label="01 / Support" 
            description="Answers to the questions we hear most often. Can't find what you're looking for?"
          />
          <div className="mt-3">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-amber-800 font-semibold hover:text-amber-600 transition-colors group"
            >
              <span>Get in touch with our engineering team</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* FAQ Categories Stack */}
        <div className="space-y-10 md:space-y-12">
          {faqs.map((section, sectionIdx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: sectionIdx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-6 md:p-8 rounded-3xl border border-neutral-300/80 bg-white/90 backdrop-blur-md shadow-2xs"
            >
              <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-4 mb-3 text-amber-800 font-mono text-xs uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{section.category}</span>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.category}-${i}`}
                    className="border-b border-neutral-200/60 last:border-b-0 py-1"
                  >
                    <AccordionTrigger className="text-left font-serif text-lg md:text-xl font-normal py-4 text-neutral-900 hover:text-amber-800 transition-colors duration-300 hover:no-underline cursor-pointer">
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-14 p-6 sm:p-8 rounded-3xl border border-neutral-300/80 bg-white/80 backdrop-blur-md shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-800 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-neutral-900">Have a custom inquiry?</h3>
              <p className="text-xs font-mono text-neutral-500 font-light mt-1 uppercase tracking-wider">We help bring unique physical designs to life.</p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors duration-300 shrink-0 shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Ask Us Anything</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}