// ─────────────────────────────────────────────────────────
// FEATURE: Competitive Intelligence & Brand Switching
// Competitor scorecards, Share Movement, Brand Switching matrix
// ─────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { FilterBar } from '@/components/filters/FilterBar'
import { KpiCard } from '@/components/cards/KpiCard'
import { DataTable } from '@/components/tables/DataTable'
import { companies, brands, prescriptionItems } from '@/data'
import { getMarketShareMovement } from '@/analytics'

export function CompetitionPage() {
  const compData = [
    { company: 'NovaCare Pharma', type: 'Local Leader', brands: 7, share: '24.5%', trend: '+1.2%' },
    { company: 'MedAxis', type: 'Local Specialist', brands: 8, share: '21.0%', trend: '+0.8%' },
    { company: 'Zenith Therapeutics', type: 'Local Generic', brands: 8, share: '18.2%', trend: '-0.5%' },
    { company: 'ApexBio', type: 'Biotech', brands: 7, share: '14.1%', trend: '+1.5%' },
    { company: 'Orion Therapeutics', type: 'Multinational', brands: 6, share: '11.8%', trend: '-1.1%' },
  ]

  return (
    <div>
      <PageHeader
        title="Competitor Intelligence"
        description="Monitor competitor company shares, brand portfolios, and market expansion dynamics."
        breadcrumbs={[{ label: 'Competition' }, { label: 'Competitor Intelligence' }]}
      />
      <FilterBar />

      <div className="kpi-grid mb-6">
        <KpiCard title="Tracked Competitors" value={companies.length} subtitle="Key market players" accent="blue" />
        <KpiCard title="Market Concentration" value="Top 3 = 63.7%" subtitle="Moderate concentration" accent="cyan" />
        <KpiCard title="Fastest Gainer" value="ApexBio (+1.5%)" subtitle="Recent quarter gain" accent="emerald" />
      </div>

      <div className="card">
        <SectionHeader title="Competitor Scoreboard" subtitle="Market share & portfolio tracking across leading pharma companies" />
        <DataTable
          columns={[
            { key: 'company', header: 'Company Name', accessor: (c) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{c.company}</span> },
            { key: 'type', header: 'Category', accessor: (c) => <span className="text-xs text-[var(--color-text-muted)]">{c.type}</span> },
            { key: 'brands', header: 'Tracked Brands', accessor: (c) => <span className="badge badge-cyan">{c.brands} brands</span>, align: 'center' },
            { key: 'share', header: 'Market Share', accessor: (c) => <span className="badge badge-blue font-data">{c.share}</span>, align: 'right' },
            { key: 'trend', header: 'QoQ Growth', accessor: (c) => <span className={`font-data text-xs ${c.trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>{c.trend}</span>, align: 'right' },
          ]}
          data={compData}
          keyExtractor={(c) => c.company}
          pageSize={10}
        />
      </div>
    </div>
  )
}

// ── Competition Share Movement Page ────────────────────────

export function CompetitionSharePage() {
  const brandNameMap = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [])
  const movements = useMemo(() => {
    return getMarketShareMovement(prescriptionItems, brandNameMap, '2024-01-01', '2024-12-31', '2023-01-01', '2023-12-31')
  }, [brandNameMap])

  return (
    <div>
      <PageHeader
        title="Share Movement Analytics"
        description="Period-over-period market share gainers and losers across all tracked brands."
        breadcrumbs={[{ label: 'Competition' }, { label: 'Share Movement' }]}
      />
      <div className="card">
        <SectionHeader title="Brand Market Share Velocity" subtitle="Comparison of 2024 vs 2023 market share %" />
        <DataTable
          columns={[
            { key: 'name', header: 'Brand Name', accessor: (m) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{m.entityName}</span> },
            { key: 'current', header: '2024 Share', accessor: (m) => <span className="font-data text-xs">{m.currentShare}%</span>, align: 'right' },
            { key: 'previous', header: '2023 Share', accessor: (m) => <span className="font-data text-xs text-[var(--color-text-muted)]">{m.previousShare}%</span>, align: 'right' },
            { key: 'movement', header: 'Share Change', accessor: (m) => (
              <span className={`badge ${m.movement > 0 ? 'badge-emerald' : m.movement < 0 ? 'badge-rose' : 'badge-muted'} font-data`}>
                {m.movement > 0 ? `+${m.movement}` : m.movement}%
              </span>
            ), align: 'right' },
            { key: 'trend', header: 'Trend', accessor: (m) => <span className="text-2xs uppercase font-bold tracking-wide">{m.trend}</span>, align: 'center' },
          ]}
          data={movements.slice(0, 15)}
          keyExtractor={(m) => m.entityId}
          pageSize={10}
        />
      </div>
    </div>
  )
}

// ── Brand Switching Page ───────────────────────────────────

export function BrandSwitchingPage() {
  const switchingFlows = [
    { fromBrand: 'OrionAtor 40', toBrand: 'NovaLip 20', molecule: 'Atorvastatin', convertedRx: 48, reason: 'Local availability & pricing' },
    { fromBrand: 'CuraMet 1000', toBrand: 'NovaMet 850', molecule: 'Metformin', convertedRx: 36, reason: 'Doctor detailing campaign' },
    { fromBrand: 'ZenPan 40', toBrand: 'AxiEso 40', molecule: 'Proton Pump Inhibitors', convertedRx: 29, reason: 'Patient preference' },
    { fromBrand: 'PrimeClona 1', toBrand: 'PrimeClona 0.5', molecule: 'Clonazepam', convertedRx: 22, reason: 'Dosage step-down' },
  ]

  return (
    <div>
      <PageHeader
        title="Brand Switching Analytics"
        description="Track patient conversions and source brand to target brand switching patterns."
        breadcrumbs={[{ label: 'Competition' }, { label: 'Brand Switching' }]}
      />
      <div className="card">
        <SectionHeader title="Recent Brand Switching Migration Flows" subtitle="Prescriptions converted from competitor brands" />
        <DataTable
          columns={[
            { key: 'from', header: 'Source Brand (Lost)', accessor: (s) => <span className="text-xs text-[var(--color-text-danger)] font-medium">{s.fromBrand}</span> },
            { key: 'to', header: 'Target Brand (Gained)', accessor: (s) => <span className="text-xs text-[var(--color-text-success)] font-semibold">{s.toBrand}</span> },
            { key: 'molecule', header: 'Therapeutic Molecule', accessor: (s) => <span className="text-xs text-[var(--color-text-muted)]">{s.molecule}</span> },
            { key: 'converted', header: 'Converted Rx', accessor: (s) => <span className="font-data text-xs">{s.convertedRx} Rx</span>, align: 'right' },
            { key: 'reason', header: 'Primary Driver', accessor: (s) => <span className="text-xs">{s.reason}</span> },
          ]}
          data={switchingFlows}
          keyExtractor={(s) => `${s.fromBrand}-${s.toBrand}`}
          pageSize={10}
        />
      </div>
    </div>
  )
}
