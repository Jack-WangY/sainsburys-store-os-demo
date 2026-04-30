"use client"

import { cn } from '@/lib/utils'
import { ReactNode, useState } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AlertStripProps {
  variant: 'warning' | 'error' | 'success' | 'info'
  title: string
  description?: string
  action?: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function AlertStrip({
  variant,
  title,
  description,
  action,
  dismissible = true,
  onDismiss,
  className,
}: AlertStripProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const Icon = {
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  }[variant]

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border transition-all duration-200",
        variant === 'warning' && "bg-amber-dim/50 border-[rgba(212,133,90,0.3)]",
        variant === 'error' && "bg-red-dim/50 border-[rgba(196,92,92,0.3)]",
        variant === 'success' && "bg-green-dim/50 border-[rgba(74,158,107,0.3)]",
        variant === 'info' && "bg-blue-dim/50 border-[rgba(90,135,196,0.3)]",
        className
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 flex-shrink-0 mt-0.5",
          variant === 'warning' && "text-amber",
          variant === 'error' && "text-red",
          variant === 'success' && "text-green",
          variant === 'info' && "text-blue"
        )}
      />

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-text">{title}</h4>
        {description && (
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        )}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}

      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-text-muted hover:text-text transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
