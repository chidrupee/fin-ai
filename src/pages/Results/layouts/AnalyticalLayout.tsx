import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart2, ExternalLink } from 'lucide-react';
import type { QueryResult } from '../../../types';
import ChartRenderer from '../components/ChartRenderer';
import AnalysisViewSwitcher from '../../../components/AnalysisViewSwitcher/AnalysisViewSwitcher';

// Initialise mermaid if it was loaded; silently skip if not
function useMermaid(dep: string | undefined) {
  useEffect(() => {
    if (!dep) return;
    // @ts-ignore
    if (typeof window !== 'undefined' && window.mermaid) {
      try { (window as any).mermaid.init(undefined, '.mermaid'); } catch (_) { /* noop */ }
    }
  }, [dep]);
}

export default function AnalyticalLayout({ result, isCompareMode }: { result: QueryResult; isCompareMode?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useMermaid(result.narrative.mermaidChart);

  if (isCompareMode) {
    // Stack vertically in compare mode
    return (
      <div className="print-wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <NarrativePane result={result} isCompareMode />
        <ChartsPane result={result} isCompareMode />
      </div>
    );
  }

  return (
    <div
      className="print-wrap"
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '58% 42%',
        overflow: 'hidden',        // parent clips; each pane scrolls independently
        minHeight: 0,
      }}
    >
      {/* LEFT — narrative, sticky within its own scrollable column */}
      <div
        ref={scrollRef}
        style={{
          overflowY: 'auto',
          borderRight: '1px solid var(--border-light)',
          background: 'var(--surface-1)',
        }}
      >
        <NarrativePane result={result} />
      </div>

      {/* RIGHT — supporting charts, independently scrollable */}
      <div style={{ overflowY: 'auto', background: 'var(--canvas-bg)' }}>
        <ChartsPane result={result} />
      </div>
    </div>
  );
}

// ── Left: narrative pane ────────────────────────────────────────────────────

function NarrativePane({ result, isCompareMode }: { result: QueryResult; isCompareMode?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: 16,
        minHeight: isCompareMode ? 350 : undefined,
      }}
    >
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: 'rgba(192,57,43,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Brain size={14} color="#c0392b" />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Executive Analysis
          </p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, opacity: 0.7 }}>
            {result.query}
          </p>
        </div>
      </div>

      {/* View Switcher — takes remaining space */}
      <div style={{ flex: 1 }}>
        <AnalysisViewSwitcher
          mermaidChart={result.narrative?.mermaidChart}
          timelineEvents={result.narrative?.timelineEvents}
          findings={result.narrative?.findings || ''}
          drivers={result.narrative?.drivers || ''}
          improvements={result.narrative?.improvements || ''}
        />
      </div>

      {/* Data sources */}
      {result.narrative?.dashboardLinks && result.narrative.dashboardLinks.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
            Data Sources
          </p>
          {result.narrative.dashboardLinks.map(link => (
            <a
              key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)',
                padding: '8px 12px', borderRadius: 8,
                fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 600,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.13)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.06)')}
            >
              <span>{link.title}</span>
              <ExternalLink size={11} style={{ flexShrink: 0 }} />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Right: supporting charts pane ───────────────────────────────────────────

function ChartsPane({ result, isCompareMode }: { result: QueryResult; isCompareMode?: boolean }) {
  const charts = result.charts || [];
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      style={{
        padding: '20px 18px',
        display: 'flex', flexDirection: 'column', gap: 14,
        minHeight: isCompareMode ? 350 : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: 'rgba(59,130,246,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <BarChart2 size={14} color="#3b82f6" />
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Supporting Evidence
        </p>
      </div>

      {charts.map((chart, i) => (
        <motion.div
          key={chart.id ?? i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-light)',
            borderRadius: 14, padding: '14px 16px',
            boxShadow: '0 2px 10px rgba(10,22,40,0.05)',
            flexShrink: 0,
          }}
        >
          <ChartRenderer chart={chart} height={190} />
        </motion.div>
      ))}

      {charts.length === 0 && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No supporting charts</p>
        </div>
      )}
    </motion.div>
  );
}
