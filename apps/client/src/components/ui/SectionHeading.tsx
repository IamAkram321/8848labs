import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({ label, title, align = "left", className = "" }: SectionHeadingProps) {
  return (
    <div className={`mb-12 md:mb-20 ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"} ${className}`}>
      {label && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-4"
        >
          {label}
        </motion.div>
      )}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight"
      >
        {title}
      </motion.h2>
    </div>
  );
}
