import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, BarChart2, Brain, Table2, Code2 } from 'lucide-react';
import type { QueryResult, ChatMessage, StrategyMode } from '../../../types';
import ChartRenderer from '../components/ChartRenderer';

export default function InvestigativeLayout({ result, onNewQuery }: { result: QueryResult; onNewQuery: (q: string, mode?: StrategyMode) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(result.chatMessages || []);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'insights' | 'table' | 'sql'>('chart');

  // Sync when result changes
  useEffect(() => { 
    setMessages(result.chatMessages || []);
    
    // Automatically open drawer if the result has charts or sql
    if ((result.charts && result.charts.length > 0) || result.sqlCode) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [result.id]);
  
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`, role: 'user', content: q,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setDrawerOpen(false);

    // Mock an AI response
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      onNewQuery(q, 'investigative');
    }, 800);
  };

  const renderContent = (content: string) =>
    content.split('**').map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );

  const TABS = [
    { id: 'chart', label: 'Chart', icon: BarChart2 },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'table', label: 'Table', icon: Table2 },
    { id: 'sql', label: 'SQL Code', icon: Code2 }
  ] as const;

  return (
    <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
      
      {/* LEFT: Chat Area */}
      <div style={{ 
        flex: 1, display: 'flex', flexDirection: 'column', 
        background: 'var(--canvas-bg)', transition: 'margin-right 0.3s ease-in-out',
        marginRight: drawerOpen ? '50%' : 0
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
              >
                {msg.role === 'ai' && (
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-button)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(192,57,43,0.3)',
                  }}>
                    <span style={{ fontSize: 16 }}>🕵️</span>
                  </div>
                )}

                <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{
                    background: msg.role === 'ai' ? 'var(--surface-1)' : 'var(--gradient-button)',
                    border: msg.role === 'ai' ? '1px solid var(--border-light)' : 'none',
                    borderRadius: msg.role === 'ai' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                    padding: '13px 17px', fontSize: 13.5, lineHeight: 1.7,
                    color: msg.role === 'ai' ? 'var(--text-primary)' : '#fff',
                    boxShadow: msg.role === 'ai' ? '0 2px 12px rgba(10,22,40,0.06)' : '0 4px 14px rgba(192,57,43,0.25)',
                  }}>
                    {renderContent(msg.content)}
                  </div>
                  <p style={{
                    fontSize: 10, color: 'var(--text-muted)', textAlign: msg.role === 'user' ? 'right' : 'left',
                    paddingLeft: msg.role === 'ai' ? 4 : 0,
                  }}>{msg.timestamp}</p>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {typing && (
                <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 16 }}>🕵️</span>
                  </div>
                  <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-light)', borderRadius: '4px 18px 18px 18px', padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-muted)' }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div style={{ borderTop: '1px solid var(--border-light)', background: 'var(--surface-1)', padding: '12px 24px 16px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--canvas-bg)', border: '1.5px solid var(--border-medium)', borderRadius: 16, padding: '8px 8px 8px 16px' }}>
            <textarea
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              placeholder="Ask an investigative follow-up..." rows={1}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13.5, fontFamily: 'Inter, sans-serif', resize: 'none', lineHeight: 1.55, maxHeight: 100, overflow: 'auto' }}
              onFocus={e => { e.currentTarget.rows = 3; }} onBlur={e => { e.currentTarget.rows = 1; }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSend} disabled={!input.trim()}
              style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() ? 'var(--gradient-button)' : 'var(--surface-2)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s', boxShadow: input.trim() ? '0 2px 8px rgba(192,57,43,0.25)' : 'none' }}
            >
              <Send size={15} color={input.trim() ? '#fff' : 'var(--text-muted)'} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* RIGHT: Sliding Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: '100%', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}
            exit={{ x: '100%', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%',
              background: 'var(--surface-1)', borderLeft: '1px solid var(--border-light)',
              display: 'flex', flexDirection: 'column', zIndex: 50
            }}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Investigation Details</h3>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: 'var(--surface-2)', padding: '0 16px' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: activeTab === tab.id ? '2px solid #c0392b' : '2px solid transparent',
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: activeTab === tab.id ? 600 : 500, fontSize: 12, transition: 'all 0.2s',
                  }}
                >
                  <tab.icon size={14} color={activeTab === tab.id ? '#c0392b' : 'currentColor'} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {activeTab === 'chart' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {result.charts?.map((chart, i) => (
                    <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 16 }}>
                      <ChartRenderer chart={chart} height={250} />
                    </div>
                  )) || <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No charts available.</p>}
                </div>
              )}

              {activeTab === 'insights' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 20 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: '#e74c3c' }}>Key Findings</h4>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                      {renderContent(result.narrative?.findings || 'No findings available.')}
                    </p>
                  </div>
                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 20 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: '#f59e0b' }}>Primary Drivers</h4>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                      {renderContent(result.narrative?.drivers || 'No drivers available.')}
                    </p>
                  </div>
                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 20 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: '#10b981' }}>Recommendations</h4>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                      {renderContent(result.narrative?.improvements || 'No recommendations available.')}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'table' && (
                <div style={{ border: '1px solid var(--border-light)', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-3)', color: 'var(--text-muted)' }}>
                        {result.spreadsheetData?.columns.map((col, i) => (
                          <th key={i} style={{ padding: '12px 16px', fontWeight: 600, borderBottom: '1px solid var(--border-medium)' }}>
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.spreadsheetData?.rows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          {result.spreadsheetData?.columns.map((col, j) => (
                            <td key={j} style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                              {col.type === 'currency' ? `$${Number(row[col.key]).toLocaleString()}`
                                : col.type === 'percent' ? `${row[col.key]}%`
                                : row[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!result.spreadsheetData && <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>No table data available.</div>}
                </div>
              )}

              {activeTab === 'sql' && (
                <div style={{ 
                  background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, 
                  padding: 16, overflowX: 'auto', color: '#c9d1d9', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5 
                }}>
                  <pre style={{ margin: 0 }}>
                    <code>
                      {result.sqlCode || '-- No SQL code available for this query.'}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
