"use client"

import { useState } from 'react'
import { StatusBadge } from '@/components/house-os/status-badge'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Building2,
  ArrowRight,
  Calendar,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Store reconciliation status
const propertyStatus = [
  { name: "Sainsbury's Potters Bar", checks: 32, passed: 32, status: 'validated', varianceRate: 0.4, trend: 'down', lastClose: '01:12 GMT' },
  { name: "Sainsbury's Whitechapel", checks: 28, passed: 26, status: 'exception', varianceRate: 0.9, trend: 'up', lastClose: '01:45 GMT', exceptions: ['Argos C&C £312'] },
  { name: "Sainsbury's Nine Elms", checks: 28, passed: 26, status: 'exception', varianceRate: 0.6, trend: 'down', lastClose: '01:23 GMT', exceptions: ['Card settle £140'] },
  { name: "Sainsbury's Cromwell Road", checks: 28, passed: 28, status: 'validated', varianceRate: 1.1, trend: 'up', lastClose: '01:08 GMT' },
  { name: "Sainsbury's Local King's Cross", checks: 24, passed: 24, status: 'validated', varianceRate: 0.3, trend: 'down', lastClose: '00:58 GMT' },
  { name: "Sainsbury's Local Holborn", checks: 32, passed: 30, status: 'exception', varianceRate: 0.7, trend: 'stable', lastClose: '01:34 GMT', exceptions: ['Nectar timing'] },
  { name: "Sainsbury's Fulham Wharf", checks: 24, passed: 24, status: 'validated', varianceRate: 0.2, trend: 'down', lastClose: '00:52 GMT' },
  { name: 'Argos Stratford (in-store)', checks: 28, passed: 28, status: 'validated', varianceRate: 0.5, trend: 'stable', lastClose: '01:15 GMT' },
  { name: "Sainsbury's Brighton Marina", checks: 24, passed: 24, status: 'validated', varianceRate: 0.4, trend: 'down', lastClose: '01:02 GMT' },
]

// Variance patterns across stores
const variancePatterns = [
  {
    id: 1,
    title: 'Card Settlements vs Bank File',
    severity: 'amber',
    affectedSites: 3,
    sites: ['Potters Bar', 'Nine Elms', 'Cromwell Road'],
    description: 'Recurring timing gap between Symphony POS close and Adyen settlement batch. Avg £140 overnight float.',
    trend: 'recurring',
    firstSeen: '3 weeks ago',
  },
  {
    id: 2,
    title: 'Argos Click-and-Collect Handover',
    severity: 'amber',
    affectedSites: 2,
    sites: ['Whitechapel', 'Fulham Wharf'],
    description: 'Argos OMS records collection before main till feed posts. Process gap on handover scan identified.',
    trend: 'new',
    firstSeen: '5 days ago',
  },
  {
    id: 3,
    title: 'Nectar redemption timing',
    severity: 'green',
    affectedSites: 0,
    sites: [],
    description: 'Nectar engine settlement delay causing end-of-day mismatch with SAP. Fixed via API polling adjustment.',
    trend: 'resolved',
    firstSeen: 'Resolved 2 days ago',
  },
]

// Weekly trend data
const weeklyTrend = [
  { day: 'Mon', variance: 12, exceptions: 4 },
  { day: 'Tue', variance: 8, exceptions: 2 },
  { day: 'Wed', variance: 15, exceptions: 5 },
  { day: 'Thu', variance: 6, exceptions: 1 },
  { day: 'Fri', variance: 9, exceptions: 3 },
  { day: 'Sat', variance: 11, exceptions: 4 },
  { day: 'Sun', variance: 7, exceptions: 2 },
]

export default function FinanceOpsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week')

  const totalChecks = propertyStatus.reduce((acc, p) => acc + p.checks, 0)
  const totalPassed = propertyStatus.reduce((acc, p) => acc + p.passed, 0)
  const sitesReady = propertyStatus.filter(p => p.status === 'validated').length
  const sitesWithExceptions = propertyStatus.filter(p => p.status === 'exception').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-2xl text-text">Continuous Close — UK Store Network</h1>
            <StatusBadge variant="amber">
              <Building2 className="w-3 h-3 mr-1" />
              600 Stores
            </StatusBadge>
          </div>
          <p className="text-sm text-text-muted">
            {sitesReady} of 9 sample stores closed clean · {sitesWithExceptions} with exceptions · {totalPassed} of {totalChecks} checks passed · Period close P02 W04
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-1 border border-border rounded-lg p-1">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  selectedPeriod === period
                    ? "bg-gold text-background"
                    : "text-text-muted hover:text-text"
                )}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="border-border text-text-muted">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-1 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green" />
            </div>
            <span className="text-xs text-text-muted">Clean Closes</span>
          </div>
          <div className="font-serif text-3xl text-text">587</div>
          <p className="text-xs text-text-faint mt-1">of 600 UK stores tonight</p>
        </div>
        <div className="bg-surface-1 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber" />
            </div>
            <span className="text-xs text-text-muted">Working Capital Trapped</span>
          </div>
          <div className="font-serif text-3xl text-text">£4.2m</div>
          <p className="text-xs text-text-faint mt-1">unmatched invoices</p>
        </div>
        <div className="bg-surface-1 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-gold" />
            </div>
            <span className="text-xs text-text-muted">Shrinkage Rate</span>
          </div>
          <div className="font-serif text-3xl text-text">0.57%</div>
          <p className="text-xs text-green mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Down from 0.82%
          </p>
        </div>
        <div className="bg-surface-1 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue" />
            </div>
            <span className="text-xs text-text-muted">Patterns Found</span>
          </div>
          <div className="font-serif text-3xl text-text">2</div>
          <p className="text-xs text-text-faint mt-1">recurring this week</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - All Stores Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Status Grid */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber" />
                <h2 className="font-medium text-text">Sample Stores — London Cluster</h2>
              </div>
              <span className="text-xs text-text-faint">{sitesReady} of 9 ready to close</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {propertyStatus.map((property) => (
                <div
                  key={property.name}
                  className={cn(
                    "p-4 rounded-xl border transition-all hover:scale-[1.01]",
                    property.status === 'validated' && "bg-green/5 border-green/20",
                    property.status === 'exception' && "bg-amber/5 border-amber/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text truncate">{property.name}</span>
                    {property.status === 'validated' ? (
                      <CheckCircle className="w-4 h-4 text-green flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-muted">
                      {property.passed}/{property.checks} checks
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "text-xs font-medium",
                        property.varianceRate <= 0.5 ? "text-green" :
                        property.varianceRate <= 0.8 ? "text-gold" : "text-amber"
                      )}>
                        {property.varianceRate}%
                      </span>
                      {property.trend === 'down' && <TrendingDown className="w-3 h-3 text-green" />}
                      {property.trend === 'up' && <TrendingUp className="w-3 h-3 text-amber" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-faint">Close: {property.lastClose}</span>
                    <StatusBadge variant={property.status === 'validated' ? 'green' : 'amber'} className="text-xs">
                      {property.status === 'validated' ? 'Clean' : 'Review'}
                    </StatusBadge>
                  </div>
                  {property.exceptions && (
                    <p className="text-xs text-amber mt-2 truncate">{property.exceptions[0]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Site Comparison - Shrinkage Rate */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-text">Shrinkage Rate by Store</h2>
              <span className="text-xs text-text-faint">This week vs last week</span>
            </div>
            <div className="space-y-3">
              {propertyStatus.slice(0, 6).map((property) => (
                <div key={property.name} className="flex items-center gap-4">
                  <span className="text-sm text-text w-32 truncate">{property.name}</span>
                  <div className="flex-1 bg-surface-2 rounded-full h-2 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        property.varianceRate <= 0.5 ? "bg-green" :
                        property.varianceRate <= 0.8 ? "bg-gold" : "bg-amber"
                      )}
                      style={{ width: `${Math.min(property.varianceRate * 50, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-20 justify-end">
                    <span className={cn(
                      "text-sm font-medium tabular-nums",
                      property.varianceRate <= 0.5 ? "text-green" :
                      property.varianceRate <= 0.8 ? "text-gold" : "text-amber"
                    )}>
                      {property.varianceRate}%
                    </span>
                    {property.trend === 'down' && <TrendingDown className="w-3 h-3 text-green" />}
                    {property.trend === 'up' && <TrendingUp className="w-3 h-3 text-amber" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Variance Patterns */}
        <div className="space-y-6">
          {/* Variance Patterns */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-text">Variance Patterns</h2>
              <span className="text-xs text-text-faint">This Week</span>
            </div>
            <div className="space-y-3">
              {variancePatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className={cn(
                    "p-4 rounded-xl border",
                    pattern.severity === 'amber' && "bg-amber/5 border-amber/20",
                    pattern.severity === 'green' && "bg-green/5 border-green/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text">{pattern.title}</span>
                    {pattern.severity === 'amber' ? (
                      <span className="text-xs text-amber font-medium">{pattern.affectedSites} sites</span>
                    ) : (
                      <span className="text-xs text-green font-medium">Resolved</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mb-2">{pattern.description}</p>
                  {pattern.sites.length > 0 && (
                    <p className="text-xs text-text-faint">
                      Affected: {pattern.sites.join(', ')}
                    </p>
                  )}
                  <p className="text-xs text-text-faint mt-2">{pattern.firstSeen}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4 text-text-muted hover:text-text">
              View All Patterns
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Weekly Trend */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <h2 className="font-medium text-text mb-4">Weekly Trend</h2>
            <div className="flex items-end justify-between h-24 gap-1">
              {weeklyTrend.map((day) => (
                <div key={day.day} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gold/40 rounded-t"
                    style={{ height: `${day.variance * 4}px` }}
                  />
                  <span className="text-xs text-text-faint mt-2">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div>
                <span className="text-xs text-text-muted">Total Variances</span>
                <p className="text-lg font-serif text-text">68</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-muted">Avg per Day</span>
                <p className="text-lg font-serif text-text">9.7</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-amber/5 border border-amber/20 rounded-2xl p-5">
            <h3 className="font-medium text-text mb-3">Bláthnaid Bergin, CFO — Recommended Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-surface-1 rounded-lg hover:bg-surface-2 transition-colors">
                <span className="text-sm text-text">Review card settlement timing</span>
                <p className="text-xs text-text-muted mt-1">3 stores affected this week</p>
              </button>
              <button className="w-full text-left p-3 bg-surface-1 rounded-lg hover:bg-surface-2 transition-colors">
                <span className="text-sm text-text">Argos C&C handover process review</span>
                <p className="text-xs text-text-muted mt-1">New pattern at Whitechapel</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
