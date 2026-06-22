import { motion } from 'framer-motion';
import type { ChartConfig } from '../../types';

interface AnimatedHeatmapChartProps extends Omit<ChartConfig, 'type' | 'id'> {
  height?: number;
}

export default function AnimatedHeatmapChart({ data, title, caption, height = 210 }: AnimatedHeatmapChartProps) {
  // Find min and max for color scaling
  const allValues = data.flatMap(d => Object.values(d).filter(v => typeof v === 'number') as number[]);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);

  const getColor = (value: number) => {
    if (value === 0) return 'var(--surface-2)';
    // Scale from light red to dark red
    const ratio = (value - min) / (max - min || 1);
    const lightness = 95 - (ratio * 45); // 95% to 50% lightness
    return `hsl(4, 90%, ${lightness}%)`;
  };

  const xLabels = Object.keys(data[0] || {}).filter(k => k !== 'id' && k !== 'name' && k !== 'label');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: height === -1 ? '100%' : undefined }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{title}</p>
          {caption && <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{caption}</p>}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4, overflowX: 'auto' }}>
        {/* Header row */}
        <div style={{ display: 'flex', gap: 4, minWidth: 'min-content' }}>
          <div style={{ width: 100, flexShrink: 0 }} /> {/* empty top left */}
          {xLabels.map(label => (
            <div key={label} style={{ flex: 1, minWidth: 60, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', textTransform: 'capitalize' }}>
              {label}
            </div>
          ))}
        </div>

        {/* Data rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {data.map((row, i) => (
            <div key={row.name || row.id || i} style={{ display: 'flex', gap: 4, minWidth: 'min-content', height: 32 }}>
              <div style={{ width: 100, flexShrink: 0, display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>
                {row.name || row.id || `Row ${i + 1}`}
              </div>
              {xLabels.map((col, j) => {
                const val = row[col] as number;
                return (
                  <motion.div
                    key={`${i}-${j}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + (i * 0.05) + (j * 0.05) }}
                    style={{
                      flex: 1, minWidth: 60,
                      background: getColor(val),
                      borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, color: val > (max + min) / 2 ? '#fff' : '#c0392b',
                      cursor: 'pointer'
                    }}
                    title={`${col}: ${val}`}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
