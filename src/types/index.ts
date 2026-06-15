// ── Core Domain Types ─────────────────────────────────────────────────────────

export type StrategyMode = 'analytical' | 'visual';

export type DataDomain = {
  id: string;
  name: string;
  department: 'HR' | 'Technology' | 'Services' | 'Finance';
  description: string;
};

export type KPICard = {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  unit: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'flat';
  health: 'green' | 'red' | 'amber';
  sparkline: number[];
  subText: string;
};

export type ChartDataPoint = Record<string, string | number>;

export type LineConfig = { key: string; color: string; label: string };

export type ChartConfig = {
  type: 'bar' | 'waterfall' | 'scatter' | 'line' | 'pie' | 'heatmap';
  title: string;
  caption: string;
  dataKey: string;
  xKey: string;
  yKey?: string;
  lines?: LineConfig[];
  referenceValue?: number;
  data: ChartDataPoint[];
  color?: string;
};

export type DashboardLink = {
  id: string;
  title: string;
  description: string;
  department: string;
  url: string;
  lastUpdated: string;
};

export type NarrativeSection = {
  findings: string;
  drivers: string;
  improvements: string;
  gaps: string;
  mermaidChart?: string;
  dashboardLinks: DashboardLink[];
};

export type RecommendedPrompt = {
  id: string;
  label: string;
  query: string;
};

export type QueryResult = {
  id: string;
  query: string;
  mode: StrategyMode;
  timestamp: string;
  kpis: KPICard[];
  narrative: NarrativeSection;
  charts: ChartConfig[];
  recommendedPrompts: RecommendedPrompt[];
};

export type SessionGroup = {
  label: string;
  sessions: Array<{
    id: string;
    query: string;
    timestamp: string;
    resultId: string;
  }>;
};

export type AppState = {
  view: 'landing' | 'results' | 'compare';
  currentQuery: string;
  currentMode: StrategyMode;
  pinnedDomains: string[];
  currentResult: QueryResult | null;
  compareLeft: QueryResult | null;
  compareRight: QueryResult | null;
  isLoading: boolean;
  sessionHistory: SessionGroup[];
};
