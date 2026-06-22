import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Table2, BarChart2, Brain, X, Zap } from 'lucide-react';
import type { StrategyMode } from '../../types';
import RippleButton from '../../components/RippleButton/RippleButton';
import PinList from '../../components/PinList/PinList';
import { DATA_DOMAINS } from '../../data/mockData';

interface LandingProps {
  onSubmit: (query: string, mode: StrategyMode, pinnedIds: string[], autoDetected?: boolean) => void;
}

// Executive-friendly example questions — each unlocks a different capability
const EXAMPLE_QUESTIONS = [
  {
    query: 'What is VOIS total revenue for Q3?',
    mode: 'chat' as StrategyMode,
    label: 'Quick Answer',
    sublabel: 'Get a clear, conversational summary',
    icon: MessageCircle,
    color: '#6366f1',
    colorRgb: '99,102,241',
  },
  {
    query: 'Give me a table of department budget vs actuals',
    mode: 'spreadsheet' as StrategyMode,
    label: 'Data Table',
    sublabel: 'Explore numbers in a sortable table',
    icon: Table2,
    color: '#0ea5e9',
    colorRgb: '14,165,233',
    auto: true
  },
  {
    query: 'Break this down by region and show me the charts',
    mode: 'visual' as StrategyMode,
    label: 'Visual Dashboard',
    sublabel: 'Interactive charts — click to drill down',
    icon: BarChart2,
    color: '#10b981',
    colorRgb: '16,185,129',
    auto: true
  },
  {
    query: "Analysis: why is the EMEA margin declining?",
    mode: 'analytical' as StrategyMode,
    label: 'Deep Analysis',
    sublabel: 'Narrative findings, root causes & actions',
    icon: Brain,
    color: '#c0392b',
    colorRgb: '192,57,43',
    auto: true
  },
];

function detectMode(query: string): StrategyMode {
  const q = query.toLowerCase();
  if (q.includes('table') || q.includes('budget vs') || q.includes('actuals')) return 'spreadsheet';
  if (q.includes('analysis') || q.includes('why') || q.includes('root cause') || q.includes('driving')) return 'analytical';
  if (q.includes('chart') || q.includes('show me') || q.includes('trend') || q.includes('visual') || q.includes('compare')) return 'visual';
  return 'chat';
}

export default function Landing({ onSubmit }: LandingProps) {
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<StrategyMode | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [showContextPopup, setShowContextPopup] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasQuery = query.trim().length > 0;
  
  // Now we can submit if we just have a query
  const isSubmitDisabled = !hasQuery;

  let buttonText = 'Ask Constellation';
  if (hasQuery && !selectedMode) {
    buttonText = 'Ask (Auto Detect)';
  }

  const handleStartSubmit = () => {
    if (!query.trim()) return;
    setShowContextPopup(true);
  };

  const handleFinalSubmit = (skipContext: boolean) => {
    if (!query.trim()) return;
    const finalContext = skipContext ? [] : pinnedIds;
    
    const autoDetected = !selectedMode;
    const modeToUse = selectedMode || detectMode(query);
    
    onSubmit(query.trim(), modeToUse, finalContext, autoDetected);
    setShowContextPopup(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleStartSubmit();
    if (e.key === 'Tab' && !query) {
      e.preventDefault();
      setQuery('Break this down by region and show me the charts');
    }
  };

  return (
    <div 
      onClick={() => setSelectedMode(null)}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        padding: '4vw 24px 40px', overflowY: 'auto', gap: 0,
      }}
    >

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{ textAlign: 'center', marginBottom: 36 }}
        onClick={(e) => e.stopPropagation()}
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

      {/* Mode Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          width: '100%',
          maxWidth: 800,
          marginBottom: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {EXAMPLE_QUESTIONS.map((ex, i) => {
          const Icon = ex.icon;
          const isSelected = selectedMode === ex.mode;
          return (
            <button
              key={i}
              onClick={() => setSelectedMode(isSelected ? null : ex.mode)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                background: isSelected ? `rgba(${ex.colorRgb}, 0.08)` : `rgba(${ex.colorRgb}, 0.02)`,
                border: isSelected ? `2px solid ${ex.color}` : `1.5px solid rgba(${ex.colorRgb}, 0.16)`,
                boxShadow: isSelected ? `0 4px 12px rgba(${ex.colorRgb}, 0.08)` : '0 2px 8px rgba(10,22,40,0.02)',
                textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.background = `rgba(${ex.colorRgb}, 0.06)`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(${ex.colorRgb}, 0.45)`;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.background = `rgba(${ex.colorRgb}, 0.02)`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(${ex.colorRgb}, 0.16)`;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, width: '100%' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 24, height: 24, borderRadius: 6,
                  background: `rgba(${ex.colorRgb}, 0.15)`,
                  transition: 'background 0.2s',
                }}>
                  <Icon size={14} color={ex.color} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? ex.color : 'var(--text-primary)' }}>
                  {ex.label}
                </span>
                {'auto' in ex && ex.auto && (
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(255,183,77,0.15)', color: '#ffb74d', padding: '2px 6px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>
                    <Zap size={10} fill="#ffb74d" /> Auto
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {ex.sublabel}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ width: '100%', maxWidth: 800, marginBottom: 16 }}
        onClick={(e) => e.stopPropagation()}
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

          {selectedMode && (
            (() => {
              const ex = EXAMPLE_QUESTIONS.find(x => x.mode === selectedMode);
              if (!ex) return null;
              const Icon = ex.icon;
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 8,
                  background: `rgba(${ex.colorRgb}, 0.1)`,
                  border: `1px solid rgba(${ex.colorRgb}, 0.25)`,
                  flexShrink: 0,
                }}>
                  <Icon size={12} color={ex.color} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: ex.color }}>
                    {ex.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMode(null);
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 0, margin: 0, color: ex.color, opacity: 0.7,
                      marginLeft: 2,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
              );
            })()
          )}

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
            onClick={handleStartSubmit}
            style={{ flexShrink: 0, opacity: isSubmitDisabled ? 0.6 : 1, cursor: isSubmitDisabled ? 'not-allowed' : 'pointer' }}
          >
            {buttonText}
          </RippleButton>
        </div>
      </motion.div>

      {/* Example Prompts (Suggested Questions) */}
      <AnimatePresence>
        <motion.div
          key="suggested-questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', maxWidth: 800, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {EXAMPLE_QUESTIONS.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(ex.query);
                  setSelectedMode(ex.mode);
                }}
                style={{
                  background: `rgba(${ex.colorRgb}, 0.05)`, 
                  border: `1.5px solid rgba(${ex.colorRgb}, 0.35)`,
                  padding: '8px 16px', 
                  borderRadius: 20, 
                  fontSize: 12, 
                  color: ex.color,
                  fontWeight: 600,
                  cursor: 'pointer', 
                  transition: 'all 0.2s', 
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: `0 2px 6px rgba(${ex.colorRgb}, 0.05)`
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = `rgba(${ex.colorRgb}, 0.15)`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ex.color;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = `rgba(${ex.colorRgb}, 0.05)`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(${ex.colorRgb}, 0.35)`;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                {ex.query}
              </button>
            ))}
        </motion.div>
      </AnimatePresence>

      {/* Data Context Pop-up Modal */}
      <AnimatePresence>
        {showContextPopup && (
          <div 
            style={{ 
              position: 'fixed', inset: 0, zIndex: 1000, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContextPopup(false)}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(10, 22, 40, 0.7)',
                backdropFilter: 'blur(8px)',
              }}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 580,
                background: 'var(--surface-1)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: 20,
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                zIndex: 1001,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 4 }}>
                    Select Data Context
                  </h3>
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                    Choose which datasets or systems Constellation should query to answer your question.
                  </p>
                </div>
                <button
                  onClick={() => setShowContextPopup(false)}
                  style={{
                    background: 'var(--surface-2)', border: 'none', borderRadius: '50%',
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* PinList (Data Context Selector) */}
              <div style={{ margin: '8px 0' }}>
                <PinList
                  domains={DATA_DOMAINS.slice(0, 5)}
                  pinnedIds={pinnedIds}
                  onTogglePin={(id) => setPinnedIds((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                  )}
                />
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
                <button
                  onClick={() => handleFinalSubmit(true)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-secondary)',
                    padding: '10px 18px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Skip
                </button>
                <button
                  onClick={() => handleFinalSubmit(false)}
                  style={{
                    background: 'var(--gradient-button)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(192, 57, 43, 0.2)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  Confirm & Ask
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
