'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileSignature, FileText, LayoutDashboard, Sparkles, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'ATS Scanner', href: '/ats-scanner', icon: Sparkles },
  { name: 'Analyzer', href: '/analyzer', icon: FileText },
  { name: 'Cover Letters', href: '/cover-letter', icon: FileSignature },
  { name: 'Tracker', href: '/applications', icon: Briefcase },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="sidebar-brand-icon"
          >
            <Sparkles className="h-5 w-4" />
          </motion.div>
          <div className="sidebar-brand-copy">
            <span className="sidebar-kicker">Career Studio</span>
            <span className="sidebar-brand-text">Resume AI</span>
          </div>
        </div>

        <nav className="nav-list">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

            return (
              <motion.div
                key={item.name}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-link-icon">
                    <item.icon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs text-[color:var(--muted)] line-clamp-1">
                      {item.href === '/dashboard'
                        ? 'Overview and recent activity'
                        : item.href === '/ats-scanner'
                          ? 'Check machine readability'
                        : item.href === '/analyzer'
                          ? 'Match resume to role'
                          : item.href === '/cover-letter'
                            ? 'Draft tailored outreach'
                           : item.name === 'Settings'
                              ? 'Manage your account'
                              : 'Track the pipeline'}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="nav-link w-full border-rose-100/20 hover:bg-rose-50/50 hover:text-rose-600 group"
          >
            <span className="nav-link-icon group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
              <LogOut className="h-[18px] w-[18px]" />
            </span>
            <div className="text-left text-sm font-semibold">Sign Out</div>
          </motion.button>

          <div className="sidebar-meta">
            <div className="sidebar-meta-label">Workspace Focus</div>
            <div className="mt-3 text-lg font-semibold tracking-[-0.03em]">
              Minimal bento system for job search workflows
            </div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Analysis, writing, and tracking now share one calmer visual system.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
