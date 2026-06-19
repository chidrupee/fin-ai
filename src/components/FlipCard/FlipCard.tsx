import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import type { KPICard } from '../../types';

interface FlipCardProps {
  kpi: KPICard;
  delay?: number;
  isCompareMode?: boolean;
}

const SPARKLINE_W = 96;
const SPARKLINE_H = 32;

function Sparkline({ data, color, width = SPARKLINE_W, height = SPARKLINE_H }: { data: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FlipCard({ kpi, delay = 0, isCompareMode = false }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const healthColor = { green: '#10b981', red: '#e74c3c', amber: '#f59e0b' }[kpi.health];
  const TrendIcon = kpi.trendDirection === 'up' ? TrendingUp : kpi.trendDirection === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ 
        perspective: 1000, 
        flex: 1, 
        minWidth: isCompareMode ? 120 : 140, 
        height: isCompareMode ? 115 : 130, 
        cursor: 'pointer', 
        flexShrink: 1 
      }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-light)',
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(10,22,40,0.07)',
          padding: isCompareMode ? '12px 14px' : '16px 18px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ 
              fontSize: isCompareMode ? 10 : 11, 
              fontWeight: 500, 
              color: 'var(--text-muted)', 
              marginBottom: isCompareMode ? 2 : 6, 
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }} title={kpi.title}>{kpi.title}</p>
            <p style={{ 
              fontSize: isCompareMode ? 22 : 28, 
              fontWeight: 800, 
              color: 'var(--text-primary)', 
              letterSpacing: '-0.03em', 
              lineHeight: 1 
            }}>{kpi.value}</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: isCompareMode ? '2px 4px' : '4px 6px', marginTop: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: healthColor, boxShadow: `0 0 6px ${healthColor}` }} />
            <span style={{ fontSize: isCompareMode ? 10 : 11, fontWeight: 600, color: healthColor }}>{kpi.trend}</span>
            <span style={{ fontSize: isCompareMode ? 9 : 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isCompareMode ? 65 : 'none' }}>{kpi.subText}</span>
          </div>
        </div>

        {/* Back */}
        <div className="no-print" style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: `linear-gradient(135deg, ${healthColor}12, var(--surface-1))`,
          border: `1px solid ${healthColor}30`,
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(10,22,40,0.07)',
          padding: isCompareMode ? '10px 12px' : '14px 18px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: isCompareMode ? 4 : 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={isCompareMode ? 11 : 13} color={healthColor} />
            <span style={{ fontSize: isCompareMode ? 9 : 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Trend</span>
          </div>
          <div style={{ height: isCompareMode ? 24 : 'auto', display: 'flex', alignItems: 'center' }}>
            <Sparkline data={kpi.sparkline} color={healthColor} width={isCompareMode ? 80 : 96} height={isCompareMode ? 24 : 32} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendIcon size={isCompareMode ? 12 : 14} color={healthColor} />
            <span style={{ fontSize: isCompareMode ? 11 : 13, fontWeight: 700, color: healthColor }}>{kpi.trend} QoQ</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
