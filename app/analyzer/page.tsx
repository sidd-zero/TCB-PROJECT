"use client";

import { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Loader2,
  MessageSquare,
  Copy,
  Check,
  Target,
  UploadCloud,
  Cpu,
  SearchCode,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AnalysisResult = {
  atsScore: {
    score: number;
    foundKeywords: string[];
    missingKeywords: string[];
    parsingWarnings: string[];
    scoreJustification: string;
  };
  analyzerScore: {
    score: number;
    vibeMatch: string;
    impactRating: string;
    cultureFitSuggestions: string;
    scoreJustification: string;
  };
  overallShortlistProbability: 'High' | 'Medium' | 'Low';
  matchScore: number;
  suggestions: string;
};

type OutreachResult = {
  outreach: {
    startup: { message: string; strategy: string };
    corporate: { message: string; strategy: string };
    technical: { message: string; strategy: string };
  };
};

type FAQResult = {
  faq: {
    question: string;
    insight: string;
    category: string;
  }[];
};

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [outreachResults, setOutreachResults] = useState<OutreachResult | null>(null);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [faqResults, setFaqResults] = useState<FAQResult | null>(null);
  const [isGeneratingFaq, setIsGeneratingFaq] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const handleOutreach = async () => {
    if (!results) return;

    setIsGeneratingOutreach(true);
    setOutreachResults(null);

    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vibe: results.analyzerScore.vibeMatch || 'General Corporate', 
          strength: results.analyzerScore.impactRating || 'Strong professional background', 
          role: 'Target Role' 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOutreachResults(data);
      } else {
        setError(data.error || 'Failed to generate outreach');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error generating outreach');
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const handleFetchFaq = async () => {
    if (!jobDescription.trim()) return;

    setIsGeneratingFaq(true);
    setFaqResults(null);

    try {
      const res = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, role: 'Target Role' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFaqResults(data);
      } else {
        setError(data.error || 'Failed to generate interview questions');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error generating FAQ');
    } finally {
      setIsGeneratingFaq(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div className="surface-card hero-card">
          <div>
            <h1 className="page-title">Deep Analysis Studio</h1>
            <p className="page-subtitle">
              The unified workspace for ATS keyword synchronization and strategic recruiter feedback.
              Identify technical gaps and human appeal in one click.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="pill">
              <span className="status-dot bg-[color:var(--accent-3)]" />
              ATS Keywords
            </div>
            <div className="pill">
              <span className="status-dot bg-[color:var(--accent)]" />
              Strategic Score
            </div>
            <div className="pill">
              <span className="status-dot bg-[color:var(--accent-2)]" />
              Outreach Drafts
            </div>
          </div>
        </div>

        <div className="hero-grid">
          <div className="surface-panel mini-card">
            <div className="metric-label">Step 1</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Upload resume</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">PDF or Word files only.</p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Step 2</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Paste JD brief</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">Include all requirements.</p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Logic</div>
            <div className="text-xl font-bold tracking-[-0.04em]">ATS Keyword Sync</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">Machine reading check.</p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Human</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Strategic Assessment</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">Recruiter logic check.</p>
          </div>
        </div>
      </section>

      {error && (
        <div className="error-alert">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <section className="bento-grid">
        <div className="span-5 surface-card section-card">
          <div className="section-header">
            <div>
              <div className="eyebrow">Input 1</div>
              <div className="section-title mt-2">Resume PDF</div>
            </div>
            <div className="icon-tile tint-blue">
              <UploadCloud className="h-5 w-5" />
            </div>
          </div>

          <motion.label 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="drop-zone block"
          >
            <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} />
            <div className="flex min-h-[14rem] flex-col items-center justify-center text-center">
              <div className="icon-tile tint-blue h-14 w-14 rounded-[20px]">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div className="mt-4 text-base font-semibold">Select your document</div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Resume parsed in seconds.</p>
              <div className="mt-5">
                {isUploading ? (
                  <div className="pill">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                ) : file ? (
                  <div className="pill">
                    <CheckCircle2 className="h-4 w-4 text-[color:var(--accent-2)]" />
                    {file.name}
                  </div>
                ) : (
                  <div className="pill">PDF / Word</div>
                )}
              </div>
            </div>
          </motion.label>
        </div>

        <div className={`span-7 surface-card section-card ${!resumeId ? 'opacity-60' : ''}`}>
          <div className="section-header">
            <div>
              <div className="eyebrow">Input 2</div>
              <div className="section-title mt-2">Target Job Description</div>
            </div>
            <div className="icon-tile tint-warm">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste role requirements here..."
            className="textarea-field min-h-[16rem]"
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-widest">
              {resumeId ? 'Context Ready' : 'Awaiting Resume'}
            </div>
            <motion.button
              whileHover={resumeId ? { scale: 1.02 } : {}}
              whileTap={resumeId ? { scale: 0.98 } : {}}
              onClick={handleAnalyze}
              disabled={!resumeId || !jobDescription.trim() || isAnalyzing}
              className="btn-primary px-8"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  Deep Analysis
                  <ChevronRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-stack mt-8"
          >
            {/* Logic Score Card */}
            <section className="bento-grid">
              <div className="span-4 surface-panel section-card flex flex-col justify-between">
                <div className="section-header">
                  <div>
                    <div className="section-title">ATS Visibility</div>
                    <p className="section-copy">Machine parsing effectiveness.</p>
                  </div>
                  <div className="icon-tile tint-blue">
                    <Cpu className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-6 relative">
                  <div className="absolute inset-0 bg-radial-gradient(circle, rgba(55,80,92,0.05), transparent) opacity-50" />
                  <div className="text-7xl font-black tracking-[-0.08em] text-[color:var(--accent-3)] relative z-10">
                    {results.atsScore.score}%
                  </div>
                  <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500 relative z-10">
                    Keyword Density
                  </div>
                </div>
                
                <div className="mt-auto px-4 pb-4">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${results.atsScore.score}%` }}
                      className="h-full bg-[color:var(--accent-3)]" 
                    />
                  </div>
                </div>
              </div>

              {/* Keyword Detail Card */}
              <div className="span-8 surface-card section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">Keyword Synchronization</div>
                    <p className="section-copy">Matches found vs. critical skill deficits.</p>
                  </div>
                  <div className="icon-tile tint-green">
                    <SearchCode className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="space-y-6 mt-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Matches Found</div>
                    <div className="flex flex-wrap gap-2">
                       {results.atsScore.foundKeywords.map((kw, idx) => (
                         <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                           {kw}
                         </span>
                       ))}
                       {results.atsScore.foundKeywords.length === 0 && <span className="text-slate-400 text-sm">No matches found.</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-2">Missing Skills</div>
                    <div className="flex flex-wrap gap-2">
                       {results.atsScore.missingKeywords.map((kw, idx) => (
                         <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                           {kw}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Score Card */}
              <div className="span-4 surface-panel section-card flex flex-col justify-between">
                <div className="section-header">
                  <div>
                    <div className="section-title">Recruiter Fit</div>
                    <p className="section-copy">Human assessment and persona match.</p>
                  </div>
                  <div className="icon-tile tint-warm">
                    <Target className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-6 relative">
                  <div className="absolute inset-0 bg-radial-gradient(circle, rgba(247,111,142,0.05), transparent) opacity-50" />
                  <div className="text-7xl font-black tracking-[-0.08em] text-[color:var(--accent)] relative z-10">
                    {results.analyzerScore.score}%
                  </div>
                  <div className="mt-4 px-4 py-1.5 rounded-full border border-orange-100 bg-orange-50 text-amber-700 text-[10px] font-black uppercase tracking-widest relative z-10">
                    Vibe: {results.analyzerScore.vibeMatch}
                  </div>
                </div>
                
                <div className="mt-auto space-y-4 px-4 pb-4">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${results.analyzerScore.score}%` }}
                      className="h-full bg-[color:var(--accent)]" 
                    />
                  </div>
                   <div className={`text-center text-[10px] font-black uppercase tracking-widest py-1.5 rounded-lg ${
                      results.overallShortlistProbability === 'High' ? 'text-emerald-600 bg-emerald-50' : 
                      results.overallShortlistProbability === 'Medium' ? 'text-amber-600 bg-amber-50' : 
                      'text-rose-600 bg-rose-50'
                   }`}>
                      {results.overallShortlistProbability} Probability
                   </div>
                </div>
              </div>

              {/* Analysis Breakdown Card */}
              <div className="span-8 surface-card section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">Recruiter Feedback</div>
                    <p className="section-copy">Expert justification for your match rating.</p>
                  </div>
                  <div className="icon-tile tint-blue">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-2 text-lg leading-relaxed text-[color:var(--text)] font-semibold tracking-tight p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                  "{results.analyzerScore.scoreJustification}"
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                   <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-100">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Impact Rating</div>
                      <div className="font-bold text-slate-700">{results.analyzerScore.impactRating}</div>
                   </div>
                   <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-100">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Culture Match</div>
                      <div className="font-bold text-slate-700">{results.analyzerScore.vibeMatch}</div>
                   </div>
                </div>
              </div>

              {/* Strategy & Parsing Card */}
              <div className="span-7 surface-panel section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">Parsing Health</div>
                    <p className="section-copy">Formatting obstacles detected in document structure.</p>
                  </div>
                  <div className="icon-tile !bg-slate-100 !text-slate-500">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                   {results.atsScore.parsingWarnings.map((warning, idx) => (
                     <div key={idx} className="flex gap-3 p-4 rounded-2xl bg-white/50 border border-slate-100 items-start">
                        <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                        <p className="text-xs font-bold text-slate-600 leading-normal">{warning}</p>
                     </div>
                   ))}
                   {results.atsScore.parsingWarnings.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-6 text-center opacity-40">
                        <CheckCircle2 size={32} className="mb-2" />
                        <p className="text-sm font-bold uppercase tracking-widest">Standard clean parse</p>
                     </div>
                   )}
                </div>
              </div>

              <div className="span-5 surface-card section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">Career Strategy</div>
                    <p className="section-copy">Immediate language pivots.</p>
                  </div>
                  <div className="icon-tile tint-blue">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 p-5 rounded-[24px] bg-slate-50 text-sm leading-7 text-[color:var(--text)] font-semibold italic">
                   {results.analyzerScore.cultureFitSuggestions}
                </div>
              </div>

              {/* Outreach Generation */}
              <div className="span-12 surface-card section-card overflow-hidden">
                <div className="section-header">
                  <div>
                    <div className="section-title">Networking Outreach Crafting</div>
                    <p className="section-copy">Persona-based LinkedIn connection requests generated from analysis results.</p>
                  </div>
                  <div className="icon-tile tint-blue">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                </div>

                {!outreachResults ? (
                  <div className="empty-state min-h-[12rem] bg-slate-50/50 rounded-[32px]">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[color:var(--line)] flex items-center justify-center mb-4 text-slate-400">
                      <MessageSquare size={24} />
                    </div>
                    <h4 className="font-black text-slate-900 mb-2">Ready to connect?</h4>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm font-medium leading-relaxed px-4">
                      Turn these insights into high-conversion outreach strategies using our persona-based generator.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOutreach}
                      disabled={isGeneratingOutreach}
                      className="btn-primary flex items-center gap-2"
                    >
                      {isGeneratingOutreach ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Crafting...
                        </>
                      ) : (
                        <>
                          Generate Outreach
                          <ChevronRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {(['startup', 'corporate', 'technical'] as const).map((vibe) => {
                      const data = outreachResults.outreach[vibe];
                      const isCopied = copiedId === vibe;

                      return (
                        <motion.div
                          key={vibe}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                          className="surface-panel p-6 flex flex-col h-full bg-white group hover:bg-slate-50/50 transition-all cursor-default border-slate-100/50 relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-[color:var(--accent)] opacity-20" />
                          <div className="flex items-center justify-between mb-6">
                            <div className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              {vibe} persona
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(data.message, vibe)}
                              className={`p-2 rounded-xl transition-all ${
                                isCopied 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-slate-100 text-slate-400 hover:text-[#f76f8e] hover:bg-white'
                              }`}
                            >
                              {isCopied ? <Check size={16} /> : <Copy size={16} />}
                            </motion.button>
                          </div>
                          
                          <div className="flex-1 text-sm leading-8 text-[color:var(--text)] font-semibold mb-8 italic relative z-10">
                            "{data.message}"
                          </div>

                          <div className="mt-auto pt-6 border-t border-slate-100/50">
                            <div className="text-[10px] font-black uppercase tracking-wider text-[color:var(--accent)] mb-1.5 opacity-60">Target Strategy</div>
                            <div className="text-[11px] text-slate-500 font-bold leading-relaxed">
                              {data.strategy}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Interview FAQ Section */}
              <div className="span-12 surface-card section-card overflow-hidden">
                <div className="section-header">
                  <div>
                    <div className="section-title">Interview FAQ Prep</div>
                    <p className="section-copy">Standard HR questions frequently asked for this specific role, sourced from common industry practices.</p>
                  </div>
                  <div className="icon-tile tint-warm">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                </div>

                {!faqResults ? (
                  <div className="empty-state min-h-[12rem] bg-slate-50/50 rounded-[32px]">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[color:var(--line)] flex items-center justify-center mb-4 text-slate-400">
                      <HelpCircle size={24} />
                    </div>
                    <h4 className="font-black text-slate-900 mb-2">Ready for the interview?</h4>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm font-medium leading-relaxed px-4">
                      Get the top 5 standard HR questions asked for this role based on common internet databases.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFetchFaq}
                      disabled={isGeneratingFaq}
                      className="btn-primary flex items-center gap-2"
                    >
                      {isGeneratingFaq ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Retrieving...
                        </>
                      ) : (
                        <>
                          Fetch HR Questions
                          <ChevronRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4">
                    {faqResults.faq.map((item, idx) => {
                      const isCopied = copiedId === `faq-${idx}`;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.01 }}
                          transition={{ delay: idx * 0.1 }}
                          className="surface-panel p-6 bg-white border-slate-100/50 hover:bg-slate-50/30 transition-all group relative overflow-hidden"
                        >
                           <div className={`absolute left-0 top-0 w-1 h-full ${
                            item.category === 'Behavioral' ? 'bg-blue-400' :
                            item.category === 'Technical' ? 'bg-purple-400' :
                            'bg-emerald-400'
                          } opacity-30`} />
                          
                          <div className="flex justify-between items-start gap-4 relative z-10">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                  item.category === 'Behavioral' ? 'bg-blue-50 text-blue-600' :
                                  item.category === 'Technical' ? 'bg-purple-50 text-purple-600' :
                                  'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {item.category}
                                </span>
                                <span className="text-[10px] font-bold text-[color:var(--muted)] opacity-60">Question {idx + 1}</span>
                              </div>
                              <h4 className="text-base font-bold text-slate-800 leading-relaxed mb-3">
                                {item.question}
                              </h4>
                              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/40 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">HR Intent</div>
                                </div>
                                <p className="text-xs text-amber-900/80 font-medium leading-relaxed italic">
                                  "{item.insight}"
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(item.question, `faq-${idx}`)}
                              className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                                isCopied 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-slate-50 text-slate-400 hover:text-[color:var(--accent)] hover:bg-white border border-transparent hover:border-slate-100'
                              }`}
                            >
                              {isCopied ? <Check size={16} /> : <Copy size={16} />}
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
