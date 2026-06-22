import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Clock, AlignLeft, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import MermaidChart from '../MermaidChart/MermaidChart';

interface TimelineEvent {
  date: string;
  label: string;
  detail: string;
  type: 'cause' | 'effect' | 'action';
}

interface AnalysisViewSwitcherProps {
  mermaidChart?: string;
  timelineEvents?: TimelineEvent[];
  findings: string;
  drivers: string;
  improvements: string;
}

const TABS = [
  { id: 'flowchart' as const, label: 'Root Cause Map', Icon: GitBranch },
  { id: 'timeline' as const, label: 'Timeline', Icon: Clock },
  { id: 'bullets' as const, label: 'Key Points', Icon: AlignLeft },
];

const TYPE_META = {
  cause:  { color: '#f59e0b', Icon: AlertCircle,   label: 'Cause'  },
  effect: { color: '#e74c3c', Icon: AlertCircle,   label: 'Effect' },
  action: { color: '#10b981', Icon: CheckCircle2,  label: 'Action' },
};

export default function AnalysisViewSwitcher({
  mermaidChart,
  timelineEvents,
  findings,
  drivers,
  improvements,
}: AnalysisViewSwitcherProps) {
  const [view, setView] = useState<'flowchart' | 'timeline' | 'bullets'>('flowchart');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab Strip */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: '1px solid var(--border-light)', paddingBottom: 0,
      }}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className={isActive ? 'avs-tab-active' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px 13px', borderRadius: 0,
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #c0392b' : '2px solid transparent',
                color: isActive ? '#c0392b' : 'var(--text-muted)',
                fontSize: 12, fontWeight: isActive ? 700 : 500, cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>
        <AnimatePresence mode="wait">
          {view === 'flowchart' && (
            <motion.div
              key="flowchart"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {mermaidChart ? (
                <MermaidChart chart={mermaidChart} />
              ) : (
                // Fallback — render textual cause-effect diagram
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Causal breakdown of key drivers:
                  </p>
                  {findings.split('. ').filter(s => s.trim()).map((s, i) => (
                    <div key={i} style={{
                      background: 'var(--surface-2)', borderLeft: '3px solid #c0392b',
                      padding: '10px 14px', borderRadius: '0 8px 8px 0',
                      fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                    }}>
                      {s.replace(/\*\*(.*?)\*\*/g, '$1').trim()}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {timelineEvents ? (
                <div style={{ position: 'relative', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {/* Vertical spine */}
                  <div style={{
                    position: 'absolute', left: 5, top: 6, bottom: 6, width: 2,
                    background: 'linear-gradient(to bottom, #f59e0b, #e74c3c, #10b981)',
                    borderRadius: 2,
                  }} />

                  {timelineEvents.map((evt, i) => {
                    const meta = TYPE_META[evt.type];
                    const MetaIcon = meta.Icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.22 }}
                        style={{ display: 'flex', gap: 14, paddingBottom: 20, position: 'relative' }}
                      >
                        {/* Node */}
                        <div style={{
                          position: 'absolute', left: -15, top: 2,
                          width: 12, height: 12, borderRadius: '50%',
                          background: meta.color,
                          border: '2px solid var(--surface-1)',
                          boxShadow: `0 0 0 3px ${meta.color}30`,
                          flexShrink: 0, zIndex: 2,
                        }} />

                        {/* Card */}
                        <div style={{
                          flex: 1, background: 'var(--surface-2)', borderRadius: 10,
                          padding: '10px 14px', border: `1px solid ${meta.color}25`,
                          borderLeft: `3px solid ${meta.color}`,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{
                              fontSize: 9, fontWeight: 700, color: meta.color,
                              background: `${meta.color}15`, padding: '2px 6px',
                              borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.06em',
                              display: 'flex', alignItems: 'center', gap: 3,
                            }}>
                              <MetaIcon size={9} /> {meta.label}
                            </span>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                              {evt.date}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                            {evt.label}
                          </h4>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                            {evt.detail}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: 12 }}>No timeline data available.</p>
              )}
            </motion.div>
          )}

          {view === 'bullets' && (
            <motion.div
              key="bullets"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {[
                { title: 'Key Findings', content: findings, color: '#e74c3c', icon: AlertCircle },
                { title: 'Primary Drivers', content: drivers, color: '#f59e0b', icon: Zap },
                { title: 'Recommended Actions', content: improvements, color: '#10b981', icon: CheckCircle2 }
              ].map(({ title, content, color, icon: SectionIcon }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.2 }}
                  style={{
                    background: 'var(--surface-2)', padding: '14px 16px',
                    borderRadius: 12, borderLeft: `3px solid ${color}`,
                    border: `1px solid ${color}20`,
                    borderLeftWidth: 3,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, background: `${color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <SectionIcon size={13} color={color} />
                    </div>
                    <h4 style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                      {title}
                    </h4>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {content.split('. ')
                      .map(s => s.replace(/\*\*(.*?)\*\*/g, '$1').trim())
                      .filter(Boolean)
                      .map((point, j) => (
                        <li key={j} style={{ marginBottom: 5 }}>{point}</li>
                      ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
