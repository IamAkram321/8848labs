import { motion } from 'framer-motion';

export function WorkshopGallery() {
  const images = [
    { src: "/src/assets/generated/gallery-workshop-1.jpg", aspect: "aspect-square" },
    { src: "/src/assets/generated/gallery-workshop-2.jpg", aspect: "aspect-[4/3]" },
    { src: "/src/assets/generated/product-prototype.jpg", aspect: "aspect-[3/4]" },
  
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl mb-4">Inside the Lab</h2>
            <p className="text-muted-foreground max-w-lg">A glimpse into our Kathmandu studio where digital concepts become tangible reality.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`overflow-hidden bg-muted ${img.aspect} ${i === 1 ? 'md:col-span-2' : ''}`}
            >
              <img 
                src={img.src} 
                alt={`Workshop gallery ${i+1}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
