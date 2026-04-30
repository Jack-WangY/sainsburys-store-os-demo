"use client"

import { useState } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { AlertStrip } from '@/components/house-os/alert-strip'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Utensils,
  Film,
  Receipt,
  Users,
  Download,
  Share2,
  Check,
  Clock,
  AlertTriangle,
  Lock,
  Star,
} from 'lucide-react'

const foodNetSales = [
  { property: '180 House', gross: 18420, voids: 320, net: 18100, delta: 12.4 },
  { property: 'Shoreditch House', gross: 15680, voids: 180, net: 15500, delta: 8.2 },
  { property: 'White City House', gross: 12340, voids: 240, net: 12100, delta: -2.1 },
  { property: 'Soho Farmhouse', gross: 28900, voids: 400, net: 28500, delta: 15.6 },
  { property: '76 Dean Street', gross: 14200, voids: 120, net: 14080, delta: 5.8 },
  { property: 'High Road House', gross: 9800, voids: 80, net: 9720, delta: 3.2 },
  { property: 'Electric House', gross: 11300, voids: 140, net: 11160, delta: 7.4 },
  { property: 'Little House Mayfair', gross: 8900, voids: 60, net: 8840, delta: 4.1 },
  { property: 'Little House Balham', gross: 6200, voids: 40, net: 6160, delta: 2.8 },
]

const cinemaGymSales = [
  { property: 'Electric House', type: 'Cinema', tickets: 124, revenue: 3720 },
  { property: 'Shoreditch House', type: 'Cinema', tickets: 86, revenue: 2580 },
  { property: 'White City House', type: 'Cinema', tickets: 68, revenue: 2040 },
  { property: 'Soho Farmhouse', type: 'Gym', sessions: 42, revenue: 2100 },
  { property: '180 House', type: 'Gym', sessions: 38, revenue: 1900 },
  { property: 'High Road House', type: 'Gym', sessions: 28, revenue: 1400 },
]

const vipComps = [
  { guest: 'Industry VIP — Music', property: 'White City House', table: 'Table 8', time: '20:30', value: 480, auth: 'GM Park', code: 'COMP-PR' },
  { guest: 'Tech Founder Guest', property: 'Shoreditch House', table: 'Private Dining', time: '19:45', value: 380, auth: 'GM Williams', code: 'COMP-CORP' },
  { guest: 'Member Anniversary', property: 'Soho Farmhouse', table: 'Table 14', time: '21:00', value: 240, auth: 'F&B Lead', code: 'COMP-EXEC' },
]

const timeline = [
  { icon: Check, label: 'All 9 revenue audits closed remotely', meta: '02:41 GMT', variant: 'green' as const },
  { icon: Check, label: 'Oracle Fusion journals posted', meta: '02:43 GMT', variant: 'green' as const },
  { icon: AlertTriangle, label: 'White City bar variance flagged', meta: '01:28 GMT', variant: 'amber' as const },
  { icon: Check, label: 'Record F&B day at Farmhouse — £28,500 net', meta: 'Yesterday', variant: 'green' as const },
  { icon: Clock, label: 'Weekly inventory due Friday', meta: 'Upcoming', variant: 'blue' as const },
]

const staffAllowances = [
  { property: 'Soho Farmhouse', amount: 420, meals: 14 },
  { property: 'Shoreditch House', amount: 380, meals: 12 },
  { property: '180 House', amount: 340, meals: 11 },
  { property: 'White City House', amount: 280, meals: 9 },
  { property: 'Others (5)', amount: 760, meals: 25 },
]

export default function DailyOpsReport() {
  const [hasAccess] = useState(true) // Simulating role access

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.07)]">
        <div>
          <h1 className="font-serif text-2xl text-text">Daily Operations Report</h1>
          <p className="text-sm text-text-muted mt-1">
            Tuesday 7 April 2026 · Generated 06:30 GMT · Auto-distributed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge variant="green" icon={<Check className="w-3 h-3" />}>
            Oracle Fusion Posted
          </StatusBadge>
          <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
            <Share2 className="w-4 h-4 mr-2" />
            Distribute
          </Button>
          <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total F&B Net Sales"
          icon={<Utensils className="w-3.5 h-3.5" />}
          value="£122,020"
          delta={{ direction: 'up', value: '8.4%', label: 'vs yesterday' }}
        />
        <KPICard
          title="Cinema & Gym Sales"
          icon={<Film className="w-3.5 h-3.5" />}
          value="£14,380"
          delta={{ direction: 'up', value: '12.1%' }}
        />
        <KPICard
          title="Total Comps & Voids"
          icon={<Receipt className="w-3.5 h-3.5" />}
          value="£9,740"
          label="3.4% of gross revenue"
        />
        <KPICard
          title="Staff Allowances"
          icon={<Users className="w-3.5 h-3.5" />}
          value="£2,180"
          label="9 properties"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Net Sales */}
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
          <h3 className="font-serif text-lg text-text mb-4">Food Net Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <th className="text-left uppercase-label text-text-faint py-3 px-2">Property</th>
                  <th className="text-right uppercase-label text-text-faint py-3 px-2">Gross</th>
                  <th className="text-right uppercase-label text-text-faint py-3 px-2">Voids</th>
                  <th className="text-right uppercase-label text-text-faint py-3 px-2">Net</th>
                  <th className="text-right uppercase-label text-text-faint py-3 px-2">vs Prev</th>
                </tr>
              </thead>
              <tbody>
                {foodNetSales.map((row) => (
                  <tr key={row.property} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-surface-2 transition-colors">
                    <td className="py-2.5 px-2 text-sm text-text">{row.property}</td>
                    <td className="py-2.5 px-2 text-sm text-text-muted text-right tabular-nums">{formatCurrency(row.gross)}</td>
                    <td className="py-2.5 px-2 text-sm text-red text-right tabular-nums">-{formatCurrency(row.voids)}</td>
                    <td className="py-2.5 px-2 text-sm text-text font-medium text-right tabular-nums">{formatCurrency(row.net)}</td>
                    <td className="py-2.5 px-2 text-right">
                      <StatusBadge variant={row.delta > 0 ? 'green' : 'red'}>
                        {row.delta > 0 ? '+' : ''}{row.delta}%
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-surface-2">
                  <td className="py-3 px-2 text-sm text-text font-medium">Total</td>
                  <td className="py-3 px-2 text-sm text-text-muted text-right tabular-nums font-medium">
                    {formatCurrency(foodNetSales.reduce((sum, r) => sum + r.gross, 0))}
                  </td>
                  <td className="py-3 px-2 text-sm text-red text-right tabular-nums font-medium">
                    -{formatCurrency(foodNetSales.reduce((sum, r) => sum + r.voids, 0))}
                  </td>
                  <td className="py-3 px-2 text-sm text-gold text-right tabular-nums font-medium">
                    {formatCurrency(foodNetSales.reduce((sum, r) => sum + r.net, 0))}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Cinema & Gym Sales */}
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
          <h3 className="font-serif text-lg text-text mb-4">Cinema & Gym Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <th className="text-left uppercase-label text-text-faint py-3 px-2">Property</th>
                  <th className="text-left uppercase-label text-text-faint py-3 px-2">Type</th>
                  <th className="text-right uppercase-label text-text-faint py-3 px-2">Tickets/Sessions</th>
                  <th className="text-right uppercase-label text-text-faint py-3 px-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {cinemaGymSales.map((row, i) => (
                  <tr key={i} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-surface-2 transition-colors">
                    <td className="py-2.5 px-2 text-sm text-text">{row.property}</td>
                    <td className="py-2.5 px-2">
                      <StatusBadge variant={row.type === 'Cinema' ? 'blue' : 'green'}>
                        {row.type}
                      </StatusBadge>
                    </td>
                    <td className="py-2.5 px-2 text-sm text-text-muted text-right tabular-nums">
                      {row.tickets || row.sessions}
                    </td>
                    <td className="py-2.5 px-2 text-sm text-text font-medium text-right tabular-nums">
                      {formatCurrency(row.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIP / On the House Section */}
      <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-lg text-text">VIP / On the House</h3>
          </div>
          <StatusBadge variant="gold">GM+ Access Only</StatusBadge>
        </div>

        {hasAccess ? (
          <>
            <AlertStrip
              variant="info"
              title="Confidential"
              description="Restricted to GM+, Finance Director, and ExCo. Not included in distributed reports."
              dismissible={false}
              className="mb-4"
            />

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">Guest</th>
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">Property</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-2">Value</th>
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">Auth</th>
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">GL Code</th>
                  </tr>
                </thead>
                <tbody>
                  {vipComps.map((row, i) => (
                    <tr key={i} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-surface-2 transition-colors">
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-gold" />
                          <span className="text-sm text-text">{row.guest}</span>
                        </div>
                        <span className="text-xs text-text-muted">{row.table} · {row.time}</span>
                      </td>
                      <td className="py-2.5 px-2 text-sm text-text-muted">{row.property}</td>
                      <td className="py-2.5 px-2 text-sm text-gold font-medium text-right tabular-nums">
                        {formatCurrency(row.value)}
                      </td>
                      <td className="py-2.5 px-2 text-sm text-text-muted">{row.auth}</td>
                      <td className="py-2.5 px-2">
                        <StatusBadge variant="amber">{row.code}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface-2">
                    <td colSpan={2} className="py-3 px-2 text-sm text-text font-medium">Total VIP Comps</td>
                    <td className="py-3 px-2 text-sm text-gold text-right tabular-nums font-medium">
                      {formatCurrency(vipComps.reduce((sum, r) => sum + r.value, 0))}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-xs text-text-faint mt-4">
              VIP comps are logged via Shift Dashboard and flow into this report automatically.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lock className="w-10 h-10 text-text-faint mb-3" />
            <p className="text-text-muted">This section requires GM or above access.</p>
          </div>
        )}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GM Briefing Timeline */}
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
          <h3 className="font-serif text-lg text-text mb-4">GM Briefing</h3>
          <div className="space-y-1">
            {timeline.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="relative flex gap-4 pb-4">
                  {i !== timeline.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[rgba(255,255,255,0.07)]" />
                  )}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                      item.variant === 'green' && "bg-green",
                      item.variant === 'amber' && "bg-amber",
                      item.variant === 'blue' && "bg-blue"
                    )}
                  >
                    <Icon className="w-3 h-3 text-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text">{item.label}</p>
                    <p className="text-xs text-text-faint">{item.meta}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Staff Allowances */}
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
          <h3 className="font-serif text-lg text-text mb-4">Staff Allowances</h3>
          <div className="space-y-3">
            {staffAllowances.map((row, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-2">
                <div>
                  <p className="text-sm text-text">{row.property}</p>
                  <p className="text-xs text-text-muted">{row.meals} meals</p>
                </div>
                <span className="text-sm text-gold tabular-nums font-medium">{formatCurrency(row.amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.07)] flex justify-between">
            <span className="text-sm text-text-muted">Total</span>
            <span className="text-sm text-gold tabular-nums font-medium">
              {formatCurrency(staffAllowances.reduce((sum, r) => sum + r.amount, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
