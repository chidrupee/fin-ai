import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, BarChart2, Table2, Brain, MessageCircle, ArrowRight, LayoutGrid, List } from 'lucide-react';
import type { QueryResult, ChatMessage, StrategyMode } from '../../../types';
import { detectDeepDive } from '../utils';
import ChartRenderer from '../components/ChartRenderer';

const MODE_META: Record<StrategyMode, { label: string; color: string; colorRgb: string; Icon: React.ElementType }> = {
  visual:      { label: 'View Charts',    color: '#10b981', colorRgb: '16,185,129',  Icon: BarChart2    },
  spreadsheet: { label: 'View Table',     color: '#0ea5e9', colorRgb: '14,165,233',  Icon: Table2       },
  analytical:  { label: 'Deep Analysis',  color: '#c0392b', colorRgb: '192,57,43',   Icon: Brain        },
  chat:        { label: 'Ask Follow-up',  color: '#6366f1', colorRgb: '99,102,241',  Icon: MessageCircle },
  investigative: { label: 'Investigate', color: '#8b5cf6', colorRgb: '139,92,246', Icon: Brain },
};

function SuggestedFollowUp({
  text,
  onRoute,
  onFill,
}: {
  text: string;
  onRoute: (q: string, mode: StrategyMode) => void;
  onFill: (q: string) => void;
}) {
  const { isDeepDive, mode } = detectDeepDive(text);
  const meta = isDeepDive ? MODE_META[mode] : null;
  const Icon = meta?.Icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => isDeepDive ? onRoute(text, mode) : onFill(text)}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        background: isDeepDive ? `rgba(${meta!.colorRgb}, 0.07)` : 'var(--surface-2)',
        border: `1.5px solid ${isDeepDive ? `rgba(${meta!.colorRgb}, 0.3)` : 'var(--border-light)'}`,
        borderRadius: 20, padding: '6px 14px',
        fontSize: 12, fontWeight: 600,
        color: isDeepDive ? meta!.color : 'var(--text-secondary)',
        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (isDeepDive) {
          e.currentTarget.style.background = `rgba(${meta!.colorRgb}, 0.14)`;
          e.currentTarget.style.borderColor = meta!.color;
        } else {
          e.currentTarget.style.background = 'var(--surface-3)';
        }
      }}
      onMouseLeave={e => {
        if (isDeepDive) {
          e.currentTarget.style.background = `rgba(${meta!.colorRgb}, 0.07)`;
          e.currentTarget.style.borderColor = `rgba(${meta!.colorRgb}, 0.3)`;
        } else {
          e.currentTarget.style.background = 'var(--surface-2)';
        }
      }}
    >
      {Icon && <Icon size={12} />}
      {text}
      {isDeepDive && <ArrowRight size={11} style={{ marginLeft: 2, opacity: 0.7 }} />}
    </motion.button>
  );
}

const CANNED: Record<string, string> = {
  default: "Based on your current data context, the trend is consistent with previous periods. The primary drivers remain unchanged.",
  emea: "EMEA growth has slowed to +1.8% this quarter. Germany and UK financial services are the main drag points. Renewal delays in UK FS account for ~$4.2M of the slowdown.",
  service: "Services revenue growth of +8.2% is driven by Managed Services (+14.1% QoQ) offsetting a decline in one-off Implementation projects (-3.2%).",
};

const renderContent = (content: string) =>
  content.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );

export default function ChatLayout({ result, onNewQuery }: { result: QueryResult; onNewQuery: (q: string, mode?: StrategyMode) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(result.chatMessages || []);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isStacked, setIsStacked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync when result changes (navigating back to chat)
  useEffect(() => { setMessages(result.chatMessages || []); }, [result.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = (overrideText?: string) => {
    const q = (overrideText ?? input).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`, role: 'user', content: q,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Always check if this query should route to a different mode
    const { isDeepDive, mode } = detectDeepDive(q);
    if (isDeepDive) {
      // Brief typing indicator then navigate
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        onNewQuery(q, mode);
      }, 600);
      return;
    }

    // Stay in chat — produce canned contextual response
    setTyping(true);
    setTimeout(() => {
      const lower = q.toLowerCase();
      const content = lower.includes('emea') ? CANNED.emea
        : lower.includes('service') ? CANNED.service
        : CANNED.default;
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`, role: 'ai', content,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'Break this down by region and show me the charts',
          'Give me a table of department budget vs actuals',
          'Analysis: why is the EMEA margin declining?',
        ],
      };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="no-print" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--canvas-bg)' }}>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ maxWidth: 960, width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
            >
              {/* AI avatar */}
              {msg.role === 'ai' && (
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--gradient-button)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, boxShadow: '0 2px 8px rgba(192,57,43,0.3)',
                }}>
                  <span style={{ fontSize: 16 }}>⚡</span>
                </div>
              )}

              <div style={{ maxWidth: (msg.insights || msg.chart) ? '100%' : '85%', width: (msg.insights || msg.chart) ? '100%' : 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Bubble */}
                <div style={{
                  background: msg.role === 'ai' ? 'var(--surface-1)' : 'var(--gradient-button)',
                  border: msg.role === 'ai' ? '1px solid var(--border-light)' : 'none',
                  borderRadius: msg.role === 'ai' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                  padding: '13px 17px', fontSize: 13.5, lineHeight: 1.7,
                  color: msg.role === 'ai' ? 'var(--text-primary)' : '#fff',
                  boxShadow: msg.role === 'ai'
                    ? '0 2px 12px rgba(10,22,40,0.06)'
                    : '0 4px 14px rgba(192,57,43,0.25)',
                }}>
                  {renderContent(msg.content)}
                  
                  {/* Rich Content: Insights & Chart */}
                  {(msg.insights || msg.chart) && (
                    <div style={{
                      marginTop: 16, paddingTop: 16,
                      borderTop: '1px solid var(--border-light)',
                      display: 'flex', flexDirection: 'column', gap: 12
                    }}>
                      {/* Controls */}
                      {(msg.insights && msg.chart) && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                          <button 
                            onClick={() => setIsStacked(false)}
                            style={{ background: !isStacked ? 'var(--surface-3)' : 'transparent', border: 'none', borderRadius: 4, padding: 4, cursor: 'pointer', color: !isStacked ? 'var(--text-primary)' : 'var(--text-muted)', display: 'flex', transition: 'all 0.2s' }}
                            title="Side-by-side view"
                          >
                            <LayoutGrid size={14} />
                          </button>
                          <button 
                            onClick={() => setIsStacked(true)}
                            style={{ background: isStacked ? 'var(--surface-3)' : 'transparent', border: 'none', borderRadius: 4, padding: 4, cursor: 'pointer', color: isStacked ? 'var(--text-primary)' : 'var(--text-muted)', display: 'flex', transition: 'all 0.2s' }}
                            title="Stacked view"
                          >
                            <List size={14} />
                          </button>
                        </div>
                      )}

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: (msg.insights && msg.chart && !isStacked) ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
                        gap: 16,
                        alignItems: 'stretch'
                      }}>
                      {msg.insights && (
                        <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: 16, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <h4 style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Key Insights</h4>
                          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {msg.insights.map((insight, idx) => (
                              <li key={idx} style={{ lineHeight: 1.5 }}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {msg.chart && (
                        <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: 16, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                           <ChartRenderer chart={msg.chart} height={180} />
                        </div>
                      )}
                    </div>
                    </div>
                  )}
                </div>

                {/* Suggested follow-ups — these are mode navigation links */}
                {msg.suggestedFollowUps && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingLeft: 4 }}>
                    {msg.suggestedFollowUps.map((f, i) => (
                      <SuggestedFollowUp
                        key={i}
                        text={f}
                        onRoute={(q, mode) => onNewQuery(q, mode)}
                        onFill={setInput}
                      />
                    ))}
                  </div>
                )}

                <p style={{
                  fontSize: 10, color: 'var(--text-muted)',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  paddingLeft: msg.role === 'ai' ? 4 : 0,
                }}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-button)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: 16 }}>⚡</span>
                </div>
                <div style={{
                  background: 'var(--surface-1)', border: '1px solid var(--border-light)',
                  borderRadius: '4px 18px 18px 18px', padding: '14px 18px',
                  display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-muted)' }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        borderTop: '1px solid var(--border-light)',
        background: 'var(--surface-1)',
        padding: '12px 24px 16px',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'flex', gap: 10, alignItems: 'flex-end',
          background: 'var(--canvas-bg)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: 16, padding: '8px 8px 8px 16px',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="Ask a follow-up… or type 'show me the charts' to switch views"
            rows={1}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: 13.5,
              fontFamily: 'Inter, sans-serif', resize: 'none', lineHeight: 1.55,
              maxHeight: 100, overflow: 'auto',
            }}
            onFocus={e => { e.currentTarget.rows = 3; }}
            onBlur={e => { e.currentTarget.rows = 1; }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend()}
            disabled={!input.trim()}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: input.trim() ? 'var(--gradient-button)' : 'var(--surface-2)',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'background 0.2s',
              boxShadow: input.trim() ? '0 2px 8px rgba(192,57,43,0.25)' : 'none',
            }}
          >
            <Send size={15} color={input.trim() ? '#fff' : 'var(--text-muted)'} />
          </motion.button>
        </div>
        <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 7, textAlign: 'center', maxWidth: 960, margin: '7px auto 0' }}>
          Suggested follow-ups will automatically switch to the right view — <strong>charts</strong>, <strong>table</strong>, or <strong>analysis</strong>
        </p>
      </div>
    </div>
  );
}
