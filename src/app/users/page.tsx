'use client';

import { useState } from 'react';
import TopHeader from '@/components/TopHeader';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/api';

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <TopHeader title="Users" breadcrumbs={['Management', 'Users']} />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-info">
            <h2>User Management</h2>
            <p>{users.length} registered users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="search-bar">
            <span className="search-bar-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="users-search"
            />
          </div>
          <select
            className="form-select"
            style={{ width: 160 }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            id="users-role-filter"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Table */}
        <div className="card">
          <div className="data-table-wrapper">
            <table className="data-table" id="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Films</th>
                  <th>Reviews</th>
                  <th>Lists</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="sidebar-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>@{user.username}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-warning' :
                          user.role === 'moderator' ? 'badge-info' : 'badge-neutral'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'active' ? 'badge-success' :
                          user.status === 'suspended' ? 'badge-warning' : 'badge-danger'
                        }`}>
                        <span className="badge-dot" />
                        {user.status}
                      </span>
                    </td>
                    <td>{user.filmCount}</td>
                    <td>{user.reviewCount}</td>
                    <td>{user.listCount}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(user.joinedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" title="View">👁</button>
                        <button className="btn btn-ghost btn-sm" title="Edit">✏️</button>
                        {user.status === 'active' ? (
                          <button className="btn btn-ghost btn-sm" title="Suspend" style={{ color: 'var(--warning)' }}>⚠</button>
                        ) : user.status === 'banned' ? (
                          <button className="btn btn-ghost btn-sm" title="Unban" style={{ color: 'var(--success)' }}>✓</button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0 16px' }}>
            <div className="pagination">
              <div className="pagination-info">Showing 1-{filteredUsers.length} of {filteredUsers.length}</div>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled>←</button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn" disabled>→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
