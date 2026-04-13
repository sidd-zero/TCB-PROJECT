'use client';

import { motion } from 'framer-motion';
import { User, Code2, Globe, Link as LinkIcon, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { AccountValues } from '@/lib/validations/settingsSchema';

interface ProfileReflectionProps {
  data: AccountValues;
  onEdit: () => void;
}

export default function ProfileReflection({ data, onEdit }: ProfileReflectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] bg-white shadow-2xl border-4 border-white/50 overflow-hidden flex items-center justify-center backdrop-blur-md">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <User className="text-slate-200 h-16 w-16" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 border-4 border-white">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{data.name}</h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-slate-500 font-medium">
            <Mail size={16} />
            <span>{data.email}</span>
          </div>
          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
              Career Studio Member
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
              Active Candidate
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface-soft p-8 border border-white/40 shadow-sm backdrop-blur-sm rounded-[32px] md:col-span-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Professional Narrative</div>
          <p className="text-lg leading-relaxed text-slate-700 font-medium italic">
            {data.bio || "No professional narrative has been established yet. Your bio helps AI tailor your career strategy."}
          </p>
        </div>

        <div className="surface-soft p-8 border border-white/40 shadow-sm backdrop-blur-sm rounded-[32px]">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Digital Footprint</div>
          <div className="space-y-4">
            <SocialLink icon={Code2} label="GitHub" url={data.githubUrl} />
            <SocialLink icon={Code2} label="LeetCode" url={data.leetcodeUrl} />
            <SocialLink icon={User} label="LinkedIn" url={data.linkedinUrl} />
            <SocialLink icon={LinkIcon} label="Portfolio" url={data.portfolioUrl} />
          </div>
        </div>

        <div className="surface-panel p-8 border border-orange-100/30 bg-orange-50/20 rounded-[32px] flex flex-col justify-between">
           <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-4">Profile Maturity</div>
              <div className="text-2xl font-black text-slate-900">Expert Ready</div>
           </div>
           <button 
            onClick={onEdit}
            className="mt-8 px-6 py-3 bg-white border border-orange-100 rounded-2xl text-sm font-bold text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
           >
             Refine Profile details
             <ExternalLink size={16} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function SocialLink({ icon: Icon, label, url }: { icon: any, label: string, url?: string }) {
  if (!url) return (
    <div className="flex items-center gap-3 opacity-30">
      <div className="p-2 bg-white rounded-lg border border-slate-100">
        <Icon size={16} />
      </div>
      <span className="text-sm font-bold">{label} (Not Set)</span>
    </div>
  );

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:border-orange-100 group-hover:bg-orange-50 transition-colors">
          <Icon size={16} className="group-hover:text-orange-600" />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <ExternalLink size={14} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
    </a>
  );
}
