'use client';

import { useState } from 'react';
import TopHeader from '@/components/TopHeader';
import { mockThreads } from '@/lib/mock-data';
import type { Thread } from '@/lib/api';

export default function ThreadsPage() {
  const [threads] = useState<Thread[]>(mockThreads);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TopHeader title="Threads" breadcrumbs={['Content', 'Threads']} />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-info">
            <h2>Community Threads</h2>
            <p>{threads.length} active threads</p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <span className="search-bar-icon">🔍</span>
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="threads-search"
            />
          </div>
        </div>

        <div className="card">
          <div className="data-table-wrapper">
            <table className="data-table" id="threads-table">
              <thead>
                <tr>
                  <th>Thread</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Replies</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Last Reply</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredThreads.map((thread) => (
                  <tr key={thread.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 320 }}>
                        {thread.status === 'pinned' && <span style={{ color: 'var(--accent)', marginRight: 6 }}>📌</span>}
                        {thread.title}
                      </div>
                    </td>
                    <td>@{thread.username}</td>
                    <td><span className="badge badge-neutral">{thread.category}</span></td>
                    <td>{thread.replyCount}</td>
                    <td>{thread.viewCount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${thread.status === 'open' ? 'badge-success' :
                          thread.status === 'pinned' ? 'badge-warning' : 'badge-neutral'
                        }`}>
                        <span className="badge-dot" />
                        {thread.status}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(thread.lastReplyAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" title="View">👁</button>
                        {thread.status !== 'pinned' && (
                          <button className="btn btn-ghost btn-sm" title="Pin">📌</button>
                        )}
                        {thread.status !== 'closed' ? (
                          <button className="btn btn-ghost btn-sm" title="Close">🔒</button>
                        ) : (
                          <button className="btn btn-ghost btn-sm" title="Reopen" style={{ color: 'var(--success)' }}>🔓</button>
                        )}
                        <button className="btn btn-ghost btn-sm" title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
