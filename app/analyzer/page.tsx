"use client";

import { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Loader2,
  Target,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

type AnalysisResult = {
  matchScore: number;
  missingSkills: string[];
  suggestions: string;
};

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
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
          <div className="span-4 surface-panel section-card">
            <div className="section-header">
              <div>
                <div className="section-title">Match score</div>
                <p className="section-copy">A quick signal for role alignment.</p>
              </div>
              <div className="icon-tile tint-green">
                <Target className="h-5 w-5" />
              </div>
            </div>

            <div className={`text-6xl font-black tracking-[-0.08em] ${scoreTone}`}>
              {score}%
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/8">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${score}%`,
                  backgroundColor: `color-mix(in srgb, ${meterTone} 88%, white)`,
                }}
              />
            </div>
          </div>

          <div className="span-8 surface-card section-card">
            <div className="section-header">
              <div>
                <div className="section-title">Suggestions</div>
                <p className="section-copy">Plain-language notes generated from the comparison.</p>
              </div>
              <div className="icon-tile tint-warm">
                <Lightbulb className="h-5 w-5" />
              </div>
            </div>
            <div className="rounded-[20px] border border-[color:var(--line)] bg-white/50 px-4 py-4 text-sm leading-7 text-[color:var(--muted-strong)]">
              {results.suggestions}
            </div>
          </div>

          <div className="span-12 surface-card section-card">
            <div className="section-header">
              <div>
                <div className="section-title">Missing skills</div>
                <p className="section-copy">Terms or capabilities the analysis did not find clearly.</p>
              </div>
              <div className="icon-tile tint-blue">
                <XCircle className="h-5 w-5" />
              </div>
            </div>

            {results.missingSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {results.missingSkills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-full border border-[rgba(180,83,60,0.18)] bg-[rgba(180,83,60,0.08)] px-3 py-2 text-sm font-medium text-[color:var(--danger)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="empty-state min-h-[8rem]">
                <CheckCircle2 className="h-6 w-6 text-[color:var(--accent-2)]" />
                <p className="text-sm">No missing skills were identified for this job description.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
