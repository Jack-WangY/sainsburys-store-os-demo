"use client"

import { cn } from '@/lib/utils'
import { Check, AlertCircle } from 'lucide-react'

interface AuditStepProps {
  number: number
  status: 'done' | 'active' | 'pending' | 'error'
  title: string
  description?: string
  meta?: string[]
  progress?: number
  className?: string
}

export function AuditStep({
  number,
  status,
  title,
  description,
  meta,
  progress,
  className,
}: AuditStepProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-lg)] p-4 border transition-all duration-200",
        status === 'done' && "bg-green-dim/30 border-[rgba(74,158,107,0.2)]",
        status === 'active' && "bg-gold-glow border-gold-dim gold-glow",
        status === 'pending' && "bg-surface-2 border-[rgba(255,255,255,0.07)]",
        status === 'error' && "bg-red-dim/30 border-[rgba(196,92,92,0.2)]",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Step indicator */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
              status === 'done' && "bg-green text-background",
              status === 'active' && "bg-gold text-background",
              status === 'pending' && "bg-surface-3 text-text-muted",
              status === 'error' && "bg-red text-background"
            )}
          >
            {status === 'done' ? (
              <Check className="w-4 h-4" />
            ) : status === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              number
            )}
          </div>
          
          {/* Pulse ring for active state */}
          {status === 'active' && (
            <div className="absolute inset-0 rounded-full bg-gold/20 animate-pulse-ring" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-text text-sm">{title}</h4>
          {description && (
            <p className="text-xs text-text-muted mt-1">{description}</p>
          )}
          
          {/* Meta tags */}
          {meta && meta.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {meta.map((item, i) => (
                <span
                  key={i}
                  className="text-[10px] text-text-faint bg-surface-3/50 px-2 py-0.5 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Progress bar for active state */}
          {status === 'active' && progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-text-muted mb-1">
                <span>Progress</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
