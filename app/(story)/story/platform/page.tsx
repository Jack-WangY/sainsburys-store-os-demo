"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  ArrowRight,
  Moon,
  Activity,
  LayoutDashboard,
  ClipboardCheck,
  Wifi,

  Building2,
  Sparkles,
  CheckCircle,
  Play,
  ExternalLink,
  ClipboardList,
  BarChart3,
} from 'lucide-react'

const personas = [
  {
    id: 'floor-manager',
    name: 'James Liu',
    role: 'Floor Manager',
    description: 'Capture shift context as events happen. Log commentary, record incidents, and see how your inputs flow through to the night supervisor, GM, and reports.',
    loginRole: 'floor',
    features: [
      'Shift summary and commentary',
      'Incident and event logging',
      'Revenue capture by outlet',
      'Real-time context that flows everywhere',
    ],
    icon: ClipboardList,
    color: 'blue',
    routes: ['/floor', '/shift'],
  },
  {
    id: 'night-supervisor',
    name: 'Night Supervisor',
    role: 'Night Supervisor / Finance Auditor',
    description: 'Experience the revenue audit workflow from the night supervisor\'s perspective. See how reconciliation, exception handling, and Oracle posting work in the AI-driven model.',
    loginRole: 'finance',
    features: [
      'Remote revenue audit with automated reconciliation',
      'Oracle Fusion journal posting',
      'Exception-based workflow',
      'Real-time system monitoring',
    ],
    icon: Moon,
    color: 'gold',
    routes: ['/audit', '/reconciliation'],
  },
  {
    id: 'emma',
    name: 'Emma Park',
    role: 'Property GM',
    description: 'See what the property manager experiences. Daily performance dashboard, live transaction feeds, and commentary from last night—all ready when you arrive.',
    loginRole: 'gm',
    features: [
      'Morning performance dashboard',
      'Live transaction feed',
      'Floor manager commentary visible',
      'Drill-down into any variance',
    ],
    icon: Activity,
    color: 'green',
    routes: ['/gm', '/ops'],
  },
  {
    id: 'finance-ops',
    name: 'Rachel Thompson',
    role: 'Finance Director - Operations',
    description: 'Track patterns across properties. See which sites closed clean, where variances recur, and how the portfolio is performing—without manual consolidation.',
    loginRole: 'finance-ops',
    features: [
      'Cross-property variance patterns',
      'Site-by-site close status',
      'Trend analysis over time',
      'Reconciliation already done',
    ],
    icon: BarChart3,
    color: 'amber',
    routes: ['/finance-ops', '/cross-site'],
  },
  {
    id: 'sarah',
    name: 'Sarah Mitchell',
    role: 'Executive',
    description: 'The portfolio view for leadership. See all 9 UK properties unified, with AI-generated insights and full traceability one click away.',
    loginRole: 'exco',
    features: [
      'Portfolio-wide visibility',
      'AI-generated insight summaries',
      'Full audit trail on demand',
      'Executive alerts and trends',
    ],
    icon: LayoutDashboard,
    color: 'purple',
    routes: ['/portfolio', '/multi-site'],
  },
]

const features = [
  {
    title: 'Remote Revenue Audit',
    description: 'Close the books without leaving home. 10-step automated audit closes all 9 UK properties remotely.',
    href: '/audit',
    icon: Moon,
  },
  {
    title: 'Reconciliation Hub',
    description: '248 automated checkpoints run nightly. Exceptions flagged, resolved, and tracked with full audit trail.',
    href: '/reconciliation',
    icon: ClipboardCheck,
  },
  {
    title: 'Live Data Feed',
    description: 'Real-time event stream from all integrated systems. PMS, POS, Spa, Payments—all visible in one place.',
    href: '/data-feed',
    icon: Wifi,
  },
  {
    title: 'Portfolio Intelligence',
    description: '9 UK properties unified. Revenue, occupancy, and exceptions across the entire portfolio.',
    href: '/portfolio',
    icon: Building2,
  },
  {
    title: 'Daily Ops Report',
    description: 'Food net sales, cinema and gym revenue, comps and voids, staff allowances—auto-generated and distributed.',
    href: '/ops',
    icon: Activity,
  },
  {
    title: 'Oracle AI Assistant',
    description: 'Your 24/7 executive assistant. Surfaces insights, progresses tasks, and tells you what needs attention.',
    href: '/portfolio',
    icon: Sparkles,
  },
]

const businessImpact = [
  {
    metric: '2.4 hours',
    label: 'Saved per night per property',
    description: 'From manual reconciliation to exception-only review',
  },
  {
    metric: '99.2%',
    label: 'Auto-cleared transactions',
    description: 'Only genuine exceptions need human attention',
  },
  {
    metric: '02:41',
    label: 'Average close time',
    description: 'Down from 04:30 under manual process',
  },
  {
    metric: '9 properties',
    label: 'Unified in one platform',
    description: 'Single source of truth for operations and finance',
  },
]

export default function PlatformPage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#CEC0B2]">
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#EBE3DB]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-medium">Experience It</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl text-black mb-4">
              House OS Platform
            </h1>
            <p className="text-xl text-black mb-6">
              See the Vision in Action
            </p>
            <p className="text-black/80 max-w-2xl mx-auto leading-relaxed">
              This is the vision brought to life. Explore the platform through different personas—each 
              representing a real role that interacts with the revenue audit process and benefits from 
              the AI-driven operating model.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Persona Selection */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="uppercase-label text-black/50 mb-2 block">Choose Your Perspective</span>
            <h2 className="font-serif text-2xl md:text-3xl text-black">
              Experience as Different Roles
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {personas.map((persona, i) => {
              const Icon = persona.icon
              const isSelected = selectedPersona === persona.id
              
              return (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  onClick={() => setSelectedPersona(isSelected ? null : persona.id)}
                  className={cn(
                    "bg-white/50 border rounded-xl p-6 cursor-pointer transition-all w-full md:w-[calc(33.333%-1rem)] md:max-w-[320px]",
                    isSelected 
                      ? "border-gold shadow-lg shadow-gold/10" 
                      : "border-black/10 hover:border-gold/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    persona.color === 'gold' && "bg-gold/20 text-gold",
                    persona.color === 'blue' && "bg-blue/20 text-blue",
                    persona.color === 'green' && "bg-green/20 text-green",
                    persona.color === 'amber' && "bg-amber/20 text-amber",
                    persona.color === 'purple' && "bg-[#a78bfa]/20 text-[#a78bfa]"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-black mb-1">{persona.name}</h3>
                  <p className="text-sm text-black/70 mb-3">{persona.role}</p>
                  <p className="text-xs text-black/50 mb-4">{persona.description}</p>
                  
                  <ul className="space-y-1 mb-4">
                    {persona.features.slice(0, 3).map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-black/70">
                        <CheckCircle className="w-3 h-3 text-green" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/login?role=${persona.loginRole}`}>
                    <Button 
                      className={cn(
                        "w-full",
                        isSelected 
                          ? "bg-gold hover:bg-gold/90 text-background" 
                          : "bg-[#DDD5CC] hover:bg-[#D4CBC1] text-black"
                      )}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Enter as {persona.name}
                    </Button>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-6 bg-white/50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="uppercase-label text-black/50 mb-2 block">Platform Features</span>
            <h2 className="font-serif text-2xl md:text-3xl text-black">
              What You&apos;ll See Inside
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                >
                  <Link
                    href={feature.href}
                    className="block bg-white/50 border border-black/10 rounded-xl p-5 h-full hover:border-gold/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-medium text-black mb-1 group-hover:text-gold transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-black/70">{feature.description}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="uppercase-label text-black/50 mb-2 block">Business Impact</span>
            <h2 className="font-serif text-2xl md:text-3xl text-black">
              The Transformation in Numbers
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {businessImpact.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="bg-white/50 border border-black/10 rounded-xl p-5 text-center"
              >
                <p className="text-3xl font-serif text-gold mb-2">{item.metric}</p>
                <p className="text-sm text-black font-medium mb-1">{item.label}</p>
                <p className="text-xs text-black/70">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl text-black mb-4">
              Ready to Transform Your Revenue Audit?
            </h3>
            <p className="text-black/70 mb-6 max-w-lg mx-auto">
              This is the future of hospitality operations. From manual close to intelligent oversight—
              House OS makes it possible.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/login">
                <Button className="bg-gold hover:bg-gold/90 text-background px-8 py-6 text-base">
                  Enter House OS
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/story">
                <Button className="bg-black text-white hover:bg-black/80 px-8 py-6 text-base">
                  Read the Story Again
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
