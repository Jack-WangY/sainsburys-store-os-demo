"use client"

import { cn } from '@/lib/utils'
import { StatusBadge } from './status-badge'
import type { Property } from '@/lib/house-os-context'

interface PropertyCardProps {
  property: Property
  onClick?: () => void
  className?: string
}

export function PropertyCard({ property, onClick, className }: PropertyCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-[var(--radius-xl)] p-5 cursor-pointer",
        "bg-surface-1 border border-[rgba(255,255,255,0.07)]",
        "hover:border-gold-dim hover:-translate-y-0.5",
        "transition-all duration-200 ease-out",
        property.hasAlert && "border-[rgba(212,133,90,0.3)] shadow-[0_0_0_1px_rgba(212,133,90,0.15)]",
        className
      )}
    >
      {/* Gold top stripe on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gold rounded-t-[var(--radius-xl)] opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg text-text">{property.name}</h3>
          <p className="text-xs text-text-muted">{property.postcode}</p>
        </div>
        <StatusBadge variant={property.occupancy >= 90 ? 'green' : property.occupancy >= 80 ? 'gold' : 'amber'}>
          {property.occupancy}% occ.
        </StatusBadge>
      </div>

      {/* Metrics */}
      <div className="space-y-2.5 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Revenue today</span>
          <span className="text-text tabular-nums font-medium">{formatCurrency(property.revenueToday)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">F&B net</span>
          <span className="text-text tabular-nums font-medium">{formatCurrency(property.fbNet)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Members in</span>
          <span className="text-text tabular-nums font-medium">{property.membersIn}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(255,255,255,0.07)] my-3" />

      {/* Footer badges */}
      <div className="flex items-center gap-2">
        <StatusBadge variant={property.auditStatus === 'closed' ? 'green' : 'amber'}>
          Audit: {property.auditStatus}
        </StatusBadge>
        <StatusBadge variant={property.oracleStatus === 'synced' ? 'blue' : property.oracleStatus === 'held' ? 'amber' : 'gold'}>
          Oracle: {property.oracleStatus}
        </StatusBadge>
      </div>
    </div>
  )
}
