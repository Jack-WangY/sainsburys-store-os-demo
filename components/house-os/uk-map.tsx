"use client"

// MapLibre GL UK Map Component for Soho House Portfolio Overview
import { useState, useCallback, useRef, useEffect } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Property } from '@/lib/house-os-context'
import { motion } from 'framer-motion'
import { MapPin, Building2, Trees } from 'lucide-react'
import { cn } from '@/lib/utils'

// Region view presets with center coordinates and zoom levels
type RegionView = 'all' | 'london' | 'outside'

const regionViews: Record<RegionView, { center: [number, number]; zoom: number; label: string; icon: React.ReactNode }> = {
  all: {
    center: [-1.5, 52.5],
    zoom: 5.5,
    label: 'All UK',
    icon: <MapPin className="w-3.5 h-3.5" />,
  },
  london: {
    center: [-0.15, 51.51],
    zoom: 11,
    label: 'London',
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  outside: {
    center: [-0.8, 51.4],
    zoom: 7,
    label: 'Outside',
    icon: <Trees className="w-3.5 h-3.5" />,
  },
}

// Categorize properties by region
function categorizeByRegion(properties: Property[]) {
  const london: Property[] = []
  const outside: Property[] = []
  
  properties.forEach(property => {
    // London properties are roughly within lat 51.4-51.6, lng -0.3 to 0.1
    const isLondon = property.lat >= 51.4 && property.lat <= 51.6 && 
                     property.lng >= -0.3 && property.lng <= 0.1
    
    if (isLondon) {
      london.push(property)
    } else {
      outside.push(property)
    }
  })
  
  return { london, outside }
}

interface UKMapProps {
  properties: Property[]
  onPropertyClick?: (propertyId: string) => void
  formatCurrency: (value: number) => string
}

export default function UKMap({ properties, onPropertyClick, formatCurrency }: UKMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [activeRegion, setActiveRegion] = useState<RegionView>('all')
  const mapRef = useRef<MapRef>(null)
  
  const { london, outside } = categorizeByRegion(properties)
  
  const handleMarkerClick = useCallback((property: Property) => {
    setSelectedProperty(property)
    onPropertyClick?.(property.id)
  }, [onPropertyClick])
  
  const handleRegionChange = useCallback((region: RegionView) => {
    setActiveRegion(region)
    setSelectedProperty(null)
    
    const view = regionViews[region]
    mapRef.current?.flyTo({
      center: view.center,
      zoom: view.zoom,
      duration: 1500,
      essential: true,
    })
  }, [])
  
  // Get visible properties based on active region
  const visibleProperties = activeRegion === 'london' 
    ? london 
    : activeRegion === 'outside' 
      ? outside 
      : properties

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Custom styles */}
      <style>{`
        .maplibregl-ctrl-attrib {
          background: rgba(13, 13, 13, 0.8) !important;
          color: rgba(255,255,255,0.3) !important;
          font-size: 9px !important;
        }
        .maplibregl-ctrl-attrib a {
          color: rgba(201,168,76,0.5) !important;
        }
        .maplibregl-ctrl-group {
          background: rgba(26, 26, 26, 0.9) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
        }
        .maplibregl-ctrl-group button {
          background: transparent !important;
          color: #c9a84c !important;
        }
        .maplibregl-ctrl-group button:hover {
          background: rgba(40, 40, 40, 0.95) !important;
        }
        .maplibregl-ctrl-group button + button {
          border-top: 1px solid rgba(255,255,255,0.1) !important;
        }
        .maplibregl-popup-content {
          background: rgba(26, 26, 26, 0.95) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
          padding: 0 !important;
        }
        .maplibregl-popup-tip {
          border-top-color: rgba(26, 26, 26, 0.95) !important;
        }
        .maplibregl-popup-close-button {
          color: rgba(255,255,255,0.5) !important;
          font-size: 16px !important;
          padding: 4px 8px !important;
        }
        .maplibregl-popup-close-button:hover {
          color: #c9a84c !important;
          background: transparent !important;
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Region filter tabs */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-surface-2/90 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-lg p-1">
        {(Object.keys(regionViews) as RegionView[]).map((region) => {
          const view = regionViews[region]
          const count = region === 'london' ? london.length : region === 'outside' ? outside.length : properties.length
          
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
      
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: regionViews[activeRegion].center[0],
          latitude: regionViews[activeRegion].center[1],
          zoom: regionViews[activeRegion].zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        attributionControl={true}
      >
        <NavigationControl position="top-right" showCompass={false} />
        
        {/* Property markers */}
        {visibleProperties.map((property) => (
          <Marker
            key={property.id}
            longitude={property.lng}
            latitude={property.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              handleMarkerClick(property)
            }}
          >
            <div className="relative cursor-pointer group">
              {/* Pulse ring for alerts */}
              {property.hasAlert && (
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: 24,
                    height: 24,
                    marginLeft: -5,
                    marginTop: -5,
                    background: 'rgba(212,133,90,0.4)',
                    animation: 'pulse-ring 1.5s ease-out infinite',
                  }}
                />
              )}
              
              {/* Main marker dot */}
              <motion.div
                whileHover={{ scale: 1.3 }}
                className="relative"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: property.hasAlert ? '#d4855a' : '#c9a84c',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: property.hasAlert 
                    ? '0 0 12px rgba(212,133,90,0.5), 0 2px 8px rgba(0,0,0,0.3)'
                    : '0 0 12px rgba(201,168,76,0.4), 0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {/* Inner highlight */}
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
            </div>
          </Marker>
        ))}
        
        {/* Popup for selected property */}
        {selectedProperty && (
          <Popup
            longitude={selectedProperty.lng}
            latitude={selectedProperty.lat}
            anchor="bottom"
            onClose={() => setSelectedProperty(null)}
            closeOnClick={false}
            offset={15}
          >
            <div className="p-3 min-w-[200px]">
              <p className="font-medium text-sm mb-1 text-text">
                {selectedProperty.name}
              </p>
              <p className="text-xs mb-2 text-text-muted">
                {selectedProperty.address}
              </p>
              <p className="text-xs text-text-faint mb-3">
                {selectedProperty.postcode}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.1)]">
                <span className="font-medium text-gold">
                  {formatCurrency(selectedProperty.revenueToday)}
                </span>
                <span className="text-text-muted text-xs">
                  {selectedProperty.occupancy}% occ.
                </span>
              </div>
              {selectedProperty.hasAlert && (
                <div className="mt-2 px-2 py-1 rounded text-xs bg-amber/20 text-amber">
                  Needs attention
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
