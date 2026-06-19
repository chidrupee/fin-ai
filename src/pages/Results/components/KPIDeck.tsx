import { motion } from 'framer-motion';
import type { QueryResult } from '../../../types';
import FlipCard from '../../../components/FlipCard/FlipCard';

export default function KPIDeck({ kpis, isCompareMode }: { kpis: QueryResult['kpis']; isCompareMode?: boolean }) {
  return (
    <motion.div
      className="print-wrap"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      style={{
        padding: isCompareMode ? '8px 12px' : '12px 20px',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--canvas-bg)',
        display: 'flex', gap: isCompareMode ? 6 : 10, flexShrink: 0, overflowX: 'auto',
      }}
    >
      {kpis.map((kpi, i) => <FlipCard key={kpi.id} kpi={kpi} delay={i * 0.07} isCompareMode={isCompareMode} />)}
    </motion.div>
  );
}
