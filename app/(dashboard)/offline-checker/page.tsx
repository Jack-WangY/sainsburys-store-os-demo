"use client"

import { useState } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Server,
  MapPin,
  Calendar,
  ArrowRight,
  History,
  Shield,
  Zap,
} from 'lucide-react'

const terminals = [
  { id: 'T001', name: 'Bar POS 1', property: 'Soho Farmhouse', location: 'Main Bar', status: 'online', lastSeen: 'Now', uptime: 99.98 },
  { id: 'T002', name: 'Bar POS 2', property: 'Soho Farmhouse', location: 'Pool Bar', status: 'online', lastSeen: 'Now', uptime: 99.94 },
  { id: 'T003', name: 'Restaurant POS', property: 'Soho Farmhouse', location: 'The Barn', status: 'online', lastSeen: 'Now', uptime: 100 },
  { id: 'T004', name: 'Front Desk 1', property: '180 House', location: 'Lobby', status: 'online', lastSeen: 'Now', uptime: 99.99 },
  { id: 'T005', name: 'Bar POS', property: 'White City House', location: 'Level 6 Bar', status: 'warning', lastSeen: '2m ago', uptime: 98.42 },
  { id: 'T006', name: 'Gym Check-in', property: 'Shoreditch House', location: 'Gym Entrance', status: 'offline', lastSeen: '15m ago', uptime: 97.21 },
  { id: 'T007', name: 'Cinema Kiosk', property: 'Electric House', location: 'Cinema Lobby', status: 'online', lastSeen: 'Now', uptime: 99.87 },
  { id: 'T008', name: 'Spa Reception', property: 'Soho Farmhouse', location: 'Cowshed Spa', status: 'online', lastSeen: 'Now', uptime: 99.95 },
  { id: 'T009', name: 'Events POS', property: 'Dean Street', location: 'Events Space', status: 'online', lastSeen: 'Now', uptime: 99.91 },
  { id: 'T010', name: 'Rooftop Bar', property: 'Shoreditch House', location: 'Rooftop', status: 'online', lastSeen: 'Now', uptime: 99.88 },
]

const recentIncidents = [
  { 
    id: 'INC001', 
    terminal: 'Gym Check-in', 
    property: 'Shoreditch House', 
    startTime: '14:32', 
    duration: '15m+', 
    status: 'active',
    impact: 'Member check-ins manual'
  },
  { 
    id: 'INC002', 
    terminal: 'Bar POS', 
    property: 'White City House', 
    startTime: '14:45', 
    duration: '2m', 
    status: 'monitoring',
    impact: 'Intermittent connectivity'
  },
  { 
    id: 'INC003', 
    terminal: 'Front Desk 2', 
    property: '180 House', 
    startTime: '11:22', 
    duration: '8m', 
    status: 'resolved',
    impact: 'Resolved - network reset'
  },
  { 
    id: 'INC004', 
    terminal: 'Restaurant POS 2', 
    property: 'Soho Farmhouse', 
    startTime: '09:15', 
    duration: '3m', 
    status: 'resolved',
    impact: 'Resolved - auto-recovery'
  },
]

const propertyHealth = [
  { name: 'Soho Farmhouse', terminals: 12, online: 12, uptime: 99.96 },
  { name: '180 House', terminals: 8, online: 8, uptime: 99.94 },
  { name: 'White City House', terminals: 6, online: 5, uptime: 98.87 },
  { name: 'Shoreditch House', terminals: 7, online: 6, uptime: 98.42 },
  { name: 'Electric House', terminals: 5, online: 5, uptime: 99.91 },
  { name: 'Dean Street', terminals: 4, online: 4, uptime: 99.88 },
]

export default function OfflineCheckerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [filter, setFilter] = useState<'all' | 'issues'>('all')

  const handleScan = async () => {
    setIsScanning(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsScanning(false)
  }

  const onlineCount = terminals.filter(t => t.status === 'online').length
  const warningCount = terminals.filter(t => t.status === 'warning').length
  const offlineCount = terminals.filter(t => t.status === 'offline').length

  const filteredTerminals = filter === 'all' 
    ? terminals 
    : terminals.filter(t => t.status !== 'online')

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Terminals Online"
          icon={<Server className="w-3.5 h-3.5" />}
          value={`${onlineCount}/${terminals.length}`}
          label={offlineCount > 0 ? `${offlineCount} offline` : 'All connected'}
        />
        <KPICard
          title="Overall Uptime"
          icon={<CheckCircle className="w-3.5 h-3.5" />}
          value="99.74%"
          delta={{ direction: 'up', value: '0.12%', label: 'vs last week' }}
        />
        <KPICard
          title="Active Incidents"
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          value={`${offlineCount + warningCount}`}
          label="Requiring attention"
        />
        <KPICard
          title="Avg Recovery Time"
          icon={<Clock className="w-3.5 h-3.5" />}
          value="4.2m"
          delta={{ direction: 'down', value: '18%', label: 'faster' }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Terminal Grid & Incidents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Terminal Status Grid */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-text">Terminal Status</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      "px-3 py-1 text-xs rounded-md transition-all",
                      filter === 'all'
                        ? "bg-surface-3 text-text"
                        : "text-text-muted hover:text-text"
                    )}
                  >
                    All ({terminals.length})
                  </button>
                  <button
                    onClick={() => setFilter('issues')}
                    className={cn(
                      "px-3 py-1 text-xs rounded-md transition-all",
                      filter === 'issues'
                        ? "bg-amber text-background"
                        : "text-text-muted hover:text-text"
                    )}
                  >
                    Issues ({offlineCount + warningCount})
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3"
                >
                  <RefreshCw className={cn("w-4 h-4 mr-2", isScanning && "animate-spin")} />
                  {isScanning ? 'Scanning...' : 'Scan Now'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTerminals.map((terminal) => (
                <div
                  key={terminal.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    terminal.status === 'online' && "bg-surface-2 border-[rgba(255,255,255,0.05)]",
                    terminal.status === 'warning' && "bg-amber-dim/20 border-amber-dim/50",
                    terminal.status === 'offline' && "bg-red-dim/20 border-red-dim/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        terminal.status === 'online' && "bg-green",
                        terminal.status === 'warning' && "bg-amber animate-pulse",
                        terminal.status === 'offline' && "bg-red"
                      )} />
                      <span className="text-sm text-text font-medium">{terminal.name}</span>
                    </div>
                    <StatusBadge
                      variant={
                        terminal.status === 'online' ? 'green' :
                        terminal.status === 'warning' ? 'amber' : 'red'
                      }
                    >
                      {terminal.status === 'online' ? 'Online' :
                       terminal.status === 'warning' ? 'Degraded' : 'Offline'}
                    </StatusBadge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {terminal.property}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {terminal.lastSeen}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                    <span className="text-xs text-text-faint">{terminal.location}</span>
                    <span className={cn(
                      "text-xs tabular-nums",
                      terminal.uptime >= 99.9 ? "text-green" :
                      terminal.uptime >= 99 ? "text-amber" : "text-red"
                    )}>
                      {terminal.uptime.toFixed(2)}% uptime
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Recent Incidents</h3>
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    incident.status === 'active' && "bg-red-dim/20 border-red-dim/50",
                    incident.status === 'monitoring' && "bg-amber-dim/20 border-amber-dim/50",
                    incident.status === 'resolved' && "bg-surface-2 border-[rgba(255,255,255,0.05)]"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {incident.status === 'active' ? (
                        <WifiOff className="w-5 h-5 text-red flex-shrink-0 mt-0.5" />
                      ) : incident.status === 'monitoring' ? (
                        <AlertTriangle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm text-text font-medium">{incident.terminal}</p>
                        <p className="text-xs text-text-muted">{incident.property}</p>
                        <p className="text-xs text-text-faint mt-1">{incident.impact}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge
                        variant={
                          incident.status === 'active' ? 'red' :
                          incident.status === 'monitoring' ? 'amber' : 'green'
                        }
                      >
                        {incident.status === 'active' ? 'Active' :
                         incident.status === 'monitoring' ? 'Monitoring' : 'Resolved'}
                      </StatusBadge>
                      <div className="flex items-center gap-2 mt-2 text-xs text-text-faint">
                        <Clock className="w-3 h-3" />
                        {incident.startTime} • {incident.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Property Health & Info */}
        <div className="space-y-6">
          {/* Property Health */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Property Health</h3>
            <div className="space-y-4">
              {propertyHealth.map((prop) => (
                <div key={prop.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text">{prop.name}</span>
                    <span className={cn(
                      "text-xs tabular-nums",
                      prop.online === prop.terminals ? "text-green" : "text-amber"
                    )}>
                      {prop.online}/{prop.terminals}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          prop.uptime >= 99.9 ? "bg-green" :
                          prop.uptime >= 99 ? "bg-amber" : "bg-red"
                        )}
                        style={{ width: `${prop.uptime}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-faint tabular-nums w-14 text-right">
                      {prop.uptime.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Today&apos;s Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">Total Incidents</span>
                </div>
                <span className="text-sm text-text tabular-nums">4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">Auto-Recovered</span>
                </div>
                <span className="text-sm text-green tabular-nums">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">Manual Interventions</span>
                </div>
                <span className="text-sm text-text tabular-nums">1</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">MTTR</span>
                </div>
                <span className="text-sm text-text tabular-nums">4.2 min</span>
              </div>
            </div>
          </div>

          {/* Active Alert Panel */}
          {offlineCount > 0 && (
            <div className="bg-red-dim/30 border border-red-dim/50 rounded-[var(--radius-xl)] p-5">
              <div className="flex items-start gap-3">
                <WifiOff className="w-5 h-5 text-red flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-text font-medium">Terminal Offline</h4>
                  <p className="text-xs text-text-muted mt-1">
                    Gym Check-in at Shoreditch House has been offline for 15 minutes. 
                    Site team notified.
                  </p>
                  <Button size="sm" className="mt-3 bg-red hover:bg-red/90 text-white">
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* System Info */}
          <div className="bg-green-dim/30 border border-green-dim/50 rounded-[var(--radius-xl)] p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-text font-medium">Monitoring Active</h4>
                <p className="text-xs text-text-muted mt-1">
                  All terminals polled every 30 seconds. Auto-recovery enabled for network issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
