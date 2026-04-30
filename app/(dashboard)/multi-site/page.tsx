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

const monthlyRevenueByProperty = [
  { property: 'Farmhouse', thisMonth: 1240, lastMonth: 1080 },
  { property: '180 House', thisMonth: 980, lastMonth: 890 },
  { property: 'Shoreditch', thisMonth: 920, lastMonth: 870 },
  { property: 'White City', thisMonth: 780, lastMonth: 820 },
  { property: 'Dean St', thisMonth: 720, lastMonth: 680 },
  { property: 'High Road', thisMonth: 580, lastMonth: 540 },
  { property: 'Electric', thisMonth: 540, lastMonth: 510 },
  { property: 'Mayfair', thisMonth: 420, lastMonth: 390 },
  { property: 'Balham', thisMonth: 340, lastMonth: 310 },
]

const occupancyTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  ukAvg: 75 + Math.random() * 15,
  farmhouse: 85 + Math.random() * 12,
}))

const socialTrending = [
  {
    platform: 'Instagram',
    mentions: 2840,
    sentiment: 'positive',
    trending: ['#SohoFarmhouse', '#SohoHouseUK', '#MembersOnly'],
    topPost: 'Sunset sessions at the pool - summer vibes',
    engagement: '+18%',
  },
  {
    platform: 'Twitter/X',
    mentions: 1240,
    sentiment: 'neutral',
    trending: ['@SohoHouse', '#WhiteCityHouse'],
    topPost: 'New screening room now open at White City',
    engagement: '+12%',
  },
  {
    platform: 'TikTok',
    mentions: 3420,
    sentiment: 'positive',
    trending: ['#SohoHouse', '#LondonVibes', '#MemberPerks'],
    topPost: 'Room tour at 180 House - worth it?',
    engagement: '+45%',
  },
]

const memberInsights = [
  {
    title: 'Member Retention Alert',
    insight: '23 members with lapsed visits >90 days at Shoreditch House',
    recommendation: 'Trigger re-engagement email with exclusive event invitation',
    priority: 'high',
  },
  {
    title: 'High-Value Member Pattern',
    insight: 'Tech founders segment showing 34% higher F&B spend on Thursdays',
    recommendation: 'Consider exclusive Thursday networking event series',
    priority: 'medium',
  },
  {
    title: 'Cross-Property Opportunity',
    insight: '156 London members have never visited Soho Farmhouse',
    recommendation: 'Targeted weekend getaway campaign with priority booking',
    priority: 'medium',
  },
]

const campaignOpportunities = [
  {
    title: 'Summer Pool Series',
    properties: ['Shoreditch', 'White City'],
    projectedRevenue: '£45,000',
    targetSegment: 'Under-30 members',
    timing: 'June - August',
    status: 'ready',
  },
  {
    title: 'Cotswolds Culinary Weekend',
    properties: ['Soho Farmhouse'],
    projectedRevenue: '£28,000',
    targetSegment: 'Foodies, 35-50',
    timing: 'May weekends',
    status: 'planning',
  },
  {
    title: 'Members-Only Cinema Preview',
    properties: ['Electric House', 'White City'],
    projectedRevenue: '£12,000',
    targetSegment: 'Film enthusiasts',
    timing: 'Q2 Film releases',
    status: 'ready',
  },
]

const aiInsightsChat = [
  {
    id: '1',
    content: "I can provide AI-powered insights across your portfolio. What would you like to explore? Try asking about revenue trends, member behaviour, or marketing opportunities.",
    sender: 'system' as const,
  },
]

const aiResponses: Record<string, string> = {
  revenue: `Based on the last 30 days:

**Revenue Trends:**
- Soho Farmhouse leads with £1.24M (+15% MoM)
- White City showing decline (-5%) - investigate bar revenue dip
- Overall portfolio up 9.2% YTD

**Recommendation:** Consider reallocating F&B staff from quieter midweek Balham shifts to support Farmhouse weekend demand.`,
  
  member: `**Member Behaviour Analysis:**

- Average member visits: 3.2x per month
- Peak visit times: Thu-Sat 18:00-22:00
- Cross-property usage: 28% visit multiple houses

**Key Insight:** Members who attend events are 2.4x more likely to renew. Consider increasing event programming at underperforming properties.`,

  marketing: `**Marketing Opportunities Identified:**

1. **Summer Pool Campaign** - Ready to launch
   Target: Under-30 members
   Projected: £45k revenue

2. **Lapsed Member Re-engagement**
   23 members inactive >90 days at Shoreditch
   Recommend: Exclusive event invitation

3. **Cross-sell Farmhouse**
   156 London members never visited
   Recommend: Weekend getaway promo`,

  default: `I've analysed your portfolio data. Here are the key insights:

**Top Performer:** Soho Farmhouse (96% occupancy, £68.9k daily revenue)
**Attention Needed:** White City House (bar variance, Oracle posting held)
**Opportunity:** 156 London members haven't visited Farmhouse - cross-sell potential

Would you like me to dive deeper into any of these areas?`,
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
      else if (lowerContent.includes('member') || lowerContent.includes('behaviour')) responseKey = 'member'
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
          title="YTD Revenue"
          icon={<PoundSterling className="w-3.5 h-3.5" />}
          value="£38.4M"
          label="UK Portfolio · FY2026"
          delta={{ direction: 'up', value: '9.2%', label: 'vs FY2025' }}
        />
        <KPICard
          title="EBITDA Margin"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          value="18.6%"
          label="Improved from 14.2%"
          delta={{ direction: 'up', value: '4.4pts', label: 'YoY' }}
        />
        <KPICard
          title="Membership Revenue"
          icon={<Users className="w-3.5 h-3.5" />}
          value="£12.1M"
          label="42% of total revenue"
          delta={{ direction: 'up', value: '7.8%' }}
        />
        <KPICard
          title="F&B Covers MTD"
          icon={<Utensils className="w-3.5 h-3.5" />}
          value="48,320"
          label="Avg spend £34.20/cover"
          delta={{ direction: 'up', value: '5.6%' }}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-0">
        {[
          { id: 'overview', label: 'Portfolio Overview', icon: BarChart3 },
          { id: 'insights', label: 'AI Insights', icon: Brain },
          { id: 'social', label: 'Social & Member Trends', icon: Hash },
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
            {/* Monthly Revenue by Property */}
            <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
              <h3 className="font-serif text-lg text-text mb-4">Monthly Revenue by Property</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueByProperty} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#8a8278" fontSize={11} tickFormatter={(v) => `£${v}k`} />
                    <YAxis type="category" dataKey="property" stroke="#8a8278" fontSize={11} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1815',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`£${value}k`, '']}
                    />
                    <Legend />
                    <Bar dataKey="thisMonth" name="This Month" fill="#c9a84c" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="lastMonth" name="Last Month" fill="rgba(201,168,76,0.3)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Occupancy Trend */}
            <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
              <h3 className="font-serif text-lg text-text mb-4">30-Day Occupancy Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#8a8278" fontSize={11} />
                    <YAxis stroke="#8a8278" fontSize={11} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
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
                      name="UK Average"
                      stroke="#c9a84c"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="farmhouse"
                      name="Soho Farmhouse"
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

          {/* Property Cards Grid */}
          <div>
            <h3 className="font-serif text-lg text-text mb-4">Site Intelligence</h3>
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
                <h3 className="font-serif text-lg text-text">AI Portfolio Analyst</h3>
                <p className="text-xs text-text-muted">Powered by House OS Intelligence</p>
              </div>
            </div>
            <div className="h-[450px]">
              <ChatInterface
                messages={aiMessages}
                onSend={handleAiSend}
                placeholder="Ask about revenue, members, marketing..."
                userInitials="EX"
              />
            </div>
          </div>

          {/* Member Insights */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-text">AI-Generated Member Insights</h3>
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
            description="House OS monitors brand mentions across Instagram, Twitter/X, TikTok, and LinkedIn. Sentiment analysis runs hourly."
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
                <h4 className="font-medium text-text mb-2">AI Campaign Recommendation</h4>
                <p className="text-sm text-text-muted mb-4">
                  Based on member behavior patterns and seasonal trends, launching the Summer Pool Series 
                  in the first week of June could capture peak demand from under-30 members who show 
                  highest engagement during warm weather periods. Historical data suggests Thursday 
                  evening launches perform 23% better than weekend launches for this demographic.
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
