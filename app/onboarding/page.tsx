import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import OnboardingWizard from './components/OnboardingWizard';
import { Snowfall, CursorEffect } from '@/app/components/VisualEffects';

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Double check in case middleware was bypassed or session was stale
  if (session.isOnboarded) {
    redirect('/');
  }

  return (
    <main className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(201,109,66,0.03)_0%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl">
        <OnboardingWizard userEmail={session.email} />
      </div>

      {/* Decorative Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-50/30 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-blue-50/20 blur-[100px] rounded-full -z-10" />
    </main>
  );
}
