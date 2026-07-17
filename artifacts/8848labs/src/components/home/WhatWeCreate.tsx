import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    title: "Architecture",
    description: "High-fidelity topological models and building massing.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", // placeholder until generated
    link: "/collections/architecture",
    colSpan: "col-span-1 md:col-span-2",
    aspect: "aspect-[16/9] md:aspect-[21/9]"
  },
  {
    title: "Engineering",
    description: "Functional prototypes in robust technical materials.",
    image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=2136&auto=format&fit=crop", // placeholder
    link: "/collections/engineering",
    colSpan: "col-span-1",
    aspect: "aspect-square md:aspect-[4/5]"
  },
  {
    title: "Home & Decor",
    description: "Parametric vases, lighting, and bespoke interior objects.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop", // placeholder
    link: "/collections/decor",
    colSpan: "col-span-1",
    aspect: "aspect-square md:aspect-[4/5]"
  }
];

export function WhatWeCreate() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <SectionHeading 
              label="01 / Disciplines"
              title="What We Create"
            />
            <p className="text-muted-foreground text-lg mb-10 max-w-md">
              We specialize in bringing complex geometries to life across three distinct disciplines. From the precise tolerances required for engineering to the aesthetic perfection demanded by interior design.
            </p>
            <Link href="/collections" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium hover:text-primary transition-colors border-b border-foreground/20 hover:border-primary pb-1">
              View All Collections <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {categories.map((category, index) => (
                <Link key={category.title} href={category.link} className={`group block ${category.colSpan}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    className={`relative overflow-hidden bg-muted ${category.aspect}`}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-20 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="font-serif text-3xl text-white mb-2">{category.title}</h3>
                        <p className="text-white/80 font-sans text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
