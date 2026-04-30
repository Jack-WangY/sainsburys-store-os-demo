"use client"

import { useState } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Bed,
  PoundSterling,
  Utensils,
  Users,
  Check,
  Calendar,
  FileText,
  ChevronDown,
  MessageSquare,
  Smartphone,
} from 'lucide-react'
import { useHouseOS } from '@/lib/house-os-context'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const properties = [
  { id: 'white-city', name: 'White City House' },
  { id: 'shoreditch', name: 'Shoreditch House' },
  { id: 'farmhouse', name: 'Soho Farmhouse' },
  { id: '180-house', name: '180 House' },
  { id: 'dean-street', name: '76 Dean Street' },
]

const dailySalesData = [
  { day: 'Mon', revenue: 28400 },
  { day: 'Tue', revenue: 31200 },
  { day: 'Wed', revenue: 29800 },
  { day: 'Thu', revenue: 34500 },
  { day: 'Fri', revenue: 42100 },
  { day: 'Sat', revenue: 48200 },
  { day: 'Sun', revenue: 31200 },
]

const checklist = [
  { id: '1', label: 'Morning briefing completed', done: true },
  { id: '2', label: 'VIP arrivals reviewed', done: true },
  { id: '3', label: 'Staff allocations confirmed', done: true },
  { id: '4', label: 'Cinema schedule checked', done: true },
  { id: '5', label: 'Evening reservations verified', done: false },
  { id: '6', label: 'End of day handover prepared', done: false },
]

const fbBreakdown = [
  { outlet: 'Main Restaurant', gross: 8420, voids: 120, net: 8300 },
  { outlet: 'Rooftop Bar', gross: 4280, voids: 80, net: 4200 },
  { outlet: 'Pool Cafe', gross: 2150, voids: 30, net: 2120 },
  { outlet: 'Room Service', gross: 1890, voids: 0, net: 1890 },
]

const compsVoids = [
  { type: 'Comp', guest: 'Industry VIP', amount: 380, auth: 'GM Park', code: 'COMP-PR' },
  { type: 'Comp', guest: 'Member complaint', amount: 120, auth: 'Duty Manager', code: 'COMP-FAULT' },
  { type: 'Void', guest: 'Order error', amount: 45, auth: 'F&B Lead', code: 'VOID' },
]



export default function GMDashboard() {
  const { state } = useHouseOS()
  const [selectedProperty, setSelectedProperty] = useState('white-city')
  const [checklistItems, setChecklistItems] = useState(checklist)
  const [showMobileView, setShowMobileView] = useState(false)

  const completedCount = checklistItems.filter((item) => item.done).length

  const toggleChecklist = (id: string) => {
    setChecklistItems((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-surface-3 border border-[rgba(255,255,255,0.07)] rounded-lg px-4 py-2.5 text-text text-sm focus:border-gold-dim focus:outline-none appearance-none pr-10 cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a8278'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1rem',
            }}
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-text-muted">Tuesday, 7 April 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileView(!showMobileView)}
            className={cn(
              "border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3",
              showMobileView && "bg-gold-glow text-gold border-gold-dim"
            )}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile View
          </Button>
          <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
            <FileText className="w-4 h-4 mr-2" />
            Weekly Report
          </Button>
        </div>
      </div>

      {showMobileView ? (
        // Mobile View
        <div className="max-w-md mx-auto">
          <div className="bg-[#111] rounded-[34px] p-4 shadow-lg">
            <div className="bg-[#181818] rounded-3xl p-4 space-y-4 min-h-[560px]">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">House OS</span>
                <span className="text-xs text-gray-400">White City</span>
              </div>

              <div className="bg-[#232323] border border-white/10 rounded-2xl p-4">
                <div className="text-xs text-gray-400 mb-1">Today&apos;s house pulse</div>
                <div className="text-4xl font-bold text-white">92%</div>
                <div className="text-gray-400 text-sm">Capture completeness before close</div>
              </div>

              <div className="bg-[#232323] border border-white/10 rounded-2xl p-4">
                <div className="font-medium text-white mb-3">Quick actions</div>
                <div className="grid grid-cols-2 gap-2">
                  {['Log comp', 'Add note', 'Report issue', 'Message team'].map((action) => (
                    <button
                      key={action}
                      className="bg-[#2a2a2a] border border-white/5 rounded-xl p-3 text-sm text-gray-300 hover:bg-[#333] transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#232323] border border-white/10 rounded-2xl p-4">
                <div className="font-medium text-white mb-2">Open tasks</div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>2 comps need manager reason</p>
                  <p>1 offline transaction pending match</p>
                  <p>VIP arrival in 34 min</p>
                </div>
              </div>

              <div className="bg-[#232323] border border-white/10 rounded-2xl p-4">
                <div className="font-medium text-white mb-2">Ops thread</div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>&quot;Kitchen team meal added&quot;</p>
                  <p>&quot;AV vendor due at 17:30&quot;</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-text-muted text-center mt-4">
            Mobile-optimized view for on-the-go managers
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Occupancy"
              icon={<Bed className="w-3.5 h-3.5" />}
              value="88%"
              label="26/29 rooms"
            />
            <KPICard
              title="RevPAR"
              icon={<PoundSterling className="w-3.5 h-3.5" />}
              value="£184"
              label="Revenue per available room"
            />
            <KPICard
              title="F&B Net Sales"
              icon={<Utensils className="w-3.5 h-3.5" />}
              value="£11,560"
              label="Today to date"
            />
            <KPICard
              title="Member Check-ins"
              icon={<Users className="w-3.5 h-3.5" />}
              value="298"
              label="Active in house"
            />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Charts & Tables */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Sales Chart */}
              <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
                <h3 className="font-serif text-lg text-text mb-4">Daily Sales This Week</h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" stroke="#8a8278" fontSize={12} />
                      <YAxis stroke="#8a8278" fontSize={12} tickFormatter={(v) => `£${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1815',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* F&B Breakdown */}
              <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
                <h3 className="font-serif text-lg text-text mb-4">F&B Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.07)]">
                        <th className="text-left uppercase-label text-text-faint py-3 px-2">Outlet</th>
                        <th className="text-right uppercase-label text-text-faint py-3 px-2">Gross</th>
                        <th className="text-right uppercase-label text-text-faint py-3 px-2">Voids</th>
                        <th className="text-right uppercase-label text-text-faint py-3 px-2">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fbBreakdown.map((row) => (
                        <tr key={row.outlet} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-surface-2 transition-colors">
                          <td className="py-3 px-2 text-sm text-text">{row.outlet}</td>
                          <td className="py-3 px-2 text-sm text-text-muted text-right tabular-nums">{formatCurrency(row.gross)}</td>
                          <td className="py-3 px-2 text-sm text-red text-right tabular-nums">-{formatCurrency(row.voids)}</td>
                          <td className="py-3 px-2 text-sm text-text font-medium text-right tabular-nums">{formatCurrency(row.net)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-surface-2">
                        <td className="py-3 px-2 text-sm text-text font-medium">Total</td>
                        <td className="py-3 px-2 text-sm text-text-muted text-right tabular-nums font-medium">
                          {formatCurrency(fbBreakdown.reduce((sum, r) => sum + r.gross, 0))}
                        </td>
                        <td className="py-3 px-2 text-sm text-red text-right tabular-nums font-medium">
                          -{formatCurrency(fbBreakdown.reduce((sum, r) => sum + r.voids, 0))}
                        </td>
                        <td className="py-3 px-2 text-sm text-gold text-right tabular-nums font-medium">
                          {formatCurrency(fbBreakdown.reduce((sum, r) => sum + r.net, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Comps & Voids */}
              <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
                <h3 className="font-serif text-lg text-text mb-4">Comps & Voids Today</h3>
                <div className="space-y-3">
                  {compsVoids.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-[rgba(255,255,255,0.05)]"
                    >
                      <div className="flex items-center gap-3">
                        <StatusBadge variant={item.type === 'Comp' ? 'gold' : 'amber'}>
                          {item.type}
                        </StatusBadge>
                        <div>
                          <p className="text-sm text-text">{item.guest}</p>
                          <p className="text-xs text-text-muted">Auth: {item.auth}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text tabular-nums font-medium">{formatCurrency(item.amount)}</p>
                        <StatusBadge variant="ghost" className="text-[9px]">{item.code}</StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Checklist & Chat */}
            <div className="space-y-6">
              {/* Today's Checklist */}
              <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-text">Today&apos;s Checklist</h3>
                  <span className="text-xs text-text-muted">{completedCount}/{checklistItems.length} complete</span>
                </div>
                <div className="space-y-2">
                  {checklistItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left",
                        item.done
                          ? "bg-green-dim/30 border-[rgba(74,158,107,0.2)]"
                          : "bg-surface-2 border-[rgba(255,255,255,0.05)] hover:border-gold-dim"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                          item.done ? "bg-green" : "border border-gold"
                        )}
                      >
                        {item.done && <Check className="w-3 h-3 text-background" />}
                      </div>
                      <span className={cn("text-sm", item.done ? "text-text-muted line-through" : "text-text")}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Floor Manager Commentary */}
              <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue" />
                    <h3 className="font-serif text-lg text-text">Shift Commentary</h3>
                  </div>
                  <span className="text-xs text-text-muted">From floor managers</span>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '22:15', author: 'James Liu', type: 'note', text: 'Private dining event running 30 min over - extended bar service approved' },
                    { time: '23:40', author: 'James Liu', type: 'incident', text: 'Spa sauna closed for maintenance - 3 guests offered comp treatments tomorrow' },
                    { time: '00:15', author: 'James Liu', type: 'comp', text: 'Comp breakfast for Room 412 due to late room service (£26.34)', amount: 26.34 },
                    { time: '01:02', author: 'James Liu', type: 'note', text: 'All outlets closed, handover to revenue audit complete' },
                  ].map((entry, i) => (
                    <div key={i} className="p-3 rounded-lg bg-surface-2 border border-[rgba(255,255,255,0.05)]">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-muted">{entry.time}</span>
                          <span className="text-xs text-text-faint">·</span>
                          <span className="text-xs text-text-muted">{entry.author}</span>
                        </div>
                        <StatusBadge 
                          variant={entry.type === 'comp' ? 'gold' : entry.type === 'incident' ? 'amber' : 'ghost'}
                          className="text-[9px]"
                        >
                          {entry.type}
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-text">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
