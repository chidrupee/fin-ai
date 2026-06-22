import type { StrategyMode } from '../../types';

export const DEEP_DIVE_KEYWORDS = [
  'delve deeper', 'generate chart', 'show chart', 'drill down',
  'deep dive', 'full breakdown', 'show me charts',
];
export const ANALYTICAL_KEYWORDS = [
  'analyse', 'analyze', 'explain why', 'root cause', 'what caused', 'deep analysis',
];

// Exact demo follow-up queries that should always route to a specific mode
const DEMO_ROUTE_MAP: { keywords: string[]; mode: StrategyMode }[] = [
  { keywords: ['break this down by region', 'show me the charts'], mode: 'visual' },
  { keywords: ['table of department budget', 'budget vs actuals'], mode: 'spreadsheet' },
  { keywords: ['analysis: why', 'emea margin declining', 'emea margin'], mode: 'analytical' },
  { keywords: ['compare engineering', 'headcount cost vs sales', 'headcount cost'], mode: 'visual' },
  { keywords: ['compare'], mode: 'visual' },
  { keywords: ['table', 'spreadsheet', 'actuals'], mode: 'spreadsheet' },
  { keywords: ['analysis', 'why is', 'what is driving', 'root cause'], mode: 'analytical' },
  { keywords: ['investigate', 'anomaly', 'deep dive into'], mode: 'investigative' },
  { keywords: ['chart', 'show me', 'visual', 'trend', 'breakdown'], mode: 'visual' },
];

export function detectDeepDive(q: string): { isDeepDive: boolean; mode: StrategyMode } {
  const lower = q.toLowerCase();

  // First: check exact demo route map
  for (const { keywords, mode } of DEMO_ROUTE_MAP) {
    if (keywords.some(k => lower.includes(k))) {
      return { isDeepDive: true, mode };
    }
  }

  // Then: generic deep-dive keywords
  const isAnalytical = ANALYTICAL_KEYWORDS.some(k => lower.includes(k));
  const isDeepDive = DEEP_DIVE_KEYWORDS.some(k => lower.includes(k)) || isAnalytical;
  const mode: StrategyMode = isAnalytical ? 'analytical' : 'visual';
  return { isDeepDive, mode };
}
