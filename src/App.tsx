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

  const handleQuery = (query: string, mode: StrategyMode, pinnedIds: string[]) => {
    setIsLoading(true);
    setTimeout(() => {
      const result = findResult(query, mode);
      const resultWithMode = { ...result, query, mode };
      const threadId = state.currentSessionThreadId || `thread-${Date.now()}`;
      setState((prev) => ({
        ...prev,
        view: 'results',
        currentQuery: query,
        currentMode: mode,
        pinnedDomains: pinnedIds,
        currentResult: resultWithMode,
        currentSessionThreadId: threadId,
      }));
      setIsLoading(false);
    }, 1400);
  };

  const handleSessionClick = (result: QueryResult) => {
    setState((prev) => ({
      ...prev,
      view: 'results',
      currentQuery: result.query,
      currentMode: result.mode,
      currentResult: result,
      currentSessionThreadId: undefined,
    }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, view: 'landing', currentResult: null, compareLeft: null, compareRight: null, currentSessionThreadId: undefined }));
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

  return (
    <div data-theme={isDark ? 'dark' : undefined} style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', background: 'var(--canvas-bg)', color: 'var(--text-primary)', transition: 'background 0.3s ease' }}>
      <AnimatedBackground isDark={isDark} />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        sessions={state.sessionHistory}
        onSessionClick={handleSessionClick}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <TopBar
          query={state.currentQuery}
          isResultsView={state.view === 'results'}
          isDark={isDark}
          onToggleDark={() => setIsDark(d => !d)}
        />

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
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.8, delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '2px solid #c0392b',
                    }}
                  />
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
