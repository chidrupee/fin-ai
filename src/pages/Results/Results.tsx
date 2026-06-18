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
              <FiltersBar 
                activeFilters={activeFilters} 
                onToggleFilter={toggleFilter} 
                recommendedPrompts={result.recommendedPrompts}
                onNewQuery={onNewQuery}
              />
            </div>
            {filteredResult.mode === 'analytical'
              ? <AnalyticalLayout result={filteredResult} isCompareMode={isCompareMode} />
              : <VisualLayout result={filteredResult} isCompareMode={isCompareMode} />
            }
          </>
        )}

      </div>

      {!isCompareMode && <ShareButton />}
    </div>
  );
}
