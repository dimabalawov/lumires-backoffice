'use client';

import { useState } from 'react';
import TopHeader from '@/components/TopHeader';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, save to env or config
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <TopHeader title="Settings" breadcrumbs={['Management', 'Settings']} />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-info">
            <h2>Settings</h2>
            <p>Configure your backoffice preferences</p>
          </div>
        </div>

        <div className="grid-2">
          {/* API Configuration */}
          <div className="card">
            <div className="card-header">
              <h3>API Configuration</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Backend URL</label>
                <input
                  className="form-input"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:5000/api"
                  id="settings-api-url"
                />
                <span className="form-hint">
                  The base URL of your C# backend API. All endpoints will be relative to this URL.
                </span>
              </div>
              <div className="form-group">
                <label className="form-label">API Key (Optional)</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter API key..."
                  id="settings-api-key"
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13, marginBottom: 4 }}>Use Mock Data</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Show sample data when API is unavailable</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked id="settings-mock-toggle" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <button className="btn btn-primary" onClick={handleSave} id="btn-save-settings">
                Save Configuration
              </button>
              {saved && (
                <span style={{ marginLeft: 12, color: 'var(--success)', fontSize: 13 }}>
                  ✓ Saved successfully
                </span>
              )}
            </div>
          </div>

          {/* Connection Status */}
          <div className="card">
            <div className="card-header">
              <h3>Connection Status</h3>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'var(--warning)',
                    boxShadow: '0 0 8px rgba(255, 152, 0, 0.4)',
                  }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Using Mock Data</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The backoffice is currently running with mock data. Connect your C# backend
                  to see live data from your API endpoints.
                </p>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  Expected Endpoints
                </div>
                {[
                  'GET /api/films',
                  'GET /api/users',
                  'GET /api/reviews',
                  'GET /api/lists',
                  'GET /api/threads',
                  'GET /api/dashboard/stats',
                  'POST /api/auth/login',
                ].map((endpoint) => (
                  <div
                    key={endpoint}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 0',
                      fontSize: 12,
                      fontFamily: 'monospace',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>●</span>
                    {endpoint}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3>Appearance</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13, marginBottom: 4 }}>Compact Mode</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reduce padding and spacing in tables</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" id="settings-compact" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13, marginBottom: 4 }}>Show Animations</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Enable hover effects and transitions</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked id="settings-animations" />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
