'use client';

import { User, Shield, Lock, Trash2, Globe, Download } from 'lucide-react';
import { motion } from 'framer-motion';

type Section = 'profile' | 'account' | 'security' | 'privacy';

interface SettingsSidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const sections = [
  { id: 'profile', name: 'Profile Reflection', icon: User },
  { id: 'account', name: 'Account Details', icon: Globe },
  { id: 'security', name: 'Security & Auth', icon: Shield },
  { id: 'privacy', name: 'Data Privacy', icon: Download },
] as const;

export default function SettingsSidebar({ activeSection, setActiveSection }: SettingsSidebarProps) {
  return (
    <div className="flex flex-col gap-2 p-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <motion.button
            key={section.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 border ${
              isActive
                ? 'bg-white shadow-md border-orange-200/50 text-slate-900'
                : 'text-slate-500 border-transparent hover:bg-white/40'
            }`}
          >
            <div className={`p-2 rounded-xl border ${
              isActive ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-white border-slate-100 text-slate-400'
            }`}>
              <Icon size={18} />
            </div>
            <span className="font-semibold text-sm">{section.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
