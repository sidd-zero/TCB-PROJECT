'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="surface-card p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Top highlight */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
          
          <div className="flex flex-col items-center mb-10">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center text-white shadow-xl shadow-orange-200 mb-6"
            >
              <Sparkles size={28} />
            </motion.div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 text-center">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-2 text-center text-sm font-medium">
              Elevate your career with AI-powered tools
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-12 h-[56px] bg-white/50 backdrop-blur-sm focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Password</label>
                <button type="button" className="text-[10px] font-bold uppercase tracking-[0.1em] text-orange-600 hover:text-orange-700 transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 h-[56px] bg-white/50 backdrop-blur-sm focus:bg-white"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit"
              className="w-full h-[56px] bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-slate-400 text-xs text-center mt-8 font-medium">
            Don't have an account? <button className="text-orange-600 font-bold hover:underline">Request access</button>
          </p>
        </div>
      </motion.div>
      
      {/* Dynamic footer decoration */}
      <footer className="absolute bottom-8 text-center w-full text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
        &copy; 2026 Resume AI Studio
      </footer>
    </div>
  );
}
