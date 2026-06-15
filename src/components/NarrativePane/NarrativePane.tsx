import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { NarrativeSection, StrategyMode } from '../../types';
import DashboardPreviewCard from '../DashboardPreviewCard/DashboardPreviewCard';

interface NarrativePaneProps {
  narrative: NarrativeSection;
  mode: StrategyMode;
  compact?: boolean;
}

function Section({ label, content, delay }: { label: string; content: string; delay: number }) {
  const lines = content.split('\n').filter(Boolean);
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ marginBottom: 18 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <div style={{ width: 3, height: 14, background: 'var(--gradient-button)', borderRadius: 2, flexShrink: 0 }} />
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </p>
      </div>
      <div style={{ paddingLeft: 11 }}>
        {lines.map((line, i) => {
          const cleaned = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^[-•]\s/, '');
          const isBullet = /^[-•]/.test(line.trim()) || /^\d\./.test(line.trim());
          return (
            <p key={i} style={{
              fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65,
              marginBottom: isBullet ? 3 : 5, paddingLeft: isBullet ? 12 : 0, position: 'relative',
            }}>
              {isBullet && <span style={{ position: 'absolute', left: 0, color: '#c0392b', fontWeight: 700 }}>·</span>}
              {cleaned}
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}

// Safe mermaid chart renderer — isolated so a crash doesn't affect parent
function MermaidChart({ definition }: { definition: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const renderAttempted = useRef(false);

  useEffect(() => {
    // Prevent double-render in StrictMode
    if (renderAttempted.current) return;
    renderAttempted.current = true;

    const uniqueId = `mermaid-chart-${Math.random().toString(36).slice(2, 9)}`;

    const run = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#e8edf6',
            primaryBorderColor: '#c0392b',
            primaryTextColor: '#0d1b36',
            lineColor: '#c0392b',
            secondaryColor: '#f0f3f9',
            tertiaryColor: '#ffffff',
            background: '#ffffff',
            mainBkg: '#e8edf6',
            nodeBorder: '#c0392b',
            clusterBkg: '#f4f6fa',
            edgeLabelBackground: '#fff',
          },
        });
        const { svg } = await mermaid.render(uniqueId, definition);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setStatus('done');
        }
      } catch (err) {
        console.warn('Mermaid render failed:', err);
        setStatus('error');
      }
    };

    run();
  }, [definition]);

  if (status === 'error') {
    return (
      <div style={{
        padding: 12, background: 'var(--surface-3)',
        borderRadius: 8, fontSize: 11, color: 'var(--text-muted)',
        fontStyle: 'italic',
      }}>
        Flowchart unavailable in this preview.
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {status === 'loading' && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '12px 0' }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#c0392b' }}
            />
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Rendering flowchart…</span>
        </div>
      )}
      <div ref={containerRef} style={{ maxWidth: '100%', overflow: 'auto' }} />
    </div>
  );
}

export default function NarrativePane({ narrative, mode, compact = false }: NarrativePaneProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, paddingBottom: 60 }}>

        <Section label="Findings" content={narrative.findings} delay={0.05} />
        <Section label="Drivers" content={narrative.drivers} delay={0.15} />

        {/* Mermaid flowchart — analytical mode only */}
        {mode === 'analytical' && narrative.mermaidChart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            style={{
              margin: '14px 0',
              padding: 14,
              background: 'var(--surface-2)',
              border: '1px solid rgba(192,57,43,0.15)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <p style={{
              fontSize: 9, fontWeight: 700, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10,
            }}>
              ⬡ Relationship Flowchart
            </p>
            <MermaidChart definition={narrative.mermaidChart} />
          </motion.div>
        )}

        {!compact && (
          <>
            <Section label="Improvements" content={narrative.improvements} delay={0.35} />
            <Section label="Gaps & Caveats" content={narrative.gaps} delay={0.45} />

            {narrative.dashboardLinks.map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
              >
                <DashboardPreviewCard link={link} />
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
