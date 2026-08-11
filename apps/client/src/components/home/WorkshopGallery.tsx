import { motion, type Variants } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Sparkles, MapPin } from 'lucide-react';

const galleryItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
};

export function WorkshopGallery() {
  const images = [
    { 
      src: "/images/gallery-workshop-1.jpg", 
      aspect: "aspect-square",
      title: "Additive Production Cell",
      tag: "Studio Floor"
    },
    { 
      src: "/images/gallery-workshop-2.jpg", 
      aspect: "aspect-[16/10]",
      title: "Material Finishing & Polish",
      tag: "Post-Processing"
    },
    { 
      src: "/images/product-prototype.jpg", 
      aspect: "aspect-[3/4]",
      title: "Prototyping & Inspection",
      tag: "Quality Control"
    },
  ];

  return (
    <section className="relative py-28 md:py-36 bg-[#FAFAFA] text-neutral-900 border-t border-neutral-200/80 overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Light Mesh & Soft Glow Ambient Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <SectionHeading 
              label="04 / Behind The Scenes"
              title="Inside the Lab"
            />
            <p className="text-neutral-600 font-light text-base md:text-lg max-w-lg leading-relaxed">
              A glimpse into our studio where high-concept digital geometry transforms into physical reality.
            </p>
          </div>

          {/* Location Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-neutral-200/90 shadow-2xs self-start md:self-auto">
            <MapPin className="w-4 h-4 text-amber-700" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Kathmandu Studio
            </span>
          </div>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {images.map((img, i) => (
            <motion.div
              key={i}
              variants={galleryItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12 }}
              className={`group relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-neutral-100 shadow-sm transition-all duration-500 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-900/10 ${img.aspect} ${i === 1 ? 'sm:col-span-2 md:col-span-2' : ''}`}
            >
              {/* Image with subtle hover zoom and filter shift */}
              <img 
                src={img.src} 
                alt={img.title}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out filter contrast-[1.02]"
              />

              {/* Hover Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Tag Badge */}
              <div className="absolute top-5 left-5 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/40 border border-white/20 backdrop-blur-md font-mono text-[10px] text-amber-200 tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {img.tag}
                </span>
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-5 left-5 right-5 z-20 transform translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300">
                <h4 className="font-serif text-xl md:text-2xl text-white font-normal">
                  {img.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}