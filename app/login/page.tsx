'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Loader2, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignUp ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        if (res.status === 500) {
          setError(
            `Database Connection Error (${data.error || data.message || 'Unknown database issue'}): Please verify that you have added the MONGODB_URI environment variable to your environment variables and that your MongoDB Atlas IP Whitelist (IP Access List) allows connections.`
          );
        } else {
          setError(data.message || (isSignUp ? 'Registration failed.' : 'Invalid email or password.'));
        }
      }
    } catch (err) {
      setError('A connection error occurred. Please verify that your backend service is running and try again.');
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
          
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center text-white shadow-xl shadow-orange-200 mb-6"
            >
              <Sparkles size={28} />
            </motion.div>
            <motion.h1 
              key={isSignUp ? 'signup' : 'login'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold tracking-tight text-slate-900 text-center"
            >
              {isSignUp ? 'Create account' : 'Welcome back'}
            </motion.h1>
            <motion.p 
              key={isSignUp ? 'signup-sub' : 'login-sub'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 mt-2 text-center text-sm font-medium"
            >
              {isSignUp ? 'Get started in seconds' : 'Elevate your career with AI-powered tools'}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required={isSignUp}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="input-field pl-12 h-[56px] bg-white/50 backdrop-blur-sm focus:bg-white w-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                  className="input-field pl-12 h-[56px] bg-white/50 backdrop-blur-sm focus:bg-white w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Password</label>
                {!isSignUp && (
                  <button type="button" className="text-[10px] font-bold uppercase tracking-[0.1em] text-orange-600 hover:text-orange-700 transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 h-[56px] bg-white/50 backdrop-blur-sm focus:bg-white w-full"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold leading-relaxed text-left"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit"
              className="w-full h-[56px] bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-slate-400 text-xs text-center mt-8 font-medium">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button 
              type="button" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-orange-600 font-bold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Create one'}
            </button>
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

