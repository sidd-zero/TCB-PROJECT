import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/Sidebar';

export const metadata: Metadata = {
  title: 'Resume AI | Resume Analyzer',
  description: 'AI-powered resume analysis, cover letter drafting, and application tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <div className="app-bg" />
          <div className="app-grid">
            <Sidebar />
            <main className="main-content">
              <div className="main-inner">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
