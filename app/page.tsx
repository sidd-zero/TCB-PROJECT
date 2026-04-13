'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  Briefcase, 
  MessageSquare, 
  ChevronRight,
  Globe,
  Zap,
  Shield,
  Palette
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] selection:bg-orange-100 selection:text-orange-900">
      {/* Premium Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/50 rounded-[32px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <Sparkles size={20} />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Career Studio</span>
              <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">Resume AI</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Log In
            </Link>
            <Link href="/login" className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 group">
              Get Started
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center mt-20 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-8">
              <Zap size={12} />
              The Intelligence Hub for Job Runners
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-[-0.06em] text-slate-900 leading-[0.95] mb-8">
              Job hunting,<br />reimagined.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Resume AI is a minimalist Career Studio designed to take the friction out of your search. 
              Analyze fit, track your pipeline, and generate outreach in one calm, premium workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-3xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-200">
                Launch My Studio
              </Link>
              <a href="#features" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-600 font-black uppercase tracking-widest text-xs rounded-3xl hover:bg-slate-50 transition-all">
                Explore Features
              </a>
            </div>
          </motion.div>
        </section>

        {/* Feature Bento Grid */}
        <section id="features" className="max-w-7xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                  <Target size={24} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4">Brutally Honest Analysis</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Upload your resume and a job description. We don't just give you a score; 
                  we provide strategic justification and precise keyword parity reports.
                </p>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="md:col-span-4 bg-slate-900 text-white rounded-[48px] p-10 shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4">AI Outreach</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Instantly craft LinkedIn messages in Startup, Corporate, or Technical vibes.
                </p>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl" />
            </div>

            <div className="md:col-span-4 bg-orange-50 border border-orange-100 rounded-[48px] p-10 shadow-sm group">
              <div className="w-12 h-12 bg-white text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-200">
                <Briefcase size={24} />
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-4 text-orange-900">Application Tracker</h3>
              <p className="text-orange-950/60 font-medium leading-relaxed">
                A single source of truth for every role you're chasing. No more spreadsheets.
              </p>
            </div>

            <div className="md:col-span-8 bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm flex flex-col justify-between relative overflow-hidden">
               <div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight mb-4">Professional Identity</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
                    Manage your bio, social sync (GitHub, LinkedIn, LeetCode), and personal identifiers 
                    in a clean, unified profile that feeds your career strategy.
                  </p>
               </div>
               <div className="mt-12 flex gap-4">
                  <div className="h-2 w-20 bg-emerald-100 rounded-full" />
                  <div className="h-2 w-12 bg-emerald-50 rounded-full" />
                  <div className="h-2 w-24 bg-emerald-100 rounded-full" />
               </div>
            </div>
          </div>
        </section>

        {/* Brand Philosophy / Project Intro */}
        <section className="max-w-4xl mx-auto text-center mb-32 px-6">
          <div className="p-12 md:p-20 rounded-[64px] bg-gradient-to-b from-slate-50 to-white border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">The Career Studio Vision</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-10 leading-tight italic">
              "We didn't build just another tool. We built a workspace that respects your focus."
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-10 rounded-full" />
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Our project was born from a simple need: making the digital job hunt feel premium. 
              By combining high-end "minimal & classy" aesthetics with cutting-edge AI, 
              we've created a sanctuary for candidates who care about quality over quantity.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto text-center mb-32">
          <div className="bg-slate-900 rounded-[64px] p-16 md:p-32 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-8">
                Ready to level up your pipeline?
              </h2>
              <p className="text-slate-400 mb-12 text-lg font-medium max-w-xl mx-auto">
                Join our small, focused community of professionals using Resume AI to land their dream roles.
              </p>
              <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-xs rounded-3xl hover:bg-slate-50 transition-all shadow-xl shadow-white/10">
                Initialize My Studio
                <ChevronRight size={18} />
              </Link>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </section>
      </main>

      {/* Minimalist Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <span className="text-sm font-bold text-slate-900">Career Studio</span>
          </div>
          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Contact</a>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            © 2026 Career Studio Resume AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
