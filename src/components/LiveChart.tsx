import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WeeklyTrendPoint } from '../types';

export function LiveChart({ data }: { data: WeeklyTrendPoint[] }) {
  return (
    <div className="glass-panel chart-panel">
      <div className="panel-heading">
        <h3>
          Haftalik tendensiya
          <span className="legend-dot">
            <span className="swatch" style={{ background: '#7c5cff' }} /> Buyurtmalar
          </span>
          <span className="legend-dot">
            <span className="swatch" style={{ background: '#35e6d0' }} /> Daromad
          </span>
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#35e6d0" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#35e6d0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6a6d87', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#6a6d87', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: '#12141f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              fontSize: 12,
            }}
            labelStyle={{ color: '#f4f5fb' }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#7c5cff"
            strokeWidth={2}
            fill="url(#ordersGradient)"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#35e6d0"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
