// ── Core Domain Types ─────────────────────────────────────────────────────────

export type StrategyMode = 'analytical' | 'visual' | 'chat' | 'spreadsheet';

export type DataDomain = {
  id: string;
  name: string;
  department: 'HR' | 'Technology' | 'Services' | 'Finance' | 'Sales' | 'Enterprise';
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
  drillDown?: Record<string, ChartDataPoint[]>; // click bar label → sub-data
  filterKey?: string; // field to filter on (e.g. 'region')
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

// ── Chat types ────────────────────────────────────────────────────────────────
export type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
};

// ── Spreadsheet types ─────────────────────────────────────────────────────────
export type SpreadsheetColumn = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'percent';
  width?: number;
};

export type SpreadsheetData = {
  columns: SpreadsheetColumn[];
  rows: Record<string, string | number>[];
  summaryRow?: Record<string, string | number>;
};

// ── Query result ──────────────────────────────────────────────────────────────
export type QueryResult = {
  id: string;
  query: string;
  mode: StrategyMode;
  timestamp: string;
  kpis: KPICard[];
  narrative: NarrativeSection;
  charts: ChartConfig[];
  recommendedPrompts: RecommendedPrompt[];
  chatMessages?: ChatMessage[];
  spreadsheetData?: SpreadsheetData;
};

// ── Session / history ─────────────────────────────────────────────────────────
export type SessionEntry = {
  id: string;
  query: string;
  timestamp: string;
  resultId: string;
  sessionThreadId?: string; // groups follow-up queries
  isFollowUp?: boolean;
};

export type SessionGroup = {
  label: string;
  sessions: SessionEntry[];
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
  currentSessionThreadId?: string;
};
