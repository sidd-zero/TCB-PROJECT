'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  FileSearch,
  MessageSquareText,
  LayoutList,
  UserCircle,
  BarChart,
  FileEdit,
  ClipboardCheck
} from 'lucide-react';
import CSLogo from './components/CSLogo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#ffead0] text-[#113537] selection:bg-[#37505c] selection:text-white">
      {/* Premium Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/50 rounded-[32px]">
          <div className="flex items-center gap-3">
            <CSLogo className="h-10 w-10" />
            <div className="flex flex-col -space-y-1">
              <span className="text-[10px] font-bold text-[#f76f8e] uppercase tracking-[0.2em]">Platform</span>
              <span className="text-xl font-black tracking-tighter text-[#113537]">Career Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">
              Log In
            </Link>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/login"
                className="px-6 py-3 bg-[#113537] text-white text-sm font-bold rounded-2xl hover:bg-[#37505c] transition-all shadow-xl shadow-[#37505c]/20 flex items-center gap-3 group border border-white/10"
              >
                <span className="text-white brightness-200 group-hover:brightness-100 transition-all">Get Started</span>
                <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
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
            <h1 className="text-6xl md:text-8xl font-black tracking-[-0.06em] text-slate-900 leading-[0.95] mb-8">
              The studio for your<br />next professional move.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              See where your resume stands, track your progress, and keep getting better with every application
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-[#f76f8e] text-white font-black uppercase tracking-widest text-xs rounded-3xl hover:bg-[#96616b] transition-all shadow-2xl shadow-[#f76f8e]/20">
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
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
                  <FileSearch size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4">Intelligent Feedback</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Get deep insights into how your resume matches any job description.
                  We identify missing keywords and technical gaps so you can apply with confidence.
                </p>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="md:col-span-4 bg-[#37505c] text-white rounded-[48px] p-10 shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
                  <MessageSquareText size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4">Smart Outreach</h3>
                <p className="text-white/60 font-medium leading-relaxed">
                  Write clear, personalized messages suited to each company and role.
                </p>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#f76f8e]/20 rounded-full blur-2xl" />
            </div>

            <div className="md:col-span-4 bg-[#37505c]/5 border border-[#37505c]/10 rounded-[48px] p-10 shadow-sm group">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
                <LayoutList size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-4 text-[#113537]">Visual Tracker</h3>
              <p className="text-[#37505c]/60 font-medium leading-relaxed">
                See where you've applied, what's pending, and what needs follow-up all without losing track.
              </p>
            </div>

            <div className="md:col-span-8 bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
                  <UserCircle size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4">Integrated Profile</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
                  Keep your professional presence organized and easy to share.
                </p>
              </div>
              <div className="mt-12 flex gap-4">
                <div className="h-2 w-20 bg-emerald-100/50 rounded-full" />
                <div className="h-2 w-12 bg-emerald-50/50 rounded-full" />
                <div className="h-2 w-24 bg-emerald-100/50 rounded-full" />
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
          </div>
        </section>

        {/* New Workflow Section to fill space */}
        <section className="max-w-7xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Three steps to your next role.</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">A streamlined workflow designed for quality-focused candidates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: BarChart, title: 'Analyze', copy: 'See how your skills match the job description.' },
              { icon: FileEdit, title: 'Optimize', copy: 'Improve your resume and write better applications.' },
              { icon: ClipboardCheck, title: 'Track', copy: 'Keep track of your applications and follow up on time.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-[32px] shadow-sm flex items-center justify-center mb-8 text-slate-600">
                  <step.icon size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3">{step.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[200px]">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* New Why Choose Us Section */}
        <section className="max-w-7xl mx-auto mb-32 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-8">Built to help you apply smarter.</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                Stop guessing what works - track, improve, and apply with confidence.
              </p>
              <ul className="space-y-4">
                {[
                  'Your data remains private.',
                  'Upload your resume in PDF or Word format.',
                  'Get started immediately, with no setup required.',
                  'Designed to be simple, fast, and easy to use.'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#113537] font-bold">
                    <div className="w-2 h-2 rounded-full bg-[#f76f8e] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#37505c]/10 rounded-[64px] aspect-square flex items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f76f8e]/20 to-[#37505c]/10" />
              <CSLogo className="h-32 w-32 relative z-10" />
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#f76f8e]/10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* Brand Philosophy / Project Intro */}
        <section className="max-w-4xl mx-auto text-center mb-32 px-6">
          <div className="p-12 md:p-20 rounded-[64px] bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-sm">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-10 leading-tight italic">
              "We built this for candidates who aim for both quality and consistency."
            </h2>
            <div className="w-20 h-1 bg-[#f76f8e] mx-auto mb-10 rounded-full" />
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Designed to simplify your job search and keep you organized at every step.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto text-center mb-32">
          <div className="bg-[#113537] rounded-[64px] p-16 md:p-32 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-8">
                Ready to take control of your job search?
              </h2>
              <p className="text-slate-400 mb-12 text-lg font-medium max-w-xl mx-auto">
                Join our small, focused community of professionals using Career Studio to land their dream roles.
              </p>
              <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#113537] font-black uppercase tracking-widest text-xs rounded-3xl hover:bg-[#ffead0] transition-all shadow-xl shadow-white/10">
                Initialize My Studio
                <ChevronRight size={18} />
              </Link>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f76f8e]/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#96616b]/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </section>
      </main>

      {/* Minimalist Footer */}
      <footer className="max-w-7xl mx-auto px-6 pt-20 pb-10 border-t border-slate-100/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          <div className="md:col-span-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <CSLogo className="h-8 w-8 !shadow-none ring-1 ring-slate-100" />
              <span className="text-lg font-black text-slate-900 tracking-tight">Career Studio</span>
            </div>
            <p className="text-slate-500 font-medium max-w-xs mx-auto md:mx-0">
              A premium workspace designed for modern job seekers. Built with focus and precision.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Product</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><Link href="/analyzer" className="hover:text-slate-950 transition-colors">Analyzer</Link></li>
              <li><Link href="/ats-scanner" className="hover:text-slate-950 transition-colors">ATS Scanner</Link></li>
              <li><Link href="/cover-letter" className="hover:text-slate-950 transition-colors">Outreach</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Support</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><a href="#" className="hover:text-slate-950 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100/50 pt-10">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            © 2026 Career Studio. Created with focus.
          </p>
          <div className="flex gap-6">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100" />
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100" />
          </div>
        </div>
      </footer>
    </div>
  );
}
