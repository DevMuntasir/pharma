// ─────────────────────────────────────────────────────────
// FEATURE: Predictive Forecast Suite
// Demand, Product, and Territory Forecasts (SIMULATED FORECAST)
// ─────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { PageHeader } from '@/components/ui/Headers'
import { KpiCard } from '@/components/cards/KpiCard'
import { LineChart, ChartCard } from '@/components/charts'
import { prescriptions, brands } from '@/data'
import { forecastPrescription, forecastBrandGrowth } from '@/analytics'

export function DemandForecastPage() {
  const forecast = useMemo(() => forecastPrescription(prescriptions, 6), [])

  const chartData = useMemo(() => {
    return forecast.predictions.map((p) => ({
      label: p.date.substring(0, 7),
      Projected: p.predictedValue,
      LowerBound: p.lowerBound,
      UpperBound: p.upperBound,
    }))
  }, [forecast])

  return (
    <div>
      <PageHeader
        title="Demand Forecast"
        description="Simulated 6-month prescription demand projections with confidence upper/lower bounds."
        badge="SIMULATED FORECAST"
        breadcrumbs={[{ label: 'Predictive' }, { label: 'Demand Forecast' }]}
      />

      <div className="kpi-grid mb-6">
        <KpiCard title="Projected Next Month" value={`${forecast.predictions[0]?.predictedValue ?? 0} Rx`} subtitle="Model prediction" accent="blue" />
        <KpiCard title="Forecast Horizon" value="6 Months" subtitle="Monthly granularity" accent="cyan" />
        <KpiCard title="Model Confidence" value={`${forecast.confidence}%`} subtitle="Confidence score" accent="emerald" />
      </div>

      <ChartCard title="6-Month Demand Projection with Confidence Bounds" subtitle="Linear trend extrapolation model" height={320}>
        <LineChart
          data={chartData}
          lines={[
            { key: 'Projected', label: 'Projected Demand', color: '#3b82f6' },
            { key: 'UpperBound', label: 'Upper Bound (95%)', color: '#10b981' },
            { key: 'LowerBound', label: 'Lower Bound (95%)', color: '#f43f5e' },
          ]}
          height={300}
        />
      </ChartCard>
    </div>
  )
}

export function ProductForecastPage() {
  const topBrand = brands[0]
  const brandItems = prescriptions.flatMap((r) => r.items).filter((i) => i.brandId === topBrand.id)
  const forecast = useMemo(() => forecastBrandGrowth(brandItems, topBrand.id, topBrand.name, 6), [brandItems, topBrand])

  const chartData = useMemo(() => {
    return forecast.predictions.map((p) => ({
      label: p.date.substring(0, 7),
      PredictedRx: p.predictedValue,
    }))
  }, [forecast])

  return (
    <div>
      <PageHeader
        title="Product Forecast"
        description="Brand and molecule level prescription growth projections."
        badge="SIMULATED FORECAST"
        breadcrumbs={[{ label: 'Predictive' }, { label: 'Product Forecast' }]}
      />
      <ChartCard title={`Brand Growth Projection: ${topBrand.name}`} subtitle="Simulated 6-month trajectory" height={320}>
        <LineChart data={chartData} lines={[{ key: 'PredictedRx', label: `${topBrand.name} Projected Rx`, color: '#06b6d4' }]} height={300} />
      </ChartCard>
    </div>
  )
}

export function TerritoryForecastPage() {
  const terForecast = [
    { label: 'Jul 2024', Dhaka: 320, Chittagong: 240, Sylhet: 180 },
    { label: 'Aug 2024', Dhaka: 335, Chittagong: 250, Sylhet: 188 },
    { label: 'Sep 2024', Dhaka: 350, Chittagong: 262, Sylhet: 195 },
    { label: 'Oct 2024', Dhaka: 368, Chittagong: 275, Sylhet: 204 },
  ]

  return (
    <div>
      <PageHeader
        title="Territory Forecast"
        description="Regional demand projections to guide field force deployment."
        badge="SIMULATED FORECAST"
        breadcrumbs={[{ label: 'Predictive' }, { label: 'Territory Forecast' }]}
      />
      <ChartCard title="Territory Demand Forecast Comparison" subtitle="Projected volume across major territories" height={320}>
        <LineChart
          data={terForecast}
          lines={[
            { key: 'Dhaka', label: 'Dhaka Territory', color: '#3b82f6' },
            { key: 'Chittagong', label: 'Chittagong Territory', color: '#06b6d4' },
            { key: 'Sylhet', label: 'Sylhet Territory', color: '#10b981' },
          ]}
          height={300}
        />
      </ChartCard>
    </div>
  )
}
