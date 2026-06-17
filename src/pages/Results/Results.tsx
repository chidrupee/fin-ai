import { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import type { QueryResult, StrategyMode } from '../../types';
import ShareButton from '../../components/ShareButton/ShareButton';

// Layouts
import ChatLayout from './layouts/ChatLayout';
import SpreadsheetLayout from './layouts/SpreadsheetLayout';
import VisualLayout from './layouts/VisualLayout';
import AnalyticalLayout from './layouts/AnalyticalLayout';

// Components
import QueryBar from './components/QueryBar';
import KPIDeck from './components/KPIDeck';
import FiltersBar from './components/FiltersBar';

interface ResultsProps {
  result: QueryResult;
  onBack: () => void;
  onNewQuery: (query: string, mode?: StrategyMode) => void;
  onCompare?: () => void;
  isCompareMode?: boolean;
}

export default function Results({ result, onBack, onNewQuery, onCompare, isCompareMode }: ResultsProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  const filteredResult = useMemo(() => {
    let displayCharts = result.charts;
    if (result.mode === 'analytical') displayCharts = displayCharts.slice(0, 2);
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

      {/* SCROLLING CONTAINER */}
      <div id="results-scroll-container" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* KPI deck only for visual/analytical */}
        {(result.mode === 'visual' || result.mode === 'analytical' || result.mode === 'spreadsheet') && (
          <KPIDeck kpis={result.kpis} />
        )}

        {/* Mode router */}
        {result.mode === 'chat' ? (
          <ChatLayout result={result} onNewQuery={onNewQuery} />
        ) : result.mode === 'spreadsheet' ? (
          <SpreadsheetLayout result={result} />
        ) : (
          <>
            <div style={{ position: 'sticky', top: 0, zIndex: 40 }}>
              <FiltersBar activeFilters={activeFilters} onToggleFilter={toggleFilter} />
            </div>
            {filteredResult.mode === 'analytical'
              ? <AnalyticalLayout result={filteredResult} isCompareMode={isCompareMode} />
              : <VisualLayout result={filteredResult} isCompareMode={isCompareMode} />
            }
          </>
        )}

        {/* Suggested Next Steps */}
        {result.recommendedPrompts && result.recommendedPrompts.length > 0 && (
          <div className="no-print" style={{ 
            padding: '16px 20px', flexShrink: 0, zIndex: 10, alignSelf: 'flex-start'
          }}>
            <div style={{
              background: 'var(--surface-1)', border: '1px solid var(--border-light)',
              borderRadius: 12, padding: '12px 16px', display: 'flex', flexDirection: 'column',
              boxShadow: '0 2px 12px rgba(10,22,40,0.05)',
            }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, textAlign: 'left' }}>
                Suggested Next Steps
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start' }}>
                {result.recommendedPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => onNewQuery(prompt.query)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'var(--surface-2)', border: '1px solid var(--border-medium)',
                      padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                      color: 'var(--text-primary)', fontSize: 11, fontWeight: 500,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface-3)';
                      e.currentTarget.style.borderColor = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--surface-2)';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {prompt.label}
                    <ArrowRight size={12} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {!isCompareMode && <ShareButton />}
    </div>
  );
}
