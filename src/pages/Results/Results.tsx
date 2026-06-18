import { useState, useMemo } from 'react';
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
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    Region: 'All',
    Department: 'All',
    Timeframe: 'Q3'
  });

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredResult = useMemo(() => {
    let displayCharts = result.charts;
    if (result.mode === 'analytical') displayCharts = displayCharts.slice(0, 2);
    
    // Count how many filters differ from their defaults
    const activeCount = Object.entries(activeFilters).filter(([k, v]) => {
      if (k === 'Timeframe') return v !== 'Q3';
      return v !== 'All';
    }).length;

    if (activeCount > 0) {
      // Simulate filtering by proportionally scaling down the data values
      // rather than slicing the array (which looks like a drill-down/category removal)
      const multiplier = Math.pow(0.75, activeCount);
      displayCharts = displayCharts.map(c => ({
        ...c,
        data: c.data.map(d => {
          const newD = { ...d };
          Object.keys(newD).forEach(k => {
            if (typeof newD[k] === 'number') {
              newD[k] = Number((newD[k] * multiplier).toFixed(1));
            }
          });
          return newD;
        })
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
                onFilterChange={handleFilterChange} 
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
