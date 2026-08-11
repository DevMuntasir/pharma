// ─────────────────────────────────────────────────────────
// ANALYTICS: Descriptive Functions
// Pure functions — no React dependencies.
// ─────────────────────────────────────────────────────────

import type {
  Prescription,
  PrescriptionItem,
  GrowthResult,
  ShareResult,
  DistributionResult,
  TimeSeriesPoint,
} from '@/types'
import { groupByMonth, groupByBrand, groupByMolecule, groupByTerritory, groupByDoctor, groupByDisease } from '../aggregations'

// ── Total counts ──────────────────────────────────────────

export function getTotalPrescriptions(prescriptions: Prescription[]): number {
  return prescriptions.length
}

export function getTotalPrescriptionItems(items: PrescriptionItem[]): number {
  return items.length
}

// ── Growth ────────────────────────────────────────────────

export function getPrescriptionGrowth(
  prescriptions: Prescription[],
  currentYear: number,
  currentMonth: number,
  compareYear: number,
  compareMonth: number
): GrowthResult {
  const current = prescriptions.filter(
    (rx) => rx.year === currentYear && rx.month === currentMonth
  ).length

  const previous = prescriptions.filter(
    (rx) => rx.year === compareYear && rx.month === compareMonth
  ).length

  const growth = previous === 0 ? 0 : ((current - previous) / previous) * 100

  return {
    current,
    previous,
    growth: Math.round(growth * 10) / 10,
    growthDirection: growth > 0 ? 'up' : growth < 0 ? 'down' : 'flat',
  }
}

// ── Share calculations ────────────────────────────────────

export function getBrandShare(
  items: PrescriptionItem[],
  brandNameMap: Map<string, string>
): ShareResult[] {
  const byBrand = groupByBrand(items)
  const total = items.length
  if (total === 0) return []

  const results: ShareResult[] = []
  byBrand.forEach((brandItems, brandId) => {
    results.push({
      entityId: brandId,
      entityName: brandNameMap.get(brandId) ?? brandId,
      value: brandItems.length,
      share: Math.round((brandItems.length / total) * 1000) / 10,
      rank: 0,
    })
  })

  results.sort((a, b) => b.value - a.value)
  results.forEach((r, i) => { r.rank = i + 1 })
  return results
}

export function getMoleculeShare(
  items: PrescriptionItem[],
  moleculeNameMap: Map<string, string>
): ShareResult[] {
  const byMol = groupByMolecule(items)
  const total = items.length
  if (total === 0) return []

  const results: ShareResult[] = []
  byMol.forEach((molItems, molId) => {
    results.push({
      entityId: molId,
      entityName: moleculeNameMap.get(molId) ?? molId,
      value: molItems.length,
      share: Math.round((molItems.length / total) * 1000) / 10,
      rank: 0,
    })
  })

  results.sort((a, b) => b.value - a.value)
  results.forEach((r, i) => { r.rank = i + 1 })
  return results
}

export function getTerritoryShare(
  prescriptions: Prescription[],
  territoryNameMap: Map<string, string>
): ShareResult[] {
  const byTerritory = groupByTerritory(prescriptions)
  const total = prescriptions.length
  if (total === 0) return []

  const results: ShareResult[] = []
  byTerritory.forEach((rxs, territoryId) => {
    results.push({
      entityId: territoryId,
      entityName: territoryNameMap.get(territoryId) ?? territoryId,
      value: rxs.length,
      share: Math.round((rxs.length / total) * 1000) / 10,
      rank: 0,
    })
  })

  results.sort((a, b) => b.value - a.value)
  results.forEach((r, i) => { r.rank = i + 1 })
  return results
}

// ── Distributions ─────────────────────────────────────────

export function getDiseaseDistribution(
  prescriptions: Prescription[],
  diseaseNameMap: Map<string, string>
): DistributionResult[] {
  const byDisease = groupByDisease(prescriptions)
  const total = prescriptions.length
  if (total === 0) return []

  const results: DistributionResult[] = []
  byDisease.forEach((rxs, diseaseId) => {
    results.push({
      label: diseaseNameMap.get(diseaseId) ?? diseaseId,
      count: rxs.length,
      percentage: Math.round((rxs.length / total) * 1000) / 10,
    })
  })

  return results.sort((a, b) => b.count - a.count)
}

export function getDoctorDistribution(
  prescriptions: Prescription[],
  doctorNameMap: Map<string, string>
): DistributionResult[] {
  const byDoctor = groupByDoctor(prescriptions)
  const total = prescriptions.length
  if (total === 0) return []

  const results: DistributionResult[] = []
  byDoctor.forEach((rxs, doctorId) => {
    results.push({
      label: doctorNameMap.get(doctorId) ?? doctorId,
      count: rxs.length,
      percentage: Math.round((rxs.length / total) * 1000) / 10,
    })
  })

  return results.sort((a, b) => b.count - a.count)
}

export function getSpecialtyDistribution(
  prescriptions: Prescription[],
  doctorSpecialtyMap: Map<string, string>,
  specialtyNameMap: Map<string, string>
): DistributionResult[] {
  const bySpecialty = new Map<string, number>()
  const total = prescriptions.length
  if (total === 0) return []

  prescriptions.forEach((rx) => {
    const specId = doctorSpecialtyMap.get(rx.doctorId) ?? 'unknown'
    bySpecialty.set(specId, (bySpecialty.get(specId) ?? 0) + 1)
  })

  const results: DistributionResult[] = []
  bySpecialty.forEach((count, specId) => {
    results.push({
      label: specialtyNameMap.get(specId) ?? specId,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
    })
  })

  return results.sort((a, b) => b.count - a.count)
}

// ── Prescription type rates ───────────────────────────────

export function getNewPrescriptionRate(prescriptions: Prescription[]): number {
  if (prescriptions.length === 0) return 0
  const count = prescriptions.filter((rx) => rx.prescriptionType === 'NEW').length
  return Math.round((count / prescriptions.length) * 1000) / 10
}

export function getRepeatPrescriptionRate(prescriptions: Prescription[]): number {
  if (prescriptions.length === 0) return 0
  const count = prescriptions.filter((rx) => rx.prescriptionType === 'REPEAT').length
  return Math.round((count / prescriptions.length) * 1000) / 10
}

export function getSwitchPrescriptionRate(prescriptions: Prescription[]): number {
  if (prescriptions.length === 0) return 0
  const count = prescriptions.filter((rx) => rx.prescriptionType === 'SWITCH').length
  return Math.round((count / prescriptions.length) * 1000) / 10
}

// ── Time-series ───────────────────────────────────────────

export function getPrescriptionTimeSeries(prescriptions: Prescription[]): TimeSeriesPoint[] {
  const byMonth = groupByMonth(prescriptions)
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, rxs]) => {
      const first = rxs[0]
      return {
        date: first.date,
        month: first.month,
        quarter: first.quarter,
        year: first.year,
        label: key,
        value: rxs.length,
      }
    })
}
