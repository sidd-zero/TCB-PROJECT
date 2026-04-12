'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileSignature, FileText, LayoutDashboard, Sparkles } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analyzer', href: '/analyzer', icon: FileText },
  { name: 'Cover Letters', href: '/cover-letter', icon: FileSignature },
  { name: 'Tracker', href: '/applications', icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="sidebar-brand-copy">
            <span className="sidebar-kicker">Career Studio</span>
            <span className="sidebar-brand-text">Resume AI</span>
          </div>
        </div>

        <nav className="nav-list">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-link-icon">
                  <item.icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-[color:var(--muted)]">
                    {item.href === '/'
                      ? 'Overview and recent activity'
                      : item.href === '/analyzer'
                        ? 'Match resume to role'
                        : item.href === '/cover-letter'
                          ? 'Draft tailored outreach'
                          : 'Track the pipeline'}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

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
    </aside>
  );
}
