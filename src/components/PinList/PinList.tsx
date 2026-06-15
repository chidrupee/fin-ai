import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, PinOff, ChevronDown, ChevronUp } from 'lucide-react';
import type { DataDomain } from '../../types';

interface PinListProps {
  domains: DataDomain[];
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
}

const DEPT_COLORS: Record<string, string> = {
  HR: '#3b82f6',
  Technology: '#10b981',
  Services: '#f59e0b',
  Finance: '#8b5cf6',
};

export default function PinList({ domains, pinnedIds, onTogglePin }: PinListProps) {
  const [expanded, setExpanded] = useState(true);
  const pinned = domains.filter((d) => pinnedIds.includes(d.id));
  const unpinned = domains.filter((d) => !pinnedIds.includes(d.id));

  const renderItem = (item: DataDomain, isPinned: boolean) => (
    <motion.div
      layout
      key={item.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', marginBottom: 4, borderRadius: 8,
        border: `1px solid ${isPinned ? 'rgba(192,57,43,0.3)' : 'var(--border-light)'}`,
        background: isPinned ? 'rgba(192,57,43,0.05)' : 'var(--surface-2)',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: DEPT_COLORS[item.department] || '#888', flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3 }}>{item.name}</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.department}</p>
        </div>
      </div>
      <button
        onClick={() => onTogglePin(item.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: isPinned ? '#c0392b' : 'var(--text-muted)',
          padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = isPinned ? '#c0392b' : 'var(--text-muted)'; }}
      >
        {isPinned ? <PinOff size={13} /> : <Pin size={13} />}
      </button>
    </motion.div>
  );

  return (
    <div style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--border-light)',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 1px 8px rgba(10,22,40,0.06)',
      width: '100%',
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid var(--border-light)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Data Context
          </span>
          {pinnedIds.length > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              background: 'var(--gradient-button)', color: '#fff',
              borderRadius: 10, padding: '1px 7px',
            }}>
              {pinnedIds.length} pinned
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={13} color="var(--text-muted)" /> : <ChevronDown size={13} color="var(--text-muted)" />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: 10 }}>
              {pinned.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: '#c0392b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, paddingLeft: 4 }}>
                    ↑ Pinned
                  </p>
                  <AnimatePresence>{pinned.map((item) => renderItem(item, true))}</AnimatePresence>
                </div>
              )}
              <div>
                <p style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, paddingLeft: 4 }}>
                  Available
                </p>
                <AnimatePresence>{unpinned.map((item) => renderItem(item, false))}</AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
