"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Sparkles, Play, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHouseOS } from "@/lib/house-os-context"
import { useRouter, usePathname } from "next/navigation"

interface DemoStep {
  id: number
  title: string
  description: string
  path: string
  role: "store-manager" | "finance-ops" | "cfo"
  highlight?: string
  narrative: string
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Start here — the Today story",
    description: "Where Sainsbury's finance is today, and why Store OS matters",
    path: "/story/today",
    role: "cfo",
    narrative: "Month-end stretches across weeks. Reconciliations are manual. Audit signal lags the P&L. This is the gap Store OS closes.",
  },
  {
    id: 2,
    title: "The Platform — what changes",
    description: "Argos AI on top of SAP S/4 HANA, store data, and supply chain",
    path: "/story/platform",
    role: "cfo",
    narrative: "One operating system across 600 stores — automating audit, reconciliation, close, and supplier ops with Argos AI on every flow.",
  },
  {
    id: 3,
    title: "The Beyond — outcomes",
    description: "Period-end in 1 day, 99%+ auto-cleared, same-day shrinkage signal",
    path: "/story/beyond",
    role: "cfo",
    narrative: "This is what finance looks like when the operating system does the heavy lifting — faster close, cleaner books, sharper loss intelligence.",
  },
  {
    id: 4,
    title: "CFO Portfolio P&L",
    description: "600 stores live in one consolidated P&L",
    path: "/portfolio",
    role: "cfo",
    highlight: "kpi-cards",
    narrative: "Sales, margin, labour, and shrink across the entire estate — drillable, real-time, no Monday-morning spreadsheet stitching.",
  },
  {
    id: 5,
    title: "Daily Store Audit",
    description: "Automated 10-step audit across every store, every morning",
    path: "/audit",
    role: "finance-ops",
    highlight: "audit-steps",
    narrative: "Cash, fresh, compliance, and stock checks evidenced by 7am. Finance gets a clean audit signal before the doors open.",
  },
  {
    id: 6,
    title: "Cash Reconciliation",
    description: "Variances classified by category with 99%+ auto-cleared",
    path: "/reconciliation",
    role: "finance-ops",
    highlight: "variances",
    narrative: "Argos AI matches till shorts, deposit-timing, and refund anomalies — only true exceptions hit a finance analyst's queue.",
  },
  {
    id: 7,
    title: "Continuous Close",
    description: "Period-end compressed from 8 working days to 1",
    path: "/finance-ops",
    role: "cfo",
    highlight: "close-tracker",
    narrative: "Journals post continuously, accruals are AI-suggested, and the trial balance is always within a day of go-live.",
  },
  {
    id: 8,
    title: "Invoice → PO → GRN",
    description: "3-way auto-match on every supplier invoice",
    path: "/ops",
    role: "finance-ops",
    highlight: "match-engine",
    narrative: "Argos AI clears matched lines, routes mismatches with suggested resolutions, and removes the AP backlog entirely.",
  },
  {
    id: 9,
    title: "Shrinkage & Wastage",
    description: "Live loss intelligence at SKU and aisle level",
    path: "/floor",
    role: "store-manager",
    highlight: "loss-feed",
    narrative: "Self-checkout shrink, fresh wastage, and sweethearting flagged the same day — not in a quarterly post-mortem.",
  },
  {
    id: 10,
    title: "DC ↔ Store Flow",
    description: "Supply-chain pulse from depot dispatch to shelf availability",
    path: "/data-feed",
    role: "finance-ops",
    highlight: "data-stream",
    narrative: "Depot picks, trunking, store receipts, and on-shelf availability streaming as one connected flow. Argos AI catches breaks before they hit sales.",
  },
]

export default function DemoGuide() {
  const router = useRouter()
  const pathname = usePathname()
  const { state, dispatch, login } = useHouseOS()
  const [isMinimized, setIsMinimized] = useState(false)
  const [showNarrative, setShowNarrative] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  const demoMode = state.demoMode

  const currentDemoStep = demoSteps.find((s) => s.id === currentStep) || demoSteps[0]
  const progress = (currentStep / demoSteps.length) * 100

  const roleMap: Record<string, 'site-manager' | 'gm' | 'auditor' | 'exco'> = {
    'store-manager': 'site-manager',
    'finance-ops': 'auditor',
    'cfo': 'exco',
  }

  const goToStep = (stepId: number) => {
    const step = demoSteps.find((s) => s.id === stepId)
    if (step) {
      setCurrentStep(stepId)
      const mappedRole = roleMap[step.role] || 'site-manager'
      login(mappedRole)
      router.push(step.path)
    }
  }

  const nextStep = () => {
    if (currentStep < demoSteps.length) {
      goToStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  if (!demoMode) return null

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90"
        >
          <Play className="h-6 w-6" />
        </Button>
        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          {currentStep}
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-accent/30 bg-card/95 backdrop-blur-xl"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-accent"
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-6">
            {/* Step Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-accent">DEMO GUIDE</p>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {demoSteps.length}
                </p>
              </div>
            </div>

            {/* Current Step Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{currentDemoStep.title}</h3>
              <p className="text-sm text-muted-foreground">{currentDemoStep.description}</p>
              {showNarrative && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 text-sm italic text-accent/80"
                >
                  {`"${currentDemoStep.narrative}"`}
                </motion.p>
              )}
            </div>

            {/* Role Badge */}
            <div
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                currentDemoStep.role === "store-manager"
                  ? "bg-blue-500/20 text-blue-300"
                  : currentDemoStep.role === "finance-ops"
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-accent/20 text-accent"
              }`}
            >
              {currentDemoStep.role === "store-manager"
                ? "Store Manager"
                : currentDemoStep.role === "finance-ops"
                  ? "Finance Ops"
                  : "CFO"}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-border/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={nextStep}
                disabled={currentStep === demoSteps.length}
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-2">
            {demoSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  step.id === currentStep
                    ? "bg-accent text-accent-foreground"
                    : step.id < currentStep
                      ? "bg-green-500/20 text-green-400"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {step.id < currentStep ? <CheckCircle2 className="h-4 w-4" /> : step.id}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
