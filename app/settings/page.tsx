'use client';

import { useState } from 'react';
import SettingsSidebar from './components/SettingsSidebar';
import { AccountForm, SecurityForm, PrivacyForm } from './components/SettingsForms';
import { motion, AnimatePresence } from 'framer-motion';

type Section = 'account' | 'security' | 'privacy';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('account');

  return (
    <div className="page-stack">
      <div className="surface-card hero-card overflow-hidden">
        <div className="relative z-10">
          <div className="eyebrow">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            User Settings
          </div>
          <h1 className="page-title">Personal Preferences</h1>
          <p className="page-subtitle">
            Configure your workspace, manage security settings, and control how your data is handled.
          </p>
        </div>
      </div>

      <div className="bento-grid">
        <div className="span-4">
          <div className="surface-panel section-card h-fit sticky top-[1.6rem]">
            <div className="section-header">
              <div>
                <h3 className="section-title">Navigation</h3>
                <p className="text-xs text-slate-400 mt-1">Select a configuration category</p>
              </div>
            </div>
            <SettingsSidebar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
          </div>
        </div>

        <div className="span-8">
          <div className="surface-card section-card min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === 'account' && <AccountForm />}
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
