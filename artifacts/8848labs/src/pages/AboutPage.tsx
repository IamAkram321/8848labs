import { SectionHeading } from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading title="Our Story" label="About 8848LABS" align="center" />
        
        <div className="mt-16 text-lg leading-relaxed text-muted-foreground space-y-8 font-sans">
          <p className="text-2xl text-foreground font-serif italic mb-12 text-center">
            "We believe the bridge between a digital thought and a physical reality should be elegant, precise, and accessible."
          </p>
          
          <p>
            Named after the elevation of Mount Everest, 8848LABS was founded in Kathmandu with a singular mission: to elevate the standard of custom manufacturing in Nepal and beyond.
          </p>
          
          <p>
            We observed a gap between conceptual design and physical realization. Traditional manufacturing requires massive scale to be economical, while consumer 3D printing often lacks the precision and material properties required for professional use.
          </p>
          
          <p>
            Our studio operates at the intersection. We utilize industrial-grade additive manufacturing processes to create one-off pieces, small batch productions, and high-fidelity prototypes that rival injection-molded parts.
          </p>
          
          <div className="my-16 border-y border-border py-12">
            <h3 className="font-serif text-3xl mb-8 text-foreground">Our Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold uppercase tracking-widest text-sm mb-2 text-foreground">Precision Over Speed</h4>
                <p className="text-sm">We don't optimize for the fastest print times; we optimize for structural integrity and surface finish.</p>
              </div>
              <div>
                <h4 className="font-semibold uppercase tracking-widest text-sm mb-2 text-foreground">Material Honesty</h4>
                <p className="text-sm">We let the nature of the manufacturing process show when it adds to the aesthetic, and finish it perfectly when it doesn't.</p>
              </div>
              <div>
                <h4 className="font-semibold uppercase tracking-widest text-sm mb-2 text-foreground">Local Craft</h4>
                <p className="text-sm">Proudly designed, engineered, and manufactured entirely in our Kathmandu facility.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
