import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, ChevronLeft, ChevronRight, ChevronDown,
  Clock, Sparkles, Columns, Home,
} from 'lucide-react';
import type { QueryResult, SessionGroup } from '../../types';
import { MOCK_RESULTS } from '../../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: SessionGroup[];
  onSessionClick: (result: QueryResult) => void;
  onSessionCompare: (result: QueryResult) => void;
  onHome: () => void;
}

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'visual':      return '📊';
    case 'analytical':  return '🧠';
    case 'spreadsheet': return '📋';
    case 'chat':        return '🗨️';
    default:            return '🗨️';
  }
};

const getModeLabel = (mode: string) => {
  switch (mode) {
    case 'visual':      return 'Visual';
    case 'analytical':  return 'Analysis';
    case 'spreadsheet': return 'Table';
    default:            return 'Chat';
  }
};

export default function Sidebar({ isOpen, onToggle, sessions, onSessionClick, onSessionCompare, onHome }: SidebarProps) {
  // Track which session groups are collapsed — all open by default
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <motion.aside
      onClick={onToggle}
      animate={{ width: isOpen ? 260 : 56 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'relative', zIndex: 20, height: '100%',
        background: 'var(--navy-900)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 12, minHeight: 64,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--gradient-button)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Sparkles size={16} color="#fff" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
              style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}
            >
              Constellation <span style={{ fontSize: 9, opacity: 0.6, fontWeight: 500 }}>by FinAI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Home button */}
      <div style={{ padding: '16px 12px 0' }}>
        <button
          onClick={e => { e.stopPropagation(); onHome(); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
            cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
        >
          <Home size={16} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                Home
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Session history */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            >
              {sessions.map(group => {
                const isCollapsed = !!collapsedGroups[group.label];

                return (
                  <div key={group.label} style={{ marginBottom: 4 }}>
                    {/* Group header — clickable to collapse */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleGroup(group.label); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 16px 6px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>
                        {group.label}
                        <span style={{ marginLeft: 6, fontSize: 9, opacity: 0.7, fontWeight: 500 }}>
                          ({group.sessions.length})
                        </span>
                      </span>
                      <motion.div
                        animate={{ rotate: isCollapsed ? -90 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <ChevronDown size={12} color="var(--text-muted)" />
                      </motion.div>
                    </button>

                    {/* Session items — animated collapse */}
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          key="items"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          {group.sessions.map((session, idx) => {
                            const isFollowUp = session.isFollowUp;
                            const nextSession = group.sessions[idx + 1];
                            const isLastChild = idx === group.sessions.length - 1
                              || (nextSession && nextSession.sessionThreadId !== session.sessionThreadId);
                            const showViewAnswer = session.mode !== 'chat';

                            return (
                              <motion.button
                                key={session.id}
                                onClick={e => { e.stopPropagation(); onSessionClick(MOCK_RESULTS[session.resultId]); }}
                                initial={{ backgroundColor: 'rgba(255,255,255,0)' }}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                                transition={{ duration: 0.15 }}
                                style={{
                                  width: '100%', border: 'none', cursor: 'pointer',
                                  padding: `8px 16px 10px ${isFollowUp ? '32px' : '16px'}`,
                                  display: 'flex', alignItems: 'flex-start', gap: 8,
                                  textAlign: 'left', borderRadius: 0, position: 'relative',
                                }}
                              >
                                {/* Thread line */}
                                {isFollowUp && (
                                  <div style={{
                                    position: 'absolute', left: 18, top: -10,
                                    height: isLastChild ? 24 : '100%',
                                    width: 10,
                                    borderLeft: '1px solid rgba(255,255,255,0.15)',
                                    borderBottom: isLastChild ? '1px solid rgba(255,255,255,0.15)' : 'none',
                                    borderBottomLeftRadius: isLastChild ? 6 : 0,
                                  }} />
                                )}

                                {!isFollowUp
                                  ? <MessageSquare size={13} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                                  : <div style={{ width: 13, flexShrink: 0 }} />
                                }

                                <div style={{ flex: 1, minWidth: 0, paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
                                  <p style={{ fontSize: 12.5, fontWeight: 500, color: isFollowUp ? '#94a3b8' : '#e2e8f0', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                    {session.query}
                                  </p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(255,255,255,0.09)', padding: '2px 6px', borderRadius: 5, fontSize: 9, fontWeight: 600, color: '#cbd5e1' }}>
                                      <span>{getModeIcon(session.mode)}</span>
                                      {getModeLabel(session.mode)}
                                    </div>
                                    {session.autoDetectedMode && (
                                      <div style={{ background: 'rgba(255,183,77,0.15)', color: '#ffb74d', padding: '2px 5px', borderRadius: 5, fontSize: 9, fontWeight: 700 }}>
                                        ⚡ Auto
                                      </div>
                                    )}
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
                                      <Clock size={9} /> {session.timestamp}
                                    </div>
                                  </div>
                                  {showViewAnswer && (
                                    <div style={{ fontSize: 10, fontWeight: 600, color: '#3b82f6' }}>→ View answer</div>
                                  )}
                                </div>

                                {/* Compare button */}
                                <div
                                  onClick={e => { e.stopPropagation(); onSessionCompare(MOCK_RESULTS[session.resultId]); }}
                                  style={{
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 6, padding: 4, cursor: 'pointer', color: 'var(--sidebar-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.15s', flexShrink: 0,
                                  }}
                                  title="Open in Compare Mode"
                                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.15)'}
                                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'}
                                >
                                  <Columns size={11} />
                                </div>
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed icons */}
        {!isOpen && (
          <div style={{ padding: '8px 0' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ padding: '10px 0', display: 'flex', justifyContent: 'center' }}>
                <MessageSquare size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar toggle button */}
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        style={{
          margin: 12, padding: 8,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </motion.aside>
  );
}
