// ─────────────────────────────────────────────────────────
// FEATURE: Geographic & White Space Analytics
// Bangladesh market territory breakdown, White Space Finder,
// with interactive react-leaflet bubble map visualization.
// ─────────────────────────────────────────────────────────

import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { FilterBar } from '@/components/filters/FilterBar'
import { KpiCard } from '@/components/cards/KpiCard'
import { HorizontalBarChart, ChartCard } from '@/components/charts'
import { DataTable, type ColumnDef } from '@/components/tables/DataTable'
import { BangladeshMap, type TerritoryMapData } from '@/components/maps'
import { territories, districts, prescriptions, doctors } from '@/data'
import { getTerritoryShare, detectWhiteSpace } from '@/analytics'

// ── Territories Overview Page ────────────────────────────

export function TerritoriesPage() {
  const navigate = useNavigate()
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | undefined>(undefined)

  const terNameMap = useMemo(() => new Map(territories.map((t) => [t.id, t.name])), [])
  const terShares = useMemo(() => getTerritoryShare(prescriptions, terNameMap), [terNameMap])

  const chartData = useMemo(() => {
    return terShares.slice(0, 8).map((t) => ({
      label: t.entityName,
      value: t.value,
    }))
  }, [terShares])

  const tableData = useMemo(() => {
    return territories.map((t) => {
      const shareObj = terShares.find((s) => s.entityId === t.id)
      const docCount = doctors.filter((d) => d.territoryId === t.id).length
      return {
        ...t,
        rxCount: shareObj?.value ?? 0,
        sharePct: shareObj?.share ?? 0,
        docCount,
      }
    }).sort((a, b) => b.rxCount - a.rxCount)
  }, [terShares])

  // Build map data
  const mapData: TerritoryMapData[] = useMemo(() => {
    return tableData.map((t) => ({
      id: t.id,
      name: t.name,
      division: t.division,
      rxCount: t.rxCount,
      sharePct: t.sharePct,
      docCount: t.docCount,
    }))
  }, [tableData])

  const handleMapSelect = (id: string) => {
    setSelectedTerritoryId((prev) => (prev === id ? undefined : id))
  }

  const handleViewDetail = () => {
    if (selectedTerritoryId) navigate(`/territories/${selectedTerritoryId}`)
  }

  const columns: ColumnDef<typeof tableData[0]>[] = [
    {
      key: 'name',
      header: 'Territory Name',
      accessor: (t) => (
        <button
          onClick={() => setSelectedTerritoryId(t.id)}
          className="font-semibold text-xs text-[var(--color-accent-primary)] hover:underline text-left"
        >
          {t.name}
        </button>
      ),
      sortAccessor: (t) => t.name,
    },
    { key: 'division', header: 'Division', accessor: (t) => <span className="text-xs text-[var(--color-text-muted)]">{t.division}</span> },
    { key: 'districts', header: 'Districts', accessor: (t) => <span className="text-xs">{t.districts.length} districts</span>, align: 'center' },
    { key: 'doctors', header: 'Prescribers', accessor: (t) => <span className="badge badge-cyan">{t.docCount} doctors</span>, align: 'center' },
    { key: 'rx', header: 'Rx Volume', accessor: (t) => <span className="font-data text-xs">{t.rxCount.toLocaleString()}</span>, sortAccessor: (t) => t.rxCount, align: 'right' },
    { key: 'share', header: 'Market Share %', accessor: (t) => <span className="badge badge-blue font-data">{t.sharePct}%</span>, sortAccessor: (t) => t.sharePct, align: 'right' },
    {
      key: 'action',
      header: '',
      accessor: (t) => (
        <Link
          to={`/territories/${t.id}`}
          className="text-xs text-[var(--color-accent-primary)] hover:underline"
        >
          View →
        </Link>
      ),
      align: 'right',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Bangladesh Market Geography"
        description="Territory-level prescription volume, prescriber density, and regional market share across 8 divisions."
        breadcrumbs={[{ label: 'Geography' }, { label: 'Bangladesh Market' }]}
      />
      <FilterBar />

      <div className="kpi-grid mb-6">
        <KpiCard title="Total Territories" value={territories.length} subtitle="Field sales territories" accent="blue" />
        <KpiCard title="Total Districts" value={districts.length} subtitle="Administrative districts" accent="cyan" />
        <KpiCard title="Top Region" value={terShares[0]?.entityName ?? 'N/A'} subtitle={`${terShares[0]?.share}% National Share`} accent="emerald" />
        <KpiCard title="Divisions Covered" value={8} subtitle="Full Bangladesh coverage" accent="violet" />
      </div>

      {/* Interactive Map */}
      <div className="card mb-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <SectionHeader
              title="Territory Map — Bangladesh"
              subtitle={selectedTerritoryId
                ? `Selected: ${territories.find((t) => t.id === selectedTerritoryId)?.name ?? ''} — click again to deselect`
                : 'Click a bubble to select a territory • Size = Rx Volume • Color = Market Share'}
            />
          </div>
          {selectedTerritoryId && (
            <button
              onClick={handleViewDetail}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 0.875rem',
                background: 'var(--color-accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
              }}
              id="view-territory-detail-btn"
            >
              <MapPin style={{ width: '12px', height: '12px' }} />
              View Territory Detail
            </button>
          )}
        </div>
        <BangladeshMap
          data={mapData}
          selectedId={selectedTerritoryId}
          onSelect={handleMapSelect}
          height={440}
          mode="bubble"
        />
      </div>

      <ChartCard title="Top Territory Rx Leaderboard" subtitle="Prescription volume by sales territory" height={300} className="mb-6">
        <HorizontalBarChart data={chartData} height={280} />
      </ChartCard>

      <div className="card">
        <SectionHeader title="Territory Performance Directory" subtitle="All 22 tracked field sales territories" />
        <DataTable columns={columns} data={tableData} keyExtractor={(t) => t.id} pageSize={10} />
      </div>
    </div>
  )
}

// ── Territory Detail Page ────────────────────────────────

export function TerritoryDetailPage() {
  const { territoryId } = useParams<{ territoryId: string }>()
  const territory = territories.find((t) => t.id === territoryId) ?? territories[0]

  const terRx = prescriptions.filter((r) => r.territoryId === territory.id)
  const terDocs = doctors.filter((d) => d.territoryId === territory.id)
  const terDistricts = districts.filter((d) => d.territoryId === territory.id)

  // Single-territory map data
  const mapData: TerritoryMapData[] = [{
    id: territory.id,
    name: territory.name,
    division: territory.division,
    rxCount: terRx.length,
    sharePct: Math.round((terRx.length / prescriptions.length) * 100 * 10) / 10,
    docCount: terDocs.length,
  }]

  return (
    <div>
      <div className="mb-4">
        <Link to="/territories" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Territories</span>
        </Link>
      </div>

      <PageHeader title={territory.name} description={`${territory.division} Division • ${territory.districts.length} Districts`} />

      <div className="kpi-grid mb-6">
        <KpiCard title="Prescription Volume" value={terRx.length} subtitle="Recorded prescriptions" accent="blue" />
        <KpiCard title="Active Doctors" value={terDocs.length} subtitle="Territory prescribers" accent="cyan" />
        <KpiCard title="Districts Covered" value={terDistricts.length} subtitle="Administrative districts" accent="emerald" />
        <KpiCard title="Division" value={territory.division} subtitle="Administrative division" accent="violet" />
      </div>

      {/* Territory Map */}
      <div className="card mb-6">
        <SectionHeader
          title="Territory Location — Bangladesh"
          subtitle={`${territory.name} highlighted on the Bangladesh map`}
        />
        <BangladeshMap
          data={mapData}
          selectedId={territory.id}
          height={380}
          mode="bubble"
        />
      </div>

      <div className="card">
        <SectionHeader title="Territory Doctors" subtitle="Doctors practicing in this territory" />
        <DataTable
          columns={[
            { key: 'name', header: 'Doctor Name', accessor: (d) => <span className="font-semibold text-xs text-[var(--color-accent-primary)]">{d.name}</span> },
            { key: 'degree', header: 'Degree', accessor: (d) => <span className="text-xs text-[var(--color-text-muted)]">{d.degree}</span> },
            { key: 'tier', header: 'Tier', accessor: (d) => <span className="badge badge-blue">Tier {d.tier}</span> },
            { key: 'rx', header: 'Rx Volume', accessor: (d) => <span className="font-data text-xs">{d.prescriptionCount} Rx</span>, align: 'right' },
          ]}
          data={terDocs}
          keyExtractor={(d) => d.id}
          pageSize={10}
        />
      </div>
    </div>
  )
}

// ── White Space Analysis Page ────────────────────────────

export function WhiteSpacePage() {
  const terNameMap = useMemo(() => new Map(territories.map((t) => [t.id, t.name])), [])
  const terShares = useMemo(() => getTerritoryShare(prescriptions, terNameMap), [terNameMap])

  const whiteSpaces = useMemo(() => {
    return territories.slice(0, 6).map((t) => {
      const terDocs = doctors.filter((d) => d.territoryId === t.id)
      const activeDocs = terDocs.filter((d) => d.prescriptionCount > 150)
      return detectWhiteSpace(t.id, t.name, terDocs.length, activeDocs.length, 'Cardiovascular & Diabetes')
    })
  }, [])

  // White-space map data (all territories)
  const mapData: TerritoryMapData[] = useMemo(() => {
    return territories.map((t) => {
      const shareObj = terShares.find((s) => s.entityId === t.id)
      const docCount = doctors.filter((d) => d.territoryId === t.id).length
      return {
        id: t.id,
        name: t.name,
        division: t.division,
        rxCount: shareObj?.value ?? 0,
        sharePct: shareObj?.share ?? 0,
        docCount,
      }
    })
  }, [terShares])

  return (
    <div>
      <PageHeader
        title="White Space Analysis"
        description="Identify unserved and underserved territories with high doctor density but low brand penetration."
        breadcrumbs={[{ label: 'Geography' }, { label: 'White Space' }]}
      />

      {/* White Space Map */}
      <div className="card mb-6">
        <SectionHeader
          title="Coverage Heatmap — Bangladesh"
          subtitle="Red = high white space opportunity • Green = well covered territories"
        />
        <BangladeshMap
          data={mapData}
          height={420}
          mode="whitespace"
        />
      </div>

      <div className="card">
        <SectionHeader title="High-Potential Territory Opportunities" subtitle="Territories with significant prescriber coverage gaps" />
        <DataTable
          columns={[
            { key: 'name', header: 'Territory Name', accessor: (w) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{w.territoryName}</span> },
            { key: 'specialty', header: 'Target Specialty', accessor: (w) => <span className="text-xs text-[var(--color-text-muted)]">{w.targetSpecialty}</span> },
            { key: 'coverage', header: 'Current Coverage', accessor: (w) => <span className="badge badge-amber font-data">{w.currentCoverage}%</span>, align: 'center' },
            { key: 'gap', header: 'Coverage Gap Score', accessor: (w) => <span className="badge badge-rose font-data">{w.gapScore}</span>, align: 'center' },
            { key: 'potential', header: 'Estimated Rx Potential', accessor: (w) => <span className="font-data text-xs text-[var(--color-text-success)] font-bold">+{w.estimatedPrescriptionPotential} Rx/mo</span>, align: 'right' },
          ]}
          data={whiteSpaces}
          keyExtractor={(w) => w.territoryId}
          pageSize={10}
        />
      </div>
    </div>
  )
}
