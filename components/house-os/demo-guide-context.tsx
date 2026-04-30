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
    description: 'Walk through a typical morning review for a Group CFO checking multi-site performance.',
    persona: 'cfo',
    steps: [
      {
        id: 'cfo-1',
        title: 'Portfolio Overview',
        description: 'Start with the portfolio dashboard to see aggregate performance across all 9 properties. RevPAR index shows we\'re 4.2% ahead of competitive set.',
        persona: 'cfo',
        route: '/portfolio',
        position: 'center',
      },
      {
        id: 'cfo-2',
        title: 'Financial Performance',
        description: 'The C-Level view consolidates P&L data from all properties. Notice how labour costs are trending 1.4% under budget this week.',
        persona: 'cfo',
        route: '/clevel',
        position: 'center',
      },
      {
        id: 'cfo-3',
        title: 'Night Audit Status',
        description: 'Check that all properties closed successfully. 8 of 9 properties show green - Soho Farmhouse is still processing final payments.',
        persona: 'cfo',
        route: '/audit',
        position: 'center',
      },
      {
        id: 'cfo-4',
        title: 'Reconciliation Confidence',
        description: '248 automated checkpoints run each night. 99.2% auto-cleared - only 2 items need human review. This used to take 3 finance staff 4+ hours.',
        persona: 'cfo',
        route: '/reconciliation',
        position: 'center',
      },
    ],
  },
  {
    id: 'ops-realtime',
    name: 'Operations Real-Time Monitoring',
    description: 'How an Operations Director monitors real-time data flow and system health across properties.',
    persona: 'ops',
    steps: [
      {
        id: 'ops-1',
        title: 'Live Data Feed',
        description: 'Watch transactions flow in real-time from all POS and PMS systems. The live feed shows 2.4 events per second during peak hours.',
        persona: 'ops',
        route: '/live-feed',
        position: 'center',
      },
      {
        id: 'ops-2',
        title: 'System Integration Status',
        description: 'All 8 core integrations show green. Jonas Club is showing elevated latency - we\'re monitoring but member data sync is delayed by ~45 seconds.',
        persona: 'ops',
        route: '/live-feed',
        position: 'center',
      },
      {
        id: 'ops-3',
        title: 'Terminal Health',
        description: 'The offline checker monitors 42 terminals across all properties. One gym check-in terminal at Shoreditch is offline - site team has been auto-notified.',
        persona: 'ops',
        route: '/offline-checker',
        position: 'center',
      },
      {
        id: 'ops-4',
        title: 'Labour Efficiency',
        description: 'Real-time labour tracking shows we\'re 97.8% efficient against target. Kitchen overtime at Soho Farmhouse flagged - AI suggests cross-training.',
        persona: 'ops',
        route: '/labour',
        position: 'center',
      },
    ],
  },
  {
    id: 'gm-property',
    name: 'General Manager Daily Check',
    description: 'A property GM\'s morning routine checking their individual property performance.',
    persona: 'gm',
    steps: [
      {
        id: 'gm-1',
        title: 'Property Dashboard',
        description: 'GMs see their single property view. Today\'s occupancy at Soho Farmhouse is 87% with £38,420 revenue already captured by 2pm.',
        persona: 'gm',
        route: '/',
        position: 'center',
      },
      {
        id: 'gm-2',
        title: 'Revenue by Outlet',
        description: 'The Barn restaurant is outperforming - up 8% on last week. Pool Bar slower due to weather. Spa is fully booked through the weekend.',
        persona: 'gm',
        route: '/',
        position: 'center',
      },
      {
        id: 'gm-3',
        title: 'Night Audit Review',
        description: 'Review last night\'s close. All checkpoints cleared automatically. One bar variance of £340 flagged for review - POS shows an unclosed tab.',
        persona: 'gm',
        route: '/audit',
        position: 'center',
      },
      {
        id: 'gm-4',
        title: 'Action Items',
        description: 'Two items need attention: approve the bar variance resolution and review the kitchen overtime. Both can be done right here in House OS.',
        persona: 'gm',
        route: '/reconciliation',
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
