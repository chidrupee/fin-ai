import { Bell, User, Zap, Sun, Moon } from 'lucide-react';

interface TopBarProps {
  query?: string;
  isResultsView?: boolean;
  isDark?: boolean;
  onToggleDark?: () => void;
}

export default function TopBar({ query, isResultsView, isDark, onToggleDark }: TopBarProps) {
  return (
    <header style={{
      height: 56,
      background: 'var(--navy-900)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
    }}>
      {/* Ombré accent line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'var(--gradient-button)',
        opacity: 0.6,
      }} />

      {/* Left: brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Zap size={16} style={{ color: '#e74c3c' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          FinAI
        </span>
      </div>

      {/* Center: active query breadcrumb */}
      {isResultsView && query && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Analyzing:</span>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--sidebar-secondary)',
            background: 'rgba(255,255,255,0.05)',
            padding: '3px 12px',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            maxWidth: 480,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {query}
          </span>
        </div>
      )}

      {!isResultsView && <div style={{ flex: 1 }} />}

      {/* Right: user controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--text-muted)',
          background: 'rgba(192,57,43,0.12)',
          border: '1px solid rgba(192,57,43,0.25)',
          borderRadius: 12,
          padding: '3px 10px',
          letterSpacing: '0.02em',
        }}>
          EXECUTIVE
        </div>
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            cursor: 'pointer',
            color: isDark ? '#f59e0b' : 'var(--text-muted)',
            padding: '5px 7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
          <Bell size={16} />
        </button>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--gradient-button)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <User size={15} color="#fff" />
        </div>
      </div>
    </header>
  );
}
