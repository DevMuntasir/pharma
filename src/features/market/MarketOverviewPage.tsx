// ─────────────────────────────────────────────────────────
// FEATURE: Market Overview & Analytics
// Segmented market performance, category leaderboards, Explorer
// ─────────────────────────────────────────────────────────

import { useMemo, useState } from 'react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { FilterBar } from '@/components/filters/FilterBar'
import { KpiCard } from '@/components/cards/KpiCard'
import { LineChart, BarChart, DonutChart, ChartCard } from '@/components/charts'
import { DataTable, type ColumnDef } from '@/components/tables/DataTable'
import { prescriptionItems, brands, molecules, therapeuticClasses, companies } from '@/data'
import { getBrandShare } from '@/analytics'
import { formatPercent } from '@/utils'

export function MarketOverviewPage() {
  const brandNameMap = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [])
  const companyNameMap = useMemo(() => new Map(companies.map((c) => [c.id, c.name])), [])

  const brandShares = useMemo(() => getBrandShare(prescriptionItems, brandNameMap), [brandNameMap])

  // Company shares
  const companyShares = useMemo(() => {
    const brandCompanyMap = new Map(brands.map((b) => [b.id, b.companyId]))
    const companyCounts = new Map<string, number>()
    let total = 0

    prescriptionItems.forEach((item) => {
      const companyId = brandCompanyMap.get(item.brandId)
      if (companyId) {
        companyCounts.set(companyId, (companyCounts.get(companyId) ?? 0) + 1)
        total++
      }
    })

    return Array.from(companyCounts.entries())
      .map(([companyId, count]) => ({
        companyId,
        companyName: companyNameMap.get(companyId) ?? companyId,
        count,
        share: total === 0 ? 0 : Math.round((count / total) * 1000) / 10,
      }))
      .sort((a, b) => b.count - a.count)
  }, [companyNameMap])

  const companyDonutData = useMemo(() => {
    return companyShares.map((c) => ({
      label: c.companyName,
      value: c.count,
    }))
  }, [companyShares])

  const tcBarData = useMemo(() => {
    const tcMap = new Map(therapeuticClasses.map((t) => [t.id, t.name]))
    const tcCounts = new Map<string, number>()
    prescriptionItems.forEach((item) => {
      const brand = brands.find((b) => b.id === item.brandId)
      if (brand) {
        tcCounts.set(brand.therapeuticClassId, (tcCounts.get(brand.therapeuticClassId) ?? 0) + 1)
      }
    })
    return Array.from(tcCounts.entries())
      .map(([tcId, count]) => ({
        label: tcMap.get(tcId) ?? tcId,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [])

  const brandColumns: ColumnDef<typeof brandShares[0]>[] = [
    { key: 'rank', header: 'Rank', accessor: (r) => <span className="font-data text-xs">#{r.rank}</span>, width: '60px' },
    { key: 'name', header: 'Brand Name', accessor: (r) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{r.entityName}</span>, sortAccessor: (r) => r.entityName },
    { key: 'value', header: 'Prescription Count', accessor: (r) => <span className="font-data text-xs">{r.value.toLocaleString()}</span>, sortAccessor: (r) => r.value, align: 'right' },
    { key: 'share', header: 'Market Share', accessor: (r) => <span className="badge badge-blue font-data">{formatPercent(r.share)}</span>, sortAccessor: (r) => r.share, align: 'right' },
  ]

  return (
    <div>
      <PageHeader
        title="Market Overview"
        description="Comprehensive pharmaceutical market concentration, company shares, and therapeutic segment leaderboards."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Market Overview' }]}
      />

      <FilterBar />

      {/* KPI Cards */}
      <div className="kpi-grid mb-6">
        <KpiCard title="Total Market Brands" value={brands.length} subtitle="Tracked active brands" accent="blue" />
        <KpiCard title="Tracked Molecules" value={molecules.length} subtitle="Active generic ingredients" accent="cyan" />
        <KpiCard title="Therapeutic Classes" value={therapeuticClasses.length} subtitle="Specialty categories" accent="emerald" />
        <KpiCard title="Leading Company" value={companyShares[0]?.companyName ?? 'N/A'} subtitle={`${companyShares[0]?.share}% Market Share`} accent="amber" />
      </div>

      {/* Charts */}
      <div className="chart-grid mb-6">
        <ChartCard title="Company Market Share" subtitle="Rx share by pharmaceutical manufacturer" height={280}>
          <DonutChart data={companyDonutData} height={260} centerLabel="Companies" centerValue={`${companyShares.length}`} />
        </ChartCard>

        <ChartCard title="Top Therapeutic Categories" subtitle="Prescription volume by therapeutic area" height={280}>
          <BarChart data={tcBarData} bars={[{ key: 'value', label: 'Prescriptions', color: '#06b6d4' }]} height={260} />
        </ChartCard>
      </div>

      {/* Market Leaderboard Table */}
      <div className="card">
        <SectionHeader title="Brand Market Concentration" subtitle="Ranked prescription market share across all companies" />
        <DataTable columns={brandColumns} data={brandShares} keyExtractor={(r) => r.entityId} pageSize={10} />
      </div>
    </div>
  )
}

// ── Market Explorer Page ───────────────────────────────────

export function MarketExplorerPage() {
  const [selectedTc, setSelectedTc] = useState<string>('ALL')

  const filteredBrands = useMemo(() => {
    if (selectedTc === 'ALL') return brands
    return brands.filter((b) => b.therapeuticClassId === selectedTc)
  }, [selectedTc])

  const explorerColumns: ColumnDef<typeof brands[0]>[] = [
    { key: 'name', header: 'Brand Name', accessor: (b) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{b.name}</span>, sortAccessor: (b) => b.name },
    { key: 'form', header: 'Form & Strength', accessor: (b) => <span className="text-xs text-[var(--color-text-muted)]">{b.form} ({b.strength})</span> },
    { key: 'price', header: 'Unit Price', accessor: (b) => <span className="font-data text-xs">৳{b.unitPrice.toFixed(2)}</span>, sortAccessor: (b) => b.unitPrice, align: 'right' },
    { key: 'status', header: 'Status', accessor: () => <span className="badge badge-emerald">ACTIVE</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Market Explorer"
        description="Interactive segment explorer for pharmaceutical brands, dosages, and therapeutic categories."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Market Explorer' }]}
      />

      <div className="flex items-center gap-3 mb-6">
        <label className="text-xs text-[var(--color-text-muted)] font-medium">Therapeutic Category:</label>
        <select
          className="input max-w-xs text-xs"
          value={selectedTc}
          onChange={(e) => setSelectedTc(e.target.value)}
        >
          <option value="ALL">All Categories ({brands.length} brands)</option>
          {therapeuticClasses.map((tc) => (
            <option key={tc.id} value={tc.id}>{tc.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <SectionHeader title="Segment Brand Directory" subtitle={`Showing ${filteredBrands.length} brands`} />
        <DataTable columns={explorerColumns} data={filteredBrands} keyExtractor={(b) => b.id} pageSize={12} />
      </div>
    </div>
  )
}

// ── Market Share Page ──────────────────────────────────────

export function MarketSharePage() {
  const brandNameMap = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [])
  const shares = useMemo(() => getBrandShare(prescriptionItems, brandNameMap), [brandNameMap])

  return (
    <div>
      <PageHeader
        title="Market Share Matrix"
        description="Detailed brand market share rankings, volume distribution, and competitive rank changes."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Market Share' }]}
      />
      <div className="card">
        <SectionHeader title="Brand Market Share Matrix" subtitle="Complete ranking across all brands" />
        <DataTable
          columns={[
            { key: 'rank', header: 'Rank', accessor: (r) => <span className="font-data text-xs font-bold">#{r.rank}</span>, width: '60px' },
            { key: 'name', header: 'Brand Name', accessor: (r) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{r.entityName}</span> },
            { key: 'value', header: 'Prescription Count', accessor: (r) => <span className="font-data text-xs">{r.value.toLocaleString()}</span>, align: 'right' },
            { key: 'share', header: 'Market Share %', accessor: (r) => <span className="badge badge-blue font-data">{r.share}%</span>, align: 'right' },
          ]}
          data={shares}
          keyExtractor={(r) => r.entityId}
          pageSize={15}
        />
      </div>
    </div>
  )
}

// ── Market Trends Page ─────────────────────────────────────

export function MarketTrendsPage() {
  const trendData = [
    { label: 'Jan 2024', NovaCor: 42, Axilosartan: 35, ZenPan: 28 },
    { label: 'Feb 2024', NovaCor: 45, Axilosartan: 38, ZenPan: 30 },
    { label: 'Mar 2024', NovaCor: 48, Axilosartan: 36, ZenPan: 33 },
    { label: 'Apr 2024', NovaCor: 52, Axilosartan: 40, ZenPan: 35 },
    { label: 'May 2024', NovaCor: 50, Axilosartan: 42, ZenPan: 38 },
    { label: 'Jun 2024', NovaCor: 55, Axilosartan: 44, ZenPan: 40 },
  ]

  return (
    <div>
      <PageHeader
        title="Market Trends"
        description="Historical prescription growth trends and momentum comparisons across leading brands."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Market Trends' }]}
      />
      <ChartCard title="Multi-Brand Trend Trajectory" subtitle="6-month prescription growth velocity" height={320}>
        <LineChart
          data={trendData}
          lines={[
            { key: 'NovaCor', label: 'NovaCor (NovaCare)', color: '#3b82f6' },
            { key: 'Axilosartan', label: 'Axilosartan (MedAxis)', color: '#06b6d4' },
            { key: 'ZenPan', label: 'ZenPan (Zenith)', color: '#10b981' },
          ]}
          height={300}
        />
      </ChartCard>
    </div>
  )
}
