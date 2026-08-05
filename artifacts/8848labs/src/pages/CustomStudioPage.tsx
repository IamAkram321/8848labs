import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, ChevronRight, ArrowLeft, FileText, Sparkles, Layers, Box, Phone, FileCheck } from 'lucide-react';
import { useCreateCustomOrder } from '@workspace/api-client-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { uploadFilesWithTimeout } from '@/lib/api-url';
import { Link } from 'wouter';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.stl', '.3mf', '.obj', '.glb'];

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
  const [failedUploadOpen, setFailedUploadOpen] = useState(false);
  const [failedUploadFileName, setFailedUploadFileName] = useState('');
  const [failedUploadDescription, setFailedUploadDescription] = useState('');
  const [failedUploadNotes, setFailedUploadNotes] = useState<string[]>([]);
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
      const { ok, data } = await uploadFilesWithTimeout(valid);

      if (!ok) {
        setFiles((prev) => prev.filter((f) => !valid.includes(f)));
        setFailedUploadFileName(valid[0]?.name ?? 'your file');
        setFailedUploadDescription('');
        setFailedUploadOpen(true);
        return;
      }

      setFileUrls((prev) => [...prev, ...data.urls]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveFailedUploadNote = () => {
    const note = failedUploadDescription.trim();
    if (note) {
      setFailedUploadNotes((prev) => [
        ...prev,
        `Attached file "${failedUploadFileName}" could not be uploaded (likely too large). Customer's description: ${note}`,
      ]);
    }
    setFailedUploadOpen(false);
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
    intendedUse: 'Functional Prototype',
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

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

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
        additionalNotes: failedUploadNotes.length > 0 ? failedUploadNotes.join('\n\n') : undefined,
      } as any
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] relative overflow-hidden">
        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-600/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xs">
            <Check className="w-8 h-8 text-amber-800" />
          </div>
          <h2 className="font-serif text-4xl mb-4 text-neutral-900">Request Received</h2>
          <p className="text-neutral-500 font-light text-sm mb-8">
            Our engineers are reviewing your specifications. We'll be in touch within 24 hours with a preliminary quote and feasibility assessment.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-xs">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const stepLabels = [
    { title: "Assets", icon: FileText },
    { title: "Concept", icon: Sparkles },
    { title: "Specs", icon: Box },
    { title: "Contact", icon: Phone },
    { title: "Review", icon: FileCheck }
  ];

  return (
    <div className="relative pt-32 pb-28 md:pb-36 bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/20 to-transparent blur-[140px]" />
        <div className="absolute left-10 bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-300/15 via-amber-100/25 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.025]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">
        <SectionHeading 
          title="Custom Studio" 
          label="Bespoke Manufacturing"
          align="center"
        />

        {/* Pill Stepper Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 pt-2">
            {stepLabels.map((s, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              const StepIcon = s.icon;

              return (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setStep(stepNum)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 shrink-0 ${
                    isActive
                      ? "border border-amber-600/80 bg-neutral-900 text-white shadow-xs"
                      : isCompleted
                      ? "border border-amber-600/40 bg-amber-500/10 text-amber-900 font-semibold"
                      : "border border-neutral-200/90 bg-white/80 text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                  <span>0{stepNum}. {s.title}</span>
                  {isCompleted && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              );
            })}
          </div>

          <div className="h-1 bg-neutral-200/80 w-full rounded-full overflow-hidden mt-2">
            <motion.div 
              className="h-full bg-amber-600 rounded-full"
              initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Direct Form Layout without Container Box */}
        <div className="relative">
          <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            <AnimatePresence mode="wait">
              
              {/* Step 1: Upload */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-4 mb-6">
                    <h3 className="font-serif text-2xl md:text-3xl font-normal text-neutral-900">Digital Assets</h3>
                    <p className="mt-1 text-neutral-500 font-light text-sm">
                      Upload 3D models (STL, 3MF, OBJ, GLB) or reference images. We accept napkin sketches or full CAD files.
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.stl,.3mf,.obj,.glb"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-3xl p-10 md:p-14 text-center transition-all cursor-pointer bg-white/80 backdrop-blur-md shadow-xs ${
                      isDragActive ? 'border-amber-600 bg-amber-500/5' : 'border-neutral-200/90 hover:border-neutral-400'
                    }`}
                  >
                    <Upload className="w-10 h-10 mx-auto mb-4 text-neutral-400 group-hover:text-amber-800 transition-colors" />
                    <p className="font-medium text-sm text-neutral-800 mb-1">
                      {isUploading ? 'Uploading assets...' : 'Drag and drop files here, or click to browse'}
                    </p>
                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Supported: PNG, JPG, STL, 3MF, OBJ, GLB (Max 50MB)</p>
                  </div>

                  {files.length > 0 && (
                    <ul className="space-y-2 mt-6">
                      {files.map((file, i) => (
                        <li
                          key={`${file.name}-${i}`}
                          className="flex items-center justify-between gap-3 border border-neutral-200/90 bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3.5 text-xs font-mono text-neutral-800 shadow-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(i)}
                            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors shrink-0"
                            aria-label="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {failedUploadNotes.length > 0 && (
                    <div className="mt-6 border border-amber-600/30 bg-amber-500/10 rounded-2xl p-5 text-xs font-mono text-amber-900 shadow-xs">
                      <p className="font-semibold mb-1">
                        {failedUploadNotes.length} file{failedUploadNotes.length > 1 ? 's' : ''} saved as description
                      </p>
                      <p className="text-neutral-600 font-sans text-xs font-light">
                        Our engineering team will follow up directly to arrange receiving full CAD files.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Describe */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-4 mb-6">
                    <h3 className="font-serif text-2xl md:text-3xl font-normal text-neutral-900">The Concept</h3>
                    <p className="mt-1 text-neutral-500 font-light text-sm">
                      Define the purpose and scope of your custom build.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2">Project Name</label>
                    <input 
                      required
                      type="text" 
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="e.g. Custom Drone Mount v2"
                      className="w-full bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono placeholder:text-neutral-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2">Describe Your Idea</label>
                    <textarea 
                      required
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="What are we building? Detail dimensions, functional stress limits, or target environment."
                      className="w-full bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-3xl p-5 text-xs font-mono placeholder:text-neutral-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2">Intended Use</label>
                      <select 
                        name="intendedUse"
                        value={formData.intendedUse}
                        onChange={handleChange}
                        className="w-full bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs appearance-none"
                      >
                        <option value="Functional Prototype">Functional Prototype</option>
                        <option value="Visual Model / Art">Visual Model / Art</option>
                        <option value="End-use Part">End-use Part</option>
                        <option value="Not Sure Yet">Not Sure Yet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2">Quantity</label>
                      <input 
                        type="number" 
                        min="1"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Specifications */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-4 mb-6">
                    <h3 className="font-serif text-2xl md:text-3xl font-normal text-neutral-900">Technical Specifications</h3>
                    <p className="mt-1 text-neutral-500 font-light text-sm">
                      Select material profiles and finishing requirements.
                    </p>
                  </div>
                  
                  {/* Material Pill Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 font-mono text-xs uppercase tracking-wider text-amber-800">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>Preferred Material</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["PLA+ (Standard)", "PETG (Durable)", "ABS/ASA (Heat Resistant)", "TPU (Flexible)", "Not Sure (Recommend)"].map((mat) => {
                        const isSelected = formData.preferredMaterial === mat;
                        return (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => setFormData({ ...formData, preferredMaterial: mat })}
                            className={`px-4 py-2 rounded-full border font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                              isSelected
                                ? "border-amber-600/80 bg-neutral-900 text-white shadow-xs"
                                : "border-neutral-200/90 bg-white/80 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                            }`}
                          >
                            {mat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Finish Pill Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 font-mono text-xs uppercase tracking-wider text-amber-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Desired Finish</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Raw Print (Standard)", "Sanded / Smooth", "Painted (Automotive Grade)", "Premium Clear Coat"].map((fin) => {
                        const isSelected = formData.desiredFinish === fin;
                        return (
                          <button
                            key={fin}
                            type="button"
                            onClick={() => setFormData({ ...formData, desiredFinish: fin })}
                            className={`px-4 py-2 rounded-full border font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                              isSelected
                                ? "border-amber-600/80 bg-neutral-900 text-white shadow-xs"
                                : "border-neutral-200/90 bg-white/80 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                            }`}
                          >
                            {fin}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2">Dimensions (Optional)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <input 
                        type="number" 
                        name="lengthMm" 
                        value={formData.lengthMm} 
                        onChange={handleChange} 
                        placeholder="Length" 
                        className="bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs" 
                      />
                      <input 
                        type="number" 
                        name="widthMm" 
                        value={formData.widthMm} 
                        onChange={handleChange} 
                        placeholder="Width" 
                        className="bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs" 
                      />
                      <input 
                        type="number" 
                        name="heightMm" 
                        value={formData.heightMm} 
                        onChange={handleChange} 
                        placeholder="Height" 
                        className="bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs" 
                      />
                      <select 
                        name="dimensionUnit" 
                        value={formData.dimensionUnit} 
                        onChange={handleChange} 
                        className="bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs appearance-none"
                      >
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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-4 mb-6">
                    <h3 className="font-serif text-2xl md:text-3xl font-normal text-neutral-900">Contact Details</h3>
                    <p className="mt-1 text-neutral-500 font-light text-sm">
                      Where should our engineering team deliver your preliminary estimate?
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange}
                        placeholder="MD Akram"
                        className="w-full bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        placeholder="akram@example.com"
                        className="w-full bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange}
                        placeholder="+977 9800000000"
                        className="w-full bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-full px-5 py-3 text-xs font-mono focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-4 mb-6">
                    <h3 className="font-serif text-2xl md:text-3xl font-normal text-neutral-900">Review Submission</h3>
                    <p className="mt-1 text-neutral-500 font-light text-sm">
                      Confirm specifications before routing to the workshop.
                    </p>
                  </div>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row justify-between p-4 rounded-2xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs">
                      <span className="text-neutral-400 uppercase">Project Name</span>
                      <span className="text-neutral-900 font-semibold">{formData.projectName || "Not specified"}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between p-4 rounded-2xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs">
                      <span className="text-neutral-400 uppercase">Description</span>
                      <span className="text-neutral-900 font-light max-w-sm text-right">{formData.description || "Not specified"}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between p-4 rounded-2xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs">
                      <span className="text-neutral-400 uppercase">Specifications</span>
                      <span className="text-neutral-900 font-semibold text-right">
                        {formData.preferredMaterial} • {formData.desiredFinish} • Qty: {formData.quantity}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between p-4 rounded-2xl border border-neutral-200/90 bg-white/80 backdrop-blur-md shadow-xs">
                      <span className="text-neutral-400 uppercase">Contact</span>
                      <span className="text-neutral-900 font-semibold text-right">
                        {formData.fullName} ({formData.email})
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Bar */}
            <div className="mt-12 flex justify-between items-center pt-6 border-t border-neutral-200/80">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200/90 bg-white/80 text-neutral-700 font-mono text-xs uppercase tracking-wider hover:border-neutral-400 transition-colors shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : <div />}
              
              <button 
                type="submit"
                disabled={createOrder.isPending}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-xs disabled:opacity-50"
              >
                <span>{step === totalSteps ? (createOrder.isPending ? 'Submitting...' : 'Submit Request') : 'Continue'}</span>
                {step !== totalSteps && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={failedUploadOpen} onOpenChange={setFailedUploadOpen}>
        <DialogContent className="rounded-3xl border border-neutral-200/90 bg-white/95 backdrop-blur-xl p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal text-neutral-900">We couldn't upload that file</DialogTitle>
            <DialogDescription className="text-neutral-500 font-light text-xs mt-2">
              "{failedUploadFileName}" exceeds direct upload limits. Describe what you're looking to manufacture below and our engineers will collect the file directly.
            </DialogDescription>
          </DialogHeader>
          <textarea
            rows={4}
            value={failedUploadDescription}
            onChange={(e) => setFailedUploadDescription(e.target.value)}
            className="w-full border border-neutral-200/90 bg-neutral-50 rounded-2xl p-4 text-xs font-mono focus:outline-none focus:border-amber-600 transition-colors mt-2"
            placeholder="e.g. 12cm tall high-detail dragon figurine STL..."
          />
          <DialogFooter className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setFailedUploadOpen(false)}
              className="px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleSaveFailedUploadNote}
              className="px-6 py-2 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-xs"
            >
              Save & Continue
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}