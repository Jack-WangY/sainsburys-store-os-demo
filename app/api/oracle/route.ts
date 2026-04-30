import {
  ToolLoopAgent,
  createAgentUIStreamResponse,
  tool,
  stepCountIs,
} from 'ai'
import { z } from 'zod'

// Embedded Soho House Knowledge Base - Mocked Finance & Performance Data
const SOHO_HOUSE_KNOWLEDGE = {
  properties: {
    london: {
      name: "Soho House London",
      location: "Greek Street, London",
      financials: {
        mtdRevenue: 2847000,
        ytdRevenue: 8541000,
        revenueTarget: 10000000,
        revenueTrendVsLastYear: 12.4,
        operatingCosts: 1923000,
        labourCostPercent: 32,
        foodCostPercent: 28,
        bevCostPercent: 22,
        gop: 924000,
        gopMargin: 32.5,
      },
      operations: {
        occupancy: 94,
        adr: 485,
        revpar: 456,
        coversYesterday: 847,
        avgSpendPerCover: 89,
        memberSatisfaction: 4.8,
        activeMembers: 12450,
        newMembersThisMonth: 234,
        memberChurnRate: 2.1,
      },
      recentIncidents: [
        { date: "2024-06-14", type: "maintenance", description: "HVAC unit 3 showing intermittent faults", status: "monitoring" },
        { date: "2024-06-12", type: "feedback", description: "VIP member complaint about pool temperature", status: "resolved" },
      ],
      pendingTasks: [
        { id: "T001", task: "Q2 membership pricing review", assignee: "Sarah Chen", dueDate: "2024-06-20", status: "in-progress", progress: 65 },
        { id: "T002", task: "Summer menu launch preparation", assignee: "James Morton", dueDate: "2024-06-25", status: "pending", progress: 30 },
      ]
    },
    nyc: {
      name: "Soho House New York",
      location: "Meatpacking District, NYC",
      financials: {
        mtdRevenue: 3156000,
        ytdRevenue: 9468000,
        revenueTarget: 11500000,
        revenueTrendVsLastYear: 8.2,
        operatingCosts: 2345000,
        labourCostPercent: 35,
        foodCostPercent: 26,
        bevCostPercent: 24,
        gop: 811000,
        gopMargin: 25.7,
      },
      operations: {
        occupancy: 87,
        adr: 520,
        revpar: 452,
        coversYesterday: 1023,
        avgSpendPerCover: 95,
        memberSatisfaction: 4.6,
        activeMembers: 15230,
        newMembersThisMonth: 312,
        memberChurnRate: 3.2,
      },
      recentIncidents: [
        { date: "2024-06-14", type: "staffing", description: "2 bartenders called in sick for evening shift", status: "resolved" },
        { date: "2024-06-13", type: "compliance", description: "Health inspection scheduled for next week", status: "pending" },
      ],
      pendingTasks: [
        { id: "T003", task: "Rooftop renovation approval", assignee: "Michael Brown", dueDate: "2024-06-18", status: "awaiting-approval", progress: 90 },
        { id: "T004", task: "July 4th event planning", assignee: "Emily Davis", dueDate: "2024-07-01", status: "in-progress", progress: 45 },
      ]
    },
    miami: {
      name: "Soho House Miami",
      location: "Miami Beach, FL",
      financials: {
        mtdRevenue: 1923000,
        ytdRevenue: 5769000,
        revenueTarget: 7500000,
        revenueTrendVsLastYear: 15.7,
        operatingCosts: 1284000,
        labourCostPercent: 30,
        foodCostPercent: 27,
        bevCostPercent: 25,
        gop: 639000,
        gopMargin: 33.2,
      },
      operations: {
        occupancy: 91,
        adr: 395,
        revpar: 359,
        coversYesterday: 634,
        avgSpendPerCover: 78,
        memberSatisfaction: 4.9,
        activeMembers: 8940,
        newMembersThisMonth: 187,
        memberChurnRate: 1.8,
      },
      recentIncidents: [],
      pendingTasks: [
        { id: "T005", task: "Art Basel partnership contract", assignee: "Sofia Rodriguez", dueDate: "2024-06-22", status: "in-progress", progress: 75 },
      ]
    },
    hongkong: {
      name: "Soho House Hong Kong",
      location: "Central, Hong Kong",
      financials: {
        mtdRevenue: 1245000,
        ytdRevenue: 3735000,
        revenueTarget: 5000000,
        revenueTrendVsLastYear: -3.2,
        operatingCosts: 987000,
        labourCostPercent: 38,
        foodCostPercent: 30,
        bevCostPercent: 23,
        gop: 258000,
        gopMargin: 20.7,
      },
      operations: {
        occupancy: 72,
        adr: 410,
        revpar: 295,
        coversYesterday: 423,
        avgSpendPerCover: 72,
        memberSatisfaction: 4.3,
        activeMembers: 5670,
        newMembersThisMonth: 67,
        memberChurnRate: 4.8,
      },
      recentIncidents: [
        { date: "2024-06-14", type: "financial", description: "Payment gateway outage affecting member billing", status: "critical" },
        { date: "2024-06-13", type: "occupancy", description: "3rd consecutive week of declining room bookings", status: "monitoring" },
        { date: "2024-06-10", type: "member", description: "High-profile member cancellation request", status: "escalated" },
      ],
      pendingTasks: [
        { id: "T006", task: "Regional market analysis", assignee: "David Wong", dueDate: "2024-06-15", status: "overdue", progress: 40 },
        { id: "T007", task: "Membership retention campaign", assignee: "Lisa Chen", dueDate: "2024-06-30", status: "in-progress", progress: 20 },
      ]
    },
    berlin: {
      name: "Soho House Berlin",
      location: "Mitte, Berlin",
      financials: {
        mtdRevenue: 1654000,
        ytdRevenue: 4962000,
        revenueTarget: 6500000,
        revenueTrendVsLastYear: 6.3,
        operatingCosts: 1156000,
        labourCostPercent: 33,
        foodCostPercent: 29,
        bevCostPercent: 21,
        gop: 498000,
        gopMargin: 30.1,
      },
      operations: {
        occupancy: 89,
        adr: 345,
        revpar: 307,
        coversYesterday: 567,
        avgSpendPerCover: 68,
        memberSatisfaction: 4.7,
        activeMembers: 7820,
        newMembersThisMonth: 145,
        memberChurnRate: 2.4,
      },
      recentIncidents: [
        { date: "2024-06-13", type: "event", description: "Film screening equipment needs calibration", status: "scheduled" },
      ],
      pendingTasks: [
        { id: "T008", task: "Winter season menu development", assignee: "Hans Mueller", dueDate: "2024-08-01", status: "pending", progress: 10 },
      ]
    },
    amsterdam: {
      name: "Soho House Amsterdam",
      location: "Canal Ring, Amsterdam",
      financials: {
        mtdRevenue: 1432000,
        ytdRevenue: 4296000,
        revenueTarget: 5500000,
        revenueTrendVsLastYear: 18.9,
        operatingCosts: 987000,
        labourCostPercent: 31,
        foodCostPercent: 28,
        bevCostPercent: 22,
        gop: 445000,
        gopMargin: 31.1,
      },
      operations: {
        occupancy: 96,
        adr: 380,
        revpar: 365,
        coversYesterday: 489,
        avgSpendPerCover: 82,
        memberSatisfaction: 4.9,
        activeMembers: 6230,
        newMembersThisMonth: 178,
        memberChurnRate: 1.5,
      },
      recentIncidents: [],
      pendingTasks: [
        { id: "T009", task: "Canal-side terrace expansion proposal", assignee: "Anna van Berg", dueDate: "2024-07-15", status: "in-progress", progress: 55 },
      ]
    }
  },
  globalMetrics: {
    totalProperties: 42,
    totalActiveMembers: 245000,
    globalRevenueMTD: 47800000,
    globalRevenueYTD: 143400000,
    avgGlobalOccupancy: 88,
    avgMemberSatisfaction: 4.7,
    netPromoterScore: 72,
    memberRetentionRate: 94.2,
  },
  userTasks: [
    {
      id: "UT001",
      title: "Review Hong Kong recovery strategy",
      createdBy: "You",
      createdDate: "2024-06-10",
      context: "Following the 3-week occupancy decline, you asked me to draft a recovery strategy. I've completed the initial analysis and identified 3 key intervention areas.",
      currentStatus: "Analysis complete - awaiting your review",
      nextAction: "Review the proposed interventions and approve budget allocation",
      targetDate: "2024-06-20",
      progress: 70,
      aiProgress: [
        { date: "2024-06-10", action: "Initiated competitive analysis for HK market" },
        { date: "2024-06-11", action: "Analyzed member feedback patterns from last 90 days" },
        { date: "2024-06-12", action: "Benchmarked pricing against 5 competitor clubs" },
        { date: "2024-06-13", action: "Drafted 3-phase recovery proposal" },
      ]
    },
    {
      id: "UT002",
      title: "Prepare Q2 board presentation",
      createdBy: "You",
      createdDate: "2024-06-08",
      context: "You mentioned wanting a comprehensive Q2 review with emphasis on the APAC expansion and member growth metrics.",
      currentStatus: "Slides 1-15 drafted, awaiting financial data finalization",
      nextAction: "Provide feedback on draft slides, or approve for final data integration",
      targetDate: "2024-06-25",
      progress: 55,
      aiProgress: [
        { date: "2024-06-08", action: "Created presentation outline and structure" },
        { date: "2024-06-09", action: "Pulled YTD performance data for all regions" },
        { date: "2024-06-11", action: "Drafted executive summary and key highlights" },
        { date: "2024-06-14", action: "Added member growth visualizations" },
      ]
    },
    {
      id: "UT003",
      title: "Miami Art Basel partnership evaluation",
      createdBy: "You",
      createdDate: "2024-06-05",
      context: "You wanted to explore deeper partnership opportunities following the 340% social engagement spike during last year's Art Basel.",
      currentStatus: "Partnership proposal drafted, legal review in progress",
      nextAction: "Schedule call with Art Basel organizers to discuss terms",
      targetDate: "2024-06-30",
      progress: 80,
      aiProgress: [
        { date: "2024-06-05", action: "Analyzed ROI from previous Art Basel activations" },
        { date: "2024-06-07", action: "Identified potential partnership tiers and benefits" },
        { date: "2024-06-10", action: "Drafted partnership proposal document" },
        { date: "2024-06-13", action: "Submitted to legal for contract review" },
      ]
    }
  ],
  marketIntelligence: {
    competitorMoves: [
      { competitor: "The Ned", action: "Announced new Hong Kong location opening Q1 2025", relevance: "high" },
      { competitor: "Soho Works", action: "Launching enterprise membership tier", relevance: "medium" },
    ],
    industryTrends: [
      { trend: "Wellness tourism", growth: 23, insight: "Members increasingly value spa and wellness amenities" },
      { trend: "Remote work clubs", growth: 45, insight: "Work-from-club bookings up significantly post-pandemic" },
      { trend: "Sustainable luxury", growth: 34, insight: "ESG considerations influencing membership decisions" },
    ]
  }
}

// Soho House Oracle Agent with embedded knowledge
const oracleAgent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  instructions: `You are the Soho House Oracle - an AI executive assistant for C-level leadership at Soho House. You have deep knowledge of all properties, financials, operations, and strategic initiatives.

## Your Personality & Tone
- Sophisticated, professional, and concise
- Speak like a trusted chief of staff who knows everything
- Be proactive - anticipate what the executive needs
- Use specific numbers and data points
- Reference previous conversations and ongoing tasks

## Embedded Knowledge
You have access to real-time data for these properties: London, NYC, Miami, Hong Kong, Berlin, Amsterdam.
Total global portfolio: 42 properties with 245K active members.

## Key Data Points (as of today):
${JSON.stringify(SOHO_HOUSE_KNOWLEDGE.properties, null, 2)}

## Global Metrics:
${JSON.stringify(SOHO_HOUSE_KNOWLEDGE.globalMetrics, null, 2)}

## Ongoing Tasks You're Tracking:
${JSON.stringify(SOHO_HOUSE_KNOWLEDGE.userTasks, null, 2)}

## Market Intelligence:
${JSON.stringify(SOHO_HOUSE_KNOWLEDGE.marketIntelligence, null, 2)}

## Your Proactive Capabilities
1. **Task Continuation**: Always remind executives about tasks you're working on together. Lead with "Here's an update on what we discussed..."
2. **Insight Synthesis**: Connect data points across properties to surface patterns and opportunities
3. **Action Orientation**: Every response should have a clear "next step" or "action required"
4. **Time Awareness**: Reference deadlines, urgency, and time-sensitive opportunities

## When Asked About Financials
- Always provide MTD, YTD, and trend data
- Compare against targets and previous year
- Highlight anomalies or concerns
- Suggest specific actions for underperformers

## When Asked About Operations
- Lead with occupancy and satisfaction scores
- Flag any incidents requiring attention
- Connect operational data to financial impact

## Response Format
Keep responses focused and scannable:
- Use bullet points for multiple data points
- Bold key numbers and percentages
- End with a clear call-to-action or next step
- If referencing an ongoing task, show progress and what's blocking completion`,

  tools: {
    getPropertyDetails: tool({
      description: 'Get detailed financial and operational data for a specific property',
      inputSchema: z.object({
        propertyId: z.enum(['london', 'nyc', 'miami', 'hongkong', 'berlin', 'amsterdam']).describe('Property identifier'),
      }),
      execute: async ({ propertyId }) => {
        const property = SOHO_HOUSE_KNOWLEDGE.properties[propertyId as keyof typeof SOHO_HOUSE_KNOWLEDGE.properties]
        return property || { error: 'Property not found' }
      },
    }),
    
    getGlobalMetrics: tool({
      description: 'Get global portfolio-wide metrics and KPIs',
      inputSchema: z.object({}),
      execute: async () => SOHO_HOUSE_KNOWLEDGE.globalMetrics,
    }),
    
    getUserTasks: tool({
      description: 'Get the current list of tasks and initiatives being tracked for the user',
      inputSchema: z.object({}),
      execute: async () => SOHO_HOUSE_KNOWLEDGE.userTasks,
    }),
    
    getMarketIntelligence: tool({
      description: 'Get competitor moves and industry trends',
      inputSchema: z.object({}),
      execute: async () => SOHO_HOUSE_KNOWLEDGE.marketIntelligence,
    }),
    
    compareProperties: tool({
      description: 'Compare metrics between two or more properties',
      inputSchema: z.object({
        propertyIds: z.array(z.enum(['london', 'nyc', 'miami', 'hongkong', 'berlin', 'amsterdam'])).min(2),
        metric: z.enum(['revenue', 'occupancy', 'satisfaction', 'margin', 'members']).describe('Metric to compare'),
      }),
      execute: async ({ propertyIds, metric }) => {
        const comparison = propertyIds.map(id => {
          const p = SOHO_HOUSE_KNOWLEDGE.properties[id as keyof typeof SOHO_HOUSE_KNOWLEDGE.properties]
          let value
          switch (metric) {
            case 'revenue': value = p.financials.mtdRevenue; break
            case 'occupancy': value = p.operations.occupancy; break
            case 'satisfaction': value = p.operations.memberSatisfaction; break
            case 'margin': value = p.financials.gopMargin; break
            case 'members': value = p.operations.activeMembers; break
          }
          return { property: p.name, [metric]: value }
        })
        return { comparison, metric }
      },
    }),
    
    getTaskProgress: tool({
      description: 'Get detailed progress on a specific task or initiative',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID (e.g., UT001, UT002)'),
      }),
      execute: async ({ taskId }) => {
        const task = SOHO_HOUSE_KNOWLEDGE.userTasks.find(t => t.id === taskId)
        return task || { error: 'Task not found' }
      },
    }),
    
    generateInsight: tool({
      description: 'Generate an AI insight or recommendation based on current data',
      inputSchema: z.object({
        topic: z.enum(['growth', 'risk', 'efficiency', 'member-experience', 'competition']).describe('Area to analyze'),
      }),
      execute: async ({ topic }) => {
        const insights = {
          growth: {
            insight: "Amsterdam showing exceptional 18.9% YoY growth with highest occupancy (96%). Pattern suggests successful local event programming.",
            recommendation: "Replicate Amsterdam's event calendar structure across Berlin and London properties.",
            impact: "Potential +8-12% revenue lift at underperforming European properties",
          },
          risk: {
            insight: "Hong Kong showing compounding risk signals: declining occupancy (72%), negative revenue trend (-3.2%), elevated churn (4.8%).",
            recommendation: "Implement emergency retention program with membership fee freeze for top-tier members.",
            impact: "Without intervention, projected Q3 revenue shortfall of $780K",
          },
          efficiency: {
            insight: "NYC labour costs at 35% exceeding portfolio average of 32%. Primary driver: overtime during peak dinner service.",
            recommendation: "Pilot AI-driven scheduling optimization to reduce overtime by 20%.",
            impact: "Projected annual savings of $340K",
          },
          'member-experience': {
            insight: "Miami leads member satisfaction (4.9) correlating with lowest churn (1.8%). Key differentiator: personalized arrival experience.",
            recommendation: "Deploy Miami's member recognition protocol portfolio-wide.",
            impact: "Could reduce global churn by 0.8%, retaining ~1,960 members worth $5.9M ARR",
          },
          competition: {
            insight: "The Ned's Hong Kong announcement creates urgency. Our HK property already weakened - risk of accelerated member attrition.",
            recommendation: "Fast-track HK renovation and launch exclusive founding member benefits before competitor opens.",
            impact: "Defending market position worth estimated $12M in lifetime member value",
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
