"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Star,
  AlertTriangle,
  ChevronRight,
  Globe,
  Sparkles,
  BarChart3,
  PieChart,
  Calendar,
  MessageSquare,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHouseOS } from "@/lib/house-os-context"

const portfolioProperties = [
  {
    id: 1,
    name: "Soho House London",
    location: "Greek Street, London",
    status: "optimal",
    occupancy: 94,
    revenue: 2847000,
    revenueTrend: 12.4,
    memberSatisfaction: 4.8,
    activeMembers: 12450,
    alerts: 0,
    image: "london",
  },
  {
    id: 2,
    name: "Soho House New York",
    location: "Meatpacking District, NYC",
    status: "warning",
    occupancy: 87,
    revenue: 3156000,
    revenueTrend: 8.2,
    memberSatisfaction: 4.6,
    activeMembers: 15230,
    alerts: 2,
    image: "nyc",
  },
  {
    id: 3,
    name: "Soho House Miami",
    location: "Miami Beach, FL",
    status: "optimal",
    occupancy: 91,
    revenue: 1923000,
    revenueTrend: 15.7,
    memberSatisfaction: 4.9,
    activeMembers: 8940,
    alerts: 0,
    image: "miami",
  },
  {
    id: 4,
    name: "Soho House Berlin",
    location: "Mitte, Berlin",
    status: "optimal",
    occupancy: 89,
    revenue: 1654000,
    revenueTrend: 6.3,
    memberSatisfaction: 4.7,
    activeMembers: 7820,
    alerts: 1,
    image: "berlin",
  },
  {
    id: 5,
    name: "Soho House Hong Kong",
    location: "Central, Hong Kong",
    status: "critical",
    occupancy: 72,
    revenue: 1245000,
    revenueTrend: -3.2,
    memberSatisfaction: 4.3,
    activeMembers: 5670,
    alerts: 4,
    image: "hk",
  },
  {
    id: 6,
    name: "Soho House Amsterdam",
    location: "Canal Ring, Amsterdam",
    status: "optimal",
    occupancy: 96,
    revenue: 1432000,
    revenueTrend: 18.9,
    memberSatisfaction: 4.9,
    activeMembers: 6230,
    alerts: 0,
    image: "amsterdam",
  },
]

const aiInsights = [
  {
    id: 1,
    type: "opportunity",
    title: "Member Acquisition Window",
    description:
      "Instagram engagement up 340% in Miami following Art Basel. Recommend targeted membership campaign to convert engaged audience.",
    impact: "Potential +850 new members",
    confidence: 94,
    property: "Miami",
    priority: "high",
  },
  {
    id: 2,
    type: "risk",
    title: "Occupancy Decline Pattern",
    description:
      "Hong Kong showing consistent 3-week occupancy decline. Historical data suggests correlation with regional economic indicators.",
    impact: "Revenue at risk: $234K/month",
    confidence: 87,
    property: "Hong Kong",
    priority: "critical",
  },
  {
    id: 3,
    type: "optimization",
    title: "Event Space Utilization",
    description:
      "London Screening Room underutilized Tue-Thu. Similar properties saw 28% revenue lift with corporate partnership programs.",
    impact: "Potential +$45K/month",
    confidence: 91,
    property: "London",
    priority: "medium",
  },
  {
    id: 4,
    type: "trend",
    title: "Wellness Trend Acceleration",
    description:
      "Spa and wellness bookings up 67% across portfolio. Members mentioning 'digital detox' in feedback. Consider wellness-focused membership tier.",
    impact: "Market opportunity: $2.1M",
    confidence: 88,
    property: "Global",
    priority: "high",
  },
]

const socialTrends = [
  { platform: "Instagram", mentions: 45230, sentiment: 92, trending: ["#SohoHouseMiami", "#ArtBasel2024", "#MemberLife"] },
  { platform: "TikTok", mentions: 23890, sentiment: 88, trending: ["@sohohouse", "#LuxuryClub", "#ExclusiveAccess"] },
  { platform: "Twitter", mentions: 12450, sentiment: 85, trending: ["#SohoHouseNYC", "#MeatpackingDistrict"] },
]

const upcomingEvents = [
  { name: "Summer Solstice Gala", property: "London", date: "Jun 21", expected: 450, status: "selling-fast" },
  { name: "Film Premiere: Moonlight", property: "NYC", date: "Jun 24", expected: 280, status: "on-sale" },
  { name: "Art Exhibition Opening", property: "Miami", date: "Jun 28", expected: 320, status: "sold-out" },
  { name: "Chef's Table Experience", property: "Berlin", date: "Jul 2", expected: 48, status: "on-sale" },
]

export default function ExecutivePortfolioPage() {
  const { state } = useHouseOS()
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)
  const [activeInsight, setActiveInsight] = useState(0)
  const [showAIPanel, setShowAIPanel] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowAIPanel(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const totalRevenue = portfolioProperties.reduce((sum, p) => sum + p.revenue, 0)
  const avgOccupancy = Math.round(portfolioProperties.reduce((sum, p) => sum + p.occupancy, 0) / portfolioProperties.length)
  const totalMembers = portfolioProperties.reduce((sum, p) => sum + p.activeMembers, 0)
  const totalAlerts = portfolioProperties.reduce((sum, p) => sum + p.alerts, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-card via-background to-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="relative px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-foreground">Portfolio Command Center</h1>
              <p className="mt-1 text-muted-foreground">Real-time intelligence across 42 global properties</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2 border-border/50 bg-card/50 backdrop-blur-sm">
                <Calendar className="h-4 w-4" />
                Q2 2024
              </Button>
              <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </motion.div>

          {/* Global KPIs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 grid grid-cols-4 gap-6"
          >
            <div className="rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-semibold text-foreground">${(totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-400" />
                <span className="text-green-400">+12.4%</span>
                <span className="text-muted-foreground">vs last quarter</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Activity className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Occupancy</p>
                  <p className="text-2xl font-semibold text-foreground">{avgOccupancy}%</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={avgOccupancy} className="h-2 bg-muted" />
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-semibold text-foreground">{(totalMembers / 1000).toFixed(1)}K</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-400" />
                <span className="text-green-400">+2,340</span>
                <span className="text-muted-foreground">new this month</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-semibold text-foreground">{totalAlerts}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-amber-400">2 critical</span>
                <span className="text-muted-foreground">require attention</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList className="border border-border/50 bg-card/50 p-1">
              <TabsTrigger value="properties" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Building2 className="h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Sparkles className="h-4 w-4" />
                AI Insights
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <MessageSquare className="h-4 w-4" />
                Social & Trends
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {portfolioProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProperty(selectedProperty === property.id ? null : property.id)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 ${
                        selectedProperty === property.id ? "border-accent ring-1 ring-accent/30" : ""
                      }`}
                    >
                      <div className="relative h-32 bg-gradient-to-br from-accent/20 to-accent/5">
                        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30" />
                        <div className="absolute right-3 top-3">
                          <Badge
                            variant="outline"
                            className={`border-0 ${
                              property.status === "optimal"
                                ? "bg-green-500/20 text-green-300"
                                : property.status === "warning"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {property.status}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <h3 className="font-semibold text-foreground">{property.name}</h3>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p className="font-semibold text-foreground">${(property.revenue / 1000000).toFixed(2)}M</p>
                            <div className="flex items-center gap-1 text-xs">
                              {property.revenueTrend > 0 ? (
                                <>
                                  <TrendingUp className="h-3 w-3 text-green-400" />
                                  <span className="text-green-400">+{property.revenueTrend}%</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="h-3 w-3 text-red-400" />
                                  <span className="text-red-400">{property.revenueTrend}%</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Occupancy</p>
                            <p className="font-semibold text-foreground">{property.occupancy}%</p>
                            <Progress value={property.occupancy} className="mt-1 h-1.5 bg-muted" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/50 pt-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-400" />
                            <span className="text-sm text-foreground">{property.memberSatisfaction}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{(property.activeMembers / 1000).toFixed(1)}K</span>
                          </div>
                          {property.alerts > 0 && (
                            <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-400">
                              {property.alerts} alerts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {aiInsights.map((insight, index) => (
                  <motion.div key={insight.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card
                      className={`border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:shadow-lg ${
                        insight.priority === "critical" ? "border-l-4 border-l-red-500" : insight.priority === "high" ? "border-l-4 border-l-amber-500" : ""
                      }`}
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                insight.type === "opportunity"
                                  ? "bg-green-500/10"
                                  : insight.type === "risk"
                                    ? "bg-red-500/10"
                                    : insight.type === "optimization"
                                      ? "bg-blue-500/10"
                                      : "bg-purple-500/10"
                              }`}
                            >
                              {insight.type === "opportunity" ? (
                                <Target className="h-5 w-5 text-green-400" />
                              ) : insight.type === "risk" ? (
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                              ) : insight.type === "optimization" ? (
                                <Zap className="h-5 w-5 text-blue-400" />
                              ) : (
                                <TrendingUp className="h-5 w-5 text-purple-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{insight.title}</h3>
                              <p className="text-sm text-muted-foreground">{insight.property}</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              insight.priority === "critical"
                                ? "border-red-500/50 bg-red-500/10 text-red-400"
                                : insight.priority === "high"
                                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                                  : "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            {insight.priority}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>

                        <div className="flex items-center justify-between border-t border-border/50 pt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Projected Impact</p>
                            <p className="font-semibold text-accent">{insight.impact}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">AI Confidence</p>
                            <div className="flex items-center gap-2">
                              <Progress value={insight.confidence} className="h-2 w-16 bg-muted" />
                              <span className="text-sm font-medium text-foreground">{insight.confidence}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                            Take Action
                          </Button>
                          <Button size="sm" variant="outline" className="border-border/50">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {socialTrends.map((platform, index) => (
                  <motion.div key={platform.platform} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{platform.platform}</h3>
                          <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
                            {platform.sentiment}% positive
                          </Badge>
                        </div>

                        <div>
                          <p className="text-3xl font-semibold text-foreground">{(platform.mentions / 1000).toFixed(1)}K</p>
                          <p className="text-sm text-muted-foreground">mentions this week</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">TRENDING</p>
                          <div className="flex flex-wrap gap-2">
                            {platform.trending.map((tag) => (
                              <Badge key={tag} variant="outline" className="border-accent/30 bg-accent/5 text-accent">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Marketing Campaign Opportunities</h3>
                      <p className="text-sm text-muted-foreground">AI-identified opportunities based on social trends</p>
                    </div>
                    <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                      <Sparkles className="h-4 w-4" />
                      Generate Campaign
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-accent" />
                        <h4 className="font-medium text-foreground">Art Basel Momentum</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Capitalize on 340% engagement spike. Launch Miami membership drive targeting art collectors and creatives.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-accent">Est. ROI: 4.2x</span>
                        <Button size="sm" variant="outline" className="border-accent/50 text-accent">
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-purple-400" />
                        <h4 className="font-medium text-foreground">Digital Detox Series</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Wellness trend growing 67%. Create exclusive retreat experiences across London, Amsterdam, and Miami.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-400">Est. ROI: 3.8x</span>
                        <Button size="sm" variant="outline" className="border-purple-400/50 text-purple-400">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div key={event.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={`${
                              event.status === "sold-out"
                                ? "border-green-500/50 bg-green-500/10 text-green-400"
                                : event.status === "selling-fast"
                                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                                  : "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            {event.status}
                          </Badge>
                          <span className="text-sm font-medium text-accent">{event.date}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{event.name}</h4>
                          <p className="text-sm text-muted-foreground">{event.property}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{event.expected} expected</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Assistant Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">House AI Assistant</h3>
                    <p className="text-sm text-muted-foreground">Executive Briefing</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
                  <p className="text-sm leading-relaxed text-foreground">
                    Good morning. Based on overnight data analysis, here are your priority items for today:
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400" />
                      <p className="text-sm text-muted-foreground">Hong Kong occupancy requires immediate attention - recommend emergency pricing review</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-400" />
                      <p className="text-sm text-muted-foreground">Miami Art Basel campaign ready for approval - projected 850 new member acquisitions</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <p className="text-sm text-muted-foreground">Amsterdam exceeding all targets - consider as model for operational playbook</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">QUICK ACTIONS</p>
                  <Button variant="outline" className="w-full justify-start gap-2 border-border/50">
                    <BarChart3 className="h-4 w-4" />
                    Generate Board Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 border-border/50">
                    <PieChart className="h-4 w-4" />
                    Revenue Deep Dive
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 border-border/50">
                    <Globe className="h-4 w-4" />
                    Regional Comparison
                  </Button>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">Ask House AI</span>
                  </div>
                  <input
                    type="text"
                    placeholder="E.g., 'Compare Q2 performance across Europe'"
                    className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
