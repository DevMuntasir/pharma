// ─────────────────────────────────────────────────────────
// FEATURE: Product & Lifecycle Intelligence
// Brand Scorecard, Molecule Breakdown, Product Lifecycle Matrix
// ─────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { FilterBar } from '@/components/filters/FilterBar'
import { KpiCard } from '@/components/cards/KpiCard'
import { DataTable, type ColumnDef } from '@/components/tables/DataTable'
import { brands, molecules, companies, therapeuticClasses, prescriptionItems } from '@/data'
import { getBrandShare, getMoleculeShare } from '@/analytics'

export function BrandIntelligencePage() {
  const brandNameMap = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [])
  const companyMap = useMemo(() => new Map(companies.map((c) => [c.id, c.name])), [])

  const brandShares = useMemo(() => getBrandShare(prescriptionItems, brandNameMap), [brandNameMap])

  const brandTableData = useMemo(() => {
    return brands.map((b) => {
      const shareObj = brandShares.find((s) => s.entityId === b.id)
      return {
        ...b,
        companyName: companyMap.get(b.companyId) ?? b.companyId,
        rxCount: shareObj?.value ?? 0,
        sharePct: shareObj?.share ?? 0,
      }
    }).sort((a, b) => b.rxCount - a.rxCount)
  }, [brandShares, companyMap])

  const columns: ColumnDef<typeof brandTableData[0]>[] = [
    { key: 'name', header: 'Brand Name', accessor: (b) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{b.name}</span>, sortAccessor: (b) => b.name },
    { key: 'company', header: 'Company', accessor: (b) => <span className="text-xs text-[var(--color-text-muted)]">{b.companyName}</span> },
    { key: 'form', header: 'Form / Dosage', accessor: (b) => <span className="text-xs">{b.form} ({b.strength})</span> },
    { key: 'price', header: 'Unit Price', accessor: (b) => <span className="font-data text-xs">৳{b.unitPrice.toFixed(2)}</span>, sortAccessor: (b) => b.unitPrice, align: 'right' },
    { key: 'rx', header: 'Rx Volume', accessor: (b) => <span className="font-data text-xs">{b.rxCount.toLocaleString()}</span>, sortAccessor: (b) => b.rxCount, align: 'right' },
    { key: 'share', header: 'Share %', accessor: (b) => <span className="badge badge-blue font-data">{b.sharePct}%</span>, sortAccessor: (b) => b.sharePct, align: 'right' },
  ]

  return (
    <div>
      <PageHeader
        title="Brand Intelligence"
        description="Comprehensive brand scorecards, pricing analysis, and company brand portfolio breakdown."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Brand Intelligence' }]}
      />
      <FilterBar />

      <div className="kpi-grid mb-6">
        <KpiCard title="Total Brands" value={brands.length} subtitle="Tracked commercial brands" accent="blue" />
        <KpiCard title="Active Companies" value={companies.length} subtitle="Pharmaceutical manufacturers" accent="cyan" />
        <KpiCard title="Avg Unit Price" value={`৳${(brands.reduce((sum, b) => sum + b.unitPrice, 0) / brands.length).toFixed(1)}`} subtitle="Per tablet/dosage unit" accent="emerald" />
        <KpiCard title="Leading Brand Volume" value={`${brandShares[0]?.value ?? 0} Rx`} subtitle={brandShares[0]?.entityName ?? 'N/A'} accent="amber" />
      </div>

      <div className="card">
        <SectionHeader title="Brand Performance Matrix" subtitle="Complete performance metrics across 55 tracked brands" />
        <DataTable columns={columns} data={brandTableData} keyExtractor={(b) => b.id} pageSize={12} />
      </div>
    </div>
  )
}

// ── Molecule Intelligence Page ─────────────────────────────

export function MoleculeIntelligencePage() {
  const molNameMap = useMemo(() => new Map(molecules.map((m) => [m.id, m.name])), [])
  const tcMap = useMemo(() => new Map(therapeuticClasses.map((t) => [t.id, t.name])), [])

  const shares = useMemo(() => getMoleculeShare(prescriptionItems, molNameMap), [molNameMap])

  const tableData = useMemo(() => {
    return molecules.map((m) => {
      const shareObj = shares.find((s) => s.entityId === m.id)
      const brandCount = brands.filter((b) => b.moleculeId === m.id).length
      return {
        ...m,
        tcName: tcMap.get(m.therapeuticClassId) ?? m.therapeuticClassId,
        brandCount,
        rxCount: shareObj?.value ?? 0,
        sharePct: shareObj?.share ?? 0,
      }
    }).sort((a, b) => b.rxCount - a.rxCount)
  }, [shares, tcMap])

  return (
    <div>
      <PageHeader
        title="Molecule Intelligence"
        description="Active generic pharmaceutical ingredient volume, generic competition, and category share."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Molecule Intelligence' }]}
      />
      <div className="card">
        <SectionHeader title="Molecule Leaderboard" subtitle="Prescription volume by generic molecule" />
        <DataTable
          columns={[
            { key: 'name', header: 'Molecule Name', accessor: (m) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{m.name}</span> },
            { key: 'generic', header: 'Generic Name', accessor: (m) => <span className="text-xs text-[var(--color-text-muted)]">{m.genericName}</span> },
            { key: 'tc', header: 'Therapeutic Area', accessor: (m) => <span className="text-xs">{m.tcName}</span> },
            { key: 'brands', header: 'Brands Count', accessor: (m) => <span className="badge badge-cyan">{m.brandCount} brands</span>, align: 'center' },
            { key: 'rx', header: 'Rx Volume', accessor: (m) => <span className="font-data text-xs">{m.rxCount.toLocaleString()}</span>, align: 'right' },
            { key: 'share', header: 'Share %', accessor: (m) => <span className="badge badge-blue font-data">{m.sharePct}%</span>, align: 'right' },
          ]}
          data={tableData}
          keyExtractor={(m) => m.id}
          pageSize={12}
        />
      </div>
    </div>
  )
}

// ── Product Lifecycle Page ─────────────────────────────────

export function ProductLifecyclePage() {
  const lifecycleStages = [
    { stage: 'Launch / Entry', description: 'Newly launched brands (< 12 months)', count: 8, color: 'badge-emerald' },
    { stage: 'Growth Phase', description: 'Rapid prescription volume expansion', count: 18, color: 'badge-blue' },
    { stage: 'Maturity Phase', description: 'Stable market share & volume plateau', count: 22, color: 'badge-cyan' },
    { stage: 'Decline / Transition', description: 'Consecutive volume decline or generic substitution', count: 7, color: 'badge-rose' },
  ]

  return (
    <div>
      <PageHeader
        title="Product Lifecycle Matrix"
        description="Classify brands across launch, growth, maturity, and decline stages to optimize detailing investments."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Product Lifecycle' }]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {lifecycleStages.map((st) => (
          <div key={st.stage} className="card">
            <span className={`badge ${st.color} mb-2`}>{st.stage}</span>
            <p className="font-data text-2xl font-bold text-[var(--color-text-primary)] my-1">{st.count} Brands</p>
            <p className="text-xs text-[var(--color-text-muted)]">{st.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
