// ─────────────────────────────────────────────────────────
// COMPONENT: FilterBar + FilterChip + Cascading Selector
// Complete global filter management with Saved Presets & Cascades
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import { X, SlidersHorizontal, Bookmark, Plus, Calendar } from 'lucide-react'
import { useAnalyticsFilters, type FilterKey, getActiveFilters } from '@/store/useAnalyticsFilters'
import { BANGLADESH_DIVISIONS } from '@/constants'
import { districts, specialties, companies, brands } from '@/data'
import type { DateRange } from '@/types'
import { cn } from '@/utils'

const FILTER_LABELS: Record<FilterKey, string> = {
  dateRange: 'Date Range',
  division: 'Division',
  district: 'District',
  upazila: 'Upazila',
  territory: 'Territory',
  specialty: 'Specialty',
  doctor: 'Doctor',
  disease: 'Disease',
  therapeuticClass: 'Therapeutic Class',
  molecule: 'Molecule',
  brand: 'Brand',
  company: 'Company',
}

function formatFilterValue(key: FilterKey, value: string | DateRange | null): string {
  if (value === null) return ''
  if (key === 'dateRange' && typeof value === 'object') {
    const { startDate, endDate } = value as DateRange
    return `${startDate} → ${endDate}`
  }
  return String(value)
}

export function FilterChip({ label, value, onRemove, className }: { label: string; value: string; onRemove: () => void; className?: string }) {
  return (
    <div className={cn('filter-chip', className)}>
      <span className="text-[var(--color-text-muted)] mr-0.5">{label}:</span>
      <span className="font-semibold text-white">{value}</span>
      <button className="filter-chip-remove ml-1" onClick={onRemove} aria-label={`Remove ${label} filter`} type="button">
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  )
}

export function FilterBar({ className }: { className?: string }) {
  const filterState = useAnalyticsFilters()
  const {
    division,
    district,
    specialty,
    company,
    brand,
    setFilter,
    removeFilter,
    resetFilters,
    setDateRange,
    activeFilterCount,
    savedPresets,
    savePreset,
    loadPreset,
  } = filterState

  const activeFilters = getActiveFilters(filterState)
  const count = activeFilterCount()

  const [presetInput, setPresetInput] = useState('')
  const [showPresetSave, setShowPresetSave] = useState(false)

  // Cascading districts based on selected division
  const availableDistricts = division ? districts.filter((d) => d.division === division) : districts

  // Date range presets
  const handleDatePreset = (preset: '30' | '90' | 'ytd' | '2023') => {
    if (preset === '30') setDateRange({ startDate: '2024-05-01', endDate: '2024-06-01' })
    if (preset === '90') setDateRange({ startDate: '2024-03-01', endDate: '2024-06-01' })
    if (preset === 'ytd') setDateRange({ startDate: '2024-01-01', endDate: '2024-12-31' })
    if (preset === '2023') setDateRange({ startDate: '2023-01-01', endDate: '2023-12-31' })
  }

  const handleSavePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!presetInput.trim()) return
    savePreset(presetInput.trim())
    setPresetInput('')
    setShowPresetSave(false)
  }

  return (
    <div className={cn('space-y-2 mb-4 card p-3 border-[var(--color-border)] bg-[var(--color-bg-surface)]', className)}>
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-secondary)] mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
            <span>Analytics Filters</span>
          </div>

          {/* Division Cascade Select */}
          <select
            className="input text-xs h-7 py-0 max-w-[130px]"
            value={division ?? ''}
            onChange={(e) => setFilter('division', e.target.value || null)}
          >
            <option value="">Division: All</option>
            {BANGLADESH_DIVISIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* District Cascade Select */}
          <select
            className="input text-xs h-7 py-0 max-w-[130px]"
            value={district ?? ''}
            onChange={(e) => setFilter('district', e.target.value || null)}
          >
            <option value="">District: All</option>
            {availableDistricts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Specialty Select */}
          <select
            className="input text-xs h-7 py-0 max-w-[140px]"
            value={specialty ?? ''}
            onChange={(e) => setFilter('specialty', e.target.value || null)}
          >
            <option value="">Specialty: All</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Company Select */}
          <select
            className="input text-xs h-7 py-0 max-w-[130px]"
            value={company ?? ''}
            onChange={(e) => setFilter('company', e.target.value || null)}
          >
            <option value="">Company: All</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.shortName}</option>
            ))}
          </select>

          {/* Brand Select */}
          <select
            className="input text-xs h-7 py-0 max-w-[130px]"
            value={brand ?? ''}
            onChange={(e) => setFilter('brand', e.target.value || null)}
          >
            <option value="">Brand: All</option>
            {brands.slice(0, 15).map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Date Range Quick Presets & Presets Menu */}
        <div className="flex items-center gap-1.5">
          <button className="btn btn-ghost btn-sm text-2xs" onClick={() => handleDatePreset('ytd')}>
            <Calendar className="w-3 h-3 text-[var(--color-accent-secondary)]" />
            <span>2024 YTD</span>
          </button>
          <button className="btn btn-ghost btn-sm text-2xs" onClick={() => handleDatePreset('2023')}>
            <span>2023</span>
          </button>

          {/* Presets dropdown */}
          <select
            className="input text-xs h-7 py-0 max-w-[150px] bg-[var(--color-bg-elevated)]"
            onChange={(e) => e.target.value && loadPreset(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Load Saved Preset...</option>
            {savedPresets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            className="btn btn-ghost btn-sm p-1"
            title="Save current filters as preset"
            onClick={() => setShowPresetSave(!showPresetSave)}
          >
            <Bookmark className="w-3.5 h-3.5 text-[var(--color-accent-amber)]" />
          </button>
        </div>
      </div>

      {/* Save Preset Inline Input */}
      {showPresetSave && (
        <form onSubmit={handleSavePresetSubmit} className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
          <input
            type="text"
            className="input text-xs h-7 max-w-xs"
            placeholder="Preset Name (e.g. Dhaka Cardiology Watch)"
            value={presetInput}
            onChange={(e) => setPresetInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm text-xs" disabled={!presetInput.trim()}>
            <Plus className="w-3 h-3" />
            <span>Save Preset</span>
          </button>
        </form>
      )}

      {/* Active Filter Chips Bar */}
      {count > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[var(--color-border-subtle)]">
          <span className="text-2xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Active ({count}):</span>
          {activeFilters.map(({ key, value }) => (
            <FilterChip
              key={key}
              label={FILTER_LABELS[key]}
              value={formatFilterValue(key, value)}
              onRemove={() => removeFilter(key)}
            />
          ))}
          <button
            className="text-2xs text-[var(--color-text-muted)] hover:text-[var(--color-text-danger)] transition-colors ml-auto font-semibold uppercase"
            onClick={resetFilters}
            type="button"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
