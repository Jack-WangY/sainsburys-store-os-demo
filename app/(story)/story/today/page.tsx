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
  Users,
  Building2,
  Moon,
  RefreshCw,
  Database,
  AlertTriangle,
  } from 'lucide-react'

// Key impact stats - large prominent cards
const impactStats = [
  {
    value: '3',
    label: 'Hours Nightly',
    sublabel: 'Up to 3 hours manual close',
  },
  {
    value: '4',
    label: 'Systems',
    sublabel: 'Fragmented integration',
  },
  {
    value: '1',
    label: 'Person',
    sublabel: 'Single point of failure',
  },
  {
    value: '0',
    label: 'Audit Trail',
    sublabel: 'No visibility',
  },
]

// Timeline events - 6 stages with pain points
const timelineEvents = [
  {
    id: 'verify-outlet',
    time: '23:00',
    label: 'Verify Outlet Closure',
    description: 'The night supervisor confirms that all hotel outlets have been closed and no more transactions need to be entered.',
    painPoints: ['Inconsistent processes across sites, undocumented'],
    icon: Users,
  },
  {
    id: 'initiate-close',
    time: '23:30',
    label: 'Initiate Hotel Operational Close',
    description: 'Before any financial processing can begin, the night supervisor validates that the Hotel operations are fully captured.',
    painPoints: ['Manual data entry into Opera with low integrity, cascading errors downstream'],
    icon: Database,
  },
  {
    id: 'consolidate-revenue',
    time: '00:00',
    label: 'Consolidate All Revenue Streams',
    description: 'The night supervisor ensures no revenue source has been left out.',
    painPoints: [
      'Unreliable Simphony to Opera feed creates silent gaps',
      'Manual rekeying corrupts data integrity'
    ],
    icon: Building2,
  },
  {
    id: 'reconciliation',
    time: '01:00',
    label: 'Reconciliation',
    description: 'This is the core of the night audit. The night supervisor reconciles totals across all systems.',
    painPoints: [
      'Hours of manual line-by-line work across 4 systems',
      'Single operator dependency with no backup',
      'Failed integrations create correction work',
      'No audit trail - logic lives in spreadsheets'
    ],
    icon: RefreshCw,
  },
  {
    id: 'close-system',
    time: '02:30',
    label: 'Close the System',
    description: 'Once reconciliation is complete and all figures stack up, the night supervisor closes out Opera and this will integrate with the ERP.',
    painPoints: [],
    icon: Moon,
  },
  {
    id: 'reporting',
    time: '03:00',
    label: 'Reporting and Distribution',
    description: "The night supervisor's final task is producing and distributing the day's reporting outputs.",
    painPoints: [
      'Manually compiled reports with weekly rollups',
      'Different reports per site, no portfolio view',
      'Leadership working from stale data'
    ],
    icon: FileText,
  },
]

// Business impact - aligned with narrative ending
const businessImpact = [
  {
    title: 'Residual Uncertainty',
    description: '"Did I catch everything? Was there something I missed?" The night supervisor leaves tired, never fully certain.',
  },
  {
    title: 'No Audit Trail',
    description: 'The trail exists only in the night supervisor\'s memory and a spreadsheet only they understand. No one else can follow it.',
  },
  {
    title: 'Prone to Human Error',
    description: 'Manual data entry and reconciliation across multiple systems increases the risk of mistakes, omissions, and inconsistencies.',
  },
]

export default function TodayPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>('verify-outlet')

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
            
            {/* Soho House Logo */}
            <div className="flex flex-col items-center justify-center mb-6">
              {/* 3x3 Grid Icon */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-2">
                <rect x="4" y="4" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
                <rect x="18" y="4" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
                <rect x="32" y="4" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
                <rect x="4" y="18" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
                <rect x="18" y="18" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
                <rect x="32" y="18" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
                <rect x="4" y="32" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
                <rect x="18" y="32" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
                <rect x="32" y="32" width="12" height="12" stroke="black" strokeWidth="1.5" fill="none" />
              </svg>
              <span className="text-sm tracking-[0.3em] text-black font-medium">SOHO HOUSE</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl text-black mb-4">
              The Revenue Audit Challenge
            </h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto">
              Every night across each property, one person manually closes the books. 
              See how it impacts operations and why change is needed.
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
                    <h2 className="font-serif text-2xl text-black mb-1">A Night in the Life</h2>
                    <p className="text-sm text-black/60">Click any event to explore what happens</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-black/60" />
                    <span className="text-black/60">Process takes</span>
                    <span className="text-red font-medium">up to 3 hours</span>
                    <span className="text-black/60">nightly</span>
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
            <h2 className="font-serif text-2xl text-black text-center mb-6">Impact on Soho House</h2>
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
              &ldquo;The close is done. But it was effort-heavy, inconsistent, and entirely dependent on one person.&rdquo;
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
