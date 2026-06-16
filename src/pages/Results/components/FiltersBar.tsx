import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FiltersBar({ activeFilters, onToggleFilter }: { activeFilters: string[]; onToggleFilter: (f: string) => void }) {
  const filters = ['Region: All', 'Department: All', 'Timeframe: Q3'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      style={{
        display: 'flex', gap: 12, padding: '10px 20px',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--surface-1)', flexShrink: 0,
      }}
    >
      {filters.map((filter, i) => {
        const isActive = activeFilters.includes(filter);
        return (
          <button 
            key={i} 
            onClick={() => onToggleFilter(filter)}
            style={{
              background: isActive ? 'rgba(192,57,43,0.08)' : 'var(--surface-2)', 
              border: `1px solid ${isActive ? 'rgba(192,57,43,0.3)' : 'var(--border-medium)'}`,
              borderRadius: 6, padding: '4px 10px', fontSize: 11, 
              color: isActive ? '#c0392b' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {filter} <ChevronDown size={10} />
          </button>
        );
      })}
    </motion.div>
  );
}
