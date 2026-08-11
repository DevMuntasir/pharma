// ─────────────────────────────────────────────────────────
// COMPONENT: BangladeshMap
// Interactive bubble map of Bangladesh territories using
// react-leaflet + OpenStreetMap tiles. No API key needed.
// ─────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  TERRITORY_COORDS,
  BANGLADESH_CENTER,
  BANGLADESH_ZOOM,
} from '@/data/geo/territoryCoordinates'
import { territories } from '@/data'

export interface TerritoryMapData {
  id: string
  name: string
  division: string
  rxCount: number
  sharePct: number
  docCount: number
}

export interface BangladeshMapProps {
  data: TerritoryMapData[]
  selectedId?: string
  onSelect?: (id: string) => void
  height?: number | string
  mode?: 'bubble' | 'whitespace'
}

// ── Color helpers ────────────────────────────────────────

function getRxColor(share: number): string {
  if (share >= 15)  return '#6366f1' // top tier — violet
  if (share >= 10)  return '#0ea5e9' // blue
  if (share >= 6)   return '#10b981' // green
  if (share >= 3)   return '#f59e0b' // amber
  return '#6b7280'                   // grey — low
}

function getWhiteSpaceColor(share: number): string {
  if (share < 3)  return '#ef4444' // red — opportunity (low coverage)
  if (share < 6)  return '#f97316' // orange
  if (share < 10) return '#eab308' // yellow
  return '#22c55e'                 // green — well covered
}

function getBubbleRadius(rxCount: number, maxRx: number): number {
  const min = 8
  const max = 32
  if (maxRx === 0) return min
  return min + ((rxCount / maxRx) * (max - min))
}

// ── Zoom reset helper ────────────────────────────────────

function ResetView({ selectedId }: { selectedId?: string }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedId) {
      map.setView(BANGLADESH_CENTER, BANGLADESH_ZOOM)
    } else {
      const coord = TERRITORY_COORDS[selectedId]
      if (coord) map.setView([coord.lat, coord.lng], 9)
    }
  }, [selectedId, map])
  return null
}

// ── Main Component ───────────────────────────────────────

export function BangladeshMap({
  data,
  selectedId,
  onSelect,
  height = 420,
  mode = 'bubble',
}: BangladeshMapProps) {
  const maxRx = Math.max(...data.map((d) => d.rxCount), 1)

  const legendItems = mode === 'whitespace'
    ? [
        { color: '#22c55e', label: 'Well covered (10%+)' },
        { color: '#eab308', label: 'Moderate (6–10%)' },
        { color: '#f97316', label: 'Low (3–6%)' },
        { color: '#ef4444', label: 'White space (<3%)' },
      ]
    : [
        { color: '#6366f1', label: 'Top (15%+)' },
        { color: '#0ea5e9', label: 'High (10–15%)' },
        { color: '#10b981', label: 'Mid (6–10%)' },
        { color: '#f59e0b', label: 'Low (3–6%)' },
        { color: '#6b7280', label: 'Minimal (<3%)' },
      ]

  return (
    <div
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          background: 'rgba(10,11,14,0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '0.75rem',
          minWidth: '140px',
        }}
      >
        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          {mode === 'whitespace' ? 'Coverage Level' : 'Market Share'}
        </p>
        {legendItems.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
          </div>
        ))}
        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>Bubble size = Rx volume</p>
        </div>
      </div>

      <MapContainer
        center={BANGLADESH_CENTER}
        zoom={BANGLADESH_ZOOM}
        style={{ height: '100%', width: '100%', background: '#0a0b0e' }}
        zoomControl={true}
        scrollWheelZoom={true}
        id="bangladesh-map-container"
      >
        {/* Dark styled tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={18}
        />

        <ResetView selectedId={selectedId} />

        {/* Territory bubbles */}
        {data.map((ter) => {
          const coord = TERRITORY_COORDS[ter.id]
          if (!coord) return null

          const color = mode === 'whitespace'
            ? getWhiteSpaceColor(ter.sharePct)
            : getRxColor(ter.sharePct)
          const radius = getBubbleRadius(ter.rxCount, maxRx)
          const isSelected = ter.id === selectedId

          return (
            <CircleMarker
              key={ter.id}
              center={[coord.lat, coord.lng]}
              radius={isSelected ? radius + 5 : radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: isSelected ? 0.9 : 0.7,
                color: isSelected ? 'white' : color,
                weight: isSelected ? 2.5 : 1,
                opacity: 1,
              }}
              eventHandlers={{
                click: () => onSelect?.(ter.id),
              }}
            >
              <Tooltip permanent={false} sticky>
                <div style={{ padding: '2px 0', minWidth: '160px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: '4px', color: '#1f2937' }}>
                    {ter.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>
                    {ter.division} Division
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.7rem', background: '#ede9fe', color: '#6d28d9', padding: '1px 6px', borderRadius: '999px' }}>
                      {ter.sharePct.toFixed(1)}% share
                    </span>
                    <span style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '999px' }}>
                      {ter.rxCount.toLocaleString()} Rx
                    </span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                    👨‍⚕️ {ter.docCount} prescribers
                  </p>
                  {onSelect && (
                    <p style={{ fontSize: '0.65rem', color: '#6366f1', marginTop: '4px' }}>
                      Click to view details →
                    </p>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          )
        })}

        {/* Show territories without data as grey dots */}
        {territories
          .filter((t) => !data.find((d) => d.id === t.id))
          .map((t) => {
            const coord = TERRITORY_COORDS[t.id]
            if (!coord) return null
            return (
              <CircleMarker
                key={t.id}
                center={[coord.lat, coord.lng]}
                radius={5}
                pathOptions={{ fillColor: '#374151', fillOpacity: 0.5, color: '#374151', weight: 1 }}
              >
                <Tooltip sticky>
                  <span style={{ fontSize: '0.75rem', color: '#374151' }}>{t.name} — no data</span>
                </Tooltip>
              </CircleMarker>
            )
          })}
      </MapContainer>
    </div>
  )
}
