'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '◈' },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Films', href: '/films', icon: '🎬' },
      { label: 'Reviews', href: '/reviews', icon: '✍' },
      { label: 'Lists', href: '/lists', icon: '☰' },
      { label: 'Threads', href: '/threads', icon: '💬' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', href: '/users', icon: '👤' },
      { label: 'Reports', href: '/reports', icon: '⚑', badge: '3' },
      { label: 'Settings', href: '/settings', icon: '⚙' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar" id="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">L</div>
        <div>
          <h1>LUMIÈRES</h1>
          <span>Backoffice</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
                id={`nav-${item.label.toLowerCase()}`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="sidebar-link-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">A</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
