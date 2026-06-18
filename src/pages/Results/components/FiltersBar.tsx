import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface RecommendedPrompt {
  id: string;
  label: string;
  query: string;
}

interface FiltersBarProps {
  activeFilters: string[];
  onToggleFilter: (f: string) => void;
  recommendedPrompts?: RecommendedPrompt[];
  onNewQuery?: (query: string) => void;
}

export default function FiltersBar({ activeFilters, onToggleFilter, recommendedPrompts, onNewQuery }: FiltersBarProps) {
  const filters = ['Region: All', 'Department: All', 'Timeframe: Q3'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', borderBottom: '1px solid var(--border-light)',
        background: 'var(--surface-1)', flexShrink: 0,
      }}
    >
      {/* Left: Filters */}
      <div style={{ display: 'flex', gap: 12 }}>
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
      </div>

      {/* Right: Next Steps */}
      {recommendedPrompts && recommendedPrompts.length > 0 && onNewQuery && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="no-print">
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: 4 }}>
            Next Steps:
          </span>
          {recommendedPrompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => onNewQuery(prompt.query)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'transparent', border: '1px solid var(--border-light)',
                padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                color: 'var(--text-primary)', fontSize: 10, fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-2)';
                e.currentTarget.style.borderColor = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              {prompt.label}
              <ArrowRight size={10} color="var(--text-muted)" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
