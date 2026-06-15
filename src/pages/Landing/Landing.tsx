import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, BarChart2 } from 'lucide-react';
import type { StrategyMode } from '../../types';
import RippleButton from '../../components/RippleButton/RippleButton';
import StrategyToggle from '../../components/StrategyToggle/StrategyToggle';
import PinList from '../../components/PinList/PinList';
import { DATA_DOMAINS } from '../../data/mockData';

interface LandingProps {
  onSubmit: (query: string, mode: StrategyMode, pinnedIds: string[]) => void;
}

const EXAMPLE_QUERIES = [
  "What's driving the Q3 headcount cost increase?",
  'Show me APAC tech spend vs budget',
  'Where are service margins being compressed?',
  'Show me the EMEA regional headcount breakdown',
];

export default function Landing({ onSubmit }: LandingProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<StrategyMode>('visual');
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [showContextModal, setShowContextModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!query.trim()) return;
    if (pinnedIds.length === 0) {
      setShowContextModal(true);
      return;
    }
    onSubmit(query.trim(), mode, pinnedIds);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 24px', overflowY: 'auto', position: 'relative', zIndex: 1,
    }}>
      <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 800 }}>
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ textAlign: 'center', marginBottom: 44 }}
        >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--gradient-button)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(192,57,43,0.3)',
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            FinAI Executive Dashboard
          </h1>
        </div>
        <p style={{
          fontSize: 38, fontWeight: 800, color: 'var(--text-primary)',
          letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 12,
        }}>
          Ask anything about your{' '}
          <span style={{
            background: 'var(--gradient-button)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            financials
          </span>
        </p>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.6 }}>
          Connect to HR, Technology, and Services dashboards — and get structured, executive-grade answers instantly.
        </p>
      </motion.div>

      {/* Strategy Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.55 }}
        style={{ marginBottom: 20, width: '100%', maxWidth: 600 }}
      >
        <StrategyToggle mode={mode} onChange={setMode} />
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.55 }}
        style={{ width: '100%', maxWidth: 700, marginBottom: 14 }}
      >
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--surface-1)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: 16, padding: '6px 6px 6px 20px',
          boxShadow: '0 4px 24px rgba(10,22,40,0.08), 0 1px 4px rgba(10,22,40,0.05)',
          gap: 12,
        }}>
          <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            id="main-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. What's driving the Q3 headcount cost increase?"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: 15,
              fontFamily: 'Inter, sans-serif', fontWeight: 400, minWidth: 0,
            }}
          />
          <RippleButton
            id="analyze-button"
            size="md"
            onClick={handleSubmit}
            disabled={!query.trim()}
            style={{ flexShrink: 0, opacity: query.trim() ? 1 : 0.45 }}
          >
            Analyze
          </RippleButton>
        </div>
        
        {/* View Example Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button
            onClick={() => {
              setQuery("What's driving the Q3 headcount cost increase?");
              onSubmit("What's driving the Q3 headcount cost increase?", mode, ['hr-core']);
            }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#3b82f6', fontSize: 13, fontWeight: 600,
              fontFamily: 'Inter, sans-serif', textDecoration: 'underline',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            Not sure what to ask? See an example analysis →
          </button>
        </div>
      </motion.div>

      {/* Example queries */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 700, marginBottom: 28 }}
      >
        {EXAMPLE_QUERIES.map((q, i) => (
          <button
            key={i}
            onClick={() => setQuery(q)}
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-light)',
              borderRadius: 20, padding: '5px 14px',
              fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              boxShadow: '0 1px 4px rgba(10,22,40,0.04)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = 'rgba(192,57,43,0.35)';
              el.style.color = 'var(--text-secondary)';
              el.style.boxShadow = '0 2px 8px rgba(10,22,40,0.08)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = 'var(--border-light)';
              el.style.color = 'var(--text-muted)';
              el.style.boxShadow = '0 1px 4px rgba(10,22,40,0.04)';
            }}
          >
            {q}
          </button>
        ))}
      </motion.div>

      {/* Pin List */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.55 }}
        style={{ width: '100%', maxWidth: 700 }}
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

      {/* Context Interception Modal */}
      {showContextModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(10,22,40,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              background: 'var(--surface-1)', border: '1px solid var(--border-medium)',
              borderRadius: 16, padding: '24px 32px', width: '100%', maxWidth: 440,
              boxShadow: '0 12px 40px rgba(10,22,40,0.12)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, textAlign: 'center' }}>
              Select Data Context
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
              To give you the most accurate analysis, please select which dashboard(s) this question applies to.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginBottom: 28, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
              {DATA_DOMAINS.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => {
                    const newPinned = [domain.id];
                    setPinnedIds(newPinned);
                    setShowContextModal(false);
                    onSubmit(query.trim(), mode, newPinned);
                  }}
                  style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border-light)',
                    borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(192,57,43,0.3)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-light)'; }}
                >
                  <BarChart2 size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{domain.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{domain.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowContextModal(false)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
