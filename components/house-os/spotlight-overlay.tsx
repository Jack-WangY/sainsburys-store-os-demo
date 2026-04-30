"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHouseOS } from "@/lib/house-os-context"

interface SpotlightProps {
  targetId?: string
  title: string
  description: string
  tip?: string
  position?: "top" | "bottom" | "left" | "right"
  onDismiss?: () => void
  onNext?: () => void
  showNext?: boolean
}

export function SpotlightOverlay({
  targetId,
  title,
  description,
  tip,
  position = "bottom",
  onDismiss,
  onNext,
  showNext = true,
}: SpotlightProps) {
  const { state } = useHouseOS()

  if (!state.demoMode) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-none fixed inset-0 z-40"
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

        {/* Spotlight card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pointer-events-auto absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-2xl border border-accent/30 bg-card p-6 shadow-2xl shadow-accent/10">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Lightbulb className="h-5 w-5 text-accent" />
              </div>
              {onDismiss && (
                <Button variant="ghost" size="icon" onClick={onDismiss} className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

            {tip && (
              <div className="mt-4 rounded-lg bg-accent/5 p-3">
                <p className="text-sm text-accent">Pro tip: {tip}</p>
              </div>
            )}

            {showNext && onNext && (
              <Button onClick={onNext} className="mt-4 w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Continue Tour
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface FeatureHighlightProps {
  children: React.ReactNode
  id: string
  active?: boolean
}

export function FeatureHighlight({ children, id, active = false }: FeatureHighlightProps) {
  return (
    <div className="relative">
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-2 rounded-xl border-2 border-accent bg-accent/5"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
          >
            !
          </motion.div>
        </motion.div>
      )}
      {children}
    </div>
  )
}
