import type { StrategyMode } from '../../types';

export const DEEP_DIVE_KEYWORDS = ['delve deeper', 'generate chart', 'show chart', 'drill down', 'deep dive', 'full breakdown', 'show me charts'];
export const ANALYTICAL_KEYWORDS = ['analyse', 'analyze', 'explain why', 'root cause', 'what caused', 'deep analysis'];

export function detectDeepDive(q: string): { isDeepDive: boolean; mode: StrategyMode } {
  const lower = q.toLowerCase();
  const isDeepDive = DEEP_DIVE_KEYWORDS.some(k => lower.includes(k)) || ANALYTICAL_KEYWORDS.some(k => lower.includes(k));
  const mode: StrategyMode = ANALYTICAL_KEYWORDS.some(k => lower.includes(k)) ? 'analytical' : 'visual';
  return { isDeepDive, mode };
}
