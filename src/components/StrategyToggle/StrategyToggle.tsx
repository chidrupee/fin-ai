import { motion } from 'framer-motion';
import { BarChart2, Brain } from 'lucide-react';
import type { StrategyMode } from '../../types';

interface StrategyToggleProps {
  mode: StrategyMode;
  onChange: (mode: StrategyMode) => void;
}

const OPTIONS: Array<{ id: StrategyMode; label: string; description: string; icon: React.ReactNode }> = [
  {
    id: 'analytical',
    label: 'Analytical',
    description: 'Deep text + process flowcharts',
    icon: <Brain size={15} />,
  },
  {
    id: 'visual',
    label: 'Visual',
    description: 'Multiple data visualizations',
    icon: <BarChart2 size={15} />,
  },
];

export default function StrategyToggle({ mode, onChange }: StrategyToggleProps) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {OPTIONS.map((opt) => {
        const isActive = mode === opt.id;
        return (
          <motion.button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: isActive ? 'var(--gradient-button)' : 'rgba(255,255,255,0.04)',
              border: isActive ? '1px solid rgba(192,57,43,0.4)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 40,
              padding: '8px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.3s ease',
              boxShadow: isActive ? '0 4px 20px rgba(192,57,43,0.3)' : 'none',
            }}
          >
            <span style={{ color: isActive ? '#fff' : 'var(--text-muted)' }}>{opt.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#fff' : 'var(--text-secondary)', lineHeight: 1.2 }}>
                {opt.label}
              </p>
              <p style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)', lineHeight: 1.3 }}>
                {opt.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
