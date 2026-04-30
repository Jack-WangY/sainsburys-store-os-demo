"use client"

import { useState } from 'react'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MessageSquare,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  ChevronDown,
  Building2,
} from 'lucide-react'

// Properties
const properties = [
  { id: 'white-city', name: 'White City House' },
  { id: 'shoreditch', name: 'Shoreditch House' },
  { id: 'soho-farmhouse', name: 'Soho Farmhouse' },
  { id: '180-house', name: '180 House' },
  { id: 'electric-house', name: 'Electric House' },
]

// Live data stream from integrated systems
const liveDataStream = [
  { id: 1, category: 'F&B Net Sales', source: 'Simphony', amount: 12450, time: '14:32', status: 'live' },
  { id: 2, category: 'Room Revenue', source: 'Opera', amount: 28900, time: '14:30', status: 'live' },
  { id: 3, category: 'Spa Revenue', source: 'Book4Time', amount: 4200, time: '14:28', status: 'live' },
  { id: 4, category: 'Cinema Sales', source: 'Veezi', amount: 1840, time: '14:25', status: 'live' },
]

// Commentary log entries
const initialCommentary = [
  {
    id: 1,
    type: 'void',
    amount: 340,
    note: 'Kitchen error on Table 14. Wrong dish sent. Remade and comped per GM approval.',
    author: 'James Liu',
    time: '14:32',
    status: 'logged',
  },
  {
    id: 2,
    type: 'comp',
    amount: 85,
    note: 'Birthday dessert for returning member. House policy.',
    author: 'James Liu',
    time: '13:45',
    status: 'logged',
  },
  {
    id: 3,
    type: 'incident',
    amount: null,
    note: 'Spa steam room closed 15:00-17:00 for maintenance. Members notified.',
    author: 'James Liu',
    time: '12:20',
    status: 'logged',
  },
]

// Quick actions for floor manager
const quickActions = [
  { id: 'void', label: 'Log Void', color: 'amber' },
  { id: 'comp', label: 'Log Comp', color: 'gold' },
  { id: 'incident', label: 'Report Incident', color: 'red' },
  { id: 'note', label: 'Add Note', color: 'blue' },
]

export default function FloorManagerDashboard() {
  const [selectedProperty, setSelectedProperty] = useState('white-city')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [commentary, setCommentary] = useState(initialCommentary)
  const [newNote, setNewNote] = useState('')
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [noteAmount, setNoteAmount] = useState('')

  const currentProperty = properties.find(p => p.id === selectedProperty) || properties[0]

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  const handleSubmitNote = () => {
    if (!newNote.trim()) return

    const newEntry = {
      id: Date.now(),
      type: selectedAction || 'note',
      amount: noteAmount ? parseFloat(noteAmount) : null,
      note: newNote,
      author: 'James Liu',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      status: 'logged',
    }

    setCommentary([newEntry, ...commentary])
    setNewNote('')
    setNoteAmount('')
    setSelectedAction(null)
  }

  const totalLogged = commentary.length
  const voidTotal = commentary.filter(c => c.type === 'void').reduce((sum, c) => sum + (c.amount || 0), 0)
  const compTotal = commentary.filter(c => c.type === 'comp').reduce((sum, c) => sum + (c.amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header with Property Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-2xl text-text">Shift Dashboard</h1>
            {/* Property Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border rounded-lg hover:bg-surface-3 transition-colors"
              >
                <Building2 className="w-4 h-4 text-gold" />
                <span className="text-sm text-text">{currentProperty.name}</span>
                <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-surface-1 border border-border rounded-xl shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                  {properties.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => {
                        setSelectedProperty(property.id)
                        setIsDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-surface-2 transition-colors",
                        selectedProperty === property.id ? "text-gold bg-gold/10" : "text-text"
                      )}
                    >
                      {property.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-text-muted">
            Tuesday, 7 April 2026 · Shift: 06:00 - 14:00 · {totalLogged} entries logged
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge variant="blue" className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
            Live Feed Active
          </StatusBadge>
        </div>
      </div>

      {/* Narrative Callout */}
      <div className="p-4 bg-blue/5 rounded-xl border border-blue/10">
        <p className="text-sm text-text leading-relaxed">
          <span className="font-medium">Data flows continuously from integrated systems</span>—Simphony, 
          Opera, Book4Time, Veezi. You no longer enter sales data manually. Instead, add 
          <span className="font-medium"> commentary and context</span> that systems cannot capture: why a void happened, 
          what drove an unusual comp, notes on operational events.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Live Data + Commentary Log */}
        <div className="space-y-6">
          {/* Live Data Stream */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green" />
              <h2 className="font-medium text-text">Live Data Stream</h2>
              <span className="text-xs text-text-faint ml-auto">Auto-updated</span>
            </div>
            <div className="space-y-3">
              {liveDataStream.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-surface-2 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                    <div>
                      <span className="text-sm text-text">{item.category}</span>
                      <span className="text-xs text-text-faint ml-2">via {item.source}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-text font-medium tabular-nums">{formatCurrency(item.amount)}</span>
                    <p className="text-xs text-text-faint">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Summary */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <h2 className="font-medium text-text mb-4">Your Shift Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-surface-2 rounded-xl text-center">
                <p className="text-2xl font-serif text-text">{totalLogged}</p>
                <p className="text-xs text-text-muted mt-1">Entries Logged</p>
              </div>
              <div className="p-4 bg-amber/10 rounded-xl text-center border border-amber/20">
                <p className="text-2xl font-serif text-amber">{formatCurrency(voidTotal)}</p>
                <p className="text-xs text-text-muted mt-1">Voids</p>
              </div>
              <div className="p-4 bg-gold/10 rounded-xl text-center border border-gold/20">
                <p className="text-2xl font-serif text-gold">{formatCurrency(compTotal)}</p>
                <p className="text-xs text-text-muted mt-1">Comps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Commentary Input */}
        <div className="space-y-6">
          {/* Commentary Input */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gold" />
              <h2 className="font-medium text-text">Add Commentary</h2>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-colors border",
                    selectedAction === action.id
                      ? action.color === 'amber' ? "bg-amber/20 text-amber border-amber/30" :
                        action.color === 'gold' ? "bg-gold/20 text-gold border-gold/30" :
                        action.color === 'red' ? "bg-red/20 text-red border-red/30" :
                        "bg-blue/20 text-blue border-blue/30"
                      : "bg-surface-2 text-text-muted border-border hover:bg-surface-3"
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Amount input (for voids/comps) */}
            {(selectedAction === 'void' || selectedAction === 'comp') && (
              <div className="mb-4">
                <label className="text-xs text-text-faint mb-1 block">Amount (£)</label>
                <input
                  type="number"
                  value={noteAmount}
                  onChange={(e) => setNoteAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder:text-text-faint focus:outline-none focus:border-gold"
                />
              </div>
            )}

            {/* Note input */}
            <div className="mb-4">
              <label className="text-xs text-text-faint mb-1 block">Note / Context</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="What happened? Why? Any context Dave or the GM should know..."
                rows={3}
                className="w-full px-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder:text-text-faint focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <Button
              onClick={handleSubmitNote}
              disabled={!newNote.trim()}
              className="w-full bg-gold hover:bg-gold/90 text-background"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Entry
            </Button>

            <p className="text-xs text-text-faint mt-3 text-center">
              Your entries flow to Dave&apos;s revenue audit and the GM&apos;s morning dashboard
            </p>
          </div>

          {/* Commentary Log */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <h2 className="font-medium text-text mb-4">Today&apos;s Commentary</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {commentary.map((entry) => (
                <div
                  key={entry.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    entry.type === 'void' && "bg-amber/5 border-amber/20",
                    entry.type === 'comp' && "bg-gold/5 border-gold/20",
                    entry.type === 'incident' && "bg-red/5 border-red/20",
                    entry.type === 'note' && "bg-surface-2 border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge
                      variant={
                        entry.type === 'void' ? 'amber' :
                        entry.type === 'comp' ? 'gold' :
                        entry.type === 'incident' ? 'red' : 'ghost'
                      }
                      className="text-xs"
                    >
                      {entry.type === 'void' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      {entry.amount && ` - ${formatCurrency(entry.amount)}`}
                    </StatusBadge>
                    <span className="text-xs text-text-faint">{entry.time}</span>
                  </div>
                  <p className="text-sm text-text-muted italic">&ldquo;{entry.note}&rdquo;</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-text-faint">— {entry.author}</p>
                    <CheckCircle className="w-3 h-3 text-green" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
