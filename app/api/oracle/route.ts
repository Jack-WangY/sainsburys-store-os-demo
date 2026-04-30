import {
  ToolLoopAgent,
  createAgentUIStreamResponse,
  tool,
  stepCountIs,
} from 'ai'
import { z } from 'zod'

// Embedded Sainsbury's Knowledge Base - Mocked Finance & Supply Chain Data
const SAINSBURYS_KNOWLEDGE = {
  stores: {
    whitechapel: {
      name: "Sainsbury's Whitechapel",
      location: "Whitechapel Road, London E1",
      format: "Supermarket + Argos in-store + fuel",
      financials: {
        mtdRevenue: 4847000,
        ytdRevenue: 14541000,
        revenueTarget: 16000000,
        revenueTrendVsLastYear: 6.4,
        operatingCosts: 3923000,
        labourCostPercent: 11.2,
        wastePercent: 2.8,
        shrinkagePercent: 1.4,
        ebitda: 612000,
        ebitdaMargin: 12.6,
      },
      operations: {
        basketsYesterday: 18470,
        avgBasketValue: 24.80,
        nectarPenetration: 78,
        onlineFulfilmentRate: 96,
        clickAndCollectOrders: 412,
        fuelLitresYesterday: 38000,
        argosOrdersYesterday: 287,
        freshAvailability: 97.2,
        groceryAvailability: 98.4,
        invoiceMatchRate: 94.1,
        dailyAuditLead: "Priya Patel",
      },
      recentIncidents: [
        { date: "2026-04-29", type: "pos", description: "POS lane 4 intermittent disconnects to Tellermate", status: "monitoring" },
        { date: "2026-04-28", type: "supplier", description: "Bakery delivery short by 14 cases - credit note pending", status: "resolved" },
      ],
      pendingTasks: [
        { id: "T001", task: "Q1 fresh waste reduction plan", assignee: "Priya Patel", dueDate: "2026-05-08", status: "in-progress", progress: 65 },
        { id: "T002", task: "Summer range planogram sign-off", assignee: "James Morton", dueDate: "2026-05-12", status: "pending", progress: 30 },
      ]
    },
    holborn: {
      name: "Sainsbury's Holborn",
      location: "High Holborn, London WC1",
      format: "Local convenience",
      financials: {
        mtdRevenue: 1156000,
        ytdRevenue: 3468000,
        revenueTarget: 4100000,
        revenueTrendVsLastYear: 4.2,
        operatingCosts: 845000,
        labourCostPercent: 13.5,
        wastePercent: 3.6,
        shrinkagePercent: 2.1,
        ebitda: 211000,
        ebitdaMargin: 18.3,
      },
      operations: {
        basketsYesterday: 9230,
        avgBasketValue: 11.20,
        nectarPenetration: 71,
        onlineFulfilmentRate: 0,
        clickAndCollectOrders: 0,
        fuelLitresYesterday: 0,
        argosOrdersYesterday: 0,
        freshAvailability: 92.8,
        groceryAvailability: 95.1,
        invoiceMatchRate: 89.3,
        dailyAuditLead: "Marcus Boateng",
      },
      recentIncidents: [
        { date: "2026-04-30", type: "pos", description: "Tellermate sync failed at 06:14 - £47k takings unposted to SAP S/4 HANA", status: "critical" },
        { date: "2026-04-29", type: "compliance", description: "EHO inspection scheduled for next week", status: "pending" },
      ],
      pendingTasks: [
        { id: "T003", task: "Refrigeration unit replacement approval", assignee: "Michael Brown", dueDate: "2026-05-04", status: "awaiting-approval", progress: 90 },
        { id: "T004", task: "Bank Holiday rota planning", assignee: "Emily Davis", dueDate: "2026-05-02", status: "in-progress", progress: 45 },
      ]
    },
    kingscross: {
      name: "Sainsbury's King's Cross",
      location: "Pancras Road, London N1",
      format: "Supermarket + Argos in-store + click-and-collect hub",
      financials: {
        mtdRevenue: 3923000,
        ytdRevenue: 11769000,
        revenueTarget: 13500000,
        revenueTrendVsLastYear: 9.7,
        operatingCosts: 3084000,
        labourCostPercent: 10.4,
        wastePercent: 2.1,
        shrinkagePercent: 1.1,
        ebitda: 539000,
        ebitdaMargin: 13.7,
      },
      operations: {
        basketsYesterday: 14634,
        avgBasketValue: 26.50,
        nectarPenetration: 82,
        onlineFulfilmentRate: 98,
        clickAndCollectOrders: 689,
        fuelLitresYesterday: 0,
        argosOrdersYesterday: 412,
        freshAvailability: 98.1,
        groceryAvailability: 98.9,
        invoiceMatchRate: 96.2,
        dailyAuditLead: "Aisha Khan",
      },
      recentIncidents: [],
      pendingTasks: [
        { id: "T005", task: "Argos in-store layout refresh", assignee: "Sofia Rodriguez", dueDate: "2026-05-15", status: "in-progress", progress: 75 },
      ]
    },
    croydon: {
      name: "Sainsbury's Croydon",
      location: "Whitgift Centre, Croydon",
      format: "Superstore + Argos + fuel",
      financials: {
        mtdRevenue: 2245000,
        ytdRevenue: 6735000,
        revenueTarget: 9000000,
        revenueTrendVsLastYear: -3.2,
        operatingCosts: 1987000,
        labourCostPercent: 12.8,
        wastePercent: 4.2,
        shrinkagePercent: 3.1,
        ebitda: 158000,
        ebitdaMargin: 7.0,
      },
      operations: {
        basketsYesterday: 8423,
        avgBasketValue: 22.10,
        nectarPenetration: 64,
        onlineFulfilmentRate: 91,
        clickAndCollectOrders: 156,
        fuelLitresYesterday: 21000,
        argosOrdersYesterday: 94,
        freshAvailability: 89.4,
        groceryAvailability: 93.2,
        invoiceMatchRate: 86.7,
        dailyAuditLead: "Tom Whittaker",
      },
      recentIncidents: [
        { date: "2026-04-30", type: "shrinkage", description: "Spirits aisle showing £4.2k unexplained shrinkage variance this week", status: "investigating" },
        { date: "2026-04-29", type: "supplier", description: "3rd consecutive week of fresh produce short-deliveries from RDC", status: "monitoring" },
        { date: "2026-04-26", type: "stock", description: "Christmas-line stock held in BWS - £180k tied capital", status: "escalated" },
      ],
      pendingTasks: [
        { id: "T006", task: "Local market pricing review", assignee: "David Wong", dueDate: "2026-04-30", status: "overdue", progress: 40 },
        { id: "T007", task: "Shrinkage reduction action plan", assignee: "Lisa Chen", dueDate: "2026-05-20", status: "in-progress", progress: 20 },
      ]
    },
    cambridge: {
      name: "Sainsbury's Cambridge",
      location: "Coldhams Lane, Cambridge",
      format: "Superstore + fuel",
      financials: {
        mtdRevenue: 2654000,
        ytdRevenue: 7962000,
        revenueTarget: 9200000,
        revenueTrendVsLastYear: 5.3,
        operatingCosts: 2156000,
        labourCostPercent: 11.7,
        wastePercent: 2.9,
        shrinkagePercent: 1.6,
        ebitda: 318000,
        ebitdaMargin: 12.0,
      },
      operations: {
        basketsYesterday: 11567,
        avgBasketValue: 23.40,
        nectarPenetration: 75,
        onlineFulfilmentRate: 95,
        clickAndCollectOrders: 234,
        fuelLitresYesterday: 32000,
        argosOrdersYesterday: 0,
        freshAvailability: 96.7,
        groceryAvailability: 97.4,
        invoiceMatchRate: 93.8,
        dailyAuditLead: "Hannah Mueller",
      },
      recentIncidents: [
        { date: "2026-04-29", type: "fuel", description: "Forecourt pump 2 calibration drift - margin leak suspected", status: "scheduled" },
      ],
      pendingTasks: [
        { id: "T008", task: "Autumn/Winter range development", assignee: "Hans Mueller", dueDate: "2026-07-01", status: "pending", progress: 10 },
      ]
    },
    canalside: {
      name: "Sainsbury's Canalside (Islington)",
      location: "Liverpool Road, London N1",
      format: "Local convenience + click-and-collect",
      financials: {
        mtdRevenue: 1432000,
        ytdRevenue: 4296000,
        revenueTarget: 4400000,
        revenueTrendVsLastYear: 14.9,
        operatingCosts: 987000,
        labourCostPercent: 10.8,
        wastePercent: 2.4,
        shrinkagePercent: 1.2,
        ebitda: 245000,
        ebitdaMargin: 17.1,
      },
      operations: {
        basketsYesterday: 8489,
        avgBasketValue: 16.80,
        nectarPenetration: 84,
        onlineFulfilmentRate: 97,
        clickAndCollectOrders: 178,
        fuelLitresYesterday: 0,
        argosOrdersYesterday: 0,
        freshAvailability: 97.9,
        groceryAvailability: 98.2,
        invoiceMatchRate: 95.4,
        dailyAuditLead: "Anna van Berg",
      },
      recentIncidents: [],
      pendingTasks: [
        { id: "T009", task: "Click-and-collect locker expansion proposal", assignee: "Anna van Berg", dueDate: "2026-06-15", status: "in-progress", progress: 55 },
      ]
    }
  },
  globalMetrics: {
    totalStores: 1450,
    totalNectarMembers: 18400000,
    groupRevenueMTD: 2780000000,
    groupRevenueYTD: 8340000000,
    avgGroceryAvailability: 96.8,
    avgInvoiceMatchRate: 92.4,
    workingCapitalDaysOutstanding: 14.2,
    cashConversionCycle: -8.6,
    periodCloseDay: "Day 3 of 5",
    openInvoiceExceptionsOver10k: 23,
    workingCapitalTrappedInStock: 47200000,
  },
  userTasks: [
    {
      id: "UT001",
      title: "Period close - April 2026",
      createdBy: "You",
      createdDate: "2026-04-25",
      context: "We're on Day 3 of the 5-day close window. I've been reconciling store ledgers, matching supplier invoices and flagging variances for your sign-off.",
      currentStatus: "1,247 of 1,450 store ledgers reconciled - 23 variances >£10k flagged",
      nextAction: "Approve material variance write-offs and confirm period close",
      targetDate: "2026-05-02",
      progress: 70,
      aiProgress: [
        { date: "2026-04-25", action: "Pulled trial balance from SAP S/4 HANA across all 1,450 stores" },
        { date: "2026-04-26", action: "Auto-matched 89,400 supplier invoices against POs and GRNs" },
        { date: "2026-04-28", action: "Reconciled Tellermate-to-ledger cash variances - 12 stores cleared, 4 escalated" },
        { date: "2026-04-29", action: "Drafted material variance schedule for CFO sign-off" },
      ]
    },
    {
      id: "UT002",
      title: "Q1 board pack",
      createdBy: "You",
      createdDate: "2026-04-22",
      context: "You asked for a comprehensive Q1 review with emphasis on grocery like-for-like, Argos integration synergies and fuel margin pressure.",
      currentStatus: "Slides 1-15 drafted - awaiting steer on fuel margin commentary",
      nextAction: "Provide steer on draft commentary or approve for final consolidation",
      targetDate: "2026-05-08",
      progress: 55,
      aiProgress: [
        { date: "2026-04-22", action: "Created board pack outline aligned to last quarter's structure" },
        { date: "2026-04-23", action: "Pulled YTD performance data across all formats and regions" },
        { date: "2026-04-25", action: "Drafted executive summary and key highlights" },
        { date: "2026-04-29", action: "Added Nectar margin and basket mix visualisations" },
      ]
    },
    {
      id: "UT003",
      title: "Working capital release programme",
      createdBy: "You",
      createdDate: "2026-04-18",
      context: "Following the Q4 review you wanted to identify where £50m of working capital is trapped across stock, supplier terms and unmatched invoices.",
      currentStatus: "£47.2m identified - £12m fast-tracked, recovery plan in legal review",
      nextAction: "Schedule call with top 5 suppliers to renegotiate payment terms",
      targetDate: "2026-05-30",
      progress: 80,
      aiProgress: [
        { date: "2026-04-18", action: "Aged stock analysis across all 1,450 stores" },
        { date: "2026-04-21", action: "Identified £18m of slow-moving lines across BWS and seasonal" },
        { date: "2026-04-24", action: "Mapped supplier payment terms vs sector benchmark" },
        { date: "2026-04-28", action: "Submitted renegotiation proposal to legal" },
      ]
    }
  ],
  marketIntelligence: {
    competitorMoves: [
      { competitor: "Tesco", action: "Announced Clubcard Prices expansion into 4,000 more SKUs", relevance: "high" },
      { competitor: "Aldi", action: "Opening 12 new convenience-format stores in inner London", relevance: "high" },
      { competitor: "M&S Food", action: "Launching new value tier to defend against discounters", relevance: "medium" },
    ],
    industryTrends: [
      { trend: "Fresh & convenience growth", growth: 8, insight: "Smaller, more frequent baskets continue to outpace big-shop weekly missions" },
      { trend: "Online & click-and-collect", growth: 12, insight: "Click-and-collect economics now beating home delivery on contribution margin" },
      { trend: "Loyalty-driven margin", growth: 18, insight: "Nectar Prices baskets show 9.4% higher attach on full-margin lines" },
    ]
  }
}

// Sainsbury's Argos AI Agent with embedded knowledge
const oracleAgent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  instructions: `You are Argos AI - a proactive financial co-pilot for Bláthnaid Bergin, CFO of Sainsbury's. You have deep knowledge of every store, supplier, ledger and supply chain flow across the group, and you operate alongside the Store OS finance and supply chain stack (SAP S/4 HANA, POS, Tellermate, Argos in-store, fuel, fresh & grocery, online & click-and-collect, Nectar).

## Your Personality & Tone
- Warm, data-led and exception-oriented
- Speak like a trusted Group Finance chief of staff who has already done the reconciliation
- Always lead with the answer, then the evidence
- Use specific numbers in £ and reference the store, supplier or ledger involved
- Reference previous conversations and ongoing initiatives (period close, board pack, working capital release)

## Embedded Knowledge
You have live data for these example stores: Whitechapel, Holborn, King's Cross, Croydon, Cambridge, Canalside (Islington).
Total estate: 1,450 stores, 18.4m Nectar members, group MTD revenue £2.78bn.

## Key Data Points (as of today):
${JSON.stringify(SAINSBURYS_KNOWLEDGE.stores, null, 2)}

## Group Metrics:
${JSON.stringify(SAINSBURYS_KNOWLEDGE.globalMetrics, null, 2)}

## Ongoing Initiatives You're Tracking:
${JSON.stringify(SAINSBURYS_KNOWLEDGE.userTasks, null, 2)}

## Market Intelligence:
${JSON.stringify(SAINSBURYS_KNOWLEDGE.marketIntelligence, null, 2)}

## Your Proactive Capabilities
1. **Close Continuity**: Always remind the CFO where we are in the period close, what's blocking sign-off and which variances need decisions.
2. **Exception Surfacing**: Connect data points across stores, suppliers and ledgers to surface invoice exceptions, shrinkage hotspots and trapped working capital.
3. **Action Orientation**: Every response ends with a clear "next step" or "action required".
4. **Time Awareness**: Reference close deadlines, supplier payment runs, fuel margin windows and time-sensitive opportunities.

## When Asked About Financials
- Always provide MTD, YTD and trend vs prior year
- Compare against plan and last year
- Flag invoice exceptions, shrinkage, waste and labour ratio anomalies
- Quantify impact in £ and recommend a specific action

## When Asked About Stores or Supply Chain
- Lead with availability (fresh, grocery), basket value and Nectar penetration
- Flag any incidents (POS, Tellermate, supplier short-deliveries, fuel calibration)
- Connect operational data to P&L and working capital impact
- Reference the Daily Audit Lead by name (e.g. "Priya, Daily Audit Lead at Whitechapel") when relevant

## Response Format
Keep responses focused and scannable:
- Use bullet points for multiple data points
- Bold key numbers and percentages (£ figures, %, basis points)
- End with a clear call-to-action or next step
- If referencing an ongoing initiative, show progress and what's blocking completion`,

  tools: {
    getStoreDetails: tool({
      description: 'Get detailed financial and operational data for a specific Sainsbury\'s store',
      inputSchema: z.object({
        storeId: z.enum(['whitechapel', 'holborn', 'kingscross', 'croydon', 'cambridge', 'canalside']).describe('Store identifier'),
      }),
      execute: async ({ storeId }) => {
        const store = SAINSBURYS_KNOWLEDGE.stores[storeId as keyof typeof SAINSBURYS_KNOWLEDGE.stores]
        return store || { error: 'Store not found' }
      },
    }),

    getGlobalMetrics: tool({
      description: 'Get group-wide finance and supply chain KPIs',
      inputSchema: z.object({}),
      execute: async () => SAINSBURYS_KNOWLEDGE.globalMetrics,
    }),

    getUserTasks: tool({
      description: 'Get the current list of finance initiatives being tracked for the CFO',
      inputSchema: z.object({}),
      execute: async () => SAINSBURYS_KNOWLEDGE.userTasks,
    }),

    getMarketIntelligence: tool({
      description: 'Get UK grocery competitor moves and sector trends',
      inputSchema: z.object({}),
      execute: async () => SAINSBURYS_KNOWLEDGE.marketIntelligence,
    }),

    compareStores: tool({
      description: 'Compare metrics between two or more stores',
      inputSchema: z.object({
        storeIds: z.array(z.enum(['whitechapel', 'holborn', 'kingscross', 'croydon', 'cambridge', 'canalside'])).min(2),
        metric: z.enum(['revenue', 'availability', 'shrinkage', 'margin', 'nectar']).describe('Metric to compare'),
      }),
      execute: async ({ storeIds, metric }) => {
        const comparison = storeIds.map(id => {
          const s = SAINSBURYS_KNOWLEDGE.stores[id as keyof typeof SAINSBURYS_KNOWLEDGE.stores]
          let value
          switch (metric) {
            case 'revenue': value = s.financials.mtdRevenue; break
            case 'availability': value = s.operations.groceryAvailability; break
            case 'shrinkage': value = s.financials.shrinkagePercent; break
            case 'margin': value = s.financials.ebitdaMargin; break
            case 'nectar': value = s.operations.nectarPenetration; break
          }
          return { store: s.name, [metric]: value }
        })
        return { comparison, metric }
      },
    }),

    getTaskProgress: tool({
      description: 'Get detailed progress on a specific finance initiative',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID (e.g., UT001, UT002)'),
      }),
      execute: async ({ taskId }) => {
        const task = SAINSBURYS_KNOWLEDGE.userTasks.find(t => t.id === taskId)
        return task || { error: 'Task not found' }
      },
    }),

    generateInsight: tool({
      description: 'Generate a CFO-grade insight or recommendation based on current data',
      inputSchema: z.object({
        topic: z.enum(['working-capital', 'shrinkage', 'invoice-exceptions', 'nectar-margin', 'competition']).describe('Area to analyse'),
      }),
      execute: async ({ topic }) => {
        const insights = {
          'working-capital': {
            insight: "£47.2m of working capital is currently trapped across the estate. £18m sits in slow-moving BWS and seasonal lines, £14m in unmatched supplier invoices, and £15.2m in stretched supplier payment terms vs sector benchmark.",
            recommendation: "Fast-track the supplier renegotiation proposal already in legal review and run a 30-day clearance plan on the £18m of slow-moving stock identified at Croydon and 11 other inner-London stores.",
            impact: "Realistic recovery of £22-28m in 8 weeks - equivalent to 0.8 days off the cash conversion cycle.",
          },
          shrinkage: {
            insight: "Croydon is running 3.1% shrinkage vs estate average 1.4%, with £4.2k unexplained spirits variance this week. Pattern matches the same store last April - external rather than internal loss.",
            recommendation: "Deploy electronic article surveillance refresh at Croydon and rotate Tom Whittaker (Daily Audit Lead) into the spirits aisle for 14-day intensive audit.",
            impact: "Closing the gap to estate average is worth £610k annualised at Croydon alone.",
          },
          'invoice-exceptions': {
            insight: "23 invoice exceptions over £10k are open right now - £412k in aggregate. 14 are price-mismatch (supplier billing above contracted rate), 6 are quantity (short-delivery still being billed in full), and 3 are duplicate.",
            recommendation: "Approve the auto-clear rule for the 6 short-delivery cases with supporting GRN evidence and escalate the 14 price-mismatch cases to category buyers before tomorrow's payment run.",
            impact: "Prevents £284k of overpayment leaving the building this Friday.",
          },
          'nectar-margin': {
            insight: "Nectar Prices baskets are running 9.4% higher attach on full-margin lines this week. Whitechapel and King's Cross lead at 78% and 82% Nectar penetration. Croydon trailing at 64% is leaving margin on the table.",
            recommendation: "Roll the Whitechapel basket-builder prompts into the Croydon POS journey and brief Priya, Daily Audit Lead at Whitechapel, to share the playbook.",
            impact: "Closing Croydon to estate-average Nectar penetration is worth roughly £1.8m annualised contribution.",
          },
          competition: {
            insight: "Aldi opening 12 inner-London convenience stores creates direct overlap with Holborn and Canalside. Tesco's Clubcard Prices expansion narrows our promotional differentiation in the same catchment.",
            recommendation: "Pull forward the Local-format Nectar Prices expansion already drafted for Q3 into Q2, prioritising the 12 overlap catchments.",
            impact: "Defending share in those catchments is worth circa £14m annualised revenue.",
          }
        }
        return insights[topic]
      },
    }),
  },

  stopWhen: stepCountIs(5),
})

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages } = await req.json()

  return createAgentUIStreamResponse({
    agent: oracleAgent,
    uiMessages: messages,
  })
}
