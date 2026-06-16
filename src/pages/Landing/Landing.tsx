import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Table2, BarChart2, Brain, ChevronRight } from 'lucide-react';
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
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (q = query, mode: StrategyMode = 'visual') => {
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
            business
          </span>
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.6, margin: '0 auto' }}>
          Get instant answers from your HR, Finance, and Operations data — in the format that works best for you.
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        style={{ width: '100%', maxWidth: 680, marginBottom: 28 }}
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
            disabled={!query.trim()}
            style={{ flexShrink: 0, opacity: query.trim() ? 1 : 0.45 }}
          >
            Ask FinAI
          </RippleButton>
        </div>
      </motion.div>

      {/* "See what FinAI can do" label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}
      >
        See what FinAI can do →
      </motion.p>

      {/* 4 example question cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, width: '100%', maxWidth: 680, marginBottom: 28 }}
      >
        {EXAMPLE_QUESTIONS.map((ex, i) => {
          const Icon = ex.icon;
          return (
            <motion.button
              key={i}
              onClick={() => handleSubmit(ex.query, ex.mode)}
              whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(10,22,40,0.10)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: ex.bg,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${ex.border}`,
                borderRadius: 14,
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: `rgba(${ex.colorRgb}, 0.12)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={ex.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: ex.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {ex.label}
                  </p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 4 }}>
                  {ex.query}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {ex.sublabel} <ChevronRight size={10} />
                </p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Data Sources */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        style={{ width: '100%', maxWidth: 680 }}
      >
        <PinList
          domains={DATA_DOMAINS}
          pinnedIds={pinnedIds}
          onTogglePin={(id) => setPinnedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          )}
        />
      </motion.div>
    </div>
  );
}
