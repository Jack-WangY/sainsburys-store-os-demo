"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  TrendingUp,
  Star,
  Calendar,
  MapPin,
  Heart,
  Wine,
  Film,
  Music,
  Dumbbell,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Activity,
  UserPlus,
  Award,
  Clock,
  CreditCard,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useHouseOS } from "@/lib/house-os-context"

const memberSegments = [
  { name: "Founding Members", count: 2340, spend: 12500, growth: 2.1, color: "bg-accent" },
  { name: "Every House", count: 18450, spend: 8900, growth: 8.4, color: "bg-purple-500" },
  { name: "Local House", count: 12890, spend: 4200, growth: 12.7, color: "bg-blue-500" },
  { name: "Under 27", count: 8920, spend: 2100, growth: 23.4, color: "bg-green-500" },
]

const topMembers = [
  {
    id: 1,
    name: "Alexandra Chen",
    initials: "AC",
    tier: "Founding",
    since: 2015,
    houses: ["London", "NYC", "Hong Kong"],
    visits: 147,
    spend: 89500,
    interests: ["Wine", "Film", "Art"],
    lastVisit: "2 days ago",
    sentiment: 98,
  },
  {
    id: 2,
    name: "Marcus Williams",
    initials: "MW",
    tier: "Every House",
    since: 2018,
    houses: ["Miami", "Berlin", "Amsterdam"],
    visits: 89,
    spend: 56200,
    interests: ["Music", "Wellness", "Dining"],
    lastVisit: "Yesterday",
    sentiment: 94,
  },
  {
    id: 3,
    name: "Sophie Laurent",
    initials: "SL",
    tier: "Founding",
    since: 2012,
    houses: ["London", "Paris", "Rome"],
    visits: 234,
    spend: 124800,
    interests: ["Art", "Fashion", "Dining"],
    lastVisit: "Today",
    sentiment: 99,
  },
  {
    id: 4,
    name: "James Morrison",
    initials: "JM",
    tier: "Every House",
    since: 2019,
    houses: ["NYC", "LA", "Chicago"],
    visits: 67,
    spend: 43100,
    interests: ["Film", "Music", "Fitness"],
    lastVisit: "1 week ago",
    sentiment: 87,
  },
]

const interestCategories = [
  { name: "Dining & Wine", icon: Wine, members: 34500, growth: 12 },
  { name: "Film & Screenings", icon: Film, members: 28900, growth: 8 },
  { name: "Music & Events", icon: Music, members: 31200, growth: 15 },
  { name: "Wellness & Spa", icon: Dumbbell, members: 22400, growth: 23 },
]

const aiMemberInsights = [
  {
    title: "Churn Risk Detection",
    description: "147 members showing decreased engagement patterns. Recommend personalized outreach campaign.",
    impact: "Prevent $1.2M annual revenue loss",
    action: "View at-risk members",
  },
  {
    title: "Upsell Opportunity",
    description: "892 Local House members frequently visit 3+ properties. Strong candidates for Every House upgrade.",
    impact: "Potential $890K upgrade revenue",
    action: "Create campaign",
  },
  {
    title: "Event Affinity Match",
    description: "2,340 members with art interest haven't been invited to Miami Art Basel events.",
    impact: "+340 event RSVPs projected",
    action: "Send invitations",
  },
]

export default function MemberInsightsPage() {
  const { state } = useHouseOS()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState<number | null>(null)

  const totalMembers = memberSegments.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Member Intelligence</h1>
          <p className="text-muted-foreground">AI-powered member insights and engagement analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 border-border/50 bg-card/50 pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </motion.div>

      {/* Summary KPIs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-xl font-semibold text-foreground">{(totalMembers / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/50 bg-card/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Growth</p>
              <p className="text-xl font-semibold text-foreground">+2,340</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/50 bg-card/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <Star className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
              <p className="text-xl font-semibold text-foreground">4.7/5</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/50 bg-card/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <CreditCard className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Annual Spend</p>
              <p className="text-xl font-semibold text-foreground">$6,840</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Member Segments */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Member Segments</h3>
              <div className="space-y-3">
                {memberSegments.map((segment) => (
                  <div key={segment.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{segment.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{(segment.count / 1000).toFixed(1)}K</span>
                        <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400 text-xs">
                          +{segment.growth}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(segment.count / totalMembers) * 100} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground">Avg spend: ${segment.spend.toLocaleString()}/yr</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top Members */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Top Members by Engagement</h3>
                <Button variant="ghost" size="sm" className="gap-1 text-accent">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {topMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedMember === member.id ? "border-accent bg-accent/5" : "border-border/50 hover:border-accent/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border border-border/50">
                        <AvatarFallback className="bg-accent/10 text-accent">{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{member.name}</h4>
                          <Badge variant="outline" className="border-accent/50 bg-accent/10 text-accent text-xs">
                            {member.tier}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Since {member.since}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {member.houses.length} houses
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {member.visits} visits
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${(member.spend / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-muted-foreground">{member.lastVisit}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className={`h-4 w-4 ${member.sentiment >= 95 ? "text-green-400" : member.sentiment >= 85 ? "text-amber-400" : "text-red-400"}`} />
                        <span className="text-sm font-medium text-foreground">{member.sentiment}%</span>
                      </div>
                    </div>

                    {selectedMember === member.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 border-t border-border/50 pt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-2">INTERESTS</p>
                            <div className="flex gap-2">
                              {member.interests.map((interest) => (
                                <Badge key={interest} variant="outline" className="border-border/50">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1 border-border/50">
                              <MessageSquare className="h-3 w-3" />
                              Message
                            </Button>
                            <Button size="sm" className="gap-1 bg-accent text-accent-foreground">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Interest Categories & AI Insights */}
      <div className="grid grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Interest Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {interestCategories.map((category) => (
                  <div key={category.name} className="rounded-xl border border-border/50 p-4 hover:border-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                        <category.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{(category.members / 1000).toFixed(1)}K members</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">+{category.growth}%</span>
                      <span className="text-muted-foreground">engagement</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">AI Member Insights</h3>
              </div>
              <div className="space-y-3">
                {aiMemberInsights.map((insight, index) => (
                  <div key={index} className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <Award className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-medium text-accent">{insight.impact}</span>
                      <Button size="sm" variant="outline" className="border-accent/50 text-accent">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
