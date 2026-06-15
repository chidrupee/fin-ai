import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface AnimatedLineChartProps {
  data: ChartDataPoint[];
  lines: Array<{ key: string; color: string; label: string }>;
  xKey: string;
  title: string;
  caption?: string;
  height?: number;
  referenceValue?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#ffffff', border: '1px solid rgba(10,22,40,0.12)',
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(10,22,40,0.12)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#0d1b36', marginBottom: 6 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 11, color: p.color, marginBottom: 2, fontWeight: 500 }}>
          {p.name}: <span style={{ fontWeight: 700, color: '#0d1b36' }}>
            {typeof p.value === 'number' ? (p.value > 100 ? p.value.toLocaleString() : `${p.value}%`) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function AnimatedLineChart({
  data, lines, xKey, title, caption, height = 200, referenceValue,
}: AnimatedLineChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: height === -1 ? '100%' : undefined }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, flexShrink: 0 }}>{title}</p>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={height === -1 ? '100%' : height}>
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <defs>
              {lines.map((l, i) => (
                <linearGradient key={i} id={`lineGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={l.color} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={l.color} stopOpacity={0.01} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,22,40,0.06)" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<CustomTooltip />} />
            {referenceValue !== undefined && (
              <ReferenceLine y={referenceValue} stroke="rgba(192,57,43,0.5)" strokeDasharray="5 3"
                label={{ value: 'Target', fill: '#c0392b', fontSize: 9, position: 'right' }} />
            )}
            {lines.map((l, i) => (
              <Area
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.label}
                stroke={l.color}
                strokeWidth={2}
                fill={`url(#lineGrad-${i})`}
                dot={{ r: 3, fill: l.color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: l.color, stroke: '#fff', strokeWidth: 2 }}
                animationBegin={0}
                animationDuration={1800}
                animationEasing="ease-out"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5, borderLeft: '2px solid rgba(59,130,246,0.4)', paddingLeft: 7, flexShrink: 0 }}
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
}
