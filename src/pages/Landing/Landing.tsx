import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Table2, BarChart2, Brain } from 'lucide-react';
import type { StrategyMode } from '../../types';
import RippleButton from '../../components/RippleButton/RippleButton';
import PinList from '../../components/PinList/PinList';
import { DATA_DOMAINS } from '../../data/mockData';

interface LandingProps {
  onSubmit: (query: string, mode: StrategyMode, pinnedIds: string[]) => void;
}

// Executive-friendly example questions — each unlocks a different capability
const EXAMPLE_QUESTIONS = [
  {
    query: 'What is our global revenue this quarter?',
    mode: 'chat' as StrategyMode,
    label: 'Quick Answer',
    sublabel: 'Get a clear, conversational summary',
    icon: MessageCircle,
    color: '#6366f1',
    colorRgb: '99,102,241',
    bg: 'rgba(99,102,241,0.04)',
    border: 'rgba(99,102,241,0.15)',
  },
  {
    query: 'Show me departmental budget vs actuals',
    mode: 'spreadsheet' as StrategyMode,
    label: 'Data Table',
    sublabel: 'Explore numbers in a sortable table',
    icon: Table2,
    color: '#0ea5e9',
    colorRgb: '14,165,233',
    bg: 'rgba(14,165,233,0.04)',
    border: 'rgba(14,165,233,0.15)',
  },
  {
    query: 'Show me regional revenue performance',
    mode: 'visual' as StrategyMode,
    label: 'Visual Dashboard',
    sublabel: 'Interactive charts — click to drill down',
    icon: BarChart2,
    color: '#10b981',
    colorRgb: '16,185,129',
    bg: 'rgba(16,185,129,0.04)',
    border: 'rgba(16,185,129,0.15)',
  },
  {
    query: "What's driving the Q3 headcount cost increase?",
    mode: 'analytical' as StrategyMode,
    label: 'Deep Analysis',
    sublabel: 'Narrative findings, root causes & actions',
    icon: Brain,
    color: '#c0392b',
    colorRgb: '192,57,43',
    bg: 'rgba(192,57,43,0.04)',
    border: 'rgba(192,57,43,0.15)',
  },
];

export default function Landing({ onSubmit }: LandingProps) {
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<StrategyMode>('visual');
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (q = query, mode: StrategyMode = selectedMode) => {
    if (!q.trim()) return;
    onSubmit(q.trim(), mode, pinnedIds);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Tab' && !query) {
      e.preventDefault();
      setQuery('Show me regional revenue performance');
    }
  };

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      padding: '4vw 24px 40px', overflowY: 'auto', gap: 0,
    }}>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{ textAlign: 'center', marginBottom: 36 }}
      >
        <p style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 10 }}>
          Ask anything about your{' '}
          <span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            business performance
          </span>
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 460, lineHeight: 1.6, margin: '0 auto' }}>
          Turn data into instant insights, explore performance, identify drivers, and take actions with Constellation powered by FinAI.
        </p>
      </motion.div>

      {/* "See what Constellation can do" label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}
      >
        Choose Analysis Mode →
      </motion.p>

      {/* 4 mode selection cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%', maxWidth: 800, marginBottom: 28 }}
      >
        {EXAMPLE_QUESTIONS.map((ex, i) => {
          const Icon = ex.icon;
          const isSelected = selectedMode === ex.mode;
          return (
            <motion.button
              key={i}
              onClick={() => setSelectedMode(ex.mode)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: isSelected ? ex.bg : 'var(--surface-1)',
                border: `1.5px solid rgba(${ex.colorRgb}, ${isSelected ? '1' : '0.75'})`,
                borderRadius: 14,
                padding: '12px 14px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: isSelected ? `0 4px 16px rgba(${ex.colorRgb}, 0.15)` : 'none',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: isSelected ? `rgba(${ex.colorRgb}, 0.12)` : 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={isSelected ? ex.color : 'var(--text-muted)'} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: isSelected ? ex.color : 'var(--text-primary)', letterSpacing: '0.02em', marginBottom: 4 }}>
                  {ex.label}
                </p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {ex.sublabel}
                </p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ width: '100%', maxWidth: 800, marginBottom: 16 }}
      >

        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--surface-1)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: 16, padding: '8px 8px 8px 20px',
          boxShadow: '0 4px 24px rgba(10,22,40,0.08)',
          gap: 12,
        }}>
          <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            id="main-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your question here, e.g. 'Show me regional revenue performance'"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: 14,
              fontFamily: 'Inter, sans-serif', fontWeight: 400, minWidth: 0,
            }}
          />
          <RippleButton
            id="analyze-button"
            size="md"
            onClick={() => handleSubmit()}
            style={{ flexShrink: 0 }}
          >
            Ask Constellation
          </RippleButton>
        </div>
      </motion.div>

      {/* Example Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{ width: '100%', maxWidth: 800, marginBottom: 28, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}
      >
        {EXAMPLE_QUESTIONS.map((ex, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(ex.query);
              setSelectedMode(ex.mode);
            }}
            style={{
              background: `rgba(${ex.colorRgb}, 0.03)`, border: `1.5px solid rgba(${ex.colorRgb}, 0.5)`,
              padding: '6px 12px', borderRadius: 16, fontSize: 11.5, color: 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = `rgba(${ex.colorRgb}, 0.12)`;
              (e.currentTarget as HTMLButtonElement).style.borderColor = ex.color;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = `rgba(${ex.colorRgb}, 0.03)`;
              (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(${ex.colorRgb}, 0.5)`;
            }}
          >
            {ex.query}
          </button>
        ))}
      </motion.div>

      {/* Data Sources */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        style={{ width: '100%', maxWidth: 800 }}
      >
        <PinList
          domains={DATA_DOMAINS.slice(0, 5)}
          pinnedIds={pinnedIds}
          onTogglePin={(id) => setPinnedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          )}
        />
      </motion.div>
    </div>
  );
}
