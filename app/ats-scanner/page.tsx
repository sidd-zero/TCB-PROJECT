"use client";

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Cpu,
  FileText,
  Loader2,
  SearchCode,
  Target,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ATSResult = {
  atsScore: {
    score: number;
    foundKeywords: string[];
    missingKeywords: string[];
    parsingWarnings: string[];
    scoreJustification: string;
  };
  overallShortlistProbability: 'High' | 'Medium' | 'Low';
};

export default function ATSScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ATSResult | null>(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.resumeId) {
          setResumeId(data.resumeId);
        } else {
          setError(data.error || 'Failed to upload file');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error uploading file');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!resumeId) {
      setError('Please upload a resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, jobDescription }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error analyzing resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const score = results?.atsScore.score ?? 0;
  const probability = results?.overallShortlistProbability ?? 'Low';

  const probColor = 
    probability === 'High' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
    probability === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100' :
    'text-rose-600 bg-rose-50 border-rose-100';

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div className="surface-card hero-card">
          <div>

            <h1 className="page-title text-[#113537] mt-2">ATS Visibility Score</h1>
            <p className="page-subtitle text-[#37505c]/60 mt-4 leading-relaxed">
              Verify how well your resume performs against modern tracking systems. 
              We check your formatting match, keyword optimization, and structural clarity 
              to ensure your application reaches the hiring manager.
            </p>
          </div>

        </div>

        <div className="hero-grid">
           <div className="surface-panel p-6 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#f76f8e]/10 rounded-full blur-2xl" />
              <SearchCode size={32} className="text-[#f76f8e]/20 mb-4" />
              <div className="text-sm font-bold text-[#37505c]/40 uppercase tracking-wider mb-1">Keywords</div>
              <div className="text-2xl font-black text-[#113537] tracking-tight">Keyword Match</div>
           </div>
           <div className="surface-panel p-6 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#96616b]/10 rounded-full blur-2xl" />
              <CheckCircle2 size={32} className="text-[#96616b]/20 mb-4" />
              <div className="text-sm font-bold text-[#37505c]/40 uppercase tracking-wider mb-1">Structure</div>
              <div className="text-2xl font-black text-[#113537] tracking-tight">ATS Formatting</div>
           </div>
        </div>
      </section>

      {error && (
        <div className="error-alert p-4 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <section className="bento-grid">
        <div className="span-5 surface-card section-card">
          <div className="section-header">
            <div>
              <div className="eyebrow">Step 1</div>
              <div className="section-title mt-2">Resume Document</div>
            </div>
            <div className="icon-tile tint-blue">
              <UploadCloud className="h-5 w-5" />
            </div>
          </div>

          <motion.label 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="drop-zone block cursor-pointer group"
          >
            <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} />
            <div className="flex min-h-[16rem] flex-col items-center justify-center text-center p-8 transition-colors group-hover:bg-[#f76f8e]/5">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-7 w-7 text-[#f76f8e]" />
              </div>
              <div className="text-lg font-bold text-slate-900">Upload Resume</div>
              <p className="mt-2 max-w-sm text-sm text-slate-500/80 leading-relaxed font-medium">
                Select your resume (PDF or Word) to analyze its ATS performance and keyword optimization.
              </p>

              <div className="mt-6">
                {isUploading ? (
                  <div className="pill py-2.5 px-5 bg-slate-900 text-white border-0">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing Document...
                  </div>
                ) : file ? (
                  <div className="pill py-2.5 px-5 bg-emerald-50 text-emerald-600 border-emerald-100 font-bold">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {file.name}
                  </div>
                ) : (
                  <div className="pill py-2.5 px-5 text-slate-400 border-slate-200">PDF or Word</div>
                )}
              </div>
            </div>
          </motion.label>
        </div>

        <div className={`span-7 surface-card section-card ${!resumeId ? 'opacity-40' : ''} transition-all`}>
          <div className="section-header">
            <div>
              <div className="eyebrow">Step 2</div>
              <div className="section-title mt-2">Role Description</div>
              <p className="section-copy">
                Paste the requirements to identify missing skills and top-priority keywords.
              </p>
            </div>
            <div className="icon-tile tint-warm">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={!resumeId}
            placeholder="Paste target job description here..."
            className="textarea-field min-h-[18rem] bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${resumeId ? 'bg-emerald-500' : 'bg-slate-300'}`} />
               {resumeId ? 'Ready to analyze' : 'Please upload your resume first'}
            </div>
            <motion.button
              whileHover={resumeId ? { x: 5 } : {}}
              whileTap={resumeId ? { scale: 0.96 } : {}}
              onClick={handleAnalyze}
              disabled={!resumeId || !jobDescription.trim() || isAnalyzing}
              className={`btn-primary px-8 py-3.5 flex items-center gap-3 ${!resumeId ? 'grayscale' : ''}`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze for ATS
                  <ChevronRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </section>

      <AnimatePresence>
      {results && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-grid py-6"
        >
          {/* ATS Main Score */}
          <div className="span-4 surface-panel p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                 <div className="text-xs font-bold text-[#37505c]/40 uppercase tracking-widest">Compatibility</div>
                 <Cpu className="text-[#f76f8e]" size={20} />
              </div>
              <div className="text-7xl font-black text-[#113537] tracking-tighter mb-4">
                {score}<span className="text-3xl text-slate-300">%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className="h-full bg-[#f76f8e]" 
                 />
              </div>
            </div>
            <div className="mt-8">
               <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                 "This score indicates how effectively modern systems can interpret your background for this specific role."
               </p>
            </div>
          </div>

          {/* System Analysis Justification */}
          <div className="span-8 surface-card p-8 border-[#f76f8e]/10 bg-[#f76f8e]/5">
            <div className="section-header">
              <div>
                <div className="section-title text-slate-900">System Analysis</div>
                <p className="section-copy text-slate-500 font-medium">Constructive feedback for better visibility.</p>
              </div>
              <div className="icon-tile border-slate-100 bg-slate-50 text-slate-400">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div className="text-lg leading-9 text-slate-800 font-bold mt-4 tracking-tight">
               {results.atsScore.scoreJustification}
            </div>
            
            <div className={`mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-black uppercase tracking-widest ${probColor}`}>
               Match Prob: {probability}
            </div>
          </div>

          <div className="span-7 surface-card section-card">
              <div className="section-header">
                <div>
                  <div className="section-title">Keyword Synchronization</div>
                  <p className="section-copy">Matches found between Resume and JD.</p>
                </div>
                <div className="icon-tile tint-green">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                 <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Found Tags</div>
                    <div className="flex flex-wrap gap-2">
                       {results.atsScore.foundKeywords.map((kw, idx) => (
                         <span key={idx} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                           {kw}
                         </span>
                       ))}
                       {results.atsScore.foundKeywords.length === 0 && <span className="text-slate-400 text-sm font-medium">None detected.</span>}
                    </div>
                 </div>
                 <div className="h-px bg-slate-100" />
                 <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Critical Deficit</div>
                    <div className="flex flex-wrap gap-2">
                       {results.atsScore.missingKeywords.map((kw, idx) => (
                         <span key={idx} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                           {kw}
                         </span>
                       ))}
                       {results.atsScore.missingKeywords.length === 0 && <span className="text-slate-400 text-sm font-medium">Zero deficit found.</span>}
                    </div>
                 </div>
              </div>
          </div>

          {/* Parsing Warnings */}
          <div className="span-5 surface-panel p-8 border-slate-200">
             <div className="section-header">
                <div>
                  <div className="section-title">System Warnings</div>
                  <p className="section-copy">Detected formatting obstacles.</p>
                </div>
                <div className="icon-tile bg-white border-slate-100 text-slate-400">
                  <AlertCircle size={20} />
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                 {results.atsScore.parsingWarnings.map((warning, idx) => (
                   <div key={idx} className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-start">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                      <p className="text-sm font-bold text-slate-600 leading-normal">
                         {warning}
                      </p>
                   </div>
                 ))}
                 {results.atsScore.parsingWarnings.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-6 text-center opacity-40">
                      <CheckCircle2 size={32} className="mb-2" />
                      <p className="text-sm font-bold">Standard clean parse</p>
                   </div>
                 )}
              </div>
          </div>

        </motion.section>
      )}
      </AnimatePresence>
    </div>
  );
}
