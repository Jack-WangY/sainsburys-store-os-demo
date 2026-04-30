"use client"

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface StatusBadgeProps {
  variant: 'green' | 'red' | 'amber' | 'gold' | 'blue' | 'ghost'
  children: ReactNode
  className?: string
  icon?: ReactNode
}

export function StatusBadge({ variant, children, className, icon }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "text-[10px] font-bold uppercase tracking-wide",
        variant === 'green' && "bg-green-dim text-green",
        variant === 'red' && "bg-red-dim text-red",
        variant === 'amber' && "bg-amber-dim text-amber",
        variant === 'gold' && "bg-gold-glow text-gold",
        variant === 'blue' && "bg-blue-dim text-blue",
        variant === 'ghost' && "bg-surface-3 text-text-muted",
        className
      )}
    >
      {icon}
      {children}
    </span>
  )
}
