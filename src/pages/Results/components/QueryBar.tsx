import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Brain, BarChart2, Code, Lightbulb, Check, Copy } from 'lucide-react';
import type { StrategyMode } from '../../../types';
import { detectDeepDive } from '../utils';

export default function QueryBar({ query, mode, onBack, onNewQuery, onCompare, backLabel }: {
  query: string; mode: StrategyMode;
  onBack: () => void; onNewQuery: (q: string, mode?: StrategyMode) => void; onCompare?: () => void;
  backLabel?: string;
}) {
  const [q, setQ] = useState(query);
  const [showSql, setShowSql] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText("WITH regional_headcount AS (\n  SELECT region, department, COUNT(employee_id) AS headcount, SUM(base_salary + bonus) AS total_cost\n  FROM core_hr.workforce\n  WHERE status = 'Active' AND date_trunc('quarter', current_date) = '2026-07-01'\n  GROUP BY region, department\n)\nSELECT * FROM regional_headcount ORDER BY total_cost DESC;");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="no-print"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        padding: '9px 20px',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--surface-1)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        boxShadow: '0 1px 6px rgba(10,22,40,0.05)',
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: 'var(--surface-2)', border: '1px solid var(--border-light)',
          borderRadius: 7, padding: '5px 10px', cursor: 'pointer',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11.5, fontFamily: 'Inter, sans-serif', flexShrink: 0, transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; }}
      >
        <ArrowLeft size={11} /> {backLabel ?? 'New Query'}
      </button>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        background: 'var(--surface-2)', border: '1px solid var(--border-light)',
        borderRadius: 9, padding: '6px 13px', gap: 9,
      }}>
        <Search size={13} color="var(--text-muted)" />
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!q.trim()) return;
              const { isDeepDive, mode: dm } = detectDeepDive(q);
              onNewQuery(q, isDeepDive ? dm : undefined);
            }
          }}
          placeholder="Ask a follow-up… or type 'delve deeper' to switch to full analysis"
          rows={1}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'Inter, sans-serif',
            resize: 'none', lineHeight: 1.4, maxHeight: 72, overflow: 'auto',
          }}
          onFocus={(e) => { e.currentTarget.rows = 3; }}
          onBlur={(e) => { e.currentTarget.rows = 1; }}
        />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#c0392b',
          background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)',
          borderRadius: 10, padding: '2px 8px', flexShrink: 0,
        }}>
          {mode === 'analytical' ? <Brain size={11} /> : <BarChart2 size={11} />}
          <span style={{ textTransform: 'capitalize' }}>{mode}</span>
        </div>

        {/* Next Steps Icon */}
        <div style={{ position: 'relative' }} onMouseEnter={() => setShowPrompts(true)} onMouseLeave={() => setShowPrompts(false)}>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: showPrompts ? '#f59e0b' : 'var(--text-muted)', transition: 'color 0.2s'
          }}>
            <Lightbulb size={16} />
          </button>
          <AnimatePresence>
            {showPrompts && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8, zIndex: 100,
                  background: 'var(--surface-1)', border: '1px solid var(--border-medium)',
                  borderRadius: 12, padding: '12px', width: 280,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 4px' }}>
                  Suggested Next Steps
                </p>
                {/* Mock prompts */}
                {['Break down the Q3 headcount cost increase by region', 'Compare actuals vs budget for Q3'].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => { setShowPrompts(false); onNewQuery(p); }}
                    style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border-light)',
                      borderRadius: 8, padding: '8px 12px', textAlign: 'left',
                      fontSize: 11.5, color: 'var(--text-secondary)', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(192,57,43,0.08)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(192,57,43,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = '#c0392b'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-light)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
      {onCompare && (
        <button
          onClick={onCompare}
          style={{
            background: 'var(--surface-1)', border: '1px solid var(--border-medium)',
            borderRadius: 7, padding: '5px 10px', cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11.5, fontFamily: 'Inter, sans-serif', flexShrink: 0, transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-1)'; }}
        >
          Compare
        </button>
      )}
      <button
        onClick={() => setShowSql(true)}
        style={{
          background: 'var(--surface-2)', border: '1px solid var(--border-light)',
          borderRadius: 7, padding: '5px 8px', cursor: 'pointer',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)'; (e.currentTarget as HTMLButtonElement).style.color = '#3b82f6'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
        title="View generated SQL"
      >
        <Code size={14} />
      </button>

      {/* SQL Modal */}
      {showSql && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#0d1117', border: '1px solid #30363d',
              borderRadius: 12, padding: 0, width: '100%', maxWidth: 700,
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #30363d', background: '#161b22' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code size={16} color="#8b949e" />
                <span style={{ color: '#c9d1d9', fontSize: 13, fontWeight: 600 }}>Generated SQL Queries</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button 
                  onClick={handleCopy}
                  style={{ 
                    background: 'none', border: '1px solid #30363d', borderRadius: 6, padding: '4px 8px',
                    color: '#8b949e', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c9d1d9'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#8b949e'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#8b949e'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#30363d'; }}
                >
                  {copied ? <><Check size={12} color="#3fb950" /> Copied!</> : <><Copy size={12} /> Copy Code</>}
                </button>
                <button onClick={() => setShowSql(false)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 16 }}>×</button>
              </div>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 500 }}>
              <pre style={{ margin: 0, color: '#e6edf3', fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
<span style={{ color: '#ff7b72' }}>WITH</span> regional_headcount <span style={{ color: '#ff7b72' }}>AS</span> (
  <span style={{ color: '#ff7b72' }}>SELECT</span> 
    region, 
    department, 
    <span style={{ color: '#d2a8ff' }}>COUNT</span>(employee_id) <span style={{ color: '#ff7b72' }}>AS</span> headcount,
    <span style={{ color: '#d2a8ff' }}>SUM</span>(base_salary + bonus) <span style={{ color: '#ff7b72' }}>AS</span> total_cost
  <span style={{ color: '#ff7b72' }}>FROM</span> core_hr.workforce
  <span style={{ color: '#ff7b72' }}>WHERE</span> status = <span style={{ color: '#a5d6ff' }}>'Active'</span>
    <span style={{ color: '#ff7b72' }}>AND</span> date_trunc(<span style={{ color: '#a5d6ff' }}>'quarter'</span>, current_date) = <span style={{ color: '#a5d6ff' }}>'2026-07-01'</span>
  <span style={{ color: '#ff7b72' }}>GROUP BY</span> region, department
)
<span style={{ color: '#ff7b72' }}>SELECT</span> * <span style={{ color: '#ff7b72' }}>FROM</span> regional_headcount <span style={{ color: '#ff7b72' }}>ORDER BY</span> total_cost <span style={{ color: '#ff7b72' }}>DESC</span>;
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
