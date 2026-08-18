import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
  accentBg: string;
}

export function StatCard({ label, value, icon, accent, accentBg }: StatCardProps) {
  return (
    <div
      className="glass-panel stat-card"
      style={{ ['--accent' as string]: accent }}
    >
      <div className="stat-card-icon" style={{ background: accentBg, color: accent }}>
        {icon}
      </div>
      <p className="stat-card-label">{label}</p>
      <div className="stat-card-value">{value}</div>
    </div>
  );
}
