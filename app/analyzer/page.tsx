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
  XCircle,
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
  matchScore: number; // For average/legacy support
  suggestions: string; // Map from cultureFitSuggestions
};

type OutreachResult = {
  outreach: {
    startup: { message: string; strategy: string };
    corporate: { message: string; strategy: string };
    technical: { message: string; strategy: string };
  };
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

    const vibe = results.analyzerScore.vibeMatch || 'General Corporate';
    const strength = results.analyzerScore.impactRating || 'Strong professional background';
    const role = 'Target Role';

    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe, strength, role }),
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const score = results?.matchScore ?? 0;

  const scoreTone =
    score >= 70
      ? 'text-[color:var(--accent-2)]'
      : score >= 40
        ? 'text-[color:var(--accent)]'
        : 'text-[color:var(--danger)]';

  const meterTone =
    score >= 70
      ? 'var(--accent-2)'
      : score >= 40
        ? 'var(--accent)'
        : 'var(--danger)';

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div className="surface-card hero-card">
          <div>
            <div className="eyebrow">
              <Target className="h-4 w-4" />
              Resume analyzer
            </div>
            <h1 className="page-title">Check how closely your resume fits the role.</h1>
            <p className="page-subtitle">
              Upload a PDF, paste the target job description, and get a match score with clear gaps
              and suggestions. The new layout keeps input and results readable without feeling noisy.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="pill">
              <span className="status-dot bg-[color:var(--accent-3)]" />
              PDF upload
            </div>
            <div className="pill">
              <span className="status-dot bg-[color:var(--accent)]" />
              Skills gap detection
            </div>
            <div className="pill">
              <span className="status-dot bg-[color:var(--accent-2)]" />
              Fit score
            </div>
          </div>
        </div>

        <div className="hero-grid">
          <div className="surface-panel mini-card">
            <div className="metric-label">Step 1</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Upload current resume</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Use the final PDF version you actually plan to send.
            </p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Step 2</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Paste target role brief</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Include the responsibilities and requirements section.
            </p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Step 3</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Review the gaps</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Update bullets or keywords before the application goes out.
            </p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Output</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Readable by design</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Score, missing skills, and suggestions stay separated in dedicated cards.
            </p>
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
              <div className="eyebrow">Step 1</div>
              <div className="section-title mt-2">Upload resume PDF</div>
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
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
            <div className="flex min-h-[14rem] flex-col items-center justify-center text-center">
              <div className="icon-tile tint-blue h-14 w-14 rounded-[20px]">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div className="mt-4 text-base font-semibold">Drop a PDF here or click to browse</div>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[color:var(--muted)]">
                The upload is parsed immediately so the analyzer can reuse the same resume context.
              </p>

              <div className="mt-5">
                {isUploading ? (
                  <div className="pill">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading and parsing
                  </div>
                ) : file ? (
                  <div className="pill">
                    <CheckCircle2 className="h-4 w-4 text-[color:var(--accent-2)]" />
                    {file.name}
                  </div>
                ) : (
                  <div className="pill">PDF only</div>
                )}
              </div>
            </div>
          </motion.label>
        </div>

        <div className={`span-7 surface-card section-card ${!resumeId ? 'opacity-60' : ''}`}>
          <div className="section-header">
            <div>
              <div className="eyebrow">Step 2</div>
              <div className="section-title mt-2">Paste job description</div>
              <p className="section-copy">
                Focus on requirements, responsibilities, and must-have skills.
              </p>
            </div>
            <div className="icon-tile tint-warm">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target role description here..."
            className="textarea-field min-h-[16rem]"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-[color:var(--muted)]">
              {resumeId
                ? 'Resume uploaded. You can run the analysis now.'
                : 'Upload a resume first to unlock the analyzer.'}
            </div>
            <motion.button
              whileHover={resumeId ? { scale: 1.04, boxShadow: "0 0 20px rgba(201, 109, 66, 0.2)" } : {}}
              whileTap={resumeId ? { scale: 0.95 } : {}}
              onClick={handleAnalyze}
              disabled={!resumeId || !jobDescription.trim() || isAnalyzing}
              className="btn-primary"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  Analyze fit
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </section>

      {results && (
        <section className="bento-grid">
          {/* Recruiter Strategy Score */}
          <div className="span-4 surface-panel section-card flex flex-col justify-between">
            <div className="section-header">
              <div>
                <div className="section-title">Recruiter Strategy</div>
                <p className="section-copy">Human-level assessment of your profile.</p>
              </div>
              <div className="icon-tile tint-green">
                <Target className="h-5 w-5" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className={`text-7xl font-black tracking-[-0.08em] ${
                results.analyzerScore.score >= 70 ? 'text-[color:var(--accent-2)]' : 
                results.analyzerScore.score >= 40 ? 'text-[color:var(--accent)]' : 
                'text-[color:var(--danger)]'
              }`}>
                {results.analyzerScore.score}%
              </div>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Strategic Alignment
              </div>
            </div>

            <div className="mt-auto space-y-4">
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${results.analyzerScore.score}%` }}
                    className="h-full bg-[color:var(--accent-2)]" 
                  />
               </div>
               <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Probability</span>
                  <span className={`px-2 py-0.5 rounded border ${
                    results.overallShortlistProbability === 'High' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' :
                    results.overallShortlistProbability === 'Medium' ? 'text-amber-600 border-amber-100 bg-amber-50' :
                    'text-rose-600 border-rose-100 bg-rose-50'
                  }`}>
                    {results.overallShortlistProbability} Shortlist
                  </span>
               </div>
            </div>
          </div>

          {/* Brutal Truth Card */}
          <div className="span-8 surface-card section-card bg-[color:var(--surface-strong)] border-[color:var(--line-strong)]">
            <div className="section-header">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest mb-2 inline-block"
                >
                  Strict Protocol: Brutally Honest
                </motion.div>
                <div className="section-title">The Strategic Justification</div>
                <p className="section-copy">Why you are receiving this specific expert rating.</p>
              </div>
              <div className="icon-tile tint-warm">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 text-lg leading-9 text-[color:var(--text)] font-semibold tracking-tight p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
              "{results.analyzerScore.scoreJustification}"
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
               <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Impact Rating</div>
                  <div className="font-bold text-slate-700">{results.analyzerScore.impactRating}</div>
               </div>
               <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Vibe Match</div>
                  <div className="font-bold text-slate-700">{results.analyzerScore.vibeMatch}</div>
               </div>
            </div>
          </div>

          <div className="span-12 surface-card section-card">
            <div className="section-header">
              <div>
                <div className="section-title">Culture Fit & Optimization</div>
                <p className="section-copy">Expert suggestions to pivot your language for this specific company culture.</p>
              </div>
              <div className="icon-tile tint-warm">
                <Lightbulb className="h-5 w-5" />
              </div>
            </div>
            <div className="rounded-[24px] border border-[color:var(--line)] bg-slate-50/30 px-6 py-6 text-base leading-8 text-[color:var(--text)] font-medium">
              {results.analyzerScore.cultureFitSuggestions}
            </div>
          </div>

          <div className="span-12 surface-card section-card overflow-hidden">
            <div className="section-header">
              <div>
                <div className="section-title">Networking Outreach</div>
                <p className="section-copy">Persona-based LinkedIn connection requests.</p>
              </div>
              <div className="icon-tile tint-blue">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>

            {!outreachResults ? (
              <div className="empty-state min-h-[12rem] bg-slate-50/50">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[color:var(--line)] flex items-center justify-center mb-4 text-slate-400">
                  <MessageSquare size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Ready to connect?</h4>
                <p className="text-sm text-slate-500 mb-6 max-w-sm">
                  Generate tailored LinkedIn messages based on the Recruiter's assessment.
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
                      Crafting messages...
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['startup', 'corporate', 'technical'] as const).map((vibe) => {
                  const data = outreachResults.outreach[vibe];
                  const isCopied = copiedId === vibe;

                  return (
                    <motion.div
                      key={vibe}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="surface-panel p-6 flex flex-col h-full bg-white group hover:bg-slate-50 transition-all cursor-default"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {vibe} vibe
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(data.message, vibe)}
                          className={`p-2 rounded-xl transition-all ${
                            isCopied 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-slate-100 text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                          }`}
                        >
                          {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        </motion.button>
                      </div>
                      
                      <div className="flex-1 text-sm leading-7 text-slate-800 font-medium mb-6">
                        "{data.message}"
                        <div className="text-[10px] mt-2 text-slate-400 font-normal">
                          {data.message.length} / 300 characters
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100/50">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">Strategy</div>
                        <div className="text-[11px] text-slate-500 font-semibold italic">
                          {data.strategy}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
