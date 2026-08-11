import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function BrandStatement() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const words = "We turn digital ideas into physical objects.".split(" ");

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-36 md:py-48 min-h-[90vh] flex items-center"
    >
      {/* ===========================
          FULLSCREEN BACKGROUND VIDEO
      ============================ */}

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/printing.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay with enhanced opacity for contrast */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Bronze gradient accent */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, rgba(184,149,106,.22), transparent 60%)",
        }}
      />

      {/* Backdrop blur layer */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* ===========================
          CONTENT
      ============================ */}

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <div className="max-w-4xl">
          <h2 className="font-serif text-white text-5xl md:text-7xl lg:text-8xl leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;

              // Raised lower bound from 0.15 to 0.45 for clear initial readability
              const opacity = useTransform(
                scrollYProgress,
                [start, end],
                [0.45, 1]
              );

              const y = useTransform(
                scrollYProgress,
                [start, end],
                [15, 0]
              );

              return (
                <motion.span
                  key={i}
                  style={{ opacity, y }}
                  className="inline-block mr-3 md:mr-5"
                >
                  {word === "ideas" || word === "objects." ? (
                    <span className="italic text-amber-400 font-medium drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              );
            })}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="mt-12 max-w-2xl text-lg md:text-xl leading-9 text-neutral-200 drop-shadow-sm"
          >
            Every object begins as a thought. At 8848LABS, we treat
            additive manufacturing as precision engineering.
            From concept sketches to the final printed layer,
            every project reflects our obsession with craftsmanship,
            engineering and detail.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-14"
          >
            <Link href="/custom-studio">
              <button
                className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-amber-400/60
                bg-amber-500/20
                backdrop-blur-md
                px-8
                py-4
                uppercase
                tracking-[0.28em]
                text-xs
                font-semibold
                text-amber-300
                transition-all
                hover:bg-amber-400
                hover:text-black
                hover:border-amber-400
                shadow-lg
              "
              >
                Start Your Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}