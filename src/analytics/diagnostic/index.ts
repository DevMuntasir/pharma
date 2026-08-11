// ─────────────────────────────────────────────────────────
// ANALYTICS: Diagnostic Functions
// Pure functions — no React dependencies.
// ─────────────────────────────────────────────────────────

import type { Prescription, PrescriptionItem, GrowthResult, ShareResult } from '@/types'
import { groupByMonth, groupByBrand, groupByTerritory } from '../aggregations'

export interface MarketShareMovement {
  entityId: string
  entityName: string
  currentShare: number
  previousShare: number
  movement: number
  trend: 'gaining' | 'losing' | 'stable'
}

export interface TerritoryPerformance {
  territoryId: string
  territoryName: string
  prescriptionCount: number
  growth: GrowthResult
  rank: number
}

export interface BrandDeclineSignal {
  brandId: string
  brandName: string
  declineRate: number // negative percentage
  monthsDeclined: number
  severity: 'mild' | 'moderate' | 'severe'
}

export interface CompetitorMovement {
  competitorId: string
  competitorName: string
  shareChange: number
  direction: 'gaining' | 'losing'
  topGainingBrands: ShareResult[]
}

// ── Market share movement ─────────────────────────────────

export function getMarketShareMovement(
  items: PrescriptionItem[],
  brandNameMap: Map<string, string>,
  currentStart: string,
  currentEnd: string,
  previousStart: string,
  previousEnd: string
): MarketShareMovement[] {
  const currentItems = items.filter((i) => i.date >= currentStart && i.date <= currentEnd)
  const previousItems = items.filter((i) => i.date >= previousStart && i.date <= previousEnd)

  const currentByBrand = groupByBrand(currentItems)
  const previousByBrand = groupByBrand(previousItems)
  const currentTotal = currentItems.length
  const previousTotal = previousItems.length

  const allBrandIds = new Set([...currentByBrand.keys(), ...previousByBrand.keys()])
  const results: MarketShareMovement[] = []

  allBrandIds.forEach((brandId) => {
    const currentCount = currentByBrand.get(brandId)?.length ?? 0
    const previousCount = previousByBrand.get(brandId)?.length ?? 0
    const currentShare = currentTotal === 0 ? 0 : (currentCount / currentTotal) * 100
    const previousShare = previousTotal === 0 ? 0 : (previousCount / previousTotal) * 100
    const movement = currentShare - previousShare

    results.push({
      entityId: brandId,
      entityName: brandNameMap.get(brandId) ?? brandId,
      currentShare: Math.round(currentShare * 10) / 10,
      previousShare: Math.round(previousShare * 10) / 10,
      movement: Math.round(movement * 10) / 10,
      trend: Math.abs(movement) < 0.5 ? 'stable' : movement > 0 ? 'gaining' : 'losing',
    })
  })

  return results.sort((a, b) => Math.abs(b.movement) - Math.abs(a.movement))
}

// ── Territory performance ──────────────────────────────────

export function getTerritoryPerformance(
  prescriptions: Prescription[],
  territoryNameMap: Map<string, string>,
  currentYear: number,
  previousYear: number
): TerritoryPerformance[] {
  const byTerritory = groupByTerritory(prescriptions)
  const results: TerritoryPerformance[] = []

  byTerritory.forEach((rxs, territoryId) => {
    const currentCount = rxs.filter((r) => r.year === currentYear).length
    const previousCount = rxs.filter((r) => r.year === previousYear).length
    const growthPct = previousCount === 0 ? 0 : ((currentCount - previousCount) / previousCount) * 100

    results.push({
      territoryId,
      territoryName: territoryNameMap.get(territoryId) ?? territoryId,
      prescriptionCount: currentCount,
      growth: {
        current: currentCount,
        previous: previousCount,
        growth: Math.round(growthPct * 10) / 10,
        growthDirection: growthPct > 0 ? 'up' : growthPct < 0 ? 'down' : 'flat',
      },
      rank: 0,
    })
  })

  results.sort((a, b) => b.prescriptionCount - a.prescriptionCount)
  results.forEach((r, i) => { r.rank = i + 1 })
  return results
}

// ── Brand decline signals ──────────────────────────────────

export function getBrandDeclineSignals(
  items: PrescriptionItem[],
  brandNameMap: Map<string, string>
): BrandDeclineSignal[] {
  const byBrand = groupByBrand(items)
  const signals: BrandDeclineSignal[] = []

  byBrand.forEach((brandItems, brandId) => {
    const byMonth = groupByMonth(brandItems)
    const monthKeys = Array.from(byMonth.keys()).sort()

    if (monthKeys.length < 3) return

    const lastThree = monthKeys.slice(-3).map((k) => byMonth.get(k)?.length ?? 0)
    const [m1, m2, m3] = lastThree

    const isDeclined = m3 < m2 && m2 < m1
    if (!isDeclined) return

    const declineRate = m1 === 0 ? 0 : ((m3 - m1) / m1) * 100
    const absDecline = Math.abs(declineRate)

    signals.push({
      brandId,
      brandName: brandNameMap.get(brandId) ?? brandId,
      declineRate: Math.round(declineRate * 10) / 10,
      monthsDeclined: 2,
      severity: absDecline > 30 ? 'severe' : absDecline > 15 ? 'moderate' : 'mild',
    })
  })

  return signals.sort((a, b) => a.declineRate - b.declineRate)
}

// ── Competitor movement placeholder ───────────────────────

export function getCompetitorMovement(
  _prescriptions: Prescription[],
  _competitorCompanyIds: Set<string>
): CompetitorMovement[] {
  // Foundation: returns empty in current milestone.
  // Will be implemented when competitor tracking data is available.
  return []
}
