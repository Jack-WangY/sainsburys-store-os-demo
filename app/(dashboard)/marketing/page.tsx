"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Megaphone,
  Calendar,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Mail,
  MessageSquare,
  Instagram,
  Globe,
  Play,
  ChevronRight,
  BarChart3,
  Zap,
  Send,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHouseOS } from "@/lib/house-os-context"

const activeCampaigns = [
  {
    id: 1,
    name: "Art Basel Miami 2024",
    type: "Event",
    status: "active",
    reach: 245000,
    engagement: 12.4,
    conversions: 892,
    budget: 50000,
    spent: 34500,
    channels: ["Instagram", "Email", "Display"],
    performance: "exceeding",
  },
  {
    id: 2,
    name: "Summer Membership Drive",
    type: "Acquisition",
    status: "active",
    reach: 180000,
    engagement: 8.7,
    conversions: 234,
    budget: 75000,
    spent: 45200,
    channels: ["Paid Social", "Email", "Referral"],
    performance: "on-track",
  },
  {
    id: 3,
    name: "Wellness Week Promotion",
    type: "F&B",
    status: "scheduled",
    reach: 0,
    engagement: 0,
    conversions: 0,
    budget: 25000,
    spent: 0,
    channels: ["Email", "App Push", "In-House"],
    performance: "pending",
  },
]

const upcomingEvents = [
  {
    id: 1,
    name: "Summer Solstice Gala",
    property: "Soho House London",
    date: "June 21, 2024",
    time: "7:00 PM",
    capacity: 450,
    registered: 412,
    waitlist: 89,
    revenue: 123500,
    status: "selling-fast",
  },
  {
    id: 2,
    name: "Film Premiere: Moonlight Rising",
    property: "Soho House NYC",
    date: "June 24, 2024",
    time: "8:00 PM",
    capacity: 280,
    registered: 156,
    waitlist: 0,
    revenue: 45600,
    status: "on-sale",
  },
  {
    id: 3,
    name: "Contemporary Art Exhibition",
    property: "Soho House Miami",
    date: "June 28, 2024",
    time: "6:00 PM",
    capacity: 320,
    registered: 320,
    waitlist: 145,
    revenue: 89400,
    status: "sold-out",
  },
  {
    id: 4,
    name: "Wine Tasting: Italian Classics",
    property: "Soho House Berlin",
    date: "July 2, 2024",
    time: "7:30 PM",
    capacity: 48,
    registered: 32,
    waitlist: 0,
    revenue: 4800,
    status: "on-sale",
  },
]

const aiCampaignSuggestions = [
  {
    title: "Digital Detox Retreat Series",
    description: "Launch a multi-property wellness campaign targeting high-engagement members interested in mindfulness.",
    targetAudience: "12,400 members",
    projectedROI: "4.2x",
    channels: ["Email", "App", "Instagram"],
    urgency: "high",
  },
  {
    title: "Summer Music Series",
    description: "Capitalize on trending music interest with rooftop concert series across European properties.",
    targetAudience: "28,900 members",
    projectedROI: "3.8x",
    channels: ["Social", "Email", "Partnerships"],
    urgency: "medium",
  },
  {
    title: "Member Referral Boost",
    description: "Re-engage top referring members with exclusive incentives during peak application season.",
    targetAudience: "3,200 members",
    projectedROI: "5.1x",
    channels: ["Email", "Personal Outreach"],
    urgency: "high",
  },
]

const contentCalendar = [
  { day: "Mon", posts: 3, engagement: 2400, topContent: "Behind-the-scenes" },
  { day: "Tue", posts: 2, engagement: 1800, topContent: "Member spotlight" },
  { day: "Wed", posts: 4, engagement: 3200, topContent: "Event promo" },
  { day: "Thu", posts: 2, engagement: 2100, topContent: "Food & drink" },
  { day: "Fri", posts: 5, engagement: 4500, topContent: "Weekend events" },
  { day: "Sat", posts: 3, engagement: 3800, topContent: "Live coverage" },
  { day: "Sun", posts: 2, engagement: 1600, topContent: "Relaxation" },
]

export default function MarketingPage() {
  const { state } = useHouseOS()
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null)
  const [generatingContent, setGeneratingContent] = useState(false)

  const handleGenerateContent = () => {
    setGeneratingContent(true)
    setTimeout(() => setGeneratingContent(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Marketing & Events</h1>
          <p className="text-muted-foreground">AI-powered campaign management and event coordination</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-border/50">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <Megaphone className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </motion.div>

      {/* Summary KPIs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
              <p className="text-xl font-semibold text-foreground">12</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/50 bg-card/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reach</p>
              <p className="text-xl font-semibold text-foreground">1.2M</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/50 bg-card/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Events This Month</p>
              <p className="text-xl font-semibold text-foreground">47</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/50 bg-card/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Event Registrations</p>
              <p className="text-xl font-semibold text-foreground">8,420</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="border border-border/50 bg-card/50 p-1">
          <TabsTrigger value="campaigns" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Megaphone className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <FileText className="h-4 w-4" />
            Content Calendar
          </TabsTrigger>
          <TabsTrigger value="ai-studio" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            AI Studio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {activeCampaigns.map((campaign, index) => (
              <motion.div key={campaign.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card
                  className={`cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-accent/50 ${
                    selectedCampaign === campaign.id ? "border-accent ring-1 ring-accent/30" : ""
                  }`}
                  onClick={() => setSelectedCampaign(selectedCampaign === campaign.id ? null : campaign.id)}
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">{campaign.type} Campaign</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          campaign.status === "active"
                            ? "border-green-500/50 bg-green-500/10 text-green-400"
                            : "border-amber-500/50 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {campaign.status}
                      </Badge>
                    </div>

                    {campaign.status === "active" && (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Reach</p>
                            <p className="font-semibold text-foreground">{(campaign.reach / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                            <p className="font-semibold text-foreground">{campaign.engagement}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Conversions</p>
                            <p className="font-semibold text-foreground">{campaign.conversions}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Budget</span>
                            <span className="text-foreground">
                              ${(campaign.spent / 1000).toFixed(1)}K / ${(campaign.budget / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2 bg-muted" />
                        </div>

                        <div className="flex gap-2">
                          {campaign.channels.map((channel) => (
                            <Badge key={channel} variant="outline" className="border-border/50 text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <Badge
                            variant="outline"
                            className={`${
                              campaign.performance === "exceeding" ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-blue-500/50 bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {campaign.performance === "exceeding" ? "Exceeding Goals" : "On Track"}
                          </Badge>
                          <Button size="sm" variant="ghost" className="gap-1 text-accent">
                            Details
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}

                    {campaign.status === "scheduled" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Launching July 8, 2024
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI Campaign Suggestions */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">AI Campaign Recommendations</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {aiCampaignSuggestions.map((suggestion, index) => (
                  <div key={index} className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                      {suggestion.urgency === "high" && (
                        <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-400 text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{suggestion.targetAudience}</span>
                      <span className="font-medium text-accent">ROI: {suggestion.projectedROI}</span>
                    </div>
                    <div className="flex gap-2">
                      {suggestion.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="border-accent/30 bg-accent/5 text-accent text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Create Campaign
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {upcomingEvents.map((event, index) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.property}</p>
                      </div>
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
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="text-foreground">
                          {event.registered} / {event.capacity}
                        </span>
                      </div>
                      <Progress value={(event.registered / event.capacity) * 100} className="h-2 bg-muted" />
                      {event.waitlist > 0 && <p className="text-xs text-amber-400">+{event.waitlist} on waitlist</p>}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-semibold text-accent">${event.revenue.toLocaleString()}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-border/50">
                        Manage Event
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">This Week&apos;s Content Performance</h3>
                <Button variant="outline" className="gap-2 border-border/50">
                  <Calendar className="h-4 w-4" />
                  View Full Calendar
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {contentCalendar.map((day) => (
                  <div key={day.day} className="text-center space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">{day.day}</p>
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-2">
                      <p className="text-2xl font-semibold text-foreground">{day.posts}</p>
                      <p className="text-xs text-muted-foreground">posts</p>
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-sm font-medium text-accent">{(day.engagement / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-muted-foreground">engagement</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-border/50 text-xs">
                      {day.topContent}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai-studio" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-foreground">AI Image Generation</h3>
                </div>
                <p className="text-sm text-muted-foreground">Generate on-brand visual content for social media and campaigns</p>
                <div className="rounded-xl border border-dashed border-border/50 bg-muted/30 p-8 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">Describe the image you want to create</p>
                  <Button className="mt-4 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                    <Sparkles className="h-4 w-4" />
                    Generate Image
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-foreground">AI Copy Generation</h3>
                </div>
                <p className="text-sm text-muted-foreground">Generate compelling copy for emails, social posts, and ads</p>
                <div className="space-y-3">
                  <div className="rounded-lg border border-border/50 bg-background/50 p-3">
                    <textarea
                      placeholder="E.g., 'Write an Instagram caption for our upcoming Summer Solstice Gala at Soho House London...'"
                      className="w-full resize-none border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleGenerateContent}
                    disabled={generatingContent}
                    className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {generatingContent ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Copy
                      </>
                    )}
                  </Button>
                </div>

                {!generatingContent && (
                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground">QUICK TEMPLATES</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer border-border/50 hover:border-accent/50">
                        Event Announcement
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer border-border/50 hover:border-accent/50">
                        Member Welcome
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer border-border/50 hover:border-accent/50">
                        F&B Promotion
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">AI Campaign Builder</h3>
              </div>
              <p className="text-sm text-muted-foreground">Let AI design a complete multi-channel campaign based on your objectives</p>
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center cursor-pointer hover:border-accent/50 transition-colors">
                  <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium text-foreground">Email</p>
                  <CheckCircle2 className="mx-auto mt-2 h-4 w-4 text-green-400" />
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center cursor-pointer hover:border-accent/50 transition-colors">
                  <Instagram className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium text-foreground">Social</p>
                  <CheckCircle2 className="mx-auto mt-2 h-4 w-4 text-green-400" />
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center cursor-pointer hover:border-accent/50 transition-colors">
                  <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium text-foreground">SMS</p>
                  <div className="mx-auto mt-2 h-4 w-4 rounded-full border-2 border-muted-foreground" />
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center cursor-pointer hover:border-accent/50 transition-colors">
                  <Globe className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium text-foreground">Display</p>
                  <div className="mx-auto mt-2 h-4 w-4 rounded-full border-2 border-muted-foreground" />
                </div>
              </div>
              <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Zap className="h-4 w-4" />
                Generate Campaign
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
