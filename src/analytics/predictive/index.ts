// ─────────────────────────────────────────────────────────
// ANALYTICS: Predictive Foundation
// All outputs are clearly labeled as SIMULATED FORECAST.
// No real ML — deterministic simulation for demo purposes.
// ─────────────────────────────────────────────────────────

import type { Forecast, ForecastPoint } from '@/types'
import { groupByMonth } from '../aggregations'

const FORECAST_LABEL = 'SIMULATED FORECAST' as const

// Simple linear trend extrapolation (deterministic, no randomness)
function linearTrend(values: number[]): number {
  if (values.length < 2) return values[0] ?? 0
  const n = values.length
  const last = values[n - 1]
  const secondLast = values[n - 2]
  const avgChange = (last - values[0]) / (n - 1)
  return Math.max(0, last + avgChange * 0.8 + (last - secondLast) * 0.2)
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().split('T')[0]
}

function getTimeDim(dateStr: string) {
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  return {
    month,
    quarter: Math.ceil(month / 3) as 1 | 2 | 3 | 4,
    year: d.getFullYear(),
  }
}

interface HasDateAndId {
  id: string
  date: string
  month: number
  quarter: 1 | 2 | 3 | 4
  year: number
}

function buildForecastPoints(
  historicalMonthly: Map<string, HasDateAndId[]>,
  horizonMonths: number,
  lastHistoricalDate: string
): ForecastPoint[] {
  const monthKeys = Array.from(historicalMonthly.keys()).sort()
  const historicalCounts = monthKeys.map((k) => historicalMonthly.get(k)?.length ?? 0)

  const points: ForecastPoint[] = []
  for (let i = 1; i <= horizonMonths; i++) {
    const futureDate = addMonths(lastHistoricalDate, i)
    const timeDim = getTimeDim(futureDate)
    const projected = linearTrend([...historicalCounts, ...points.map((p) => p.predictedValue)])
    const confidence = Math.max(0.6, 0.95 - i * 0.03)

    points.push({
      date: futureDate,
      month: timeDim.month,
      quarter: timeDim.quarter,
      year: timeDim.year,
      predictedValue: Math.round(projected),
      lowerBound: Math.round(projected * (1 - (1 - confidence) * 1.5)),
      upperBound: Math.round(projected * (1 + (1 - confidence) * 1.5)),
    })
  }
  return points
}

// ── Prescription forecast ──────────────────────────────────

export function forecastPrescription(
  prescriptions: HasDateAndId[],
  horizonMonths = 6
): Forecast {
  const byMonth = groupByMonth(prescriptions)
  const lastDate = prescriptions.sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? '2024-12-01'
  const predictions = buildForecastPoints(byMonth, horizonMonths, lastDate)

  return {
    id: 'FORE-PRESC-001',
    forecastLabel: FORECAST_LABEL,
    entityType: 'prescription',
    entityId: 'ALL',
    entityName: 'Total Prescriptions',
    horizon: 'monthly',
    predictions,
    confidence: 78,
    methodology: 'Linear trend extrapolation — SIMULATED FORECAST',
    generatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}

// ── Brand forecast ────────────────────────────────────────

export function forecastBrandGrowth(
  brandItems: HasDateAndId[],
  brandId: string,
  brandName: string,
  horizonMonths = 6
): Forecast {
  const byMonth = groupByMonth(brandItems)
  const lastDate = brandItems.sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? '2024-12-01'
  const predictions = buildForecastPoints(byMonth, horizonMonths, lastDate)

  return {
    id: `FORE-BRAND-${brandId}`,
    forecastLabel: FORECAST_LABEL,
    entityType: 'brand',
    entityId: brandId,
    entityName: brandName,
    horizon: 'monthly',
    predictions,
    confidence: 72,
    methodology: 'Linear trend extrapolation — SIMULATED FORECAST',
    generatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}

// ── Molecule forecast ──────────────────────────────────────

export function forecastMoleculeGrowth(
  moleculeItems: HasDateAndId[],
  moleculeId: string,
  moleculeName: string,
  horizonMonths = 6
): Forecast {
  const byMonth = groupByMonth(moleculeItems)
  const lastDate = moleculeItems.sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? '2024-12-01'
  const predictions = buildForecastPoints(byMonth, horizonMonths, lastDate)

  return {
    id: `FORE-MOL-${moleculeId}`,
    forecastLabel: FORECAST_LABEL,
    entityType: 'molecule',
    entityId: moleculeId,
    entityName: moleculeName,
    horizon: 'monthly',
    predictions,
    confidence: 70,
    methodology: 'Linear trend extrapolation — SIMULATED FORECAST',
    generatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}

// ── Territory demand forecast ──────────────────────────────

export function forecastTerritoryDemand(
  territoryPrescriptions: HasDateAndId[],
  territoryId: string,
  territoryName: string,
  horizonMonths = 6
): Forecast {
  const byMonth = groupByMonth(territoryPrescriptions)
  const lastDate = territoryPrescriptions.sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? '2024-12-01'
  const predictions = buildForecastPoints(byMonth, horizonMonths, lastDate)

  return {
    id: `FORE-TER-${territoryId}`,
    forecastLabel: FORECAST_LABEL,
    entityType: 'territory',
    entityId: territoryId,
    entityName: territoryName,
    horizon: 'monthly',
    predictions,
    confidence: 68,
    methodology: 'Linear trend extrapolation — SIMULATED FORECAST',
    generatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}
