import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, BarChart2, Brain, ChevronDown, ChevronUp, Code, Lightbulb, Copy, Check } from 'lucide-react';
import type { QueryResult, ChartConfig } from '../../types';
import FlipCard from '../../components/FlipCard/FlipCard';
import NarrativePane from '../../components/NarrativePane/NarrativePane';
import AnimatedBarChart from '../../components/Charts/AnimatedBarChart';
import AnimatedWaterfallChart from '../../components/Charts/AnimatedWaterfallChart';
import AnimatedScatterChart from '../../components/Charts/AnimatedScatterChart';
import AnimatedLineChart from '../../components/Charts/AnimatedLineChart';
import AnimatedPieChart from '../../components/Charts/AnimatedPieChart';
import AnimatedHeatmapChart from '../../components/Charts/AnimatedHeatmapChart';
import ShareButton from '../../components/ShareButton/ShareButton';

interface ResultsProps {
  result: QueryResult;
  onBack: () => void;
  onNewQuery: (query: string) => void;
  onCompare?: () => void;
  isCompareMode?: boolean;
}

function ChartRenderer({ chart, height = 210 }: { chart: ChartConfig; height?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', height: '100%' }}>
      {chart.type === 'bar' && <AnimatedBarChart data={chart.data} dataKey={chart.dataKey} xKey={chart.xKey} title={chart.title} caption={chart.caption} height={height} />}
      {chart.type === 'waterfall' && <AnimatedWaterfallChart data={chart.data} dataKey={chart.dataKey} xKey={chart.xKey} title={chart.title} caption={chart.caption} height={height} />}
      {chart.type === 'line' && chart.lines && <AnimatedLineChart data={chart.data} lines={chart.lines} xKey={chart.xKey} title={chart.title} caption={chart.caption} height={height} referenceValue={chart.referenceValue} />}
      {chart.type === 'pie' && <AnimatedPieChart data={chart.data} dataKey={chart.dataKey} nameKey={chart.xKey} title={chart.title} caption={chart.caption} height={height} />}
      {chart.type === 'heatmap' && <AnimatedHeatmapChart data={chart.data} title={chart.title} caption={chart.caption} dataKey={chart.dataKey} xKey={chart.xKey} height={height} />}
      {chart.type === 'scatter' && <AnimatedScatterChart data={chart.data} xKey={chart.xKey} yKey={chart.yKey || 'value'} title={chart.title} caption={chart.caption} height={height} />}
      
      {(chart.type === 'heatmap' || chart.type === 'bar') && (
        <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right', fontStyle: 'italic', marginTop: 4 }}>
          * Click on a data point to drill down into sub-region details
        </p>
      )}
    </div>
  );
}

// ── Compact search + back bar ─────────────────────────────────────────────────
function QueryBar({ query, mode, onBack, onNewQuery, onCompare }: {
  query: string; mode: string;
  onBack: () => void; onNewQuery: (q: string) => void; onCompare?: () => void;
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
        <ArrowLeft size={11} /> New Query
      </button>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        background: 'var(--surface-2)', border: '1px solid var(--border-light)',
        borderRadius: 9, padding: '6px 13px', gap: 9,
      }}>
        <Search size={13} color="var(--text-muted)" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onNewQuery(q)}
          placeholder="Dive deeper with the same context..."
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'Inter, sans-serif',
          }}
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

// ── KPI Deck ─────────────────────────────────────────────────────────────────
function KPIDeck({ kpis }: { kpis: QueryResult['kpis'] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--canvas-bg)',
        display: 'flex', gap: 10, flexShrink: 0, overflowX: 'auto',
      }}
    >
      {kpis.map((kpi, i) => <FlipCard key={kpi.id} kpi={kpi} delay={i * 0.07} />)}
    </motion.div>
  );
}

// ── Mock Filters Bar ──────────────────────────────────────────────────────────
function FiltersBar({ activeFilters, onToggleFilter }: { activeFilters: string[]; onToggleFilter: (f: string) => void }) {
  const filters = ['Region: All', 'Department: All', 'Timeframe: Q3'];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      style={{
        display: 'flex', gap: 12, padding: '10px 20px',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--surface-1)', flexShrink: 0,
      }}
    >
      {filters.map((filter, i) => {
        const isActive = activeFilters.includes(filter);
        return (
          <button 
            key={i} 
            onClick={() => onToggleFilter(filter)}
            style={{
              background: isActive ? 'rgba(192,57,43,0.08)' : 'var(--surface-2)', 
              border: `1px solid ${isActive ? 'rgba(192,57,43,0.3)' : 'var(--border-medium)'}`,
              borderRadius: 6, padding: '4px 10px', fontSize: 11, 
              color: isActive ? '#c0392b' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {filter} <ChevronDown size={10} />
          </button>
        );
      })}
    </motion.div>
  );
}

// ── ANALYTICAL LAYOUT ─────────────────────────────────────────────────────────
// Left 58%: full narrative + mermaid flowchart
// Right 42%: one primary chart (the bar chart) — prominent
function AnalyticalLayout({ result, isCompareMode }: { result: QueryResult; isCompareMode?: boolean }) {

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: isCompareMode ? 'column' : 'row', overflowY: isCompareMode ? 'auto' : 'hidden' }}>

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
          display: 'flex', flexDirection: 'column', overflow: isCompareMode ? 'visible' : 'hidden',
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
          gap: 14, overflowY: isCompareMode ? 'visible' : 'auto', overflowX: 'hidden',
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.12, duration: 0.4 }}
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-light)',
              borderRadius: 12, padding: '14px 16px',
              boxShadow: '0 1px 6px rgba(10,22,40,0.05)',
              display: 'flex', flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            <ChartRenderer chart={chart} height={180} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ── VISUAL LAYOUT ─────────────────────────────────────────────────────────────
// Charts fill the full screen in a 2+1 grid, no scrolling
// Compact summary accordion at the top
function VisualLayout({ result, onNewQuery }: { result: QueryResult; onNewQuery: (q: string) => void; isCompareMode?: boolean }) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--canvas-bg)' }}>

      {/* Compact summary accordion */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        style={{
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border-light)',
          flexShrink: 0,
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
              <div style={{ padding: '0 20px 20px', display: 'flex', gap: 24, maxHeight: 320, overflowY: 'auto' }}>
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
                <div style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
        gridTemplateColumns: result.charts.length > 1 ? '1fr 1fr' : '1fr',
        gridAutoRows: 'minmax(280px, 1fr)',
        gap: 14, padding: 16,
        overflowY: 'auto',
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

      {/* Prompt pills at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--border-light)',
          background: 'var(--surface-1)',
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>
          Next →
        </span>
        {result.recommendedPrompts.map((p) => (
          <motion.button
            key={p.id}
            onClick={() => onNewQuery(p.query)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'var(--surface-2)', border: '1px solid var(--border-medium)',
              borderRadius: 20, padding: '4px 12px',
              fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = 'rgba(192,57,43,0.07)';
              el.style.borderColor = 'rgba(192,57,43,0.3)';
              el.style.color = '#c0392b';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = 'var(--surface-2)';
              el.style.borderColor = 'var(--border-medium)';
              el.style.color = 'var(--text-secondary)';
            }}
          >
            {p.label} →
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

import { useMemo } from 'react';

// ── Root Results page ─────────────────────────────────────────────────────────
export default function Results({ result, onBack, onNewQuery, onCompare, isCompareMode }: ResultsProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  // Simulate functional filters by slicing data arrays to change visuals dynamically
  const filteredResult = useMemo(() => {
    // 1. Limit number of charts in analytical mode to highlight the narrative
    let displayCharts = result.charts;
    if (result.mode === 'analytical') {
      displayCharts = displayCharts.slice(0, 2); // Show only top 2 charts
    }

    // 2. Simulate functional filters by slicing chart data
    if (activeFilters.length > 0) {
      displayCharts = displayCharts.map(c => ({
        ...c,
        data: c.data.slice(0, Math.max(2, c.data.length - 1))
      }));
    }

    return { ...result, charts: displayCharts };
  }, [result, activeFilters]);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

      {!isCompareMode && (
        <QueryBar
          query={result.query}
          mode={result.mode}
          onBack={onBack}
          onNewQuery={onNewQuery}
          onCompare={onCompare}
        />
      )}

      <KPIDeck kpis={result.kpis} />

      {/* Mode-aware main content */}
      <FiltersBar activeFilters={activeFilters} onToggleFilter={toggleFilter} />
      {filteredResult.mode === 'analytical'
        ? <AnalyticalLayout result={filteredResult} isCompareMode={isCompareMode} />
        : <VisualLayout result={filteredResult} onNewQuery={onNewQuery} />
      }

      {!isCompareMode && <ShareButton />}
    </div>
  );
}
