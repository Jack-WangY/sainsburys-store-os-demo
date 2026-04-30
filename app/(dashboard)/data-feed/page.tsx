"use client"

import { useState, useEffect } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Truck,
  PackageCheck,
  Apple,
  ShoppingBag,
  ArrowRight,
  Pause,
  Play,
  Activity,
  Warehouse,
  Building2,
  Users,
  Smartphone,
} from 'lucide-react'

type FlowType = 'dispatch' | 'receipt' | 'fresh' | 'pick' | 'collect' | 'oos'

interface FlowEvent {
  id: string
  time: string
  origin: string
  destination: string
  description: string
  amount: number
  type: FlowType
  isNew?: boolean
}

const initialEvents: FlowEvent[] = [
  { id: '1',  time: '16:54', origin: 'DC Waltham Point', destination: "Sainsbury's Potters Bar",       description: '12 cages dispatched — ambient grocery',          amount: 28400, type: 'dispatch' },
  { id: '2',  time: '16:52', origin: 'DC Tamworth',      destination: "Sainsbury's Nine Elms",         description: 'Fresh produce — 8 pallets received',             amount: 14200, type: 'receipt'  },
  { id: '3',  time: '16:48', origin: 'DC Charlton',      destination: "Sainsbury's Whitechapel",       description: 'Chilled lamb (Cranswick) — booked in',            amount: 18900, type: 'fresh'    },
  { id: '4',  time: '16:45', origin: 'Online Store',     destination: 'Nine Elms picking hub',         description: 'Online groceries — 14 customer orders picking', amount:  4280, type: 'pick'     },
  { id: '5',  time: '16:42', origin: 'Argos Stratford',  destination: 'Customer collection',           description: 'Click & collect — 6 GM orders ready',             amount:  1840, type: 'collect'  },
  { id: '6',  time: '16:38', origin: 'DC Rye Park',      destination: "Sainsbury's Cromwell Road",     description: 'BWS load — 220 cases',                            amount: 32100, type: 'dispatch' },
  { id: '7',  time: '16:35', origin: 'Müller UK',        destination: 'DC Waltham Point',              description: 'Inbound dairy — 18 pallets',                      amount: 22400, type: 'fresh'    },
  { id: '8',  time: '16:32', origin: "Sainsbury's Potters Bar", destination: 'Replen system', description: 'OOS alert: Soft drinks aisle (3 SKUs)',                  amount:   680, type: 'oos'      },
  { id: '9',  time: '16:28', origin: 'DC Daventry',      destination: "Sainsbury's Brighton Marina",   description: 'Frozen load — 14 cages',                          amount: 19800, type: 'dispatch' },
  { id: '10', time: '16:25', origin: 'Online Store',     destination: 'Cromwell Rd picking hub',       description: 'Online groceries — 9 orders dispatched to van',  amount:  2940, type: 'pick'     },
  { id: '11', time: '16:22', origin: 'Argos Stratford',  destination: 'Customer collection',           description: 'In-store Argos collection — 4 orders',            amount:  1120, type: 'collect'  },
  { id: '12', time: '16:18', origin: 'DC Hams Hall',     destination: "Sainsbury's Fulham Wharf",      description: 'Mixed grocery cage — 24 cages',                   amount: 26200, type: 'dispatch' },
]

const newEventTemplates: Omit<FlowEvent, 'id' | 'time' | 'isNew'>[] = [
  { origin: 'DC Waltham Point',  destination: "Sainsbury's Cromwell Road",  description: 'Ambient grocery cage dispatch',           amount: 24800, type: 'dispatch' },
  { origin: 'DC Charlton',       destination: "Sainsbury's Whitechapel",    description: 'Fresh meat (Hilton) — booked in',         amount: 31200, type: 'fresh'    },
  { origin: 'Online Store',      destination: 'Nine Elms picking hub',      description: 'Online groceries — 22 orders queued',     amount:  6840, type: 'pick'     },
  { origin: 'Argos Stratford',   destination: 'Customer collection',        description: 'Click & collect — Tu clothing ready',      amount:  1480, type: 'collect'  },
  { origin: "Sainsbury's Brighton Marina", destination: 'Replen system',    description: 'OOS alert: Bakery — 2 SKUs',              amount:   420, type: 'oos'      },
  { origin: 'Bakkavor',          destination: 'DC Charlton',                description: 'Inbound chilled prepared — 12 pallets',    amount: 18600, type: 'fresh'    },
  { origin: 'DC Rye Park',       destination: "Sainsbury's Local King's Cross", description: 'Convenience top-up — 4 cages',         amount:  6800, type: 'dispatch' },
  { origin: "Sainsbury's Potters Bar", destination: 'Customer (in-store)',  description: 'Argos in-store pickup completed',          amount:   240, type: 'collect'  },
]

export default function DCStoreFlowPage() {
  const [events, setEvents] = useState<FlowEvent[]>(initialEvents)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      const tpl = newEventTemplates[Math.floor(Math.random() * newEventTemplates.length)]
      const now = new Date()
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      const newEvent: FlowEvent = { id: Date.now().toString(), time, ...tpl, isNew: true }
      setEvents((prev) => [newEvent, ...prev.slice(0, 29).map(e => ({ ...e, isNew: false }))])
    }, 4000)
    return () => clearInterval(interval)
  }, [isPaused])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  const getTypeIcon = (type: FlowType) => {
    switch (type) {
      case 'dispatch': return Truck
      case 'receipt':  return PackageCheck
      case 'fresh':    return Apple
      case 'pick':     return ShoppingBag
      case 'collect':  return Users
      case 'oos':      return Activity
    }
  }

  const getTypeColor = (type: FlowType) => {
    switch (type) {
      case 'dispatch': return 'bg-gold'
      case 'receipt':  return 'bg-green'
      case 'fresh':    return 'bg-amber'
      case 'pick':     return 'bg-blue'
      case 'collect':  return 'bg-purple-500'
      case 'oos':      return 'bg-red'
    }
  }

  const getTypeText = (type: FlowType) => {
    switch (type) {
      case 'dispatch': return 'text-gold'
      case 'receipt':  return 'text-green'
      case 'fresh':    return 'text-amber'
      case 'pick':     return 'text-blue'
      case 'collect':  return 'text-purple-400'
      case 'oos':      return 'text-red'
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Trucks in Transit"
          icon={<Truck className="w-3.5 h-3.5" />}
          value="318"
          label="DCs → stores · live"
          delta={{ direction: 'up', value: '+12', label: 'vs last hour' }}
        />
        <KPICard
          title="On-Time Delivery"
          icon={<PackageCheck className="w-3.5 h-3.5" />}
          value="97.4%"
          label="Today across estate"
          delta={{ direction: 'up', value: '+1.2pts', label: 'WoW' }}
        />
        <KPICard
          title="OOS Lines Now"
          icon={<Activity className="w-3.5 h-3.5" />}
          value="1,284"
          label="Out-of-stock SKU/store combos"
          delta={{ direction: 'down', value: '-18%', label: 'vs 09:00' }}
        />
        <KPICard
          title="Fresh Waste @ DC"
          icon={<Apple className="w-3.5 h-3.5" />}
          value="£18.4k"
          label="Today across all DCs"
          delta={{ direction: 'down', value: '-9%', label: 'WoW' }}
        />
        <KPICard
          title="Click & Collect Today"
          icon={<ShoppingBag className="w-3.5 h-3.5" />}
          value="142,800"
          label="Online + Argos orders"
          delta={{ direction: 'up', value: '6.2%' }}
        />
      </div>

      {/* Flow diagram */}
      <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-6">
        <h3 className="font-serif text-lg text-text mb-6">Suppliers → DC → Stores → Customers</h3>
        <div className="grid grid-cols-1 md:grid-cols-9 gap-3 items-center">
          <div className="md:col-span-2 p-4 rounded-xl bg-surface-2 border border-border text-center">
            <Apple className="w-6 h-6 text-amber mx-auto mb-2" />
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Suppliers</p>
            <p className="text-sm text-text font-medium">1,840 active</p>
            <p className="text-xs text-text-faint">Britvic · Müller · Cranswick · ABF · Nestlé · Hilton</p>
          </div>
          <ArrowRight className="hidden md:block w-5 h-5 text-text-faint mx-auto" />
          <div className="md:col-span-2 p-4 rounded-xl bg-surface-2 border border-border text-center">
            <Warehouse className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Distribution Centres</p>
            <p className="text-sm text-text font-medium">23 DCs</p>
            <p className="text-xs text-text-faint">Waltham Pt · Charlton · Tamworth · Daventry · Rye Park</p>
          </div>
          <ArrowRight className="hidden md:block w-5 h-5 text-text-faint mx-auto" />
          <div className="md:col-span-2 p-4 rounded-xl bg-surface-2 border border-border text-center">
            <Building2 className="w-6 h-6 text-green mx-auto mb-2" />
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Stores</p>
            <p className="text-sm text-text font-medium">600</p>
            <p className="text-xs text-text-faint">147 superstores · 821 Locals · 712 Argos · 32 central</p>
          </div>
          <ArrowRight className="hidden md:block w-5 h-5 text-text-faint mx-auto" />
          <div className="md:col-span-1 p-4 rounded-xl bg-surface-2 border border-border text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Users className="w-5 h-5 text-blue" />
              <Smartphone className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Customers</p>
            <p className="text-sm text-text font-medium">6.4M today</p>
            <p className="text-xs text-text-faint">In-store + Online</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="p-3 rounded-lg bg-gold/5 border border-gold/15">
            <p className="text-xs text-text-muted">DC dispatches today</p>
            <p className="text-lg text-gold font-semibold tabular-nums">4,820</p>
          </div>
          <div className="p-3 rounded-lg bg-green/5 border border-green/15">
            <p className="text-xs text-text-muted">Store goods receipts</p>
            <p className="text-lg text-green font-semibold tabular-nums">4,712</p>
          </div>
          <div className="p-3 rounded-lg bg-blue/5 border border-blue/15">
            <p className="text-xs text-text-muted">Online groceries picking</p>
            <p className="text-lg text-blue font-semibold tabular-nums">38,200</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs text-text-muted">Argos C&C completed</p>
            <p className="text-lg text-purple-400 font-semibold tabular-nums">104,600</p>
          </div>
        </div>
      </div>

      {/* Live transaction feed */}
      <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isPaused ? "bg-text-muted" : "bg-green animate-pulse-dot"
            )} />
            <h3 className="font-serif text-lg text-text">Live DC ↔ Store Flow</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3"
          >
            {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>

        <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
          {events.map((evt) => {
            const Icon = getTypeIcon(evt.type)
            return (
              <div
                key={evt.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                  evt.isNew && "bg-gold-glow animate-slide-in",
                  !evt.isNew && "hover:bg-surface-2"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getTypeColor(evt.type))} />
                <Icon className={cn("w-4 h-4 flex-shrink-0", getTypeText(evt.type))} />
                <span className="text-xs text-text-faint tabular-nums w-12">{evt.time}</span>
                <div className="w-48 flex-shrink-0">
                  <p className="text-xs text-text-muted">{evt.origin}</p>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-text-faint" />
                    <p className="text-xs text-text">{evt.destination}</p>
                  </div>
                </div>
                <span className="text-sm text-text-muted flex-1 truncate">{evt.description}</span>
                <span className={cn("text-sm tabular-nums font-medium", getTypeText(evt.type))}>
                  {formatCurrency(evt.amount)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap gap-4">
          {[
            { type: 'dispatch' as FlowType, label: 'DC dispatch',    color: 'bg-gold' },
            { type: 'receipt' as FlowType,  label: 'Store receipt',  color: 'bg-green' },
            { type: 'fresh' as FlowType,    label: 'Fresh delivery', color: 'bg-amber' },
            { type: 'pick' as FlowType,     label: 'Online pick',    color: 'bg-blue' },
            { type: 'collect' as FlowType,  label: 'Click & collect', color: 'bg-purple-500' },
            { type: 'oos' as FlowType,      label: 'OOS alert',      color: 'bg-red' },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", item.color)} />
              <span className="text-xs text-text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
