import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, ChevronRight, ArrowLeft, FileText, Sparkles, Layers, Box, Phone, FileCheck, Info, Cpu } from 'lucide-react';
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
        `Attached file "${failedUploadFileName}" could not be uploaded. Description: ${note}`,
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
      <div className="pt-32 pb-24 min-h-[85vh] flex items-center justify-center bg-[#F4F3EF] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] opacity-70 pointer-events-none" />
        <div className="text-center max-w-md mx-auto px-8 relative z-10 bg-white/90 backdrop-blur-2xl border border-neutral-200/80 p-10 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-serif text-3xl text-neutral-900 font-normal mb-3">Order Transmitted</h2>
          <p className="text-neutral-500 font-light text-sm mb-8 leading-relaxed">
            Your specs have been logged in our queue. Our engineers will follow up with technical feedback and pricing within 24 hours.
          </p>
          <Link href="/" className="inline-flex items-center justify-center w-full py-3.5 rounded-2xl bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg">
            Back To Atelier
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
    <div className="relative pt-28 pb-28 bg-[#F4F3EF] text-neutral-900 min-h-screen overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      {/* Structural Studio Lighting & Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-amber-200/30 via-orange-100/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-300/15 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/20 font-mono text-[11px] uppercase tracking-widest text-amber-900 mb-3">
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            <span>Precision Studio Engineering</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-neutral-900 tracking-tight">
            Custom Manufacturing
          </h1>
        </div>

        {/* Floating Glass Stepper Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-5 gap-1.5 p-2 bg-white/80 backdrop-blur-2xl border border-neutral-300/70 rounded-2xl shadow-sm">
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
                  className={`flex items-center justify-center md:justify-start gap-2.5 py-3 px-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 ${isActive
                      ? "bg-neutral-900 text-white shadow-md font-medium"
                      : isCompleted
                        ? "bg-amber-500/10 text-amber-900 border border-amber-500/30 font-medium"
                        : "text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100/60"
                    }`}
                >
                  <StepIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : isCompleted ? 'text-amber-600' : ''}`} />
                  <span className="hidden md:inline truncate">{s.title}</span>
                  {isCompleted && <Check className="w-3 h-3 ml-auto text-amber-600 hidden md:inline" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Elevating Main Card Container */}
        <div className="bg-white/85 border border-neutral-300/80 rounded-3xl p-6 sm:p-12 backdrop-blur-2xl shadow-2xl relative">
          <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-6">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-semibold">Step 01 / 05</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 mt-1">Digital Asset Ingestion</h3>
                    <p className="mt-1.5 text-neutral-500 font-light text-sm leading-relaxed">
                      Supply your 3D models or reference schematics for instant technical review.
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
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center transition-all duration-300 cursor-pointer ${isDragActive
                        ? 'border-amber-600 bg-amber-500/10 shadow-inner'
                        : 'border-neutral-300 bg-neutral-50/70 hover:border-neutral-500 hover:bg-neutral-50'
                      }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200/90 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="font-medium text-sm text-neutral-800 mb-1">
                      {isUploading ? 'Encrypting & uploading...' : 'Drop 3D CAD models here, or browse files'}
                    </p>
                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider mt-2">
                      Accepted: STL, 3MF, OBJ, GLB, PNG, JPG (Up to 50MB)
                    </p>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-neutral-500 font-medium">Uploaded Assets ({files.length})</p>
                      {files.map((file, i) => (
                        <div
                          key={`${file.name}-${i}`}
                          className="flex items-center justify-between border border-neutral-200 bg-white rounded-xl px-4 py-3 text-xs font-mono text-neutral-800 shadow-sm hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(i)}
                            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {failedUploadNotes.length > 0 && (
                    <div className="border border-amber-600/30 bg-amber-500/10 rounded-2xl p-4 text-xs font-mono text-amber-900 flex gap-3 items-start shadow-sm">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-0.5">
                          {failedUploadNotes.length} file annotation{failedUploadNotes.length > 1 ? 's' : ''} logged
                        </p>
                        <p className="text-neutral-600 font-sans text-xs font-light">
                          Our engineering team will handle large file transfer during consultation.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-6">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-semibold">Step 02 / 05</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 mt-1">Project Conceptualization</h3>
                    <p className="mt-1.5 text-neutral-500 font-light text-sm leading-relaxed">
                      Provide functional requirements and intended operating environment details.
                    </p>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2 font-medium">Project Nomenclature</label>
                    <input
                      required
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="e.g. Ergonomic Enclosure Mk. IV"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2 font-medium">Engineering Brief</label>
                    <textarea
                      required
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe target mechanical load, thermal limits, tolerances, or aesthetic standards..."
                      className="w-full bg-white border border-neutral-300 rounded-2xl p-4 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-all shadow-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2 font-medium">Primary Application</label>
                      <select
                        name="intendedUse"
                        value={formData.intendedUse}
                        onChange={handleChange}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-all shadow-sm"
                      >
                        <option value="Functional Prototype">Functional Prototype</option>
                        <option value="Visual Model / Art">Visual Display / Model</option>
                        <option value="End-use Part">End-Use Production Part</option>
                        <option value="Not Sure Yet">Engineering Recommendation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2 font-medium">Batch Quantity</label>
                      <input
                        type="number"
                        min="1"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-6">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-semibold">Step 03 / 05</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 mt-1">Material & Finish Parameters</h3>
                    <p className="mt-1.5 text-neutral-500 font-light text-sm leading-relaxed">
                      Select polymer profiles and post-processing treatments.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3 font-mono text-xs uppercase tracking-wider text-amber-800 font-medium">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>Material Formulation</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: "PLA+ High Precision", desc: "Crisp detail & structural rigidity" },
                        { title: "PETG Technical Grade", desc: "Impact resistant & weather durable" },
                        { title: "ABS/ASA Structural", desc: "Heat tolerant & UV stable" },
                        { title: "TPU Flexible Elastomer", desc: "High shock absorption" },
                        { title: "Custom Formulation", desc: "Consult engineering team" }
                      ].map((mat) => {
                        const isSelected = formData.preferredMaterial === mat.title;
                        return (
                          <button
                            key={mat.title}
                            type="button"
                            onClick={() => setFormData({ ...formData, preferredMaterial: mat.title })}
                            className={`p-4 rounded-2xl border text-left transition-all duration-200 ${isSelected
                                ? "border-amber-600/80 bg-neutral-900 text-white shadow-md"
                                : "border-neutral-200 bg-white/90 text-neutral-700 hover:border-neutral-400"
                              }`}
                          >
                            <p className="font-mono text-xs font-semibold uppercase tracking-wider">{mat.title}</p>
                            <p className={`text-[11px] font-sans mt-0.5 font-light ${isSelected ? 'text-amber-200/80' : 'text-neutral-400'}`}>{mat.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3 font-mono text-xs uppercase tracking-wider text-amber-800 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Post-Processing Finish</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: "Raw Print (Standard)", desc: "Visible micro-layer lines" },
                        { title: "Sanded & Smooth", desc: "Hand-finished tactile satin" },
                        { title: "Automotive Lacquer", desc: "High-gloss coated finish" },
                        { title: "Matte Protective Coat", desc: "Sealed non-reflective surface" }
                      ].map((fin) => {
                        const isSelected = formData.desiredFinish === fin.title;
                        return (
                          <button
                            key={fin.title}
                            type="button"
                            onClick={() => setFormData({ ...formData, desiredFinish: fin.title })}
                            className={`p-4 rounded-2xl border text-left transition-all duration-200 ${isSelected
                                ? "border-amber-600/80 bg-neutral-900 text-white shadow-md"
                                : "border-neutral-200 bg-white/90 text-neutral-700 hover:border-neutral-400"
                              }`}
                          >
                            <p className="font-mono text-xs font-semibold uppercase tracking-wider">{fin.title}</p>
                            <p className={`text-[11px] font-sans mt-0.5 font-light ${isSelected ? 'text-amber-200/80' : 'text-neutral-400'}`}>{fin.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2 font-medium">Dimensional Constraints (Optional)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <input
                        type="number"
                        name="lengthMm"
                        value={formData.lengthMm}
                        onChange={handleChange}
                        placeholder="Length"
                        className="bg-white border border-neutral-300 rounded-xl px-4 py-3 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-sm"
                      />
                      <input
                        type="number"
                        name="widthMm"
                        value={formData.widthMm}
                        onChange={handleChange}
                        placeholder="Width"
                        className="bg-white border border-neutral-300 rounded-xl px-4 py-3 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-sm"
                      />
                      <input
                        type="number"
                        name="heightMm"
                        value={formData.heightMm}
                        onChange={handleChange}
                        placeholder="Height"
                        className="bg-white border border-neutral-300 rounded-xl px-4 py-3 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-sm"
                      />
                      <select
                        name="dimensionUnit"
                        value={formData.dimensionUnit}
                        onChange={handleChange}
                        className="bg-white border border-neutral-300 rounded-xl px-4 py-3 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-sm"
                      >
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="inches">in</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-6">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-semibold">Step 04 / 05</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 mt-1">Client Routing & Contact</h3>
                    <p className="mt-1.5 text-neutral-500 font-light text-sm leading-relaxed">
                      Details for transmission of technical estimates and production schedules.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2 font-medium">Full Name</label>
                      <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2 font-medium">Corporate or Personal Email</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-700 mb-2 font-medium">Direct Phone Line</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-200/80 pb-6">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-semibold">Step 05 / 05</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 mt-1">Final Verification</h3>
                    <p className="mt-1.5 text-neutral-500 font-light text-sm leading-relaxed">
                      Confirm specifications prior to dispatching to the manufacturing workspace.
                    </p>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row justify-between p-4 rounded-2xl border border-neutral-200 bg-white/90 shadow-sm">
                      <span className="text-neutral-400 uppercase tracking-wider">Project Title</span>
                      <span className="text-neutral-900 font-semibold">{formData.projectName || "Unnamed Build"}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between p-4 rounded-2xl border border-neutral-200 bg-white/90 shadow-sm">
                      <span className="text-neutral-400 uppercase tracking-wider">Specifications</span>
                      <span className="text-amber-800 font-semibold text-right">
                        {formData.preferredMaterial} • {formData.desiredFinish} • Qty: {formData.quantity}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between p-4 rounded-2xl border border-neutral-200 bg-white/90 shadow-sm">
                      <span className="text-neutral-400 uppercase tracking-wider">Contact Target</span>
                      <span className="text-neutral-900 font-semibold text-right">
                        {formData.fullName} ({formData.email})
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Controls */}
            <div className="mt-10 flex justify-between items-center pt-6 border-t border-neutral-200/80">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-neutral-300 bg-white text-neutral-800 font-mono text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : <div />}

              <button
                type="submit"
                disabled={createOrder.isPending}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <span>{step === totalSteps ? (createOrder.isPending ? 'Transmitting...' : 'Submit Specs') : 'Continue'}</span>
                {step !== totalSteps && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={failedUploadOpen} onOpenChange={setFailedUploadOpen}>
        <DialogContent className="rounded-3xl border border-neutral-200 bg-white/95 backdrop-blur-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal text-neutral-900">Alternative File Transfer</DialogTitle>
            <DialogDescription className="text-neutral-500 font-light text-xs mt-2">
              "{failedUploadFileName}" is larger than standard transfer limits. Describe your project specs below for direct workshop pickup.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <textarea
              rows={4}
              value={failedUploadDescription}
              onChange={(e) => setFailedUploadDescription(e.target.value)}
              placeholder="e.g. 15cm functional bracket with high wall density..."
              className="w-full bg-white border border-neutral-300 rounded-2xl p-4 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all resize-none shadow-sm"
            />
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setFailedUploadOpen(false)}
              className="px-5 py-2.5 rounded-2xl border border-neutral-300 bg-white text-neutral-700 font-mono text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleSaveFailedUploadNote}
              className="px-6 py-2.5 rounded-2xl bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-amber-600 transition-all shadow-sm"
            >
              Save Note
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}