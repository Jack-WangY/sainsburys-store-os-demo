"use client"

import { useState, useEffect } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { PropertyCard } from '@/components/house-os/property-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { AlertStrip } from '@/components/house-os/alert-strip'
import { ChatInterface } from '@/components/house-os/chat-interface'
import { Button } from '@/components/ui/button'
import { useHouseOS } from '@/lib/house-os-context'
import { cn } from '@/lib/utils'
import {
  PoundSterling,
  TrendingUp,
  Utensils,
  Users,
  Brain,
  Lightbulb,
  MessageSquare,
  Hash,
  Calendar,
  Sparkles,
  Target,
  ArrowRight,
  BarChart3,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import Link from 'next/link'

// Weekly revenue (£k today) for sample stores
const monthlyRevenueByProperty = [
  { property: 'Nine Elms', thisMonth: 187, lastMonth: 172 },
  { property: 'Potters Bar', thisMonth: 143, lastMonth: 136 },
  { property: 'Cromwell Rd', thisMonth: 125, lastMonth: 119 },
  { property: 'Fulham Wharf', thisMonth: 102, lastMonth: 98 },
  { property: 'Whitechapel', thisMonth: 91, lastMonth: 96 },
  { property: 'Brighton Marina', thisMonth: 78, lastMonth: 74 },
  { property: 'Argos Stratford', thisMonth: 48, lastMonth: 44 },
  { property: "King's Cross Local", thisMonth: 39, lastMonth: 36 },
  { property: 'Holborn Local', thisMonth: 25, lastMonth: 23 },
]

const occupancyTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  ukAvg: 82 + Math.random() * 10,
  potters: 92 + Math.random() * 6,
}))

const socialTrending = [
  {
    platform: 'Instagram',
    mentions: 4180,
    sentiment: 'positive',
    trending: ['#Sainsburys', '#TasteTheDifference', '#NectarCard'],
    topPost: 'New TTD spring range — strawberries from Kent now in store',
    engagement: '+22%',
  },
  {
    platform: 'Twitter/X',
    mentions: 2360,
    sentiment: 'neutral',
    trending: ['@sainsburys', '#Argos', '#NectarPrices'],
    topPost: 'Argos same-day collection now in 712 Sainsbury\'s stores',
    engagement: '+9%',
  },
  {
    platform: 'TikTok',
    mentions: 5840,
    sentiment: 'positive',
    trending: ['#Sainsburys', '#MealDeal', '#TuClothing'],
    topPost: 'Tu Spring 2026 drop — under £20 outfit haul',
    engagement: '+38%',
  },
]

const memberInsights = [
  {
    title: 'Nectar Lapsed-Visit Alert',
    insight: '14,200 Nectar customers at Whitechapel catchment haven\'t swiped in 60+ days',
    recommendation: 'Trigger personalised £5-off-£40 offer via Nectar app this weekend',
    priority: 'high',
  },
  {
    title: 'High-Value Basket Pattern',
    insight: 'Argos in-store collection lifts grocery basket size by 18% on Thursdays at superstores',
    recommendation: 'Promote Thursday Argos pick-up windows in superstores via SmartShop',
    priority: 'medium',
  },
  {
    title: 'Cross-format Opportunity',
    insight: '230k Local-store-only Nectar shoppers in London have never used Online Groceries',
    recommendation: 'Target with first-order £15 off for delivery from Nine Elms hub',
    priority: 'medium',
  },
]

const campaignOpportunities = [
  {
    title: 'Easter Fresh Push',
    properties: ['Potters Bar', 'Nine Elms', 'Cromwell Rd'],
    projectedRevenue: '£1.4M',
    targetSegment: 'Family shoppers, TTD',
    timing: 'Easter weekend',
    status: 'ready',
  },
  {
    title: 'Tu Spring Wardrobe Edit',
    properties: ['Nine Elms', 'Brighton Marina'],
    projectedRevenue: '£820k',
    targetSegment: 'Tu loyalists, 25-45',
    timing: 'May weekends',
    status: 'planning',
  },
  {
    title: 'Argos in Sainsbury\'s — Click & Collect',
    properties: ['Stratford', 'Whitechapel', 'Cromwell Rd'],
    projectedRevenue: '£640k',
    targetSegment: 'Cross-shop families',
    timing: 'Bank holiday',
    status: 'ready',
  },
]

const aiInsightsChat = [
  {
    id: '1',
    content: "I'm Argos AI. I can analyse trading across the 600-store estate. Try asking about revenue trends, Nectar customer behaviour, or campaign opportunities.",
    sender: 'system' as const,
  },
]

const aiResponses: Record<string, string> = {
  revenue: `Based on the last 30 trading days:

**Revenue Trends:**
- Nine Elms leads at £187k/day (+8.7% MoM)
- Whitechapel showing dip (-5%) — investigate Tellermate variance
- Group up 4.2% YoY on a like-for-like basis

**Recommendation:** Reallocate fresh & grocery replen capacity from quieter midweek Local stores into superstore weekend demand windows.`,

  member: `**Nectar Customer Behaviour:**

- Average visits per active Nectar member: 3.6x per month
- Peak swipe times: Thu-Sat 17:00-19:30
- Cross-format usage: 31% shop both superstore + Local

**Key Insight:** Customers who redeem a personalised Nectar Prices offer are 2.1x more likely to repeat that category within 14 days.`,

  marketing: `**Campaign Opportunities Identified:**

1. **Easter Fresh Push** — Ready to launch
   Target: Family TTD shoppers
   Projected: £1.4M revenue

2. **Lapsed-Visit Re-engagement**
   14.2k Nectar customers inactive >60 days at Whitechapel
   Recommend: £5-off-£40 personalised offer

3. **Online cross-sell**
   230k Local-only customers haven't tried Online Groceries
   Recommend: First-order £15 off`,

  default: `I've analysed group trading. Here are the key insights:

**Top Performer:** Nine Elms (88% of forecast, £187k/day)
**Attention Needed:** Whitechapel (Tellermate variance, SAP posting held)
**Opportunity:** 230k Local-only Nectar shoppers haven't tried online — cross-sell potential

Would you like me to dive deeper into any of these?`,
}

export default function MultiSitePage() {
  const { state } = useHouseOS()
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'social' | 'campaigns'>('overview')
  const [aiMessages, setAiMessages] = useState<{ id: string; content: string; sender: 'system' | 'user' }[]>(aiInsightsChat)

  const handleAiSend = (content: string) => {
    const newUserMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user' as const,
    }
    setAiMessages((prev) => [...prev, newUserMessage])

    setTimeout(() => {
      const lowerContent = content.toLowerCase()
      let responseKey = 'default'
      if (lowerContent.includes('revenue') || lowerContent.includes('sales')) responseKey = 'revenue'
      else if (lowerContent.includes('nectar') || lowerContent.includes('member') || lowerContent.includes('customer')) responseKey = 'member'
      else if (lowerContent.includes('marketing') || lowerContent.includes('campaign')) responseKey = 'marketing'

      const systemMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[responseKey],
        sender: 'system' as const,
      }
      setAiMessages((prev) => [...prev, systemMessage])
    }, 1500)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="YTD Group Revenue"
          icon={<PoundSterling className="w-3.5 h-3.5" />}
          value="£32.1B"
          label="600 stores · FY2026"
          delta={{ direction: 'up', value: '4.2%', label: 'vs FY2025' }}
        />
        <KPICard
          title="Underlying EBITDA Margin"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          value="6.1%"
          label="Group operating performance"
          delta={{ direction: 'up', value: '0.4pts', label: 'YoY' }}
        />
        <KPICard
          title="Nectar Active Base"
          icon={<Users className="w-3.5 h-3.5" />}
          value="19.8M"
          label="Active in last 12 weeks"
          delta={{ direction: 'up', value: '6.2%' }}
        />
        <KPICard
          title="Fresh & Grocery Baskets MTD"
          icon={<Utensils className="w-3.5 h-3.5" />}
          value="42.6M"
          label="Avg basket £28.40"
          delta={{ direction: 'up', value: '3.6%' }}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-0">
        {[
          { id: 'overview', label: 'Estate Overview', icon: BarChart3 },
          { id: 'insights', label: 'Argos AI Insights', icon: Brain },
          { id: 'social', label: 'Social & Customer Trends', icon: Hash },
          { id: 'campaigns', label: 'Campaign Opportunities', icon: Target },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-text-muted hover:text-text"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Revenue by Store */}
            <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
              <h3 className="font-serif text-lg text-text mb-4">Daily Revenue by Store (£k)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueByProperty} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#8a8278" fontSize={11} tickFormatter={(v) => `£${v}k`} />
                    <YAxis type="category" dataKey="property" stroke="#8a8278" fontSize={11} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1815',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`£${value}k`, '']}
                    />
                    <Legend />
                    <Bar dataKey="thisMonth" name="Today" fill="#c9a84c" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="lastMonth" name="LY same day" fill="rgba(201,168,76,0.3)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Forecast attainment trend */}
            <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
              <h3 className="font-serif text-lg text-text mb-4">30-Day Forecast Attainment</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#8a8278" fontSize={11} />
                    <YAxis stroke="#8a8278" fontSize={11} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1815',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ukAvg"
                      name="UK Estate Avg"
                      stroke="#c9a84c"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="potters"
                      name="Potters Bar"
                      stroke="#4a9e6b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Store Cards Grid */}
          <div>
            <h3 className="font-serif text-lg text-text mb-4">Store Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.properties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights Chat */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-background" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-text">Argos AI Estate Analyst</h3>
                <p className="text-xs text-text-muted">Powered by Store OS Intelligence</p>
              </div>
            </div>
            <div className="h-[450px]">
              <ChatInterface
                messages={aiMessages}
                onSend={handleAiSend}
                placeholder="Ask about revenue, Nectar customers, campaigns..."
                userInitials="BB"
              />
            </div>
          </div>

          {/* Customer Insights */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-text">AI-Generated Nectar Insights</h3>
            {memberInsights.map((insight, i) => (
              <div
                key={i}
                className={cn(
                  "bg-surface-1 border rounded-[var(--radius-xl)] p-5",
                  insight.priority === 'high'
                    ? "border-amber-dim/50 bg-amber-dim/10"
                    : "border-[rgba(255,255,255,0.07)]"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className={cn(
                      "w-4 h-4",
                      insight.priority === 'high' ? "text-amber" : "text-gold"
                    )} />
                    <h4 className="font-medium text-text">{insight.title}</h4>
                  </div>
                  <StatusBadge variant={insight.priority === 'high' ? 'amber' : 'gold'}>
                    {insight.priority}
                  </StatusBadge>
                </div>
                <p className="text-sm text-text-muted mb-3">{insight.insight}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gold">
                    Recommendation: {insight.recommendation}
                  </p>
                  <Button size="sm" variant="outline" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
                    Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {socialTrending.map((platform) => (
              <div
                key={platform.platform}
                className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-text">{platform.platform}</h4>
                  <StatusBadge variant={platform.sentiment === 'positive' ? 'green' : 'gold'}>
                    {platform.engagement}
                  </StatusBadge>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Mentions (7d)</p>
                    <p className="text-2xl font-semibold text-text tabular-nums">
                      {platform.mentions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-2">Trending Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {platform.trending.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-surface-3 text-xs text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Top Post</p>
                    <p className="text-sm text-text">&quot;{platform.topPost}&quot;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AlertStrip
            variant="info"
            title="Social Listening Active"
            description="Store OS monitors brand mentions across Instagram, Twitter/X, TikTok, and LinkedIn. Sentiment analysis runs hourly."
          />
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-text">Marketing Campaign Opportunities</h3>
            <Button className="bg-gold hover:bg-gold/90 text-background">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Campaign
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {campaignOpportunities.map((campaign, i) => (
              <div
                key={i}
                className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5 hover:border-gold-dim transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium text-text">{campaign.title}</h4>
                  <StatusBadge variant={campaign.status === 'ready' ? 'green' : 'gold'}>
                    {campaign.status}
                  </StatusBadge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Building2 className="w-3 h-3" />
                    {campaign.properties.join(', ')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Users className="w-3 h-3" />
                    {campaign.targetSegment}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Calendar className="w-3 h-3" />
                    {campaign.timing}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.07)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted">Projected Revenue</p>
                      <p className="text-lg font-semibold text-gold">{campaign.projectedRevenue}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
                      Launch
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gold-glow border border-gold-dim rounded-[var(--radius-xl)] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-text mb-2">Argos AI Campaign Recommendation</h4>
                <p className="text-sm text-text-muted mb-4">
                  Based on Nectar swipe behaviour and Easter trading patterns, launching the Easter Fresh Push
                  by the Saturday before bank holiday could capture peak family-shop demand. Stores with TTD
                  density above 32% over-index by 14% on Easter weekend; surge fresh capacity at Potters Bar,
                  Nine Elms, and Cromwell Road.
                </p>
                <Button size="sm" className="bg-gold hover:bg-gold/90 text-background">
                  Apply AI Recommendation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Building2({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}
