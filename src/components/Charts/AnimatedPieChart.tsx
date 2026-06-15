import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface AnimatedPieChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  nameKey: string;
  title: string;
  caption?: string;
  height?: number;
}

const COLORS = ['#1e3a6e', '#c0392b', '#10b981', '#f59e0b', '#8b5cf6', '#0ea5e9'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(10,22,40,0.12)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(10,22,40,0.12)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#0d1b36', marginBottom: 4 }}>{data.name}</p>
      <p style={{ fontSize: 11, color: '#2e4270', fontWeight: 600 }}>
        {typeof data.value === 'number' && data.value > 100 ? `$${data.value.toLocaleString()}M` : data.value}
      </p>
    </div>
  );
};

export default function AnimatedPieChart({ data, dataKey, nameKey, title, caption, height = 200 }: AnimatedPieChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: height === -1 ? '100%' : undefined }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, flexShrink: 0 }}>{title}</p>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={height === -1 ? '100%' : height}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={height > 150 || height === -1 ? 60 : 40}
              outerRadius={height > 150 || height === -1 ? 80 : 60}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              iconSize={8}
              wrapperStyle={{ fontSize: 10, color: 'var(--text-muted)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5, borderLeft: '2px solid rgba(192,57,43,0.5)', paddingLeft: 7, flexShrink: 0 }}
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
}
