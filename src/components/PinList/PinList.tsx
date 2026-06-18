import { motion, AnimatePresence } from 'framer-motion';
import { Pin, PinOff } from 'lucide-react';
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
        padding: '6px 10px', borderRadius: 8,
        width: 'calc(20% - 7px)', minWidth: 140,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', paddingLeft: 4 }}>
        Data Context
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, width: '100%' }}>
        <AnimatePresence>
          {pinned.map((item) => renderItem(item, true))}
          {unpinned.map((item) => renderItem(item, false))}
        </AnimatePresence>
      </div>
    </div>
  );
}
