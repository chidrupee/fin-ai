import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import type { QueryResult, ChatMessage, StrategyMode } from '../../../types';
import { detectDeepDive } from '../utils';

export default function ChatLayout({ result, onNewQuery }: { result: QueryResult; onNewQuery: (q: string, mode?: StrategyMode) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(result.chatMessages || []);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const CANNED: Record<string, string> = {
    default: "Based on your current data context, the trend is consistent with previous periods. The primary drivers remain unchanged — I'd recommend checking the regional breakdown for more granularity.",
    emea: "EMEA growth has slowed to +1.8% this quarter — the weakest in six periods. Germany and UK financial services are the main drag points. Renewal delays in UK FS account for ~$4.2M of the slowdown.",
    service: "Services revenue growth of +8.2% is being driven by Managed Services (+14.1% QoQ) offsetting a decline in one-off Implementation projects (-3.2%). The shift to recurring SaaS-aligned contracts is the key structural driver.",
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const q = input.trim();
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', content: q, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const { isDeepDive, mode } = detectDeepDive(q);
    if (isDeepDive) {
      setTimeout(() => onNewQuery(q, mode), 600);
      return;
    }
    setTyping(true);
    setTimeout(() => {
      const lower = q.toLowerCase();
      const content = lower.includes('emea') ? CANNED.emea : lower.includes('service') ? CANNED.service : CANNED.default;
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`, role: 'ai', content,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: ['Delve deeper into this', 'Generate charts for this', 'Compare to last quarter'],
      };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 900);
  };

  const renderContent = (content: string) =>
    content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>);

  return (
    <div className="no-print" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--canvas-bg)' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 820, width: '100%', margin: '0 auto' }}>
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            {msg.role === 'ai' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 14 }}>⚡</span>
              </div>
            )}
            <div style={{ maxWidth: '78%' }}>
              <div style={{
                background: msg.role === 'ai' ? 'var(--surface-1)' : 'var(--gradient-button)',
                border: msg.role === 'ai' ? '1px solid var(--border-light)' : 'none',
                borderRadius: msg.role === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                padding: '12px 16px', fontSize: 13.5, lineHeight: 1.65,
                color: msg.role === 'ai' ? 'var(--text-primary)' : '#fff',
                boxShadow: '0 2px 10px rgba(10,22,40,0.07)',
              }}>
                {renderContent(msg.content)}
              </div>
              {msg.suggestedFollowUps && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {msg.suggestedFollowUps.map((f, i) => {
                    const { isDeepDive, mode } = detectDeepDive(f);
                    return (
                      <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => isDeepDive ? onNewQuery(f, mode) : setInput(f)}
                        style={{
                          background: isDeepDive ? 'rgba(192,57,43,0.08)' : 'var(--surface-2)',
                          border: `1px solid ${isDeepDive ? 'rgba(192,57,43,0.25)' : 'var(--border-light)'}`,
                          borderRadius: 20, padding: '4px 11px', fontSize: 11.5,
                          color: isDeepDive ? '#c0392b' : 'var(--text-secondary)',
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {isDeepDive ? '📊 ' : ''}{f}
                      </motion.button>
                    );
                  })}
                </div>
              )}
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.timestamp}</p>
            </div>
          </motion.div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 14 }}>⚡</span></div>
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-light)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '12px 32px 16px', background: 'var(--surface-1)', borderTop: '1px solid var(--border-light)', maxWidth: 820, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--canvas-bg)', border: '1.5px solid var(--border-medium)', borderRadius: 14, padding: '8px 8px 8px 16px' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask a follow-up… or type 'delve deeper' to get charts"
            rows={1} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13.5, fontFamily: 'Inter, sans-serif', resize: 'none', lineHeight: 1.5, maxHeight: 100, overflow: 'auto' }}
            onFocus={e => { e.currentTarget.rows = 3; }} onBlur={e => { e.currentTarget.rows = 1; }}
          />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSend} disabled={!input.trim()}
            style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() ? 'var(--gradient-button)' : 'var(--surface-3)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Send size={15} color={input.trim() ? '#fff' : 'var(--text-muted)'} />
          </motion.button>
        </div>
        <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>Type <strong>'delve deeper'</strong> or <strong>'generate charts'</strong> to switch to a full visual or analytical view</p>
      </div>
    </div>
  );
}
