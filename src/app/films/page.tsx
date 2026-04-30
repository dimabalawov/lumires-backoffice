'use client';

import { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import api, { type MovieListItem, type MovieDetail, type MovieSource, tmdbImage } from '@/lib/api';

type Tab = 'popular' | 'recent';

export default function FilmsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('popular');
  const [films, setFilms] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedFilm, setSelectedFilm] = useState<MovieDetail | null>(null);
  const [sources, setSources] = useState<MovieSource[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetch = activeTab === 'popular'
      ? api.getPopularThisWeek()
      : api.getRecentThisWeek();

    fetch
      .then((res) => setFilms(res.items))
      .catch((err) => setError(err?.message ?? 'Failed to load films'))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const filteredFilms = films.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function openDetail(film: MovieListItem) {
    setDetailLoading(true);
    setSelectedFilm(null);
    setSources([]);
    try {
      const [detail, sourcesRes] = await Promise.allSettled([
        api.getMovieDetail(film.externalId),
        api.getMovieSources(film.externalId),
      ]);
      if (detail.status === 'fulfilled') setSelectedFilm(detail.value);
      if (sourcesRes.status === 'fulfilled') setSources(sourcesRes.value.sources);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <>
      <TopHeader title="Films" breadcrumbs={['Content', 'Films']} />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-info">
            <h2>Film Database</h2>
            <p>{loading ? 'Loading…' : `${filteredFilms.length} films`}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`btn ${activeTab === 'popular' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('popular')}
            >
              Popular this week
            </button>
            <button
              className={`btn ${activeTab === 'recent' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent releases
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <span className="search-bar-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Film</th>
                  <th>TMDB ID</th>
                  <th>Votes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">
                        <div className="empty-state-icon">⏳</div>
                        <h3>Loading films…</h3>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">
                        <div className="empty-state-icon">⚠️</div>
                        <h3>Error loading films</h3>
                        <p>{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredFilms.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">
                        <div className="empty-state-icon">🎬</div>
                        <h3>No films found</h3>
                        <p>Try adjusting your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredFilms.map((film) => {
                    const backdrop = tmdbImage(film.backdropPath, 'w300');
                    return (
                      <tr key={film.id}>
                        <td>
                          <div className="table-film-cell">
                            {backdrop ? (
                              <img
                                src={backdrop}
                                alt={film.title}
                                style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 4 }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 80, height: 45, borderRadius: 4,
                                  background: 'var(--surface-2)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 20,
                                }}
                              >
                                🎬
                              </div>
                            )}
                            <div className="table-film-info">
                              <div className="table-film-title">{film.title}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-neutral">#{film.externalId}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: 'var(--accent)' }}>★</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                              {film.voteCount.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="View details"
                            onClick={() => openDetail(film)}
                          >
                            👁
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail drawer */}
        {(detailLoading || selectedFilm) && (
          <div className="modal-overlay" onClick={() => setSelectedFilm(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
              <div className="modal-header">
                <h2>{selectedFilm?.localization?.title ?? 'Loading…'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setSelectedFilm(null)}>✕</button>
              </div>
              <div className="modal-body">
                {detailLoading ? (
                  <p>Loading details…</p>
                ) : selectedFilm ? (
                  <>
                    {selectedFilm.backdropPath && (
                      <img
                        src={tmdbImage(selectedFilm.backdropPath, 'w780') ?? ''}
                        alt={selectedFilm.localization?.title}
                        style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
                      />
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Release date</div>
                        <div>{selectedFilm.releaseDate}</div>
                      </div>
                      {selectedFilm.trailerUrl && (
                        <div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Trailer</div>
                          <a href={selectedFilm.trailerUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                            Watch ↗
                          </a>
                        </div>
                      )}
                    </div>
                    {selectedFilm.localization?.overview && (
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                        {selectedFilm.localization.overview}
                      </p>
                    )}
                    {sources.length > 0 && (
                      <>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Streaming sources</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {sources.map((s, i) => (
                            <a
                              key={i}
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="badge badge-neutral"
                              style={{ textDecoration: 'none', cursor: 'pointer' }}
                            >
                              {s.providerName} · {s.type}
                              {s.price != null ? ` · $${s.price}` : ''}
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
