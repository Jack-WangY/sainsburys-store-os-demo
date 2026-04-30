"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  LayoutDashboard,
  Database,
  Send,
  Zap,
  Eye,
  Shield,
  MessageSquare,
  Users,
  Building2,
  Activity,
  RefreshCw,
  ClipboardList,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Moon,
  FileText,
} from 'lucide-react'

const platformSteps = [
  {
    number: 1,
    title: 'A Dashboard-Led Start',
    subtitle: 'The Night Supervisor',
    description: 'When the night supervisor arrives, everything is already waiting—consolidated, organised, and ready for review.',
    features: [
      'All revenue streams pulled together automatically',
      'Green, amber, and red indicators show status at a glance',
      'Outstanding issues surfaced—no hunting through systems',
    ],
    insight: 'The night supervisor does not go looking for problems—the platform brings them to them.',
    icon: LayoutDashboard,
  },
  {
    number: 2,
    title: 'Always-On Monitoring',
    subtitle: 'The Night Supervisor, with visibility upstream to Floor, Health Club, and Cinema Managers',
    description: 'Data has been flowing throughout the day from Simphony, Opera, Book4Time, and Veezi.',
    features: [
      'Platform monitors integrations continuously',
      'Failures and anomalies are surfaced and actioned in real time',
      'Monitoring is shared across roles, not owned by one person',
    ],
    insight: 'Data flows structurally into the platform throughout the day—no end-of-day handoff.',
    icon: Activity,
  },
  {
    number: 3,
    title: 'Embedded Reconciliation',
    subtitle: 'The Night Supervisor, with downstream visibility for Finance',
    description: 'Reconciliation no longer falls on just the night supervisor—every shift manager has a view and is accountable for their own data.',
    features: [
      'Variances surfaced as they emerge',
      'Transactions already reconciled, commented, and traceable',
      'Finance can trust the numbers—every figure has a clear origin and audit trail',
    ],
    insight: 'For Finance and Controllers, reconciliation is now accurate, traceable, and ready when they need it.',
    icon: RefreshCw,
  },
  {
    number: 4,
    title: 'Intelligent Exception Management',
    subtitle: 'The Night Supervisor',
    description: 'When an issue is identified, the platform does not just flag it—it helps users understand it and identify the root cause.',
    features: [
      'Root causes highlighted and routed via ServiceNow to the resolving party (Finance, IT, Operations)',
      'Suggested resolutions offered',
      'The night supervisor reviews, confirms, or adjusts',
    ],
    insight: 'Issue resolution is no longer manual and retrospective—it can be identified and actioned in real time.',
    icon: Sparkles,
  },
  {
    number: 5,
    title: 'A Guided and Controlled Close',
    subtitle: 'The Night Supervisor',
    description: 'The platform signals readiness for close: critical checks complete, reconciliation within tolerance, exceptions resolved.',
    features: [
      'Consistent and controlled process',
      'The process is now standardised across sites with every house following the same steps',
      'The night supervisor oversees the process rather than manually doing it',
    ],
    insight: 'The night supervisor triggers the close through the platform. The system ensures consistency; the night supervisor provides authorisation.',
    icon: CheckCircle,
  },
  {
    number: 6,
    title: 'Reporting Without the Work',
    subtitle: 'The GM, the Finance Team, the Executives',
    description: 'Reports and insights are available at the touch of a button—no manual compilation, no waiting.',
    features: [
      'Property GM wakes to a live morning view with commentary in place',
      'Finance Team sees cross-property variance patterns at a glance',
      'Executives see a global portfolio summary with AI-generated insight',
    ],
    insight: 'No more waiting for a briefing sheet to land in the inbox.',
    icon: Send,
  },
  {
    number: 7,
    title: 'A Platform for the Whole Business',
    subtitle: 'Everyone',
    description: 'What began as the night supervisor\'s revenue audit is now the shared operating model for how the business closes the day.',
    features: [
      'Floor managers capture commentary as events happen',
      'The night supervisor validates exceptions and authorises the close',
      'Property GM wakes to performance and insights ready',
      'Finance teams can review and monitor cross-site patterns',
      'Executives receive the portfolio summary',
    ],
    insight: 'One source of truth, different views, no handoff gaps.',
    icon: Building2,
  },
]

const roleViews = [
  { 
    id: 'dave',
    role: 'Night Supervisor', 
    shortName: 'Supervisor',
    view: 'Exception-led oversight', 
    color: 'green',
    icon: Shield,
    description: 'Monitor the automated close, handle exceptions that need judgment, validate before posting.',
  },
  { 
    id: 'floor-manager',
    role: 'Outlet Manager', 
    shortName: 'Outlet',
    view: 'Shift reconciliation & actions', 
    color: 'blue',
    icon: ClipboardList,
    description: 'Health, Restaurant, or Cinema - owns shift reconciliation, handles voids/comps in real-time.',
  },
  { 
    id: 'gm',
    role: 'Property GM', 
    shortName: 'GM',
    view: 'Morning dashboard with commentary', 
    color: 'gold',
    icon: LayoutDashboard,
    description: 'Wake to performance metrics and AI-generated commentary already in place.',
  },
  { 
    id: 'ops-lead',
    role: 'Finance Team', 
    shortName: 'Finance',
    view: 'Cross-property variance patterns', 
    color: 'amber',
    icon: BarChart3,
    description: 'Variance patterns across sites surfaced automatically. Weekly rollups now a glance.',
  },
  { 
    id: 'exec',
    role: 'Executive', 
    shortName: 'Exec',
    view: 'Portfolio summary with AI insight', 
    color: 'purple',
    icon: Sparkles,
    description: 'Portfolio summary with traceable audit trail and AI-generated insight.',
  },
]

const comparisonData = [
  { aspect: 'Nature of Work', today: 'Fully manual execution across all steps', tomorrow: 'Exception-led oversight; the night supervisor approves rather than executes' },
  { aspect: 'Reconciliation', today: 'Manual in Excel; logic held by the night supervisor personally', tomorrow: 'Continuous and system-driven; no separate reconciliation step' },
  { aspect: 'Data Handling', today: 'The night supervisor extracts and consolidates data from each system manually', tomorrow: 'Direct system integrations; no manual data movement required' },
  { aspect: 'Issue Identification', today: 'Discrepancies found manually during reconciliation', tomorrow: 'Real-time proactive alerts throughout the day' },
  { aspect: 'Audit Trail', today: 'Lives in the night supervisor\'s memory and an informally maintained spreadsheet', tomorrow: 'Full system-generated audit trail with timestamps and resolution history' },
  { aspect: 'Reporting and Outputs', today: 'Manually built and distributed by the night supervisor', tomorrow: 'Fully automated; reports available in dashboard immediately after close' },
  { aspect: 'Tooling', today: 'Excel; no standardised structure', tomorrow: 'Integrated AI platform with role-based dashboards' },
  { aspect: 'System Integration', today: 'No integration; the night supervisor bridges systems manually', tomorrow: 'Live integrations across Simphony, Opera, Book4Time and Veezi' },
  { aspect: 'Close Process', today: 'The night supervisor closes Opera once satisfied reconciliation is complete', tomorrow: 'Platform signals readiness; the night supervisor triggers close through the dashboard' },
  { aspect: 'Visibility', today: 'Limited; the night supervisor holds the full picture in their head', tomorrow: 'Real-time visibility across all systems, properties and roles' },
  { aspect: 'Scalability', today: 'Does not scale; entirely dependent on individual effort at each property', tomorrow: 'Designed to scale across the full portfolio with minimal incremental effort' },
  { aspect: 'Night Supervisor Experience', today: 'Exhausted; hours of manual effort with residual uncertainty at close', tomorrow: 'Confident; overseeing a system-validated close with full traceability' },
]

export default function BeyondPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [showComparison, setShowComparison] = useState(false)
  const [exceptionStatus, setExceptionStatus] = useState<'pending' | 'it-flagged' | 'approved'>('pending')
  const [closePosted, setClosePosted] = useState(false)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  return (
    <div className="min-h-screen bg-[#CEC0B2]">
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
  <h1 className="font-serif text-4xl md:text-5xl text-black mb-4">
    Tomorrow: The AI-Driven Operating Model
  </h1>
            <p className="text-black/70 max-w-xl leading-relaxed mb-4">
              Today, the entire financial close rests on a single night supervisor. Tomorrow, it becomes a team effort—powered by AI.
            </p>
            <p className="text-black/70 max-w-xl leading-relaxed mb-6">
              Reconciliation, validation, and reporting run continuously in the background. Exceptions surface automatically. 
              Audit trails maintain themselves. Each role—Night Supervisor, Outlet Managers, Property GM, Finance Team, and Executives—gets 
              their own view. One platform, many perspectives, no single point of failure.
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black border border-black">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-white">This is House OS</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scene Setting */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden mb-12"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src="/images/ai-platform-scene.jpg"
                  alt="AI-driven operations center"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* The New Shape of the Night - Horizontal Workflow */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <span className="uppercase-label text-black/50 mb-2 block">The New Shape</span>
              <h2 className="font-serif text-2xl md:text-3xl text-black">
                The New Shape of the Night
              </h2>
            </div>

            {/* Horizontal Step Indicators - Dots */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {platformSteps.map((step, idx) => {
                const isActive = activeStep === idx
                return (
                  <button
                    key={step.number}
                    onClick={() => setActiveStep(idx)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  isActive
                    ? "bg-black text-white scale-110"
                    : "bg-[#EBE3DB] text-black/70 hover:bg-[#DDD5CC]"
                )}
                  >
                    {step.number}
                  </button>
                )
              })}
            </div>

            {/* Active Step Detail */}
            <div className="bg-white/50 border border-gold/30 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const Icon = platformSteps[activeStep].icon
                    return <Icon className="w-6 h-6 text-gold" />
                  })()}
                </div>
                <div className="flex-1">
                  <span className="text-xs text-black uppercase font-medium">Step {platformSteps[activeStep].number}</span>
                  <h3 className="text-lg font-medium text-black">{platformSteps[activeStep].title}</h3>
                </div>
              </div>
              
              <p className="text-black/70 mb-4 leading-relaxed">{platformSteps[activeStep].description}</p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {platformSteps[activeStep].features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-[#EBE3DB] rounded-lg sm:w-[calc(33.333%-0.5rem)] w-full">
                    <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-black/70">{f}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
                <p className="text-sm text-black italic">&ldquo;{platformSteps[activeStep].insight}&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Role-Based Views with Tabs */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <span className="uppercase-label text-black/50 mb-2 block">Platform for Everyone</span>
              <h2 className="font-serif text-2xl md:text-3xl text-black mb-2">
                Different Roles, Different Views
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto">
                One platform, many perspectives. Each role sees exactly what they need—no more chasing reports, 
                no more waiting for data to land.
              </p>
            </div>

            <Tabs defaultValue="dave" className="w-full">
              <TabsList className="w-full flex-wrap h-auto gap-1 bg-[#EBE3DB] p-1.5 rounded-xl mb-6">
                {roleViews.map((item) => {
                  const Icon = item.icon
                  return (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className={cn(
                        "flex-1 min-w-[100px] py-2.5 px-3 rounded-lg gap-2 text-black/70 transition-all",
                        "data-[state=active]:bg-white/50 data-[state=active]:shadow-sm",
                        item.color === 'blue' && "data-[state=active]:text-blue",
                        item.color === 'gold' && "data-[state=active]:text-gold",
                        item.color === 'green' && "data-[state=active]:text-green",
                        item.color === 'amber' && "data-[state=active]:text-amber",
                        item.color === 'purple' && "data-[state=active]:text-[#a78bfa]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.shortName}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {/* Night Supervisor View */}
              <TabsContent value="dave">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-black/10 bg-green/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green/20 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-green" />
                        </div>
                        <div>
                          <h3 className="font-medium text-black">Night Supervisor</h3>
                          <p className="text-sm text-black/70">Exception-led oversight, not manual execution</p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-green bg-green/10 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        System Validated
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Narrative callout */}
                    <div className="mb-6 p-4 bg-green/5 rounded-xl border border-green/10">
                      <p className="text-sm text-black leading-relaxed">
                        <span className="font-medium">The Night Supervisor no longer executes the close—they oversee it.</span> Reconciliation 
                        runs continuously throughout the day. When they arrive, the system has already validated transactions, 
                        flagged exceptions, and prepared journals. Their role is now <span className="font-medium">quality assurance</span>: 
                        reviewing what needs human judgment, approving the close, and ensuring traceability.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">Close Status</h4>
                        <div className="space-y-3 bg-[#EBE3DB] rounded-xl p-4">
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green" />
                              <span className="text-sm text-black">Rate Check</span>
                            </div>
                            <span className="text-xs text-green font-medium">Completed</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green" />
                              <span className="text-sm text-black">Guest Check-ins / Check-outs</span>
                            </div>
                            <span className="text-xs text-green font-medium">Completed</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green" />
                              <span className="text-sm text-black">Simphony Reconciliation</span>
                            </div>
                            <span className="text-xs text-green font-medium">Validated</span>
                          </div>
                          <div className={`flex items-center justify-between p-3 bg-white/50 rounded-lg border ${exceptionStatus === 'approved' ? 'border-green/30' : 'border-amber/50'}`}>
                            <div className="flex items-center gap-3">
                              {exceptionStatus === 'approved' ? (
                                <CheckCircle className="w-5 h-5 text-green" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber" />
                              )}
                              <span className="text-sm text-black">Book4Time Reconciliation</span>
                            </div>
                            <span className={`text-xs font-medium ${exceptionStatus === 'approved' ? 'text-green' : 'text-amber'}`}>
                              {exceptionStatus === 'approved' ? 'Validated' : '1 Exception'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green" />
                              <span className="text-sm text-black">Veezi Reconciliation</span>
                            </div>
                            <span className="text-xs text-green font-medium">Validated</span>
                          </div>
                          <div className={`flex items-center justify-between p-3 bg-white/50 rounded-lg border ${exceptionStatus === 'approved' ? 'border-green/30' : 'border-amber/50'}`}>
                            <div className="flex items-center gap-3">
                              {exceptionStatus === 'approved' ? (
                                <CheckCircle className="w-5 h-5 text-green" />
                              ) : (
                                <Clock className="w-5 h-5 text-amber" />
                              )}
                              <span className="text-sm text-black">Adjustments Posted to Opera</span>
                            </div>
                            <span className={`text-xs font-medium ${exceptionStatus === 'approved' ? 'text-green' : 'text-amber'}`}>
                              {exceptionStatus === 'approved' ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">
                          {exceptionStatus === 'pending' ? 'Exception Requiring Review' : 
                           exceptionStatus === 'it-flagged' ? 'Exception Flagged for IT' : 
                           'Exception Resolved'}
                        </h4>
                        
                        {exceptionStatus === 'pending' && (
                          <div className="bg-amber/5 rounded-xl p-4 border border-amber/20 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-black">Book4Time Variance</span>
                              <span className="text-xs text-amber bg-amber/10 px-2 py-0.5 rounded">£47.00</span>
                            </div>
                            <p className="text-xs text-black/70 mb-3">
                              Book4Time shows £4,247 settled. Opera reports £4,200 posted.
                            </p>
                            {/* IT Lens - Root Cause */}
                            <div className="bg-blue/10 border border-blue/20 rounded-lg p-2.5 mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Database className="w-3.5 h-3.5 text-blue" />
                                <span className="text-xs font-medium text-blue">Root Cause: Transaction Code Mismatch</span>
                              </div>
                              <p className="text-xs text-black/70 pl-5">
                                Transaction code mapping between Book4Time and Opera needs review.
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              className="text-xs w-full bg-blue hover:bg-blue/90 text-white"
                              onClick={() => setExceptionStatus('it-flagged')}
                            >
                              Mark as IT Issue
                            </Button>
                          </div>
                        )}
                        
                        {exceptionStatus === 'it-flagged' && (
                          <div className="bg-blue/5 rounded-xl p-4 border border-blue/20 mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-blue" />
                                <span className="text-sm font-medium text-black">Book4Time Variance</span>
                              </div>
                              <span className="text-xs text-blue bg-blue/10 px-2 py-0.5 rounded">Routed to IT</span>
                            </div>
                            
                            {/* ServiceNow Confirmation */}
                            <div className="bg-white/50 rounded-lg p-3 border border-blue/20 mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-green" />
                                <span className="text-xs font-medium text-green">ServiceNow Ticket Created</span>
                              </div>
                              <div className="pl-6 space-y-1">
                                <p className="text-xs text-black/70">Ticket: <span className="font-mono text-black">#INC0012345</span></p>
                                <p className="text-xs text-black/70">Assigned to: <span className="text-black">IT Operations</span></p>
                                <p className="text-xs text-black/70">Root Cause: <span className="text-black">Transaction Code Mismatch</span></p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => setExceptionStatus('pending')}
                              >
                                Undo
                              </Button>
                              <Button 
                                size="sm" 
                                className="text-xs flex-1 bg-green hover:bg-green/90 text-white"
                                onClick={() => setExceptionStatus('approved')}
                              >
                                Approve & Close
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {exceptionStatus === 'approved' && (
                          <div className="bg-green/5 rounded-xl p-4 border border-green/20 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green" />
                                <span className="text-sm font-medium text-black">Book4Time Variance</span>
                              </div>
                              <span className="text-xs text-green bg-green/10 px-2 py-0.5 rounded">Approved</span>
                            </div>
                            <p className="text-xs text-black/70 mb-3">
                              Variance acknowledged and approved by Night Supervisor. Close can proceed.
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => setExceptionStatus('pending')}
                            >
                              Undo
                            </Button>
                          </div>
                        )}
                        
                        <div className={cn(
                          "p-3 rounded-lg border",
                          closePosted 
                            ? "bg-gold/10 border-gold/30"
                            : exceptionStatus === 'pending' 
                            ? "bg-amber/5 border-amber/20" 
                            : "bg-green/5 border-green/20"
                        )}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Activity className={cn(
                                "w-4 h-4", 
                                closePosted ? "text-gold" : exceptionStatus === 'pending' ? "text-amber" : "text-green"
                              )} />
                              <span className="text-sm font-medium text-black">
                                {closePosted ? 'Posted to Oracle' : exceptionStatus === 'pending' ? 'Pending Review' : 'Ready for Close'}
                              </span>
                            </div>
                            {exceptionStatus !== 'pending' && !closePosted && (
                              <Button 
                                size="sm" 
                                className="bg-gold hover:bg-gold/90 text-white text-xs"
                                onClick={() => setClosePosted(true)}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Authorise Close
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-black/70">
                            {closePosted
                              ? 'Close authorised and posted to Oracle Fusion.'
                              : exceptionStatus === 'pending' 
                              ? '2 of 3 systems validated. 1 exception requires action.'
                              : exceptionStatus === 'it-flagged'
                              ? '3 of 3 systems validated. IT issue tracked separately.'
                              : '3 of 3 systems validated. All exceptions resolved.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Outlet Manager View */}
              <TabsContent value="floor-manager">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-black/10 bg-blue/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue/20 flex items-center justify-center">
                          <ClipboardList className="w-5 h-5 text-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium text-black">Outlet Manager</h3>
                          <p className="text-sm text-black/70">Health, Restaurant, or Cinema - owns their shift</p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-blue bg-blue/10 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                        My Shift
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Narrative callout */}
                    <div className="mb-6 p-4 bg-blue/5 rounded-xl border border-blue/10">
                      <p className="text-sm text-black leading-relaxed">
                        <span className="font-medium">Outlet Managers own their shift reconciliation in real-time.</span> Whether 
                        Health Club, Restaurant, or Cinema—they handle voids, comps, and adjustments as they happen, adding context 
                        that systems cannot capture. <span className="font-medium">Issues are resolved by the person closest to the event</span>, 
                        not left for the Night Supervisor at end of day.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">My Shift Reconciliation</h4>
                        <div className="space-y-3 bg-[#EBE3DB] rounded-xl p-4">
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-green" />
                              <div>
                                <span className="text-sm text-black">Simphony - Restaurant</span>
                                <span className="text-xs text-black/50 block">Shift: 11:00 - 19:00</span>
                              </div>
                            </div>
                            <span className="text-xs text-green">Balanced</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-amber/30">
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="w-4 h-4 text-amber" />
                              <div>
                                <span className="text-sm text-black">Voids & Comps</span>
                                <span className="text-xs text-black/50 block">2 items need notes</span>
                              </div>
                            </div>
                            <span className="text-xs text-amber">Action</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-green" />
                              <div>
                                <span className="text-sm text-black">Shift Summary</span>
                                <span className="text-xs text-black/50 block">Shift notes added</span>
                              </div>
                            </div>
                            <span className="text-xs text-green">Done</span>
                          </div>
                        </div>
                        <p className="text-xs text-black/70 mt-3 text-center">Resolve issues now — not at end of day</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">Actions Taken This Shift</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-[#EBE3DB] rounded-lg border border-black/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-amber font-medium">Void Added - £340</span>
                              <span className="text-xs text-black/50">14:32</span>
                            </div>
                            <div className="bg-white/50 rounded p-2 border border-black/10">
                              <p className="text-xs text-black/70 italic">&ldquo;Kitchen error on Table 14. Wrong dish sent. Remade and comped per GM approval.&rdquo;</p>
                              <p className="text-xs text-black/50 mt-1">— Marcus T., Restaurant Manager</p>
                            </div>
                          </div>
                          <div className="p-3 bg-[#EBE3DB] rounded-lg border border-black/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-blue font-medium">Comp Added - £85</span>
                              <span className="text-xs text-black/50">16:45</span>
                            </div>
                            <div className="bg-white/50 rounded p-2 border border-black/10">
                              <p className="text-xs text-black/70 italic">&ldquo;Member complaint - delayed service due to staff shortage. 50% comp approved.&rdquo;</p>
                              <p className="text-xs text-black/50 mt-1">— Marcus T., Restaurant Manager</p>
                            </div>
                          </div>
                          <div className="p-3 bg-[#EBE3DB] rounded-lg border border-black/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-blue font-medium">Shift Summary</span>
                              <span className="text-xs text-black/50">21:30</span>
                            </div>
                            <div className="bg-white/50 rounded p-2 border border-black/10">
                              <p className="text-xs text-black/70 italic">&ldquo;Friday rush hit hard — fully booked from 7pm. Kitchen coped well, slight delays on mains around 8:30. Celebrity member in tonight with party of 6, comped desserts per GM. Great feedback overall.&rdquo;</p>
                              <p className="text-xs text-black/50 mt-1">— Marcus T., Restaurant Manager</p>
                            </div>
                          </div>
                          <div className="p-3 bg-green/5 rounded-lg border border-green/20">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green" />
                              <span className="text-xs text-green">All actions documented — handover ready for Night Supervisor</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* GM View */}
              <TabsContent value="gm">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-black/10 bg-gold/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                          <LayoutDashboard className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <h3 className="font-medium text-black">Property GM</h3>
                          <p className="text-sm text-black/70">Morning dashboard, ready at wake</p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-medium">
                        <Clock className="w-3 h-3" />
                        06:00 AM
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Narrative callout */}
                    <div className="mb-6 p-4 bg-gold/5 rounded-xl border border-gold/10">
                      <p className="text-sm text-black leading-relaxed">
                        <span className="font-medium">The Property GM wakes to a live morning view</span>—last night&apos;s 
                        performance, the exceptions raised, the commentary already in place. No more waiting for a 
                        briefing sheet to land in the inbox.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-[#EBE3DB] rounded-xl">
                        <p className="text-xs text-black/50 uppercase mb-1">Last Night&apos;s Revenue</p>
                        <p className="text-2xl font-serif text-black tabular-nums">£68,420</p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="w-3 h-3 text-green" />
                          <span className="text-xs text-green">+8.2% vs LW</span>
                        </div>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl">
                        <p className="text-xs text-black/50 uppercase mb-1">Occupancy</p>
                        <p className="text-2xl font-serif text-black tabular-nums">94%</p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="w-3 h-3 text-green" />
                          <span className="text-xs text-green">+3pts vs LW</span>
                        </div>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl">
                        <p className="text-xs text-black/50 uppercase mb-1">Exceptions Raised</p>
                        <p className="text-2xl font-serif text-black tabular-nums">2</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="w-3 h-3 text-green" />
                          <span className="text-xs text-green">Both resolved</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gold/5 rounded-xl p-4 border border-gold/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-4 h-4 text-gold" />
                        <span className="text-sm font-medium text-black">AI Morning Brief</span>
                        <span className="text-xs text-black/50">• Auto-generated at 06:00</span>
                      </div>
                      <p className="text-sm text-black/70 leading-relaxed mb-4">
                        Strong performance last night with F&B driving 12% above forecast. Two minor variances 
                        were auto-resolved overnight—one timing difference on a late card batch, one rounding 
                        adjustment. Member spend per head increased by £8 compared to last Tuesday. Cinema had 
                        lower footfall but higher per-ticket revenue. Recommend reviewing spa utilization—consistently 
                        below target this week.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-white/50 text-black/70 px-2 py-1 rounded-full">F&B +12%</span>
                        <span className="text-xs bg-white/50 text-black/70 px-2 py-1 rounded-full">Spa -8%</span>
                        <span className="text-xs bg-white/50 text-black/70 px-2 py-1 rounded-full">Cinema steady</span>
                        <span className="text-xs bg-green/10 text-green px-2 py-1 rounded-full">2/2 exceptions resolved</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Ops Lead View */}
              <TabsContent value="ops-lead">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-black/10 bg-amber/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber/20 flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-amber" />
                        </div>
                        <div>
                          <h3 className="font-medium text-black">Finance Team</h3>
                          <p className="text-sm text-black/70">Cross-property variance patterns</p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber bg-amber/10 px-2 py-1 rounded-full">
                        <Building2 className="w-3 h-3" />
                        9 Sites
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Narrative callout */}
                    <div className="mb-6 p-4 bg-amber/5 rounded-xl border border-amber/10">
                      <p className="text-sm text-black leading-relaxed">
                        <span className="font-medium">The Finance Team opens a cross-property view.</span> Variance 
                        patterns across sites are surfaced automatically. Comparisons that used to take a weekly rollup 
                        to produce are now a glance.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">Variance Patterns This Week</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-[#EBE3DB] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-black">Bar POS vs Settlements</span>
                              <span className="text-xs text-amber font-medium">3 sites</span>
                            </div>
                            <p className="text-xs text-black/70 mb-2">
                              Recurring timing gap between POS close and Adyen settlement batch. Avg £340 overnight float.
                            </p>
                            <div className="text-xs text-black/50">
                              Affected: Farmhouse, White City, Shoreditch
                            </div>
                          </div>
                          <div className="p-3 bg-[#EBE3DB] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-black">Comp Authorization Gaps</span>
                              <span className="text-xs text-amber font-medium">2 sites</span>
                            </div>
                            <p className="text-xs text-black/70 mb-2">
                              Comps recorded in Simphony without matching manager approval code. Process gap identified.
                            </p>
                            <div className="text-xs text-black/50">
                              Affected: 180 House, Dean Street
                            </div>
                          </div>
                          <div className="p-3 bg-[#EBE3DB] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-black">Spa Revenue Timing</span>
                              <span className="text-xs text-green font-medium">Resolved</span>
                            </div>
                            <p className="text-xs text-black/70 mb-2">
                              Book4Time settlement delay causing end-of-day mismatch. Fixed via API polling adjustment.
                            </p>
                            <div className="text-xs text-black/50">
                              All sites now syncing within 15 mins
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">Site Comparison - Variance Rate</h4>
                        <div className="space-y-2">
                          {[
                            { site: 'Soho Farmhouse', rate: '0.4%', trend: 'down', note: 'Improved from 1.2%' },
                            { site: '180 House', rate: '0.9%', trend: 'up', note: 'Comp process issue' },
                            { site: 'White City', rate: '0.6%', trend: 'down', note: 'Stable' },
                            { site: 'Shoreditch', rate: '1.1%', trend: 'up', note: 'Bar timing gap' },
                          ].map((item) => (
                            <div key={item.site} className="flex items-center justify-between p-3 bg-[#EBE3DB] rounded-lg">
                              <div>
                                <span className="text-sm text-black">{item.site}</span>
                                <p className="text-xs text-black/50">{item.note}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-xs tabular-nums font-medium",
                                  item.trend === 'down' ? "text-green" : "text-amber"
                                )}>
                                  {item.rate}
                                </span>
                                {item.trend === 'down' ? (
                                  <ArrowDownRight className="w-3 h-3 text-green" />
                                ) : (
                                  <ArrowUpRight className="w-3 h-3 text-amber" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-black/70 mt-3 text-center">Lower is better. Target: &lt;1%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Exec View */}
              <TabsContent value="exec">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-black/10 bg-[#a78bfa]/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#a78bfa]/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-[#a78bfa]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-black">Executive</h3>
                          <p className="text-sm text-black/70">Portfolio summary with AI insight</p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#a78bfa] bg-[#a78bfa]/10 px-2 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        AI Insight
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Narrative callout */}
                    <div className="mb-6 p-4 bg-[#a78bfa]/5 rounded-xl border border-[#a78bfa]/10">
                      <p className="text-sm text-black leading-relaxed">
                        <span className="font-medium">The Executive sees the portfolio summary</span>—standing on a 
                        traceable audit trail they can drill into at any point. Every number is supplemented by 
                        AI-generated insight on patterns the system has observed across properties and across time.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-[#EBE3DB] rounded-xl text-center">
                        <p className="text-xs text-black/50 uppercase mb-1">Portfolio Revenue</p>
                        <p className="text-2xl font-serif text-black tabular-nums">£342K</p>
                        <span className="text-xs text-green">+6% vs forecast</span>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl text-center">
                        <p className="text-xs text-black/50 uppercase mb-1">Avg Occupancy</p>
                        <p className="text-2xl font-serif text-black tabular-nums">91%</p>
                        <span className="text-xs text-green">+2pts vs LY</span>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl text-center">
                        <p className="text-xs text-black/50 uppercase mb-1">Sites Closed</p>
                        <p className="text-2xl font-serif text-black tabular-nums">9/9</p>
                        <span className="text-xs text-green">All validated</span>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl text-center">
                        <p className="text-xs text-black/50 uppercase mb-1">Exception Rate</p>
                        <p className="text-2xl font-serif text-black tabular-nums">0.8%</p>
                        <span className="text-xs text-black/70">Industry: 3.2%</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#a78bfa]/5 rounded-xl p-4 mb-4 border border-[#a78bfa]/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-4 h-4 text-[#a78bfa]" />
                        <span className="text-sm font-medium text-black">AI Executive Summary</span>
                        <span className="text-xs text-black/50">• Patterns across 9 properties, 12 months</span>
                      </div>
                      <p className="text-sm text-black/70 leading-relaxed mb-4">
                        Portfolio performing 6% above weekly forecast. Soho Farmhouse and 180 House driving 
                        outperformance with strong weekend event revenue. White City shows improving trend 
                        after operational adjustments—variance rate down 40% since process change. Recommend 
                        capital review for Shoreditch spa expansion based on 3-month utilization data showing 
                        sustained demand above capacity.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-black/50">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>Generated 06:00</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3 h-3 text-[#a78bfa]" />
                          <span>Full audit trail available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* At the End of the Shift - Broader Business Value */}
          <div className="mb-12">
            <div className="bg-[#EBE3DB] border border-black/10 rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="uppercase-label text-black/50 mb-2 block">At the End of the Shift</span>
                <h2 className="font-serif text-2xl md:text-3xl text-black">
                  The Business Has Moved as One
                </h2>
              </div>

              {/* Key Message */}
              <p className="text-black/70 text-center max-w-2xl mx-auto mb-8 leading-relaxed">
                The close is done—but more than that, every role has benefited from a more integrated process. 
                One source of truth, different views, no handoff gaps.
              </p>

              {/* 5 Roles - Simple Row */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-green/30">
                  <Shield className="w-4 h-4 text-green" />
                  <span className="text-sm text-black">Night Supervisor</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-blue/30">
                  <ClipboardList className="w-4 h-4 text-blue" />
                  <span className="text-sm text-black">Outlet Manager</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-gold/30">
                  <LayoutDashboard className="w-4 h-4 text-gold" />
                  <span className="text-sm text-black">Property GM</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-amber/30">
                  <BarChart3 className="w-4 h-4 text-amber" />
                  <span className="text-sm text-black">Finance Team</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-gold/30">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm text-black">Executive</span>
                </div>
              </div>

              {/* Closing Statement */}
              <div className="bg-white/50 border border-black/10 rounded-xl p-6 max-w-2xl mx-auto text-center">
                <p className="text-lg text-black font-serif leading-relaxed">
                  &ldquo;The revenue audit is no longer the property of one person. It is the shared 
                  operating model of the Soho House close.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Role Transformation - Three States */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <span className="uppercase-label text-black/50 mb-2 block">The Transformation</span>
              <h2 className="font-serif text-2xl text-black">
                How Each Role Evolves
              </h2>
            </div>

            <div className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="text-left p-4 uppercase-label text-black/50 min-w-[180px]">Role</th>
                      <th className="text-left p-4 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red" />
                          <span className="uppercase-label text-red">Today</span>
                        </div>
                      </th>
                      <th className="text-left p-4 min-w-[220px] bg-green/30">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green" />
                          <span className="uppercase-label text-green">Tomorrow</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black/10/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center flex-shrink-0">
                            <ClipboardList className="w-4 h-4 text-blue" />
                          </div>
                          <span className="text-sm font-medium text-black">Outlet Managers</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Are not responsible for errors during their shift; commentary captured informally</td>
                      <td className="p-4 text-sm text-black bg-green/30">Structured inputs captured throughout the day; commentary visible live</td>
                    </tr>
                    <tr className="border-b border-black/10/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                            <LayoutDashboard className="w-4 h-4 text-gold" />
                          </div>
                          <span className="text-sm font-medium text-black">Property GM</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Waits for the night supervisor&apos;s morning briefing; sees only the lagging view</td>
                      <td className="p-4 text-sm text-black bg-green/30">Opens a live property dashboard; sees performance and exceptions as they emerge</td>
                    </tr>
                    <tr className="border-b border-black/10/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-green" />
                          </div>
                          <span className="text-sm font-medium text-black">Night Supervisor</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Manual execution across all steps; hours of reconciliation work</td>
                      <td className="p-4 text-sm text-black bg-green/30">Exception-led oversight; approves rather than executes the close</td>
                    </tr>
                    <tr className="border-b border-black/10/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-4 h-4 text-amber" />
                          </div>
                          <span className="text-sm font-medium text-black">Finance Team</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Waits for monthly house reconciliation; comparing properties is manual</td>
                      <td className="p-4 text-sm text-black bg-green/30">Real-time cross-property view; variance patterns surface automatically</td>
                    </tr>
                    <tr>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#a78bfa]/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                          </div>
                          <span className="text-sm font-medium text-black">Executives</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Sees summary numbers; the working is invisible</td>
                      <td className="p-4 text-sm text-black bg-green/30">Portfolio dashboard with AI-generated insight; full traceability on demand</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Today vs Tomorrow Comparison */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="uppercase-label text-black/50 mb-2 block">The Full Picture</span>
                <h2 className="font-serif text-2xl text-black">
                  Today vs Tomorrow
                </h2>
              </div>
              <Button
                onClick={() => setShowComparison(!showComparison)}
                className="bg-black text-white hover:bg-black/80 px-6"
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </Button>
            </div>

            {/* Parallel Timeline Comparison */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Today Timeline - Pain Points */}
              <div className="bg-red/5 border border-red/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red" />
                    <span className="text-xs uppercase text-red font-medium">Today</span>
                  </div>
                  <span className="text-xs text-red font-medium">~3 hours manual effort</span>
                </div>
                
                {/* Timeline Visual */}
                <div className="relative">
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-red/30 rounded-full" />
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red/10 border border-red/30 flex items-center justify-center z-10">
                        <Users className="w-3.5 h-3.5 text-red" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red/10 border border-red/30 flex items-center justify-center z-10">
                        <Database className="w-3.5 h-3.5 text-red" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red/10 border border-red/30 flex items-center justify-center z-10">
                        <RefreshCw className="w-3.5 h-3.5 text-red" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red/10 border border-red/30 flex items-center justify-center z-10">
                        <Moon className="w-3.5 h-3.5 text-red" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red/10 border border-red/30 flex items-center justify-center z-10">
                        <FileText className="w-3.5 h-3.5 text-red" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-red mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-black/60">Manual reconciliation across 4 systems</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-red mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-black/60">Single operator dependency</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-red mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-black/60">No audit trail</span>
                  </div>
                </div>
              </div>

              {/* Tomorrow Timeline - Streamlined */}
              <div className="bg-green/5 border border-green/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green" />
                    <span className="text-xs uppercase text-green font-medium">Tomorrow</span>
                  </div>
                  <span className="text-xs text-green font-medium">Continuous throughout the day</span>
                </div>
                
                {/* Timeline Visual */}
                <div className="relative">
                  <div className="absolute top-4 left-10 right-10 h-0.5 bg-green/30 rounded-full" />
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green/20 border-2 border-green flex items-center justify-center z-10">
                        <RefreshCw className="w-3.5 h-3.5 text-green" />
                      </div>
                      <span className="text-[10px] text-green font-medium mt-1">Auto-sync</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green/20 border-2 border-green flex items-center justify-center z-10">
                        <CheckCircle className="w-3.5 h-3.5 text-green" />
                      </div>
                      <span className="text-[10px] text-green font-medium mt-1">Validated</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green/20 border-2 border-green flex items-center justify-center z-10">
                        <Send className="w-3.5 h-3.5 text-green" />
                      </div>
                      <span className="text-[10px] text-green font-medium mt-1">Posted</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-black/60">Work happens throughout the day</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-black/60">Night close becomes a simple approval</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-black/60">Full audit trail</span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-black/10">
                          <th className="text-left p-4 uppercase-label text-black/50 min-w-[150px]">Aspect</th>
                          <th className="text-left p-4 min-w-[280px]">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red" />
                              <span className="uppercase-label text-red">Today</span>
                            </div>
                          </th>
                          <th className="text-left p-4 min-w-[280px] bg-green/10">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green" />
                              <span className="uppercase-label text-green">Tomorrow</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((row) => (
                          <tr key={row.aspect} className="border-b border-black/10/50">
                            <td className="p-4 text-sm text-black font-medium">{row.aspect}</td>
                            <td className="p-4 text-sm text-black/70">{row.today}</td>
                            <td className="p-4 text-sm text-black bg-green/10">{row.tomorrow}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA to Platform */}
          <div className="text-center">
            <p className="text-black/70 mb-6">
              Ready to see this vision in action?
            </p>
            <Link href="/story/platform">
              <Button className="bg-gold hover:bg-gold/90 text-white px-8 py-6 text-base">
                Experience House OS
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
