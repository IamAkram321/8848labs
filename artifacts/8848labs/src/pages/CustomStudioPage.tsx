import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, ChevronRight, ArrowLeft, FileText } from 'lucide-react';
import { useCreateCustomOrder } from '@workspace/api-client-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-url';
import { Link } from 'wouter';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.stl', '.3mf', '.obj'];

function isAllowedFile(file: File) {
  const name = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export default function CustomStudioPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const createOrder = useCreateCustomOrder();

  const uploadFiles = async (incoming: File[]) => {
    const valid = incoming.filter(isAllowedFile);
    const invalid = incoming.filter((f) => !isAllowedFile(f));

    if (invalid.length > 0) {
      toast({
        title: `Unsupported file type: ${invalid.map((f) => f.name).join(', ')}`,
        variant: 'destructive',
      });
    }

    if (valid.length === 0) return;

    setFiles((prev) => [...prev, ...valid]);
    setIsUploading(true);

    try {
      const body = new FormData();
      valid.forEach((file) => body.append('files', file));

      const res = await fetch(`${API_URL}/api/uploads`, {
        method: 'POST',
        credentials: 'include',
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.error ?? 'Upload failed', variant: 'destructive' });
        setFiles((prev) => prev.filter((f) => !valid.includes(f)));
        return;
      }

      setFileUrls((prev) => [...prev, ...data.urls]);
    } catch {
      toast({ title: 'Upload failed. Please try again.', variant: 'destructive' });
      setFiles((prev) => prev.filter((f) => !valid.includes(f)));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(Array.from(e.target.files));
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    intendedUse: '',
    lengthMm: '',
    widthMm: '',
    heightMm: '',
    dimensionUnit: 'mm',
    quantity: '1',
    preferredMaterial: 'PLA+',
    desiredFinish: 'Standard',
    budgetRange: '',
    desiredDeliveryDate: '',
    fullName: '',
    email: '',
    phone: '',
    preferredContact: 'Email'
  });

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate({
      data: {
        ...formData,
        lengthMm: formData.lengthMm ? Number(formData.lengthMm) : undefined,
        widthMm: formData.widthMm ? Number(formData.widthMm) : undefined,
        heightMm: formData.heightMm ? Number(formData.heightMm) : undefined,
        quantity: Number(formData.quantity),
        fileUrls,
      } as any
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center bg-card">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-serif text-4xl mb-4">Request Received</h2>
          <p className="text-muted-foreground mb-8">
            Our engineers are reviewing your specifications. We'll be in touch within 24 hours with a preliminary quote and feasibility assessment.
          </p>
          <Link href="/" className="inline-block border border-border px-8 py-3 uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading 
          title="Custom Studio" 
          label="Bespoke Manufacturing"
          align="center"
        />

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={`text-xs uppercase tracking-wider ${step >= i ? 'text-primary' : 'text-muted'}`}>
                Step 0{i}
              </span>
            ))}
          </div>
          <div className="h-1 bg-border w-full relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-primary"
              initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${((step) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border p-8 md:p-12 shadow-sm relative overflow-hidden">
          <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            <AnimatePresence mode="wait">
              
              {/* Step 1: Upload */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-3xl mb-6">Digital Assets</h3>
                  <p className="text-muted-foreground mb-8">Upload any 3D models (STL, 3MF, OBJ), sketches, or reference images you have. We can work from a napkin sketch or a finished CAD file.</p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.stl,.3mf,.obj"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-12 text-center transition-colors cursor-pointer group ${
                      isDragActive ? 'border-primary bg-muted/50' : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="font-medium mb-2">
                      {isUploading ? 'Uploading...' : 'Drag and drop files here, or click to browse'}
                    </p>
                    <p className="text-xs text-muted-foreground">Supported: PNG, JPG, STL, 3MF, OBJ (Max 50MB per file)</p>
                  </div>

                  {files.length > 0 && (
                    <ul className="space-y-2 mt-6">
                      {files.map((file, i) => (
                        <li
                          key={`${file.name}-${i}`}
                          className="flex items-center justify-between gap-3 border border-border px-4 py-3 text-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(i)}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            aria-label="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}

              {/* Step 2: Describe */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-3xl mb-6">The Concept</h3>
                  
                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">Project Name</label>
                    <input 
                      required
                      type="text" 
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className="w-full bg-background border border-border p-4 focus:border-primary outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">Describe Your Idea</label>
                    <textarea 
                      required
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="What are we building? What problem does it solve?"
                      className="w-full bg-background border border-border p-4 focus:border-primary outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm uppercase tracking-wider mb-2">Intended Use</label>
                      <select 
                        name="intendedUse"
                        value={formData.intendedUse}
                        onChange={handleChange}
                        className="w-full bg-background border border-border p-4 focus:border-primary outline-none appearance-none"
                      >
                        <option>Functional Prototype</option>
                        <option>Visual Model / Art</option>
                        <option>End-use Part</option>
                        <option>Not Sure Yet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider mb-2">Quantity</label>
                      <input 
                        type="number" 
                        min="1"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full bg-background border border-border p-4 focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Specifications */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-3xl mb-6">Technical Specifications</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm uppercase tracking-wider mb-2">Material</label>
                      <select 
                        name="preferredMaterial"
                        value={formData.preferredMaterial}
                        onChange={handleChange}
                        className="w-full bg-background border border-border p-4 focus:border-primary outline-none appearance-none"
                      >
                        <option>PLA+ (Standard)</option>
                        <option>PETG (Durable)</option>
                        <option>ABS/ASA (Heat Resistant)</option>
                        <option>TPU (Flexible)</option>
                        <option>Not Sure (Recommend one)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider mb-2">Finish</label>
                      <select 
                        name="desiredFinish"
                        value={formData.desiredFinish}
                        onChange={handleChange}
                        className="w-full bg-background border border-border p-4 focus:border-primary outline-none appearance-none"
                      >
                        <option>Raw Print (Layer lines visible)</option>
                        <option>Sanded / Smooth</option>
                        <option>Painted (Automotive grade)</option>
                        <option>Premium Clear Coat</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">Approximate Dimensions (Optional)</label>
                    <div className="flex gap-4">
                      <input type="number" name="lengthMm" value={formData.lengthMm} onChange={handleChange} placeholder="L" className="w-full bg-background border border-border p-4 focus:border-primary outline-none" />
                      <input type="number" name="widthMm" value={formData.widthMm} onChange={handleChange} placeholder="W" className="w-full bg-background border border-border p-4 focus:border-primary outline-none" />
                      <input type="number" name="heightMm" value={formData.heightMm} onChange={handleChange} placeholder="H" className="w-full bg-background border border-border p-4 focus:border-primary outline-none" />
                      <select name="dimensionUnit" value={formData.dimensionUnit} onChange={handleChange} className="bg-background border border-border px-4 focus:border-primary outline-none appearance-none">
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="inches">in</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Contact */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-3xl mb-6">Contact Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm uppercase tracking-wider mb-2">Full Name</label>
                      <input 
                        required type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                        className="w-full bg-background border border-border p-4 focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider mb-2">Email</label>
                      <input 
                        required type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full bg-background border border-border p-4 focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider mb-2">Phone</label>
                      <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full bg-background border border-border p-4 focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-3xl mb-6">Review Submission</h3>
                  
                  <div className="bg-background border border-border p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
                      <span className="text-muted-foreground uppercase text-xs tracking-wider">Project</span>
                      <span className="col-span-2 font-medium">{formData.projectName || "Not specified"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
                      <span className="text-muted-foreground uppercase text-xs tracking-wider">Details</span>
                      <span className="col-span-2 font-medium text-sm">{formData.description || "Not specified"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
                      <span className="text-muted-foreground uppercase text-xs tracking-wider">Specs</span>
                      <span className="col-span-2 font-medium text-sm">
                        Material: {formData.preferredMaterial} <br/>
                        Finish: {formData.desiredFinish} <br/>
                        Qty: {formData.quantity}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-muted-foreground uppercase text-xs tracking-wider">Contact</span>
                      <span className="col-span-2 font-medium text-sm">
                        {formData.fullName} <br/>
                        {formData.email}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between pt-6 border-t border-border">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={handlePrev}
                  className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div></div>}
              
              <button 
                type="submit"
                disabled={createOrder.isPending}
                className="bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {step === totalSteps ? (createOrder.isPending ? 'Submitting...' : 'Submit Request') : 'Continue'}
                {step !== totalSteps && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}