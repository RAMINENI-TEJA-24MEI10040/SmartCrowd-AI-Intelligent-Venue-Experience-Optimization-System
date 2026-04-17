'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      
      <div className="animate-slide-up" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SmartCrowd AI
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Intelligent Venue Experience Optimization. AI-powered real-time crowd management, queue prediction, and dynamic routing for world-class sporting events.
        </p>
        
        <div className="flex-center" style={{ gap: '24px' }}>
          <Link href="/user">
            <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Attendee Portal
            </button>
          </Link>
          <Link href="/admin">
            <button className="btn-primary" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 32px', fontSize: '1.1rem' }}>
              Venue Admin Dashboard
            </button>
          </Link>
        </div>
      </div>

      <div className="grid-2 animate-slide-up" style={{ marginTop: '5rem', width: '100%', animationDelay: '0.2s' }}>
        <div className="glass-panel" style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Dynamic Routing</h3>
          <p style={{ color: 'var(--text-secondary)' }}>AI predicts crowd density to suggest the fastest routes to your seat, restrooms, and food stalls.</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>Queue Prediction</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Never wait in line again. Live wait time estimations powered by real-time monitoring models.</p>
        </div>
      </div>
      
    </div>
  );
}
