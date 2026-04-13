'use client';

import { useState, useEffect } from 'react';
import SettingsSidebar from './components/SettingsSidebar';
import { AccountForm, SecurityForm, PrivacyForm } from './components/SettingsForms';
import ProfileReflection from './components/ProfileReflection';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

type Section = 'profile' | 'account' | 'security' | 'privacy';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [activeSection]);

  return (
    <div className="page-stack">
      <Toaster position="top-right" richColors />
      <div className="surface-card hero-card overflow-hidden">
        <div className="relative z-10">
          <div className="eyebrow">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Control Center
          </div>
          <h1 className="page-title">Identity & Security</h1>
          <p className="page-subtitle">
            Manage your digital footprint, professional narrative, and account encryption.
          </p>
        </div>
      </div>

      <div className="bento-grid">
        <div className="span-4">
          <div className="surface-panel section-card h-fit sticky top-[1.6rem]">
            <div className="section-header">
              <div>
                <h3 className="section-title">Navigation</h3>
                <p className="text-xs text-slate-400 mt-1">Select configuration</p>
              </div>
            </div>
            <SettingsSidebar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
          </div>
        </div>

        <div className="span-8">
          <div className="surface-card section-card min-h-[600px] border-white/20 shadow-xl backdrop-blur-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {activeSection === 'profile' && (
                  <ProfileReflection 
                    data={profileData || { name: 'User', email: '' }} 
                    onEdit={() => setActiveSection('account')} 
                  />
                )}
                {activeSection === 'account' && <AccountForm initialData={profileData} />}
                {activeSection === 'security' && <SecurityForm />}
                {activeSection === 'privacy' && <PrivacyForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
