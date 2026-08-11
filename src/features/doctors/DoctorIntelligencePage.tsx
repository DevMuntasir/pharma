// ─────────────────────────────────────────────────────────
// FEATURE: Doctor Intelligence & Profile Detail View
// Prescriber directory, engagement tiers, doctor profile deep dive
// ─────────────────────────────────────────────────────────

import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { FilterBar } from '@/components/filters/FilterBar'
import { KpiCard } from '@/components/cards/KpiCard'
import { DataTable, type ColumnDef } from '@/components/tables/DataTable'
import { LineChart, ChartCard } from '@/components/charts'
import { doctors, specialties, territories, prescriptions } from '@/data'

export function DoctorIntelligencePage() {
  const [selectedTier, setSelectedTier] = useState<string>('ALL')
  const [selectedSpec, setSelectedSpec] = useState<string>('ALL')

  const specMap = useMemo(() => new Map(specialties.map((s) => [s.id, s.name])), [])
  const terMap = useMemo(() => new Map(territories.map((t) => [t.id, t.name])), [])

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      if (selectedTier !== 'ALL' && d.tier !== selectedTier) return false
      if (selectedSpec !== 'ALL' && d.specialtyId !== selectedSpec) return false
      return true
    })
  }, [selectedTier, selectedSpec])

  const doctorColumns: ColumnDef<typeof doctors[0]>[] = [
    {
      key: 'name',
      header: 'Doctor Name',
      accessor: (d) => (
        <Link to={`/doctors/${d.id}`} className="font-semibold text-xs text-[var(--color-accent-primary)] hover:underline">
          {d.name}
        </Link>
      ),
      sortAccessor: (d) => d.name,
    },
    { key: 'degree', header: 'Degree', accessor: (d) => <span className="text-xs text-[var(--color-text-muted)]">{d.degree}</span> },
    { key: 'specialty', header: 'Specialty', accessor: (d) => <span className="text-xs">{specMap.get(d.specialtyId) ?? d.specialtyId}</span> },
    { key: 'territory', header: 'Territory', accessor: (d) => <span className="text-xs text-[var(--color-text-muted)]">{terMap.get(d.territoryId) ?? d.territoryId}</span> },
    {
      key: 'tier',
      header: 'Tier',
      accessor: (d) => (
        <span className={`badge ${d.tier === 'A' ? 'badge-emerald' : d.tier === 'B' ? 'badge-blue' : 'badge-muted'}`}>
          Tier {d.tier}
        </span>
      ),
      sortAccessor: (d) => d.tier,
    },
    { key: 'rxCount', header: 'Rx Volume', accessor: (d) => <span className="font-data text-xs">{d.prescriptionCount} Rx</span>, sortAccessor: (d) => d.prescriptionCount, align: 'right' },
  ]

  return (
    <div>
      <PageHeader
        title="Doctor Intelligence"
        description="Prescriber directory, engagement tiers (A/B/C), specialty breakdowns, and prescribing patterns."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Doctor Intelligence' }]}
      />
      <FilterBar />

      <div className="kpi-grid mb-6">
        <KpiCard title="Total Prescribers" value={doctors.length} subtitle="Targeted doctors" accent="blue" />
        <KpiCard title="Tier A Prescribers" value={doctors.filter((d) => d.tier === 'A').length} subtitle="High-value prescribers" accent="emerald" />
        <KpiCard title="Tier B Prescribers" value={doctors.filter((d) => d.tier === 'B').length} subtitle="Growth prescribers" accent="cyan" />
        <KpiCard title="Specialties Covered" value={specialties.length} subtitle="Medical specialties" accent="violet" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--color-text-muted)] font-medium">Engagement Tier:</label>
          <select className="input max-w-xs text-xs" value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)}>
            <option value="ALL">All Tiers ({doctors.length})</option>
            <option value="A">Tier A (High Value)</option>
            <option value="B">Tier B (Medium Value)</option>
            <option value="C">Tier C (Developing)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--color-text-muted)] font-medium">Specialty:</label>
          <select className="input max-w-xs text-xs" value={selectedSpec} onChange={(e) => setSelectedSpec(e.target.value)}>
            <option value="ALL">All Specialties</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <SectionHeader title="Prescriber Directory" subtitle={`Showing ${filteredDoctors.length} doctors`} />
        <DataTable columns={doctorColumns} data={filteredDoctors} keyExtractor={(d) => d.id} pageSize={12} />
      </div>
    </div>
  )
}

// ── Doctor Detail Page ─────────────────────────────────────

export function DoctorDetailPage() {
  const { doctorId } = useParams<{ doctorId: string }>()
  const doctor = doctors.find((d) => d.id === doctorId || d.doctorId === doctorId) ?? doctors[0]

  const specName = specialties.find((s) => s.id === doctor.specialtyId)?.name ?? doctor.specialtyId
  const terName = territories.find((t) => t.id === doctor.territoryId)?.name ?? doctor.territoryId

  const doctorRx = prescriptions.filter((r) => r.doctorId === doctor.id)

  const chartData = [
    { label: 'Jan 2024', Volume: 18 },
    { label: 'Feb 2024', Volume: 22 },
    { label: 'Mar 2024', Volume: 25 },
    { label: 'Apr 2024', Volume: 21 },
    { label: 'May 2024', Volume: 28 },
    { label: 'Jun 2024', Volume: 30 },
  ]

  return (
    <div>
      <div className="mb-4">
        <Link to="/doctors" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Doctor Intelligence</span>
        </Link>
      </div>

      <PageHeader
        title={doctor.name}
        description={`${doctor.degree} • ${specName} • ${terName}`}
        badge={`Tier ${doctor.tier}`}
      />

      <div className="kpi-grid mb-6">
        <KpiCard title="Total Prescriptions" value={doctor.prescriptionCount} subtitle="Lifetime Rx count" accent="blue" />
        <KpiCard title="Engagement Tier" value={`Tier ${doctor.tier}`} subtitle={doctor.tier === 'A' ? 'High Volume Prescriber' : 'Target Prescriber'} accent="emerald" />
        <KpiCard title="Territory" value={terName} subtitle="Assigned region" accent="cyan" />
        <KpiCard title="Recent Rx Sample" value={doctorRx.length} subtitle="Recorded digitales" accent="violet" />
      </div>

      <ChartCard title="Monthly Prescription Trend" subtitle="Recorded prescription volume for doctor" height={280} className="mb-6">
        <LineChart data={chartData} lines={[{ key: 'Volume', label: 'Prescription Volume', color: '#3b82f6' }]} height={260} />
      </ChartCard>

      <div className="card">
        <SectionHeader title="Doctor Prescription Stream" subtitle="Recent digital prescription history" />
        <DataTable
          columns={[
            { key: 'id', header: 'Prescription ID', accessor: (r) => <span className="font-data text-xs font-semibold text-[var(--color-accent-primary)]">{r.prescriptionId}</span> },
            { key: 'date', header: 'Date', accessor: (r) => <span className="text-xs text-[var(--color-text-muted)]">{r.date}</span> },
            { key: 'type', header: 'Type', accessor: (r) => <span className="badge badge-blue">{r.prescriptionType}</span> },
            { key: 'items', header: 'Items Count', accessor: (r) => <span className="font-data text-xs">{r.totalItems} items</span>, align: 'right' },
          ]}
          data={doctorRx}
          keyExtractor={(r) => r.id}
          pageSize={10}
        />
      </div>
    </div>
  )
}
