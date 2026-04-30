"use client"

// Stylized UK Map Component for Sainsbury's Store-Network Overview (Store OS)
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Building2, Store } from 'lucide-react'
import { useHouseOS, type Property } from '@/lib/house-os-context'
import { cn } from '@/lib/utils'

// Region view presets — used purely as filter buckets over the stylized SVG map.
type RegionView = 'all' | 'london' | 'outside'

const regionViews: Record<RegionView, { label: string; icon: React.ReactNode }> = {
  all: {
    label: 'All UK',
    icon: <MapPin className="w-3.5 h-3.5" />,
  },
  london: {
    label: 'London',
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  outside: {
    label: 'Outside',
    icon: <Store className="w-3.5 h-3.5" />,
  },
}

// Categorize stores by region using percent-coordinate position.
// London cluster sits roughly within x: 38-56, y: 55-66 in the stylized map.
function categorizeByRegion(stores: Property[]) {
  const london: Property[] = []
  const outside: Property[] = []

  stores.forEach(store => {
    const { x, y } = store.position
    const isLondon = x >= 38 && x <= 56 && y >= 55 && y <= 66

    if (isLondon) {
      london.push(store)
    } else {
      outside.push(store)
    }
  })

  return { london, outside }
}

interface UKMapProps {
  // Optional override; if not supplied, the component reads from context.
  properties?: Property[]
  onPropertyClick?: (storeId: string) => void
  formatCurrency: (value: number) => string
}

export default function UKMap({ properties, onPropertyClick, formatCurrency }: UKMapProps) {
  const { state } = useHouseOS()
  const stores = properties ?? state.properties

  const [selectedStore, setSelectedStore] = useState<Property | null>(null)
  const [activeRegion, setActiveRegion] = useState<RegionView>('all')

  const { london, outside } = categorizeByRegion(stores)

  const handleMarkerClick = useCallback((store: Property) => {
    setSelectedStore(store)
    onPropertyClick?.(store.id)
  }, [onPropertyClick])

  const handleRegionChange = useCallback((region: RegionView) => {
    setActiveRegion(region)
    setSelectedStore(null)
  }, [])

  // Filter visible stores based on active region.
  const visibleStores = activeRegion === 'london'
    ? london
    : activeRegion === 'outside'
      ? outside
      : stores

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-surface-1">
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.4);
            opacity: 0;
          }
        }
      `}</style>

      {/* Region filter tabs */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-surface-2/90 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-lg p-1">
        {(Object.keys(regionViews) as RegionView[]).map((region) => {
          const view = regionViews[region]
          const count = region === 'london' ? london.length : region === 'outside' ? outside.length : stores.length

          return (
            <button
              key={region}
              onClick={() => handleRegionChange(region)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                activeRegion === region
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "text-text-muted hover:text-text hover:bg-[rgba(255,255,255,0.05)]"
              )}
            >
              {view.icon}
              <span>{view.label}</span>
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
                activeRegion === region
                  ? "bg-gold/30 text-gold"
                  : "bg-[rgba(255,255,255,0.08)] text-text-faint"
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Stylized UK outline */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="uk-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(201,168,76,0.06)" />
            <stop offset="100%" stopColor="rgba(201,168,76,0.02)" />
          </linearGradient>
        </defs>

        {/* Stylized UK outline — Great Britain main island */}
        <path
          d="M 48,8 L 52,10 L 55,14 L 54,18 L 57,22 L 56,26 L 60,30 L 58,34 L 62,38 L 60,44 L 64,48 L 62,52 L 58,55 L 60,60 L 56,64 L 58,68 L 54,72 L 56,76 L 52,80 L 48,82 L 44,80 L 42,76 L 40,72 L 38,66 L 36,60 L 34,54 L 32,48 L 34,42 L 36,36 L 38,30 L 40,24 L 42,18 L 44,14 L 46,10 Z"
          fill="url(#uk-fill)"
          stroke="rgba(201,168,76,0.35)"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />

        {/* Northern Ireland */}
        <path
          d="M 22,42 L 26,40 L 30,42 L 30,46 L 28,50 L 24,50 L 22,46 Z"
          fill="url(#uk-fill)"
          stroke="rgba(201,168,76,0.3)"
          strokeWidth="0.35"
          strokeLinejoin="round"
        />
      </svg>

      {/* Store pins layered absolutely over the SVG */}
      <div className="absolute inset-0">
        {visibleStores.map((store) => (
          <div
            key={store.id}
            className="absolute"
            style={{
              left: `${store.position.x}%`,
              top: `${store.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="relative cursor-pointer group"
              onClick={() => handleMarkerClick(store)}
            >
              {/* Pulse ring for alerts */}
              {store.hasAlert && (
                <div
                  className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
                  style={{
                    width: 24,
                    height: 24,
                    background: 'rgba(212,133,90,0.4)',
                    animation: 'pulse-ring 1.5s ease-out infinite',
                  }}
                />
              )}

              {/* Main pin dot */}
              <motion.div
                whileHover={{ scale: 1.3 }}
                className="relative"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: store.hasAlert ? '#d4855a' : '#c9a84c',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: store.hasAlert
                    ? '0 0 12px rgba(212,133,90,0.5), 0 2px 8px rgba(0,0,0,0.3)'
                    : '0 0 12px rgba(201,168,76,0.4), 0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: 3,
                    width: 4,
                    height: 4,
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                  }}
                />
              </motion.div>

              {/* Hover/selected tooltip */}
              {selectedStore?.id === store.id && (
                <div
                  className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-3 min-w-[220px] p-3 rounded-xl bg-surface-2/95 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-1 right-2 text-text-faint hover:text-gold text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedStore(null)
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <p className="font-medium text-sm mb-1 text-text pr-4">
                    {store.name}
                  </p>
                  <p className="text-xs mb-1 text-text-muted">
                    {store.address}
                  </p>
                  <p className="text-xs text-text-faint mb-3">
                    {store.postcode}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.1)]">
                    <span className="font-medium text-gold">
                      {formatCurrency(store.revenueToday)}
                    </span>
                    <span className="text-text-muted text-xs">
                      {store.occupancy}% Forecast
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <div className="text-text-faint uppercase tracking-wide">Fresh £</div>
                      <div className="text-text font-medium">{formatCurrency(store.fbNet)}</div>
                    </div>
                    <div>
                      <div className="text-text-faint uppercase tracking-wide">Nectar</div>
                      <div className="text-text font-medium">{store.membersIn.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-text-faint uppercase tracking-wide">Shrink £</div>
                      <div className="text-text font-medium">{formatCurrency(store.comps)}</div>
                    </div>
                  </div>
                  {store.hasAlert && (
                    <div className="mt-2 px-2 py-1 rounded text-xs bg-amber/20 text-amber">
                      Needs attention
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
