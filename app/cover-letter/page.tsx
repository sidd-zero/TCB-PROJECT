'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Copy,
  FileSignature,
  Loader2,
  UploadCloud,
} from 'lucide-react';

export default function CoverLetterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);
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

  const handleGenerate = async () => {
    if (!resumeId) {
      setError('Please upload a resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setCoverLetter('');
    setCopied(false);

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, jobDescription }),
      });
      const data = await res.json();
      if (res.ok) {
        setCoverLetter(data.coverLetter);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error generating letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div className="surface-card hero-card">
          <div>

            <h1 className="page-title">Write a clear, focused cover letter.</h1>
            <p className="page-subtitle">
              Use your resume and job details to create a well-structured draft you can review and refine.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="pill">Resume context</div>
            <div className="pill">Role-specific writing</div>
            <div className="pill">Copy-ready output</div>
          </div>
        </div>

        <div className="hero-grid">
          <div className="surface-panel mini-card">
            <div className="metric-label">Input</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Upload the same resume</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Keep resume and letter grounded in the same source file.
            </p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Prompt</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Paste the job brief</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Include company tone and role expectations if available.
            </p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Output</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Readable single-column draft</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Better spacing makes editing and copying much easier.
            </p>
          </div>
          <div className="surface-panel mini-card">
            <div className="metric-label">Use</div>
            <div className="text-xl font-bold tracking-[-0.04em]">Edit before sending</div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Treat the generated result as a strong draft, not a final deliverable.
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
        <div className="span-5 space-y-4">
          <div className="surface-card section-card">
            <div className="section-header">
              <div>
                <div className="eyebrow">Step 1</div>
                <div className="section-title mt-2">Upload resume</div>
              </div>
              <div className="icon-tile tint-blue">
                <UploadCloud className="h-5 w-5" />
              </div>
            </div>

            <label className="drop-zone block">
              <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} />
              <div className="flex min-h-[12rem] flex-col items-center justify-center text-center">
                <div className="icon-tile tint-blue h-14 w-14 rounded-[20px]">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="mt-4 text-base font-semibold">Upload resume PDF or Word</div>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[color:var(--muted)]">
                  The cover letter generator reuses the uploaded resume content as source context.
                </p>

                <div className="mt-5">
                  {isUploading ? (
                    <div className="pill">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading
                    </div>
                  ) : file ? (
                    <div className="pill">
                      <CheckCircle2 className="h-4 w-4 text-[color:var(--accent-2)]" />
                      {file.name}
                    </div>
                  ) : (
                    <div className="pill">PDF or Word</div>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div className={`surface-card section-card ${!resumeId ? 'opacity-60' : ''}`}>
            <div className="section-header">
              <div>
                <div className="eyebrow">Step 2</div>
                <div className="section-title mt-2">Paste job description</div>
              </div>
              <div className="icon-tile tint-warm">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="textarea-field min-h-[14rem]"
            />

            <button
              onClick={handleGenerate}
              disabled={!resumeId || !jobDescription.trim() || isGenerating}
              className="btn-primary mt-4 w-full bg-[#113537] hover:bg-[#f76f8e]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating draft
                </>
              ) : (
                <>
                  Generate letter
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="span-7 surface-panel section-card flex min-h-[38rem] flex-col">
          <div className="section-header">
            <div>
              <div className="section-title">Generated output</div>
              <p className="section-copy">A cleaner reading pane for editing before you copy.</p>
            </div>
            {coverLetter && (
              <button onClick={copyToClipboard} className="btn-secondary">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[color:var(--accent-2)]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 rounded-[24px] border border-[color:var(--line)] bg-white/50 p-5">
            {coverLetter ? (
              <div className="whitespace-pre-wrap text-[15px] leading-8 text-[color:var(--muted-strong)]">
                {coverLetter}
              </div>
            ) : (
              <div className="empty-state h-full min-h-[28rem]">
                <div className="icon-tile tint-warm h-14 w-14 rounded-[20px]">
                  <FileSignature className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-semibold text-[color:var(--text)]">
                    No letter generated yet
                  </div>
                  <p className="mt-1 text-sm">
                    Upload a resume and add the target role description to generate a draft.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
