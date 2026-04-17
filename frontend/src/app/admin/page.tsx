'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [crowdData, setCrowdData] = useState<any>(null);

  useEffect(() => {
    // Polling backend
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/crowd-status');
        const json = await res.json();
        setCrowdData(json.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendAlert = async () => {
    try {
      await fetch('http://localhost:5000/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Please use East Gate, Main Entrance is congested.', severity: 'high' })
      });
      alert('Alert broadcasted to all attendees.');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--bg-secondary)', padding: '24px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--accent-primary)' }}>Admin Console</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer' }}>Overview</div>
          <div style={{ padding: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Heatmaps</div>
          <div style={{ padding: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Alerts</div>
          <div style={{ padding: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Settings</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2>Live Venue Analytics</h2>
          <button className="btn-primary" onClick={handleSendAlert} style={{ background: 'var(--accent-danger)' }}>
            Broadcast Emergency Alert
          </button>
        </header>

        <div className="grid-2" style={{ marginBottom: '24px' }}>
          <div className="glass-panel">
            <h4 style={{ color: 'var(--text-secondary)' }}>Total Venue Occupancy</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '8px' }}>42,510</div>
            <span className="badge badge-warning" style={{ marginTop: '8px' }}>85% Capacity</span>
          </div>
          <div className="glass-panel">
            <h4 style={{ color: 'var(--text-secondary)' }}>Avg Wait Time (Gates)</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '8px' }}>12m</div>
            <span className="badge badge-success" style={{ marginTop: '8px' }}>Optimal flow</span>
          </div>
        </div>

        <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '16px' }}>Venue Heatmap</h3>
          <div style={{ flex: 1, background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
            <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)' }}>
              [ Digital Twin Heatmap Visualization ]
            </p>
            {/* Simulated Heat Points */}
            <div style={{ position: 'absolute', top: '20%', left: '30%', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '30%', right: '20%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)', borderRadius: '50%' }}></div>
          </div>
        </div>
      </main>
    </div>
  );
}
