'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardCharts({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p style={{ color: 'var(--text-secondary)' }}>No analytics data available.</p>;

  // Format data for Recharts
  const chartData = data.map(d => ({
    name: d.zone_id.replace('zone_', 'Zone '),
    Density: Math.round(d.predicted_density * 100)
  }));

  return (
    <div style={{ width: '100%', height: 300 }} role="region" aria-label="Zone Density Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="var(--text-secondary)" />
          <YAxis stroke="var(--text-secondary)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)' }}
            itemStyle={{ color: 'var(--accent-primary)' }}
          />
          <Bar dataKey="Density" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
