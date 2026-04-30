"use client"

import { useState } from 'react'
import { StatusBadge } from '@/components/house-os/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  AlertTriangle,
  Shield,
  Clock,
  RefreshCw,
  Database,
  Wifi,
  ChevronDown,
  Building2,
} from 'lucide-react'

// Stores list
const properties = [
  { id: 'all', name: 'All UK Stores' },
  { id: 'potters-bar', name: "Sainsbury's Potters Bar" },
  { id: 'nine-elms', name: "Sainsbury's Nine Elms" },
  { id: 'kings-cross', name: "Sainsbury's Local King's Cross" },
  { id: 'whitechapel', name: "Sainsbury's Whitechapel" },
  { id: 'cromwell-road', name: "Sainsbury's Cromwell Road" },
  { id: 'holborn', name: "Sainsbury's Local Holborn" },
  { id: 'fulham-wharf', name: "Sainsbury's Fulham Wharf" },
  { id: 'argos-stratford', name: 'Argos Stratford (in-store)' },
  { id: 'brighton-marina', name: "Sainsbury's Brighton Marina" },
]

// System integrations status
const systemIntegrations = [
  { name: 'Symphony POS', type: 'Tills', status: 'connected', lastSync: '00:48 GMT', records: 14820, latency: '124ms' },
  { name: 'Tellermate', type: 'Cash Office', status: 'connected', lastSync: '00:52 GMT', records: 384, latency: '89ms' },
  { name: 'Nectar Engine', type: 'Loyalty', status: 'connected', lastSync: '00:56 GMT', records: 6240, latency: '201ms' },
  { name: 'Argos OMS', type: 'In-store Argos', status: 'connected', lastSync: '00:58 GMT', records: 1247, latency: '156ms' },
  { name: 'Adyen', type: 'Card Settlements', status: 'connected', lastSync: '01:02 GMT', records: 18420, latency: '67ms' },
  { name: 'SAP S/4 HANA', type: 'ERP', status: 'ready', lastSync: 'Pending close', records: 0, latency: '-' },
]



// Reconciliation by category
const reconciliationCategories = [
  { category: 'Cash office vs Tellermate', opera: 142380, simphony: 142380, variance: 0, status: 'matched' },
  { category: 'Fresh & Ambient (POS vs Stock)', opera: 58420, simphony: 58420, variance: 0, status: 'matched' },
  { category: 'Argos in-store vs Main Till', opera: 18640, simphony: 18952, variance: 312, status: 'variance' },
  { category: 'Fuel & Online (GOL)', opera: 41280, simphony: 41280, variance: 0, status: 'matched' },
  { category: 'Nectar redemptions vs SAP', opera: 7240, simphony: 7240, variance: 0, status: 'matched' },
  { category: 'Card Settlements vs Bank File', opera: 167580, simphony: 167720, variance: 140, status: 'variance' },
]

export default function ReconciliationHub() {
  const [isRunning, setIsRunning] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState('whitechapel')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentProperty = properties.find(p => p.id === selectedProperty) || properties[0]

  const handleRerunAll = async () => {
    setIsRunning(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRunning(false)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(Math.abs(value))

  const totalChecks = reconciliationCategories.length
  const totalPassed = reconciliationCategories.filter(r => r.status === 'matched').length
  const connectedSystems = systemIntegrations.filter(s => s.status === 'connected').length

  return (
    <div className="space-y-6">
      {/* Header with Store Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-2xl text-text">Cash Reconciliation</h1>
            {/* Store Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border rounded-lg hover:bg-surface-3 transition-colors"
              >
                <Building2 className="w-4 h-4 text-gold" />
                <span className="text-sm text-text">{currentProperty.name}</span>
                <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-surface-1 border border-border rounded-xl shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                  {properties.filter(p => p.id !== 'all').map((property) => (
                    <button
                      key={property.id}
                      onClick={() => {
                        setSelectedProperty(property.id)
                        setIsDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-surface-2 transition-colors",
                        selectedProperty === property.id ? "text-gold bg-gold/10" : "text-text"
                      )}
                    >
                      {property.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-text-muted">
            {connectedSystems} systems connected · {totalPassed} of {totalChecks} checks passed · Last sync 01:02 GMT
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRerunAll}
            disabled={isRunning}
            className="border-border text-text-muted hover:bg-surface-2"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRunning && "animate-spin")} />
            {isRunning ? 'Running...' : 'Re-run All Checks'}
          </Button>
          <StatusBadge variant="green">
            {totalPassed}/{totalChecks} Passed
          </StatusBadge>
        </div>
      </div>

      {/* System Integrations */}
      <div className="bg-surface-1 border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wifi className="w-5 h-5 text-green" />
          <h2 className="font-medium text-text">System Integrations</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {systemIntegrations.map((system) => (
            <div
              key={system.name}
              className={cn(
                "p-4 rounded-xl border",
                system.status === 'connected' && "bg-green/5 border-green/20",
                system.status === 'ready' && "bg-gold/5 border-gold/20"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  system.status === 'connected' && "bg-green animate-pulse",
                  system.status === 'ready' && "bg-gold"
                )} />
                <span className="text-xs font-medium text-text">{system.name}</span>
              </div>
              <p className="text-xs text-text-faint mb-1">{system.type}</p>
              <p className="text-xs text-text-muted">
                {system.status === 'connected' ? `${system.records.toLocaleString()} records` : 'Awaiting close'}
              </p>
              <p className="text-xs text-text-faint mt-1">{system.lastSync}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Reconciliation Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Reconciliation */}
          <div className="bg-surface-1 border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-text-muted" />
                <h2 className="font-medium text-text">Cross-System Reconciliation</h2>
              </div>
              <span className="text-xs text-text-muted">Source vs Settlement</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-left uppercase-label text-text-faint py-3 px-4">Category</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-4">Source</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-4">Settlement</th>
                    <th className="text-right uppercase-label text-text-faint py-3 px-4">Variance</th>
                    <th className="text-center uppercase-label text-text-faint py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliationCategories.map((row) => (
                    <tr
                      key={row.category}
                      className={cn(
                        "border-b border-border/50",
                        row.status === 'variance' && "bg-amber/5"
                      )}
                    >
                      <td className="py-3 px-4 text-sm text-text">{row.category}</td>
                      <td className="py-3 px-4 text-sm text-text-muted text-right tabular-nums">
                        {formatCurrency(row.opera)}
                      </td>
                      <td className="py-3 px-4 text-sm text-text text-right tabular-nums">
                        {formatCurrency(row.simphony)}
                      </td>
                      <td className={cn(
                        "py-3 px-4 text-sm text-right tabular-nums font-medium",
                        row.variance === 0 ? "text-green" : "text-amber"
                      )}>
                        {row.variance === 0 ? '£0' : `£${row.variance}`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.status === 'matched' ? (
                          <CheckCircle className="w-4 h-4 text-green mx-auto" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

                  </div>

        {/* Right column - Summary & Benefits */}
        <div className="space-y-6">
          {/* Reconciliation Summary */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5 text-center">
            <div className="font-serif text-5xl text-green mb-2">99.2%</div>
            <p className="text-sm text-text-muted mb-4">Auto-Reconciled</p>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-surface-2 rounded-lg">
                <span className="text-2xl font-serif text-text">246</span>
                <p className="text-xs text-text-muted">Checks passed</p>
              </div>
              <div className="p-3 bg-surface-2 rounded-lg">
                <span className="text-2xl font-serif text-amber">2</span>
                <p className="text-xs text-text-muted">Exceptions</p>
              </div>
            </div>
          </div>

          {/* Value Props */}
          <div className="space-y-3">
            <div className="bg-green/5 border border-green/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green" />
                <h4 className="text-sm text-text font-medium">Continuous Reconciliation</h4>
              </div>
              <p className="text-xs text-text-muted">
                Data flows from POS, Tellermate, Nectar and Adyen throughout the day. Variances surface in real-time, not at midnight.
              </p>
            </div>

            <div className="bg-blue/5 border border-blue/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-blue" />
                <h4 className="text-sm text-text font-medium">Full Audit Trail</h4>
              </div>
              <p className="text-xs text-text-muted">
                Every check, variance, and resolution logged with timestamp and attribution.
              </p>
            </div>

            <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-gold" />
                <h4 className="text-sm text-text font-medium">2.4 Hours Saved</h4>
              </div>
              <p className="text-xs text-text-muted">
                Per store per day versus manual reconciliation. Priya reviews exceptions, not spreadsheets.
              </p>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-surface-1 border border-border rounded-2xl p-5">
            <h3 className="font-medium text-text mb-4">System Health</h3>
            <div className="space-y-3">
              {systemIntegrations.filter(s => s.status === 'connected').slice(0, 4).map((system) => (
                <div key={system.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green" />
                    <span className="text-sm text-text">{system.name}</span>
                  </div>
                  <span className="text-xs text-green tabular-nums">{system.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
