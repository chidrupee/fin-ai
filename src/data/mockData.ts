import type { DataDomain, QueryResult, SessionGroup, SessionEntry, StrategyMode } from '../types';

// ── Data Domains ─────────────────────────────────────────────────────────────

export const DATA_DOMAINS: DataDomain[] = [
  { id: 'hr-global', name: 'Headcount and cost', department: 'HR', description: 'Headcount, attrition, compensation' },
  { id: 'hr-apac', name: 'Segment profitability', department: 'Finance', description: 'Regional margins and profitability' },
  { id: 'tech-cloud', name: 'Commercials', department: 'Sales', description: 'Pricing, win rates, ARR' },
  { id: 'tech-saas', name: 'Technology', department: 'Technology', description: 'Infrastructure and software spend' },
  { id: 'svc-margins', name: 'Vodafone Business', department: 'Enterprise', description: 'Key account metrics' },
  { id: 'svc-delivery', name: 'Delivery KPIs', department: 'Services', description: 'SLA, CSAT, utilization rates' },
  { id: 'fin-q3', name: 'Q3 Finance Report', department: 'Finance', description: 'Consolidated quarterly financials' },
  { id: 'fin-forecast', name: 'FY26 Forecast', department: 'Finance', description: 'Annual budget vs actuals' },
];

// ── Mock Query Results ────────────────────────────────────────────────────────

export const MOCK_RESULTS: Record<string, QueryResult> = {
  'vois-revenue-chat': {
    id: 'vois-revenue-chat',
    query: 'What is VOIS total revenue for Q3?',
    mode: 'chat',
    timestamp: '2026-06-21T09:00:00Z',
    kpis: [],
    narrative: { findings: '', drivers: '', improvements: '', gaps: '', dashboardLinks: [] },
    charts: [],
    recommendedPrompts: [
      { id: 'rp1', label: 'Show me region charts', query: 'Break this down by region and show me the charts', autoMode: 'visual' },
      { id: 'rp2', label: 'Table of budget vs actuals', query: 'Give me a table of department budget vs actuals', autoMode: 'spreadsheet' }
    ],
    chatMessages: [
      {
        id: 'cm1',
        role: 'ai',
        content: 'Global revenue for **VOIS Q3 FY2026** is **$287.3M**, up **4.1% QoQ** from $275.9M — broadly on track with the annual plan of $1.1B.\n\n**Regional split:**\n• Americas — $115.2M (+6.2%)\n• EMEA — $98.4M (+1.8%) — growth slowing\n• APAC — $73.7M (+4.9%)\n\nServices revenue grew faster (+8.2%) than product revenue (+2.1%). Overall margin stands at 31.2%, which is below the 40% target.',
        timestamp: '09:00',
        insights: [
          {
            title: 'Key Findings',
            items: [
              'Services revenue outpaced product growth significantly (+8.2% vs +2.1%).',
              'Overall margin is lagging at 31.2% against a 40% target.',
            ]
          },
          {
            title: 'Primary Drivers',
            items: [
              'EMEA growth has decelerated to +1.8%, marking the slowest quarter in the last 18 months.',
              'Americas enterprise software deals contributed +$4.5M to the regional beat.'
            ]
          },
          {
            title: 'Next Steps',
            items: [
              'Accelerate EMEA enterprise pipeline conversion.',
              'Renegotiate underperforming service contracts in Q4.'
            ]
          }
        ],
        chart: {
          id: 'mini-revenue-chart',
          type: 'bar',
          title: 'Q3 Revenue by Region ($M)',
          dataKey: 'revenue',
          xKey: 'region',
          data: [
            { region: 'Americas', revenue: 115.2 },
            { region: 'EMEA', revenue: 98.4 },
            { region: 'APAC', revenue: 73.7 },
          ],
          caption: '* Click on a data point to drill down into sub-region details',
          drillDown: {
            'Americas': [
              { region: 'United States', revenue: 89.4 },
              { region: 'Canada', revenue: 14.8 },
              { region: 'LATAM', revenue: 11.0 },
            ],
            'EMEA': [
              { region: 'United Kingdom', revenue: 38.2 },
              { region: 'Germany', revenue: 28.4 },
              { region: 'France', revenue: 18.9 },
              { region: 'Other EU', revenue: 12.9 },
            ],
            'APAC': [
              { region: 'Australia', revenue: 22.1 },
              { region: 'Singapore', revenue: 18.4 },
              { region: 'India', revenue: 16.5 },
              { region: 'Japan', revenue: 16.7 },
            ]
          }
        },
        suggestedFollowUps: [
          'Break this down by region and show me the charts',
          'Give me a table of department budget vs actuals',
          'Analysis: why is the EMEA margin declining?'
        ],
      },
    ],
  },

  'vois-revenue-visual': {
    id: 'vois-revenue-visual',
    query: 'Break this down by region and show me the charts',
    mode: 'visual',
    timestamp: '2026-06-21T09:02:00Z',
    kpis: [
      { id: 'k1', title: 'Global Revenue (Q3)', value: '$287.3M', rawValue: 287.3, unit: 'M', trend: '+4.1%', trendDirection: 'up', health: 'green', sparkline: [245, 256, 264, 270, 275, 281, 287.3], subText: 'vs $275.9M Q2' },
      { id: 'k2', title: 'Americas', value: '$115.2M', rawValue: 115.2, unit: 'M', trend: '+6.2%', trendDirection: 'up', health: 'green', sparkline: [98, 101, 104, 108, 111, 113, 115.2], subText: 'Strongest region' },
      { id: 'k3', title: 'EMEA', value: '$98.4M', rawValue: 98.4, unit: 'M', trend: '+1.8%', trendDirection: 'up', health: 'amber', sparkline: [88, 90, 91, 93, 95, 97, 98.4], subText: 'Growth slowing' },
      { id: 'k4', title: 'APAC', value: '$73.7M', rawValue: 73.7, unit: 'M', trend: '+4.9%', trendDirection: 'up', health: 'amber', sparkline: [60, 63, 65, 67, 69, 71, 73.7], subText: 'Strong pipeline' },
    ],
    narrative: {
      findings: '**Global revenue of $287.3M** is up 4.1% QoQ, driven by Americas. EMEA growth has slowed to +1.8%, the weakest quarter in 6 periods. APAC is accelerating but from a smaller base.',
      drivers: 'Americas growth is driven by enterprise software deals (+3 logos). EMEA slowdown is tied to macro headwinds in Germany and delayed renewals in UK financial services.',
      improvements: '- Accelerate EMEA enterprise pipeline conversion\n- Expand APAC Singapore footprint targeting FS sector',
      gaps: '- China revenue excluded pending regulatory review\n- Q4 committed deals not yet recognized',
      dashboardLinks: [
        { id: 'dl1', title: 'Revenue Intelligence Dashboard', description: 'Live pipeline, wins, and regional splits', department: 'Finance', url: '#', lastUpdated: 'Today' },
      ],
    },
    charts: [
      {
        id: 'chart-rev-region',
        type: 'bar', title: 'Revenue by Region (Q3 FY2026, $M)', caption: 'Click any region bar to drill into country-level breakdown.',
        dataKey: 'revenue', xKey: 'region',
        isDemoSwitchTarget: true,
        data: [
          { region: 'Americas', revenue: 115.2 },
          { region: 'EMEA', revenue: 98.4 },
          { region: 'APAC', revenue: 73.7 },
        ],
        drillDown: {
          'Americas': [
            { region: 'United States', revenue: 89.4 },
            { region: 'Canada', revenue: 14.8 },
            { region: 'LATAM', revenue: 11.0 },
          ],
          'EMEA': [
            { region: 'United Kingdom', revenue: 38.2 },
            { region: 'Germany', revenue: 28.4 },
            { region: 'France', revenue: 18.9 },
            { region: 'Other EU', revenue: 12.9 },
          ],
          'APAC': [
            { region: 'Australia', revenue: 22.1 },
            { region: 'Singapore', revenue: 18.4 },
            { region: 'Japan', revenue: 16.2 },
            { region: 'India', revenue: 17.0 },
          ],
        },
      },
      {
        id: 'chart-rev-trend',
        type: 'line', title: 'Revenue Growth Trend by Region (%)', caption: 'Americas momentum is consistent. EMEA deceleration began in Q1 and has not recovered.',
        dataKey: 'americas', xKey: 'quarter',
        lines: [
          { key: 'americas', color: '#10b981', label: 'Americas' },
          { key: 'emea', color: '#f59e0b', label: 'EMEA' },
          { key: 'apac', color: '#3b82f6', label: 'APAC' },
        ],
        data: [
          { quarter: 'Q4 FY25', americas: 7.1, emea: 6.8, apac: 5.2 },
          { quarter: 'Q1 FY26', americas: 6.8, emea: 4.9, apac: 5.8 },
          { quarter: 'Q2 FY26', americas: 6.4, emea: 3.1, apac: 4.7 },
          { quarter: 'Q3 FY26', americas: 6.2, emea: 1.8, apac: 4.9 },
        ],
      },
      {
        id: 'chart-rev-mix',
        type: 'pie', title: 'Revenue Mix by Product Line', caption: 'SaaS now represents 58% of total revenue — up from 44% two years ago.',
        dataKey: 'revenue', xKey: 'line',
        data: [
          { line: 'SaaS Subscriptions', revenue: 166.6 },
          { line: 'Professional Services', revenue: 80.4 },
          { line: 'Maintenance & Support', revenue: 40.3 },
        ],
      },
      {
        id: 'chart-win-rate',
        type: 'scatter', title: 'Win Rate vs Deal Size by Region', caption: 'APAC achieves the best win rate on large deals (>$1M). EMEA win rate drops sharply on enterprise deals.',
        dataKey: 'winRate', xKey: 'dealSize', yKey: 'winRate',
        data: [
          { region: 'Americas SMB', dealSize: 45, winRate: 72 },
          { region: 'Americas ENT', dealSize: 280, winRate: 58 },
          { region: 'EMEA SMB', dealSize: 38, winRate: 68 },
          { region: 'EMEA ENT', dealSize: 310, winRate: 31 },
          { region: 'APAC SMB', dealSize: 52, winRate: 74 },
          { region: 'APAC ENT', dealSize: 190, winRate: 61 },
        ],
      },
    ],
    recommendedPrompts: [
      { id: 'rp1', label: 'Department budget vs actuals', query: 'Give me a table of department budget vs actuals', autoMode: 'spreadsheet' },
      { id: 'rp2', label: 'EMEA margin analysis', query: 'Analysis: why is the EMEA margin declining?', autoMode: 'analytical' },
    ],
  },

  'vois-budget-table': {
    id: 'vois-budget-table',
    query: 'Give me a table of department budget vs actuals',
    mode: 'spreadsheet',
    timestamp: '2026-06-21T09:05:00Z',
    kpis: [
      { id: 'k1', title: 'Total Budget', value: '$521.0M', rawValue: 521.0, unit: 'M', trend: 'FY2026 Plan', trendDirection: 'flat', health: 'green', sparkline: [521], subText: 'Annual approved' },
      { id: 'k2', title: 'Total Actuals (YTD)', value: '$548.7M', rawValue: 548.7, unit: 'M', trend: '+$27.7M', trendDirection: 'up', health: 'red', sparkline: [430, 470, 510, 548.7], subText: 'Year-to-date' },
      { id: 'k3', title: 'Variance', value: '+$27.7M', rawValue: 27.7, unit: 'M', trend: '+5.3%', trendDirection: 'up', health: 'red', sparkline: [5, 12, 19, 27.7], subText: 'Over budget' },
      { id: 'k4', title: 'Depts Over Budget', value: '3 of 6', rawValue: 3, unit: '', trend: 'Engineering worst', trendDirection: 'up', health: 'red', sparkline: [1, 2, 2, 3], subText: 'Eng, Sales, Product' },
    ],
    narrative: { findings: '', drivers: '', improvements: '', gaps: '', dashboardLinks: [] },
    charts: [],
    recommendedPrompts: [
      { id: 'rp1', label: 'Analyze EMEA margin', query: 'Analysis: why is the EMEA margin declining?', autoMode: 'analytical' },
      { id: 'rp2', label: 'Compare headcount costs', query: 'Compare Engineering headcount cost vs Sales', autoMode: 'visual' }
    ],
    spreadsheetData: {
      columns: [
        { key: 'department', label: 'Department', type: 'text', width: 160 },
        { key: 'budget', label: 'Budget ($M)', type: 'currency', width: 130 },
        { key: 'actuals', label: 'Actuals ($M)', type: 'currency', width: 130 },
        { key: 'variance', label: 'Variance ($M)', type: 'currency', width: 130 },
        { key: 'variancePct', label: 'Var %', type: 'percent', width: 90 },
        { key: 'q1', label: 'Q1 ($M)', type: 'currency', width: 100 },
        { key: 'q2', label: 'Q2 ($M)', type: 'currency', width: 100 },
        { key: 'q3', label: 'Q3 ($M)', type: 'currency', width: 100 },
        { key: 'status', label: 'Status', type: 'text', width: 100 },
      ],
      rows: [
        { department: 'Engineering', budget: 128.0, actuals: 142.4, variance: 14.4, variancePct: 11.3, q1: 44.5, q2: 48.8, q3: 49.1, status: 'Over', region: 'Global' },
        { department: 'Sales', budget: 95.0, actuals: 96.2, variance: 1.2, variancePct: 1.3, q1: 30.0, q2: 32.1, q3: 34.1, status: 'Over', region: 'Global' },
        { department: 'Services', budget: 110.0, actuals: 98.4, variance: -11.6, variancePct: -10.5, q1: 31.0, q2: 33.8, q3: 33.6, status: 'Under', region: 'Global' },
        { department: 'Product', budget: 72.0, actuals: 74.3, variance: 2.3, variancePct: 3.2, q1: 23.5, q2: 25.0, q3: 25.8, status: 'Over', region: 'Global' },
        { department: 'Marketing', budget: 68.0, actuals: 61.2, variance: -6.8, variancePct: -10.0, q1: 20.1, q2: 21.0, q3: 20.1, status: 'Under', region: 'Global' },
        { department: 'G&A', budget: 48.0, actuals: 47.2, variance: -0.8, variancePct: -1.7, q1: 15.8, q2: 16.0, q3: 15.4, status: 'Under', region: 'Global' },
      ],
      summaryRow: { department: 'TOTAL', budget: 521.0, actuals: 519.7, variance: 27.7, variancePct: 5.3, q1: 164.9, q2: 176.7, q3: 178.1, status: '' },
    },
  },

  'vois-emea-analysis': {
    id: 'vois-emea-analysis',
    query: 'Analysis: why is the EMEA margin declining?',
    mode: 'analytical',
    timestamp: '2026-06-21T09:10:00Z',
    kpis: [
      { id: 'k1', title: 'EMEA Margin', value: '24.1%', rawValue: 24.1, unit: '%', trend: '-6.8pp', trendDirection: 'down', health: 'red', sparkline: [34, 32, 29, 27, 25, 24.1], subText: 'Target: 40%' },
      { id: 'k2', title: 'Delivery Cost', value: '$61.5M', rawValue: 61.5, unit: 'M', trend: '+17.8%', trendDirection: 'up', health: 'red', sparkline: [42, 45, 48, 52, 56, 59, 61.5], subText: 'Labour + tooling' },
      { id: 'k3', title: 'Utilisation Rate', value: '74.2%', rawValue: 74.2, unit: '%', trend: '-4.1pp', trendDirection: 'down', health: 'red', sparkline: [84, 83, 81, 79, 77, 76, 74.2], subText: 'Bench cost rising' },
      { id: 'k4', title: 'Avg. Salary (EMEA)', value: '$115.8K', rawValue: 115.8, unit: 'K', trend: '+2.8%', trendDirection: 'up', health: 'amber', sparkline: [110, 112, 112.6, 115.8], subText: 'Market compression' },
    ],
    narrative: {
      findings: `**EMEA margin has compressed by 6.8 percentage points**, falling to 24.1% — well below the 40% target. While revenue grew 1.8%, the cost of delivery is outpacing it significantly.`,
      drivers: `Three compounding forces: **rising senior consultant salaries in London and Berlin**, a **4.1pp drop in utilisation** (more bench time), and delayed renewals in UK financial services. Favorable GBP/EUR exchange rates offset some potential cost increases but were insufficient to halt the margin decline.`,
      improvements: `- Target 80%+ utilisation through improved project pipeline management\n- Review EMEA pricing model — rate cards may be 2 years stale\n- Expand hiring in Madrid to offset London cost compression`,
      gaps: `- Q4 compensation review cycle adjustments not included\n- Subcontractor costs are tracked separately and not included here`,
      mermaidChart: `flowchart TD
    A["📉 EMEA Margin Decline<br/>24.1% (↓6.8pp)"] --> B["💸 Rising Delivery Costs<br/>+$17.8% QoQ"]
    A --> C["📊 Utilisation Drop<br/>74.2% (↓4.1pp)"]
    A --> D["⏳ Delayed Renewals<br/>UK Financial Services"]
    B --> E["👥 London & Berlin Hires<br/>Premium Salaries"]
    C --> F["🪑 Bench Time Increases<br/>Idle headcount cost"]
    D --> G["🌍 Macro Headwinds<br/>UK FS budget freezes"]`,
      timelineEvents: [
        { date: 'Q1 FY26', label: 'London Expansion', detail: 'Added 45 senior engineers driving $2.1M in annualized comp.', type: 'cause' },
        { date: 'Q2 FY26', label: 'Utilisation Drop', detail: 'Bench time increased, dropping utilisation to 74.2%.', type: 'cause' },
        { date: 'Q3 FY26', label: 'UK FS Renewals Delayed', detail: 'Macro headwinds led to postponed contract renewals in UK Financial Services.', type: 'cause' },
        { date: 'Current', label: 'Margin Compression', detail: 'Margin hit 24.1%, a 6.8pp drop over 6 months.', type: 'effect' },
        { date: 'Next Step', label: 'Update Rate Cards', detail: 'Review and update EMEA pricing models to reflect current market costs.', type: 'action' }
      ],
      dashboardLinks: [
        { id: 'dl1', title: 'Services P&L Dashboard', description: 'Margin by practice, region, and client', department: 'Services', url: '#', lastUpdated: 'Today' },
        { id: 'dl2', title: 'EMEA HR Dashboard', description: 'Regional headcount and compensation', department: 'HR', url: '#', lastUpdated: 'Yesterday' }
      ],
    },
    charts: [
      {
        id: 'chart-margin-trend',
        type: 'line', title: 'Margin Trend: 6-Month Rolling (%)', caption: 'The downward trend is steepening month-on-month. Without intervention, margin will breach 20% by Q4.',
        dataKey: 'margin', xKey: 'month',
        lines: [
          { key: 'margin', color: '#e74c3c', label: 'Blended Margin' },
          { key: 'emea', color: '#f59e0b', label: 'EMEA Margin' },
          { key: 'americas', color: '#10b981', label: 'Americas Margin' },
        ],
        referenceValue: 40,
        data: [
          { month: 'Jan', margin: 38.0, emea: 31.2, americas: 43.1 },
          { month: 'Feb', margin: 36.8, emea: 29.8, americas: 43.4 },
          { month: 'Mar', margin: 35.4, emea: 28.1, americas: 42.8 },
          { month: 'Apr', margin: 34.1, emea: 26.5, americas: 42.2 },
          { month: 'May', margin: 32.6, emea: 25.0, americas: 41.5 },
          { month: 'Jun', margin: 31.2, emea: 24.1, americas: 41.2 },
        ],
      },
      {
        id: 'chart-emea-cost',
        type: 'bar', title: 'EMEA Headcount Cost by Hub (Q3)', caption: 'London and Berlin account for 68% of total EMEA costs.',
        dataKey: 'cost', xKey: 'hub',
        data: [
          { hub: 'London', cost: 15.2 },
          { hub: 'Berlin', cost: 10.8 },
          { hub: 'Paris', cost: 5.4 },
          { hub: 'Amsterdam', cost: 4.1 },
          { hub: 'Madrid', cost: 2.7 },
        ],
      }
    ],
    recommendedPrompts: [
      { id: 'rp1', label: 'Compare headcount costs', query: 'Compare Engineering headcount cost vs Sales', autoMode: 'visual' },
      { id: 'rp2', label: 'Review Global Revenue', query: 'What is VOIS total revenue for Q3?', autoMode: 'chat' }
    ],
  },

  'vois-headcount-compare': {
    id: 'vois-headcount-compare',
    query: 'Compare Engineering headcount cost vs Sales',
    mode: 'visual',
    timestamp: '2026-06-21T09:15:00Z',
    kpis: [
      { id: 'k1', title: 'Eng Headcount Cost', value: '$58.4M', rawValue: 58.4, unit: 'M', trend: '+31%', trendDirection: 'up', health: 'red', sparkline: [40, 42, 45, 49, 53, 58.4], subText: 'Highest growth' },
      { id: 'k2', title: 'Sales Headcount Cost', value: '$31.2M', rawValue: 31.2, unit: 'M', trend: '+4%', trendDirection: 'up', health: 'amber', sparkline: [28, 29, 30, 30.5, 31, 31.2], subText: 'Stable growth' },
      { id: 'k3', title: 'Eng Avg. Salary', value: '$212K', rawValue: 212, unit: 'K', trend: '+14%', trendDirection: 'up', health: 'red', sparkline: [180, 185, 192, 200, 208, 212], subText: 'Blended rate' },
      { id: 'k4', title: 'Sales Avg. Salary', value: '$169K', rawValue: 169, unit: 'K', trend: '+2%', trendDirection: 'up', health: 'green', sparkline: [162, 164, 165, 167, 168, 169], subText: 'Blended rate' },
    ],
    narrative: {
      findings: '**Engineering headcount costs grew 31%** while Sales grew only 4%. Engineering represents the highest cost-per-head at $212K blended, driven by talent market pressure.',
      drivers: 'Competitor salary benchmarks show a 12-15% premium for senior engineering roles in APAC and EMEA, triggering off-cycle merit increases.',
      improvements: '- Stagger engineering hiring cohorts to smooth cost recognition\n- Leverage more variable compensation structures in Sales',
      gaps: '- Variable pay accruals not fully reflected for Sales\n- Q4 compensation adjustments pending',
      dashboardLinks: [
        { id: 'dl1', title: 'Global Headcount Dashboard', description: 'Live headcount and compensation data', department: 'HR', url: '#', lastUpdated: 'Today' },
      ],
    },
    charts: [
      {
        id: 'chart-hc-cost-dept',
        type: 'bar', title: 'Headcount Cost by Department (Q3, $M)', caption: 'Engineering shows the steepest rise, well above budget.',
        dataKey: 'cost', xKey: 'dept',
        data: [
          { dept: 'Engineering', cost: 58.4, budget: 44.5 },
          { dept: 'Sales', cost: 31.2, budget: 30.0 },
          { dept: 'Services', cost: 24.8, budget: 26.0 },
          { dept: 'Product', cost: 18.6, budget: 17.2 },
          { dept: 'G&A', cost: 9.4, budget: 10.3 },
        ],
      },
      {
        id: 'chart-hc-bridge',
        type: 'waterfall', title: 'Engineering Q3 Cost Bridge ($M)', caption: 'New hires and merit increases drove the Engineering overruns.',
        dataKey: 'value', xKey: 'category',
        data: [
          { category: 'Q2 Base', value: 44.5, type: 'base' },
          { category: 'New Hires', value: 6.2, type: 'add' },
          { category: 'Merit Inc.', value: 5.1, type: 'add' },
          { category: 'FTE Conv.', value: 2.3, type: 'add' },
          { category: 'Attrition', value: -1.8, type: 'subtract' },
          { category: 'Benefits', value: 2.1, type: 'add' },
          { category: 'Q3 Actual', value: 58.4, type: 'total' },
        ],
      },
      {
        id: 'chart-hc-scatter',
        type: 'scatter', title: 'Headcount vs Cost per Dept', caption: 'Engineering is a clear outlier — highest cost-per-head ($212K).',
        dataKey: 'cost', xKey: 'headcount', yKey: 'costPerHead',
        data: [
          { dept: 'Engineering', headcount: 2760, costPerHead: 212, cost: 58.4 },
          { dept: 'Sales', headcount: 1840, costPerHead: 169, cost: 31.2 },
          { dept: 'Services', headcount: 1650, costPerHead: 150, cost: 24.8 },
          { dept: 'Product', headcount: 980, costPerHead: 190, cost: 18.6 },
          { dept: 'G&A', headcount: 984, costPerHead: 95, cost: 9.4 },
        ],
      }
    ],
    recommendedPrompts: [
      { id: 'rp1', label: 'Review Global Revenue', query: 'What is VOIS total revenue for Q3?', autoMode: 'chat' },
      { id: 'rp2', label: 'Table of budget vs actuals', query: 'Give me a table of department budget vs actuals', autoMode: 'spreadsheet' }
    ],
  },

  'vois-apac-margin-analysis': {
    id: 'vois-apac-margin-analysis',
    query: 'Analysis: why is the APAC margin expanding?',
    mode: 'analytical',
    timestamp: '2026-06-21T09:20:00Z',
    kpis: [
      { id: 'k1', title: 'APAC Margin', value: '38.2%', rawValue: 38.2, unit: '%', trend: '+4.5pp', trendDirection: 'up', health: 'green', sparkline: [33, 34, 35, 36, 37.5, 38.2], subText: 'Target: 35%' },
      { id: 'k2', title: 'Delivery Cost', value: '$31.5M', rawValue: 31.5, unit: 'M', trend: '-2.1%', trendDirection: 'down', health: 'green', sparkline: [35, 34, 33, 32.5, 32, 31.5], subText: 'Labour + tooling' },
      { id: 'k3', title: 'Utilisation Rate', value: '88.5%', rawValue: 88.5, unit: '%', trend: '+6.1pp', trendDirection: 'up', health: 'green', sparkline: [82, 83, 85, 86, 88, 88.5], subText: 'High efficiency' },
      { id: 'k4', title: 'Avg. Salary (APAC)', value: '$85.2K', rawValue: 85.2, unit: 'K', trend: '+1.2%', trendDirection: 'up', health: 'green', sparkline: [83, 84, 84.5, 85.2], subText: 'Stable growth' },
    ],
    narrative: {
      findings: `**APAC margin has expanded by 4.5 percentage points**, rising to 38.2% — exceeding the 35% target. Strong revenue growth (+4.9%) coupled with a structural decrease in delivery costs is driving this profitability.`,
      drivers: `Two primary forces: **consolidation of delivery hubs into lower-cost regions (India and Philippines)**, and a **6.1pp increase in utilisation** (better resource allocation). High win rates in the Enterprise segment have also improved blended margins.`,
      improvements: `- Continue shifting tier-1 support roles to the Manila hub\n- Expand upselling of high-margin SaaS products to SMB clients\n- Protect retention of key engineering talent in Bangalore`,
      gaps: `- Does not include pending Q4 infrastructure investments\n- Exchange rate volatility in JPY/AUD could impact H2`,
      mermaidChart: `flowchart TD
    A["📈 APAC Margin Expansion<br/>38.2% (↑4.5pp)"] --> B["📉 Lower Delivery Costs<br/>-$2.1% QoQ"]
    A --> C["📊 Utilisation Jump<br/>88.5% (↑6.1pp)"]
    B --> D["🏢 Hub Consolidation<br/>India & Philippines"]
    C --> E["🎯 Enterprise Deals<br/>High margin mix"]
    D --> F["💰 Favourable Forex<br/>Beneficial rate shifts"]`,
      timelineEvents: [
        { date: 'Q1 FY26', label: 'Manila Hub Opens', detail: 'Transitioned 150 support roles to lower-cost center.', type: 'action' },
        { date: 'Q2 FY26', label: 'Utilisation Optimization', detail: 'New resource management tooling deployed across region.', type: 'action' },
        { date: 'Q3 FY26', label: 'Enterprise Wins', detail: 'Closed 3 major deals in Singapore and Sydney.', type: 'effect' },
        { date: 'Current', label: 'Margin Expansion', detail: 'Margin hit 38.2%, highest in APAC history.', type: 'effect' }
      ],
      dashboardLinks: [
        { id: 'dl1', title: 'APAC Performance Dashboard', description: 'Margin by country and service line', department: 'Finance', url: '#', lastUpdated: 'Today' }
      ],
    },
    charts: [
      {
        id: 'chart-apac-margin',
        type: 'line', title: 'APAC Margin Trend (%)', caption: 'Consistent upward trajectory over the last 6 months.',
        dataKey: 'margin', xKey: 'month',
        lines: [
          { key: 'margin', color: '#10b981', label: 'APAC Margin' }
        ],
        referenceValue: 35,
        data: [
          { month: 'Jan', margin: 33.0 },
          { month: 'Feb', margin: 34.0 },
          { month: 'Mar', margin: 35.0 },
          { month: 'Apr', margin: 36.0 },
          { month: 'May', margin: 37.5 },
          { month: 'Jun', margin: 38.2 },
        ],
      }
    ],
    recommendedPrompts: [
      { id: 'rp1', label: 'Review EMEA decline', query: 'Analysis: why is the EMEA margin declining?', autoMode: 'analytical' }
    ],
  },
  'vois-investigative-chat': {
    id: 'vois-investigative-chat',
    query: 'Investigate the Vodafone business margin anomaly',
    mode: 'investigative',
    timestamp: '2026-06-22T10:00:00Z',
    kpis: [],
    chatMessages: [
      { id: 'm1', role: 'user', content: 'Investigate the Vodafone business margin anomaly', timestamp: '10:00' },
      { 
        id: 'm2', 
        role: 'ai', 
        content: 'I have analyzed the margin anomaly for the Vodafone account. The overall margin dropped from 42% to 28% in the last quarter. This is primarily driven by a surge in cloud infrastructure costs and unbilled support hours.', 
        timestamp: '10:01',
        insights: [
          {
            title: 'Cost Drivers',
            items: [
              'AWS Egress Costs: +$125K over budget in US-East-1.',
              'Unbilled Support: 450 hours logged as pre-sales instead of billable support.',
              'SLA Penalties: $15K penalty triggered by a 42-minute outage in August.'
            ]
          },
          {
            title: 'Next Steps',
            items: [
              'Implement AWS Cost Anomaly Detection alerts for egress traffic.',
              'Re-classify the 450 support hours to the correct billable code.'
            ]
          }
        ],
        chart: {
          id: 'chart-voda-margin',
          type: 'bar', title: 'Vodafone Margin vs Target (%)', caption: '',
          dataKey: 'margin', xKey: 'quarter',
          data: [
            { quarter: 'Q1', margin: 43 },
            { quarter: 'Q2', margin: 42 },
            { quarter: 'Q3', margin: 28 },
          ]
        },
        suggestedFollowUps: ['Show me the resource allocation breakdown', 'Generate a full analytical report'] 
      }
    ],
    narrative: { findings: '', drivers: '', improvements: '', gaps: '', dashboardLinks: [] },
    charts: [],
    recommendedPrompts: []
  }
};

// ── Default result shown on landing ──────────────────────────────────────────

export const DEFAULT_QUERY_MAP: Array<{ keywords: string[]; resultId: string; autoMode: StrategyMode }> = [
  { keywords: ['vois total revenue', 'global revenue', 'what is vois'], resultId: 'vois-revenue-chat', autoMode: 'chat' },
  { keywords: ['region and show me', 'break this down by region', 'show me the charts'], resultId: 'vois-revenue-visual', autoMode: 'visual' },
  { keywords: ['table of department', 'budget vs actuals', 'table'], resultId: 'vois-budget-table', autoMode: 'spreadsheet' },
  { keywords: ['analysis: why', 'emea margin declining', 'analysis'], resultId: 'vois-emea-analysis', autoMode: 'analytical' },
  { keywords: ['compare engineering', 'headcount cost vs sales', 'compare'], resultId: 'vois-headcount-compare', autoMode: 'visual' },
  { keywords: ['apac margin expanding', 'apac margin'], resultId: 'vois-apac-margin-analysis', autoMode: 'analytical' },
  { keywords: ['investigate', 'vodafone business margin anomaly'], resultId: 'vois-investigative-chat', autoMode: 'investigative' }
];

export function findResult(query: string, _mode?: string): QueryResult {
  const q = query.toLowerCase();
  
  // Exact matches for the demo flow
  if (q.includes('what is vois total revenue') || q.includes('global revenue this quarter')) return MOCK_RESULTS['vois-revenue-chat'];
  if (q.includes('break this down by region')) return MOCK_RESULTS['vois-revenue-visual'];
  if (q.includes('table of department budget')) return MOCK_RESULTS['vois-budget-table'];
  if (q.includes('emea margin declining')) return MOCK_RESULTS['vois-emea-analysis'];
  if (q.includes('apac margin expanding')) return MOCK_RESULTS['vois-apac-margin-analysis'];
  if (q.includes('compare engineering headcount')) return MOCK_RESULTS['vois-headcount-compare'];
  if (q.includes('investigate the vodafone')) return MOCK_RESULTS['vois-investigative-chat'];

  // Keyword matching
  for (const mapping of DEFAULT_QUERY_MAP) {
    if (mapping.keywords.some((k) => q.includes(k))) {
      return MOCK_RESULTS[mapping.resultId];
    }
  }
  
  // Fallback to the first one
  return MOCK_RESULTS['vois-revenue-chat'];
}

// ── Session History ───────────────────────────────────────────────────────────

export const SESSION_HISTORY: SessionGroup[] = [
  {
    label: 'Today · Session',
    sessions: [
      { id: 's1', query: 'What is VOIS total revenue for Q3?', timestamp: '09:00', resultId: 'vois-revenue-chat', mode: 'chat', sessionThreadId: 'thread-demo' } as SessionEntry,
      { id: 's2', query: 'Break this down by region and show me the charts', timestamp: '09:02', resultId: 'vois-revenue-visual', mode: 'visual', sessionThreadId: 'thread-demo', isFollowUp: true } as SessionEntry,
      { id: 's3', query: 'Give me a table of department budget vs actuals', timestamp: '09:05', resultId: 'vois-budget-table', mode: 'spreadsheet', sessionThreadId: 'thread-demo', isFollowUp: true, autoDetectedMode: true } as SessionEntry,
      { id: 's4', query: 'Analysis: why is the EMEA margin declining?', timestamp: '09:10', resultId: 'vois-emea-analysis', mode: 'analytical', sessionThreadId: 'thread-demo', isFollowUp: true, autoDetectedMode: true } as SessionEntry,
      { id: 's5', query: 'Compare Engineering headcount cost vs Sales', timestamp: '09:15', resultId: 'vois-headcount-compare', mode: 'visual', sessionThreadId: 'thread-demo', isFollowUp: true, autoDetectedMode: true } as SessionEntry,
    ],
  },
  {
    label: 'Yesterday',
    sessions: [
      { id: 's6', query: 'Show me APAC tech spend vs budget', timestamp: 'Jun 20', resultId: 'vois-revenue-chat', mode: 'visual', sessionThreadId: 'thread-old' } as SessionEntry,
    ],
  }
];
