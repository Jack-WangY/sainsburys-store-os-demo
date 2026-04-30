"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronUp,
  User,
  Building2,
  FileText,
  Mail,
  ChevronDown,
  ClipboardCheck,
  RefreshCw,
  BarChart3,
  MapPin,
  MessageSquare,
  Camera,
  Plus,
  Send,
  Download,
  Home,
  LogOut,
  Settings,
  Bell,
  Coffee,
  UtensilsCrossed,
  Dumbbell,
  Clapperboard,
  Wine,
  Sparkles,
  Bed,
  Info,
  XCircle,
  UserX,
  HelpCircle,
  Clock,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

type OutletItem = {
  id: string
  name: string
  location: string
  icon: React.ElementType
  status: 'pending' | 'checked'
  checkedAt?: string
  checkedBy?: string
  note?: string
  attachments?: string[]
}

type VarianceReason = 'void' | 'suspected-walkout' | 'confirmed-walkout' | 'integration-delay' | 'posting-error'

type ReconciliationRow = {
  id: string
  tenderType: string
  code: string
  opera: number
  pos: number // POS system amount (Simphony, Book4Time, or Veezi)
  system: 'simphony' | 'book4time' | 'veezi'
  status: 'matched' | 'flagged' | 'resolved'
  variance?: number
  resolution?: string
  // Evidence-based variance suggestion
  suggestedReason?: VarianceReason
  confidence?: 'high' | 'medium' | 'low'
  evidence?: {
    source: string
    details: string[]
  }
}

type RevenueBreakdownItem = {
  name: string
  amount: number
  outletId?: string
}

type RevenueSource = {
  id: string
  name: string
  system: string
  amount: number
  status: 'captured' | 'pending' | 'missing'
  lastSync?: string
  outletId?: string // Links to outlet for closure status
  breakdown?: RevenueBreakdownItem[] // For consolidated categories like F&B
}

// ============================================================================
// MOCK DATA
// ============================================================================

const initialOutlets: OutletItem[] = [
  { id: '1', name: 'Restaurant', location: 'Ground Floor', icon: UtensilsCrossed, status: 'pending' },
  { id: '2', name: 'Bar', location: '1st Floor', icon: Wine, status: 'pending' },
  { id: '3', name: 'Healthclub', location: 'Lower Ground', icon: Dumbbell, status: 'pending' },
  { id: '5', name: 'Cafe', location: 'Lobby', icon: Coffee, status: 'pending' },
  { id: '6', name: 'Cinema', location: 'Ground Floor', icon: Clapperboard, status: 'pending' },
]

// Outlet Manager Handoffs (read-only for night supervisor view)
type HandoffItem = {
  id: string
  task: string
  completed: boolean
}

type OutletHandoff = {
  outletId: string
  outletName: string
  system: 'Simphony' | 'Book4Time' | 'Veezi'
  manager: string
  completedAt?: string
  icon: React.ComponentType<{ className?: string }>
  items: HandoffItem[]
}

const outletHandoffs: OutletHandoff[] = [
  {
    outletId: '1',
    outletName: 'Restaurant',
    system: 'Simphony',
    manager: 'J. Smith',
    completedAt: '22:45',
    icon: UtensilsCrossed,
    items: [
      { id: '1a', task: 'All checks closed in Simphony', completed: true },
    ],
  },
  {
    outletId: '2',
    outletName: 'Bar',
    system: 'Simphony',
    manager: 'M. Jones',
    icon: Wine,
    items: [
      { id: '2a', task: 'All checks closed in Simphony', completed: false },
    ],
  },
  {
    outletId: '3',
    outletName: 'Healthclub',
    system: 'Book4Time',
    manager: 'A. Brown',
    completedAt: '21:30',
    icon: Dumbbell,
    items: [
      { id: '3a', task: 'All sessions closed in Book4Time', completed: true },
    ],
  },
  {
    outletId: '5',
    outletName: 'Cafe',
    system: 'Simphony',
    manager: 'L. Davis',
    completedAt: '22:00',
    icon: Coffee,
    items: [
      { id: '5a', task: 'All checks closed in Simphony', completed: true },
    ],
  },
  {
    outletId: '6',
    outletName: 'Cinema',
    system: 'Veezi',
    manager: 'T. Wilson',
    completedAt: '23:00',
    icon: Clapperboard,
    items: [
      { id: '6a', task: 'All transactions closed in Veezi', completed: true },
    ],
  },
]



const initialRevenueSources: RevenueSource[] = [
  { id: '1', name: 'Room Revenue', system: 'Opera', amount: 42850.00, status: 'captured', lastSync: '23:45' },
  { 
    id: '2', 
    name: 'F&B Revenue', 
    system: 'Simphony', 
    amount: 24950.50, // Restaurant + Bar + Cafe combined
    status: 'captured', 
    lastSync: '23:42',
    breakdown: [
      { name: 'Restaurant', amount: 18420.50, outletId: '1' },
      { name: 'Bar', amount: 4850.00, outletId: '2' },
      { name: 'Cafe', amount: 1680.00, outletId: '5' },
    ],
  },
  { id: '3', name: 'Healthclub Services', system: 'Book4Time', amount: 3250.00, status: 'captured', lastSync: '23:30', outletId: '3' },
  { id: '4', name: 'Cinema Revenue', system: 'Veezi', amount: 2450.00, status: 'captured', lastSync: '23:35', outletId: '6' },
]

const initialReconciliation: ReconciliationRow[] = [
  // Simphony (F&B)
  { id: '1', tenderType: 'Visa', code: '900010', opera: 2335.00, pos: 2335.00, system: 'simphony', status: 'matched' },
  { 
    id: '2', 
    tenderType: 'Mastercard', 
    code: '900011', 
    opera: 540.00, 
    pos: 555.50, 
    system: 'simphony', 
    status: 'flagged', 
    variance: 15.50,
    suggestedReason: 'void',
    confidence: 'high',
    evidence: {
      source: 'Simphony Transaction Report',
      details: [
        'Transaction #4521 shows Type: VOID',
        'Voided by: J. Smith at 21:34',
        'Reason code: Customer complaint',
        'Amount: £15.50 (1x House Burger)',
      ],
    },
  },
  { id: '3', tenderType: 'Amex', code: '900012', opera: 765.00, pos: 765.00, system: 'simphony', status: 'matched' },
  { id: '4', tenderType: 'Room Charge', code: '900050', opera: 1250.00, pos: 1250.00, system: 'simphony', status: 'matched' },
  { id: '5', tenderType: 'Cash', code: '900001', opera: 156.75, pos: 156.75, system: 'simphony', status: 'matched' },
  // Book4Time (Healthclub)
  { id: '6', tenderType: 'Visa', code: '900010', opera: 1850.00, pos: 1850.00, system: 'book4time', status: 'matched' },
  { id: '7', tenderType: 'Mastercard', code: '900011', opera: 420.00, pos: 420.00, system: 'book4time', status: 'matched' },
  { id: '8', tenderType: 'Room Charge', code: '900050', opera: 980.00, pos: 980.00, system: 'book4time', status: 'matched' },
  // Veezi (Cinema)
  { id: '9', tenderType: 'Visa', code: '900010', opera: 680.00, pos: 680.00, system: 'veezi', status: 'matched' },
  { id: '10', tenderType: 'Cash', code: '900001', opera: 245.00, pos: 245.00, system: 'veezi', status: 'matched' },
  { id: '11', tenderType: 'Room Charge', code: '900050', opera: 755.00, pos: 755.00, system: 'veezi', status: 'matched' },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NightAuditPortal() {
  const [activeModule, setActiveModule] = useState<'preclose' | 'financial' | 'reports'>('preclose')
  const [precloseStep, setPrecloseStep] = useState<'handoffs' | 'closure' | 'revenue'>('handoffs')
  const [nudgedManagers, setNudgedManagers] = useState<string[]>([])
  const [expandedRevenue, setExpandedRevenue] = useState<string | null>(null)
  const [outlets, setOutlets] = useState(initialOutlets)
  const [revenueSources, setRevenueSources] = useState(initialRevenueSources)
  const [reconciliation, setReconciliation] = useState(initialReconciliation)
  const [expandedOutlet, setExpandedOutlet] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState('')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [resolutionNote, setResolutionNote] = useState('')
  const [reconSystemFilter, setReconSystemFilter] = useState<'all' | 'simphony' | 'book4time' | 'veezi'>('all')
  const [reconStatus, setReconStatus] = useState<'waiting' | 'running' | 'complete'>('waiting')
  const [summaryOutlet, setSummaryOutlet] = useState<'restaurant' | 'bar' | 'cafe' | 'healthclub' | 'cinema'>('restaurant')
  
  // Computed: filtered reconciliation data based on system filter
  const filteredRecon = reconSystemFilter === 'all' 
    ? reconciliation 
    : reconciliation.filter(r => r.system === reconSystemFilter)
  
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
  const timeStr = today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  // Connected systems data
  const connectedSystems: { system: string; status: 'synced' | 'pending'; icon: typeof Bed; lastSync: string; records: number }[] = [
    { system: 'Opera', status: 'synced', icon: Bed, lastSync: '23:45', records: 142 },
    { system: 'Simphony', status: 'synced', icon: UtensilsCrossed, lastSync: '23:42', records: 387 },
    { system: 'Book4Time', status: 'synced', icon: Dumbbell, lastSync: '23:30', records: 45 },
    { system: 'Veezi', status: 'synced', icon: Clapperboard, lastSync: '23:40', records: 28 },
  ]

  // Calculate progress
  const outletsChecked = outlets.filter(o => o.status === 'checked').length
  const revenuesCaptured = revenueSources.filter(r => r.status === 'captured').length
  const reconciliationMatched = reconciliation.filter(r => r.status === 'matched' || r.status === 'resolved').length
  
  // Check if data is ready for reconciliation
  const isDataReady = outletsChecked === outlets.length && connectedSystems.every(s => s.status === 'synced')
  
  // Auto-trigger reconciliation when data is ready and user enters the tab
  useEffect(() => {
    if (activeModule === 'financial' && isDataReady && reconStatus === 'waiting') {
      setReconStatus('running')
    }
  }, [activeModule, isDataReady, reconStatus])

  // Timer for running state
  useEffect(() => {
    if (reconStatus === 'running') {
      const timer = setTimeout(() => {
        setReconStatus('complete')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [reconStatus])

  // Check if outlet is closed for a revenue source
  const isOutletClosed = (outletId?: string) => {
    if (!outletId) return true // No outlet linked (e.g., Room Revenue)
    const outlet = outlets.find(o => o.id === outletId)
    return outlet?.status === 'checked'
  }

  const getOutletName = (outletId?: string) => {
    if (!outletId) return null
    return outlets.find(o => o.id === outletId)?.name
  }

const handleCheckOutlet = (id: string) => {
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    setOutlets(prev => prev.map(o => 
      o.id === id 
        ? { 
            ...o, 
            status: 'checked',
            checkedAt: now,
            checkedBy: 'Night Auditor',
          } 
        : o
    ))
    setNoteInput('')
    setExpandedOutlet(null)
  }

  const handleAddNote = (id: string) => {
    if (noteInput.trim()) {
      setOutlets(prev => prev.map(o => 
        o.id === id 
          ? { 
              ...o, 
              note: noteInput,
              // In a real app, attachments would come from file upload
              attachments: o.attachments
            } 
          : o
      ))
      setNoteInput('')
      setExpandedOutlet(null)
    }
  }

  const handleRefreshRevenue = (id: string) => {
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    setRevenueSources(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'captured', lastSync: now } : r
    ))
  }

  const handleResolve = (id: string) => {
    if (resolutionNote.trim()) {
      setReconciliation(prev => prev.map(r =>
        r.id === id ? { ...r, status: 'resolved', resolution: resolutionNote } : r
      ))
      setResolutionNote('')
      setExpandedRow(null)
    }
  }

  const modules = [
    { id: 'preclose', label: 'Checklist', icon: ClipboardCheck, count: `${outletsChecked}/${outlets.length}` },
    { id: 'financial', label: 'Reconciliation', icon: BarChart3, count: `${reconciliationMatched}/${reconciliation.length}` },
    { id: 'reports', label: 'Reports', icon: FileText, count: null },
  ] as const

  return (
    <div className="min-h-screen bg-[#CEC0B2]">
      {/* Top Navigation Bar */}
      <header className="bg-[#1a1a1a] text-white px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/story" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back to Story</span>
            </Link>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="font-serif text-lg">House OS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/20" />
            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Property & User Bar */}
      <div className="bg-[#EBE3DB] border-b border-black/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-xl text-black">White City House</h1>
                <p className="text-sm text-black/60">Night Revenue Portal</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-black/60">{dateStr}</p>
              <p className="text-lg font-medium text-black" suppressHydrationWarning>{timeStr}</p>
            </div>
            <div className="w-px h-10 bg-black/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Night Supervisor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="bg-white/50 border-b border-black/10 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex gap-1">
            {modules.map((module) => {
              const Icon = module.icon
              const isActive = activeModule === module.id
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-4 border-b-2 transition-colors",
                    isActive 
                      ? "border-[#1a1a1a] text-black" 
                      : "border-transparent text-black/50 hover:text-black/70 hover:bg-black/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{module.label}</span>
                  {module.count && (
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isActive ? "bg-[#1a1a1a] text-white" : "bg-black/10 text-black/60"
                    )}>
                      {module.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {/* PRE-CLOSE TAB */}
            {activeModule === 'preclose' && (
              <motion.div
                key="preclose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Sub-tabs for Checklist */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setPrecloseStep('handoffs')}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      precloseStep === 'handoffs' 
                        ? "bg-[#1a1a1a] text-white" 
                        : "bg-white/60 text-black/60 hover:bg-white/80"
                    )}
                  >
                    Outlet Handoffs
                  </button>
                  <button
                    onClick={() => setPrecloseStep('closure')}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      precloseStep === 'closure' 
                        ? "bg-[#1a1a1a] text-white" 
                        : "bg-white/60 text-black/60 hover:bg-white/80"
                    )}
                  >
                    Closure
                  </button>
                  <button
                    onClick={() => setPrecloseStep('revenue')}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      precloseStep === 'revenue' 
                        ? "bg-[#1a1a1a] text-white" 
                        : "bg-white/60 text-black/60 hover:bg-white/80"
                    )}
                  >
                    Revenue
                  </button>
                </div>

                {/* Outlet Manager Handoffs (Read-Only) */}
                {precloseStep === 'handoffs' && (
                  <>
                    <div className="mb-6">
                      <h2 className="font-serif text-2xl text-black mb-2">Outlet Manager Handoffs</h2>
                      <p className="text-black/60">
                        Review handoff status from each outlet manager before proceeding with closure.
                      </p>
                      
                      {/* Status indicator */}
                      {(() => {
                        const incompleteHandoffs = outletHandoffs.filter(h => h.items.some(i => !i.completed))
                        const allComplete = incompleteHandoffs.length === 0
                        
                        return allComplete ? (
                          <div className="mt-4 flex items-center justify-between bg-[#eaf3de]/50 border border-[#4a9e6b]/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-[#4a9e6b]" />
                              <span className="text-sm text-[#4a9e6b]">All outlet handoffs complete</span>
                            </div>
                            <button
                              onClick={() => setPrecloseStep('closure')}
                              className="text-sm text-[#4a9e6b] hover:text-[#3d8459] font-medium flex items-center gap-1"
                            >
                              Continue to Closure
                              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                            </button>
                          </div>
                        ) : (
                          <div className="mt-4 flex items-center gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg p-3">
                            <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                            <span className="text-sm text-[#92400e]">
                              {incompleteHandoffs.length} outlet{incompleteHandoffs.length > 1 ? 's' : ''} with incomplete handoff
                            </span>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Outlet Handoff List */}
                    <div className="space-y-3">
                      {outletHandoffs.map((handoff) => {
                        const Icon = handoff.icon
                        const completedItems = handoff.items.filter(i => i.completed).length
                        const allComplete = completedItems === handoff.items.length
                        
                        return (
                          <div 
                            key={handoff.outletId}
                            className={cn(
                              "bg-white/60 border rounded-xl overflow-hidden",
                              allComplete ? "border-[#4a9e6b]/30 bg-[#eaf3de]/20" : "border-[#a32d2d]/20 bg-[#fcebeb]/30"
                            )}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                    allComplete ? "bg-[#4a9e6b]/20" : "bg-[#a32d2d]/10"
                                  )}>
                                    <Icon className={cn(
                                      "w-5 h-5",
                                      allComplete ? "text-[#4a9e6b]" : "text-[#a32d2d]"
                                    )} />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-black flex items-center gap-2">
                                      {handoff.outletName}
                                      <span className="text-xs text-black/40 font-normal">({handoff.system})</span>
                                    </h3>
                                    <div className="text-sm text-black/60">
                                      Manager: {handoff.manager}
                                      {handoff.completedAt && (
                                        <span className="text-[#4a9e6b] ml-2">completed at {handoff.completedAt}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className={cn(
                                  "px-3 py-1 rounded-full text-xs font-medium",
                                  allComplete ? "bg-[#4a9e6b]/20 text-[#3b6d11]" : "bg-[#a32d2d]/10 text-[#a32d2d]"
                                )}>
                                  {completedItems}/{handoff.items.length} complete
                                </div>
                              </div>
                              
                              {/* Checklist items (read-only) */}
                              <div className="space-y-2 ml-13">
                                {handoff.items.map((item) => (
                                  <div 
                                    key={item.id}
                                    className="flex items-center gap-3 text-sm"
                                  >
                                    <div className={cn(
                                      "w-5 h-5 rounded border flex items-center justify-center shrink-0",
                                      item.completed 
                                        ? "bg-[#4a9e6b] border-[#4a9e6b]" 
                                        : "bg-white border-[#a32d2d]/40"
                                    )}>
                                      {item.completed && (
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                    <span className={cn(
                                      item.completed ? "text-black/60" : "text-[#a32d2d] font-medium"
                                    )}>
                                      {item.task}
                                    </span>
                                    {!item.completed && (
                                      <span className="text-xs bg-[#a32d2d]/10 text-[#a32d2d] px-2 py-0.5 rounded">
                                        Incomplete
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              
                              {/* Send Reminder Button for incomplete handoffs */}
                              {!allComplete && (
                                <div className="mt-4 pt-3 border-t border-[#a32d2d]/10 flex items-center justify-between">
                                  <span className="text-xs text-[#a32d2d]">
                                    Pending items require action from {handoff.manager}
                                  </span>
                                  {nudgedManagers.includes(handoff.outletId) ? (
                                    <span className="text-xs text-[#4a9e6b] flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Reminder sent
                                    </span>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setNudgedManagers(prev => [...prev, handoff.outletId])
                                      }}
                                      className="text-xs bg-[#185fa5] text-white border-[#185fa5] hover:bg-[#144d8a]"
                                    >
                                      <Send className="w-3.5 h-3.5 mr-1.5" />
                                      Send Reminder
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}

                {/* Closure Step */}
                {precloseStep === 'closure' && (
                  <>
                    <div className="mb-6">
                      <h2 className="font-serif text-2xl text-black mb-2">Closure</h2>
                      <p className="text-black/60">
                        Walk through the property and confirm each outlet is closed.
                      </p>
                      
                      {/* Progress indicator */}
                      {outletsChecked === outlets.length ? (
                        <div className="mt-4 flex items-center justify-between bg-[#eaf3de]/50 border border-[#4a9e6b]/30 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#4a9e6b]" />
                            <span className="text-sm text-[#4a9e6b]">{outletsChecked}/{outlets.length} verified</span>
                          </div>
                          <button
                            onClick={() => setPrecloseStep('revenue')}
                            className="text-sm text-[#4a9e6b] hover:text-[#3d8459] font-medium flex items-center gap-1"
                          >
                            Continue to Revenue
                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4 flex items-center gap-2 text-sm text-black/50">
                          <span>{outletsChecked}/{outlets.length} verified</span>
                        </div>
                      )}
                    </div>

                    {/* Outlet List */}
                    <div className="space-y-3">
                      {outlets.map((outlet) => {
                        const Icon = outlet.icon
                        const isExpanded = expandedOutlet === outlet.id
                        
                        return (
                          <div 
                            key={outlet.id}
                            className={cn(
                              "bg-white/60 border rounded-xl overflow-hidden transition-all",
                              outlet.status === 'checked' && "border-[#4a9e6b]/30 bg-[#eaf3de]/30",
                              outlet.status === 'pending' && "border-black/10"
                            )}
                          >
                            <div className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center",
                                  outlet.status === 'checked' && "bg-[#4a9e6b]/20",
                                  outlet.status === 'pending' && "bg-black/5"
                                )}>
                                  <Icon className={cn(
                                    "w-6 h-6",
                                    outlet.status === 'checked' && "text-[#4a9e6b]",
                                    outlet.status === 'pending' && "text-black/40"
                                  )} />
                                </div>
                                <div>
                                  <h3 className="font-medium text-black flex items-center gap-2">
                                    {outlet.name}
                                    {outlet.note && (
                                      <span className="text-xs bg-white/60 text-black/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        Commentary
                                      </span>
                                    )}
                                  </h3>
                                  <div className="flex items-center gap-1 text-sm text-black/60">
                                    <MapPin className="w-3 h-3" />
                                    {outlet.location}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {outlet.status === 'checked' && (
                                  <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-[#eaf3de]">
                                    <CheckCircle2 className="w-4 h-4 text-[#4a9e6b]" />
                                    <span className="text-sm text-[#3b6d11] font-medium">{outlet.checkedAt}</span>
                                  </div>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (isExpanded) {
                                      setExpandedOutlet(null)
                                      setNoteInput('')
                                    } else {
                                      setExpandedOutlet(outlet.id)
                                      setNoteInput(outlet.note || '')
                                    }
                                  }}
                                  className="bg-white/60 border-black/10 text-black/70 hover:bg-white/80"
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  {outlet.note ? 'Edit' : 'Commentary'}
                                </Button>
                                {outlet.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleCheckOutlet(outlet.id)}
                                    className="bg-[#4a9e6b] hover:bg-[#3d8459] text-white"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Mark Closed
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Expanded Note Panel */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 border-t border-black/10 pt-4">
                                    <label className="text-sm font-medium text-black/60 mb-2 block">
                                      Commentary
                                    </label>
                                    <textarea
                                      value={noteInput}
                                      onChange={(e) => setNoteInput(e.target.value)}
                                      placeholder="e.g. Till drawer left open, manager notified..."
                                      className="w-full p-3 rounded-lg border border-black/30 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 resize-none bg-white"
                                      rows={2}
                                    />
                                    <div className="flex items-center justify-between mt-3">
                                      <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black/70 transition-colors cursor-pointer px-3 py-1.5 rounded-lg border border-dashed border-black/15 hover:border-black/25 hover:bg-white/50">
                                          <Camera className="w-4 h-4" />
                                          <span>Photo</span>
                                          <input type="file" accept="image/*" className="hidden" />
                                        </label>
                                        <label className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black/70 transition-colors cursor-pointer px-3 py-1.5 rounded-lg border border-dashed border-black/15 hover:border-black/25 hover:bg-white/50">
                                          <Plus className="w-4 h-4" />
                                          <span>Attachment</span>
                                          <input type="file" className="hidden" />
                                        </label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setExpandedOutlet(null)
                                            setNoteInput('')
                                          }}
                                          className="bg-white/60 border-black/10 text-black/70 hover:bg-white/80"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => handleAddNote(outlet.id)}
                                          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
                                          disabled={!noteInput.trim()}
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Note Display (when not editing) */}
                            {!isExpanded && outlet.note && (
                              <div className="px-4 pb-4 border-t border-black/5 pt-3">
                                <div className="flex items-start gap-2 text-sm text-black/60 bg-white/40 p-3 rounded-lg">
                                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <p>{outlet.note}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}

                {/* Revenue Step */}
                {precloseStep === 'revenue' && (
                  <>
                    <div className="mb-6">
                      <h2 className="font-serif text-2xl text-black mb-2">Revenue</h2>
                      <p className="text-black/60">
                        Revenue automatically captured from all connected systems.
                      </p>
                    </div>

                    {/* System Status Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {connectedSystems.map((sys) => {
                        const Icon = sys.icon
                        return (
                          <div 
                            key={sys.system}
                            className={cn(
                              "bg-white/60 border rounded-xl p-4",
                              sys.status === 'synced' && "border-[#4a9e6b]/30",
                              sys.status === 'pending' && "border-[#d4855a]/30"
                            )}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                sys.status === 'synced' && "bg-[#4a9e6b]/20",
                                sys.status === 'pending' && "bg-[#d4855a]/20"
                              )}>
                                <Icon className={cn(
                                  "w-5 h-5",
                                  sys.status === 'synced' && "text-[#4a9e6b]",
                                  sys.status === 'pending' && "text-[#d4855a]"
                                )} />
                              </div>
                              {sys.status === 'synced' ? (
                                <CheckCircle2 className="w-5 h-5 text-[#4a9e6b]" />
                              ) : (
                                <RefreshCw className="w-5 h-5 text-[#d4855a] animate-spin" />
                              )}
                            </div>
                            <h3 className="font-medium text-black text-sm">{sys.system}</h3>
                            <p className="text-xs text-black/50 mt-1">
                              {sys.records} records | Last: {sys.lastSync}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Revenue Summary */}
                    <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-black">Total Revenue Today</h3>
                        <span className="text-xs text-black/50">Auto-synced from all systems</span>
                      </div>
                      <div className="text-4xl font-serif text-black">
                        £{revenueSources.reduce((sum, r) => sum + r.amount, 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Revenue Sources */}
                    <div className="space-y-3">
                      {revenueSources.map((source) => {
                        // For sources with breakdown, check all sub-outlets
                        const hasBreakdown = source.breakdown && source.breakdown.length > 0
                        const allOutletsClosed = hasBreakdown && source.breakdown
                          ? source.breakdown.every(b => isOutletClosed(b.outletId))
                          : isOutletClosed(source.outletId)
                        const unclosedOutlets = hasBreakdown && source.breakdown
                          ? source.breakdown.filter(b => !isOutletClosed(b.outletId)).map(b => b.name)
                          : []
                        const isExpanded = expandedRevenue === source.id
                        
                        return (
                          <div 
                            key={source.id}
                            className={cn(
                              "bg-white/60 border rounded-xl overflow-hidden",
                              allOutletsClosed ? "border-[#4a9e6b]/30" : "border-[#d4855a]/30"
                            )}
                          >
                            <div 
                              className={cn(
                                "p-4 flex items-center justify-between",
                                hasBreakdown && "cursor-pointer hover:bg-white/40"
                              )}
                              onClick={() => hasBreakdown && setExpandedRevenue(isExpanded ? null : source.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-3 h-3 rounded-full",
                                  allOutletsClosed ? "bg-[#4a9e6b]" : "bg-[#d4855a]"
                                )} />
                                <div>
                                  <h3 className="font-medium text-black flex items-center gap-2">
                                    {source.name}
                                    {hasBreakdown && (
                                      <ChevronDown className={cn(
                                        "w-4 h-4 text-black/40 transition-transform",
                                        isExpanded && "rotate-180"
                                      )} />
                                    )}
                                  </h3>
                                  <p className="text-sm text-black/50">{source.system}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-lg font-medium text-black">
                                    £{source.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                                  </div>
                                  {source.lastSync && (
                                    <div className="text-xs text-black/50">
                                      Last sync: {source.lastSync}
                                    </div>
                                  )}
                                </div>
                                {allOutletsClosed ? (
                                  <CheckCircle2 className="w-5 h-5 text-[#4a9e6b]" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-[#d4855a]" />
                                )}
                              </div>
                            </div>
                            
                            {/* Breakdown view for F&B */}
                            {hasBreakdown && isExpanded && source.breakdown && (
                              <div className="px-4 pb-4 border-t border-black/5">
                                <div className="mt-3 space-y-2">
                                  {source.breakdown.map((item, idx) => {
                                    const itemClosed = isOutletClosed(item.outletId)
                                    return (
                                      <div 
                                        key={idx}
                                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/50"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            itemClosed ? "bg-[#4a9e6b]" : "bg-[#d4855a]"
                                          )} />
                                          <span className="text-sm text-black/70">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-medium text-black">
                                          £{item.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                            
                            {/* Outlet not closed warning */}
                            {!allOutletsClosed && unclosedOutlets.length > 0 && (
                              <div className="px-4 pb-4">
                                <div className="pt-3 border-t border-[#d4855a]/20 flex items-center justify-between text-sm text-[#d4855a]">
                                  <span>{unclosedOutlets.join(', ')} not yet closed - revenue may not be final</span>
                                  <button
                                    onClick={() => setPrecloseStep('closure')}
                                    className="underline hover:no-underline"
                                  >
                                    Go to Closure
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* FINANCIAL TAB */}
            {activeModule === 'financial' && (
              <motion.div
                key="financial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Reconciliation Status */}
                {reconStatus === 'waiting' && !isDataReady && (
                  <div className="rounded-xl p-6 mb-6 border bg-[#faeeda]/50 border-[#d4855a]/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          {outletsChecked === outlets.length ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4a9e6b]" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-[#d4855a]" />
                          )}
                          <span className="text-sm text-black/70">{outletsChecked}/{outlets.length} outlets closed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {connectedSystems.every(s => s.status === 'synced') ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4a9e6b]" />
                          ) : (
                            <RefreshCw className="w-4 h-4 text-[#d4855a] animate-spin" />
                          )}
                          <span className="text-sm text-black/70">
                            {connectedSystems.filter(s => s.status === 'synced').length}/{connectedSystems.length} systems synced
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#fac775] text-[#854f0b]">
                        Waiting for data
                      </span>
                    </div>
                  </div>
                )}

                {(reconStatus === 'running' || reconStatus === 'complete') && (
                  <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-2xl text-black">Reconciliation Engine</h2>
                      {reconStatus === 'running' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4ff] border border-[#185fa5]/20"
                        >
                          <RefreshCw className="w-3 h-3 text-[#185fa5] animate-spin" />
                          <span className="text-xs text-[#185fa5]">Running...</span>
                        </motion.div>
                      )}
                      {reconStatus === 'complete' && (
                        <button
                          onClick={() => reconciliationMatched === reconciliation.length && setActiveModule('reports')}
                          disabled={reconciliationMatched !== reconciliation.length}
                          className={cn(
                            "text-sm font-medium flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors",
                            reconciliationMatched === reconciliation.length
                              ? "bg-[#4a9e6b] hover:bg-[#3d8459] text-white cursor-pointer"
                              : "bg-black/10 text-black/40 cursor-not-allowed"
                          )}
                        >
                          Generate Report
                          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                        </button>
                      )}
                    </div>
                    {reconStatus === 'complete' && (
                    <div className="flex gap-2">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'simphony', label: 'Simphony' },
                        { id: 'book4time', label: 'Book4Time' },
                        { id: 'veezi', label: 'Veezi' },
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setReconSystemFilter(filter.id as typeof reconSystemFilter)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            reconSystemFilter === filter.id
                              ? "bg-[#1a1a1a] text-white"
                              : "bg-white/60 text-black/60 hover:bg-white/80"
                          )}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                    )}
                  </div>
                  <p className="text-black/60">
                    Automated cross-system comparison with intelligent variance detection.
                  </p>
                </div>

                {/* Stats - only show when complete */}
                {reconStatus === 'complete' && (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Matched', count: filteredRecon.filter(r => r.status === 'matched').length, color: 'green' },
                    { label: 'Flagged', count: filteredRecon.filter(r => r.status === 'flagged').length, color: 'red' },
                    { label: 'Resolved', count: filteredRecon.filter(r => r.status === 'resolved').length, color: 'blue' },
                  ].map((stat) => (
                    <div 
                      key={stat.label}
                      className={cn(
                        "rounded-xl p-4 text-center",
                        stat.color === 'green' && "bg-[#eaf3de]",
                        stat.color === 'red' && "bg-[#fcebeb]",
                        stat.color === 'blue' && "bg-[#e6f1fb]"
                      )}
                    >
                      <div className={cn(
                        "text-3xl font-serif",
                        stat.color === 'green' && "text-[#3b6d11]",
                        stat.color === 'red' && "text-[#a32d2d]",
                        stat.color === 'blue' && "text-[#185fa5]"
                      )}>
                        {stat.count}
                      </div>
                      <div className={cn(
                        "text-sm",
                        stat.color === 'green' && "text-[#3b6d11]",
                        stat.color === 'red' && "text-[#a32d2d]",
                        stat.color === 'blue' && "text-[#185fa5]"
                      )}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reconciliation Table */}
                <div className="bg-white/60 border border-black/10 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 p-4 bg-[#f1efe8] border-b border-black/10">
                    <div className="text-xs font-semibold text-black/50 uppercase tracking-wide">Tender Type</div>
                    <div className="text-xs font-semibold text-black/50 uppercase tracking-wide text-right">Opera</div>
                    <div className="text-xs font-semibold text-black/50 uppercase tracking-wide text-right">
                      {reconSystemFilter === 'all' ? 'POS' : reconSystemFilter === 'simphony' ? 'Simphony' : reconSystemFilter === 'book4time' ? 'Book4Time' : 'Veezi'}
                    </div>
                    <div className="text-xs font-semibold text-black/50 uppercase tracking-wide text-right">Variance</div>
                    <div className="text-xs font-semibold text-black/50 uppercase tracking-wide text-right">Status</div>
                  </div>

                  <div className="divide-y divide-black/5">
                    {filteredRecon.map((row) => (
                      <div key={row.id}>
                        <button
                          onClick={() => {
                              if (expandedRow === row.id) {
                                setExpandedRow(null)
                                setResolutionNote('')
                              } else {
                                setExpandedRow(row.id)
                                // Pre-select based on suggested reason
                                if (row.suggestedReason === 'void') setResolutionNote('Void')
                                else if (row.suggestedReason === 'suspected-walkout' || row.suggestedReason === 'confirmed-walkout') setResolutionNote('Walkout')
                                else if (row.suggestedReason === 'integration-delay') setResolutionNote('Integration delay')
                                else setResolutionNote('')
                              }
                            }}
                          className={cn(
                            "w-full grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 p-4 text-left hover:bg-black/5 transition-colors",
                            row.status === 'matched' && "bg-[#eaf3de]/30",
                            row.status === 'flagged' && "bg-[#fcebeb]/30",
                            row.status === 'resolved' && "bg-[#e6f1fb]/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              row.status === 'matched' && "bg-[#4a9e6b]",
                              row.status === 'flagged' && "bg-[#c45c5c]",
                              row.status === 'resolved' && "bg-[#185fa5]"
                            )} />
                            <div>
                              <span className="text-sm text-black">{row.tenderType}</span>
                              {reconSystemFilter === 'all' && (
                                <span className="text-xs text-black/40 ml-2">
                                  {row.system === 'simphony' ? 'Simphony' : row.system === 'book4time' ? 'Book4Time' : 'Veezi'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-black/70 text-right">£{row.opera.toFixed(2)}</div>
                          <div className="text-sm text-black/70 text-right">£{row.pos.toFixed(2)}</div>
                          <div className={cn(
                            "text-sm font-medium text-right",
                            row.variance ? "text-[#a32d2d]" : "text-black/40"
                          )}>
                            {row.variance ? `+£${row.variance.toFixed(2)}` : '—'}
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span className={cn(
                              "text-xs font-medium px-2 py-1 rounded-full",
                              row.status === 'matched' && "bg-[#c0dd97] text-[#3b6d11]",
                              row.status === 'flagged' && "bg-[#f09595] text-[#a32d2d]",
                              row.status === 'resolved' && "bg-[#85b7eb] text-[#185fa5]"
                            )}>
                              {row.status}
                            </span>
                            {row.status === 'flagged' && (
                              expandedRow === row.id ? <ChevronUp className="w-4 h-4 text-black/40" /> : <ChevronDown className="w-4 h-4 text-black/40" />
                            )}
                          </div>
                        </button>

                        {/* Adjustment Entry Panel with Evidence */}
                        <AnimatePresence>
                          {expandedRow === row.id && row.status === 'flagged' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 bg-[#f0f4ff]/50 border-t border-[#185fa5]/20">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* Left: Variance Breakdown */}
                                  {row.evidence && (
                                    <div className="space-y-3">
                                      {/* Variance Breakdown Header */}
                                      <div className="text-sm font-medium text-black">Variance Breakdown</div>
                                      
                                      {/* System Comparison */}
                                      <div className="bg-white rounded-lg border border-black/10 p-3">
                                        <div className="space-y-2">
                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-black/60">{row.system === 'simphony' ? 'Simphony' : row.system === 'book4time' ? 'Book4Time' : 'Veezi'} Total</span>
                                            <span className="font-mono font-medium text-black">£{row.pos.toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-black/60">Opera Total</span>
                                            <span className="font-mono font-medium text-black">£{row.opera.toFixed(2)}</span>
                                          </div>
                                          <div className="border-t border-black/10 pt-2 flex justify-between items-center text-sm">
                                            <span className="text-black/60">Difference</span>
                                            <span className={cn(
                                              "font-mono font-medium px-2 py-0.5 rounded",
                                              row.suggestedReason === 'void' && "bg-[#185fa5]/10 text-[#185fa5]",
                                              row.suggestedReason === 'suspected-walkout' && "bg-[#f59e0b]/10 text-[#f59e0b]",
                                              row.suggestedReason === 'confirmed-walkout' && "bg-[#c45c5c]/10 text-[#c45c5c]",
                                              row.suggestedReason === 'integration-delay' && "bg-[#d4a53c]/10 text-[#d4a53c]",
                                            )}>
                                              £{row.variance?.toFixed(2)} not transferred
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Why It Didn't Transfer - Source Citation */}
                                      <div className="text-sm font-medium text-black">Why it didn&apos;t transfer</div>
                                      <div className={cn(
                                        "rounded-lg border-l-4 bg-white p-4",
                                        row.suggestedReason === 'void' && "border-l-[#185fa5]",
                                        row.suggestedReason === 'suspected-walkout' && "border-l-[#f59e0b]",
                                        row.suggestedReason === 'confirmed-walkout' && "border-l-[#c45c5c]",
                                        row.suggestedReason === 'integration-delay' && "border-l-[#d4a53c]",
                                      )}>
                                        {/* Source Label */}
                                        <div className="flex items-center gap-1.5 mb-2">
                                          <FileText className="w-3.5 h-3.5 text-black/40" />
                                          <span className="text-xs font-medium text-black/50 uppercase tracking-wide">
                                            {row.evidence.source}
                                          </span>
                                        </div>
                                        
                                        {/* Key Finding - quoted from the report */}
                                        <div className="text-sm text-black mb-2 font-mono bg-black/5 px-2 py-1 rounded inline-block">
                                          {row.suggestedReason === 'void' && (
                                            <span>{`"Type: VOID - £${row.variance?.toFixed(2)}"`}</span>
                                          )}
                                          {row.suggestedReason === 'suspected-walkout' && (
                                            <span>{`"Check #1847 - Status: OPEN"`}</span>
                                          )}
                                          {row.suggestedReason === 'confirmed-walkout' && (
                                            <span>{`"Tender Type: WALKOUT"`}</span>
                                          )}
                                          {row.suggestedReason === 'integration-delay' && (
                                            <span>{`"Sync Status: Pending"`}</span>
                                          )}
                                        </div>

                                        {/* Supporting Details */}
                                        <div className="space-y-1 text-xs text-black/60 mt-3">
                                          {row.evidence.details.map((detail, idx) => (
                                            <div key={idx}>• {detail}</div>
                                          ))}
                                        </div>

                                        {/* Explanation */}
                                        <div className={cn(
                                          "mt-3 pt-3 border-t text-xs",
                                          row.suggestedReason === 'void' && "border-[#185fa5]/20 text-[#185fa5]",
                                          row.suggestedReason === 'suspected-walkout' && "border-[#f59e0b]/20 text-[#f59e0b]",
                                          row.suggestedReason === 'confirmed-walkout' && "border-[#c45c5c]/20 text-[#c45c5c]",
                                          row.suggestedReason === 'integration-delay' && "border-[#d4a53c]/20 text-[#d4a53c]",
                                        )}>
                                          {row.suggestedReason === 'void' && "Voids are not posted to Opera."}
                                          {row.suggestedReason === 'suspected-walkout' && "Open checks without payment do not transfer until closed."}
                                          {row.suggestedReason === 'confirmed-walkout' && "Walkout tenders are flagged for manual review."}
                                          {row.suggestedReason === 'integration-delay' && "Transaction pending system sync."}
                                        </div>
                                      </div>

                                      {/* Investigation Note for Suspected Walkout */}
                                      {row.suggestedReason === 'suspected-walkout' && (
                                        <div className="flex items-start gap-2 p-3 bg-[#f59e0b]/5 rounded-lg border border-[#f59e0b]/20">
                                          <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                                          <div className="text-xs text-black/70">
                                            <span className="font-medium">Requires investigation:</span> Check was not closed by floor staff or floor manager. Confirm if guest left without paying.
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Right: Adjustment Entry */}
                                  <div className="space-y-4">
                                    <div className="text-sm font-medium text-[#185fa5]">Adjustment Entry</div>
                                    <div className="bg-white rounded-lg border border-[#185fa5]/20 p-3">
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                          <span className="text-black/50 text-xs">Transaction Code</span>
                                          <div className="font-mono text-black">{row.code}</div>
                                        </div>
                                        <div>
                                          <span className="text-black/50 text-xs">Amount</span>
                                          <div className="font-mono text-black">+£{row.variance?.toFixed(2)}</div>
                                        </div>
                                        <div>
                                          <span className="text-black/50 text-xs">Tender Type</span>
                                          <div className="text-black">{row.tenderType}</div>
                                        </div>
                                        <div>
                                          <span className="text-black/50 text-xs">Target</span>
                                          <div className="text-black">PM9004</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Supervisor Action */}
                                    <div>
                                      <label className="text-xs text-black/50 mb-1.5 block">Confirm or Override Reason</label>
                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          onClick={() => setResolutionNote('Void')}
                                          className={cn(
                                            "px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 border",
                                            resolutionNote === 'Void'
                                              ? "bg-[#185fa5] text-white border-[#185fa5]"
                                              : "bg-white text-black/60 border-black/10 hover:border-black/20 hover:bg-black/5"
                                          )}
                                        >
                                          <XCircle className="w-3.5 h-3.5" />
                                          Void
                                        </button>
                                        <button
                                          onClick={() => setResolutionNote('Walkout')}
                                          className={cn(
                                            "px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 border",
                                            resolutionNote === 'Walkout'
                                              ? "bg-[#185fa5] text-white border-[#185fa5]"
                                              : "bg-white text-black/60 border-black/10 hover:border-black/20 hover:bg-black/5"
                                          )}
                                        >
                                          <UserX className="w-3.5 h-3.5" />
                                          Walkout
                                        </button>
                                        <button
                                          onClick={() => setResolutionNote('Integration delay')}
                                          className={cn(
                                            "px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 border",
                                            resolutionNote === 'Integration delay'
                                              ? "bg-[#185fa5] text-white border-[#185fa5]"
                                              : "bg-white text-black/60 border-black/10 hover:border-black/20 hover:bg-black/5"
                                          )}
                                        >
                                          <Clock className="w-3.5 h-3.5" />
                                          Integration Delay
                                        </button>
                                        <button
                                          onClick={() => setResolutionNote('Escalate')}
                                          className={cn(
                                            "px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 border",
                                            resolutionNote === 'Escalate'
                                              ? "bg-[#185fa5] text-white border-[#185fa5]"
                                              : "bg-white text-black/60 border-black/10 hover:border-black/20 hover:bg-black/5"
                                          )}
                                        >
                                          <AlertTriangle className="w-3.5 h-3.5" />
                                          Escalate
                                        </button>
                                      </div>
                                    </div>

                                    {/* Post to Opera Button */}
                                    <Button
                                      size="sm"
                                      onClick={() => handleResolve(row.id)}
                                      className="w-full bg-[#185fa5] hover:bg-[#144d8a] text-white"
                                      disabled={!resolutionNote.trim()}
                                    >
                                      <Send className="w-4 h-4 mr-1" />
                                      Post to Opera
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
                  </>
                )}
                </>
                )}
              </motion.div>
            )}

            {/* MODULE 4: Reports */}
            {activeModule === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Report Header */}
                <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-black">Daily Operations Report</h2>
                      <p className="text-sm text-black/50">White City House • {dateStr}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Teams
                      </Button>
                    </div>
                  </div>

                  {/* Manager on Duty */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-black/10">
                    <span className="text-xs text-black/50">Manager on Duty:</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-[#f1efe8] px-2 py-1 rounded"><span className="text-black/50">AM</span> <span className="font-medium text-black">Mark</span></span>
                      <span className="text-xs bg-[#f1efe8] px-2 py-1 rounded"><span className="text-black/50">PM</span> <span className="font-medium text-black">Mark</span></span>
                      <span className="text-xs bg-[#185fa5]/10 px-2 py-1 rounded"><span className="text-black/50">Night</span> <span className="font-medium text-black">George</span></span>
                    </div>
                  </div>

                  {/* Reconciliation Status Badge */}
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-xl mb-4",
                    reconciliation.filter(r => r.status === 'flagged').length === 0
                      ? "bg-[#eaf3de] border border-[#4a9e6b]/30"
                      : "bg-[#fcebeb] border border-[#a32d2d]/30"
                  )}>
                    <div className="flex items-center gap-3">
                      {reconciliation.filter(r => r.status === 'flagged').length === 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-[#4a9e6b]" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-[#a32d2d]" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-black">
                          {reconciliation.filter(r => r.status === 'flagged').length === 0 
                            ? "Reconciliation Balanced" 
                            : `£${reconciliation.filter(r => r.status === 'flagged').reduce((sum, r) => sum + (r.variance || 0), 0).toFixed(2)} Unresolved Variance`
                          }
                        </div>
                        <div className="text-xs text-black/50">
                          {reconciliationMatched}/{reconciliation.length} tender types matched • Signed off by George at 23:58
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveModule('financial')}
                      className="text-xs text-black/60 hover:text-black underline"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-[#f1efe8] rounded-xl p-3">
                      <div className="text-xs text-black/50 mb-1">Total Revenue</div>
                      <div className="text-xl font-serif text-black">£27.3K</div>
                    </div>
                    <div className="bg-[#f1efe8] rounded-xl p-3">
                      <div className="text-xs text-black/50 mb-1">Occupancy</div>
                      <div className="text-xl font-serif text-black">74.4%</div>
                    </div>
                    <div className="bg-[#f1efe8] rounded-xl p-3">
                      <div className="text-xs text-black/50 mb-1">ADR</div>
                      <div className="text-xl font-serif text-black">£366.72</div>
                    </div>
                    <div className="bg-[#f1efe8] rounded-xl p-3">
                      <div className="text-xs text-black/50 mb-1">Room Revenue</div>
                      <div className="text-xl font-serif text-black">£10.6K</div>
                    </div>
                  </div>
                </div>

                {/* Reconciliation Summary */}
                <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                  <h3 className="font-medium text-black mb-4">Reconciliation Summary</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-0 text-sm">
                        <div className="flex justify-between py-2 border-b border-black/5">
                          <span className="text-black/60">Opera Expected Total</span>
                          <span className="font-medium text-black">£73,500.50</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-black/5">
                          <span className="text-black/60">POS/Systems Total</span>
                          <span className="font-medium text-black">£73,545.50</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-black/10 bg-[#f1efe8]/50 -mx-2 px-2">
                          <span className="font-medium text-black">Gross Variance</span>
                          <span className="font-medium text-[#a32d2d]">-£45.00</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-0 text-sm">
                        <div className="flex justify-between py-2 border-b border-black/5">
                          <span className="text-black/60 italic">Explained:</span>
                          <span></span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-black/5 pl-3">
                          <span className="text-black/60">Timing differences</span>
                          <span className="font-medium text-black">-£45.00</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-black/5 pl-3">
                          <span className="text-black/60">Voids</span>
                          <span className="font-medium text-black">£0.00</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-black/10 bg-[#eaf3de]/50 -mx-2 px-2">
                          <span className="font-medium text-black">Net Variance</span>
                          <span className="font-medium text-[#3b6d11]">£0.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#4a9e6b]" />
                        <span className="text-black/60">Adjustments posted to Opera</span>
                      </div>
                    </div>
                    <div className="text-black/50">
                      Sign-off: <span className="text-black font-medium">George Martinez</span> at 23:58
                    </div>
                  </div>
                </div>

                {/* People We Know */}
                <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                  <h3 className="font-medium text-black mb-4">People We Know</h3>
                  <p className="text-xs text-black/50 mb-4">Guests arriving tomorrow who need special attention</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#f1efe8]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#185fa5]/10 flex items-center justify-center text-xs font-medium text-[#185fa5]">VIP</div>
                        <div>
                          <div className="text-sm font-medium text-black">Sarah Mitchell</div>
                          <div className="text-xs text-black/50">Returning guest (12th stay) • Birthday tomorrow</div>
                        </div>
                      </div>
                      <div className="text-xs text-black/50">Room 204</div>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#f1efe8]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#d4855a]/10 flex items-center justify-center text-xs font-medium text-[#d4855a]">REQ</div>
                        <div>
                          <div className="text-sm font-medium text-black">James & Emily Roberts</div>
                          <div className="text-xs text-black/50">Anniversary dinner booked • Champagne on arrival requested</div>
                        </div>
                      </div>
                      <div className="text-xs text-black/50">Room 412</div>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#f1efe8]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4a9e6b]/10 flex items-center justify-center text-xs font-medium text-[#4a9e6b]">MBR</div>
                        <div>
                          <div className="text-sm font-medium text-black">David Chen</div>
                          <div className="text-xs text-black/50">Founding member • Dietary: Gluten-free</div>
                        </div>
                      </div>
                      <div className="text-xs text-black/50">Room 118</div>
                    </div>
                  </div>
                </div>

                {/* Occupancy Summary */}
                <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                  <h3 className="font-medium text-black mb-4">Occupancy Summary</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-black/50 mb-3 uppercase tracking-wide">Yesterday</div>
                      <div className="space-y-0 text-sm">
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Arrivals</span><span className="font-medium text-black">14</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Walk Ins</span><span className="font-medium text-black">-</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Departures</span><span className="font-medium text-black">15</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Early Departures</span><span className="font-medium text-black">-</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Occupied Rooms</span><span className="font-medium text-black">29</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">No Show</span><span className="font-medium text-black">-</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Occupancy %</span><span className="font-medium text-black">74.36%</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">ADR</span><span className="font-medium text-black">£366.72</span></div>
                        <div className="flex justify-between py-2"><span className="text-black/60">Room Revenue</span><span className="font-medium text-black">£10,634.97</span></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-black/50 mb-3 uppercase tracking-wide">Today (Forecast)</div>
                      <div className="space-y-0 text-sm">
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Arrivals</span><span className="font-medium text-black">15</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Departures</span><span className="font-medium text-black">15</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Rooms to Sell</span><span className="font-medium text-black">10</span></div>
                        <div className="flex justify-between py-2 border-b border-black/5"><span className="text-black/60">Occupancy %</span><span className="font-medium text-black">74.36%</span></div>
                        <div className="flex justify-between py-2"><span className="text-black/60">Current ADR</span><span className="font-medium text-black">£366.44</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Recap */}
                <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                  <h3 className="font-medium text-black mb-4">Sales Recap</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-black/10">
                          <th className="text-left py-2 text-black/50 font-medium">Department</th>
                          <th className="text-right py-2 text-black/50 font-medium">Actual</th>
                          <th className="text-right py-2 text-black/50 font-medium">Budget</th>
                          <th className="text-right py-2 text-black/50 font-medium">LY</th>
                          <th className="text-right py-2 text-black/50 font-medium">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-black/5">
                          <td className="py-2 text-black">Accommodation</td>
                          <td className="py-2 text-right font-medium">£10.6K</td>
                          <td className="py-2 text-right text-black/60">£8.9K</td>
                          <td className="py-2 text-right text-black/60">£9.3K</td>
                          <td className="py-2 text-right text-[#3b6d11] font-medium">+£1.7K</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="py-2 text-black">Restaurant</td>
                          <td className="py-2 text-right font-medium">£16.5K</td>
                          <td className="py-2 text-right text-black/60">£17.2K</td>
                          <td className="py-2 text-right text-black/60">£15K</td>
                          <td className="py-2 text-right text-[#a32d2d] font-medium">-£0.7K</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="py-2 text-black">Miscellaneous</td>
                          <td className="py-2 text-right font-medium">£0.2K</td>
                          <td className="py-2 text-right text-black/60">-</td>
                          <td className="py-2 text-right text-black/60">-</td>
                          <td className="py-2 text-right text-black/40">-</td>
                        </tr>
                        <tr className="bg-[#f1efe8]/50">
                          <td className="py-2 font-medium text-black">Total</td>
                          <td className="py-2 text-right font-medium">£27.3K</td>
                          <td className="py-2 text-right text-black/60">£26.1K</td>
                          <td className="py-2 text-right text-black/60">£24.3K</td>
                          <td className="py-2 text-right text-[#3b6d11] font-medium">+£1.2K</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Covers Recap */}
                <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-medium text-black">Covers Recap</h3>
                    <div className="text-xs text-black/40 text-right">
                      <span className="block">Daily = Today&apos;s covers | LY = Last Year same day</span>
                      <span className="block">WTD = Week to Date | WTD LY = Week to Date Last Year</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-black/10">
                          <th className="text-left py-2 text-black/50 font-medium">Day Part</th>
                          <th className="text-right py-2 text-black/50 font-medium">Daily</th>
                          <th className="text-right py-2 text-black/50 font-medium">LY</th>
                          <th className="text-right py-2 text-black/50 font-medium">WTD</th>
                          <th className="text-right py-2 text-black/50 font-medium">WTD LY</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-black/5">
                          <td className="py-2 text-black">Breakfast</td>
                          <td className="py-2 text-right font-medium">95</td>
                          <td className="py-2 text-right text-black/60">82</td>
                          <td className="py-2 text-right text-black/60">169</td>
                          <td className="py-2 text-right text-black/60">263</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="py-2 text-black">Lunch</td>
                          <td className="py-2 text-right font-medium">102</td>
                          <td className="py-2 text-right text-black/60">65</td>
                          <td className="py-2 text-right text-black/60">195</td>
                          <td className="py-2 text-right text-black/60">245</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="py-2 text-black">Afternoon Tea</td>
                          <td className="py-2 text-right font-medium">9</td>
                          <td className="py-2 text-right text-black/60">6</td>
                          <td className="py-2 text-right text-black/60">26</td>
                          <td className="py-2 text-right text-black/60">65</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="py-2 text-black">Dinner</td>
                          <td className="py-2 text-right font-medium">130</td>
                          <td className="py-2 text-right text-black/60">161</td>
                          <td className="py-2 text-right text-black/60">230</td>
                          <td className="py-2 text-right text-black/60">399</td>
                        </tr>
                        <tr className="bg-[#f1efe8]/50">
                          <td className="py-2 font-medium text-black">Total</td>
                          <td className="py-2 text-right font-medium">336</td>
                          <td className="py-2 text-right text-black/60">314</td>
                          <td className="py-2 text-right text-black/60">620</td>
                          <td className="py-2 text-right text-black/60">972</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Revenue Protection: Comps, Voids & Staff Allowance */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/60 border border-black/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-black">Comps & Discounts</h3>
                      <span className="text-sm font-medium text-black">£442.58</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/60">Bad Management Food 100%</span>
                        <span className="font-medium">£105.50</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/60">Staff Discount Food 50%</span>
                        <span className="font-medium">£91.50</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/60">Goodwill Bev 100%</span>
                        <span className="font-medium">£65.00</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/60">Member Cowshed 25%</span>
                        <span className="font-medium">£51.50</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-black/60">Other</span>
                        <span className="font-medium">£129.08</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 border border-black/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-black">Voids</h3>
                      <span className="text-sm font-medium text-[#a32d2d]">£409.57</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/60 font-mono text-xs">#11660</span>
                        <span className="text-black/60">V4 Out of Stock</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/60 font-mono text-xs">#11610</span>
                        <span className="text-black/60">V4 Out of Stock</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-black/5">
                        <span className="text-black/60 font-mono text-xs">#11554</span>
                        <span className="text-black/60">V2 Input Error</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-black/60 font-mono text-xs">#11667</span>
                        <span className="text-black/60">V2 Input Error</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 border border-black/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-black">Staff Food Allowance</h3>
                      <span className="text-xs text-black/50">£8/day limit</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center py-1 border-b border-black/5">
                        <div>
                          <span className="text-black">J. Thompson</span>
                          <span className="text-black/40 ml-2 text-xs">Kitchen</span>
                        </div>
                        <span className="font-medium text-[#a32d2d]">£14.50</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-black/5">
                        <div>
                          <span className="text-black">M. Garcia</span>
                          <span className="text-black/40 ml-2 text-xs">Front Desk</span>
                        </div>
                        <span className="font-medium text-[#a32d2d]">£12.00</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <div>
                          <span className="text-black">S. Williams</span>
                          <span className="text-black/40 ml-2 text-xs">Bar</span>
                        </div>
                        <span className="font-medium text-[#d4855a]">£9.25</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-black/10 text-xs text-[#a32d2d]">
                      3 staff exceeded daily allowance
                    </div>
                  </div>
                </div>

                {/* AI-Generated Insights */}
                <div className="bg-[#f0f4ff]/50 border border-[#185fa5]/20 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#185fa5]" />
                    <h3 className="font-medium text-black">Summary</h3>
                  </div>
                  <div className="space-y-2 text-sm text-black/80">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4a9e6b] mt-0.5 shrink-0" />
                      <span>Total revenue £27.3K - ahead of budget by £1.2K (+4.6%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4a9e6b] mt-0.5 shrink-0" />
                      <span>Accommodation outperformed budget by £1.7K</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#d4855a] mt-0.5 shrink-0" />
                      <span>Restaurant £0.7K below budget - dinner covers down vs LY</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4a9e6b] mt-0.5 shrink-0" />
                      <span>{reconciliation.filter(r => r.status === 'matched').length} of {reconciliation.length} tender types matched across {connectedSystems.length} systems</span>
                    </div>
                    {reconciliation.filter(r => r.status === 'flagged').length > 0 && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#d4855a] mt-0.5 shrink-0" />
                        <span>{reconciliation.filter(r => r.status === 'flagged').length} variance{reconciliation.filter(r => r.status === 'flagged').length > 1 ? 's' : ''} flagged for review</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reconciliation Details */}
                {(reconciliation.some(r => r.status === 'flagged') || reconciliation.some(r => r.status === 'resolved')) && (
                  <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                    <h3 className="font-medium text-black mb-4">Variances & Resolutions</h3>
                    <div className="space-y-3">
                      {reconciliation.filter(r => r.status === 'resolved').map(row => (
                        <div key={row.id} className="flex items-start gap-3 py-2 border-b border-black/5 last:border-0">
                          <CheckCircle2 className="w-4 h-4 text-[#4a9e6b] mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-black">
                              <span className="font-medium">{row.tenderType}</span>
                              <span className="text-black/50 ml-2">
                                {row.system === 'simphony' ? 'Simphony' : row.system === 'book4time' ? 'Book4Time' : 'Veezi'}
                              </span>
                            </div>
                            <div className="text-xs text-black/50">
                              £{row.variance?.toFixed(2)} variance • {row.resolution} • Posted to {row.code}
                            </div>
                          </div>
                          <span className="text-xs bg-[#eaf3de] text-[#3b6d11] px-2 py-1 rounded-full">Resolved</span>
                        </div>
                      ))}
                      {reconciliation.filter(r => r.status === 'flagged').map(row => (
                        <div key={row.id} className="flex items-start gap-3 py-2 border-b border-black/5 last:border-0">
                          <AlertTriangle className="w-4 h-4 text-[#d4855a] mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-black">
                              <span className="font-medium">{row.tenderType}</span>
                              <span className="text-black/50 ml-2">
                                {row.system === 'simphony' ? 'Simphony' : row.system === 'book4time' ? 'Book4Time' : 'Veezi'}
                              </span>
                            </div>
                            <div className="text-xs text-black/50">
                              £{row.variance?.toFixed(2)} variance • Pending review
                            </div>
                          </div>
                          <span className="text-xs bg-[#fcebeb] text-[#a32d2d] px-2 py-1 rounded-full">Flagged</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Daily Summary Narrative - AI Generated from WhatsApp */}
                <div className="bg-white/60 border border-black/10 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-black">Daily Summary</h3>
                    <div className="flex gap-1">
                      {[
                        { id: 'restaurant', label: 'Restaurant' },
                        { id: 'bar', label: 'Bar' },
                        { id: 'cafe', label: 'Cafe' },
                        { id: 'healthclub', label: 'Healthclub' },
                        { id: 'cinema', label: 'Cinema' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSummaryOutlet(tab.id as typeof summaryOutlet)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            summaryOutlet === tab.id
                              ? "bg-[#1a1a1a] text-white"
                              : "bg-white/60 text-black/60 hover:bg-white/80"
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-xs text-black/40">
                    <Sparkles className="w-3 h-3" />
                    <span>Summarised by AI from WhatsApp group messages</span>
                  </div>
                  
                  {summaryOutlet === 'restaurant' && (
                    <div className="space-y-4 text-sm text-black/80 leading-relaxed">
                      <div>
                        <span className="font-medium text-black">AM:</span> A lively breakfast, starting with 74 covers set to arrive mostly between 08:00 and 08:30. Managed to pick up 30 walk-ins, creating a lively and constant flow of service until the end of the morning. Lunch started similarly with most bookings arriving at the beginning of service, but would begin to quieten down with arrivals after 13:00.
                      </div>
                      <div>
                        <span className="font-medium text-black">PM:</span> We started the night with 87 bookings and finished the day with 130 guests joining us for dinner. The restaurant was full between 19:00 and 20:30, we had lots of large tables. Terrace and bar were full the whole evening for some bites and drinks, creating a lively atmosphere. We received good feedback on food, drinks and service. Overall a busy Thursday night.
                      </div>
                    </div>
                  )}
                  
                  {summaryOutlet === 'bar' && (
                    <div className="space-y-4 text-sm text-black/80 leading-relaxed">
                      <div>
                        <span className="font-medium text-black">AM:</span> Quiet morning with minimal foot traffic. Prepared for afternoon service with full stock check completed.
                      </div>
                      <div>
                        <span className="font-medium text-black">PM:</span> Busy evening with 85 guests throughout the night. Cocktail specials were popular. The terrace was fully occupied from 18:00 onwards. Good atmosphere and positive feedback on the new menu items. Closed on time with no incidents.
                      </div>
                    </div>
                  )}
                  
                  {summaryOutlet === 'healthclub' && (
                    <div className="space-y-4 text-sm text-black/80 leading-relaxed">
                      <div>
                        <span className="font-medium text-black">AM:</span> Peak gym usage 06:30-08:30 with 34 members. All equipment operational. PT sessions fully booked. Pool area steady throughout morning.
                      </div>
                      <div>
                        <span className="font-medium text-black">PM:</span> Steady traffic throughout evening. Yoga class at 18:00 had 15 attendees. Spa treatments fully booked with £245 in retail product sales. Equipment maintenance scheduled for next week flagged for treadmill #3.
                      </div>
                    </div>
                  )}
                  
                  {summaryOutlet === 'cinema' && (
                    <div className="space-y-4 text-sm text-black/80 leading-relaxed">
                      <div>
                        <span className="font-medium text-black">Afternoon:</span> Matinee showing at 14:00 had 45 attendees (72% capacity). Concession sales strong at £6.20 per head.
                      </div>
                      <div>
                        <span className="font-medium text-black">Evening:</span> Two evening showings both near capacity. 19:00 showing sold out, 21:30 showing at 85%. Private screening for member event in Screen 2 went smoothly. Total attendance 156 across all showings.
                      </div>
                    </div>
                  )}
                  
                  {summaryOutlet === 'cafe' && (
                    <div className="space-y-4 text-sm text-black/80 leading-relaxed">
                      <div>
                        <span className="font-medium text-black">AM:</span> Steady morning with coffee sales up 15% vs last week. Pastry delivery arrived on time. 156 transactions before noon.
                      </div>
                      <div>
                        <span className="font-medium text-black">PM:</span> Afternoon tea service popular with 24 covers. Light evening service, closed at 20:00 as scheduled. Stock levels good for tomorrow.
                      </div>
                    </div>
                  )}
                </div>

                {/* Distribution */}
                <div className="bg-white/60 border border-black/10 rounded-xl p-6">
                  <h3 className="font-medium text-black mb-4">Distribute Report</h3>
                  <div className="space-y-3">
                    {[
                      { role: 'General Manager', email: 'gm@whitecityhouse.com', default: true },
                      { role: 'Finance Director', email: 'finance@sohohouse.com', default: true },
                      { role: 'Operations Lead', email: 'ops@whitecityhouse.com', default: false },
                    ].map((recipient) => (
                      <label key={recipient.email} className="flex items-center gap-3 p-3 rounded-lg border border-black/10 hover:bg-black/5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={recipient.default}
                          className="w-4 h-4 rounded border-black/30"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-black">{recipient.role}</div>
                          <div className="text-xs text-black/50">{recipient.email}</div>
                        </div>
                        <Mail className="w-4 h-4 text-black/30" />
                      </label>
                    ))}
                  </div>

                  <Button className="w-full mt-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-6">
                    <Send className="w-4 h-4 mr-2" />
                    Send Daily Operations Report
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
