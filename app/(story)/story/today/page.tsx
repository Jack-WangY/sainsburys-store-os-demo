"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Clock,
  FileText,
  Banknote,
  Building2,
  PackageX,
  Truck,
  Database,
  AlertTriangle,
  } from 'lucide-react'

// Key impact stats - large prominent cards
const impactStats = [
  {
    value: '11 days',
    label: 'Period-End Close',
    sublabel: 'Finance team works late, every cycle',
  },
  {
    value: '4',
    label: 'Systems',
    sublabel: 'POS, SAP, Manhattan WMS, supplier portals',
  },
  {
    value: '600+',
    label: 'Stores',
    sublabel: 'Reconciled by hand each period',
  },
  {
    value: '£2.1B',
    label: 'Annual Shrink',
    sublabel: 'UK grocery industry estimate',
  },
]

// Timeline events - 6 stages with pain points
const timelineEvents = [
  {
    id: 'cash-office',
    time: '06:00',
    label: 'Cash Office Z-Read',
    description: 'Each store cash office captures the previous day\'s Z-read from POS lanes and Tellermate counts, then sends totals to head office.',
    painPoints: ['Tellermate and POS variances reconciled by hand across 600+ stores, no standard template'],
    icon: Banknote,
  },
  {
    id: 'invoices',
    time: '09:00',
    label: 'Supplier Invoices Arrive',
    description: 'Hundreds of supplier invoices land in the AP inbox. The team tries to match each one to its purchase order and the goods receipt note from the DC.',
    painPoints: [
      '3-way match (invoice vs PO vs GRN) done in spreadsheets',
      '14-day SLA constantly missed; working capital trapped'
    ],
    icon: FileText,
  },
  {
    id: 'shrinkage',
    time: '11:00',
    label: 'Shrinkage & Wastage Tally',
    description: 'Store managers email through their shrink and wastage totals from the previous week, sometimes earlier.',
    painPoints: [
      'Up to 2-week lag between event and visibility',
      'No category-level shrink trend; high-risk stores invisible until period end'
    ],
    icon: PackageX,
  },
  {
    id: 'transfers',
    time: '14:00',
    label: 'Inter-company Transfers',
    description: 'Inventory moves between RDCs, dark stores and supermarkets. Finance tries to mirror those flows in the ledger.',
    painPoints: [
      'Manual journal entries across DCs and stores',
      'Mis-coded shrinkage hidden inside transfer adjustments'
    ],
    icon: Truck,
  },
  {
    id: 'period-close',
    time: '17:00',
    label: 'Period-End Roll-up',
    description: 'The daily audit team consolidates store totals, supplier accruals, and DC movements into the period-close pack.',
    painPoints: [
      '11 working days to close',
      'Finance team works evenings and weekends to hit the deadline'
    ],
    icon: Database,
  },
  {
    id: 'cfo-pack',
    time: '21:00',
    label: 'CFO Board Pack',
    description: 'Analysts pull the latest figures into the CFO\'s board pack so leadership can see how the period landed.',
    painPoints: [
      'Dashboards built manually in Excel each cycle',
      'Numbers stale by the time the CFO reads them in the morning'
    ],
    icon: Building2,
  },
]

// Business impact - aligned with narrative ending
const businessImpact = [
  {
    title: 'Working Capital Trapped',
    description: 'Unmatched supplier invoices sit in suspense for weeks. Cash that should fund growth is stuck in reconciliation queues.',
  },
  {
    title: 'Shrinkage Discovered Too Late',
    description: 'By the time category managers see a shrink spike, the cause has moved on. There is no chance to act in the moment.',
  },
  {
    title: 'Period-End Is a Fire Drill',
    description: 'Eleven working days of late nights, manual journals and chased emails — close is an event, not a process the business can rely on.',
  },
]

export default function TodayPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>('cash-office')

  return (
    <div className="min-h-screen bg-[#CEC0B2]">
      {/* Hero Section */}
      <section className="relative py-12 px-6 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="uppercase-label text-black mb-4 block">Where We Are Today</span>

            {/* Sainsbury's wordmark */}
            <div className="flex flex-col items-center justify-center mb-6">
              <span className="font-serif text-3xl tracking-wide text-black">Sainsbury&apos;s</span>
              <span className="text-xs tracking-[0.3em] text-black/60 font-medium mt-1">STORE OS</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl text-black mb-4">
              The Period-Close Challenge
            </h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto">
              Every period across 600+ stores, the daily audit team manually closes the books.
              See how it impacts finance and supply chain — and why change is needed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats - Large Cards like reference */}
      <section className="py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#EBE3DB] border border-black/10 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl md:text-5xl font-serif text-black mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-black/80 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-black/60">{stat.sublabel}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section - Like reference */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Section Header */}
            <div className="bg-white/50 border border-black/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-black/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl text-black mb-1">A Day in the Life of Period Close</h2>
                    <p className="text-sm text-black/60">Click any event to explore what happens</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-black/60" />
                    <span className="text-black/60">Close cycle takes</span>
                    <span className="text-red font-medium">11 working days</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6">
                <p className="text-xs text-black/60 text-center mb-6">Click any step to see details</p>

                {/* Timeline Visual */}
                <div className="relative">
                  {/* Horizontal connector line - behind nodes */}
                  <div className="absolute top-6 left-8 right-8 h-1 bg-black/20 rounded-full" />

                  {/* Event Nodes */}
                  <div className="relative flex justify-between pb-4">
                    {timelineEvents.map((event) => {
                      const Icon = event.icon
                      const isSelected = selectedEvent === event.id

                      const hasPainPoints = event.painPoints.length > 0

                      return (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                          className="flex flex-col items-center group cursor-pointer relative z-10"
                        >
                          {/* Spotlight effect for selected */}
                          {isSelected && (
                            <div className="absolute -inset-4 bg-gold/20 rounded-full blur-xl -z-10" />
                          )}

                          {/* Pain label on selected */}
                          {isSelected && hasPainPoints && (
                            <span className="absolute -top-6 text-[10px] font-bold text-red uppercase tracking-wider">
                              Pain
                            </span>
                          )}

                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all bg-white border-black/60",
                            isSelected
                              ? "ring-4 ring-gold/50 scale-110 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                              : "group-hover:scale-110 group-hover:shadow-lg"
                          )}>
                            <Icon className="w-5 h-5 text-black/70" />
                          </div>

                          <span className={cn(
                            "text-xs font-medium mt-1 text-center max-w-[80px] transition-colors",
                            isSelected ? "text-gold font-semibold" : "text-black group-hover:text-gold"
                          )}>
                            {event.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Selected Event Detail */}
                {selectedEvent && (
                  <motion.div
                    key={selectedEvent}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    {(() => {
                      const event = timelineEvents.find(e => e.id === selectedEvent)
                      if (!event) return null
                      const Icon = event.icon
                      const hasPainPoints = event.painPoints.length > 0

                      return (
                        <div className="rounded-xl border p-5 bg-white/60 border-black/10 backdrop-blur-sm">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/70">
                              <Icon className="w-5 h-5 text-black/60" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-black mb-1">{event.label}</h3>
                              <p className="text-sm text-black/70 mb-3">{event.description}</p>
                              {hasPainPoints && (
                                <div className="space-y-2">
                                  <ul className="space-y-1">
                                    {event.painPoints.map((pain, idx) => (
                                      <li key={idx} className="text-sm text-red flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red mt-0.5 flex-shrink-0" />
                                        {pain}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {!hasPainPoints && (
                                <p className="text-sm text-green font-medium">No pain points at this stage.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="font-serif text-2xl text-black text-center mb-6">CFO Pain Points</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {businessImpact.map((point) => (
                <div key={point.title} className="bg-white/50 border border-black/10 rounded-xl p-5">
                  <h3 className="font-medium text-black mb-2">{point.title}</h3>
                  <p className="text-sm text-black/70">{point.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA to Tomorrow */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-xl text-black font-serif leading-relaxed mb-6">
              &ldquo;The period closes — eventually. But it costs us cash, blinds us to shrink, and burns out the team that holds it together.&rdquo;
            </p>

            <Link href="/story/beyond">
              <Button className="bg-gold hover:bg-gold/90 text-background px-8 py-6 text-base">
                See the Solution
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
