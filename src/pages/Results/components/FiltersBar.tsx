import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Check } from 'lucide-react';

interface RecommendedPrompt {
  id: string;
  label: string;
  query: string;
}

interface FiltersBarProps {
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  recommendedPrompts?: RecommendedPrompt[];
  onNewQuery?: (query: string) => void;
}

const FILTER_OPTIONS: Record<string, string[]> = {
  Region: ['All', 'Americas', 'EMEA', 'APAC'],
  Department: ['All', 'Engineering', 'Sales', 'Product', 'Services', 'G&A'],
  Timeframe: ['Q3', 'Q2', 'Q1', 'FY2026'],
};

export default function FiltersBar({ activeFilters, onFilterChange, recommendedPrompts, onNewQuery }: FiltersBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

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
        {Object.entries(FILTER_OPTIONS).map(([filterKey, options]) => {
          const currentValue = activeFilters[filterKey] || options[0];
          const isDefault = filterKey === 'Timeframe' ? currentValue === 'Q3' : currentValue === 'All';
          const isOpen = openDropdown === filterKey;

          return (
            <div key={filterKey} style={{ position: 'relative' }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(isOpen ? null : filterKey);
                }}
                style={{
                  background: !isDefault ? 'rgba(192,57,43,0.08)' : 'var(--surface-2)', 
                  border: `1px solid ${!isDefault ? 'rgba(192,57,43,0.3)' : 'var(--border-medium)'}`,
                  borderRadius: 6, padding: '4px 10px', fontSize: 11, 
                  color: !isDefault ? '#c0392b' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {filterKey}: {currentValue} <ChevronDown size={10} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute', top: '100%', left: 0, marginTop: 4,
                      background: 'var(--surface-1)', border: '1px solid var(--border-medium)',
                      borderRadius: 8, boxShadow: '0 4px 20px rgba(10,22,40,0.15)',
                      padding: '4px', zIndex: 50, minWidth: 140
                    }}
                  >
                    {options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          onFilterChange(filterKey, opt);
                          setOpenDropdown(null);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '6px 10px', borderRadius: 4,
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          fontSize: 11, color: currentValue === opt ? '#c0392b' : 'var(--text-secondary)',
                          fontWeight: currentValue === opt ? 600 : 400, textAlign: 'left'
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        {opt}
                        {currentValue === opt && <Check size={12} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
