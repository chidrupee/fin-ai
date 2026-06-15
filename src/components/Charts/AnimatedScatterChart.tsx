import { motion } from 'framer-motion';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ZAxis,
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface AnimatedScatterChartProps {
  data: ChartDataPoint[];
  xKey: string;
  yKey: string;
  title: string;
  caption?: string;
  height?: number;
}

const COLORS = ['#e74c3c', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const label = d?.dept || d?.team || d?.region || '';
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(10,22,40,0.12)',
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(10,22,40,0.12)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#0d1b36', marginBottom: 6 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 11, color: '#2e4270', marginBottom: 2 }}>
          {p.name}: <span style={{ fontWeight: 600, color: '#0d1b36' }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const CustomDot = (props: any) => {
  const { cx, cy, index } = props;
  const color = COLORS[index % COLORS.length];
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.18} />
      <circle cx={cx} cy={cy} r={6} fill={color} fillOpacity={0.85} stroke="#fff" strokeWidth={1.5} />
    </g>
  );
};

export default function AnimatedScatterChart({ data, xKey, yKey = 'costPerHead', title, caption, height = 200 }: AnimatedScatterChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: height === -1 ? '100%' : undefined }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, flexShrink: 0 }}>{title}</p>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={height === -1 ? '100%' : height}>
          <ScatterChart margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,22,40,0.06)" />
            <XAxis
              type="number" dataKey={xKey} name={xKey}
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
            />
            <YAxis
              type="number" dataKey={yKey} name={yKey}
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={36}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(10,22,40,0.02)' }} />
            <Scatter
              data={data}
              animationBegin={0}
              animationDuration={1800}
              animationEasing="ease-out"
              shape={<CustomDot />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5, borderLeft: '2px solid rgba(59,130,246,0.5)', paddingLeft: 7, flexShrink: 0 }}
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
}
