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
  role: "site-manager" | "remote-auditor" | "executive"
  highlight?: string
  narrative: string
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Welcome to House OS",
    description: "The AI-powered operating system transforming Soho House operations",
    path: "/",
    role: "site-manager",
    narrative: "Imagine a world where every House runs like clockwork, powered by intelligent automation and real-time insights.",
  },
  {
    id: 2,
    title: "Role Selection",
    description: "Experience the platform from three distinct perspectives",
    path: "/login",
    role: "site-manager",
    narrative: "House OS adapts to each user, providing tailored experiences for Site Managers, Remote Auditors, and Executives.",
  },
  {
    id: 3,
    title: "Site Manager Dashboard",
    description: "Real-time operations at your fingertips",
    path: "/gm",
    role: "site-manager",
    highlight: "kpi-cards",
    narrative: "As a Site Manager at Soho House London, your morning begins with instant visibility into overnight performance and today's priorities.",
  },
  {
    id: 4,
    title: "AI Chat Assistant",
    description: "Natural language data capture and intelligent queries",
    path: "/gm",
    role: "site-manager",
    highlight: "chat",
    narrative: "Simply tell House AI about issues, and it automatically logs incidents, notifies relevant teams, and suggests resolutions.",
  },
  {
    id: 5,
    title: "Daily Operations Feed",
    description: "Live pulse of everything happening in your House",
    path: "/ops",
    role: "site-manager",
    highlight: "feed",
    narrative: "Every operational metric, staff update, and member interaction streams in real-time, with AI highlighting what needs attention.",
  },
  {
    id: 6,
    title: "Live Data Integration",
    description: "IoT sensors and POS data flowing continuously",
    path: "/data-feed",
    role: "site-manager",
    highlight: "data-stream",
    narrative: "No more manual entry. House OS connects directly to your systems, creating a complete operational picture automatically.",
  },
  {
    id: 7,
    title: "Remote Night Audit",
    description: "Automated reconciliation from anywhere",
    path: "/audit",
    role: "remote-auditor",
    highlight: "audit-steps",
    narrative: "At 11 PM, your Remote Audit team takes over. House AI has already completed 90% of the reconciliation checks.",
  },
  {
    id: 8,
    title: "Automated Reconciliation",
    description: "AI-powered variance detection and resolution",
    path: "/reconciliation",
    role: "remote-auditor",
    highlight: "variances",
    narrative: "Variances are automatically flagged, categorized, and when possible, resolved without human intervention.",
  },
  {
    id: 9,
    title: "Offline Mode",
    description: "Seamless operation even without connectivity",
    path: "/offline",
    role: "remote-auditor",
    highlight: "offline-queue",
    narrative: "House OS never stops. During connectivity issues, work continues locally and syncs automatically when back online.",
  },
  {
    id: 10,
    title: "Executive Portfolio View",
    description: "42 properties, one intelligent dashboard",
    path: "/executive",
    role: "executive",
    highlight: "portfolio-grid",
    narrative: "Leadership sees the entire global portfolio in one view, with AI surfacing the insights that matter most.",
  },
  {
    id: 11,
    title: "AI-Generated Insights",
    description: "Predictive analytics and opportunity detection",
    path: "/executive",
    role: "executive",
    highlight: "insights-panel",
    narrative: "House AI continuously analyzes patterns, predicting risks before they materialize and identifying growth opportunities.",
  },
  {
    id: 12,
    title: "Member Intelligence",
    description: "Deep understanding of member behavior and preferences",
    path: "/members",
    role: "executive",
    highlight: "member-analytics",
    narrative: "Every interaction builds a richer member profile, enabling personalized experiences that drive loyalty and spend.",
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
    'site-manager': 'site-manager',
    'remote-auditor': 'auditor',
    'executive': 'exco',
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
                currentDemoStep.role === "site-manager"
                  ? "bg-blue-500/20 text-blue-300"
                  : currentDemoStep.role === "remote-auditor"
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-accent/20 text-accent"
              }`}
            >
              {currentDemoStep.role === "site-manager"
                ? "Site Manager"
                : currentDemoStep.role === "remote-auditor"
                  ? "Remote Auditor"
                  : "Executive"}
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
