'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  Globe, 
  Code2, 
  Sparkles,
  Phone,
  Calendar,
  Mail
} from 'lucide-react';
import { 
  onboardingSchema, 
  type OnboardingValues 
} from '@/lib/validations/onboardingSchema';
import { completeOnboarding } from '@/app/actions/onboarding';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'personal', title: 'Personal', icon: User },
  { id: 'professional', title: 'Professional', icon: Globe },
  { id: 'social', title: 'Social Sync', icon: Sparkles },
  { id: 'review', title: 'Review', icon: CheckCircle2 },
];

export default function OnboardingWizard({ userEmail }: { userEmail: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      email: userEmail,
      gender: 'Prefer not to say',
      firstName: '',
      lastName: '',
    }
  });

  const formData = watch();

  const nextStep = async () => {
    // Validate current step before proceeding
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['firstName', 'lastName', 'gender', 'dob', 'phoneNumber'];
    if (currentStep === 1) fieldsToValidate = ['email', 'portfolioUrl'];
    if (currentStep === 2) fieldsToValidate = ['linkedinUrl', 'githubUrl', 'leetcodeUrl'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: OnboardingValues) => {
    setLoading(true);
    const result = await completeOnboarding(data);
    setLoading(false);

    if (result.success) {
      toast.success('Onboarding complete! Welcome to Career Studio.');
      // Use window.location for a full refresh to ensure session cookie is picked up by middleware
      window.location.href = '/dashboard';
    } else {
      toast.error(result.message || 'Something went wrong');
    }
  };

  return (
    <div className="surface-card p-1 items-center overflow-hidden border border-white/40 shadow-2xl backdrop-blur-md rounded-[48px] bg-white/70" suppressHydrationWarning>
      <div className="flex flex-col md:flex-row h-full min-h-[600px]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 p-10 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-100/50">
          <div className="mb-10">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Onboarding</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Foundational Sync</p>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;

              return (
                <div 
                  key={step.id} 
                  className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                    isActive ? 'bg-white shadow-sm border border-slate-100' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-orange-500 text-white' : 
                    isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold leading-none ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </span>
                    {isActive && <span className="text-[10px] text-orange-500 font-medium mt-1 animate-pulse">Current Step</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-10 hidden md:block">
            <div className="p-4 rounded-3xl bg-orange-50/50 border border-orange-100/30">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Pro Tip</p>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Connect your LeetCode and GitHub for the most accurate AI resume strategy.
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-10 flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col" suppressHydrationWarning>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {/* Step 1: Personal */}
                {currentStep === 0 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">Personal Identity</h2>
                      <p className="text-slate-500 text-sm mt-1">Let's get the basics down.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">First Name</label>
                        <input {...register('firstName')} placeholder="Jane" className="input-field" suppressHydrationWarning />
                        {errors.firstName && <p className="text-xs text-rose-500 ml-1">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Last Name</label>
                        <input {...register('lastName')} placeholder="Smith" className="input-field" suppressHydrationWarning />
                        {errors.lastName && <p className="text-xs text-rose-500 ml-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Gender</label>
                        <select {...register('gender')} className="input-field appearance-none bg-white" suppressHydrationWarning>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-xs text-rose-500 ml-1">{errors.gender.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Date of Birth</label>
                        <div className="relative">
                           <input type="date" {...register('dob')} className="input-field pl-10" suppressHydrationWarning />
                           <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        {errors.dob && <p className="text-xs text-rose-500 ml-1">{errors.dob.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Protocol</label>
                      <div className="relative">
                        <input {...register('phoneNumber')} placeholder="+1 (555) 000-0000" className="input-field pl-10" suppressHydrationWarning />
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      {errors.phoneNumber && <p className="text-xs text-rose-500 ml-1">{errors.phoneNumber.message}</p>}
                    </div>
                  </div>
                )}

                {/* Step 2: Professional */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">Professional Contact</h2>
                      <p className="text-slate-500 text-sm mt-1">How can recruiters and we reach you?</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Identifier</label>
                      <div className="relative">
                        <input {...register('email')} disabled className="input-field pl-10 opacity-60 bg-slate-50 cursor-not-allowed" suppressHydrationWarning />
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 italic ml-1">Primary authentication address (read-only).</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Digital Portfolio</label>
                      <div className="relative">
                        <input {...register('portfolioUrl')} placeholder="https://janedoe.me" className="input-field pl-10" suppressHydrationWarning />
                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      {errors.portfolioUrl && <p className="text-xs text-rose-500 ml-1">{errors.portfolioUrl.message}</p>}
                    </div>
                  </div>
                )}

                {/* Step 3: Social Sync */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">Social Sync</h2>
                      <p className="text-slate-500 text-sm mt-1">Connect your developer and professional hubs.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                          <User size={16} className="text-blue-600" /> LinkedIn URL
                        </label>
                        <input {...register('linkedinUrl')} placeholder="https://linkedin.com/in/..." className="input-field" suppressHydrationWarning />
                        {errors.linkedinUrl && <p className="text-xs text-rose-500">{errors.linkedinUrl.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                          <Code2 size={16} className="text-slate-900" /> GitHub URL
                        </label>
                        <input {...register('githubUrl')} placeholder="https://github.com/..." className="input-field" suppressHydrationWarning />
                        {errors.githubUrl && <p className="text-xs text-rose-500">{errors.githubUrl.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                          <Code2 size={16} className="text-orange-600" /> LeetCode URL
                        </label>
                        <input {...register('leetcodeUrl')} placeholder="https://leetcode.com/u/..." className="input-field" suppressHydrationWarning />
                        {errors.leetcodeUrl && <p className="text-xs text-rose-500">{errors.leetcodeUrl.message}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">Final Reflection</h2>
                      <p className="text-slate-500 text-sm mt-1">Confirm your professional foundation.</p>
                    </div>

                    <div className="surface-soft p-8 rounded-[32px] border border-slate-100/50 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</p>
                          <p className="text-sm font-bold text-slate-700">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Born</p>
                          <p className="text-sm font-bold text-slate-700">{formData.dob}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gender</p>
                          <p className="text-sm font-bold text-slate-700">{formData.gender}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</p>
                          <p className="text-sm font-bold text-slate-700">{formData.phoneNumber}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                        {formData.linkedinUrl && <Badge label="LinkedIn" icon={User} />}
                        {formData.githubUrl && <Badge label="GitHub" icon={Code2} />}
                        {formData.leetcodeUrl && <Badge label="LeetCode" icon={Code2} />}
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[24px] flex items-start gap-4">
                      <CheckCircle2 className="text-emerald-500 h-6 w-6 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-emerald-900 leading-tight">Identity Verified</p>
                        <p className="text-xs text-emerald-700 mt-1">Everything looks professional. You're ready to unlock the AI dashboard.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between" suppressHydrationWarning>
              <button 
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-opacity ${
                  currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-600'
                }`}
                suppressHydrationWarning
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <div className="flex gap-4">
                {currentStep < STEPS.length - 1 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="btn-primary px-10"
                    suppressHydrationWarning
                  >
                    Continue
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-orange-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-xl shadow-orange-200"
                    suppressHydrationWarning
                  >
                    {loading ? 'Initializing Workspace...' : 'Launch Dashboard'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
      <Icon size={12} className="text-slate-400" />
      <span className="text-[10px] font-bold text-slate-600">{label}</span>
    </div>
  );
}
