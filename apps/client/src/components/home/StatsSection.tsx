import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGetStats } from "@workspace/api-client-react";

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function Counter({ end, suffix = "", duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Smooth cubic ease-out
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-2">
      {count}{suffix}
    </div>
  );
}

export function StatsSection() {
  const { data: stats } = useGetStats({
    query: { queryKey: ["stats"] }
  });

  const displayStats = stats || {
    projectsCompleted: 450,
    printingHours: 12500,
    customDesigns: 280,
    satisfactionPercent: 99
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center border-y border-border py-16"
        >
          <div className="flex flex-col items-center">
            <Counter end={displayStats.projectsCompleted} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
              Projects Completed
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Counter end={Math.floor(displayStats.printingHours / 1000)} suffix="k+" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
              Hours of Printing
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Counter end={displayStats.customDesigns} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
              Bespoke Designs
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Counter end={displayStats.satisfactionPercent} suffix="%" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
              Client Satisfaction
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}