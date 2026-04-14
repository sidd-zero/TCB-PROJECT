import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  FileSignature,
  Play,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

type DashboardApplication = {
  _id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  date: string;
};

async function getApplications() {
  try {
    await dbConnect();
    const applications = await Application.find({}).sort({ date: -1 }).limit(5);
    return {
      applications: JSON.parse(JSON.stringify(applications)),
      databaseOnline: true,
    };
  } catch (error) {
    console.error('Dashboard DB load failed:', error);
    return {
      applications: [],
      databaseOnline: false,
    };
  }
}

const quickActions = [
  {
    href: '/analyzer',
    title: 'Analyze Resume',
    copy: 'Upload a resume, align it to a role, and spot missing skills before applying.',
    icon: Play,
    tint: 'tint-blue',
  },
  {
    href: '/cover-letter',
    title: 'Cover Letter',
    copy: 'Draft a clear and relevant cover letter based on your resume and the role.',
    icon: FileSignature,
    tint: 'tint-warm',
  },
  {
    href: '/applications',
    title: 'Track Applications',
    copy: 'Keep your applications, status updates, and key dates organized in one place',
    icon: Briefcase,
    tint: 'tint-green',
  },
];

export default async function Dashboard() {
  const session = await getSession();
  const { applications, databaseOnline } = await getApplications();

  let userName = session?.name || session?.email?.split('@')[0] || 'User';

  if (databaseOnline && session?.email) {
    try {
      const userDoc = await User.findOne({ email: session.email }).lean();
      if (userDoc && userDoc.name) {
        userName = userDoc.name;
      }
    } catch (error) {
      console.error('Failed to load user name:', error);
    }
  }

  const stats = [
    { label: 'Tracked roles', value: applications.length, tone: 'text-[color:var(--text)]' },
    {
      label: 'Database',
      value: databaseOnline ? 'Live' : 'Offline',
      tone: databaseOnline ? 'text-[color:var(--accent-2)]' : 'text-[color:var(--danger)]',
    },
    {
      label: 'Latest update',
      value: applications[0]
        ? new Date(applications[0].date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : '--',
      tone: 'text-[color:var(--accent)]',
    },
    { label: 'Workflow', value: '3 tools', tone: 'text-[color:var(--accent-3)]' },
  ];

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div className="surface-card hero-card">
          <div>

            <h1 className="page-title">Welcome back, {userName}.</h1>
            <p className="page-subtitle max-w-2xl">
              Your workspace is ready. Improve your resume for new roles, track your applications, and manage your outreach - all in one place
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/analyzer" className="btn-primary">
              Start analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/applications" className="btn-secondary">
              Open tracker
            </Link>
          </div>
        </div>

        <div className="hero-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="surface-panel mini-card">
              <div className="metric-label">{stat.label}</div>
              <div className={`metric-value ${stat.tone}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {!databaseOnline && (
        <div className="error-alert">
          <TrendingUp className="h-4 w-4" />
          <p>
            MongoDB is currently unavailable. The UI is intact, but save and fetch actions may fail
            until the database connection is restored.
          </p>
        </div>
      )}

      <section className="bento-grid">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="span-4 surface-card section-card transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="section-header">
              <div className={`icon-tile ${action.tint}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-[color:var(--muted)]" />
            </div>
            <div className="section-title">{action.title}</div>
            <p className="section-copy">{action.copy}</p>
          </Link>
        ))}
      </section>

      <section className="bento-grid">
        <div className="span-8 surface-card section-card">
          <div className="section-header">
            <div>
              <div className="section-title">Recent applications</div>
              <p className="section-copy">Most recent roles currently tracked in the pipeline.</p>
            </div>
            <Link href="/applications" className="pill">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="icon-tile tint-green">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold text-[color:var(--text)]">
                  No applications yet
                </div>
                <p className="mt-1 text-sm">Start with the tracker once you send your first role.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app: DashboardApplication) => (
                <div
                  key={app._id}
                  className="surface-soft flex items-center justify-between gap-4 rounded-[20px] px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="icon-tile tint-blue h-11 w-11 rounded-[18px]">
                      <span className="text-sm font-bold">{app.company.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{app.role}</div>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">
                        {app.company} •{' '}
                        {new Date(app.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      app.status === 'Applied'
                        ? 'badge-applied'
                        : app.status === 'Interview'
                          ? 'badge-interview'
                          : app.status === 'Offer'
                            ? 'badge-offer'
                            : 'badge-rejected'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="span-4 surface-panel section-card">
          <div className="section-header">
            <div>
              <div className="section-title">Workflow notes</div>
              <p className="section-copy">A minimal sequence for using the product without friction.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              'Upload the latest resume once and analyze it against the target role.',
              'Use the role context to draft a cover letter that matches the same position.',
              'Move the application into the tracker and update status over time.',
            ].map((item, index) => (
              <div key={item} className="surface-soft rounded-[20px] px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="step-chip">{index + 1}</div>
                  <p className="text-sm leading-6 text-[color:var(--muted-strong)]">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
