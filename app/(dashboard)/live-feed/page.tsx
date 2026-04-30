"use client"

import { useState, useEffect } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Activity,
  Wifi,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Circle,
  Pause,
  Play,
} from 'lucide-react'

interface FeedEvent {
  id: string
  timestamp: Date
  system: string
  property: string
  eventType: 'transaction' | 'checkin' | 'sync' | 'alert' | 'batch'
  message: string
  amount?: number
  status: 'success' | 'warning' | 'error'
}

const systemStatus = [
  { name: 'Opera PMS', status: 'online', latency: 42, lastSync: '2s ago' },
  { name: 'Simphony POS', status: 'online', latency: 38, lastSync: '1s ago' },
  { name: 'Spa Soft', status: 'online', latency: 156, lastSync: '5s ago' },
  { name: 'Jonas Club', status: 'degraded', latency: 892, lastSync: '45s ago' },
  { name: 'Adyen Payments', status: 'online', latency: 28, lastSync: '0s ago' },
  { name: 'Oracle GL', status: 'online', latency: 124, lastSync: '30s ago' },
  { name: 'Fourth Inventory', status: 'online', latency: 67, lastSync: '10s ago' },
  { name: 'Rotaready', status: 'online', latency: 54, lastSync: '8s ago' },
]

const initialEvents: FeedEvent[] = [
  { id: '1', timestamp: new Date(), system: 'Simphony', property: 'Soho Farmhouse', eventType: 'transaction', message: 'Restaurant check closed', amount: 284, status: 'success' },
  { id: '2', timestamp: new Date(Date.now() - 2000), system: 'Opera', property: '180 House', eventType: 'checkin', message: 'Guest check-in completed', status: 'success' },
  { id: '3', timestamp: new Date(Date.now() - 4000), system: 'Adyen', property: 'White City House', eventType: 'transaction', message: 'Card payment processed', amount: 156, status: 'success' },
  { id: '4', timestamp: new Date(Date.now() - 6000), system: 'Jonas Club', property: 'Dean Street', eventType: 'sync', message: 'Member data sync delayed', status: 'warning' },
  { id: '5', timestamp: new Date(Date.now() - 8000), system: 'Oracle GL', property: 'All Properties', eventType: 'batch', message: 'Nightly batch completed', status: 'success' },
  { id: '6', timestamp: new Date(Date.now() - 10000), system: 'Spa Soft', property: 'Soho Farmhouse', eventType: 'transaction', message: 'Spa booking confirmed', amount: 180, status: 'success' },
]

const eventTemplates = [
  { system: 'Simphony', property: 'Soho Farmhouse', eventType: 'transaction' as const, message: 'Bar tab closed', amount: 67 },
  { system: 'Opera', property: '180 House', eventType: 'checkin' as const, message: 'Room charge posted', amount: 42 },
  { system: 'Adyen', property: 'Shoreditch House', eventType: 'transaction' as const, message: 'Contactless payment', amount: 28 },
  { system: 'Simphony', property: 'White City House', eventType: 'transaction' as const, message: 'Restaurant order placed', amount: 94 },
  { system: 'Fourth', property: 'All Properties', eventType: 'sync' as const, message: 'Stock levels updated' },
  { system: 'Rotaready', property: 'Electric House', eventType: 'sync' as const, message: 'Shift clock-in recorded' },
]

export default function LiveFeedPage() {
  const [events, setEvents] = useState<FeedEvent[]>(initialEvents)
  const [isPaused, setIsPaused] = useState(false)
  const [eventsPerSecond, setEventsPerSecond] = useState(2.4)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      const newEvent: FeedEvent = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        system: template.system,
        property: template.property,
        eventType: template.eventType,
        message: template.message,
        amount: template.amount ? template.amount + Math.floor(Math.random() * 50) : undefined,
        status: Math.random() > 0.95 ? 'warning' : 'success',
      }
      
      setEvents(prev => [newEvent, ...prev.slice(0, 49)])
      setEventsPerSecond(2 + Math.random() * 1.5)
    }, 800 + Math.random() * 400)

    return () => clearInterval(interval)
  }, [isPaused])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const onlineCount = systemStatus.filter(s => s.status === 'online').length
  const degradedCount = systemStatus.filter(s => s.status === 'degraded').length

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Systems Online"
          icon={<Server className="w-3.5 h-3.5" />}
          value={`${onlineCount}/${systemStatus.length}`}
          label={degradedCount > 0 ? `${degradedCount} degraded` : 'All healthy'}
        />
        <KPICard
          title="Events / Second"
          icon={<Activity className="w-3.5 h-3.5" />}
          value={eventsPerSecond.toFixed(1)}
          delta={{ direction: 'up', value: '12%', label: 'vs avg' }}
        />
        <KPICard
          title="Avg Latency"
          icon={<Zap className="w-3.5 h-3.5" />}
          value="68ms"
          label="Across all integrations"
        />
        <KPICard
          title="Data Freshness"
          icon={<Clock className="w-3.5 h-3.5" />}
          value="Real-time"
          label="Last sync: just now"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Live Event Stream */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-lg text-text">Live Event Stream</h3>
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs",
                  isPaused ? "bg-amber-dim/30 text-amber" : "bg-green-dim/30 text-green"
                )}>
                  <Circle className={cn("w-2 h-2 fill-current", !isPaused && "animate-pulse")} />
                  {isPaused ? 'Paused' : 'Live'}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
            </div>

            <div className="h-[480px] overflow-y-auto space-y-2 pr-2">
              {events.map((event, idx) => (
                <div
                  key={event.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-300",
                    idx === 0 && !isPaused && "animate-pulse",
                    event.status === 'success' && "bg-surface-2 border-[rgba(255,255,255,0.05)]",
                    event.status === 'warning' && "bg-amber-dim/20 border-amber-dim/50",
                    event.status === 'error' && "bg-red-dim/20 border-red-dim/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                        event.status === 'success' && "bg-green",
                        event.status === 'warning' && "bg-amber",
                        event.status === 'error' && "bg-red"
                      )} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-text-faint tabular-nums">
                            {formatTime(event.timestamp)}
                          </span>
                          <StatusBadge variant="ghost" className="text-[10px]">
                            {event.system}
                          </StatusBadge>
                          <span className="text-xs text-text-muted">{event.property}</span>
                        </div>
                        <p className="text-sm text-text mt-1">{event.message}</p>
                      </div>
                    </div>
                    {event.amount && (
                      <span className="text-sm text-gold tabular-nums flex-shrink-0">
                        {formatCurrency(event.amount)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - System Status */}
        <div className="space-y-6">
          {/* Integration Status */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-text">Integration Status</h3>
              <Button variant="ghost" size="sm" className="text-text-muted hover:text-text">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {systemStatus.map((system) => (
                <div
                  key={system.name}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    system.status === 'online' && "bg-surface-2",
                    system.status === 'degraded' && "bg-amber-dim/20 border border-amber-dim/50",
                    system.status === 'offline' && "bg-red-dim/20 border border-red-dim/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      system.status === 'online' && "bg-green",
                      system.status === 'degraded' && "bg-amber",
                      system.status === 'offline' && "bg-red"
                    )} />
                    <span className="text-sm text-text">{system.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-xs tabular-nums",
                      system.latency < 100 && "text-green",
                      system.latency >= 100 && system.latency < 500 && "text-amber",
                      system.latency >= 500 && "text-red"
                    )}>
                      {system.latency}ms
                    </span>
                    <span className="text-xs text-text-faint">{system.lastSync}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Flow Metrics */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Data Flow</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-green" />
                  <span className="text-sm text-text-muted">Inbound</span>
                </div>
                <span className="text-sm text-text tabular-nums">847 events/min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-blue" />
                  <span className="text-sm text-text-muted">Outbound</span>
                </div>
                <span className="text-sm text-text tabular-nums">234 events/min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gold" />
                  <span className="text-sm text-text-muted">Queue Depth</span>
                </div>
                <span className="text-sm text-green tabular-nums">0 (empty)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">Bandwidth</span>
                </div>
                <span className="text-sm text-text tabular-nums">2.4 MB/s</span>
              </div>
            </div>
          </div>

          {/* Active Alert */}
          <div className="bg-amber-dim/30 border border-amber-dim/50 rounded-[var(--radius-xl)] p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-text font-medium">Jonas Club Degraded</h4>
                <p className="text-xs text-text-muted mt-1">
                  Response times elevated. Member sync delayed by ~45 seconds. Investigating.
                </p>
                <Button size="sm" variant="ghost" className="mt-2 text-amber hover:bg-amber/10 p-0 h-auto">
                  View Details
                </Button>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-green-dim/30 border border-green-dim/50 rounded-[var(--radius-xl)] p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-text font-medium">Core Systems Healthy</h4>
                <p className="text-xs text-text-muted mt-1">
                  PMS, POS, and Payment gateways all operating within normal parameters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
