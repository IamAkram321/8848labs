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

  const words =
    "We turn digital ideas into physical objects.".split(" ");

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

      {/* Dark overlay */}

      <div className="absolute inset-0 bg-black/55" />

      {/* Bronze gradient */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, rgba(184,149,106,.22), transparent 60%)",
        }}
      />

      {/* Slight blur for readability */}

      <div className="absolute inset-0 backdrop-blur-[0.5px]" />

      {/* ===========================
          CONTENT
      ============================ */}

      <div className="container relative z-10 mx-auto max-w-6xl px-6">

        <div className="max-w-3xl">

          <h2 className="font-serif text-white text-5xl md:text-7xl lg:text-8xl leading-[1.05]">

            {words.map((word, i) => {

              const start = i / words.length;
              const end = start + 1 / words.length;

              const opacity = useTransform(
                scrollYProgress,
                [start, end],
                [0.15, 1]
              );

              const y = useTransform(
                scrollYProgress,
                [start, end],
                [25, 0]
              );

              return (
                <motion.span
                  key={i}
                  style={{ opacity, y }}
                  className="inline-block mr-4"
                >
                  {word === "ideas" || word === "objects." ? (
                    <span className="italic text-primary">
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
            className="mt-12 max-w-2xl text-lg md:text-xl leading-9 text-white/80"
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
                border-primary
                bg-primary/10
                backdrop-blur-md
                px-8
                py-4
                uppercase
                tracking-[0.28em]
                text-xs
                text-white
                transition-all
                hover:bg-primary
                hover:text-black
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