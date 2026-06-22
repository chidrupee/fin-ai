import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppState, StrategyMode, QueryResult } from './types';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import Landing from './pages/Landing/Landing';
import Results from './pages/Results/Results';
import Compare from './pages/Compare/Compare';
import { findResult, SESSION_HISTORY } from './data/mockData';

const INITIAL_STATE: AppState = {
  view: 'landing',
  currentQuery: '',
  currentMode: 'chat',
  pinnedDomains: [],
  currentResult: null,
  compareLeft: null,
  compareRight: null,
  isLoading: false,
  sessionHistory: SESSION_HISTORY,
  currentSessionThreadId: undefined,
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  // Stack of previous results for back-navigation (e.g. chat → visual → back to chat)
  const [resultHistory, setResultHistory] = useState<QueryResult[]>([]);

  const handleQuery = (query: string, mode: StrategyMode, pinnedIds: string[], autoDetected?: boolean) => {
    // If we're currently on a chat result and navigating to a non-chat mode,
    // push the current chat result to the back-history stack NOW (before loading)
    setState(prev => {
      if (prev.currentResult && prev.currentResult.mode === 'chat' && mode !== 'chat') {
        setResultHistory(h => [...h, prev.currentResult!]);
      }
      return prev;
    });

    setIsLoading(true);
    setTimeout(() => {
      const result = findResult(query, mode);
      const resultWithMode = { ...result, query, mode, autoDetectedMode: autoDetected };
      const threadId = state.currentSessionThreadId || `thread-${Date.now()}`;

      setState((prev) => {
        const newSessionEntry = {
          id: `s-${Date.now()}`,
          query,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          resultId: resultWithMode.id,
          mode,
          sessionThreadId: threadId,
          isFollowUp: !!prev.currentSessionThreadId,
          autoDetectedMode: autoDetected
        };

        const newHistory = [...prev.sessionHistory];
        if (newHistory.length > 0) {
          newHistory[0] = {
            ...newHistory[0],
            sessions: [...newHistory[0].sessions, newSessionEntry]
          };
        }

        return {
          ...prev,
          view: 'results',
          currentQuery: query,
          currentMode: mode,
          pinnedDomains: pinnedIds,
          currentResult: resultWithMode,
          currentSessionThreadId: threadId,
          sessionHistory: newHistory
        };
      });
      setIsLoading(false);
    }, 1400);
  };

  const handleSessionClick = (result: QueryResult) => {
    // Clear the history when navigating via sidebar (fresh navigation, not a drill-through)
    setResultHistory([]);
    setState((prev) => ({
      ...prev,
      view: 'results',
      currentQuery: result.query,
      currentMode: result.mode,
      currentResult: result,
    }));
  };

  const handleBack = () => {
    // If there's a previous result in history, go back to it instead of landing
    if (resultHistory.length > 0) {
      const prev = resultHistory[resultHistory.length - 1];
      setResultHistory(h => h.slice(0, -1));
      setState(s => ({
        ...s,
        view: 'results',
        currentQuery: prev.query,
        currentMode: prev.mode,
        currentResult: prev,
      }));
    } else {
      setState((prev) => ({ ...prev, view: 'landing', currentResult: null, compareLeft: null, compareRight: null }));
    }
  };

  const handleCompare = () => {
    const left = state.currentResult;
    if (!left) return;
    setState((prev) => ({
      ...prev,
      view: 'compare',
      compareLeft: left,
      compareRight: null,
    }));
  };

  const handleCompareNewQuery = (query: string, side: 'left' | 'right') => {
    const result = findResult(query);
    setState((prev) => ({
      ...prev,
      [side === 'left' ? 'compareLeft' : 'compareRight']: result,
    }));
  };

  const handleCloseCompareRight = () => {
    setState((prev) => ({
      ...prev,
      view: 'results',
      currentResult: prev.compareLeft,
      compareLeft: null,
      compareRight: null,
    }));
  };

  const handleSessionCompare = (result: QueryResult) => {
    setState((prev) => ({
      ...prev,
      view: 'compare',
      compareLeft: prev.currentResult || prev.compareLeft || result,
      compareRight: result,
    }));
  };

  return (
    <div data-theme={isDark ? 'dark' : undefined} style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', background: 'var(--canvas-bg)', color: 'var(--text-primary)', transition: 'background 0.3s ease' }}>
      <AnimatedBackground isDark={isDark} />

      {/* Sidebar */}
      <div className="no-print" style={{ display: 'flex', zIndex: 20 }}>
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          sessions={state.sessionHistory}
          onSessionClick={handleSessionClick}
          onSessionCompare={handleSessionCompare}
          onHome={handleBack}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <div className="no-print">
          <TopBar
            query={state.currentQuery}
            isResultsView={state.view === 'results'}
            isDark={isDark}
            onToggleDark={() => setIsDark(d => !d)}
          />
        </div>

        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark ? 'rgba(17,34,64,0.92)' : 'rgba(244,246,250,0.92)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ position: 'relative', marginBottom: 24 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.8, delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: '2px solid #c0392b',
                      }}
                    />
                  </div>
                ))}
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--gradient-button)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 18 }}>⚡</span>
                </div>
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                Analyzing financial data…
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Querying HR, Technology & Services dashboards
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {state.view === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
            >
              <Landing onSubmit={handleQuery} />
            </motion.div>
          ) : state.view === 'results' && state.currentResult ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
            >
              <Results
                result={state.currentResult}
                onBack={handleBack}
                onNewQuery={(q, m) => handleQuery(q, m ?? state.currentMode, state.pinnedDomains)}
                onCompare={handleCompare}
                backLabel={resultHistory.length > 0 ? '← Back to Chat' : undefined}
              />
            </motion.div>
          ) : state.view === 'compare' && state.compareLeft ? (
            <motion.div
              key="compare"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
            >
              <Compare
                leftResult={state.compareLeft}
                rightResult={state.compareRight}
                onBack={handleBack}
                onCloseRight={handleCloseCompareRight}
                onNewQuery={handleCompareNewQuery}
                sessionHistory={state.sessionHistory}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
