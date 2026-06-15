import { ExternalLink, Clock, Building2 } from 'lucide-react';
import type { DashboardLink } from '../../types';

const DEPT_COLORS: Record<string, string> = {
  HR: '#3b82f6',
  Technology: '#10b981',
  Services: '#f59e0b',
  Finance: '#8b5cf6',
};

interface DashboardPreviewCardProps {
  link: DashboardLink;
}

export default function DashboardPreviewCard({ link }: DashboardPreviewCardProps) {
  const color = DEPT_COLORS[link.department] || '#888';
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', marginBottom: 8,
        background: 'var(--surface-2)',
        border: '1px solid var(--border-light)',
        borderRadius: 10, textDecoration: 'none', transition: 'all 0.25s', cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = 'var(--surface-1)';
        el.style.borderColor = `${color}50`;
        el.style.transform = 'translateX(3px)';
        el.style.boxShadow = `0 2px 12px rgba(10,22,40,0.08)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = 'var(--surface-2)';
        el.style.borderColor = 'var(--border-light)';
        el.style.transform = 'translateX(0)';
        el.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: `${color}14`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Building2 size={16} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{link.title}</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {link.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <Clock size={9} color="var(--text-muted)" />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Updated {link.lastUpdated}</span>
        </div>
      </div>
      <ExternalLink size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
    </a>
  );
}
