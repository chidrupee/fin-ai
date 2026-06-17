import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { ArrowLeft } from 'lucide-react';
import type { ChartDataPoint } from '../../types';

interface AnimatedBarChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  xKey: string;
  title: string;
  caption?: string;
  height?: number; // -1 = 100% fill
  drillDown?: Record<string, ChartDataPoint[]>;
}

const GRADIENT_COLORS = [
  ['var(--chart-bar-1-start)', 'var(--chart-bar-1-end)'],
  ['var(--chart-bar-2-start)', 'var(--chart-bar-2-end)'],
  ['var(--chart-bar-3-start)', 'var(--chart-bar-3-end)'],
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

export default function AnimatedBarChart({ data, dataKey, xKey, title, caption, height = 210, drillDown }: AnimatedBarChartProps) {
  const [activeDrillKey, setActiveDrillKey] = useState<string | null>(null);
  
  const currentData = activeDrillKey && drillDown && drillDown[activeDrillKey] ? drillDown[activeDrillKey] : data;
  const hasBudget = currentData.some((d) => 'budget' in d || 'target' in d);
  const budgetKey = currentData[0] && 'budget' in currentData[0] ? 'budget' : 'target';

  const handleBarClick = (entry: any) => {
    // Recharts passes the original object in entry, or sometimes inside entry.payload
    const key = entry[xKey] || (entry.payload && entry.payload[xKey]);
    if (key && drillDown && drillDown[key]) {
      setActiveDrillKey(key);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: height === -1 ? '100%' : undefined }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
          {activeDrillKey ? `${title} (${activeDrillKey})` : title}
        </p>
        <AnimatePresence>
          {activeDrillKey && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => setActiveDrillKey(null)}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-medium)',
                borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600,
                color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; }}
            >
              <ArrowLeft size={10} /> Back
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height={height === -1 ? '100%' : height}>
        <BarChart data={currentData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barGap={4}>
          <defs>
            {currentData.map((_, i) => (
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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
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
            onClick={handleBarClick}
          >
            {currentData.map((entry, i) => (
              <Cell 
                key={i} 
                fill={`url(#barGrad-${i})`} 
                cursor={drillDown && drillDown[entry[xKey] as string] ? 'pointer' : 'default'} 
              />
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
