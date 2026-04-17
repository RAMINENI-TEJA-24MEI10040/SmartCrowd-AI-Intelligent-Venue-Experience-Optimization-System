'use client';

import { useState, useEffect } from 'react';
import VenueMap from '@/components/Map';
import Loader from '@/components/Loader';
import { AlertTriangle, Clock, MapPin, Activity } from 'lucide-react';

export default function UserPortal() {
  const [crowdData, setCrowdData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Attendee Portal</h2>
        <span className="badge badge-success" aria-label="Status: Live Tracking Active">Live Tracking Active</span>
      </header>

      {crowdData?.alerts?.length > 0 && (
        <div className="glass-panel alert-pulse" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--accent-danger)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }} role="alert">
          <AlertTriangle color="var(--accent-danger)" />
          <div>
            <h4 style={{ color: 'var(--accent-danger)', margin: 0 }}>Live Alert</h4>
            <p style={{ margin: 0 }}>{crowdData.alerts[0]}</p>
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} /> Smart Navigation Map
          </h3>
          <VenueMap />
          <div style={{ marginTop: '1rem' }}>
            <button className="btn-primary" style={{ width: '100%' }} aria-label="Find Optimal Route">Find Optimal Route</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" role="region" aria-labelledby="queue-heading">
            <h3 id="queue-heading" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} /> Queue Times
            </h3>
            {loading ? <Loader text="Estimating wait times..." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {crowdData?.queues?.map((q: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} tabIndex={0}>
                    <span>🍔 Food Court 1</span>
                    <span style={{ fontWeight: 'bold', color: q.predicted_wait_time_minutes > 10 ? 'var(--accent-warning)' : 'var(--accent-success)' }} aria-label={`Estimated wait: ${q.predicted_wait_time_minutes} minutes`}>
                      ~{q.predicted_wait_time_minutes} min
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel" role="region" aria-labelledby="density-heading">
            <h3 id="density-heading" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} /> Zone Congestion
            </h3>
            {loading ? <Loader text="Analyzing densities..." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {crowdData?.densities?.map((d: any, i: number) => (
                  <div key={i} tabIndex={0} aria-label={`${d.zone_id === 'zone_A' ? 'Main Entrance' : 'Zone ' + d.zone_id} density is ${Math.round(d.predicted_density * 100)} percent`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.9rem' }}>{d.zone_id === 'zone_A' ? 'Main Entrance' : 'Zone ' + d.zone_id}</span>
                      <span style={{ fontSize: '0.9rem' }}>{Math.round(d.predicted_density * 100)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${d.predicted_density * 100}%`, 
                        height: '100%', 
                        background: d.predicted_density > 0.7 ? 'var(--accent-danger)' : 'var(--accent-success)',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
