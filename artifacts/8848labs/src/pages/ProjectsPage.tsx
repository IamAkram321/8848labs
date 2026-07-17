import { Link } from "wouter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useListFeaturedProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const { data: projects } = useListFeaturedProjects();

  const displayProjects = Array.isArray(projects)
    ? projects
    : [
        {
          title: "Himalayan Topography",
          slug: "himalayan-topography",
          images: ["/src/assets/generated/project-hero-3.jpg"],
          tags: ["Cartography"],
        },
        {
          title: "Parametric Pavilion",
          slug: "parametric-pavilion",
          images: ["/src/assets/generated/project-hero-1.jpg"],
          tags: ["Architecture"],
        },
        {
          title: "Fluid Installation",
          slug: "fluid-installation",
          images: ["/src/assets/generated/project-hero-2.jpg"],
          tags: ["Art"],
        },
      ];

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <SectionHeading title="Selected Works" label="Portfolio" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.slug ?? index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <div className="bg-card aspect-4/3 border border-border relative overflow-hidden mb-6">
                  <img
                    src={project.images?.[0]}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale hover:grayscale-0"
                    alt={project.title}
                  />
                </div>

                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  {project.tags?.[0]}
                </div>

                <h2 className="font-serif text-2xl group-hover:text-primary transition-colors">
                  {project.title}
                </h2>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}