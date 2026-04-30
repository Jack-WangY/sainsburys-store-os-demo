"use client"

import { useState } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  Briefcase,
  Timer,
  UserCheck,
  Zap,
} from 'lucide-react'

const departments = [
  { name: 'F&B Service', scheduled: 124, actual: 118, variance: -6, efficiency: 94.2, budgetVar: -2.1 },
  { name: 'Housekeeping', scheduled: 86, actual: 84, variance: -2, efficiency: 97.6, budgetVar: -0.8 },
  { name: 'Front Office', scheduled: 42, actual: 42, variance: 0, efficiency: 100, budgetVar: 0 },
  { name: 'Kitchen', scheduled: 68, actual: 71, variance: 3, efficiency: 104.4, budgetVar: 4.2 },
  { name: 'Spa & Wellness', scheduled: 28, actual: 26, variance: -2, efficiency: 92.8, budgetVar: -3.4 },
  { name: 'Events', scheduled: 18, actual: 22, variance: 4, efficiency: 122.2, budgetVar: 8.6 },
]

const shiftsToday = [
  { time: '06:00-14:00', name: 'Morning', staff: 142, filled: 138, status: 'active' },
  { time: '14:00-22:00', name: 'Afternoon', staff: 168, filled: 165, status: 'upcoming' },
  { time: '22:00-06:00', name: 'Night', staff: 56, filled: 56, status: 'upcoming' },
]

const alerts = [
  { id: 1, type: 'overtime', title: 'Overtime Alert', description: 'Kitchen team approaching 8h average', property: 'Soho Farmhouse', severity: 'warning' },
  { id: 2, type: 'coverage', title: 'Coverage Gap', description: 'Evening shift needs +2 servers', property: 'White City House', severity: 'urgent' },
  { id: 3, type: 'compliance', title: 'Break Compliance', description: 'All breaks logged correctly', property: 'All Properties', severity: 'success' },
]

const weeklyTrend = [
  { day: 'Mon', scheduled: 366, actual: 358, cost: 42800 },
  { day: 'Tue', scheduled: 372, actual: 365, cost: 43200 },
  { day: 'Wed', scheduled: 368, actual: 362, cost: 42600 },
  { day: 'Thu', scheduled: 374, actual: 371, cost: 44100 },
  { day: 'Fri', scheduled: 398, actual: 402, cost: 48200 },
  { day: 'Sat', scheduled: 412, actual: 418, cost: 51400 },
  { day: 'Sun', scheduled: 386, actual: 382, cost: 45800 },
]

export default function LabourPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  const totalScheduled = departments.reduce((acc, d) => acc + d.scheduled, 0)
  const totalActual = departments.reduce((acc, d) => acc + d.actual, 0)

  return (
    <div className="space-y-6">
      {/* Period Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-surface-2 rounded-lg p-1">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-md transition-all",
                selectedPeriod === period
                  ? "bg-gold text-background font-medium"
                  : "text-text-muted hover:text-text"
              )}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <Button variant="outline" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
          <Calendar className="w-4 h-4 mr-2" />
          View Schedule
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Hours Scheduled"
          icon={<Clock className="w-3.5 h-3.5" />}
          value="2,876"
          label="Across all properties"
        />
        <KPICard
          title="Hours Worked"
          icon={<UserCheck className="w-3.5 h-3.5" />}
          value="2,814"
          delta={{ direction: 'down', value: '2.2%', label: 'under schedule' }}
        />
        <KPICard
          title="Labour Cost"
          icon={<Briefcase className="w-3.5 h-3.5" />}
          value="£318,100"
          delta={{ direction: 'down', value: '1.4%', label: 'vs budget' }}
        />
        <KPICard
          title="Productivity Index"
          icon={<Zap className="w-3.5 h-3.5" />}
          value="97.8%"
          delta={{ direction: 'up', value: '0.6%', label: 'vs target' }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Department & Shifts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Breakdown */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Department Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">Department</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-2">Scheduled</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-2">Actual</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-2">Variance</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-2">Efficiency</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-2">Budget Var</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr
                      key={dept.name}
                      className="border-b border-[rgba(255,255,255,0.05)] hover:bg-surface-2 transition-colors"
                    >
                      <td className="py-3 px-2 text-sm text-text">{dept.name}</td>
                      <td className="py-3 px-2 text-sm text-text-muted text-right tabular-nums">
                        {dept.scheduled}h
                      </td>
                      <td className="py-3 px-2 text-sm text-text text-right tabular-nums">
                        {dept.actual}h
                      </td>
                      <td className={cn(
                        "py-3 px-2 text-sm text-right tabular-nums flex items-center justify-end gap-1",
                        dept.variance === 0 && "text-text-muted",
                        dept.variance > 0 && "text-amber",
                        dept.variance < 0 && "text-green"
                      )}>
                        {dept.variance > 0 && <TrendingUp className="w-3 h-3" />}
                        {dept.variance < 0 && <TrendingDown className="w-3 h-3" />}
                        {dept.variance === 0 ? '0h' : `${dept.variance > 0 ? '+' : ''}${dept.variance}h`}
                      </td>
                      <td className={cn(
                        "py-3 px-2 text-sm text-right tabular-nums",
                        dept.efficiency >= 95 && dept.efficiency <= 105 ? "text-green" : "text-amber"
                      )}>
                        {dept.efficiency.toFixed(1)}%
                      </td>
                      <td className={cn(
                        "py-3 px-2 text-sm text-right tabular-nums",
                        dept.budgetVar === 0 && "text-text-muted",
                        dept.budgetVar > 0 && "text-red",
                        dept.budgetVar < 0 && "text-green"
                      )}>
                        {dept.budgetVar === 0 ? '0%' : `${dept.budgetVar > 0 ? '+' : ''}${dept.budgetVar.toFixed(1)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[rgba(255,255,255,0.12)]">
                    <td className="py-3 px-2 text-sm text-text font-medium">Total</td>
                    <td className="py-3 px-2 text-sm text-text-muted text-right tabular-nums font-medium">
                      {totalScheduled}h
                    </td>
                    <td className="py-3 px-2 text-sm text-text text-right tabular-nums font-medium">
                      {totalActual}h
                    </td>
                    <td className="py-3 px-2 text-sm text-green text-right tabular-nums font-medium">
                      {totalActual - totalScheduled}h
                    </td>
                    <td className="py-3 px-2 text-sm text-green text-right tabular-nums font-medium">
                      {((totalActual / totalScheduled) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-2 text-sm text-green text-right tabular-nums font-medium">
                      -1.4%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Shift Coverage */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Today&apos;s Shift Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shiftsToday.map((shift) => (
                <div
                  key={shift.name}
                  className={cn(
                    "p-4 rounded-lg border",
                    shift.status === 'active'
                      ? "bg-green-dim/20 border-green-dim/50"
                      : "bg-surface-2 border-[rgba(255,255,255,0.07)]"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text">{shift.name}</span>
                    <StatusBadge variant={shift.status === 'active' ? 'green' : 'ghost'}>
                      {shift.status === 'active' ? 'Active' : 'Upcoming'}
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-text-muted mb-3">{shift.time}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-serif text-text tabular-nums">{shift.filled}</p>
                      <p className="text-xs text-text-muted">of {shift.staff} positions</p>
                    </div>
                    <div className={cn(
                      "text-sm tabular-nums",
                      shift.filled >= shift.staff ? "text-green" : "text-amber"
                    )}>
                      {((shift.filled / shift.staff) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trend Chart */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Weekly Labour Trend</h3>
            <div className="flex items-end gap-2 h-40">
              {weeklyTrend.map((day, idx) => {
                const maxCost = Math.max(...weeklyTrend.map(d => d.cost))
                const height = (day.cost / maxCost) * 100
                const isToday = idx === 4 // Friday
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs text-text-muted tabular-nums">
                      {formatCurrency(day.cost)}
                    </div>
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className={cn(
                          "w-full rounded-t transition-all duration-500",
                          isToday ? "bg-gold" : "bg-surface-3"
                        )}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-xs",
                      isToday ? "text-gold font-medium" : "text-text-faint"
                    )}>
                      {day.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Insights */}
        <div className="space-y-6">
          {/* Live Alerts */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Live Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    alert.severity === 'urgent' && "bg-red-dim/20 border-red-dim/50",
                    alert.severity === 'warning' && "bg-amber-dim/20 border-amber-dim/50",
                    alert.severity === 'success' && "bg-green-dim/20 border-green-dim/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      alert.severity === 'urgent' && "bg-red/20",
                      alert.severity === 'warning' && "bg-amber/20",
                      alert.severity === 'success' && "bg-green/20"
                    )}>
                      {alert.severity === 'success' ? (
                        <CheckCircle className={cn("w-4 h-4 text-green")} />
                      ) : (
                        <AlertTriangle className={cn(
                          "w-4 h-4",
                          alert.severity === 'urgent' ? "text-red" : "text-amber"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text font-medium">{alert.title}</p>
                      <p className="text-xs text-text-muted">{alert.description}</p>
                      <p className="text-xs text-text-faint mt-1">{alert.property}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Labour Efficiency Score */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5 text-center">
            <h3 className="text-xs text-text-muted uppercase tracking-wide mb-4">Labour Efficiency Score</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${97.8 * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-3xl text-text">97.8</span>
              </div>
            </div>
            <p className="text-sm text-text-muted">
              Above target by <span className="text-green">+0.6%</span>
            </p>
          </div>

          {/* Quick Insights */}
          <div className="bg-gold-glow border border-gold-dim rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-3">AI Insight</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Kitchen overtime at Soho Farmhouse has increased 12% this week. 
              Consider cross-training F&B staff for prep work during peak periods to reduce pressure.
            </p>
            <Button size="sm" className="mt-4 bg-gold hover:bg-gold/90 text-background">
              View Recommendation
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          {/* Compliance Status */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Break Compliance</span>
                <StatusBadge variant="green">100%</StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Working Time Directive</span>
                <StatusBadge variant="green">Compliant</StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Overtime Approval</span>
                <StatusBadge variant="amber">2 Pending</StatusBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
