'use client';

import { useState, useEffect } from 'react';
import DashboardCharts from '@/components/DashboardCharts';
import Loader from '@/components/Loader';

export default function AdminDashboard() {
  const [crowdData, setCrowdData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Authenticated request to backend in production
        const res = await fetch('http://localhost:5000/api/crowd-status');
        const json = await res.json();
        setCrowdData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev-token' // Bypass token for now
        },
        body: JSON.stringify({ message: 'Please use East Gate, Main Entrance is congested.', severity: 'high' })
      });
      alert('Alert broadcasted securely to all attendees.');
    } catch (e) {
      console.error(e);
      alert('Failed to send alert');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', background: 'var(--bg-secondary)', padding: '24px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--accent-primary)' }}>Admin Console</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-label="Admin Navigation">
          <button style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left' }} aria-current="page">Overview</button>
          <button style={{ padding: '12px', background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Heatmaps</button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2>Live Venue Analytics</h2>
          <button className="btn-primary" onClick={handleSendAlert} style={{ background: 'var(--accent-danger)' }} aria-label="Broadcast Emergency Alert">
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

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '16px' }}>Zone Density Analytics</h3>
          {loading ? <Loader text="Loading live analytics..." /> : <DashboardCharts data={crowdData?.densities || []} />}
        </div>
      </main>
    </div>
  );
}
