// ─────────────────────────────────────────────────────────
// STORE: Analytics Filters (Enhanced with Saved Presets & Cascading Helpers)
// Central Zustand store for all global analytics filters.
// ─────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AnalyticsFilters, DateRange, ID } from '@/types'

export interface SavedPreset {
  id: string
  name: string
  filters: AnalyticsFilters
}

interface AnalyticsFiltersState extends AnalyticsFilters {
  savedPresets: SavedPreset[]
  // Actions
  setDateRange: (range: DateRange | null) => void
  setFilter: <K extends keyof AnalyticsFilters>(key: K, value: AnalyticsFilters[K]) => void
  removeFilter: (key: keyof AnalyticsFilters) => void
  resetFilters: () => void
  activeFilterCount: () => number
  savePreset: (name: string) => void
  loadPreset: (presetId: string) => void
  deletePreset: (presetId: string) => void
}

const defaultFilters: AnalyticsFilters = {
  dateRange: null,
  division: null,
  district: null,
  upazila: null,
  territory: null,
  specialty: null,
  doctor: null,
  disease: null,
  therapeuticClass: null,
  molecule: null,
  brand: null,
  company: null,
}

export const useAnalyticsFilters = create<AnalyticsFiltersState>()(
  persist(
    (set, get) => ({
      ...defaultFilters,
      savedPresets: [
        {
          id: 'preset-1',
          name: 'Dhaka Division Focus',
          filters: { ...defaultFilters, division: 'Dhaka' },
        },
        {
          id: 'preset-2',
          name: 'Cardiovascular Specialty',
          filters: { ...defaultFilters, specialty: 'SPEC-002' },
        },
      ],

      setDateRange: (range: DateRange | null) => {
        set({ dateRange: range })
      },

      setFilter: <K extends keyof AnalyticsFilters>(key: K, value: AnalyticsFilters[K]) => {
        // Cascading reset logic:
        // Reset district & upazila if division changes
        if (key === 'division') {
          set({ division: value as string, district: null, upazila: null, territory: null })
          return
        }
        // Reset upazila if district changes
        if (key === 'district') {
          set({ district: value as ID, upazila: null })
          return
        }
        set({ [key]: value } as Partial<AnalyticsFiltersState>)
      },

      removeFilter: (key: keyof AnalyticsFilters) => {
        if (key === 'division') {
          set({ division: null, district: null, upazila: null, territory: null })
          return
        }
        if (key === 'district') {
          set({ district: null, upazila: null })
          return
        }
        set({ [key]: null } as Partial<AnalyticsFiltersState>)
      },

      resetFilters: () => {
        set({ ...defaultFilters })
      },

      activeFilterCount: (): number => {
        const state = get()
        const filterKeys: (keyof AnalyticsFilters)[] = [
          'dateRange', 'division', 'district', 'upazila', 'territory',
          'specialty', 'doctor', 'disease', 'therapeuticClass', 'molecule', 'brand', 'company',
        ]
        return filterKeys.filter((key) => state[key] !== null).length
      },

      savePreset: (name: string) => {
        const state = get()
        const currentFilters: AnalyticsFilters = {
          dateRange: state.dateRange,
          division: state.division,
          district: state.district,
          upazila: state.upazila,
          territory: state.territory,
          specialty: state.specialty,
          doctor: state.doctor,
          disease: state.disease,
          therapeuticClass: state.therapeuticClass,
          molecule: state.molecule,
          brand: state.brand,
          company: state.company,
        }
        const newPreset: SavedPreset = {
          id: `preset-${Date.now()}`,
          name,
          filters: currentFilters,
        }
        set({ savedPresets: [...state.savedPresets, newPreset] })
      },

      loadPreset: (presetId: string) => {
        const state = get()
        const target = state.savedPresets.find((p) => p.id === presetId)
        if (target) {
          set({ ...target.filters })
        }
      },

      deletePreset: (presetId: string) => {
        const state = get()
        set({ savedPresets: state.savedPresets.filter((p) => p.id !== presetId) })
      },
    }),
    {
      name: 'pharma-analytics-filters',
      partialize: (state) => ({ savedPresets: state.savedPresets }),
    }
  )
)

export type FilterKey = keyof AnalyticsFilters

export function getActiveFilters(state: AnalyticsFilters): Array<{ key: FilterKey; value: string | DateRange | ID }> {
  const filterKeys: FilterKey[] = [
    'dateRange', 'division', 'district', 'upazila', 'territory',
    'specialty', 'doctor', 'disease', 'therapeuticClass', 'molecule', 'brand', 'company',
  ]
  return filterKeys
    .filter((key) => state[key] !== null)
    .map((key) => ({ key, value: state[key] as string | DateRange | ID }))
}
