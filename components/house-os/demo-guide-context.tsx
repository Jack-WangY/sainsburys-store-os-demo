"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface DemoStep {
  id: string
  title: string
  description: string
  persona: 'cfo' | 'ops' | 'gm' | 'all'
  route: string
  highlight?: string // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

export interface DemoScenario {
  id: string
  name: string
  description: string
  persona: 'cfo' | 'ops' | 'gm' | 'all'
  steps: DemoStep[]
}

const demoScenarios: DemoScenario[] = [
  {
    id: 'cfo-morning',
    name: 'CFO Morning Review',
    description: 'A Group CFO\'s morning walk-through of Store OS — from portfolio P&L to supply-chain pulse across 600 Sainsbury\'s stores.',
    persona: 'cfo',
    steps: [
      {
        id: 'cfo-1',
        title: 'Start here — the Today story',
        description: 'Where finance is today: month-end stretches across weeks, manual reconciliations, and audit signal that lags the P&L. Store OS is the answer.',
        persona: 'cfo',
        route: '/story/today',
        position: 'center',
      },
      {
        id: 'cfo-2',
        title: 'The Platform — what changes',
        description: 'Argos AI sits across SAP S/4 HANA, store data, and supply-chain feeds — turning manual close, audit, and reconciliation into continuous, automated flows.',
        persona: 'cfo',
        route: '/story/platform',
        position: 'center',
      },
      {
        id: 'cfo-3',
        title: 'The Beyond — outcomes',
        description: 'Period-end in 1 day, 99%+ auto-cleared variances, and shrinkage caught the same day it happens. This is the financial operating system finance has been waiting for.',
        persona: 'cfo',
        route: '/story/beyond',
        position: 'center',
      },
      {
        id: 'cfo-4',
        title: 'CFO Portfolio P&L',
        description: '600 stores live in a single P&L view. Sales, margin, labour, and shrink — aggregated and drillable in real time, no Monday-morning spreadsheet stitching.',
        persona: 'cfo',
        route: '/portfolio',
        position: 'center',
      },
      {
        id: 'cfo-5',
        title: 'Daily Store Audit',
        description: 'An automated 10-step audit runs every morning across every store. Compliance, cash, food safety, and stock checks all evidenced — finance gets a clean signal by 7am.',
        persona: 'cfo',
        route: '/audit',
        position: 'center',
      },
      {
        id: 'cfo-6',
        title: 'Cash Reconciliation',
        description: 'Variances classified by category — till short, deposit timing, refund anomaly — with 99%+ auto-cleared. Only true exceptions hit a finance analyst\'s queue.',
        persona: 'cfo',
        route: '/reconciliation',
        position: 'center',
      },
      {
        id: 'cfo-7',
        title: 'Continuous Close',
        description: 'Period-end compressed from 8 working days to 1. Journals post continuously, accruals are AI-suggested, and the trial balance is always within a day of go-live.',
        persona: 'cfo',
        route: '/finance-ops',
        position: 'center',
      },
      {
        id: 'cfo-8',
        title: 'Invoice → PO → GRN',
        description: '3-way auto-match on every supplier invoice. Argos AI clears matched lines, routes mismatches with suggested resolutions, and removes the AP backlog entirely.',
        persona: 'cfo',
        route: '/ops',
        position: 'center',
      },
      {
        id: 'cfo-9',
        title: 'Shrinkage & Wastage',
        description: 'Live loss intelligence at SKU and aisle level. Self-checkout shrink, fresh wastage, and sweethearting flagged the same day — not in a quarterly post-mortem.',
        persona: 'cfo',
        route: '/floor',
        position: 'center',
      },
      {
        id: 'cfo-10',
        title: 'DC ↔ Store Flow',
        description: 'The supply-chain pulse: depot dispatches, in-transit, store receipts, and on-shelf availability — one continuous flow, with Argos AI surfacing breaks before they hit sales.',
        persona: 'cfo',
        route: '/data-feed',
        position: 'center',
      },
    ],
  },
  {
    id: 'ops-realtime',
    name: 'Operations Real-Time Monitoring',
    description: 'How a Retail Operations Director monitors live store performance and the supply chain across the estate.',
    persona: 'ops',
    steps: [
      {
        id: 'ops-1',
        title: 'Multi-Site Operations',
        description: 'Live view of 600 stores: sales pace, availability, queue length, and labour-vs-plan. Stores in amber/red surface to the top automatically.',
        persona: 'ops',
        route: '/multi-site',
        position: 'center',
      },
      {
        id: 'ops-2',
        title: 'Store Floor Intelligence',
        description: 'Real-time floor view per store: aisle traffic, gap-scanning, fresh wastage, and self-checkout flags. Argos AI prioritises the next best action for the store team.',
        persona: 'ops',
        route: '/floor',
        position: 'center',
      },
      {
        id: 'ops-3',
        title: 'Supplier & GRN Operations',
        description: 'Goods-received notes, supplier SLAs, and 3-way invoice matching all in one operations console. Mismatches route to the right buyer with one click.',
        persona: 'ops',
        route: '/ops',
        position: 'center',
      },
      {
        id: 'ops-4',
        title: 'DC ↔ Store Flow',
        description: 'Watch the supply chain breathe — depot picks, trunking, store receipts, and shelf-edge availability streaming as one connected flow.',
        persona: 'ops',
        route: '/data-feed',
        position: 'center',
      },
    ],
  },
  {
    id: 'gm-property',
    name: 'Store Manager Daily Check',
    description: 'A Sainsbury\'s Store Manager\'s morning routine — checking last night\'s audit, today\'s plan, and any flagged exceptions.',
    persona: 'gm',
    steps: [
      {
        id: 'gm-1',
        title: 'Store Floor Dashboard',
        description: 'Today\'s store at a glance: sales-vs-plan, availability, colleague cover, and the live exception list from Argos AI.',
        persona: 'gm',
        route: '/floor',
        position: 'center',
      },
      {
        id: 'gm-2',
        title: 'Daily Store Audit',
        description: 'The 10-step audit ran at 6am — cash, fresh, compliance, and stock checks. Two items need a manager sign-off; the rest is auto-cleared.',
        persona: 'gm',
        route: '/audit',
        position: 'center',
      },
      {
        id: 'gm-3',
        title: 'Cash Reconciliation',
        description: 'One till short of £18.40 from yesterday\'s late shift — Argos AI has matched it to a refund mis-key and proposed the journal. Approve and move on.',
        persona: 'gm',
        route: '/reconciliation',
        position: 'center',
      },
      {
        id: 'gm-4',
        title: 'Goods-In Operations',
        description: 'Today\'s deliveries against POs, with a fresh-produce GRN flagged for short-pick. One tap routes the credit claim back to the supplier.',
        persona: 'gm',
        route: '/ops',
        position: 'center',
      },
    ],
  },
]

interface DemoGuideState {
  isActive: boolean
  currentScenario: DemoScenario | null
  currentStepIndex: number
  scenariosCompleted: string[]
}

interface DemoGuideContextValue extends DemoGuideState {
  scenarios: DemoScenario[]
  startScenario: (scenarioId: string) => void
  nextStep: () => void
  prevStep: () => void
  endDemo: () => void
  toggleDemo: () => void
  currentStep: DemoStep | null
  progress: number
}

const DemoGuideContext = createContext<DemoGuideContextValue | null>(null)

export function DemoGuideProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoGuideState>({
    isActive: false,
    currentScenario: null,
    currentStepIndex: 0,
    scenariosCompleted: [],
  })

  const startScenario = useCallback((scenarioId: string) => {
    const scenario = demoScenarios.find(s => s.id === scenarioId)
    if (scenario) {
      setState(prev => ({
        ...prev,
        isActive: true,
        currentScenario: scenario,
        currentStepIndex: 0,
      }))
    }
  }, [])

  const nextStep = useCallback(() => {
    setState(prev => {
      if (!prev.currentScenario) return prev
      const nextIndex = prev.currentStepIndex + 1
      if (nextIndex >= prev.currentScenario.steps.length) {
        return {
          ...prev,
          isActive: false,
          currentScenario: null,
          currentStepIndex: 0,
          scenariosCompleted: [...prev.scenariosCompleted, prev.currentScenario.id],
        }
      }
      return { ...prev, currentStepIndex: nextIndex }
    })
  }, [])

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
    }))
  }, [])

  const endDemo = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      currentScenario: null,
      currentStepIndex: 0,
    }))
  }, [])

  const toggleDemo = useCallback(() => {
    setState(prev => ({ ...prev, isActive: !prev.isActive }))
  }, [])

  const currentStep = state.currentScenario?.steps[state.currentStepIndex] || null
  const progress = state.currentScenario
    ? ((state.currentStepIndex + 1) / state.currentScenario.steps.length) * 100
    : 0

  return (
    <DemoGuideContext.Provider
      value={{
        ...state,
        scenarios: demoScenarios,
        startScenario,
        nextStep,
        prevStep,
        endDemo,
        toggleDemo,
        currentStep,
        progress,
      }}
    >
      {children}
    </DemoGuideContext.Provider>
  )
}

export function useDemoGuide() {
  const context = useContext(DemoGuideContext)
  if (!context) {
    throw new Error('useDemoGuide must be used within a DemoGuideProvider')
  }
  return context
}
