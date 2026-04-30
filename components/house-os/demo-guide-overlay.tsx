"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDemoGuide } from './demo-guide-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  User,
  Briefcase,
  Building2,
  Sparkles,
  CheckCircle,
} from 'lucide-react'

const personaIcons = {
  cfo: Briefcase,
  ops: Building2,
  gm: User,
  all: Sparkles,
}

const personaColors = {
  cfo: 'gold',
  ops: 'blue',
  gm: 'green',
  all: 'text',
}

const personaLabels = {
  cfo: 'CFO',
  ops: 'Operations',
  gm: 'General Manager',
  all: 'All Users',
}

export function DemoGuideOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    isActive,
    currentScenario,
    currentStep,
    currentStepIndex,
    progress,
    nextStep,
    prevStep,
    endDemo,
    scenarios,
    startScenario,
    scenariosCompleted,
  } = useDemoGuide()

  // Navigate to current step's route
  useEffect(() => {
    if (isActive && currentStep && currentStep.route !== pathname) {
      router.push(currentStep.route)
    }
  }, [isActive, currentStep, pathname, router])

  if (!isActive) {
    return null
  }

  // Show scenario selector if no scenario is active
  if (!currentScenario) {
    return (
      <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-surface-1 border border-[rgba(255,255,255,0.12)] rounded-[var(--radius-xl)] max-w-2xl w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-text">Choose Your Demo Journey</h2>
              <p className="text-sm text-text-muted mt-1">
                Select a scenario to see House OS from different perspectives.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={endDemo}
              className="text-text-muted hover:text-text"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {scenarios.map((scenario) => {
              const Icon = personaIcons[scenario.persona]
              const isCompleted = scenariosCompleted.includes(scenario.id)
              return (
                <button
                  key={scenario.id}
                  onClick={() => startScenario(scenario.id)}
                  className={cn(
                    "w-full p-5 rounded-xl border text-left transition-all group",
                    "bg-surface-2 border-[rgba(255,255,255,0.07)]",
                    "hover:border-gold-dim hover:bg-surface-3"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                      scenario.persona === 'cfo' && "bg-gold-glow",
                      scenario.persona === 'ops' && "bg-blue-dim/30",
                      scenario.persona === 'gm' && "bg-green-dim/30"
                    )}>
                      <Icon className={cn(
                        "w-6 h-6",
                        scenario.persona === 'cfo' && "text-gold",
                        scenario.persona === 'ops' && "text-blue",
                        scenario.persona === 'gm' && "text-green"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg text-text font-medium group-hover:text-gold transition-colors">
                          {scenario.name}
                        </h3>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-text-muted">{scenario.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          scenario.persona === 'cfo' && "bg-gold-glow text-gold",
                          scenario.persona === 'ops' && "bg-blue-dim/30 text-blue",
                          scenario.persona === 'gm' && "bg-green-dim/30 text-green"
                        )}>
                          {personaLabels[scenario.persona]}
                        </span>
                        <span className="text-xs text-text-faint">
                          {scenario.steps.length} steps
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-faint group-hover:text-gold transition-colors flex-shrink-0 mt-2" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Show current step overlay
  const Icon = personaIcons[currentScenario.persona]
  const totalSteps = currentScenario.steps.length
  const isLastStep = currentStepIndex === totalSteps - 1

  return (
    <>
      {/* Subtle backdrop */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
      </div>

      {/* Bottom overlay panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className={cn(
          "max-w-4xl mx-auto",
          "bg-surface-1/95 backdrop-blur-xl border border-[rgba(255,255,255,0.12)]",
          "rounded-[var(--radius-xl)] shadow-2xl"
        )}>
          {/* Progress bar */}
          <div className="h-1 bg-surface-3 rounded-t-[var(--radius-xl)] overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-start gap-6">
              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0",
                currentScenario.persona === 'cfo' && "bg-gold-glow",
                currentScenario.persona === 'ops' && "bg-blue-dim/30",
                currentScenario.persona === 'gm' && "bg-green-dim/30"
              )}>
                <Icon className={cn(
                  "w-7 h-7",
                  currentScenario.persona === 'cfo' && "text-gold",
                  currentScenario.persona === 'ops' && "text-blue",
                  currentScenario.persona === 'gm' && "text-green"
                )} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-text-faint uppercase tracking-wide">
                    {currentScenario.name}
                  </span>
                  <span className="text-xs text-text-faint">
                    Step {currentStepIndex + 1} of {totalSteps}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-text mb-2">
                  {currentStep?.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {currentStep?.description}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="text-text-muted hover:text-text disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="bg-gold hover:bg-gold/90 text-background"
                >
                  {isLastStep ? 'Finish' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={endDemo}
                  className="text-text-faint hover:text-text ml-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-[rgba(255,255,255,0.07)]">
              {currentScenario.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === currentStepIndex && "w-8 bg-gold",
                    idx < currentStepIndex && "w-4 bg-green",
                    idx > currentStepIndex && "w-4 bg-surface-3"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function DemoGuideButton() {
  const { toggleDemo, isActive } = useDemoGuide()

  return (
    <Button
      onClick={toggleDemo}
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={cn(
        isActive
          ? "bg-gold hover:bg-gold/90 text-background"
          : "border-gold-dim text-gold hover:bg-gold-glow"
      )}
    >
      <Play className="w-4 h-4 mr-2" />
      {isActive ? 'Demo Active' : 'Start Demo'}
    </Button>
  )
}
