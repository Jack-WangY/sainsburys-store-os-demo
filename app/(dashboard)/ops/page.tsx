"use client"

import { useState } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { AlertStrip } from '@/components/house-os/alert-strip'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PoundSterling,
  TrendingUp,
  Download,
  Share2,
  ArrowRight,
  Filter,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts'

// 3-way match status types
type MatchStatus = 'matched' | 'variance' | 'pending' | 'held'

interface Invoice {
  id: string
  supplier: string
  invoice: number
  po: number
  grn: number
  variance: number
  status: MatchStatus
  ageDays: number
  category: string
}

const recentInvoices: Invoice[] = [
  { id: 'BRT-99412', supplier: 'Britvic',                  invoice: 184200, po: 179800, grn: 184200, variance: 4400,   status: 'variance',  ageDays: 3, category: 'Soft drinks' },
  { id: 'CCE-77185', supplier: 'Coca-Cola Enterprises',    invoice: 412600, po: 412600, grn: 412600, variance: 0,      status: 'matched',   ageDays: 1, category: 'Soft drinks' },
  { id: 'CRA-50028', supplier: 'Cranswick',                invoice: 286400, po: 286400, grn: 285800, variance: -600,   status: 'matched',   ageDays: 1, category: 'Fresh meat' },
  { id: 'ABF-66291', supplier: 'ABF (Allied Bakeries)',    invoice: 158700, po: 156000, grn: 156000, variance: 2700,   status: 'variance',  ageDays: 2, category: 'Bakery' },
  { id: 'MUL-33408', supplier: 'Müller UK',                invoice: 224900, po: 224900, grn: 224900, variance: 0,      status: 'matched',   ageDays: 1, category: 'Dairy' },
  { id: 'NES-81170', supplier: 'Nestlé UK',                invoice: 318200, po: 318200, grn: 312800, variance: -5400,  status: 'held',      ageDays: 4, category: 'Confectionery' },
  { id: '2SF-44712', supplier: '2 Sisters Food Group',     invoice: 196800, po: 196800, grn: 196800, variance: 0,      status: 'matched',   ageDays: 1, category: 'Poultry' },
  { id: 'GRC-58820', supplier: 'Greencore',                invoice: 142100, po: 138400, grn: 138400, variance: 3700,   status: 'variance',  ageDays: 2, category: 'Food-to-go' },
  { id: 'BAK-71294', supplier: 'Bakkavor',                 invoice: 261400, po: 261400, grn: 261400, variance: 0,      status: 'matched',   ageDays: 1, category: 'Chilled prepared' },
  { id: 'HFG-62047', supplier: 'Hilton Food Group',        invoice: 384200, po: 384200, grn: 380900, variance: -3300,  status: 'pending',   ageDays: 1, category: 'Fresh meat' },
  { id: 'MUL-33502', supplier: 'Müller UK',                invoice: 88400,  po: 88400,  grn: 88400,  variance: 0,      status: 'matched',   ageDays: 1, category: 'Dairy' },
  { id: 'CCE-77204', supplier: 'Coca-Cola Enterprises',    invoice: 96200,  po: 96200,  grn: 96200,  variance: 0,      status: 'matched',   ageDays: 1, category: 'Soft drinks' },
]

// 14-day auto-match % trend
const autoMatchTrend = [
  { day: 'Apr 17', pct: 78 },
  { day: 'Apr 18', pct: 79 },
  { day: 'Apr 19', pct: 81 },
  { day: 'Apr 20', pct: 82 },
  { day: 'Apr 21', pct: 81 },
  { day: 'Apr 22', pct: 84 },
  { day: 'Apr 23', pct: 85 },
  { day: 'Apr 24', pct: 86 },
  { day: 'Apr 25', pct: 88 },
  { day: 'Apr 26', pct: 89 },
  { day: 'Apr 27', pct: 90 },
  { day: 'Apr 28', pct: 91 },
  { day: 'Apr 29', pct: 92 },
  { day: 'Apr 30', pct: 93 },
]

// Top exception suppliers
const exceptionSuppliers = [
  { supplier: 'Nestlé UK',    open: 3, value: 18600 },
  { supplier: 'Britvic',      open: 2, value: 9800  },
  { supplier: 'Greencore',    open: 2, value: 7200  },
  { supplier: 'ABF Bakeries', open: 1, value: 2700  },
  { supplier: 'Hilton Food',  open: 1, value: 3300  },
]

export default function InvoiceMatchDashboard() {
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all')

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  const filteredInvoices = statusFilter === 'all'
    ? recentInvoices
    : recentInvoices.filter(i => i.status === statusFilter)

  const totalToday        = 4218 // total invoices today across estate
  const autoMatched       = 3923
  const heldExceptions    = 142
  const slaBreaches       = 38
  const autoMatchPct      = Math.round((autoMatched / totalToday) * 1000) / 10
  const trappedCapital    = 4_240_000 // £4.24M working capital trapped in exceptions

  const statusBadge = (status: MatchStatus) => {
    switch (status) {
      case 'matched':  return <StatusBadge variant="green" icon={<CheckCircle2 className="w-3 h-3" />}>Auto-matched</StatusBadge>
      case 'variance': return <StatusBadge variant="amber" icon={<AlertTriangle className="w-3 h-3" />}>Variance</StatusBadge>
      case 'pending':  return <StatusBadge variant="blue"  icon={<Clock className="w-3 h-3" />}>Pending GRN</StatusBadge>
      case 'held':     return <StatusBadge variant="red"   icon={<AlertTriangle className="w-3 h-3" />}>Held</StatusBadge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.07)]">
        <div>
          <h1 className="font-serif text-2xl text-text">Invoice → PO → GRN — 3-Way Match</h1>
          <p className="text-sm text-text-muted mt-1">
            Argos AI automated 3-way match · trading day {new Date().toLocaleDateString('en-GB')} · feeding SAP S/4 HANA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge variant="green" icon={<CheckCircle2 className="w-3 h-3" />}>
            SAP Posting Live
          </StatusBadge>
          <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
            <Share2 className="w-4 h-4 mr-2" />
            Distribute
          </Button>
          <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Invoices Today"
          icon={<FileText className="w-3.5 h-3.5" />}
          value={totalToday.toLocaleString()}
          label="Across all suppliers"
          delta={{ direction: 'up', value: '6.2%', label: 'vs LY' }}
        />
        <KPICard
          title="Auto-matched"
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          value={`${autoMatchPct}%`}
          label={`${autoMatched.toLocaleString()} of ${totalToday.toLocaleString()}`}
          delta={{ direction: 'up', value: '+15pts', label: '90-day' }}
        />
        <KPICard
          title="Held in Exception"
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          value={heldExceptions.toString()}
          label="Awaiting human review"
          delta={{ direction: 'down', value: '-22%', label: 'WoW' }}
        />
        <KPICard
          title="Working Capital Trapped"
          icon={<PoundSterling className="w-3.5 h-3.5" />}
          value="£4.24M"
          label="In open variance queue"
          delta={{ direction: 'down', value: '-£1.6M', label: 'vs Mar' }}
        />
        <KPICard
          title="SLA Breaches"
          icon={<Clock className="w-3.5 h-3.5" />}
          value={slaBreaches.toString()}
          label=">3 days unresolved"
        />
      </div>

      {/* Trend chart + exception drill-down */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-text">Auto-Match % — 14-Day Trend</h3>
            <StatusBadge variant="green" icon={<TrendingUp className="w-3 h-3" />}>
              +15pts since rollout
            </StatusBadge>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={autoMatchTrend}>
                <defs>
                  <linearGradient id="matchGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#8a8278" fontSize={11} />
                <YAxis stroke="#8a8278" fontSize={11} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1815',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Auto-matched']}
                />
                <Area type="monotone" dataKey="pct" stroke="#c9a84c" strokeWidth={2} fill="url(#matchGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-text">Top Exception Suppliers</h3>
            <StatusBadge variant="amber">{exceptionSuppliers.reduce((s, r) => s + r.open, 0)} open</StatusBadge>
          </div>
          <div className="space-y-3">
            {exceptionSuppliers.map((row) => (
              <div key={row.supplier} className="flex items-center justify-between p-3 rounded-lg bg-surface-2">
                <div>
                  <p className="text-sm text-text font-medium">{row.supplier}</p>
                  <p className="text-xs text-text-muted">{row.open} open · {formatCurrency(row.value)} variance</p>
                </div>
                <Button size="sm" variant="outline" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
                  Drill in
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exception drill-down callout */}
      <AlertStrip
        variant="warning"
        title={`${heldExceptions} invoices held — £${(trappedCapital / 1_000_000).toFixed(2)}M working capital trapped`}
        description="Argos AI has clustered these into 12 root-cause groups. The Britvic 3-way variance pattern accounts for £1.1M alone — recurring price-list mismatch on multipack SKUs. Open the exception workbench to bulk-resolve."
        action={
          <Button size="sm" className="bg-gold hover:bg-gold/90 text-background">
            Open Exception Workbench
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        }
      />

      {/* Recent invoices table */}
      <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-text">Recent Invoices — 3-Way Match</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            {(['all', 'matched', 'variance', 'pending', 'held'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1 text-xs rounded-lg border transition-colors",
                  statusFilter === s
                    ? "bg-gold/20 text-gold border-gold/30"
                    : "bg-surface-2 text-text-muted border-[rgba(255,255,255,0.07)] hover:bg-surface-3"
                )}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="text-left uppercase-label text-text-faint py-3 px-2">Invoice #</th>
                <th className="text-left uppercase-label text-text-faint py-3 px-2">Supplier</th>
                <th className="text-left uppercase-label text-text-faint py-3 px-2">Category</th>
                <th className="text-right uppercase-label text-text-faint py-3 px-2">Invoice £</th>
                <th className="text-right uppercase-label text-text-faint py-3 px-2">PO £</th>
                <th className="text-right uppercase-label text-text-faint py-3 px-2">GRN £</th>
                <th className="text-right uppercase-label text-text-faint py-3 px-2">Variance</th>
                <th className="text-center uppercase-label text-text-faint py-3 px-2">Status</th>
                <th className="text-right uppercase-label text-text-faint py-3 px-2">Age</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((row) => (
                <tr key={row.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-surface-2 transition-colors">
                  <td className="py-2.5 px-2 text-sm text-text font-medium tabular-nums">{row.id}</td>
                  <td className="py-2.5 px-2 text-sm text-text">{row.supplier}</td>
                  <td className="py-2.5 px-2 text-xs text-text-muted">{row.category}</td>
                  <td className="py-2.5 px-2 text-sm text-text text-right tabular-nums">{formatCurrency(row.invoice)}</td>
                  <td className="py-2.5 px-2 text-sm text-text-muted text-right tabular-nums">{formatCurrency(row.po)}</td>
                  <td className="py-2.5 px-2 text-sm text-text-muted text-right tabular-nums">{formatCurrency(row.grn)}</td>
                  <td className={cn(
                    "py-2.5 px-2 text-sm text-right tabular-nums font-medium",
                    row.variance === 0 ? "text-text-muted" : row.variance > 0 ? "text-amber" : "text-red"
                  )}>
                    {row.variance === 0 ? '—' : `${row.variance > 0 ? '+' : ''}${formatCurrency(row.variance)}`}
                  </td>
                  <td className="py-2.5 px-2 text-center">{statusBadge(row.status)}</td>
                  <td className="py-2.5 px-2 text-sm text-text-faint text-right tabular-nums">
                    {row.ageDays}d
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-2">
                <td colSpan={3} className="py-3 px-2 text-sm text-text font-medium">
                  Showing {filteredInvoices.length} of {recentInvoices.length}
                </td>
                <td className="py-3 px-2 text-sm text-text text-right tabular-nums font-medium">
                  {formatCurrency(filteredInvoices.reduce((s, r) => s + r.invoice, 0))}
                </td>
                <td className="py-3 px-2 text-sm text-text-muted text-right tabular-nums">
                  {formatCurrency(filteredInvoices.reduce((s, r) => s + r.po, 0))}
                </td>
                <td className="py-3 px-2 text-sm text-text-muted text-right tabular-nums">
                  {formatCurrency(filteredInvoices.reduce((s, r) => s + r.grn, 0))}
                </td>
                <td className="py-3 px-2 text-sm text-amber text-right tabular-nums font-medium">
                  {formatCurrency(filteredInvoices.reduce((s, r) => s + Math.abs(r.variance), 0))}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-text-faint mt-4">
          3-way match: Invoice (supplier) ↔ Purchase Order (Sainsbury’s buying) ↔ GRN (DC / store goods receipt). Argos AI auto-clears matches inside £100/0.5% tolerance and routes the rest to the exception workbench for Priya’s team in Whitechapel.
        </p>
      </div>
    </div>
  )
}
