// ─────────────────────────────────────────────────────────
// FEATURE: Demand & Seasonality Analytics
// Demand volume trends, Seasonality heatmaps, Availability warnings
// ─────────────────────────────────────────────────────────

import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { FilterBar } from '@/components/filters/FilterBar'
import { KpiCard } from '@/components/cards/KpiCard'
import { LineChart, ChartCard } from '@/components/charts'
import { DataTable } from '@/components/tables/DataTable'

export function DemandAnalyticsPage() {
  const demandTrend = [
    { label: 'Q1 2023', Volume: 1240 },
    { label: 'Q2 2023', Volume: 1380 },
    { label: 'Q3 2023', Volume: 1450 },
    { label: 'Q4 2023', Volume: 1520 },
    { label: 'Q1 2024', Volume: 1610 },
    { label: 'Q2 2024', Volume: 1740 },
  ]

  return (
    <div>
      <PageHeader
        title="Demand Analytics"
        description="Prescription demand volume trends, quarterly growth, and regional demand dynamics."
        breadcrumbs={[{ label: 'Demand' }, { label: 'Demand Analytics' }]}
      />
      <FilterBar />

      <div className="kpi-grid mb-6">
        <KpiCard title="Quarterly Demand Volume" value="1,740 Rx" subtitle="Q2 2024 total" accent="blue" />
        <KpiCard title="Quarterly Growth" value="+8.0%" subtitle="vs Q1 2024" accent="emerald" />
        <KpiCard title="Avg Items per Rx" value="2.4 items" subtitle="Prescription intensity" accent="cyan" />
      </div>

      <ChartCard title="Quarterly Prescription Demand Trajectory" subtitle="Aggregated demand trends" height={300}>
        <LineChart data={demandTrend} lines={[{ key: 'Volume', label: 'Demand Volume', color: '#06b6d4' }]} height={280} />
      </ChartCard>
    </div>
  )
}

// ── Seasonality Analytics Page ─────────────────────────────

export function SeasonalityPage() {
  const seasonalData = [
    { label: 'Jan', Respiratory: 145, Gastrointestinal: 110, Antibiotics: 130 },
    { label: 'Feb', Respiratory: 138, Gastrointestinal: 115, Antibiotics: 125 },
    { label: 'Mar', Respiratory: 120, Gastrointestinal: 125, Antibiotics: 118 },
    { label: 'Apr', Respiratory: 105, Gastrointestinal: 140, Antibiotics: 112 },
    { label: 'May', Respiratory: 98,  Gastrointestinal: 155, Antibiotics: 108 },
    { label: 'Jun', Respiratory: 112, Gastrointestinal: 165, Antibiotics: 142 },
    { label: 'Jul', Respiratory: 135, Gastrointestinal: 170, Antibiotics: 168 },
    { label: 'Aug', Respiratory: 158, Gastrointestinal: 160, Antibiotics: 175 },
    { label: 'Sep', Respiratory: 165, Gastrointestinal: 148, Antibiotics: 160 },
    { label: 'Oct', Respiratory: 172, Gastrointestinal: 135, Antibiotics: 148 },
    { label: 'Nov', Respiratory: 185, Gastrointestinal: 120, Antibiotics: 138 },
    { label: 'Dec', Respiratory: 192, Gastrointestinal: 112, Antibiotics: 142 },
  ]

  return (
    <div>
      <PageHeader
        title="Seasonality Analytics"
        description="Identify seasonal prescription spikes (e.g. winter respiratory, monsoon gastrointestinal)."
        breadcrumbs={[{ label: 'Demand' }, { label: 'Seasonality' }]}
      />
      <ChartCard title="Therapeutic Category Seasonality Patterns" subtitle="Monthly prescription volume fluctuations" height={320}>
        <LineChart
          data={seasonalData}
          lines={[
            { key: 'Respiratory', label: 'Respiratory (Winter Peak)', color: '#f43f5e' },
            { key: 'Gastrointestinal', label: 'Gastrointestinal (Monsoon Peak)', color: '#06b6d4' },
            { key: 'Antibiotics', label: 'Antibiotics', color: '#f59e0b' },
          ]}
          height={300}
        />
      </ChartCard>
    </div>
  )
}

// ── Availability Analytics Page ───────────────────────────

export function AvailabilityPage() {
  const stockouts = [
    { territory: 'Dhaka North', brand: 'NovaZith 250', stockStatus: 'Low Stock (< 5 days)', risk: 'HIGH' },
    { territory: 'Chittagong Metro', brand: 'ZenSal Inhaler', stockStatus: 'Out of Stock', risk: 'CRITICAL' },
    { territory: 'Sylhet Metro', brand: 'AxiEso 40', stockStatus: 'Low Stock (< 7 days)', risk: 'MEDIUM' },
  ]

  return (
    <div>
      <PageHeader
        title="Availability & Supply Gap Analytics"
        description="Track product availability gaps, retail stockout risks, and territory fulfillment alerts."
        breadcrumbs={[{ label: 'Demand' }, { label: 'Availability' }]}
      />
      <div className="card border-l-4 border-l-[var(--color-accent-amber)]">
        <SectionHeader title="Territory Availability & Stockout Warnings" subtitle="Real-time product supply gap alerts" />
        <DataTable
          columns={[
            { key: 'territory', header: 'Territory', accessor: (s) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{s.territory}</span> },
            { key: 'brand', header: 'Brand Name', accessor: (s) => <span className="text-xs">{s.brand}</span> },
            { key: 'status', header: 'Inventory Status', accessor: (s) => <span className="text-xs text-[var(--color-text-muted)]">{s.stockStatus}</span> },
            { key: 'risk', header: 'Risk Level', accessor: (s) => <span className={`badge ${s.risk === 'CRITICAL' ? 'badge-rose' : s.risk === 'HIGH' ? 'badge-amber' : 'badge-blue'}`}>{s.risk}</span>, align: 'center' },
          ]}
          data={stockouts}
          keyExtractor={(s) => `${s.territory}-${s.brand}`}
          pageSize={10}
        />
      </div>
    </div>
  )
}
