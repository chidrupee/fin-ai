import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface AnimatedBarChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  xKey: string;
  title: string;
  caption?: string;
  height?: number; // -1 = 100% fill
}

const GRADIENT_COLORS = [
  ['#1e3a6e', '#c0392b'],
  ['#162d56', '#9b2226'],
  ['#0f2040', '#7b1a1a'],
  ['#1a3360', '#a93226'],
  ['#0d1d3b', '#922b21'],
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(10,22,40,0.12)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(10,22,40,0.12)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#0d1b36', marginBottom: 6 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 11, color: '#2e4270', marginBottom: 2 }}>
          {p.name}: <span style={{ fontWeight: 700, color: '#0d1b36' }}>{typeof p.value === 'number' ? `$${p.value.toFixed(1)}M` : p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function AnimatedBarChart({ data, dataKey, xKey, title, caption, height = 210 }: AnimatedBarChartProps) {
  const hasBudget = data.some((d) => 'budget' in d || 'target' in d);
  const budgetKey = data[0] && 'budget' in data[0] ? 'budget' : 'target';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: height === -1 ? '100%' : undefined }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, flexShrink: 0 }}>{title}</p>
      <div style={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height={height === -1 ? '100%' : height}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barGap={4}>
          <defs>
            {data.map((_, i) => (
              <linearGradient key={i} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GRADIENT_COLORS[i % GRADIENT_COLORS.length][1]} />
                <stop offset="100%" stopColor={GRADIENT_COLORS[i % GRADIENT_COLORS.length][0]} />
              </linearGradient>
            ))}
            <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,22,40,0.06)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {hasBudget && (
            <Bar
              dataKey={budgetKey}
              name="Budget / Target"
              fill="url(#budgetGrad)"
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
              barSize={14}
            />
          )}
          <Bar
            dataKey={dataKey}
            name="Actual"
            radius={[5, 5, 0, 0]}
            animationBegin={hasBudget ? 200 : 0}
            animationDuration={1400}
            animationEasing="ease-out"
            barSize={hasBudget ? 14 : 22}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#barGrad-${i})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5, borderLeft: '2px solid rgba(192,57,43,0.5)', paddingLeft: 7, flexShrink: 0 }}
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
}
