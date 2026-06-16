import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { QueryResult } from '../../../types';

export default function SpreadsheetLayout({ result }: { result: QueryResult }) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const sd = result.spreadsheetData;
  if (!sd) return null;

  const sortedRows = [...sd.rows].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return String(av).localeCompare(String(bv)) * (sortDir === 'asc' ? 1 : -1);
  });

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const fmt = (val: string | number, type: string) => {
    if (type === 'currency' && typeof val === 'number') return val >= 0 ? `$${val.toFixed(1)}M` : `-$${Math.abs(val).toFixed(1)}M`;
    if (type === 'percent' && typeof val === 'number') return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
    return String(val);
  };

  const getVarianceColor = (row: Record<string, string | number>) => {
    const v = row['variance'];
    if (typeof v !== 'number') return 'var(--text-primary)';
    if (v > 5) return '#c0392b';
    if (v > 0) return '#f59e0b';
    return '#10b981';
  };

  const getStatusBg = (status: string | number) => {
    if (status === 'Over') return { bg: 'rgba(192,57,43,0.1)', color: '#c0392b', border: 'rgba(192,57,43,0.25)' };
    if (status === 'Under') return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.25)' };
    return { bg: 'transparent', color: 'var(--text-muted)', border: 'transparent' };
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--canvas-bg)' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
        <div style={{ background: 'var(--surface-1)', borderRadius: 12, border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(10,22,40,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ background: 'var(--navy-900)' }}>
                {sd.columns.map(col => (
                  <th key={col.key} onClick={() => toggleSort(col.key)}
                    style={{ padding: '11px 14px', textAlign: col.type === 'text' ? 'left' : 'right', whiteSpace: 'nowrap', cursor: 'pointer', width: col.width, color: 'var(--sidebar-secondary)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', userSelect: 'none', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: col.type === 'text' ? 'flex-start' : 'flex-end' }}>
                      {col.label}
                      {sortKey === col.key ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : <ChevronDown size={11} style={{ opacity: 0.3 }} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--surface-1)' : 'var(--surface-2)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(30,58,110,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = ri % 2 === 0 ? 'var(--surface-1)' : 'var(--surface-2)')}>
                  {sd.columns.map(col => {
                    const val = row[col.key];
                    const isVariance = col.key === 'variance' || col.key === 'variancePct';
                    const isStatus = col.key === 'status';
                    const sc = isStatus ? getStatusBg(val) : null;
                    return (
                      <td key={col.key} style={{ padding: '10px 14px', textAlign: col.type === 'text' ? 'left' : 'right', borderBottom: '1px solid var(--border-light)', color: isVariance ? getVarianceColor(row) : 'var(--text-primary)', fontWeight: col.key === 'department' ? 600 : 400 }}>
                        {isStatus && val ? (
                          <span style={{ background: sc!.bg, color: sc!.color, border: `1px solid ${sc!.border}`, borderRadius: 20, padding: '2px 9px', fontSize: 10.5, fontWeight: 600 }}>{String(val)}</span>
                        ) : fmt(val, col.type)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Summary row */}
              {sd.summaryRow && (
                <tr style={{ background: 'var(--navy-800)', borderTop: '2px solid rgba(255,255,255,0.08)' }}>
                  {sd.columns.map(col => {
                    const val = sd.summaryRow![col.key];
                    return (
                      <td key={col.key} style={{ padding: '11px 14px', textAlign: col.type === 'text' ? 'left' : 'right', color: 'var(--sidebar-secondary)', fontWeight: 700, fontSize: 12 }}>
                        {val !== undefined && val !== '' ? fmt(val, col.type) : ''}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
