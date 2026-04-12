'use client';

import { useEffect, useState } from 'react';
import {
  Briefcase,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

type Application = {
  _id: string;
  company: string;
  role: string;
  status: string;
  date: string;
};

const statusClasses: Record<string, string> = {
  Applied: 'badge badge-applied',
  Interview: 'badge badge-interview',
  Offer: 'badge badge-offer',
  Rejected: 'badge badge-rejected',
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { company, role, status };

    try {
      if (isEditing) {
        await fetch(`/api/applications/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Failed to save application', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      fetchApplications();
    } catch (error) {
      console.error('Failed to delete application', error);
    }
  };

  const openForm = (app?: Application) => {
    if (app) {
      setIsEditing(true);
      setCurrentId(app._id);
      setCompany(app.company);
      setRole(app.role);
      setStatus(app.status);
    } else {
      setIsEditing(false);
      setCurrentId('');
      setCompany('');
      setRole('');
      setStatus('Applied');
    }

    setIsModalOpen(true);
  };

  const stats = [
    { label: 'Tracked roles', value: applications.length, tone: 'text-[color:var(--text)]' },
    {
      label: 'Applied',
      value: applications.filter((a) => a.status === 'Applied').length,
      tone: 'text-[color:var(--accent-3)]',
    },
    {
      label: 'Interview',
      value: applications.filter((a) => a.status === 'Interview').length,
      tone: 'text-[color:var(--accent)]',
    },
    {
      label: 'Offer',
      value: applications.filter((a) => a.status === 'Offer').length,
      tone: 'text-[color:var(--accent-2)]',
    },
  ];

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div className="surface-card hero-card">
          <div>
            <div className="eyebrow">
              <Briefcase className="h-4 w-4" />
              Application tracker
            </div>
            <h1 className="page-title">Track the pipeline in a quieter, more usable layout.</h1>
            <p className="page-subtitle">
              The tracker now prioritizes readable status, clean spacing, and quick edits instead of
              heavy visual effects. It should feel like a focused operations board.
            </p>
          </div>

          <div className="mt-6">
            <button onClick={() => openForm()} className="btn-primary">
              <Plus className="h-4 w-4" />
              Add application
            </button>
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

      <section className="surface-card section-card">
        <div className="section-header">
          <div>
            <div className="section-title">Tracked roles</div>
            <p className="section-copy">Update statuses, edit entries, or prune old applications.</p>
          </div>
          <button onClick={() => openForm()} className="btn-secondary">
            <Plus className="h-4 w-4" />
            New entry
          </button>
        </div>

        <div className="overflow-x-auto rounded-[22px] border border-[color:var(--line)] bg-white/45">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state min-h-[16rem]">
                      <Loader2 className="h-6 w-6 animate-spin text-[color:var(--accent-2)]" />
                      <p className="text-sm">Loading applications...</p>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state min-h-[18rem]">
                      <div className="icon-tile tint-green h-14 w-14 rounded-[20px]">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[color:var(--text)]">
                          No applications tracked yet
                        </div>
                        <p className="mt-1 text-sm">Add your first role to start building the pipeline.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="icon-tile tint-blue h-11 w-11 rounded-[18px]">
                          <span className="text-sm font-bold">{app.company.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{app.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-[color:var(--muted-strong)]">{app.role}</td>
                    <td>
                      <span className={statusClasses[app.status] || statusClasses.Applied}>
                        {app.status}
                      </span>
                    </td>
                    <td className="text-sm text-[color:var(--muted)]">
                      {new Date(app.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openForm(app)}
                          className="btn-ghost px-3 py-2"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="btn-ghost px-3 py-2 text-[color:var(--danger)]"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="section-header mb-5">
              <div>
                <div className="section-title">
                  {isEditing ? 'Edit application' : 'Add new application'}
                </div>
                <p className="section-copy">
                  Keep the entry lightweight: company, role, and current status.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost px-3 py-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mono mb-2 block text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="input-field"
                  placeholder="Example: Google"
                />
              </div>

              <div>
                <label className="mono mb-2 block text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Role
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                  placeholder="Example: Frontend Engineer"
                />
              </div>

              <div>
                <label className="mono mb-2 block text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="select-field"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {isEditing ? 'Save changes' : 'Add application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
