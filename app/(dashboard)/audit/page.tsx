"use client"

import { useState } from 'react'
import { StatusBadge } from '@/components/house-os/status-badge'
import { ChatInterface } from '@/components/house-os/chat-interface'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Building2,
} from 'lucide-react'

// Stores with status
const properties = [
  { id: 'potters-bar', name: "Sainsbury's Potters Bar", abbr: 'PTB', status: 'ready' },
  { id: 'nine-elms', name: "Sainsbury's Nine Elms", abbr: 'NEL', status: 'ready' },
  { id: 'kings-cross', name: "Sainsbury's Local King's Cross", abbr: 'KGX', status: 'ready' },
  { id: 'whitechapel', name: "Sainsbury's Whitechapel", abbr: 'WCH', status: 'exception' },
  { id: 'cromwell-road', name: "Sainsbury's Cromwell Road", abbr: 'CRM', status: 'ready' },
  { id: 'holborn', name: "Sainsbury's Local Holborn", abbr: 'HOL', status: 'ready' },
  { id: 'fulham-wharf', name: "Sainsbury's Fulham Wharf", abbr: 'FUL', status: 'ready' },
  { id: 'argos-stratford', name: 'Argos Stratford (in-store)', abbr: 'ARG', status: 'ready' },
  { id: 'brighton-marina', name: "Sainsbury's Brighton Marina", abbr: 'BRM', status: 'pending' },
]

// Exception-first data structure
const closeStatus = [
  { area: 'Grocery Tills', system: 'Symphony POS', status: 'validated', amount: 142380 },
  { area: 'Fresh & Ambient', system: 'Tellermate', status: 'validated', amount: 58420 },
  { area: 'Argos in-store', system: 'Argos OMS', status: 'exception', amount: 18640, exception: { variance: 312, note: "Argos OMS shows £18,952 settled. Main till feed reports £18,640 received. £312 timing variance flagged on click-and-collect handover." } },
  { area: 'Fuel & Online', system: 'Forecourt + GOL', status: 'validated', amount: 41280 },
  { area: 'Nectar Redemptions', system: 'Nectar Engine', status: 'validated', amount: 7240 },
]

const oracleJournals = [
  { ref: 'JE-7841', title: 'Net Sales Journal', properties: 9, amount: 142380, status: 'posted' },
  { ref: 'JE-7842', title: 'Fresh & Ambient COGS', properties: 9, amount: 58420, status: 'posted' },
  { ref: 'JE-7843', title: 'Argos & Fuel Revenue', properties: 6, amount: 18640, status: 'pending' },
  { ref: 'JE-7844', title: 'Nectar & Promotions', properties: 9, amount: 7240, status: 'posted' },
]

const floorCommentary = [
  { time: '22:15', author: 'Priya Shah', role: 'Daily Audit Lead', note: 'Late delivery of fresh produce held back ambient putaway. Additional £1,240 wastage write-off captured after initial close.' },
  { time: '23:40', author: 'Priya Shah', role: 'Daily Audit Lead', note: 'Self-checkout #4 offline for 90 minutes. 3 customers redirected to colleague till. No short-stock impact recorded.' },
  { time: '00:15', author: 'Marcus Reid', role: 'Store Manager', note: 'Approved wastage adjustments. Argos timing variance on click-and-collect expected to clear by morning settlement.' },
]

const initialMessages = [
  { id: '1', content: 'Good evening, Priya. Daily store audit initiated at 00:48 GMT. 9 stores queued.', sender: 'system' as const },
  { id: '2', content: '246 of 248 checks passed automatically. 2 items flagged for your review.', sender: 'system' as const },
  { id: '3', content: 'Show me the Argos in-store exception.', sender: 'user' as const },
  { id: '4', content: 'Argos in-store shows a £312 timing variance between the Argos OMS (£18,952) and main till feed (£18,640). Daily Audit Lead noted a click-and-collect handover delay. Variance expected to clear by morning settlement. Recommend: Approve with note.', sender: 'system' as const },
]

export default function NightAudit() {
  const [messages, setMessages] = useState(initialMessages)
  const [showValidated, setShowValidated] = useState(false)
  const [exceptionApproved, setExceptionApproved] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState('whitechapel')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentProperty = properties.find(p => p.id === selectedProperty) || properties[0]

  const validatedCount = closeStatus.filter(s => s.status === 'validated').length
  const exceptionCount = closeStatus.filter(s => s.status === 'exception').length
  const allClear = exceptionCount === 0 || exceptionApproved
  const postedJournals = oracleJournals.filter(j => j.status === 'posted').length

  const handleSendMessage = (content: string) => {
    const newUserMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user' as const,
    }
    setMessages((prev) => [...prev, newUserMessage])

    setTimeout(() => {
      let response = 'Acknowledged. I\'ve updated the audit log with your note.'

      if (content.toLowerCase().includes('approve') || content.toLowerCase().includes('clear')) {
        response = 'Exception approved and logged. All areas now validated. Ready for close authorisation.'
        setExceptionApproved(true)
      } else if (content.toLowerCase().includes('status')) {
        response = `Current status: ${validatedCount} areas validated, ${exceptionApproved ? 0 : exceptionCount} exceptions pending. ${postedJournals} of ${oracleJournals.length} journals posted.`
      }

      const systemMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'system' as const,
      }
      setMessages((prev) => [...prev, systemMessage])
    }, 1000)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value)

  return (
    <div className="space-y-6">
      {/* Store Selector & Status Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl text-text">Daily Store Audit</h1>
          {/* Store Dropdown */}
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
                      "w-full text-left px-4 py-2 text-sm hover:bg-surface-2 transition-colors flex items-center justify-between",
                      selectedProperty === property.id ? "text-gold bg-gold/10" : "text-text"
                    )}
                  >
                    <span>{property.name}</span>
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      property.status === 'ready' && "bg-green",
                      property.status === 'exception' && "bg-amber",
                      property.status === 'pending' && "bg-text-muted"
                    )} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close Status Banner */}
      <div className={cn(
        "rounded-2xl p-6 border",
        allClear
          ? "bg-green/10 border-green/30"
          : "bg-amber/10 border-amber/30"
      )}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              allClear ? "bg-green/20" : "bg-amber/20"
            )}>
              {allClear ? (
                <Shield className="w-7 h-7 text-green" />
              ) : (
                <AlertTriangle className="w-7 h-7 text-amber" />
              )}
            </div>
            <div>
              <h2 className="font-serif text-xl text-text">
                {allClear ? "Ready for Close Authorisation" : "1 Exception Requires Review"}
              </h2>
              <p className="text-sm text-text-muted mt-1">
                7 April 2026 · {validatedCount} of {closeStatus.length} areas validated · {postedJournals} journals posted
              </p>
            </div>
          </div>
          <Button
            size="lg"
            disabled={!allClear}
            className={cn(
              "px-8",
              allClear
                ? "bg-green hover:bg-green/90 text-background"
                : "bg-surface-2 text-text-muted cursor-not-allowed"
            )}
          >
            Authorise Close
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Exceptions & Validated */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exceptions First */}
          {!exceptionApproved && closeStatus.filter(s => s.status === 'exception').length > 0 && (
            <div className="bg-surface-1 border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-amber/5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber" />
                  <h2 className="font-medium text-text">Exceptions Requiring Review</h2>
                  <span className="text-xs text-amber bg-amber/20 px-2 py-0.5 rounded-full ml-auto">
                    {closeStatus.filter(s => s.status === 'exception').length} item
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {closeStatus.filter(s => s.status === 'exception').map((item) => (
                  <div key={item.area} className="bg-amber/5 rounded-xl p-4 border border-amber/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-medium text-text">{item.area}</span>
                        <span className="text-xs text-text-muted ml-2">via {item.system}</span>
                      </div>
                      <span className="text-sm text-amber bg-amber/10 px-2 py-0.5 rounded font-medium">
                        {formatCurrency(item.exception?.variance || 0)} variance
                      </span>
                    </div>
                    <p className="text-sm text-text-muted mb-4">{item.exception?.note}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs flex-1">
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs flex-1 bg-green hover:bg-green/90 text-background"
                        onClick={() => setExceptionApproved(true)}
                      >
                        Approve Exception
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validated Areas (Collapsible) */}
          <div className="bg-surface-1 border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowValidated(!showValidated)}
              className="w-full p-4 border-b border-border flex items-center justify-between hover:bg-surface-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green" />
                <h2 className="font-medium text-text">Validated Areas</h2>
                <span className="text-xs text-green bg-green/20 px-2 py-0.5 rounded-full">
                  {validatedCount + (exceptionApproved ? 1 : 0)} passed
                </span>
              </div>
              {showValidated ? (
                <ChevronUp className="w-5 h-5 text-text-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-muted" />
              )}
            </button>
            {showValidated && (
              <div className="p-4 space-y-2">
                {closeStatus.filter(s => s.status === 'validated' || (s.status === 'exception' && exceptionApproved)).map((item) => (
                  <div
                    key={item.area}
                    className="flex items-center justify-between p-3 bg-surface-2 rounded-lg border border-green/20"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green" />
                      <span className="text-sm text-text">{item.area}</span>
                      <span className="text-xs text-text-faint">via {item.system}</span>
                    </div>
                    <span className="text-sm text-text tabular-nums">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SAP S/4 HANA Status */}
          <div className="bg-surface-1 border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-text">SAP S/4 HANA Journals</h2>
                <span className="text-xs text-text-muted">{postedJournals} of {oracleJournals.length} posted</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {oracleJournals.map((journal) => (
                <div
                  key={journal.ref}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    journal.status === 'posted' && "bg-green/5 border-green/20",
                    journal.status === 'pending' && "bg-surface-2 border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {journal.status === 'posted' ? (
                      <CheckCircle className="w-4 h-4 text-green" />
                    ) : (
                      <Clock className="w-4 h-4 text-text-muted animate-pulse" />
                    )}
                    <div>
                      <span className="text-sm text-text">{journal.title}</span>
                      <span className="text-xs text-text-faint ml-2">{journal.ref} · {journal.properties} stores</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text tabular-nums">{formatCurrency(journal.amount)}</span>
                    <StatusBadge variant={journal.status === 'posted' ? 'green' : 'ghost'}>
                      {journal.status === 'posted' ? 'Posted' : 'Pending'}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Commentary & Chat */}
        <div className="space-y-6">
          {/* Daily Audit Lead Commentary */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue" />
              <h3 className="font-medium text-text">Shift Commentary</h3>
            </div>
            <div className="space-y-3">
              {floorCommentary.map((comment, i) => (
                <div key={i} className="p-3 bg-surface-2 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-text">{comment.author}</span>
                    <span className="text-xs text-text-faint">{comment.time}</span>
                  </div>
                  <p className="text-sm text-text-muted">{comment.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Argos AI Chat */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <h3 className="font-medium text-text mb-4">Argos AI Audit Assistant</h3>
            <div className="h-[280px]">
              <ChatInterface
                messages={messages}
                onSend={handleSendMessage}
                placeholder="Ask about exceptions..."
                userInitials="P"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
