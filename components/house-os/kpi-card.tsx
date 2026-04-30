"use client"

import { ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  icon?: ReactNode
  value: string
  label?: string
  delta?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
    label?: string
  }
  className?: string
  animate?: boolean
}

export function KPICard({
  title,
  icon,
  value,
  label,
  delta,
  className,
  animate = true,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(animate ? '' : value)
  const [isVisible, setIsVisible] = useState(!animate)

  useEffect(() => {
    if (!animate) return
    
    const timer = setTimeout(() => {
      setDisplayValue(value)
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [value, animate])

  return (
    <div
      className={cn(
        "group relative rounded-[var(--radius-lg)] p-4",
        "bg-surface-1 border border-[rgba(255,255,255,0.07)]",
        "hover:border-[rgba(255,255,255,0.12)] hover:shadow-[var(--shadow-sm)]",
        "transition-all duration-200 ease-out hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <span className="text-text-muted">{icon}</span>
        )}
        <span className="uppercase-label text-text-muted font-medium tracking-wide">
          {title}
        </span>
      </div>

      <div
        className={cn(
          "text-2xl font-semibold text-text tabular-nums transition-opacity duration-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        {displayValue}
      </div>

      {label && (
        <p className="text-xs text-text-muted mt-1">{label}</p>
      )}

      {delta && (
        <div className="flex items-center gap-1.5 mt-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
              delta.direction === 'up' && "bg-green-dim text-green",
              delta.direction === 'down' && "bg-red-dim text-red",
              delta.direction === 'neutral' && "bg-surface-3 text-text-muted"
            )}
          >
            {delta.direction === 'up' && <TrendingUp className="w-3 h-3" />}
            {delta.direction === 'down' && <TrendingDown className="w-3 h-3" />}
            {delta.direction === 'neutral' && <Minus className="w-3 h-3" />}
            {delta.value}
          </span>
          {delta.label && (
            <span className="text-[10px] text-text-faint">{delta.label}</span>
          )}
        </div>
      )}
    </div>
  )
}
