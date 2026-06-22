import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize once with a clean theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#1e3a6e',
    primaryTextColor: '#e6edf3',
    primaryBorderColor: '#c0392b',
    lineColor: '#c0392b',
    secondaryColor: '#0f2040',
    tertiaryColor: '#162d56',
    background: '#1a2f52',
    mainBkg: '#1a2f52',
    nodeBorder: '#c0392b',
    clusterBkg: '#213a64',
    titleColor: '#e6edf3',
    edgeLabelBackground: '#213a64',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '15px', // Increased from 13px for better visibility
  },
  flowchart: {
    curve: 'basis',
    htmlLabels: true,
    padding: 20,
    nodeSpacing: 60,
    rankSpacing: 60,
  },
  securityLevel: 'loose',
});

let renderCount = 0;

interface MermaidChartProps {
  chart: string;
}

export default function MermaidChart({ chart }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!chart) return;

    const id = `mermaid-${++renderCount}`;
    setSvg('');
    setError('');

    mermaid.render(id, chart)
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
      })
      .catch((err) => {
        console.warn('Mermaid render error:', err);
        setError(String(err?.message ?? err));
      });
  }, [chart]);

  if (error) {
    return (
      <div style={{
        background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)',
        borderRadius: 10, padding: '12px 16px',
        fontSize: 12, color: '#e74c3c',
      }}>
        <strong>Diagram error:</strong> {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        background: 'var(--surface-2)',
        borderRadius: 12,
        border: '1px solid var(--border-light)',
        padding: '20px 16px',
        overflowX: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {svg ? (
        <div 
          className="mermaid-svg-wrapper" 
          dangerouslySetInnerHTML={{ __html: svg }} 
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5, padding: 20 }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid var(--text-muted)',
            borderTopColor: '#c0392b',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Rendering diagram…</span>
        </div>
      )}
    </div>
  );
}
