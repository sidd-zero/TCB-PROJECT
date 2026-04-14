import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/Sidebar';
import AppShell from './components/AppShell';
import { Snowfall, CursorEffect, ClickEffect } from './components/VisualEffects';

export const metadata: Metadata = {
  title: 'Career Studio',
  description: 'AI-powered resume analysis, cover letter drafting, and application tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Snowfall />
        <CursorEffect />
        <ClickEffect />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
