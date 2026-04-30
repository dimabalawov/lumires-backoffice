'use client';

import TopHeader from '@/components/TopHeader';
import { mockDashboardStats, mockReviews, mockFilms } from '@/lib/mock-data';

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <>
      <TopHeader title="Dashboard" />
      <div className="page-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card" id="stat-films">
            <div className="stat-card-header">
              <div className="stat-card-icon films">🎬</div>
              <div className={`stat-card-trend ${stats.filmsTrend >= 0 ? 'up' : 'down'}`}>
                {stats.filmsTrend >= 0 ? '↑' : '↓'} {Math.abs(stats.filmsTrend)}%
              </div>
            </div>
            <div className="stat-card-value">{stats.totalFilms.toLocaleString()}</div>
            <div className="stat-card-label">Total Films</div>
          </div>

          <div className="stat-card" id="stat-users">
            <div className="stat-card-header">
              <div className="stat-card-icon users">👤</div>
              <div className={`stat-card-trend ${stats.usersTrend >= 0 ? 'up' : 'down'}`}>
                {stats.usersTrend >= 0 ? '↑' : '↓'} {Math.abs(stats.usersTrend)}%
              </div>
            </div>
            <div className="stat-card-value">{stats.totalUsers.toLocaleString()}</div>
            <div className="stat-card-label">Total Users</div>
          </div>

          <div className="stat-card" id="stat-reviews">
            <div className="stat-card-header">
              <div className="stat-card-icon reviews">✍</div>
              <div className={`stat-card-trend ${stats.reviewsTrend >= 0 ? 'up' : 'down'}`}>
                {stats.reviewsTrend >= 0 ? '↑' : '↓'} {Math.abs(stats.reviewsTrend)}%
              </div>
            </div>
            <div className="stat-card-value">{stats.totalReviews.toLocaleString()}</div>
            <div className="stat-card-label">Total Reviews</div>
          </div>

          <div className="stat-card" id="stat-lists">
            <div className="stat-card-header">
              <div className="stat-card-icon lists">☰</div>
              <div className={`stat-card-trend ${stats.listsTrend >= 0 ? 'up' : 'down'}`}>
                {stats.listsTrend >= 0 ? '↑' : '↓'} {Math.abs(stats.listsTrend)}%
              </div>
            </div>
            <div className="stat-card-value">{stats.totalLists.toLocaleString()}</div>
            <div className="stat-card-label">Total Lists</div>
          </div>
        </div>

        {/* Charts + Activity */}
        <div className="grid-2" style={{ marginBottom: 32 }}>
          {/* Chart Card */}
          <div className="card">
            <div className="card-header">
              <h3>Reviews This Week</h3>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            <div className="card-body">
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {stats.chartData.map((point, i) => (
                    <div
                      key={i}
                      className="chart-bar"
                      style={{ height: `${(point.value / 120) * 100}%` }}
                      title={`${point.label}: ${point.value}`}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '0 4px' }}>
                {stats.chartData.map((point, i) => (
                  <span key={i} style={{ fontSize: 11, color: 'var(--text-muted)' }}>{point.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            <div className="card-body" style={{ padding: '8px 24px' }}>
              {stats.recentActivity.map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-dot" style={{
                    background: item.type === 'report' ? 'var(--danger)' :
                      item.type === 'user_joined' ? 'var(--success)' :
                        item.type === 'review' ? 'var(--info)' : 'var(--accent)'
                  }} />
                  <div>
                    <div className="activity-text">
                      <strong>{item.user}</strong> {item.description}
                    </div>
                    <div className="activity-time">{item.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews Table */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Reviews</h3>
            <button className="btn btn-secondary btn-sm">View All Reviews →</button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table" id="recent-reviews-table">
              <thead>
                <tr>
                  <th>Film</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockReviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <div className="table-film-cell">
                        <div className="table-film-poster" />
                        <div className="table-film-info">
                          <div className="table-film-title">{review.filmTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-primary)' }}>@{review.username}</td>
                    <td>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= review.rating ? '' : 'empty'}>★</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${review.status === 'published' ? 'badge-success' :
                          review.status === 'flagged' ? 'badge-danger' : 'badge-neutral'
                        }`}>
                        <span className="badge-dot" />
                        {review.status}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
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
