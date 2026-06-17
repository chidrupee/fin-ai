import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, FileText, Link, X } from 'lucide-react';

export default function ShareButton() {
  const [open, setOpen] = useState(false);

  const options = [
    { icon: <FileText size={14} />, label: 'Export as PDF', action: () => window.print() },
    { icon: <Link size={14} />, label: 'Copy share link', action: () => navigator.clipboard.writeText(window.location.href) },
  ];

  return (
    <div className="no-print" style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 50 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'absolute', bottom: 56, right: 0,
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(10,22,40,0.15)',
              minWidth: 180,
            }}
          >
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => { opt.action(); setOpen(false); }}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  borderBottom: i < options.length - 1 ? '1px solid var(--border-light)' : 'none',
                  padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13,
                  fontFamily: 'Inter, sans-serif', transition: 'background 0.2s', textAlign: 'left',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
              >
                <span style={{ color: '#c0392b' }}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--gradient-button)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(192,57,43,0.35)', color: '#fff',
        }}
      >
        {open ? <X size={18} /> : <Share2 size={18} />}
      </motion.button>
    </div>
  );
}
