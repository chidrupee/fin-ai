import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Brain, MessageCircle, Table2 } from 'lucide-react';
import type { StrategyMode } from '../../types';

interface StrategyToggleProps {
  mode: StrategyMode;
  onChange: (mode: StrategyMode) => void;
}

const OPTIONS: Array<{ id: StrategyMode; label: string; description: string; icon: React.ReactNode }> = [
  { id: 'chat',         label: 'Quick Answer',  description: 'Conversational response',    icon: <MessageCircle size={14} /> },
  { id: 'spreadsheet', label: 'Data Table',     description: 'Sortable spreadsheet view',  icon: <Table2 size={14} /> },
  { id: 'visual',      label: 'Visual Charts',  description: 'Interactive dashboards',     icon: <BarChart2 size={14} /> },
  { id: 'analytical',  label: 'Deep Analysis',  description: 'Narrative + process flow',   icon: <Brain size={14} /> },
];

export default function StrategyToggle({ mode, onChange }: StrategyToggleProps) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
      {OPTIONS.map((opt) => {
        const isActive = mode === opt.id;
        return (
          <motion.button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: isActive ? 'var(--gradient-button)' : 'rgba(255,255,255,0.04)',
              border: isActive ? '1px solid rgba(192,57,43,0.4)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 40,
              padding: '7px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.3s ease',
              boxShadow: isActive ? '0 4px 20px rgba(192,57,43,0.3)' : 'none',
            }}
          >
            <span style={{ color: isActive ? '#fff' : 'var(--text-muted)' }}>{opt.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#fff' : 'var(--text-secondary)', lineHeight: 1.2 }}>
                {opt.label}
              </p>
              <p style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', lineHeight: 1.3 }}>
                {opt.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
