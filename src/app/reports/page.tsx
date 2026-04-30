'use client';

import TopHeader from '@/components/TopHeader';

export default function ReportsPage() {
  const reports = [
    { id: '1', type: 'Spam Review', content: 'User spammer123 posted promotional content in review for "Dune: Part Two"', reporter: 'film_critic_42', status: 'pending', createdAt: '2024-03-20T10:00:00Z' },
    { id: '2', type: 'Inappropriate Content', content: 'Review contains offensive language for "Parasite"', reporter: 'cinema_lover', status: 'pending', createdAt: '2024-03-19T15:30:00Z' },
    { id: '3', type: 'Duplicate Account', content: 'User suspect_user appears to be an alt account of banned user', reporter: 'alex_morgan', status: 'pending', createdAt: '2024-03-18T09:00:00Z' },
  ];

  return (
    <>
      <TopHeader title="Reports" breadcrumbs={['Management', 'Reports']} />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-info">
            <h2>User Reports</h2>
            <p>{reports.length} pending reports require attention</p>
          </div>
        </div>

        {reports.map((report) => (
          <div key={report.id} className="card" style={{ marginBottom: 16, borderLeft: '3px solid var(--warning)' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span className="badge badge-warning">{report.type}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Reported by @{report.reporter}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
                    {report.content}
                  </p>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-sm btn-secondary">Dismiss</button>
                <button className="btn btn-sm btn-secondary" style={{ color: 'var(--info)' }}>Investigate</button>
                <button className="btn btn-sm btn-danger">Take Action</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
