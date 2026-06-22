import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, ChevronDown, ChevronUp, GripVertical, Trash2, RefreshCw } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { QueryResult, ChartConfig, ChartType } from '../../../types';
import ChartRenderer from '../components/ChartRenderer';

const CHART_TYPES: { type: ChartType; label: string; emoji: string }[] = [
  { type: 'bar',      label: 'Bar Chart',     emoji: '📊' },
  { type: 'line',     label: 'Line Chart',    emoji: '📈' },
  { type: 'pie',      label: 'Donut Chart',   emoji: '🥧' },
  { type: 'scatter',  label: 'Scatter Plot',  emoji: '⚪' },
];

function ChartTypePopover({
  currentType,
  onSelect,
  onClose,
}: {
  currentType: ChartType;
  onSelect: (t: ChartType) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        position: 'absolute', right: 12, bottom: 44, zIndex: 30,
        background: 'var(--surface-1)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: 14, padding: 14,
        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        width: 220,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Switch chart type</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, borderRadius: 4, display: 'flex' }}
        >
          ✕
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {CHART_TYPES.map(({ type, label, emoji }) => {
          const isActive = currentType === type;
          return (
            <button
              key={type}
              onClick={() => { onSelect(type); onClose(); }}
              style={{
                padding: '8px 6px',
                borderRadius: 8,
                background: isActive ? 'rgba(192,57,43,0.08)' : 'var(--surface-2)',
                border: `1.5px solid ${isActive ? '#c0392b' : 'transparent'}`,
                color: isActive ? '#c0392b' : 'var(--text-secondary)',
                fontSize: 11.5, fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <div style={{ fontSize: 16, marginBottom: 3 }}>{emoji}</div>
              {label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function SortableChartCard({
  chart,
  index,
  total,
  isCompareMode,
  onDelete,
  onChangeType,
}: {
  chart: ChartConfig;
  index: number;
  total: number;
  isCompareMode?: boolean;
  onDelete: (id: string) => void;
  onChangeType: (id: string, type: ChartType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chart.id });
  const [showPopover, setShowPopover] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const isLastAndOdd = index === total - 1 && total % 2 !== 0;

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        gridColumn: isLastAndOdd && !isCompareMode ? '1 / -1' : undefined,
        background: 'var(--surface-1)',
        border: `1px solid ${isDragging ? 'rgba(192,57,43,0.5)' : 'var(--border-light)'}`,
        borderRadius: 16,
        boxShadow: isDragging
          ? '0 20px 48px rgba(0,0,0,0.2), 0 0 0 2px rgba(192,57,43,0.3)'
          : '0 2px 12px rgba(10,22,40,0.06)',
        display: 'flex', flexDirection: 'column',
        minHeight: 290, minWidth: 0,
        position: 'relative', overflow: 'hidden',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: isDragging ? 1.02 : 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="chart-container"
    >
      {/* Top action bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 12px 0',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      }}>
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="chart-drag-handle"
          title="Drag to reorder"
          style={{
            background: 'none', border: 'none', cursor: 'grab',
            padding: '4px 6px', color: 'var(--text-muted)', opacity: 0,
            transition: 'opacity 0.2s', borderRadius: 6, display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <GripVertical size={15} />
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(chart.id)}
          className="chart-delete-btn"
          title="Remove widget"
          style={{
            background: 'none', border: 'none',
            borderRadius: '50%', width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
            opacity: 0, transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(231,76,60,0.12)';
            e.currentTarget.style.color = '#e74c3c';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Chart content */}
      <div style={{ flex: 1, padding: '36px 16px 14px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <ChartRenderer chart={chart} height={-1} />

        {/* Chart switcher button — shown for the demo target chart */}
        {chart.isDemoSwitchTarget && (
          <>
            <AnimatePresence>
              {showPopover && (
                <ChartTypePopover
                  currentType={chart.type}
                  onSelect={(t) => onChangeType(chart.id, t)}
                  onClose={() => setShowPopover(false)}
                />
              )}
            </AnimatePresence>
            <button
              onClick={() => setShowPopover(prev => !prev)}
              style={{
                position: 'absolute', bottom: 14, right: 14,
                background: showPopover ? 'rgba(192,57,43,0.12)' : 'var(--surface-2)',
                border: `1px solid ${showPopover ? 'rgba(192,57,43,0.4)' : 'var(--border-medium)'}`,
                color: showPopover ? '#c0392b' : 'var(--text-secondary)',
                padding: '5px 10px', borderRadius: 20,
                fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                cursor: 'pointer', transition: 'all 0.2s', zIndex: 5,
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => {
                if (!showPopover) {
                  e.currentTarget.style.background = 'var(--surface-3)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }
              }}
              onMouseLeave={e => {
                if (!showPopover) {
                  e.currentTarget.style.background = 'var(--surface-2)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }
              }}
            >
              <RefreshCw size={11} />
              Change chart
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function VisualLayout({ result, isCompareMode }: { result: QueryResult; isCompareMode?: boolean }) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [charts, setCharts] = useState<ChartConfig[]>(result.charts);

  useEffect(() => { setCharts(result.charts); }, [result.charts]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCharts(items => {
        const oi = items.findIndex(i => i.id === active.id);
        const ni = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oi, ni);
      });
    }
  };

  const handleDelete = (id: string) => setCharts(prev => prev.filter(c => c.id !== id));
  const handleChangeType = (id: string, t: ChartType) => setCharts(prev => prev.map(c => c.id === id ? { ...c, type: t } : c));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--canvas-bg)' }}>

      {/* Sticky analysis banner */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        style={{
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border-light)',
          flexShrink: 0,
          position: 'sticky', top: 45, zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <BarChart2 size={15} color="#c0392b" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {result.narrative.findings.replace(/\*\*(.*?)\*\*/g, '$1').split('.')[0].slice(0, 140)}
            </p>
          </div>

          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            style={{
              background: summaryOpen ? 'var(--surface-2)' : 'var(--gradient-button)',
              color: summaryOpen ? 'var(--text-primary)' : '#fff',
              border: 'none', borderRadius: 8, padding: '6px 14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif', flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: summaryOpen ? 'none' : '0 2px 10px rgba(192,57,43,0.25)',
            }}
          >
            {summaryOpen ? 'Close Analysis' : 'View Analysis'}
            {summaryOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        <AnimatePresence>
          {summaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden' }}
              className="print-force-show"
            >
              <div style={{ padding: '4px 20px 20px', display: 'flex', gap: 16, flexDirection: isCompareMode ? 'column' : 'row' }}>
                {[
                  { label: 'Key Findings', text: result.narrative.findings, color: '#e74c3c' },
                  { label: 'Primary Drivers', text: result.narrative.drivers, color: '#f59e0b' },
                ].map(({ label, text, color }) => (
                  <div key={label} style={{ flex: 1, minWidth: 0, background: 'var(--canvas-bg)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-light)', borderTop: `3px solid ${color}` }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{label}</p>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                      {text.split('. ').map(s => s.replace(/\*\*(.*?)\*\*/g, '$1').trim()).filter(Boolean).map((p, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div style={{ flex: isCompareMode ? 'auto' : '0 0 220px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Data Sources</p>
                  {result.narrative.dashboardLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)',
                        padding: '9px 12px', borderRadius: 8, fontSize: 12, color: '#3b82f6',
                        textDecoration: 'none', fontWeight: 600, transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,130,246,0.14)'}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,130,246,0.06)'}
                    >
                      {link.title} <span>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* DnD Chart Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={charts.map(c => c.id)} strategy={rectSortingStrategy}>
          <div style={{
            flex: 1, display: 'grid',
            gridTemplateColumns: charts.length > 1 && !isCompareMode ? 'minmax(0, 1fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
            gridAutoRows: 'minmax(290px, auto)',
            gap: 14, padding: 16, alignContent: 'start',
          }}>
            <AnimatePresence>
              {charts.map((chart, i) => (
                <SortableChartCard
                  key={chart.id}
                  chart={chart}
                  index={i}
                  total={charts.length}
                  isCompareMode={isCompareMode}
                  onDelete={handleDelete}
                  onChangeType={handleChangeType}
                />
              ))}
            </AnimatePresence>

            {charts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  gridColumn: '1 / -1', textAlign: 'center',
                  padding: 60, color: 'var(--text-muted)', fontSize: 14, fontWeight: 500,
                }}
              >
                All widgets removed. Ask another question to load new charts.
              </motion.div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
