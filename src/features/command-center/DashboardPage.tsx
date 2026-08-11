// ─────────────────────────────────────────────────────────
// FEATURE: Executive Overview / Command Center
// High-level enterprise analytics dashboard
// ─────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { KpiCard } from '@/components/cards/KpiCard'
import { FilterBar } from '@/components/filters/FilterBar'
import {
  LineChart,
  DonutChart,
  HorizontalBarChart,
  ChartCard,
} from '@/components/charts'
import { DataTable, type ColumnDef } from '@/components/tables/DataTable'
import { useAnalyticsFilters } from '@/store/useAnalyticsFilters'
import {
  prescriptions,
  prescriptionItems,
  brands,
  molecules,
  doctors,
} from '@/data'
import {
  getTotalPrescriptions,
  getPrescriptionGrowth,
  getBrandShare,
  getMoleculeShare,
  getNewPrescriptionRate,
  getSwitchPrescriptionRate,
  getPrescriptionTimeSeries,
  getBrandDeclineSignals,
  filterByDateRange,
  demoOpportunities,
} from '@/analytics'
import { formatCurrency, formatPercent } from '@/utils'

export function DashboardPage() {
  const filters = useAnalyticsFilters()

  // ── Lookup maps ──────────────────────────────────────────
  const brandNameMap = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [])
  const moleculeNameMap = useMemo(() => new Map(molecules.map((m) => [m.id, m.name])), [])

  // ── Filtered data ────────────────────────────────────────
  const filteredRx = useMemo(() => {
    let list = prescriptions
    if (filters.dateRange) {
      list = filterByDateRange(list, filters.dateRange.startDate, filters.dateRange.endDate)
    }
    if (filters.territory) {
      list = list.filter((r) => r.territoryId === filters.territory)
    }
    if (filters.district) {
      list = list.filter((r) => r.districtId === filters.district)
    }
    if (filters.doctor) {
      list = list.filter((r) => r.doctorId === filters.doctor)
    }
    return list
  }, [filters])

  const filteredItems = useMemo(() => {
    const rxIds = new Set(filteredRx.map((r) => r.id))
    return prescriptionItems.filter((item) => rxIds.has(item.prescriptionId))
  }, [filteredRx])

  // ── Metrics ──────────────────────────────────────────────
  const totalRx = getTotalPrescriptions(filteredRx)
  const rxGrowth = getPrescriptionGrowth(prescriptions, 2024, 12, 2023, 12)
  const brandShares = getBrandShare(filteredItems, brandNameMap)
  const moleculeShares = getMoleculeShare(filteredItems, moleculeNameMap)

  const newRate = getNewPrescriptionRate(filteredRx)
  const switchRate = getSwitchPrescriptionRate(filteredRx)

  const timeSeries = useMemo(() => getPrescriptionTimeSeries(filteredRx), [filteredRx])

  const timeSeriesData = useMemo(() => {
    return timeSeries.map((pt) => ({
      label: pt.label,
      Prescriptions: pt.value,
    }))
  }, [timeSeries])

  const brandDonutData = useMemo(() => {
    return brandShares.slice(0, 5).map((b) => ({
      label: b.entityName,
      value: b.value,
    }))
  }, [brandShares])

  const moleculeBarData = useMemo(() => {
    return moleculeShares.slice(0, 6).map((m) => ({
      label: m.entityName,
      value: m.value,
    }))
  }, [moleculeShares])

  const declineSignals = useMemo(() => {
    return getBrandDeclineSignals(filteredItems, brandNameMap)
  }, [filteredItems, brandNameMap])

  // ── Table definitions ────────────────────────────────────
  const brandColumns: ColumnDef<typeof brandShares[0]>[] = [
    { key: 'rank', header: 'Rank', accessor: (row) => <span className="font-data text-xs">#{row.rank}</span>, width: '60px' },
    { key: 'name', header: 'Brand Name', accessor: (row) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{row.entityName}</span>, sortAccessor: (row) => row.entityName },
    { key: 'value', header: 'Rx Volume', accessor: (row) => <span className="font-data text-xs">{row.value.toLocaleString()}</span>, sortAccessor: (row) => row.value, align: 'right' },
    { key: 'share', header: 'Market Share', accessor: (row) => <span className="badge badge-blue font-data">{formatPercent(row.share)}</span>, sortAccessor: (row) => row.share, align: 'right' },
  ]

  return (
    <div>
      <PageHeader
        title="Executive Overview"
        description="High-level KPIs, market dynamics, and risk signals across the Bangladesh pharmaceutical analytics platform."
        badge="Live Demo Data"
        breadcrumbs={[{ label: 'Command Center' }, { label: 'Executive Overview' }]}
        actions={
          <Link to="/ai" className="btn btn-primary btn-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Pharma Copilot</span>
          </Link>
        }
      />

      <FilterBar />

      {/* KPI Grid */}
      <div className="kpi-grid mb-6">
        <KpiCard
          title="Total Prescriptions"
          value={totalRx}
          change={rxGrowth.growth}
          changeLabel="vs 2023"
          subtitle="Filtered Rx records"
          accent="blue"
        />
        <KpiCard
          title="Active Prescribers"
          value={doctors.length}
          unit="Doctors"
          change={4.2}
          subtitle="Targeted prescribers"
          accent="cyan"
        />
        <KpiCard
          title="Top Brand Share"
          value={brandShares[0] ? formatPercent(brandShares[0].share) : '0%'}
          subtitle={brandShares[0]?.entityName ?? 'N/A'}
          change={1.8}
          accent="emerald"
        />
        <KpiCard
          title="New Prescription Rate"
          value={formatPercent(newRate)}
          subtitle="First-time therapies"
          change={-0.5}
          accent="violet"
        />
        <KpiCard
          title="Brand Switch Rate"
          value={formatPercent(switchRate)}
          subtitle="Patient conversions"
          change={2.1}
          accent="amber"
        />
      </div>

      {/* Main Charts Row */}
      <div className="chart-grid mb-6">
        <ChartCard
          title="Prescription Volume Trend"
          subtitle="Monthly prescription volume history (2023–2024)"
          height={280}
        >
          <LineChart
            data={timeSeriesData}
            lines={[{ key: 'Prescriptions', label: 'Prescriptions', color: '#3b82f6' }]}
            height={260}
          />
        </ChartCard>

        <ChartCard
          title="Top 5 Brand Share Breakdown"
          subtitle="Prescription distribution by leading brand"
          height={280}
        >
          <DonutChart
            data={brandDonutData}
            height={260}
            centerValue={`${brandShares.length}`}
            centerLabel="Total Brands"
          />
        </ChartCard>
      </div>

      {/* Second Charts & Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Molecule Share Chart */}
        <ChartCard
          title="Molecule Volume Leaderboard"
          subtitle="Top generic active ingredients prescribed"
          height={320}
          className="lg:col-span-1"
        >
          <HorizontalBarChart data={moleculeBarData} height={300} />
        </ChartCard>

        {/* Top Brands Table */}
        <div className="card lg:col-span-2">
          <SectionHeader
            title="Brand Market Share Matrix"
            subtitle="Leading brand performance and prescription volume"
            actions={
              <Link to="/products/brands" className="text-xs text-[var(--color-accent-primary)] hover:underline flex items-center gap-1">
                <span>View all brands</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <DataTable
            columns={brandColumns}
            data={brandShares.slice(0, 7)}
            keyExtractor={(r) => r.entityId}
            pageSize={7}
          />
        </div>
      </div>

      {/* Risk & Opportunity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decline Signals / Risk */}
        <div className="card border-l-4 border-l-[var(--color-accent-rose)]">
          <SectionHeader
            title="Early Warning Signals"
            subtitle="Brands exhibiting consecutive monthly volume decline"
            actions={<ShieldAlert className="w-4 h-4 text-[var(--color-text-danger)]" />}
          />
          {declineSignals.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)] py-4">No critical brand decline signals detected in current filter scope.</p>
          ) : (
            <div className="space-y-2.5">
              {declineSignals.slice(0, 3).map((sig) => (
                <div key={sig.brandId} className="flex items-center justify-between p-2.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">{sig.brandName}</p>
                    <p className="text-2xs text-[var(--color-text-muted)]">2 consecutive months of decline</p>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-rose font-data">{sig.declineRate}%</span>
                    <p className="text-2xs text-[var(--color-text-danger)] mt-0.5 uppercase font-bold">{sig.severity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Growth Opportunities */}
        <div className="card border-l-4 border-l-[var(--color-accent-emerald)]">
          <SectionHeader
            title="Featured Growth Opportunities"
            subtitle="Highest estimated revenue potential opportunities"
            actions={
              <Link to="/opportunities" className="text-xs text-[var(--color-accent-emerald)] hover:underline flex items-center gap-1">
                <span>View feed</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <div className="space-y-2.5">
            {demoOpportunities.slice(0, 2).map((opp) => (
              <div key={opp.id} className="p-2.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">{opp.title}</span>
                  <span className="badge badge-emerald font-data">+{formatCurrency(opp.potentialRevenue)}</span>
                </div>
                <p className="text-2xs text-[var(--color-text-muted)]">{opp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
