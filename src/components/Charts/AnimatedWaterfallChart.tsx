import { motion } from 'framer-motion';
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface AnimatedWaterfallChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  xKey: string;
  title: string;
  caption?: string;
  height?: number;
}

interface WaterfallEntry {
  category: string;
  base: number;
  value: number;
  rawValue: number;
  type: string;
}

function buildWaterfallData(data: ChartDataPoint[]): WaterfallEntry[] {
  let runningTotal = 0;
  return data.map((d) => {
    const type = d.type as string;
    const val = d.value as number;
    if (type === 'base') {
      runningTotal = val;
      return { category: d.category as string, base: 0, value: val, rawValue: val, type };
    }
    if (type === 'total') {
      return { category: d.category as string, base: 0, value: val, rawValue: val, type };
    }
    const base = val < 0 ? runningTotal + val : runningTotal;
    runningTotal += val;
    return { category: d.category as string, base, value: Math.abs(val), rawValue: val, type };
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload as WaterfallEntry;
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(10,22,40,0.12)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(10,22,40,0.12)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#0d1b36', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 11, color: entry?.rawValue < 0 ? '#10b981' : '#e74c3c' }}>
        {entry?.rawValue > 0 ? '+' : ''}{entry?.rawValue?.toFixed(1)}
      </p>
    </div>
  );
};

export default function AnimatedWaterfallChart({ data, title, caption, height = 200 }: AnimatedWaterfallChartProps) {
  const wfData = buildWaterfallData(data);

  const getColor = (type: string) => {
    if (type === 'base' || type === 'total') return 'url(#wfGradBase)';
    if (type === 'subtract') return 'url(#wfGradGreen)';
    return 'url(#wfGradRed)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: height === -1 ? '100%' : undefined }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, flexShrink: 0 }}>{title}</p>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={height === -1 ? '100%' : height}>
          <ComposedChart data={wfData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barSize={18}>
            <defs>
              <linearGradient id="wfGradBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-bar-1-start)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="var(--chart-bar-1-end)" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="wfGradRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-bar-3-end)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="var(--chart-bar-3-start)" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="wfGradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-green-start)" stopOpacity={0.85} />
                <stop offset="100%" stopColor="var(--chart-green-end)" stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(10,22,40,0.03)' }} />
            <Bar dataKey="base" fill="transparent" stackId="wf" isAnimationActive={false} />
            <Bar
              dataKey="value"
              stackId="wf"
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={1600}
              animationEasing="ease-out"
            >
              {wfData.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.type)} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5, borderLeft: '2px solid rgba(16,185,129,0.5)', paddingLeft: 7, flexShrink: 0 }}
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
}
