import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import type { KPICard } from '../../types';

interface FlipCardProps {
  kpi: KPICard;
  delay?: number;
}

const SPARKLINE_W = 96;
const SPARKLINE_H = 32;

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * SPARKLINE_W;
    const y = SPARKLINE_H - ((v - min) / range) * (SPARKLINE_H - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={SPARKLINE_W} height={SPARKLINE_H} style={{ overflow: 'visible' }}>
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

export default function FlipCard({ kpi, delay = 0 }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const healthColor = { green: '#10b981', red: '#e74c3c', amber: '#f59e0b' }[kpi.health];
  const TrendIcon = kpi.trendDirection === 'up' ? TrendingUp : kpi.trendDirection === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ perspective: 1000, flex: 1, minWidth: 140, height: 130, cursor: 'pointer', flexShrink: 1 }}
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
          background: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(10,22,40,0.07)',
          padding: '16px 18px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.02em' }}>{kpi.title}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{kpi.value}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: healthColor, boxShadow: `0 0 6px ${healthColor}` }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: healthColor }}>{kpi.trend}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{kpi.subText}</span>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: `linear-gradient(135deg, ${healthColor}12, #fff)`,
          border: `1px solid ${healthColor}30`,
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(10,22,40,0.07)',
          padding: '14px 18px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={13} color={healthColor} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Trend</span>
          </div>
          <Sparkline data={kpi.sparkline} color={healthColor} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendIcon size={14} color={healthColor} />
            <span style={{ fontSize: 13, fontWeight: 700, color: healthColor }}>{kpi.trend} QoQ</span>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>{kpi.subText}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
