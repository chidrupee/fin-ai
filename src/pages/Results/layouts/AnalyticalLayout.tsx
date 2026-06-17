import { motion } from 'framer-motion';
import { Brain, BarChart2 } from 'lucide-react';
import type { QueryResult } from '../../../types';
import ChartRenderer from '../components/ChartRenderer';
import NarrativePane from '../../../components/NarrativePane/NarrativePane';

export default function AnalyticalLayout({ result, isCompareMode }: { result: QueryResult; isCompareMode?: boolean }) {
  return (
    <div className="print-wrap" style={{ flex: 1, display: 'flex', flexDirection: isCompareMode ? 'column' : 'row' }}>
      {/* LEFT: Narrative (wider) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        style={{
          flex: isCompareMode ? 'none' : '0 0 58%',
          height: isCompareMode ? 'auto' : 'auto',
          minHeight: isCompareMode ? 350 : 'auto',
          borderRight: isCompareMode ? 'none' : '1px solid var(--border-light)',
          borderBottom: isCompareMode ? '1px solid var(--border-light)' : 'none',
          background: 'var(--surface-1)',
          padding: '18px 22px',
          display: 'flex', flexDirection: 'column',
          position: 'sticky',
          top: 45,
          zIndex: 30,
          alignSelf: 'flex-start',
          maxHeight: isCompareMode ? 'none' : 'calc(100vh - 120px)',
          overflowY: isCompareMode ? 'visible' : 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexShrink: 0 }}>
          <Brain size={14} color="#c0392b" />
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Executive Narrative
          </p>
        </div>
        <NarrativePane
          narrative={result.narrative}
          mode={result.mode}
        />
      </motion.div>

      {/* RIGHT: Charts — scrollable column */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
        style={{
          flex: isCompareMode ? 'none' : '0 0 42%',
          height: isCompareMode ? 'auto' : 'auto',
          minHeight: isCompareMode ? 350 : 'auto',
          background: 'var(--canvas-bg)',
          padding: '18px 20px',
          display: 'flex', flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <BarChart2 size={14} color="#3b82f6" />
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Supporting Evidence
          </p>
        </div>

        {/* Show all charts */}
        {result.charts.map((chart, i) => (
          <motion.div
            key={i}
            className="chart-container"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.12, duration: 0.4 }}
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-light)',
              borderRadius: 12, padding: '14px 16px',
              boxShadow: '0 1px 6px rgba(10,22,40,0.05)',
              display: 'flex', flexDirection: 'column',
              flexShrink: 0, minWidth: 0,
            }}
          >
            <ChartRenderer chart={chart} height={180} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
