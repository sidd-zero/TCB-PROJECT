'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema, securitySchema, privacySchema, type AccountValues, type SecurityValues, type PrivacyValues } from '@/lib/validations/settingsSchema';
import { Camera, Download, Trash2, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// --- Shared Components ---

const FormHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
    <p className="text-slate-500 mt-1">{description}</p>
  </div>
);

const SubmitButton = ({ label, loading }: { label: string; loading?: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    type="submit"
    className="btn-primary w-full sm:w-auto"
  >
    {loading ? 'Saving...' : label}
  </motion.button>
);

// --- Section Components ---

export function AccountForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: 'John Doe', email: 'john@example.com' },
  });

  const onSubmit = (data: AccountValues) => {
    console.log('Account Data:', data);
    alert('Profile updated successfully!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <FormHeader title="Account Information" description="Update your personal details and profile picture." />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
              <User className="text-slate-300 h-10 w-10" />
            </div>
            <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-orange-600 hover:text-orange-700 transition-colors">
              <Camera size={18} />
            </button>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Profile Picture</h4>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
            <input {...register('name')} className="input-field" placeholder="Your name" />
            {errors.name && <p className="text-xs text-rose-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
            <input {...register('email')} disabled className="input-field opacity-60 cursor-not-allowed" />
            <p className="text-[10px] text-slate-400 ml-1">Email cannot be changed manually.</p>
          </div>
        </div>

        <div className="pt-4">
          <SubmitButton label="Save Changes" />
        </div>
      </form>
    </motion.div>
  );
}

export function SecurityForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
  });
  const [showModal, setShowModal] = useState(false);

  const onSubmit = (data: SecurityValues) => {
    console.log('Security Data:', data);
    alert('Password updated successfully!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <FormHeader title="Security" description="Manage your password and platform security." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Current Password</label>
          <input type="password" {...register('currentPassword')} className="input-field" placeholder="••••••••" />
          {errors.currentPassword && <p className="text-xs text-rose-500 ml-1">{errors.currentPassword.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">New Password</label>
            <input type="password" {...register('newPassword')} className="input-field" placeholder="••••••••" />
            {errors.newPassword && <p className="text-xs text-rose-500 ml-1">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Confirm New Password</label>
            <input type="password" {...register('confirmPassword')} className="input-field" placeholder="••••••••" />
            {errors.confirmPassword && <p className="text-xs text-rose-500 ml-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="pt-4">
          <SubmitButton label="Update Password" />
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-2 text-rose-600 mb-4">
          <Trash2 size={20} />
          <h3 className="font-bold text-lg">Danger Zone</h3>
        </div>
        <div className="surface-soft p-6 border-rose-100 border bg-rose-50/30">
          <p className="text-sm text-slate-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button 
            type="button" 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
          >
            Delete My Account
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-box text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-rose-50">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Are you absolutely sure?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  No, cancel
                </button>
                <button 
                  onClick={() => alert('Account deleted.')}
                  className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                >
                  Yes, delete account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PrivacyForm() {
  const { register, watch, setValue } = useForm<PrivacyValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: { searchIndexing: false },
  });
  const searchIndexing = watch('searchIndexing');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <FormHeader title="Data Privacy" description="Manage your data and visibility settings." />

      <div className="space-y-8">
        <div className="flex items-center justify-between p-6 surface-panel">
          <div className="max-w-[80%]">
            <h4 className="font-bold text-slate-900">Search Engine Indexing</h4>
            <p className="text-sm text-slate-500 mt-1">
              Allow search engines like Google to index your public profile and accomplishments.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setValue('searchIndexing', !searchIndexing)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
              searchIndexing ? 'bg-orange-600' : 'bg-slate-200'
            }`}
          >
            <motion.div
              animate={{ x: searchIndexing ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        <div className="divider" />

        <div className="space-y-4">
          <h4 className="font-bold text-slate-900">Export Personal Data</h4>
          <p className="text-sm text-slate-500">
            Download a complete copy of your personal data, analyses, and application history in JSON format.
          </p>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              alert('Export started! Your download will be ready in a few minutes.');
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Download My Data
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
