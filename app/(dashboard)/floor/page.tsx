"use client"

import { useState, useEffect } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { AlertStrip } from '@/components/house-os/alert-strip'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  PoundSterling,
  Trash2,
  TrendingDown,
  Building2,
  ChevronDown,
  Eye,
  Activity,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

type ShrinkType = 'damaged' | 'theft' | 'wastage' | 'mispick' | 'void'

interface ShrinkEvent {
  id: number
  time: string
  store: string
  category: string
  amount: number
  type: ShrinkType
  note: string
}

const initialEvents: ShrinkEvent[] = [
  { id: 1,  time: '14:32', store: "Sainsbury's Whitechapel",          category: 'Fresh meat',  amount: 184, type: 'wastage',  note: 'TTD beef joint date-expired — 6 packs written off' },
  { id: 2,  time: '14:28', store: "Sainsbury's Nine Elms",            category: 'POS exception', amount: 92,  type: 'void',     note: 'Self-checkout suspended scan — items unbagged' },
  { id: 3,  time: '14:21', store: "Sainsbury's Whitechapel",          category: 'Beers/Wines', amount: 312, type: 'theft',    note: '4 spirits walked from aisle 6 — CCTV reviewed' },
  { id: 4,  time: '14:18', store: "Sainsbury's Cromwell Road",        category: 'Bakery',      amount: 64,  type: 'wastage',  note: 'In-store bakery batch over-produced — donated to FareShare' },
  { id: 5,  time: '14:12', store: "Sainsbury's Potters Bar",          category: 'Produce',     amount: 78,  type: 'damaged',  note: 'Berries crushed in trolley — full case binned' },
  { id: 6,  time: '14:08', store: 'Argos Stratford (in-store)',       category: 'GM',          amount: 248, type: 'mispick',  note: 'Click & collect — wrong SKU dispatched' },
  { id: 7,  time: '14:02', store: "Sainsbury's Fulham Wharf",         category: 'Dairy',       amount: 41,  type: 'wastage',  note: 'Yoghurt date-expired — 12 pots' },
  { id: 8,  time: '13:55', store: "Sainsbury's Whitechapel",          category: 'POS exception', amount: 28,  type: 'void',     note: 'Cashier-led void: customer changed mind' },
  { id: 9,  time: '13:48', store: "Sainsbury's Brighton Marina",      category: 'Fresh fish',  amount: 156, type: 'wastage',  note: 'Counter offcuts written off end-of-shift' },
  { id: 10, time: '13:42', store: "Sainsbury's Whitechapel",          category: 'Confectionery', amount: 64,  type: 'theft',    note: 'High-value chocolate display short by 8 units' },
  { id: 11, time: '13:35', store: "Sainsbury's Local King's Cross",   category: 'Food-to-go',  amount: 36,  type: 'wastage',  note: 'Sandwiches expiring 14:00 — reduced then binned' },
  { id: 12, time: '13:28', store: "Sainsbury's Nine Elms",            category: 'Produce',     amount: 52,  type: 'damaged',  note: 'Pallet drop in goods-in — peppers' },
]

const newEventTemplates: Omit<ShrinkEvent, 'id' | 'time'>[] = [
  { store: "Sainsbury's Whitechapel",        category: 'Fresh meat',     amount: 142, type: 'wastage', note: 'TTD lamb mince — 4 trays over date' },
  { store: "Sainsbury's Nine Elms",          category: 'Beers/Wines',    amount: 96,  type: 'theft',   note: '2 bottles of premium gin — high-loss SKU' },
  { store: "Sainsbury's Cromwell Road",      category: 'Bakery',         amount: 38,  type: 'wastage', note: 'Tiger bread end-of-day' },
  { store: "Sainsbury's Potters Bar",        category: 'Produce',        amount: 64,  type: 'damaged', note: 'Avocado crate dropped at backdoor' },
  { store: "Argos Stratford (in-store)",     category: 'GM',             amount: 198, type: 'mispick', note: 'Wrong colour Tu jeans dispatched' },
  { store: "Sainsbury's Whitechapel",        category: 'POS exception', amount: 18,  type: 'void',    note: 'Self-checkout intervention required' },
]

// 14-day shrink trend by category (£k per day)
const shrinkTrend = Array.from({ length: 14 }, (_, i) => {
  const dayLabel = `Apr ${17 + i}`
  return {
    day: dayLabel,
    damaged: 18 + Math.round(Math.random() * 6),
    theft:   24 + Math.round(Math.random() * 8),
    wastage: 42 + Math.round(Math.random() * 12),
    mispick:  9 + Math.round(Math.random() * 4),
  }
})

const topLossStores = [
  { store: "Sainsbury's Whitechapel",   shrink: 8420, pctRevenue: 0.92 },
  { store: "Sainsbury's Nine Elms",     shrink: 6280, pctRevenue: 0.34 },
  { store: "Sainsbury's Brighton Marina", shrink: 3140, pctRevenue: 0.40 },
  { store: "Sainsbury's Cromwell Road", shrink: 2890, pctRevenue: 0.23 },
  { store: "Sainsbury's Potters Bar",   shrink: 2410, pctRevenue: 0.17 },
]

export default function ShrinkageDashboard() {
  const [events, setEvents] = useState<ShrinkEvent[]>(initialEvents)
  const [filterStore, setFilterStore] = useState<string>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const stores = ['all', ...Array.from(new Set(initialEvents.map(e => e.store)))]

  // Live tick — append a new event every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      const tpl = newEventTemplates[Math.floor(Math.random() * newEventTemplates.length)]
      const now = new Date()
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      const newEvt: ShrinkEvent = { id: Date.now(), time, ...tpl }
      setEvents((prev) => [newEvt, ...prev.slice(0, 19)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  const filteredEvents = filterStore === 'all'
    ? events
    : events.filter(e => e.store === filterStore)

  // KPI numbers — group level
  const todayShrink   = 142800   // £142.8k group shrink today
  const todayWastage  = 86200    // of which £86.2k is wastage
  const groupRevenue  = 87_700_000
  const pctOfRevenue  = ((todayShrink / groupRevenue) * 100).toFixed(2)
  const topCategory   = 'Fresh meat & poultry'
  const topLossStore  = "Sainsbury's Whitechapel"

  const typeBadge = (type: ShrinkType) => {
    switch (type) {
      case 'damaged': return <StatusBadge variant="amber">Damaged</StatusBadge>
      case 'theft':   return <StatusBadge variant="red">Theft suspected</StatusBadge>
      case 'wastage': return <StatusBadge variant="gold">Wastage</StatusBadge>
      case 'mispick': return <StatusBadge variant="blue">Mis-pick</StatusBadge>
      case 'void':    return <StatusBadge variant="ghost">POS Void</StatusBadge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-2xl text-text">Shrinkage & Wastage</h1>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border rounded-lg hover:bg-surface-3 transition-colors"
              >
                <Building2 className="w-4 h-4 text-gold" />
                <span className="text-sm text-text">
                  {filterStore === 'all' ? 'All stores' : filterStore}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-surface-1 border border-border rounded-xl shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                  {stores.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setFilterStore(s)
                        setIsDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-surface-2 transition-colors",
                        filterStore === s ? "text-gold bg-gold/10" : "text-text"
                      )}
                    >
                      {s === 'all' ? 'All stores' : s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-text-muted">
            Live POS exceptions, voids, and wastage write-offs · Priya Shah (Whitechapel) reviewing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge variant="blue" className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
            Live Feed Active
          </StatusBadge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Shrinkage Today"
          icon={<TrendingDown className="w-3.5 h-3.5" />}
          value={formatCurrency(todayShrink)}
          label="Group total · across 600 stores"
          delta={{ direction: 'down', value: '-8.2%', label: 'WoW' }}
        />
        <KPICard
          title="Wastage Today"
          icon={<Trash2 className="w-3.5 h-3.5" />}
          value={formatCurrency(todayWastage)}
          label="Fresh & food-to-go"
          delta={{ direction: 'down', value: '-12%', label: 'WoW' }}
        />
        <KPICard
          title="% of Revenue"
          icon={<PoundSterling className="w-3.5 h-3.5" />}
          value={`${pctOfRevenue}%`}
          label="Group blended shrink rate"
          delta={{ direction: 'down', value: '-0.04pts', label: 'YoY' }}
        />
        <KPICard
          title="Top Loss Category"
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          value={topCategory}
          label="38% of today's shrink £"
        />
        <KPICard
          title="Top Loss Store"
          icon={<Building2 className="w-3.5 h-3.5" />}
          value="Whitechapel"
          label={`${formatCurrency(8420)} today · 0.92% of revenue`}
        />
      </div>

      {/* Trend chart + top stores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-1 border border-border rounded-2xl p-5">
          <h3 className="font-serif text-lg text-text mb-4">Shrinkage by Category — 14 Days (£k)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shrinkTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#8a8278" fontSize={11} />
                <YAxis stroke="#8a8278" fontSize={11} tickFormatter={(v) => `£${v}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1815',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`£${value}k`, '']}
                />
                <Legend />
                <Bar dataKey="damaged" stackId="a" name="Damaged"        fill="#d4855a" />
                <Bar dataKey="theft"   stackId="a" name="Theft suspected" fill="#c44a4a" />
                <Bar dataKey="wastage" stackId="a" name="Wastage"        fill="#c9a84c" />
                <Bar dataKey="mispick" stackId="a" name="Mis-pick"       fill="#5a87c4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-1 border border-border rounded-2xl p-5">
          <h3 className="font-serif text-lg text-text mb-4">Top 5 Stores Today</h3>
          <div className="space-y-3">
            {topLossStores.map((row, i) => (
              <div key={row.store} className="p-3 rounded-lg bg-surface-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-text font-medium">
                    <span className="text-text-faint mr-2">#{i + 1}</span>
                    {row.store.replace("Sainsbury's ", "")}
                  </p>
                  <span className="text-sm text-amber tabular-nums font-medium">
                    {formatCurrency(row.shrink)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber"
                      style={{ width: `${(row.pctRevenue / 1.0) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-muted tabular-nums">{row.pctRevenue}% rev</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drill-down callout */}
      <AlertStrip
        variant="warning"
        title={`Whitechapel — high-shrink alert: ${formatCurrency(8420)} today (0.92% of revenue)`}
        description="Argos AI has flagged Beers/Wines aisle 6 with theft pattern across 4 days. Suggest moving high-loss SKUs behind kiosk and tasking colleague hourly walk-arounds."
        action={
          <Button size="sm" className="bg-gold hover:bg-gold/90 text-background">
            <Eye className="w-3 h-3 mr-2" />
            View Whitechapel Detail
          </Button>
        }
      />

      {/* Live feed */}
      <div className="bg-surface-1 border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green" />
            <h3 className="font-serif text-lg text-text">Live Shrink Feed</h3>
          </div>
          <span className="text-xs text-text-faint">Auto-updates every 5s · POS, voids, wastage write-offs</span>
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg border transition-all",
                evt.type === 'theft'   && "bg-red/5 border-red/15",
                evt.type === 'wastage' && "bg-gold/5 border-gold/15",
                evt.type === 'damaged' && "bg-amber/5 border-amber/15",
                evt.type === 'mispick' && "bg-blue/5 border-blue/15",
                evt.type === 'void'    && "bg-surface-2 border-border",
              )}
            >
              <span className="text-xs text-text-faint tabular-nums w-12">{evt.time}</span>
              <div className="w-40 flex-shrink-0">
                <p className="text-sm text-text">{evt.store.replace("Sainsbury's ", "")}</p>
                <p className="text-xs text-text-muted">{evt.category}</p>
              </div>
              <p className="text-sm text-text-muted flex-1 italic truncate">&ldquo;{evt.note}&rdquo;</p>
              <span className={cn(
                "text-sm tabular-nums font-medium",
                evt.type === 'theft'   ? "text-red"   :
                evt.type === 'wastage' ? "text-gold"  :
                evt.type === 'damaged' ? "text-amber" :
                evt.type === 'mispick' ? "text-blue"  : "text-text-muted"
              )}>
                {formatCurrency(evt.amount)}
              </span>
              <div className="w-32 flex-shrink-0 flex justify-end">{typeBadge(evt.type)}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-faint mt-4">
          Events flow from POS / Tellermate, store wastage write-offs, and Argos in-store collection mis-picks. Priya&apos;s team triages anything above £100 within 15 minutes.
        </p>
      </div>
    </div>
  )
}
