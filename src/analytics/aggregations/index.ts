// ─────────────────────────────────────────────────────────
// ANALYTICS: Aggregation utilities
// Pure functions — no React dependencies.
// ─────────────────────────────────────────────────────────

import type { Prescription, PrescriptionItem, TimeDimension } from '@/types'

type WithTime = TimeDimension & { id: string }

// ── Group by helpers ──────────────────────────────────────

export function groupByMonth<T extends WithTime>(records: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>()
  records.forEach((r) => {
    const key = `${r.year}-${String(r.month).padStart(2, '0')}`
    const existing = map.get(key) ?? []
    existing.push(r)
    map.set(key, existing)
  })
  return map
}

export function groupByQuarter<T extends WithTime>(records: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>()
  records.forEach((r) => {
    const key = `${r.year}-Q${r.quarter}`
    const existing = map.get(key) ?? []
    existing.push(r)
    map.set(key, existing)
  })
  return map
}

export function groupByBrand(items: PrescriptionItem[]): Map<string, PrescriptionItem[]> {
  const map = new Map<string, PrescriptionItem[]>()
  items.forEach((item) => {
    const existing = map.get(item.brandId) ?? []
    existing.push(item)
    map.set(item.brandId, existing)
  })
  return map
}

export function groupByMolecule(items: PrescriptionItem[]): Map<string, PrescriptionItem[]> {
  const map = new Map<string, PrescriptionItem[]>()
  items.forEach((item) => {
    const existing = map.get(item.moleculeId) ?? []
    existing.push(item)
    map.set(item.moleculeId, existing)
  })
  return map
}

export function groupByTerritory(prescriptions: Prescription[]): Map<string, Prescription[]> {
  const map = new Map<string, Prescription[]>()
  prescriptions.forEach((rx) => {
    const existing = map.get(rx.territoryId) ?? []
    existing.push(rx)
    map.set(rx.territoryId, existing)
  })
  return map
}

export function groupByDoctor(prescriptions: Prescription[]): Map<string, Prescription[]> {
  const map = new Map<string, Prescription[]>()
  prescriptions.forEach((rx) => {
    const existing = map.get(rx.doctorId) ?? []
    existing.push(rx)
    map.set(rx.doctorId, existing)
  })
  return map
}

export function groupBySpecialty(
  prescriptions: Prescription[],
  doctorSpecialtyMap: Map<string, string>
): Map<string, Prescription[]> {
  const map = new Map<string, Prescription[]>()
  prescriptions.forEach((rx) => {
    const specialtyId = doctorSpecialtyMap.get(rx.doctorId) ?? 'unknown'
    const existing = map.get(specialtyId) ?? []
    existing.push(rx)
    map.set(specialtyId, existing)
  })
  return map
}

export function groupByDisease(prescriptions: Prescription[]): Map<string, Prescription[]> {
  const map = new Map<string, Prescription[]>()
  prescriptions.forEach((rx) => {
    rx.diagnosisIds.forEach((diseaseId) => {
      const existing = map.get(diseaseId) ?? []
      existing.push(rx)
      map.set(diseaseId, existing)
    })
  })
  return map
}

// ── Date range filter ──────────────────────────────────────

export function filterByDateRange<T extends WithTime>(
  records: T[],
  startDate: string,
  endDate: string
): T[] {
  return records.filter((r) => r.date >= startDate && r.date <= endDate)
}

// ── Sorted map keys ────────────────────────────────────────

export function sortedMapEntries<T>(map: Map<string, T[]>): Array<[string, T[]]> {
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
}
