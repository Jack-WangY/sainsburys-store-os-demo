"use client"

import { useState } from 'react'
import { AlertStrip } from '@/components/house-os/alert-strip'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Wifi,
  WifiOff,
  Check,
  AlertTriangle,
  Trash2,
  Eye,
  Clock,
  ArrowRight,
  Database,
  CheckCircle,
  RefreshCw,
} from 'lucide-react'

const offlineTransactions = [
  { ref: 'TX-0038', time: '21:52', outlet: 'Main Bar', description: 'Card payment — Member', amount: 84, posMatch: { status: 'matched', ref: 'POS#22110' } },
  { ref: 'TX-0039', time: '21:58', outlet: 'Main Bar', description: 'Card payment — Guest', amount: 126, posMatch: { status: 'matched', ref: 'POS#22111' } },
  { ref: 'TX-0040', time: '22:05', outlet: 'Main Bar', description: 'Card payment — Tab close', amount: 210, posMatch: { status: 'matched', ref: 'POS#22112' } },
  { ref: 'TX-0041', time: '22:12', outlet: 'Main Bar', description: 'Card payment — Duplicate entry', amount: 340, posMatch: { status: 'duplicate', ref: 'POS#22114' } },
  { ref: 'TX-0042', time: '22:18', outlet: 'Main Bar', description: 'Card payment — Member', amount: 65, posMatch: { status: 'matched', ref: 'POS#22115' } },
  { ref: 'TX-0043', time: '22:25', outlet: 'Main Bar', description: 'Card payment — Guest', amount: 142, posMatch: { status: 'matched', ref: 'POS#22116' } },
]

const outageHistory = [
  { date: '7 Apr', time: '21:48–22:34', property: 'White City House', duration: '46 min', txCount: 6, status: 'resolved' },
  { date: '3 Apr', time: '14:22–14:45', property: 'Shoreditch House', duration: '23 min', txCount: 4, status: 'resolved' },
  { date: '28 Mar', time: '19:05–19:28', property: '180 House', duration: '23 min', txCount: 3, status: 'resolved' },
]

const processSteps = [
  { step: 1, title: 'Capture', description: 'Staff creates local transaction record during POS outage with amount, time, and description.' },
  { step: 2, title: 'Recovery', description: 'When systems recover, House OS pulls all POS transactions from the affected period.' },
  { step: 3, title: 'Match', description: 'AI matches offline records to POS entries, flagging duplicates and mismatches.' },
  { step: 4, title: 'Post', description: 'Validated transactions post to Oracle Fusion. Exceptions held for auditor review.' },
]

export default function OfflineChecker() {
  const [transactions, setTransactions] = useState(offlineTransactions)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleRemove = async (ref: string) => {
    setIsRemoving(ref)
    await new Promise(resolve => setTimeout(resolve, 800))
    setTransactions(prev => prev.filter(t => t.ref !== ref))
    setIsRemoving(null)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 4000)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  const duplicateTransaction = transactions.find(t => t.posMatch.status === 'duplicate')

  return (
    <div className="space-y-6">
      {/* Alert Strip */}
      <AlertStrip
        variant="warning"
        title="White City House — POS Outage Detected"
        description="Main bar POS was offline from 21:48 to 22:34 GMT (46 minutes). 6 offline transactions captured and matched."
        dismissible={false}
      />

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div className="bg-green-dim border border-[rgba(74,158,107,0.3)] rounded-xl p-4 shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green" />
            <div>
              <p className="text-sm text-text font-medium">TX-0041 removed</p>
              <p className="text-xs text-text-muted">White City bar revenue £3,780 posted to Oracle GL. JE-7844 created.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Transactions & Guidance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Offline Transactions Table */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-amber" />
                <h3 className="font-serif text-lg text-text">Offline Transactions — White City</h3>
              </div>
              <span className="text-xs text-text-muted">21:48–22:34 GMT</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)]">
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">TX Ref</th>
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">Time</th>
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">Outlet</th>
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">Description</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-2">Amount</th>
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">POS Match</th>
                    <th className="text-left uppercase-label text-text-faint py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.ref}
                      className={cn(
                        "border-b border-[rgba(255,255,255,0.05)] transition-all duration-300",
                        tx.posMatch.status === 'duplicate' && "bg-amber-dim/20 border-l-2 border-l-amber",
                        isRemoving === tx.ref && "opacity-0 translate-x-4"
                      )}
                    >
                      <td className="py-3 px-2 text-sm text-text tabular-nums">{tx.ref}</td>
                      <td className="py-3 px-2 text-sm text-text-muted tabular-nums">{tx.time}</td>
                      <td className="py-3 px-2 text-sm text-text-muted">{tx.outlet}</td>
                      <td className="py-3 px-2 text-sm text-text">{tx.description}</td>
                      <td className="py-3 px-2 text-sm text-text text-right tabular-nums font-medium">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 px-2">
                        {tx.posMatch.status === 'matched' ? (
                          <span className="text-xs text-green flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Matched {tx.posMatch.ref}
                          </span>
                        ) : (
                          <span className="text-xs text-amber flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Possible dup {tx.posMatch.ref}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {tx.posMatch.status === 'duplicate' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3 h-7"
                            >
                              Keep
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRemove(tx.ref)}
                              className="text-xs bg-red hover:bg-red/90 text-white h-7"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resolution Guidance */}
          {duplicateTransaction && (
            <div className="bg-amber-dim/30 border border-[rgba(212,133,90,0.3)] rounded-[var(--radius-xl)] p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber" />
                </div>
                <div className="flex-1">
                  <h4 className="text-text font-medium mb-2">Resolution Required: TX-0041</h4>
                  <p className="text-sm text-text-muted mb-4">
                    This transaction appears to be a duplicate of POS#22114. The amounts match (£340) and the timestamps are within 2 minutes.
                    Removing this duplicate will release the Oracle hold on White City bar revenue.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => duplicateTransaction && handleRemove(duplicateTransaction.ref)}
                      className="bg-red hover:bg-red/90 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove TX-0041
                    </Button>
                    <Button variant="outline" className="border-[rgba(255,255,255,0.12)] text-text-muted hover:bg-surface-3">
                      <Eye className="w-4 h-4 mr-2" />
                      View POS#22114
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - History & How It Works */}
        <div className="space-y-6">
          {/* Outage History */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">Outage History</h3>
            <div className="space-y-3">
              {outageHistory.map((outage, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface-2 border border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text font-medium">{outage.property}</span>
                    <StatusBadge variant="green">Resolved</StatusBadge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{outage.date}</span>
                    <span>{outage.time}</span>
                    <span>{outage.duration}</span>
                    <span>{outage.txCount} TXs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <h3 className="font-serif text-lg text-text mb-4">How It Works</h3>
            <div className="space-y-4">
              {processSteps.map((step, i) => (
                <div key={step.step} className="relative flex gap-4">
                  {i !== processSteps.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[rgba(255,255,255,0.07)]" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 z-10">
                    <span className="text-xs font-bold text-gold">{step.step}</span>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-text font-medium">{step.title}</p>
                    <p className="text-xs text-text-muted mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Oracle Integration Status */}
          <div className="bg-surface-1 border border-[rgba(255,255,255,0.07)] rounded-[var(--radius-xl)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-gold" />
              <h3 className="font-serif text-lg text-text">Oracle Integration</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-2">
                <span className="text-sm text-text">Connection</span>
                <StatusBadge variant="green">Active</StatusBadge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-2">
                <span className="text-sm text-text">Last Sync</span>
                <span className="text-xs text-text-muted">02:41 GMT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-dim/30 border border-[rgba(212,133,90,0.2)]">
                <span className="text-sm text-text">Pending</span>
                <span className="text-xs text-amber">1 journal held</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
