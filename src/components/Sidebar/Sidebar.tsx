import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronLeft, ChevronRight, Clock, Sparkles, Columns } from 'lucide-react';
import type { QueryResult, SessionGroup } from '../../types';
import { MOCK_RESULTS } from '../../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: SessionGroup[];
  onSessionClick: (result: QueryResult) => void;
  onSessionCompare: (result: QueryResult) => void;
}

export default function Sidebar({ isOpen, onToggle, sessions, onSessionClick, onSessionCompare }: SidebarProps) {
  return (
    <motion.aside
      onClick={onToggle}
      animate={{ width: isOpen ? 260 : 56 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'relative',
        zIndex: 20,
        height: '100%',
        background: 'var(--navy-900)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Logo area */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 64,
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'var(--gradient-button)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Sparkles size={16} color="#fff" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
              }}
            >
              Constellation <span style={{ fontSize: 9, opacity: 0.6, fontWeight: 500 }}>by FinAI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Session History */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {sessions.map((group) => (
                <div key={group.label} style={{ marginBottom: 16 }}>
                  <div style={{
                    padding: '4px 16px 8px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    {group.label}
                  </div>
                  {group.sessions.map((session, idx) => {
                    const isFollowUp = session.isFollowUp;
                    const isLastChild = idx === group.sessions.length - 1 || group.sessions[idx + 1].sessionThreadId !== session.sessionThreadId;
                    
                    return (
                      <motion.button
                        key={session.id}
                        onClick={() => {
                          onSessionClick(MOCK_RESULTS[session.resultId]);
                        }}
                        initial={{ backgroundColor: 'rgba(255,255,255,0)' }}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                        transition={{ duration: 0.2 }}
                        style={{
                          width: '100%',
                          border: 'none',
                          cursor: 'pointer',
                          padding: `8px 16px 8px ${isFollowUp ? '32px' : '16px'}`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          textAlign: 'left',
                          borderRadius: 0,
                          position: 'relative',
                        }}
                      >
                        {isFollowUp && (
                          <div style={{
                            position: 'absolute',
                            left: 18,
                            top: -10,
                            bottom: isLastChild ? 'auto' : -10,
                            height: isLastChild ? 24 : '100%',
                            width: 10,
                            borderLeft: '1px solid rgba(255,255,255,0.2)',
                            borderBottom: isLastChild ? '1px solid rgba(255,255,255,0.2)' : 'none',
                            borderBottomLeftRadius: isLastChild ? 6 : 0,
                          }} />
                        )}
                        {!isFollowUp ? (
                          <MessageSquare size={13} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 13, flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: isFollowUp ? '#94a3b8' : '#e2e8f0', lineHeight: 1.4, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {session.query}
                          </p>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={10} />
                            {session.timestamp}
                          </p>
                        </div>
                        <div
                          className="compare-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSessionCompare(MOCK_RESULTS[session.resultId]);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 6, padding: 4, cursor: 'pointer', color: 'var(--sidebar-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0
                          }}
                          title="Open in Compare Mode"
                          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.15)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                          <Columns size={12} />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed icons */}
        {!isOpen && (
          <div style={{ padding: '8px 0' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ padding: '10px 0', display: 'flex', justifyContent: 'center' }}>
                <MessageSquare size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          margin: 12,
          padding: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
        }}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </motion.aside>
  );
}
