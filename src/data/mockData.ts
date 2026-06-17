import type { DataDomain, QueryResult, SessionGroup, SessionEntry } from '../types';

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

  'q3-headcount': {
    id: 'q3-headcount',
    query: "What's driving the Q3 headcount cost increase?",
    mode: 'visual',
    timestamp: '2026-06-13T08:30:00Z',
    kpis: [
      { id: 'k1', title: 'Total Headcount Cost', value: '$142.4M', rawValue: 142.4, unit: 'M', trend: '+18.3%', trendDirection: 'up', health: 'red', sparkline: [98, 104, 109, 118, 127, 134, 142], subText: 'vs $120.3M Q2' },
      { id: 'k2', title: 'Active Headcount', value: '8,214', rawValue: 8214, unit: '', trend: '+6.2%', trendDirection: 'up', health: 'amber', sparkline: [7400, 7580, 7720, 7890, 7990, 8100, 8214], subText: 'vs 7,734 Q2' },
      { id: 'k3', title: 'Avg. Salary (Blended)', value: '$173.4K', rawValue: 173.4, unit: 'K', trend: '+11.4%', trendDirection: 'up', health: 'red', sparkline: [148, 152, 158, 163, 167, 170, 173], subText: 'Market compression' },
      { id: 'k4', title: 'Attrition Rate', value: '9.2%', rawValue: 9.2, unit: '%', trend: '-1.8pp', trendDirection: 'down', health: 'green', sparkline: [13, 12.4, 11.8, 11.2, 10.5, 9.8, 9.2], subText: 'Improving trend' },
    ],
    narrative: {
      findings: `**Q3 headcount costs surged 18.3% QoQ**, reaching $142.4M against a budgeted $128.0M — a $14.4M overrun. Three discrete events account for 94% of this variance:\n\n1. **Senior engineering hires** (APAC & EMEA expansion) added $6.2M in annualised comp\n2. **Mid-cycle merit increase** of 4.5% pulled forward from Q4 added $5.1M\n3. **Contractor-to-FTE conversions** (38 roles) added $2.3M in benefit loading`,
      drivers: `The primary cost driver is **talent market pressure in APAC**. Competitor salary benchmarks (Radford Q3 data) show a 12–15% premium for senior engineering roles in Singapore and Bangalore. The decision to match market rate was made in August, triggering the mid-cycle merit round.\n\nSecondary driver: **backfill delays** in Q1–Q2 compressed headcount artificially, and Q3 saw pent-up hiring materialise simultaneously across 4 business units.`,
      improvements: `- **Stagger hiring cohorts** across quarters to smooth cost recognition\n- **Establish a rolling talent market review** (quarterly Radford benchmarking) to avoid reactive mid-cycle adjustments\n- **Increase contractor utilisation** for project-based roles to reduce benefit loading exposure`,
      gaps: `- No visibility into **projected Q4 comp uplift** from 12 offers-in-progress\n- **HR APAC dashboard** has a 3-week data lag — Singapore headcount figures may be understated by ~80 FTEs\n- Variable pay accruals are not yet reflected in the $142.4M figure`,
      mermaidChart: `flowchart TD
    A[Q3 Headcount Cost +18.3%] --> B[Senior APAC/EMEA Hires\\n+$6.2M]
    A --> C[Mid-Cycle Merit Increase\\n+$5.1M]
    A --> D[Contractor → FTE Conversion\\n+$2.3M]
    B --> E[Talent Market Pressure\\nRadford +12-15% premium]
    C --> F[Q1-Q2 Backfill Delays\\nPent-up demand released]
    D --> G[Benefit Loading\\n+22% on base comp]
    E --> H[Board Decision: Match Market Rate]
    F --> H
    H --> I[Simultaneous Hiring Across 4 BUs]`,
      dashboardLinks: [
        { id: 'dl1', title: 'HR Global Headcount Dashboard', description: 'Live headcount by region, grade, and department', department: 'HR', url: '#', lastUpdated: 'Jun 13, 2026' },
        { id: 'dl2', title: 'APAC Talent Acquisition Report', description: 'Hiring pipeline, offer acceptance rates, time-to-fill', department: 'HR', url: '#', lastUpdated: 'Jun 12, 2026' },
      ],
    },
    charts: [
      {
        type: 'bar', title: 'Headcount Cost by Department (Q3)', caption: 'Engineering shows the steepest QoQ rise (+31%), driven entirely by APAC senior hires. G&A is the only function within budget.',
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
        type: 'waterfall', title: 'Q3 vs Q2 Cost Bridge ($M)', caption: 'The waterfall clearly shows merit increases and new hires as the dominant cost add, partially offset by attrition savings.',
        dataKey: 'value', xKey: 'category',
        data: [
          { category: 'Q2 Base', value: 120.3, type: 'base' },
          { category: 'New Hires', value: 6.2, type: 'add' },
          { category: 'Merit Increase', value: 5.1, type: 'add' },
          { category: 'FTE Conversion', value: 2.3, type: 'add' },
          { category: 'Attrition Savings', value: -3.8, type: 'subtract' },
          { category: 'Severance', value: 1.2, type: 'add' },
          { category: 'Benefits Adj.', value: 1.1, type: 'add' },
          { category: 'Q3 Actual', value: 142.4, type: 'total' },
        ],
      },
      {
        type: 'scatter', title: 'Headcount vs Cost per Dept', caption: 'Engineering is a clear outlier — highest cost-per-head at $212K blended, 34% above company average. Indicates market-rate pressure is concentrated.',
        dataKey: 'cost', xKey: 'headcount', yKey: 'costPerHead',
        data: [
          { dept: 'Engineering', headcount: 2760, costPerHead: 212, cost: 58.4 },
          { dept: 'Sales', headcount: 1840, costPerHead: 169, cost: 31.2 },
          { dept: 'Services', headcount: 1650, costPerHead: 150, cost: 24.8 },
          { dept: 'Product', headcount: 980, costPerHead: 190, cost: 18.6 },
          { dept: 'G&A', headcount: 984, costPerHead: 95, cost: 9.4 },
        ],
      },
      {
        type: 'heatmap', title: 'Turnover Hotspots', caption: 'High turnover concentrated in Junior Engineering and Sales roles in the UK and US.',
        dataKey: '', xKey: '',
        data: [
          { name: 'Engineering', 'UK': 14.2, 'US': 12.1, 'India': 6.4, 'Germany': 8.1 },
          { name: 'Sales', 'UK': 16.5, 'US': 15.2, 'India': 9.1, 'Germany': 7.4 },
          { name: 'Marketing', 'UK': 8.4, 'US': 9.2, 'India': 5.1, 'Germany': 6.2 },
          { name: 'Support', 'UK': 11.2, 'US': 10.4, 'India': 12.1, 'Germany': 9.4 },
        ]
      },
      {
        type: 'line', title: 'Headcount Growth Trend (12-Month)', caption: 'Headcount growth accelerated sharply in Q3 after being flat for two quarters.',
        dataKey: 'headcount', xKey: 'month',
        lines: [
          { key: 'headcount', color: '#3b82f6', label: 'Total Headcount' }
        ],
        data: [
          { month: 'Oct', headcount: 8100 }, { month: 'Nov', headcount: 8120 }, { month: 'Dec', headcount: 8150 },
          { month: 'Jan', headcount: 8140 }, { month: 'Feb', headcount: 8130 }, { month: 'Mar', headcount: 8150 },
          { month: 'Apr', headcount: 8190 }, { month: 'May', headcount: 8250 }, { month: 'Jun', headcount: 8320 },
        ]
      },
      {
        type: 'pie', title: 'Global Headcount Distribution', caption: 'APAC now represents 38% of total headcount following the recent expansion.',
        dataKey: 'value', xKey: 'region',
        data: [
          { region: 'APAC', value: 3160 },
          { region: 'Americas', value: 2990 },
          { region: 'EMEA', value: 2170 },
        ]
      }
    ],
    recommendedPrompts: [
      { id: 'rp1', label: 'Break down by region', query: 'Break down the Q3 headcount cost increase by region' },
      { id: 'rp2', label: 'What is the Q4 forecast?', query: 'What is the Q4 headcount cost forecast given current hiring pipeline?' },
      { id: 'rp3', label: 'Compare to industry benchmarks', query: 'How does our blended salary rate compare to industry benchmarks?' },
    ],
  },

  'emea-headcount': {
    id: 'emea-headcount',
    query: "Show me the EMEA regional headcount breakdown",
    mode: 'visual',
    kpis: [
      { id: 'k1', title: 'EMEA Total Cost', value: '$38.2M', rawValue: 38.2, unit: 'M', trend: '+4.1%', trendDirection: 'up', health: 'amber', sparkline: [35, 35.5, 36.7, 38.2], subText: 'vs $36.7M Q2' },
      { id: 'k2', title: 'EMEA Headcount', value: '2,145', rawValue: 2145, unit: '', trend: '+1.2%', trendDirection: 'up', health: 'amber', sparkline: [2100, 2110, 2120, 2145], subText: 'vs 2,120 Q2' },
      { id: 'k3', title: 'Avg. Salary (EMEA)', value: '$115.8K', rawValue: 115.8, unit: 'K', trend: '+2.8%', trendDirection: 'up', health: 'amber', sparkline: [110, 112, 112.6, 115.8], subText: 'Market compression' },
      { id: 'k4', title: 'Attrition Rate', value: '11.4%', rawValue: 11.4, unit: '%', trend: '+0.5pp', trendDirection: 'up', health: 'red', sparkline: [10.5, 10.9, 11.4], subText: 'Worsening trend' },
    ],
    narrative: {
      findings: "**EMEA headcount costs grew 4.1% QoQ** to $38.2M. While overall headcount remained relatively flat (+1.2%), the cost increase is primarily driven by **senior engineering hires in London and Berlin**, which increased the average blended salary. Attrition remains elevated at 11.4%.",
      drivers: "1. **London Expansion:** Added 45 senior engineers driving $2.1M in annualized comp. 2. **Return-to-Office Mandate:** Caused a localized attrition spike in Q2/Q3, leading to higher recruitment and sign-on bonus costs. 3. **Currency Fluctuations:** Favorable GBP/EUR exchange rates offset $400k in potential cost increases.",
      improvements: "- Expand hiring in Madrid to offset London cost compression\n- Review London RTO mandate impact on retention",
      gaps: "- Q4 compensation review cycle adjustments not included\n- Contractor spend is tracked in a separate ledger",
      dashboardLinks: [
        { id: '1', title: 'EMEA HR Dashboard', url: '#', description: 'Regional headcount and compensation', department: 'HR', lastUpdated: 'Today' }
      ],
    },
    charts: [
      {
        type: 'bar', title: 'EMEA Headcount Cost by Hub (Q3)', caption: 'London and Berlin account for 68% of total EMEA costs.',
        dataKey: 'cost', xKey: 'hub',
        data: [
          { hub: 'London', cost: 15.2 },
          { hub: 'Berlin', cost: 10.8 },
          { hub: 'Paris', cost: 5.4 },
          { hub: 'Amsterdam', cost: 4.1 },
          { hub: 'Madrid', cost: 2.7 },
        ],
      },
      {
        type: 'pie', title: 'EMEA Headcount by Function', caption: 'Engineering makes up 42% of EMEA headcount, Sales at 31%.',
        dataKey: 'value', xKey: 'name',
        data: [
          { name: 'Engineering', value: 900 },
          { name: 'Sales', value: 665 },
          { name: 'Marketing', value: 280 },
          { name: 'Support', value: 300 },
        ],
      },
      {
        type: 'line', title: 'EMEA Attrition Trend (LTM)', caption: 'Attrition spiked in Q2 following the return-to-office mandate in London.',
        xKey: 'month', referenceValue: 10, dataKey: 'rate',
        lines: [
          { key: 'rate', color: '#e74c3c', label: 'Attrition Rate (%)' }
        ],
        data: [
          { month: 'Jan', rate: 8.2 }, { month: 'Feb', rate: 8.5 }, { month: 'Mar', rate: 8.1 },
          { month: 'Apr', rate: 12.4 }, { month: 'May', rate: 14.1 }, { month: 'Jun', rate: 11.2 },
          { month: 'Jul', rate: 11.4 },
        ],
      }
    ],
    recommendedPrompts: [
      { id: 'p1', label: 'Attrition spike cause', query: "What caused the attrition spike in April?" },
      { id: 'p2', label: 'Compare London vs Berlin', query: "Compare London vs Berlin engineering costs" }
    ],
    timestamp: '2026-06-13T10:15:00Z',
  },
  'apac-tech-spend': {
    id: 'apac-tech-spend',
    query: 'Show me APAC tech spend vs budget',
    mode: 'visual',
    timestamp: '2026-06-13T09:15:00Z',
    kpis: [
      { id: 'k1', title: 'APAC Tech Spend YTD', value: '$38.7M', rawValue: 38.7, unit: 'M', trend: '+22.1%', trendDirection: 'up', health: 'red', sparkline: [22, 25, 28, 31, 34, 36, 38.7], subText: 'vs $31.7M budget' },
      { id: 'k2', title: 'Cloud Utilisation', value: '71.4%', rawValue: 71.4, unit: '%', trend: '+8.2pp', trendDirection: 'up', health: 'amber', sparkline: [58, 61, 63, 66, 68, 70, 71.4], subText: 'Target: 80%' },
      { id: 'k3', title: 'SaaS License Waste', value: '$2.1M', rawValue: 2.1, unit: 'M', trend: '-12%', trendDirection: 'down', health: 'amber', sparkline: [3.2, 3.0, 2.8, 2.6, 2.4, 2.2, 2.1], subText: 'Unused seats' },
      { id: 'k4', title: 'Budget Overrun', value: '$7.0M', rawValue: 7.0, unit: 'M', trend: '+22.1%', trendDirection: 'up', health: 'red', sparkline: [1.2, 2.1, 3.4, 4.5, 5.6, 6.2, 7.0], subText: 'Accelerating' },
    ],
    narrative: {
      findings: `APAC tech spend is **$7.0M over budget YTD**, with the overrun accelerating each month since March. Cloud costs are the primary culprit, representing 68% of the variance.`,
      drivers: `AWS Singapore region costs increased 34% due to unoptimised EC2 instance sizing and a new data replication requirement for regulatory compliance. SaaS spend is partially offset by a renegotiated Salesforce contract saving $0.8M annually.`,
      improvements: `- Right-size EC2 instances (estimated $2.4M annual saving)\n- Consolidate SaaS vendors — 3 overlapping tools identified\n- Implement FinOps tagging to improve cost attribution`,
      gaps: `- Azure APAC costs are not yet included in this view\n- Q4 committed spend contracts not reflected`,
      dashboardLinks: [
        { id: 'dl1', title: 'APAC Cloud Cost Dashboard', description: 'AWS & Azure spend by service, region, and team', department: 'Technology', url: '#', lastUpdated: 'Jun 13, 2026' },
      ],
    },
    charts: [
      {
        type: 'waterfall', title: 'Tech Spend Category Bridge ($M)', caption: 'Cloud overruns drive 68% of total variance. SaaS savings partially offset the damage but are insufficient.',
        dataKey: 'value', xKey: 'category',
        data: [
          { category: 'Budget', value: 31.7, type: 'base' },
          { category: 'Cloud (AWS)', value: 5.8, type: 'add' },
          { category: 'Data Compliance', value: 1.9, type: 'add' },
          { category: 'New SaaS Tools', value: 1.1, type: 'add' },
          { category: 'SaaS Savings', value: -0.8, type: 'subtract' },
          { category: 'Hardware', value: 0.9, type: 'add' },
          { category: 'Other', value: -0.9, type: 'subtract' },
          { category: 'Actual', value: 38.7, type: 'total' },
        ],
      },
      {
        type: 'pie', title: 'SaaS License Spend by Category', caption: 'CRM and Marketing Automation make up 62% of SaaS costs. Consolidation opportunities exist in Project Management.',
        dataKey: 'spend', xKey: 'category',
        data: [
          { category: 'CRM', spend: 2.1 },
          { category: 'Marketing', spend: 1.4 },
          { category: 'Project Mgmt', spend: 0.8 },
          { category: 'Design', spend: 0.5 },
          { category: 'Other', spend: 0.8 },
        ],
      },
      {
        type: 'scatter', title: 'Team Spend vs Utilisation', caption: 'Teams in the bottom-right quadrant (high spend, low utilisation) represent the highest optimisation opportunity. Platform Eng is the priority.',
        dataKey: 'spend', xKey: 'utilisation', yKey: 'spend',
        data: [
          { team: 'Platform Eng', utilisation: 54, spend: 12.4 },
          { team: 'Data & AI', utilisation: 88, spend: 9.8 },
          { team: 'Core Apps', utilisation: 72, spend: 7.2 },
          { team: 'Security', utilisation: 91, spend: 4.6 },
          { team: 'DevOps', utilisation: 67, spend: 4.7 },
        ],
      }
    ],
    recommendedPrompts: [
      { id: 'rp1', label: 'Which teams are over budget?', query: 'Which APAC technology teams are most over budget?' },
      { id: 'rp2', label: 'Cloud optimisation savings', query: 'What are the projected savings from cloud right-sizing in APAC?' },
      { id: 'rp3', label: 'Compare EMEA vs APAC', query: 'Compare EMEA and APAC technology spend patterns' },
    ],
  },

  'service-margins': {
    id: 'service-margins',
    query: 'Where are service margins being compressed?',
    mode: 'visual',
    timestamp: '2026-06-12T14:20:00Z',
    kpis: [
      { id: 'k1', title: 'Blended Service Margin', value: '31.2%', rawValue: 31.2, unit: '%', trend: '-6.8pp', trendDirection: 'down', health: 'red', sparkline: [42, 40, 38, 36, 35, 33, 31.2], subText: 'Target: 40%' },
      { id: 'k2', title: 'Revenue (Services)', value: '$89.4M', rawValue: 89.4, unit: 'M', trend: '+4.1%', trendDirection: 'up', health: 'green', sparkline: [72, 75, 78, 82, 85, 87, 89.4], subText: 'Growing but margin falling' },
      { id: 'k3', title: 'Delivery Cost', value: '$61.5M', rawValue: 61.5, unit: 'M', trend: '+17.8%', trendDirection: 'up', health: 'red', sparkline: [42, 45, 48, 52, 56, 59, 61.5], subText: 'Labour + tooling' },
      { id: 'k4', title: 'Utilisation Rate', value: '74.2%', rawValue: 74.2, unit: '%', trend: '-4.1pp', trendDirection: 'down', health: 'red', sparkline: [84, 83, 81, 79, 77, 76, 74.2], subText: 'Bench cost rising' },
    ],
    narrative: {
      findings: `Service margins have compressed by **6.8 percentage points** in 6 months, falling from 38% to 31.2% — well below the 40% target. Revenue is growing but cost of delivery is outpacing it significantly.`,
      drivers: `Three compounding forces: rising senior consultant salaries, a 4.1pp drop in utilisation (more bench time), and increased tooling costs from new delivery platforms. The EMEA practice is the hardest hit at 24.1% margin.`,
      improvements: `- Target 80%+ utilisation through improved project pipeline management\n- Review EMEA pricing model — rate cards may be 2 years stale\n- Automate repetitive delivery tasks to reduce senior resource requirements`,
      gaps: `- Subcontractor costs are tracked separately and not included here\n- Client profitability view not yet available at project level`,
      dashboardLinks: [
        { id: 'dl1', title: 'Services P&L Dashboard', description: 'Margin by practice, region, and client', department: 'Services', url: '#', lastUpdated: 'Jun 11, 2026' },
      ],
    },
    charts: [
      {
        type: 'line', title: 'Margin Trend: 6-Month Rolling (%)', caption: 'The downward trend is steepening month-on-month. Without intervention, margin will breach 28% by Q4.',
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
        type: 'scatter', title: 'Region: Revenue vs Margin %', caption: 'EMEA is a critical concern — high revenue but the lowest margin at 24.1%. Americas is the only region meeting the 40% target.',
        dataKey: 'margin', xKey: 'revenue', yKey: 'margin',
        data: [
          { region: 'Americas', revenue: 38.4, margin: 41.2 },
          { region: 'EMEA', revenue: 31.2, margin: 24.1 },
          { region: 'APAC', revenue: 19.8, margin: 32.7 },
        ],
      },
      {
        type: 'bar', title: 'Service Margin by Practice Area', caption: 'Managed Services is the only practice above target. Consulting and Implementation are below 30% — the worst performers in 3 years.',
        dataKey: 'margin', xKey: 'practice',
        data: [
          { practice: 'Managed Svcs', margin: 44.2, target: 40 },
          { practice: 'Consulting', margin: 28.1, target: 40 },
          { practice: 'Implementation', margin: 26.4, target: 40 },
          { practice: 'Support', margin: 38.7, target: 40 },
          { practice: 'Training', margin: 22.9, target: 40 },
        ],
      }
    ],
    recommendedPrompts: [
      { id: 'rp1', label: 'EMEA deep dive', query: 'Give me a deep dive on EMEA service margin compression' },
      { id: 'rp2', label: 'Pricing model analysis', query: 'When were our service rate cards last updated and are they market competitive?' },
      { id: 'rp3', label: 'Utilisation improvement plan', query: 'What actions would raise utilisation from 74% to 82%?' },
    ],
  },

  // ── NEW: Chat mode — conversational quick answer ────────────────────────────
  'revenue-chat': {
    id: 'revenue-chat',
    query: 'What is our global revenue this quarter?',
    mode: 'chat',
    timestamp: '2026-06-16T08:00:00Z',
    kpis: [],
    narrative: { findings: '', drivers: '', improvements: '', gaps: '', dashboardLinks: [] },
    charts: [],
    recommendedPrompts: [],
    chatMessages: [
      {
        id: 'cm1',
        role: 'ai',
        content: 'Global revenue for **Q3 FY2026** is **$287.3M**, up **4.1% QoQ** from $275.9M — broadly on track with the annual plan of $1.1B.\n\n**Regional split:**\n• Americas — $115.2M (+6.2%)\n• EMEA — $98.4M (+1.8%) — growth slowing\n• APAC — $73.7M (+4.9%)\n\nServices revenue grew faster (+8.2%) than product revenue (+2.1%). Overall margin stands at 31.2%, which is below the 40% target.',
        timestamp: '08:30',
        suggestedFollowUps: [
          'Why is EMEA growth slowing?',
          'What is driving the services revenue increase?',
          'Delve deeper into regional revenue performance',
          'Generate charts for revenue breakdown',
        ],
      },
    ],
  },

  // ── NEW: Spreadsheet mode — Excel-style budget table ───────────────────────
  'budget-spreadsheet': {
    id: 'budget-spreadsheet',
    query: 'Show me departmental budget vs actuals',
    mode: 'spreadsheet',
    timestamp: '2026-06-16T09:00:00Z',
    kpis: [
      { id: 'k1', title: 'Total Budget', value: '$521.0M', rawValue: 521.0, unit: 'M', trend: 'FY2026 Plan', trendDirection: 'flat', health: 'green', sparkline: [521], subText: 'Annual approved' },
      { id: 'k2', title: 'Total Actuals (YTD)', value: '$548.7M', rawValue: 548.7, unit: 'M', trend: '+$27.7M', trendDirection: 'up', health: 'red', sparkline: [430, 470, 510, 548.7], subText: 'Year-to-date' },
      { id: 'k3', title: 'Variance', value: '+$27.7M', rawValue: 27.7, unit: 'M', trend: '+5.3%', trendDirection: 'up', health: 'red', sparkline: [5, 12, 19, 27.7], subText: 'Over budget' },
      { id: 'k4', title: 'Depts Over Budget', value: '3 of 6', rawValue: 3, unit: '', trend: 'Engineering worst', trendDirection: 'up', health: 'red', sparkline: [1, 2, 2, 3], subText: 'Eng, Sales, Product' },
    ],
    narrative: { findings: '', drivers: '', improvements: '', gaps: '', dashboardLinks: [] },
    charts: [],
    recommendedPrompts: [],
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

  // ── NEW: Visual with drill-down — regional revenue ─────────────────────────
  'regional-drilldown': {
    id: 'regional-drilldown',
    query: 'Show me regional revenue performance',
    mode: 'visual',
    timestamp: '2026-06-16T10:00:00Z',
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
        { id: 'dl1', title: 'Revenue Intelligence Dashboard', description: 'Live pipeline, wins, and regional splits', department: 'Finance', url: '#', lastUpdated: 'Jun 16, 2026' },
      ],
    },
    charts: [
      {
        type: 'bar', title: 'Revenue by Region (Q3 FY2026, $M)', caption: 'Click any region bar to drill into country-level breakdown.',
        dataKey: 'revenue', xKey: 'region',
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
        type: 'pie', title: 'Revenue Mix by Product Line', caption: 'SaaS now represents 58% of total revenue — up from 44% two years ago.',
        dataKey: 'revenue', xKey: 'line',
        data: [
          { line: 'SaaS Subscriptions', revenue: 166.6 },
          { line: 'Professional Services', revenue: 80.4 },
          { line: 'Maintenance & Support', revenue: 40.3 },
        ],
      },
      {
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
      { id: 'rp1', label: 'EMEA pipeline review', query: 'What is in the EMEA Q4 pipeline and what is at risk?' },
      { id: 'rp2', label: 'Americas top accounts', query: 'Show me the top 10 Americas accounts by revenue' },
    ],
  },

  // ── NEW: Analytical headcount — same question, narrative focus ─────────────
  'q3-headcount-analytical': {
    id: 'q3-headcount-analytical',
    query: "What's driving the Q3 headcount cost increase?",
    mode: 'analytical',
    timestamp: '2026-06-13T08:30:00Z',
    kpis: [
      { id: 'k1', title: 'Total Headcount Cost', value: '$142.4M', rawValue: 142.4, unit: 'M', trend: '+18.3%', trendDirection: 'up', health: 'red', sparkline: [98, 104, 109, 118, 127, 134, 142], subText: 'vs $120.3M Q2' },
      { id: 'k2', title: 'Active Headcount', value: '8,214', rawValue: 8214, unit: '', trend: '+6.2%', trendDirection: 'up', health: 'amber', sparkline: [7400, 7580, 7720, 7890, 7990, 8100, 8214], subText: 'vs 7,734 Q2' },
      { id: 'k3', title: 'Avg. Salary (Blended)', value: '$173.4K', rawValue: 173.4, unit: 'K', trend: '+11.4%', trendDirection: 'up', health: 'red', sparkline: [148, 152, 158, 163, 167, 170, 173], subText: 'Market compression' },
      { id: 'k4', title: 'Attrition Rate', value: '9.2%', rawValue: 9.2, unit: '%', trend: '-1.8pp', trendDirection: 'down', health: 'green', sparkline: [13, 12.4, 11.8, 11.2, 10.5, 9.8, 9.2], subText: 'Improving trend' },
    ],
    narrative: {
      findings: `**Q3 headcount costs surged 18.3% QoQ**, reaching $142.4M against a budgeted $128.0M — a $14.4M overrun. Three discrete events account for 94% of this variance:\n\n1. **Senior engineering hires** (APAC & EMEA expansion) added $6.2M in annualised comp\n2. **Mid-cycle merit increase** of 4.5% pulled forward from Q4 added $5.1M\n3. **Contractor-to-FTE conversions** (38 roles) added $2.3M in benefit loading`,
      drivers: `The primary cost driver is **talent market pressure in APAC**. Competitor salary benchmarks (Radford Q3 data) show a 12–15% premium for senior engineering roles in Singapore and Bangalore. The decision to match market rate was made in August, triggering the mid-cycle merit round.\n\nSecondary driver: **backfill delays** in Q1–Q2 compressed headcount artificially, and Q3 saw pent-up hiring materialise simultaneously across 4 business units.`,
      improvements: `- **Stagger hiring cohorts** across quarters to smooth cost recognition\n- **Establish a rolling talent market review** (quarterly Radford benchmarking) to avoid reactive mid-cycle adjustments\n- **Increase contractor utilisation** for project-based roles to reduce benefit loading exposure`,
      gaps: `- No visibility into **projected Q4 comp uplift** from 12 offers-in-progress\n- **HR APAC dashboard** has a 3-week data lag — Singapore headcount figures may be understated by ~80 FTEs`,
      mermaidChart: `flowchart TD
    A[Q3 Headcount Cost +18.3%] --> B[Senior APAC/EMEA Hires\\n+$6.2M]
    A --> C[Mid-Cycle Merit Increase\\n+$5.1M]
    A --> D[Contractor → FTE Conversion\\n+$2.3M]
    B --> E[Talent Market Pressure\\nRadford +12-15% premium]
    C --> F[Q1-Q2 Backfill Delays\\nPent-up demand released]
    D --> G[Benefit Loading\\n+22% on base comp]
    E --> H[Board Decision: Match Market Rate]
    F --> H
    H --> I[Simultaneous Hiring Across 4 BUs]`,
      dashboardLinks: [
        { id: 'dl1', title: 'HR Global Headcount Dashboard', description: 'Live headcount by region, grade, and department', department: 'HR', url: '#', lastUpdated: 'Jun 13, 2026' },
        { id: 'dl2', title: 'APAC Talent Acquisition Report', description: 'Hiring pipeline, offer acceptance rates, time-to-fill', department: 'HR', url: '#', lastUpdated: 'Jun 12, 2026' },
      ],
    },
    charts: [
      {
        type: 'bar', title: 'Headcount Cost by Department (Q3)', caption: 'Engineering shows the steepest QoQ rise (+31%). G&A is the only function within budget.',
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
        type: 'waterfall', title: 'Q3 vs Q2 Cost Bridge ($M)', caption: 'Merit increases and new hires are the dominant cost adds, partially offset by attrition savings.',
        dataKey: 'value', xKey: 'category',
        data: [
          { category: 'Q2 Base', value: 120.3, type: 'base' },
          { category: 'New Hires', value: 6.2, type: 'add' },
          { category: 'Merit Increase', value: 5.1, type: 'add' },
          { category: 'FTE Conversion', value: 2.3, type: 'add' },
          { category: 'Attrition Savings', value: -3.8, type: 'subtract' },
          { category: 'Severance', value: 1.2, type: 'add' },
          { category: 'Benefits Adj.', value: 1.1, type: 'add' },
          { category: 'Q3 Actual', value: 142.4, type: 'total' },
        ],
      },
    ],
    recommendedPrompts: [
      { id: 'rp1', label: 'Q4 forecast', query: 'What is the Q4 headcount cost forecast given current hiring pipeline?' },
      { id: 'rp2', label: 'Compare to Visual view', query: "Show me visual charts for the Q3 headcount cost increase" },
    ],
  },
};

// ── Default result shown on landing ──────────────────────────────────────────

export const DEFAULT_QUERY_MAP: Array<{ keywords: string[]; resultId: string }> = [
  { keywords: ['revenue', 'quick', 'global revenue', 'sales total', 'what is'], resultId: 'revenue-chat' },
  { keywords: ['budget', 'actuals', 'departmental', 'spreadsheet', 'table', 'forecast vs'], resultId: 'budget-spreadsheet' },
  { keywords: ['regional', 'region', 'country', 'americas', 'emea performance', 'drilldown', 'drill down'], resultId: 'regional-drilldown' },
  { keywords: ['headcount', 'hr', 'salary', 'hiring', 'workforce', 'attrition', 'employee'], resultId: 'q3-headcount' },
  { keywords: ['tech', 'cloud', 'apac', 'aws', 'azure', 'software', 'saas', 'infrastructure', 'spend'], resultId: 'apac-tech-spend' },
  { keywords: ['emea', 'london', 'berlin', 'europe'], resultId: 'emea-headcount' },
  { keywords: ['service', 'margin', 'delivery', 'consulting', 'practice', 'utilisation'], resultId: 'service-margins' },
];

export function findResult(query: string, mode?: string): QueryResult {
  const q = query.toLowerCase();
  
  // Exact matches for landing page example questions
  if (q === 'what is our global revenue this quarter?') return MOCK_RESULTS['revenue-chat'];
  if (q === 'show me departmental budget vs actuals') return MOCK_RESULTS['budget-spreadsheet'];
  if (q === 'show me regional revenue performance') return MOCK_RESULTS['regional-drilldown'];
  if (q === "what's driving the q3 headcount cost increase?" || q === "what is driving the q3 headcount cost increase?") {
    return mode === 'analytical' ? MOCK_RESULTS['q3-headcount-analytical'] : MOCK_RESULTS['q3-headcount'];
  }

  // Analytical headcount override
  if ((q.includes('headcount') || q.includes('hr')) && mode === 'analytical') {
    return MOCK_RESULTS['q3-headcount-analytical'];
  }

  // Keyword matching
  for (const mapping of DEFAULT_QUERY_MAP) {
    if (mapping.keywords.some((k) => q.includes(k))) {
      return MOCK_RESULTS[mapping.resultId];
    }
  }
  
  return MOCK_RESULTS['q3-headcount'];
}

// ── Session History ───────────────────────────────────────────────────────────

export const SESSION_HISTORY: SessionGroup[] = [
  {
    label: 'Today',
    sessions: [
      { id: 's-r1', query: 'What is our global revenue this quarter?', timestamp: '08:15', resultId: 'revenue-chat', sessionThreadId: 'thread-1' } as SessionEntry,
      { id: 's-r2', query: 'Why is EMEA growth slowing?', timestamp: '08:18', resultId: 'emea-headcount', sessionThreadId: 'thread-1', isFollowUp: true } as SessionEntry,
      { id: 's1', query: "What's driving the Q3 headcount cost increase?", timestamp: '08:30', resultId: 'q3-headcount', sessionThreadId: 'thread-2' } as SessionEntry,
      { id: 's1b', query: 'Delve deeper into Engineering cost drivers', timestamp: '08:35', resultId: 'q3-headcount-analytical', sessionThreadId: 'thread-2', isFollowUp: true } as SessionEntry,
      { id: 's2', query: 'Show me APAC tech spend vs budget', timestamp: '09:15', resultId: 'apac-tech-spend', sessionThreadId: 'thread-3' } as SessionEntry,
    ],
  },
  {
    label: 'Yesterday',
    sessions: [
      { id: 's3', query: 'Where are service margins being compressed?', timestamp: 'Jun 12', resultId: 'service-margins', sessionThreadId: 'thread-4' } as SessionEntry,
      { id: 's3b', query: 'Show me departmental budget vs actuals', timestamp: 'Jun 12', resultId: 'budget-spreadsheet', sessionThreadId: 'thread-4', isFollowUp: true } as SessionEntry,
    ],
  },
  {
    label: 'This Week',
    sessions: [
      { id: 's4', query: 'Show me regional revenue performance', timestamp: 'Jun 11', resultId: 'regional-drilldown', sessionThreadId: 'thread-5' } as SessionEntry,
      { id: 's5', query: 'Show me the EMEA regional headcount breakdown', timestamp: 'Jun 10', resultId: 'emea-headcount', sessionThreadId: 'thread-6' } as SessionEntry,
    ],
  },
];
