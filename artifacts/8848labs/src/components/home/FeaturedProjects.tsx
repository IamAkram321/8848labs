import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Link } from 'wouter';
import { useListFeaturedProjects } from '@workspace/api-client-react';

export function FeaturedProjects() {
  const { data: projects, isLoading } = useListFeaturedProjects({
    query: {
      queryKey: ["featured-projects"]
    }
  });

  const displayProjects = Array.isArray(projects) ? projects : [
    {
      id: 1,
      title: "Himalayan Topography",
      slug: "himalayan-topography",
      description: "A 1.5m wide relief map of the Khumbu region, printed in 24 interlocking segments over 300 hours.",
      images: ["/src/assets/generated/project-hero-3.jpg"],
      tags: ["Cartography", "PLA+"],
      number: "01"
    },
    {
      id: 2,
      title: "Parametric Pavilion",
      slug: "parametric-pavilion",
      description: "Scale architectural model demonstrating complex lattice structures that are impossible to build with traditional methods.",
      images: ["/src/assets/generated/project-hero-1.jpg"],
      tags: ["Architecture", "PETG"],
      number: "02"
    },
    {
      id: 3,
      title: "Bespoke Art Installation",
      slug: "bespoke-installation",
      description: "A custom fluid geometry piece for a boutique hotel lobby in Kathmandu.",
      images: ["/src/assets/generated/project-hero-2.jpg"],
      tags: ["Art", "Custom Finish"],
      number: "03"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-card border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16 md:mb-24">
          <SectionHeading 
            label="02 / Portfolio"
            title="Featured Projects"
            className="mb-0"
          />
          <Link href="/projects" className="hidden md:inline-block text-sm uppercase tracking-widest hover:text-primary transition-colors border-b border-foreground/20 hover:border-primary pb-1">
            View All Work
          </Link>
        </div>

        <div className="space-y-24 md:space-y-32">
          {displayProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={project.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
                
                {/* Image */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="w-full md:w-3/5"
                >
                  <Link href={`/projects/${project.slug}`} className="block relative overflow-hidden group aspect-4/3 bg-muted">
                    <img 
                      src={project.images[0] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000"} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>

                {/* Content */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full md:w-2/5 flex flex-col"
                >
                  <span className="text-muted-foreground font-serif text-2xl italic mb-4">{project.number || `0${index + 1}`}</span>
                  <h3 className="font-serif text-3xl lg:text-4xl mb-6 text-foreground">{project.title}</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-10">
                    {project.tags?.map(tag => (
                      <span key={tag} className="text-xs uppercase tracking-widest border border-border px-3 py-1 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/projects/${project.slug}`} className="text-sm uppercase tracking-widest font-medium hover:text-primary transition-colors self-start border-b border-foreground/20 hover:border-primary pb-1">
                    Explore Project
                  </Link>
                </motion.div>
                
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center md:hidden">
          <Link href="/projects" className="inline-block text-sm uppercase tracking-widest hover:text-primary transition-colors border-b border-foreground/20 hover:border-primary pb-1">
            View All Work
          </Link>
        </div>
      </div>
    </section>
  );
}
