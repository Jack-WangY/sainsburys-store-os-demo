"use client"

import { useState, useEffect } from 'react'
import { KPICard } from '@/components/house-os/kpi-card'
import { StatusBadge } from '@/components/house-os/status-badge'
import { AuditStep } from '@/components/house-os/audit-step'
import { ChatInterface } from '@/components/house-os/chat-interface'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Activity,
  Utensils,
  Wine,
  Dumbbell,
  Film,
  Sparkles,
  Check,
  Pause,
  Play,
} from 'lucide-react'

interface Transaction {
  id: string
  time: string
  property: string
  description: string
  amount: number
  type: 'food' | 'bar' | 'gym' | 'cinema' | 'spa'
  isNew?: boolean
}

const initialTransactions: Transaction[] = [
  { id: '1', time: '16:54', property: 'Farmhouse', description: 'Gym session — PT training', amount: 45, type: 'gym' },
  { id: '2', time: '16:52', property: 'Shoreditch', description: 'Bar tab — Membership drinks', amount: 84, type: 'bar' },
  { id: '3', time: '16:48', property: 'Farmhouse', description: 'Table 14 — dinner for 4', amount: 212, type: 'food' },
  { id: '4', time: '16:45', property: 'White City', description: 'Cinema screening — 8 tickets', amount: 160, type: 'cinema' },
  { id: '5', time: '16:42', property: '180 House', description: 'Rooftop bar — champagne service', amount: 280, type: 'bar' },
  { id: '6', time: '16:38', property: 'Dean Street', description: 'Restaurant — lunch for 2', amount: 94, type: 'food' },
  { id: '7', time: '16:35', property: 'Electric', description: 'Bar tab — cocktails', amount: 56, type: 'bar' },
  { id: '8', time: '16:32', property: 'Farmhouse', description: 'Spa treatment — massage', amount: 120, type: 'spa' },
  { id: '9', time: '16:28', property: 'Shoreditch', description: 'Gym — day pass', amount: 25, type: 'gym' },
  { id: '10', time: '16:25', property: 'White City', description: 'Restaurant — afternoon tea', amount: 68, type: 'food' },
  { id: '11', time: '16:22', property: '180 House', description: 'Bar — wine service', amount: 145, type: 'bar' },
  { id: '12', time: '16:18', property: 'Farmhouse', description: 'Table 8 — room service', amount: 78, type: 'food' },
]

const newTransactionTemplates = [
  { property: 'Farmhouse', description: 'Table 22 — dinner for 6', amount: 342, type: 'food' as const },
  { property: 'Shoreditch', description: 'Rooftop bar — sunset drinks', amount: 156, type: 'bar' as const },
  { property: 'White City', description: 'Cinema private screening', amount: 450, type: 'cinema' as const },
  { property: '180 House', description: 'Restaurant — business lunch', amount: 180, type: 'food' as const },
  { property: 'Electric', description: 'Gym — PT session', amount: 65, type: 'gym' as const },
  { property: 'Farmhouse', description: 'Spa — couples treatment', amount: 280, type: 'spa' as const },
  { property: 'Dean Street', description: 'Bar — cocktail masterclass', amount: 95, type: 'bar' as const },
  { property: 'Shoreditch', description: 'Cinema — member screening', amount: 120, type: 'cinema' as const },
]

const pendingConfirmations: { id: string; title: string; description: string; status: 'active' | 'pending' | 'done' }[] = [
  { id: '1', title: 'Cinema upload', description: 'Electric House — 124 tickets, £3,720 gross', status: 'active' },
  { id: '2', title: 'Event tab close', description: 'White City — Private dining £2,800', status: 'active' },
  { id: '3', title: 'Spa late charges', description: 'Farmhouse — 3 treatments, £360', status: 'pending' },
]

const initialMessages: { id: string; content: string; sender: 'system' | 'user' }[] = [
  { id: '1', content: 'What would you like to log? (e.g. "comp table 12 guest Jane Smith £240 approved by GM")', sender: 'system' },
]

export default function LiveDataFeed() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isPaused, setIsPaused] = useState(false)
  const [messages, setMessages] = useState<{ id: string; content: string; sender: 'system' | 'user' }[]>(initialMessages)
  const [confirmations, setConfirmations] = useState<{ id: string; title: string; description: string; status: 'active' | 'pending' | 'done' }[]>(pendingConfirmations)

  // Simulate live feed
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const template = newTransactionTemplates[Math.floor(Math.random() * newTransactionTemplates.length)]
      const now = new Date()
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        time,
        ...template,
        isNew: true,
      }

      setTransactions((prev) => [newTransaction, ...prev.slice(0, 29).map(t => ({ ...t, isNew: false }))])
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused])

  const handleSendMessage = (content: string) => {
    const newUserMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user' as const,
    }
    setMessages((prev) => [...prev, newUserMessage])

    setTimeout(() => {
      // Parse the message and extract details
      const amountMatch = content.match(/£(\d+)/)
      const nameMatch = content.match(/(?:guest|for)\s+([A-Z][a-z]+(?:\s+[A-Z]\.?)?)/i)
      
      const systemMessage = {
        id: (Date.now() + 1).toString(),
        content: `Logged and queued for confirmation:\n\n• Amount: ${amountMatch ? `£${amountMatch[1]}` : 'TBD'}\n• Guest: ${nameMatch ? nameMatch[1] : 'Guest'}\n• GL: COMP-PR\n• Status: Awaiting audit confirmation\n\nEntry appears in pending queue above.`,
        sender: 'system' as const,
      }
      setMessages((prev) => [...prev, systemMessage])
    }, 1000)
  }

  const handleConfirm = (id: string) => {
    setConfirmations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'done' as const } : c))
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return Utensils
      case 'bar': return Wine
      case 'gym': return Dumbbell
      case 'cinema': return Film
      case 'spa': return Sparkles
      default: return Activity
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'food': return 'bg-gold'
      case 'bar': return 'bg-amber'
      case 'gym': return 'bg-green'
      case 'cinema': return 'bg-blue'
      case 'spa': return 'bg-purple-500'
      default: return 'bg-text-muted'
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  const todayTotal = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Transactions Today"
          icon={<Activity className="w-3.5 h-3.5" />}
          value={transactions.length.toString()}
          label="Across all properties"
        />
        <KPICard
          title="Revenue Captured"
          value={formatCurrency(todayTotal)}
          label="Real-time total"
          delta={{ direction: 'up', value: '12.4%', label: 'vs yesterday' }}
        />
        <KPICard
          title="Pending Confirmations"
          value={confirmations.filter((c) => c.status !== 'done').length.toString()}
          label="Staff entries awaiting review"
        />
        <KPICard
          title="Feed Status"
          value={isPaused ? 'Paused' : 'Live'}
          label="Auto-updating every 4s"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Live feed */}
        <div className="lg:col-span-2 bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isPaused ? "bg-text-muted" : "bg-green animate-pulse-dot"
              )} />
              <h3 className="font-serif text-lg text-text">Real-Time Transaction Feed</h3>
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
            {transactions.map((tx) => {
              const Icon = getTypeIcon(tx.type)
              return (
                <div
                  key={tx.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                    tx.isNew && "bg-gold-glow animate-slide-in",
                    !tx.isNew && "hover:bg-surface-2"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getTypeColor(tx.type))} />
                  <span className="text-xs text-text-faint tabular-nums w-12">{tx.time}</span>
                  <span className="text-sm text-text-muted w-24">{tx.property}</span>
                  <span className="text-sm text-text flex-1 truncate">{tx.description}</span>
                  <span className={cn(
                    "text-sm tabular-nums font-medium",
                    tx.type === 'food' && "text-gold",
                    tx.type === 'bar' && "text-amber",
                    tx.type === 'gym' && "text-green",
                    tx.type === 'cinema' && "text-blue",
                    tx.type === 'spa' && "text-purple-400"
                  )}>
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap gap-4">
            {[
              { type: 'food', label: 'F&B', color: 'bg-gold' },
              { type: 'bar', label: 'Bar', color: 'bg-amber' },
              { type: 'gym', label: 'Gym', color: 'bg-green' },
              { type: 'cinema', label: 'Cinema', color: 'bg-blue' },
              { type: 'spa', label: 'Spa', color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", item.color)} />
                <span className="text-xs text-text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Confirmations & Chat */}
        <div className="space-y-6">
          {/* Staff Input Queue */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Pending Confirmations</h3>
            <div className="space-y-3">
              {confirmations.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-300",
                    item.status === 'done'
                      ? "bg-green-dim/30 border-[rgba(74,158,107,0.2)]"
                      : "bg-surface-2 border-[rgba(255,255,255,0.05)]"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-text font-medium">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.description}</p>
                    </div>
                    {item.status === 'done' ? (
                      <StatusBadge variant="green" icon={<Check className="w-3 h-3" />}>
                        Done
                      </StatusBadge>
                    ) : (
                      <StatusBadge variant={item.status === 'active' ? 'gold' : 'ghost'}>
                        {item.status === 'active' ? 'Review' : 'Pending'}
                      </StatusBadge>
                    )}
                  </div>
                  {item.status !== 'done' && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleConfirm(item.id)}
                        className="bg-green hover:bg-green/90 text-background text-xs"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3 text-xs"
                      >
                        Query
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Staff Chat */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Quick Staff Input</h3>
            <div className="h-[300px]">
              <ChatInterface
                messages={messages}
                onSend={handleSendMessage}
                placeholder="Log comp, void, or staff entry..."
                userInitials="TW"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
