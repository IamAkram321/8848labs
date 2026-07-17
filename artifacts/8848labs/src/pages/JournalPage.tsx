import { SectionHeading } from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';

export default function JournalPage() {
  const posts = [
    { title: "The Art of Tolerances in 3D Printed Mechanisms", date: "Oct 12, 2024", image: "/src/assets/generated/journal-2.jpg", category: "Engineering" },
    { title: "Why We Chose to Build in Kathmandu", date: "Sep 28, 2024", image: "/src/assets/generated/journal-1.jpg", category: "Studio" },
    { title: "Designing for Additive Manufacturing", date: "Sep 15, 2024", image: "/src/assets/generated/journal-3.jpg", category: "Design" }
  ];

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHeading title="The Journal" label="Thoughts & Process" align="center" />
        
        <div className="mt-20 space-y-20">
          {posts.map((post, i) => (
            <motion.article 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-10 items-center group cursor-pointer"
            >
              <div className="w-full md:w-1/2 aspect-video overflow-hidden border border-border">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs uppercase tracking-widest text-primary">{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-border"></span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{post.date}</span>
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl group-hover:text-primary transition-colors leading-tight mb-4">{post.title}</h2>
                <div className="text-sm uppercase tracking-widest font-medium border-b border-foreground/20 self-start pb-1 group-hover:border-primary transition-colors mt-4">
                  Read Article
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
