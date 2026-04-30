'use client';

import { useState } from 'react';
import TopHeader from '@/components/TopHeader';
import { mockReviews } from '@/lib/mock-data';
import type { Review } from '@/lib/api';

export default function ReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.filmTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesTab = activeTab === 'all' || review.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const flaggedCount = reviews.filter(r => r.status === 'flagged').length;

  return (
    <>
      <TopHeader title="Reviews" breadcrumbs={['Content', 'Reviews']} />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-info">
            <h2>Review Moderation</h2>
            <p>{reviews.length} total reviews · {flaggedCount} flagged</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Reviews
          </button>
          <button
            className={`tab ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </button>
          <button
            className={`tab ${activeTab === 'flagged' ? 'active' : ''}`}
            onClick={() => setActiveTab('flagged')}
          >
            Flagged {flaggedCount > 0 && <span className="sidebar-link-badge" style={{ marginLeft: 6 }}>{flaggedCount}</span>}
          </button>
          <button
            className={`tab ${activeTab === 'removed' ? 'active' : ''}`}
            onClick={() => setActiveTab('removed')}
          >
            Removed
          </button>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="search-bar">
            <span className="search-bar-icon">🔍</span>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="reviews-search"
            />
          </div>
        </div>

        {/* Review Cards */}
        {filteredReviews.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">✍</div>
              <h3>No reviews found</h3>
              <p>No reviews match your current filters.</p>
            </div>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="card"
              style={{
                marginBottom: 16,
                borderLeft: review.status === 'flagged'
                  ? '3px solid var(--danger)'
                  : review.status === 'removed'
                    ? '3px solid var(--text-muted)'
                    : '3px solid transparent',
              }}
            >
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div className="table-film-poster" style={{ width: 48, height: 68 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 15, marginBottom: 4 }}>
                        {review.filmTitle}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>by @{review.username}</span>
                        <div className="star-rating" style={{ fontSize: 12 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= review.rating ? '' : 'empty'}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className={`badge ${review.status === 'published' ? 'badge-success' :
                        review.status === 'flagged' ? 'badge-danger' : 'badge-neutral'
                      }`}>
                      <span className="badge-dot" />
                      {review.status}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
                  {review.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>❤ {review.likesCount} likes</span>
                    <span>💬 {review.commentsCount} comments</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {review.status === 'flagged' && (
                      <>
                        <button className="btn btn-sm btn-secondary" style={{ color: 'var(--success)' }}>✓ Approve</button>
                        <button className="btn btn-sm btn-danger">✕ Remove</button>
                      </>
                    )}
                    {review.status === 'published' && (
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>⚑ Flag</button>
                    )}
                    <button className="btn btn-ghost btn-sm">🗑 Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
