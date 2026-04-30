"use client"

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { KPICard } from '@/components/house-os/kpi-card'
import { PropertyCard } from '@/components/house-os/property-card'
import { AlertStrip } from '@/components/house-os/alert-strip'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { useHouseOS } from '@/lib/house-os-context'
import { cn } from '@/lib/utils'
import {
  PoundSterling,
  Users,
  Building2,
  CheckCircle,
  Download,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  TrendingUp,
  X,
  MapPin,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'

// Dynamically import the map component to avoid SSR issues with Leaflet
const UKMap = dynamic(() => import('@/components/house-os/uk-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-1 rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <MapPin className="w-8 h-8 text-gold/50 animate-pulse" />
        <span className="text-xs text-text-muted">Loading map...</span>
      </div>
    </div>
  ),
})

// Group revenue (£m) across the trading week — Sainsbury's Group runs ~£32B/yr
const weeklyRevenueData = [
  { day: 'Mon', revenue: 78 },
  { day: 'Tue', revenue: 81 },
  { day: 'Wed', revenue: 84 },
  { day: 'Thu', revenue: 92 },
  { day: 'Fri', revenue: 108 },
  { day: 'Sat', revenue: 124 },
  { day: 'Sun', revenue: 96 },
]

// Group revenue mix today (£ today)
const revenueMixData = [
  { name: 'Fresh & Grocery', value: 48200000, color: '#c9a84c' },
  { name: 'General Merchandise', value: 11800000, color: '#4a9e6b' },
  { name: 'Clothing (Tu)', value: 4200000, color: '#5a87c4' },
  { name: 'Argos', value: 14600000, color: '#d4855a' },
  { name: 'Fuel', value: 8900000, color: '#4a4640' },
]

// Format breakdown across the 600-store estate
const formatBreakdown = [
  { format: 'Superstore', count: 147, revenue: '£14.2M', share: '44%' },
  { format: 'Local (convenience)', count: 821, revenue: '£8.6M', share: '27%' },
  { format: 'Central / Online hub', count: 32, revenue: '£3.4M', share: '11%' },
  { format: 'Argos (in-store + standalone)', count: 712, revenue: '£5.6M', share: '18%' },
]

// Regional snapshot — period-close status by trading region
const regionalSnapshot = [
  { region: 'London & South East', stores: 184, revenue: 9.8, status: 'closed' as const },
  { region: 'Midlands', stores: 121, revenue: 6.4, status: 'closed' as const },
  { region: 'North & Scotland', stores: 142, revenue: 7.2, status: 'closed' as const },
  { region: 'South West & Wales', stores: 88, revenue: 4.6, status: 'review' as const },
  { region: 'East & Anglia', stores: 65, revenue: 3.8, status: 'closed' as const },
]

export default function PortfolioPage() {
  const { state } = useHouseOS()
  const [sortColumn, setSortColumn] = useState<string>('revenue')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const sortedProperties = [...state.properties].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1
    switch (sortColumn) {
      case 'revenue':
        return (a.revenueToday - b.revenueToday) * multiplier
      case 'occupancy':
        return (a.occupancy - b.occupancy) * multiplier
      case 'name':
        return a.name.localeCompare(b.name) * multiplier
      default:
        return 0
    }
  })

  const selectedProperty = state.properties.find((p) => p.id === selectedPropertyId)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const totalRevenue = state.properties.reduce((sum, p) => sum + p.revenueToday, 0)
  const avgOccupancy = Math.round(
    state.properties.reduce((sum, p) => sum + p.occupancy, 0) / state.properties.length
  )
  const totalMembers = state.properties.reduce((sum, p) => sum + p.membersIn, 0)

  const formatLabel = (f?: string) => {
    switch (f) {
      case 'superstore': return 'Superstore'
      case 'local': return 'Local'
      case 'central': return 'Central'
      case 'argos': return 'Argos'
      default: return 'Store'
    }
  }

  const alerts: { id: string; variant: 'warning' | 'info'; title: string; description: string; action: string }[] = [
    {
      id: 'whitechapel-cash',
      variant: 'warning',
      title: "Sainsbury's Whitechapel — Cash Office Variance",
      description: 'Tellermate variance of £842 vs Z-read totals. Posting to SAP S/4 HANA held pending review.',
      action: 'Review',
    },
    {
      id: 'britvic-3way',
      variant: 'info',
      title: "Nine Elms — Britvic 3-way Match Fail",
      description: 'Invoice BRT-99412 — invoice £18,420 vs PO £17,980. Variance £440 over 3-day SLA.',
      action: 'View Details',
    },
  ]

  return (
    <div className="space-y-6">
      {/* CFO Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-2">
        <div>
          <h1 className="font-serif text-2xl text-text">Group P&L — CFO Portfolio</h1>
          <p className="text-sm text-text-muted mt-1">
            Bláthnaid Bergin · 600 stores · FY2026 · trading day {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
        <StatusBadge variant="green" icon={<CheckCircle className="w-3 h-3" />}>
          Period close on track
        </StatusBadge>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Group Revenue Today"
          icon={<PoundSterling className="w-3.5 h-3.5" />}
          value="£87.7M"
          label="600 stores · all UK formats"
          delta={{ direction: 'up', value: '4.2%', label: 'vs LY same trading day' }}
        />
        <KPICard
          title="Nectar Customers Today"
          icon={<Users className="w-3.5 h-3.5" />}
          value="6.4M"
          label="Active swipes today · 19.8M base"
          delta={{ direction: 'up', value: '2.8%', label: 'YoY' }}
        />
        <KPICard
          title="Stores Trading"
          icon={<Building2 className="w-3.5 h-3.5" />}
          value="600 / 600"
          label="147 superstores · 821 locals · 712 Argos · 32 central"
          delta={{ direction: 'up', value: 'All open' }}
        />
        <KPICard
          title="Period Close Status"
          icon={<CheckCircle className="w-3.5 h-3.5" />}
          value="592 / 600"
          label="8 stores in review · auto-sweep at 03:00"
          delta={{ direction: 'neutral', value: '98.7% closed' }}
        />
      </div>

      {/* Map and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UK Store Network Map */}
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6 relative overflow-hidden">
          <h3 className="font-serif text-lg text-text mb-4">UK Store Network</h3>

          <div className="relative h-[320px] rounded-xl overflow-hidden">
            <UKMap
              properties={state.properties}
              onPropertyClick={(id) => setSelectedPropertyId(id)}
              formatCurrency={formatCurrency}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-6 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_6px_rgba(201,168,76,0.4)]" />
                <span>Trading clean</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber shadow-[0_0_6px_rgba(212,133,90,0.5)]" />
                <span>Needs attention</span>
              </div>
            </div>
            <span className="text-xs text-text-faint">9 representative stores shown · 600 in estate</span>
          </div>
        </div>

        {/* Revenue 7-Day Chart */}
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-text">Group Revenue — 7-Day Trend</h3>
            <StatusBadge variant="green" icon={<TrendingUp className="w-3 h-3" />}>
              +3.4% WoW
            </StatusBadge>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyRevenueData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#8a8278" fontSize={12} />
                <YAxis
                  stroke="#8a8278"
                  fontSize={12}
                  tickFormatter={(v) => `£${v}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1815',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`£${value}M`, 'Group Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#c9a84c"
                  strokeWidth={2}
                  dot={{ fill: '#c9a84c', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#c9a84c' }}
                  fill="url(#goldGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Format breakdown + Region snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
          <h3 className="font-serif text-lg text-text mb-4">Estate by Format</h3>
          <div className="space-y-3">
            {formatBreakdown.map((row) => (
              <div key={row.format} className="flex items-center justify-between p-3 rounded-lg bg-surface-2">
                <div>
                  <p className="text-sm text-text font-medium">{row.format}</p>
                  <p className="text-xs text-text-muted">{row.count} stores</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gold font-medium tabular-nums">{row.revenue}</p>
                  <p className="text-xs text-text-faint">{row.share} of group</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
          <h3 className="font-serif text-lg text-text mb-4">Period Close — by Region</h3>
          <div className="space-y-3">
            {regionalSnapshot.map((row) => (
              <div key={row.region} className="flex items-center justify-between p-3 rounded-lg bg-surface-2">
                <div>
                  <p className="text-sm text-text font-medium">{row.region}</p>
                  <p className="text-xs text-text-muted">{row.stores} stores</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text tabular-nums">£{row.revenue}M</span>
                  <StatusBadge variant={row.status === 'closed' ? 'green' : 'amber'}>
                    {row.status === 'closed' ? 'Closed' : 'In review'}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Performance Table */}
      <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg text-text">Store Performance — Sample of Estate</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th
                  className="text-left uppercase-label text-text-faint py-3 px-3 cursor-pointer hover:text-text-muted"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Store
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left uppercase-label text-text-faint py-3 px-3">Format</th>
                <th
                  className="text-right uppercase-label text-text-faint py-3 px-3 cursor-pointer hover:text-text-muted"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Revenue Today
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-right uppercase-label text-text-faint py-3 px-3">Fresh £</th>
                <th
                  className="text-right uppercase-label text-text-faint py-3 px-3 cursor-pointer hover:text-text-muted"
                  onClick={() => handleSort('occupancy')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Forecast %
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-right uppercase-label text-text-faint py-3 px-3">Nectar</th>
                <th className="text-right uppercase-label text-text-faint py-3 px-3">Shrink £</th>
                <th className="text-center uppercase-label text-text-faint py-3 px-3">Audit</th>
                <th className="text-center uppercase-label text-text-faint py-3 px-3">SAP</th>
              </tr>
            </thead>
            <tbody>
              {sortedProperties.map((property) => (
                <tr
                  key={property.id}
                  onClick={() => setSelectedPropertyId(property.id)}
                  className={cn(
                    "border-b border-[rgba(255,255,255,0.05)] cursor-pointer transition-colors",
                    "hover:bg-surface-2",
                    property.hasAlert && "border-l-2 border-l-amber bg-amber-dim/20"
                  )}
                >
                  <td className="py-3 px-3">
                    <div>
                      <p className="text-sm text-text font-medium">{property.name}</p>
                      <p className="text-xs text-text-muted">{property.address}</p>
                      <p className="text-xs text-text-faint">{property.postcode}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge variant="ghost">{formatLabel(property.format)}</StatusBadge>
                  </td>
                  <td className="py-3 px-3 text-sm text-text text-right tabular-nums font-medium">
                    {formatCurrency(property.revenueToday)}
                  </td>
                  <td className="py-3 px-3 text-sm text-text-muted text-right tabular-nums">
                    {formatCurrency(property.fbNet)}
                  </td>
                  <td className="py-3 px-3 text-sm text-text text-right tabular-nums">
                    {property.occupancy}%
                  </td>
                  <td className="py-3 px-3 text-sm text-text-muted text-right tabular-nums">
                    {property.membersIn.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-sm text-text-muted text-right tabular-nums">
                    {formatCurrency(property.comps)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge variant={property.auditStatus === 'closed' ? 'green' : 'amber'}>
                      {property.auditStatus === 'closed' ? 'Closed' : 'Review'}
                    </StatusBadge>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge
                      variant={
                        property.oracleStatus === 'synced'
                          ? 'blue'
                          : property.oracleStatus === 'held'
                          ? 'amber'
                          : 'gold'
                      }
                    >
                      {property.oracleStatus === 'synced'
                        ? 'Synced'
                        : property.oracleStatus === 'held'
                        ? 'Held'
                        : 'Pending'}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-2">
                <td className="py-3 px-3 text-sm text-text font-medium">Sample (9 stores)</td>
                <td className="py-3 px-3"></td>
                <td className="py-3 px-3 text-sm text-gold text-right tabular-nums font-medium">
                  {formatCurrency(totalRevenue)}
                </td>
                <td className="py-3 px-3 text-sm text-text-muted text-right tabular-nums font-medium">
                  {formatCurrency(state.properties.reduce((sum, p) => sum + p.fbNet, 0))}
                </td>
                <td className="py-3 px-3 text-sm text-text text-right tabular-nums font-medium">
                  {avgOccupancy}%
                </td>
                <td className="py-3 px-3 text-sm text-text-muted text-right tabular-nums font-medium">
                  {totalMembers.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-sm text-text-muted text-right tabular-nums font-medium">
                  {formatCurrency(state.properties.reduce((sum, p) => sum + p.comps, 0))}
                </td>
                <td className="py-3 px-3 text-center">
                  <StatusBadge variant="green">8/9</StatusBadge>
                </td>
                <td className="py-3 px-3 text-center">
                  <StatusBadge variant="blue">8/9</StatusBadge>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Mix */}
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
          <h3 className="font-serif text-lg text-text mb-4">Group Revenue Mix Today</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {revenueMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-semibold text-text">£87.7M</p>
                  <p className="text-xs text-text-muted">today</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {revenueMixData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-text-muted">{item.name}</span>
                  </div>
                  <span className="text-sm text-text tabular-nums">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Exceptions */}
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-text">Live Exceptions</h3>
            <StatusBadge variant="amber" icon={<AlertTriangle className="w-3 h-3" />}>
              {alerts.filter((a) => !dismissedAlerts.has(a.id)).length} active
            </StatusBadge>
          </div>
          <div className="space-y-3">
            {alerts
              .filter((alert) => !dismissedAlerts.has(alert.id))
              .map((alert) => (
                <AlertStrip
                  key={alert.id}
                  variant={alert.variant}
                  title={alert.title}
                  description={alert.description}
                  action={
                    <Button size="sm" variant="outline" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
                      {alert.action}
                    </Button>
                  }
                  dismissible
                  onDismiss={() => setDismissedAlerts((prev) => new Set([...prev, alert.id]))}
                />
              ))}
            {alerts.filter((a) => !dismissedAlerts.has(a.id)).length === 0 && (
              <div className="text-center py-8 text-text-muted text-sm">
                No active exceptions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Store Detail Sheet */}
      <Sheet open={!!selectedPropertyId} onOpenChange={() => setSelectedPropertyId(null)}>
        <SheetContent className="bg-surface-1 border-l border-[rgba(255,255,255,0.07)] w-[400px]">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl text-text">
              {selectedProperty?.name}
            </SheetTitle>
          </SheetHeader>
          {selectedProperty && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Format</span>
                <StatusBadge variant="ghost">{formatLabel(selectedProperty.format)}</StatusBadge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-2 rounded-lg p-4">
                  <p className="text-xs text-text-muted mb-1">Revenue Today</p>
                  <p className="text-lg font-semibold text-gold tabular-nums">
                    {formatCurrency(selectedProperty.revenueToday)}
                  </p>
                </div>
                <div className="bg-surface-2 rounded-lg p-4">
                  <p className="text-xs text-text-muted mb-1">Forecast %</p>
                  <p className="text-lg font-semibold text-text tabular-nums">
                    {selectedProperty.occupancy}%
                  </p>
                </div>
                <div className="bg-surface-2 rounded-lg p-4">
                  <p className="text-xs text-text-muted mb-1">Fresh £</p>
                  <p className="text-lg font-semibold text-text tabular-nums">
                    {formatCurrency(selectedProperty.fbNet)}
                  </p>
                </div>
                <div className="bg-surface-2 rounded-lg p-4">
                  <p className="text-xs text-text-muted mb-1">Nectar Today</p>
                  <p className="text-lg font-semibold text-text tabular-nums">
                    {selectedProperty.membersIn.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.07)]">
                  <span className="text-sm text-text-muted">Audit Status</span>
                  <StatusBadge variant={selectedProperty.auditStatus === 'closed' ? 'green' : 'amber'}>
                    {selectedProperty.auditStatus === 'closed' ? 'Closed' : 'Review'}
                  </StatusBadge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.07)]">
                  <span className="text-sm text-text-muted">SAP S/4 HANA Status</span>
                  <StatusBadge variant={selectedProperty.oracleStatus === 'synced' ? 'blue' : 'amber'}>
                    {selectedProperty.oracleStatus === 'synced' ? 'Synced' : 'Held'}
                  </StatusBadge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-muted">Shrink Today</span>
                  <span className="text-sm text-text tabular-nums">
                    {formatCurrency(selectedProperty.comps)}
                  </span>
                </div>
              </div>

              {selectedProperty.hasAlert && (
                <AlertStrip
                  variant="warning"
                  title="Exception Active"
                  description="Tellermate variance detected. Review required before SAP posting."
                />
              )}

              <div className="flex gap-2">
                <Button className="flex-1 bg-gold hover:bg-gold/90 text-background">
                  View Full Dashboard
                </Button>
                <Button variant="outline" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
                  Export
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
