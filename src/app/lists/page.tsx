'use client';

import { useState } from 'react';
import TopHeader from '@/components/TopHeader';
import { mockLists } from '@/lib/mock-data';
import type { FilmList } from '@/lib/api';

export default function ListsPage() {
  const [lists] = useState<FilmList[]>(mockLists);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TopHeader title="Lists" breadcrumbs={['Content', 'Lists']} />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-info">
            <h2>User Lists</h2>
            <p>{lists.length} lists created by users</p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <span className="search-bar-icon">🔍</span>
            <input
              type="text"
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="lists-search"
            />
          </div>
        </div>

        <div className="card">
          <div className="data-table-wrapper">
            <table className="data-table" id="lists-table">
              <thead>
                <tr>
                  <th>List</th>
                  <th>Author</th>
                  <th>Films</th>
                  <th>Likes</th>
                  <th>Visibility</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLists.map((list) => (
                  <tr key={list.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{list.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {list.description}
                        </div>
                      </div>
                    </td>
                    <td>@{list.username}</td>
                    <td>{list.filmCount}</td>
                    <td>❤ {list.likesCount}</td>
                    <td>
                      <span className={`badge ${list.visibility === 'public' ? 'badge-success' : 'badge-neutral'}`}>
                        {list.visibility === 'public' ? '🌐' : '🔒'} {list.visibility}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(list.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" title="View">👁</button>
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
