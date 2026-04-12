'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="app-shell">
      <div className="app-bg" />
      <div className="app-grid">
        <Sidebar />
        <main className="main-content">
          <div className="main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
