import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useGetStats } from '@workspace/api-client-react';

function Counter({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const step = end / (duration * 60); // Assuming 60fps
      
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      
      return () => clearInterval(timer);
    }
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center border-y border-border py-16">
          <div className="flex flex-col items-center">
            <Counter end={displayStats.projectsCompleted} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Projects Completed</span>
          </div>
          <div className="flex flex-col items-center">
            <Counter end={Math.floor(displayStats.printingHours / 1000)} suffix="k+" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Hours of Printing</span>
          </div>
          <div className="flex flex-col items-center">
            <Counter end={displayStats.customDesigns} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Bespoke Designs</span>
          </div>
          <div className="flex flex-col items-center">
            <Counter end={displayStats.satisfactionPercent} suffix="%" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Client Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
}
