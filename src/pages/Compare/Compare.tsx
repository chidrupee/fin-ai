import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Search, Clock, Plus } from 'lucide-react';
import type { QueryResult, SessionGroup } from '../../types';
import Results from '../Results/Results';
import { MOCK_RESULTS } from '../../data/mockData';

interface CompareProps {
  leftResult: QueryResult;
  rightResult: QueryResult | null;
  onBack: () => void;
  onCloseRight: () => void;
  onNewQuery: (query: string, side: 'left' | 'right') => void;
  sessionHistory: SessionGroup[];
}

export default function Compare({ leftResult, rightResult, onBack, onCloseRight, onNewQuery, sessionHistory }: CompareProps) {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search.trim()) {
      onNewQuery(search.trim(), 'right');
    }
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1, background: 'var(--canvas-bg)' }}>
      {/* Compare Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--surface-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          boxShadow: '0 1px 6px rgba(10,22,40,0.05)',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'var(--surface-2)', border: '1px solid var(--border-light)',
            borderRadius: 7, padding: '6px 12px', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; }}
        >
          <ArrowLeft size={14} /> Exit Compare
        </button>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Side-by-Side Comparison
        </div>
        <button
          onClick={onCloseRight}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
        >
          Close Right Pane <X size={14} />
        </button>
      </motion.div>

      {/* Split View */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, borderRight: '2px solid var(--border-medium)', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Reuse Results component but force visual mode for compact rendering if analytical is too wide, or let it handle itself. 
              To make it fit, we might want to override the style or just let Results render normally.
              Since Results is designed to fill its container, it will just be narrower. 
          */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '4px 12px', background: 'var(--surface-2)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', zIndex: 10, borderBottom: '1px solid var(--border-light)' }}>
            SCENARIO 1
          </div>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: 24 }}>
             <Results result={leftResult} onBack={onBack} onNewQuery={(q) => onNewQuery(q, 'left')} isCompareMode={true} />
          </div>
        </div>
        
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '4px 12px', background: 'var(--surface-2)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', zIndex: 10, borderBottom: '1px solid var(--border-light)' }}>
            SCENARIO 2
          </div>
          
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: 24 }}>
            {rightResult ? (
              <Results result={rightResult} onBack={onCloseRight} onNewQuery={(q) => onNewQuery(q, 'right')} isCompareMode={true} />
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--canvas-bg)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px dashed var(--border-medium)' }}>
                  <Plus size={24} color="var(--text-muted)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Select Scenario to Compare</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 30, textAlign: 'center', maxWidth: 300 }}>
                  Enter a new query or select a recent session from your history to compare side-by-side.
                </p>

                <div style={{ width: '100%', maxWidth: 400, marginBottom: 40 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', background: 'var(--surface-1)',
                    border: '1px solid var(--border-medium)', borderRadius: 12, padding: '8px 16px', gap: 10,
                    boxShadow: '0 2px 8px rgba(10,22,40,0.04)'
                  }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Ask a new question..."
                      style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)' }}
                    />
                    <button 
                      onClick={handleSearch}
                      disabled={!search.trim()}
                      style={{ 
                        background: 'var(--gradient-button)', border: 'none', borderRadius: 6, padding: '4px 12px', 
                        color: '#fff', fontSize: 12, fontWeight: 600, cursor: search.trim() ? 'pointer' : 'not-allowed', opacity: search.trim() ? 1 : 0.5 
                      }}
                    >
                      Compare
                    </button>
                  </div>
                </div>

                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Clock size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Queries</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sessionHistory.flatMap(group => group.sessions).slice(0, 4).map((session, i) => (
                      <button
                        key={i}
                        onClick={() => onNewQuery(session.query, 'right')}
                        style={{
                          background: 'var(--surface-1)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '12px 16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(192,57,43,0.3)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-light)'; }}
                      >
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 12 }}>
                          {session.query}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ 
                            fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--surface-2)', 
                            color: 'var(--text-muted)', textTransform: 'capitalize' 
                          }}>
                            {MOCK_RESULTS[session.resultId]?.mode || 'analytical'}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{session.timestamp}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
