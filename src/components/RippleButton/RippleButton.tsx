import { useState, useRef } from 'react';
import type { MouseEvent, ButtonHTMLAttributes } from 'react';

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'ghost';
}

interface RippleCoord { x: number; y: number; id: number; }

export default function RippleButton({ children, onClick, className, size = 'md', variant = 'primary', style, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = useState<RippleCoord[]>([]);
  const counter = useRef(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = counter.current++;
    setRipples((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    onClick?.(e);
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '8px 18px', fontSize: 13, borderRadius: 10 },
    md: { padding: '12px 28px', fontSize: 14, borderRadius: 12 },
    lg: { padding: '16px 40px', fontSize: 16, borderRadius: 14 },
  };

  const baseStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'var(--gradient-button)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 24px rgba(192,57,43,0.25)',
          ...sizeStyles[size],
          ...style,
        }
      : {
          background: 'rgba(255,255,255,0.05)',
          color: 'var(--text-secondary)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          ...sizeStyles[size],
          ...style,
        };

  return (
    <button
      className={className}
      style={baseStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 32px rgba(231,76,60,0.45)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
        } else {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(192,57,43,0.25)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        } else {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
        }
      }}
      {...props}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: 'rippleEffect 0.7s linear forwards',
          }}
        />
      ))}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}
