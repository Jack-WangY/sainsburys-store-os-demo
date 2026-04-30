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
  Banknote,
  FileText,
} from 'lucide-react'

const platformSteps = [
  {
    number: 1,
    title: 'A Dashboard-Led Start',
    subtitle: 'The Daily Audit Lead',
    description: 'When Priya arrives, everything is already waiting—store cash totals consolidated, supplier invoices matched, exceptions queued for review.',
    features: [
      'All revenue and cost streams pulled together automatically',
      'Green, amber, and red indicators show status at a glance',
      'Outstanding issues surfaced—no hunting through SAP and spreadsheets',
    ],
    insight: 'The audit lead does not go looking for problems—the platform brings them to her.',
    icon: LayoutDashboard,
  },
  {
    number: 2,
    title: 'Always-On Monitoring',
    subtitle: 'The Audit Lead, with visibility upstream to Store, DC, and Category teams',
    description: 'Data has been flowing throughout the day from POS, SAP, Manhattan WMS, and supplier portals.',
    features: [
      'Platform monitors integrations continuously',
      'Failures and anomalies are surfaced and actioned in real time',
      'Monitoring is shared across roles, not owned by one team',
    ],
    insight: 'Data flows structurally into the platform throughout the day—no period-end handoff.',
    icon: Activity,
  },
  {
    number: 3,
    title: 'Embedded Reconciliation',
    subtitle: 'The Audit Lead, with downstream visibility for Finance and Supply Chain',
    description: 'Reconciliation no longer falls on just the audit team—every store manager has a view and is accountable for their own cash and stock.',
    features: [
      'Variances surfaced as they emerge',
      'Invoices already 3-way matched, commented, and traceable',
      'Finance can trust the numbers—every figure has a clear origin and audit trail',
    ],
    insight: 'For Finance and Supply Chain Controllers, reconciliation is now accurate, traceable, and ready when they need it.',
    icon: RefreshCw,
  },
  {
    number: 4,
    title: 'Intelligent Exception Management',
    subtitle: 'The Audit Lead',
    description: 'When an issue is identified, the platform does not just flag it—it helps the team understand it and identify the root cause.',
    features: [
      'Root causes highlighted and routed via ServiceNow to the resolving party (Finance, IT, Supply Chain)',
      'Suggested resolutions offered',
      'The audit lead reviews, confirms, or adjusts',
    ],
    insight: 'Issue resolution is no longer manual and retrospective—it can be identified and actioned in real time.',
    icon: Sparkles,
  },
  {
    number: 5,
    title: 'A Guided and Controlled Close',
    subtitle: 'The Audit Lead',
    description: 'The platform signals readiness for close: critical checks complete, reconciliation within tolerance, exceptions resolved.',
    features: [
      'Consistent and controlled process',
      'The process is now standardised across stores with every site following the same steps',
      'The audit lead oversees the process rather than manually doing it',
    ],
    insight: 'The audit lead triggers the close through the platform. The system ensures consistency; the human provides authorisation.',
    icon: CheckCircle,
  },
  {
    number: 6,
    title: 'Reporting Without the Work',
    subtitle: 'The Supply Chain Controller, the Finance Team, the CFO',
    description: 'Reports and insights are available at the touch of a button—no manual compilation, no waiting.',
    features: [
      'Supply Chain Controller wakes to a live morning view with commentary in place',
      'Finance Team sees cross-store variance patterns at a glance',
      'CFO sees a network summary with AI-generated insight',
    ],
    insight: 'No more waiting for a board pack to land in the inbox.',
    icon: Send,
  },
  {
    number: 7,
    title: 'A Platform for the Whole Business',
    subtitle: 'Everyone',
    description: 'What began as the audit team\'s period-close workflow is now the shared operating model for how Sainsbury\'s closes the books.',
    features: [
      'Store managers capture commentary as events happen',
      'The audit lead validates exceptions and authorises the close',
      'Supply Chain Controller wakes to performance and shrink trends ready',
      'Finance teams can review and monitor cross-store patterns',
      'The CFO receives the network summary',
    ],
    insight: 'One source of truth, different views, no handoff gaps.',
    icon: Building2,
  },
]

const roleViews = [
  {
    id: 'priya',
    role: 'Daily Audit Lead',
    shortName: 'Audit',
    view: 'Exception-led oversight',
    color: 'green',
    icon: Shield,
    description: 'Monitor the continuous close, handle exceptions that need judgment, validate before posting to SAP.',
  },
  {
    id: 'store-manager',
    role: 'Store Manager',
    shortName: 'Store',
    view: 'Cash, shrink & shift actions',
    color: 'blue',
    icon: ClipboardList,
    description: 'Cash office, fresh produce, or general merchandise — owns daily reconciliation, handles wastage and shrink in real-time.',
  },
  {
    id: 'supply-chain',
    role: 'Supply Chain Controller',
    shortName: 'Supply',
    view: 'Morning dashboard with commentary',
    color: 'gold',
    icon: LayoutDashboard,
    description: 'Wake to DC-to-store performance and AI-generated commentary already in place.',
  },
  {
    id: 'ops-lead',
    role: 'Finance Team',
    shortName: 'Finance',
    view: 'Cross-store variance patterns',
    color: 'amber',
    icon: BarChart3,
    description: 'Variance patterns across stores surfaced automatically. Period-end rollups now a glance.',
  },
  {
    id: 'cfo',
    role: 'CFO',
    shortName: 'CFO',
    view: 'Network summary with AI insight',
    color: 'purple',
    icon: Sparkles,
    description: 'Network summary with traceable audit trail and AI-generated insight from Argos.',
  },
]

const comparisonData = [
  { aspect: 'Nature of Work', today: 'Fully manual execution across all steps', tomorrow: 'Exception-led oversight; the audit team approves rather than executes' },
  { aspect: 'Reconciliation', today: 'Manual in Excel; logic held by individual analysts', tomorrow: 'Continuous and system-driven; no separate period-end reconciliation step' },
  { aspect: 'Data Handling', today: 'The audit team extracts and consolidates data from each system manually', tomorrow: 'Direct system integrations; no manual data movement required' },
  { aspect: 'Issue Identification', today: 'Discrepancies found manually during reconciliation', tomorrow: 'Real-time proactive alerts throughout the day' },
  { aspect: 'Audit Trail', today: 'Lives in shared inboxes and informally maintained spreadsheets', tomorrow: 'Full system-generated audit trail with timestamps and resolution history' },
  { aspect: 'Reporting and Outputs', today: 'Manually built and distributed by the finance team', tomorrow: 'Fully automated; CFO pack available in dashboard immediately after close' },
  { aspect: 'Tooling', today: 'Excel; no standardised structure', tomorrow: 'Integrated AI platform with role-based dashboards' },
  { aspect: 'System Integration', today: 'No integration; the audit team bridges systems manually', tomorrow: 'Live integrations across POS, SAP, Manhattan WMS and supplier portals' },
  { aspect: 'Close Process', today: '11 working days to close a period; finance works late', tomorrow: 'Always-ready close; the audit lead authorises through the dashboard' },
  { aspect: 'Visibility', today: 'Limited; the audit team holds the full picture across spreadsheets', tomorrow: 'Real-time visibility across all systems, stores and roles' },
  { aspect: 'Scalability', today: 'Does not scale; entirely dependent on individual effort at each store', tomorrow: 'Designed to scale across 600+ stores with minimal incremental effort' },
  { aspect: 'Audit Team Experience', today: 'Exhausted; days of manual effort with residual uncertainty at close', tomorrow: 'Confident; overseeing a system-validated close with full traceability' },
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
              Today, the entire period close rests on a stretched audit team. Tomorrow, it becomes a continuous, networked process—powered by AI.
            </p>
            <p className="text-black/70 max-w-xl leading-relaxed mb-6">
              3-way invoice match, validation, and reporting run continuously in the background. Shrink and variance exceptions surface automatically.
              Audit trails maintain themselves. Each role—Audit Lead, Store Managers, Supply Chain Controller, Finance Team, and the CFO—gets
              their own view. One platform, many perspectives, no single point of failure.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black border border-black">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-white">This is Sainsbury&apos;s Store OS</span>
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
              <div className="relative h-64 md:h-80">
                <Image
                  src="/images/ai-platform-scene.jpg"
                  alt="AI-driven operations center"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* The New Shape of the Period - Horizontal Workflow */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <span className="uppercase-label text-black/50 mb-2 block">The New Shape</span>
              <h2 className="font-serif text-2xl md:text-3xl text-black">
                The New Shape of the Close
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

            <Tabs defaultValue="priya" className="w-full">
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

              {/* Audit Lead View */}
              <TabsContent value="priya">
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
                          <h3 className="font-medium text-black">Daily Audit Lead</h3>
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
                        <span className="font-medium">The audit lead no longer executes the close—she oversees it.</span> 3-way invoice match
                        runs continuously throughout the day. When she arrives, the system has already validated transactions,
                        flagged exceptions, and prepared journals. Her role is now <span className="font-medium">quality assurance</span>:
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
                              <span className="text-sm text-black">Cash Office Z-Reads</span>
                            </div>
                            <span className="text-xs text-green font-medium">Completed</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green" />
                              <span className="text-sm text-black">3-Way Invoice Match</span>
                            </div>
                            <span className="text-xs text-green font-medium">Completed</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green" />
                              <span className="text-sm text-black">POS Reconciliation</span>
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
                              <span className="text-sm text-black">Manhattan WMS Reconciliation</span>
                            </div>
                            <span className={`text-xs font-medium ${exceptionStatus === 'approved' ? 'text-green' : 'text-amber'}`}>
                              {exceptionStatus === 'approved' ? 'Validated' : '1 Exception'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green" />
                              <span className="text-sm text-black">Inter-co Transfers</span>
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
                              <span className="text-sm text-black">Adjustments Posted to SAP</span>
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
                              <span className="text-sm font-medium text-black">WMS Stock Variance</span>
                              <span className="text-xs text-amber bg-amber/10 px-2 py-0.5 rounded">£4,247</span>
                            </div>
                            <p className="text-xs text-black/70 mb-3">
                              Manhattan WMS shows 2,340 units received from RDC. Store POS depletion implies 2,287 sold.
                            </p>
                            {/* IT Lens - Root Cause */}
                            <div className="bg-blue/10 border border-blue/20 rounded-lg p-2.5 mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Database className="w-3.5 h-3.5 text-blue" />
                                <span className="text-xs font-medium text-blue">Root Cause: SKU Mapping Mismatch</span>
                              </div>
                              <p className="text-xs text-black/70 pl-5">
                                SKU mapping between Manhattan WMS and SAP needs review for chilled category.
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
                                <span className="text-sm font-medium text-black">WMS Stock Variance</span>
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
                                <p className="text-xs text-black/70">Root Cause: <span className="text-black">SKU Mapping Mismatch</span></p>
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
                                <span className="text-sm font-medium text-black">WMS Stock Variance</span>
                              </div>
                              <span className="text-xs text-green bg-green/10 px-2 py-0.5 rounded">Approved</span>
                            </div>
                            <p className="text-xs text-black/70 mb-3">
                              Variance acknowledged and approved by Audit Lead. Close can proceed.
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
                                {closePosted ? 'Posted to SAP' : exceptionStatus === 'pending' ? 'Pending Review' : 'Ready for Close'}
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
                              ? 'Close authorised and posted to SAP S/4HANA.'
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

              {/* Store Manager View */}
              <TabsContent value="store-manager">
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
                          <h3 className="font-medium text-black">Store Manager</h3>
                          <p className="text-sm text-black/70">Cash office, fresh, or general merchandise — owns the day</p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-blue bg-blue/10 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                        My Store
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Narrative callout */}
                    <div className="mb-6 p-4 bg-blue/5 rounded-xl border border-blue/10">
                      <p className="text-sm text-black leading-relaxed">
                        <span className="font-medium">Store Managers own their daily reconciliation in real-time.</span> Whether
                        cash office, fresh produce, or general merchandise—they handle wastage, shrink, and adjustments as they happen, adding context
                        that systems cannot capture. <span className="font-medium">Issues are resolved by the person closest to the event</span>,
                        not left for the audit team at period end.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">Today&apos;s Reconciliation</h4>
                        <div className="space-y-3 bg-[#EBE3DB] rounded-xl p-4">
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-green" />
                              <div>
                                <span className="text-sm text-black">POS - Tellermate Match</span>
                                <span className="text-xs text-black/50 block">Trading day: 07:00 - 22:00</span>
                              </div>
                            </div>
                            <span className="text-xs text-green">Balanced</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-amber/30">
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="w-4 h-4 text-amber" />
                              <div>
                                <span className="text-sm text-black">Wastage & Shrink</span>
                                <span className="text-xs text-black/50 block">2 items need notes</span>
                              </div>
                            </div>
                            <span className="text-xs text-amber">Action</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-green/30">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-green" />
                              <div>
                                <span className="text-sm text-black">Day Summary</span>
                                <span className="text-xs text-black/50 block">Trading notes added</span>
                              </div>
                            </div>
                            <span className="text-xs text-green">Done</span>
                          </div>
                        </div>
                        <p className="text-xs text-black/70 mt-3 text-center">Resolve issues now — not at period end</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">Actions Taken Today</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-[#EBE3DB] rounded-lg border border-black/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-amber font-medium">Wastage Logged - £340</span>
                              <span className="text-xs text-black/50">14:32</span>
                            </div>
                            <div className="bg-white/50 rounded p-2 border border-black/10">
                              <p className="text-xs text-black/70 italic">&ldquo;Chiller fault on Aisle 4 overnight. 60+ units of fresh meat written off, supplier credit raised.&rdquo;</p>
                              <p className="text-xs text-black/50 mt-1">— Marcus T., Store Manager, Whitechapel</p>
                            </div>
                          </div>
                          <div className="p-3 bg-[#EBE3DB] rounded-lg border border-black/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-blue font-medium">Shrink Event - £85</span>
                              <span className="text-xs text-black/50">16:45</span>
                            </div>
                            <div className="bg-white/50 rounded p-2 border border-black/10">
                              <p className="text-xs text-black/70 italic">&ldquo;Suspected theft from spirits aisle. CCTV reviewed, security informed, loss recorded.&rdquo;</p>
                              <p className="text-xs text-black/50 mt-1">— Marcus T., Store Manager, Whitechapel</p>
                            </div>
                          </div>
                          <div className="p-3 bg-[#EBE3DB] rounded-lg border border-black/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-blue font-medium">Day Summary</span>
                              <span className="text-xs text-black/50">21:30</span>
                            </div>
                            <div className="bg-white/50 rounded p-2 border border-black/10">
                              <p className="text-xs text-black/70 italic">&ldquo;Strong Friday — bank holiday lift on bakery and BWS. Two checkout terminals down for 90 minutes mid-afternoon. Chiller engineer attended; plan to monitor unit 4 overnight.&rdquo;</p>
                              <p className="text-xs text-black/50 mt-1">— Marcus T., Store Manager, Whitechapel</p>
                            </div>
                          </div>
                          <div className="p-3 bg-green/5 rounded-lg border border-green/20">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green" />
                              <span className="text-xs text-green">All actions documented — handover ready for Audit Lead</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Supply Chain View */}
              <TabsContent value="supply-chain">
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
                          <h3 className="font-medium text-black">Supply Chain Controller</h3>
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
                        <span className="font-medium">The Supply Chain Controller wakes to a live morning view</span>—yesterday&apos;s
                        DC-to-store flow, the shrink hot-spots flagged, the commentary from store managers already in place. No more waiting for a
                        period-end report to land in the inbox.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-[#EBE3DB] rounded-xl">
                        <p className="text-xs text-black/50 uppercase mb-1">Yesterday&apos;s Sales</p>
                        <p className="text-2xl font-serif text-black tabular-nums">£68.4M</p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="w-3 h-3 text-green" />
                          <span className="text-xs text-green">+8.2% vs LW</span>
                        </div>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl">
                        <p className="text-xs text-black/50 uppercase mb-1">On-shelf Availability</p>
                        <p className="text-2xl font-serif text-black tabular-nums">94%</p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="w-3 h-3 text-green" />
                          <span className="text-xs text-green">+3pts vs LW</span>
                        </div>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl">
                        <p className="text-xs text-black/50 uppercase mb-1">Shrink Exceptions</p>
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
                        <span className="text-sm font-medium text-black">Argos Morning Brief</span>
                        <span className="text-xs text-black/50">• Auto-generated at 06:00</span>
                      </div>
                      <p className="text-sm text-black/70 leading-relaxed mb-4">
                        Strong performance yesterday with fresh categories driving 12% above forecast. Two minor variances
                        were auto-resolved overnight—one timing difference on a late RDC delivery, one rounding
                        adjustment. Basket spend per customer increased by £1.20 compared to last Tuesday. General merchandise had
                        lower volume but higher margin. Recommend reviewing chilled wastage in London region—consistently
                        above target this week.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-white/50 text-black/70 px-2 py-1 rounded-full">Fresh +12%</span>
                        <span className="text-xs bg-white/50 text-black/70 px-2 py-1 rounded-full">Chilled wastage -8%</span>
                        <span className="text-xs bg-white/50 text-black/70 px-2 py-1 rounded-full">GM steady</span>
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
                          <p className="text-sm text-black/70">Cross-store variance patterns</p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber bg-amber/10 px-2 py-1 rounded-full">
                        <Building2 className="w-3 h-3" />
                        600+ Stores
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Narrative callout */}
                    <div className="mb-6 p-4 bg-amber/5 rounded-xl border border-amber/10">
                      <p className="text-sm text-black leading-relaxed">
                        <span className="font-medium">The Finance Team opens a cross-store view.</span> Variance
                        patterns across stores are surfaced automatically. Comparisons that used to take a period rollup
                        to produce are now a glance.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">Variance Patterns This Week</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-[#EBE3DB] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-black">POS vs Bank Settlement</span>
                              <span className="text-xs text-amber font-medium">3 stores</span>
                            </div>
                            <p className="text-xs text-black/70 mb-2">
                              Recurring timing gap between POS close and bank settlement batch. Avg £340 overnight float.
                            </p>
                            <div className="text-xs text-black/50">
                              Affected: Whitechapel, Stratford, Holborn
                            </div>
                          </div>
                          <div className="p-3 bg-[#EBE3DB] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-black">Manager Markdown Gaps</span>
                              <span className="text-xs text-amber font-medium">2 stores</span>
                            </div>
                            <p className="text-xs text-black/70 mb-2">
                              Markdowns recorded on POS without matching manager approval code. Process gap identified.
                            </p>
                            <div className="text-xs text-black/50">
                              Affected: Camden, Islington
                            </div>
                          </div>
                          <div className="p-3 bg-[#EBE3DB] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-black">DC-to-Store Transfer Timing</span>
                              <span className="text-xs text-green font-medium">Resolved</span>
                            </div>
                            <p className="text-xs text-black/70 mb-2">
                              Manhattan WMS feed delay causing end-of-day mismatch. Fixed via API polling adjustment.
                            </p>
                            <div className="text-xs text-black/50">
                              All stores now syncing within 15 mins
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-black/50 mb-3">Store Comparison - Variance Rate</h4>
                        <div className="space-y-2">
                          {[
                            { site: 'Whitechapel', rate: '0.4%', trend: 'down', note: 'Improved from 1.2%' },
                            { site: 'Camden', rate: '0.9%', trend: 'up', note: 'Markdown process issue' },
                            { site: 'Stratford', rate: '0.6%', trend: 'down', note: 'Stable' },
                            { site: 'Holborn', rate: '1.1%', trend: 'up', note: 'POS settlement timing' },
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

              {/* CFO View */}
              <TabsContent value="cfo">
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
                          <h3 className="font-medium text-black">CFO</h3>
                          <p className="text-sm text-black/70">Network summary with AI insight</p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#a78bfa] bg-[#a78bfa]/10 px-2 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Argos Insight
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Narrative callout */}
                    <div className="mb-6 p-4 bg-[#a78bfa]/5 rounded-xl border border-[#a78bfa]/10">
                      <p className="text-sm text-black leading-relaxed">
                        <span className="font-medium">The CFO sees the network summary</span>—standing on a
                        traceable audit trail they can drill into at any point. Every number is supplemented by
                        AI-generated insight on patterns the system has observed across stores and across periods.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-[#EBE3DB] rounded-xl text-center">
                        <p className="text-xs text-black/50 uppercase mb-1">Network Sales</p>
                        <p className="text-2xl font-serif text-black tabular-nums">£342M</p>
                        <span className="text-xs text-green">+6% vs forecast</span>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl text-center">
                        <p className="text-xs text-black/50 uppercase mb-1">Avg Availability</p>
                        <p className="text-2xl font-serif text-black tabular-nums">91%</p>
                        <span className="text-xs text-green">+2pts vs LY</span>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl text-center">
                        <p className="text-xs text-black/50 uppercase mb-1">Stores Closed</p>
                        <p className="text-2xl font-serif text-black tabular-nums">600/600</p>
                        <span className="text-xs text-green">All validated</span>
                      </div>
                      <div className="p-4 bg-[#EBE3DB] rounded-xl text-center">
                        <p className="text-xs text-black/50 uppercase mb-1">Shrink Rate</p>
                        <p className="text-2xl font-serif text-black tabular-nums">0.8%</p>
                        <span className="text-xs text-black/70">Industry: 3.2%</span>
                      </div>
                    </div>

                    <div className="bg-[#a78bfa]/5 rounded-xl p-4 mb-4 border border-[#a78bfa]/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-4 h-4 text-[#a78bfa]" />
                        <span className="text-sm font-medium text-black">Argos Executive Summary</span>
                        <span className="text-xs text-black/50">• Patterns across 600+ stores, 12 periods</span>
                      </div>
                      <p className="text-sm text-black/70 leading-relaxed mb-4">
                        Network performing 6% above weekly forecast. London and South East driving
                        outperformance with strong fresh and BWS revenue. Midlands shows improving trend
                        after operational adjustments—shrink rate down 40% since process change. Recommend
                        capital review for Northern region chilled capacity based on 3-period demand data showing
                        sustained demand above current footprint.
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

          {/* At the End of the Period - Broader Business Value */}
          <div className="mb-12">
            <div className="bg-[#EBE3DB] border border-black/10 rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="uppercase-label text-black/50 mb-2 block">At the End of the Period</span>
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
                  <span className="text-sm text-black">Audit Lead</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-blue/30">
                  <ClipboardList className="w-4 h-4 text-blue" />
                  <span className="text-sm text-black">Store Manager</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-gold/30">
                  <LayoutDashboard className="w-4 h-4 text-gold" />
                  <span className="text-sm text-black">Supply Chain</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-amber/30">
                  <BarChart3 className="w-4 h-4 text-amber" />
                  <span className="text-sm text-black">Finance Team</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-gold/30">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm text-black">CFO</span>
                </div>
              </div>

              {/* Closing Statement */}
              <div className="bg-white/50 border border-black/10 rounded-xl p-6 max-w-2xl mx-auto text-center">
                <p className="text-lg text-black font-serif leading-relaxed">
                  &ldquo;The period close is no longer the property of one team. It is the shared
                  operating model of the Sainsbury&apos;s business.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* CFO Future State - Outcome Wins */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <span className="uppercase-label text-black/50 mb-2 block">The CFO Future State</span>
              <h2 className="font-serif text-2xl text-black">
                What Changes for the CFO
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/50 border border-gold/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green" />
                  <span className="text-xs uppercase text-black/50 font-medium">Period Close</span>
                </div>
                <p className="text-2xl font-serif text-black mb-1">11 days &rarr; 1 day</p>
                <p className="text-xs text-black/70">Continuous close replaces the period-end fire drill.</p>
              </div>
              <div className="bg-white/50 border border-gold/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green" />
                  <span className="text-xs uppercase text-black/50 font-medium">Invoice Match</span>
                </div>
                <p className="text-2xl font-serif text-black mb-1">97% auto-matched</p>
                <p className="text-xs text-black/70">Working capital freed; AP focused only on real exceptions.</p>
              </div>
              <div className="bg-white/50 border border-gold/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green" />
                  <span className="text-xs uppercase text-black/50 font-medium">Shrink Detection</span>
                </div>
                <p className="text-2xl font-serif text-black mb-1">24h, not 2 weeks</p>
                <p className="text-xs text-black/70">Spot a shrink spike while the cause is still live.</p>
              </div>
              <div className="bg-white/50 border border-gold/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-gold" />
                  <span className="text-xs uppercase text-black/50 font-medium">Argos AI</span>
                </div>
                <p className="text-2xl font-serif text-black mb-1">Daily briefings</p>
                <p className="text-xs text-black/70">Proactive morning brief on the desk before the day starts.</p>
              </div>
              <div className="bg-white/50 border border-gold/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-gold" />
                  <span className="text-xs uppercase text-black/50 font-medium">UK Network</span>
                </div>
                <p className="text-2xl font-serif text-black mb-1">600 stores, 1 ledger</p>
                <p className="text-xs text-black/70">Every store live on a single source of truth.</p>
              </div>
              <div className="bg-white/50 border border-gold/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green" />
                  <span className="text-xs uppercase text-black/50 font-medium">Audit Trail</span>
                </div>
                <p className="text-2xl font-serif text-black mb-1">End-to-end</p>
                <p className="text-xs text-black/70">Every figure traceable from receipt to ledger entry.</p>
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
                          <span className="text-sm font-medium text-black">Store Managers</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Email shrink and wastage totals weekly; commentary captured informally</td>
                      <td className="p-4 text-sm text-black bg-green/30">Structured inputs captured throughout the day; commentary visible live</td>
                    </tr>
                    <tr className="border-b border-black/10/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                            <LayoutDashboard className="w-4 h-4 text-gold" />
                          </div>
                          <span className="text-sm font-medium text-black">Supply Chain Controller</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Waits for the period rollup; sees only the lagging view of stock and shrink</td>
                      <td className="p-4 text-sm text-black bg-green/30">Opens a live network dashboard; sees flow and exceptions as they emerge</td>
                    </tr>
                    <tr className="border-b border-black/10/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-green" />
                          </div>
                          <span className="text-sm font-medium text-black">Daily Audit Lead</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Manual execution across all steps; days of reconciliation work</td>
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
                      <td className="p-4 text-sm text-black/70">Waits for period reconciliation; comparing stores is manual</td>
                      <td className="p-4 text-sm text-black bg-green/30">Real-time cross-store view; variance patterns surface automatically</td>
                    </tr>
                    <tr>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#a78bfa]/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                          </div>
                          <span className="text-sm font-medium text-black">CFO</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black/70">Sees stale board pack numbers; the working is invisible</td>
                      <td className="p-4 text-sm text-black bg-green/30">Network dashboard with Argos-generated insight; full traceability on demand</td>
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
                  <span className="text-xs text-red font-medium">~11 days manual effort</span>
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
                        <Banknote className="w-3.5 h-3.5 text-red" />
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
                    <span className="text-[11px] text-black/60">600+ stores reconciled by hand</span>
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
                  <span className="text-xs text-green font-medium">Continuous throughout the period</span>
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
                    <span className="text-[11px] text-black/60">Work happens throughout the period</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-black/60">Period close becomes a simple approval</span>
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
                Experience Sainsbury&apos;s Store OS
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
