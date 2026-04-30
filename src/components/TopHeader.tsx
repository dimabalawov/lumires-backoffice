'use client';

interface TopHeaderProps {
  title: string;
  breadcrumbs?: string[];
}

export default function TopHeader({ title, breadcrumbs }: TopHeaderProps) {
  return (
    <header className="top-header" id="top-header">
      <div className="top-header-left">
        <h1 className="top-header-title">{title}</h1>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="top-header-breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                {i > 0 && <span style={{ margin: '0 4px', color: 'var(--text-muted)' }}>/</span>}
                <span>{crumb}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="top-header-right">
        <div className="search-bar" id="global-search">
          <span className="search-bar-icon">🔍</span>
          <input type="text" placeholder="Search films, users, reviews..." />
        </div>
        <button className="header-icon-btn" id="btn-notifications" title="Notifications">
          🔔
          <span className="notification-dot"></span>
        </button>
        <button className="header-icon-btn" id="btn-help" title="Help">
          ?
        </button>
      </div>
    </header>
  );
}
