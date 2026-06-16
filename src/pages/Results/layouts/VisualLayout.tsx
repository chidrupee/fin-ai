import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import type { QueryResult } from '../../../types';
import ChartRenderer from '../components/ChartRenderer';

export default function VisualLayout({ result, isCompareMode }: { result: QueryResult; isCompareMode?: boolean }) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--canvas-bg)' }}>
      {/* Compact summary accordion */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        style={{
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border-light)',
          flexShrink: 0,
          position: 'sticky',
          top: 45, // height of FiltersBar
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <BarChart2 size={16} color="#c0392b" />
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', margin: 0, paddingRight: 20 }}>
              {result.narrative.findings.replace(/\*\*(.*?)\*\*/g, '$1').split('.')[0].slice(0, 120)}…
            </p>
          </div>
          <motion.button
            onClick={() => setSummaryOpen(!summaryOpen)}
            animate={!summaryOpen ? { boxShadow: ['0 0 0 0 rgba(192,57,43,0.4)', '0 0 0 6px rgba(192,57,43,0)', '0 0 0 0 rgba(192,57,43,0)'] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              background: summaryOpen ? 'var(--surface-3)' : 'var(--gradient-button)',
              color: summaryOpen ? 'var(--text-primary)' : '#fff',
              border: 'none', borderRadius: 8, padding: '6px 14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif', flexShrink: 0,
            }}
          >
            {summaryOpen ? 'Close Analysis' : 'View Full Analysis'}
            {summaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {summaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 20px 20px', display: 'flex', gap: 24, flexDirection: isCompareMode ? 'column' : 'row' }}>
                <div style={{ flex: 1, minWidth: 0, background: 'var(--canvas-bg)', padding: 16, borderRadius: 12, border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#c0392b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Key Findings</p>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {result.narrative.findings.split('. ').map((point, i) => point.trim() && (
                      <li key={i} style={{ marginBottom: 8 }}>{point.replace(/\*\*(.*?)\*\*/g, '$1').trim()}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: 1, minWidth: 0, background: 'var(--canvas-bg)', padding: 16, borderRadius: 12, border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#c0392b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Primary Drivers</p>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {result.narrative.drivers.split('. ').map((point, i) => point.trim() && (
                      <li key={i} style={{ marginBottom: 8 }}>{point.replace(/\*\*(.*?)\*\*/g, '$1').trim()}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: isCompareMode ? 'auto' : '0 0 240px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#c0392b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Data Sources</p>
                  {result.narrative.dashboardLinks.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)',
                        padding: '10px 14px', borderRadius: 8, fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59, 130, 246, 0.15)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59, 130, 246, 0.08)'; }}
                    >
                      {link.title}
                      <span>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Charts grid — allows scrolling if there are many charts */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: result.charts.length > 1 && !isCompareMode ? '1fr 1fr' : '1fr',
        gridAutoRows: 'minmax(280px, 1fr)',
        gap: 14, padding: 16,
      }}>
        {result.charts.map((chart, i) => {
          // If it's an odd number of charts and this is the last one, span full width
          const isLastAndOdd = i === result.charts.length - 1 && result.charts.length % 2 !== 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18 + i * 0.1, duration: 0.45 }}
              style={{
                gridColumn: isLastAndOdd ? '1 / -1' : undefined,
                background: 'var(--surface-1)',
                border: '1px solid var(--border-light)',
                borderRadius: 14, padding: '14px 16px',
                boxShadow: '0 1px 8px rgba(10,22,40,0.05)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                minHeight: 280,
              }}
            >
              <ChartRenderer chart={chart} height={-1} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
