// ─────────────────────────────────────────────────────────
// FEATURE: Prescription & Disease Analytics
// Rx type breakdowns, ICD-10 disease stats, Co-prescription matrix
// ─────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { FilterBar } from '@/components/filters/FilterBar'
import { KpiCard } from '@/components/cards/KpiCard'
import { DonutChart, ChartCard } from '@/components/charts'
import { DataTable, type ColumnDef } from '@/components/tables/DataTable'
import { prescriptions, diseases } from '@/data'
import {
  getNewPrescriptionRate,
  getRepeatPrescriptionRate,
  getSwitchPrescriptionRate,
  getDiseaseDistribution,
} from '@/analytics'
import { formatPercent } from '@/utils'

export function PrescriptionAnalyticsPage() {
  const newRate = getNewPrescriptionRate(prescriptions)
  const repeatRate = getRepeatPrescriptionRate(prescriptions)
  const switchRate = getSwitchPrescriptionRate(prescriptions)

  const rxTypeData = [
    { label: 'Repeat Therapy', value: Math.round(repeatRate * prescriptions.length / 100), color: '#3b82f6' },
    { label: 'New Therapy', value: Math.round(newRate * prescriptions.length / 100), color: '#10b981' },
    { label: 'Switch Therapy', value: Math.round(switchRate * prescriptions.length / 100), color: '#f59e0b' },
  ]

  const rxColumns: ColumnDef<typeof prescriptions[0]>[] = [
    { key: 'id', header: 'Prescription ID', accessor: (r) => <span className="font-data text-xs text-[var(--color-accent-primary)] font-semibold">{r.prescriptionId}</span> },
    { key: 'date', header: 'Date', accessor: (r) => <span className="text-xs text-[var(--color-text-muted)]">{r.date}</span> },
    { key: 'type', header: 'Classification', accessor: (r) => (
      <span className={`badge ${r.prescriptionType === 'NEW' ? 'badge-emerald' : r.prescriptionType === 'SWITCH' ? 'badge-amber' : 'badge-blue'}`}>
        {r.prescriptionType}
      </span>
    )},
    { key: 'items', header: 'Items Count', accessor: (r) => <span className="font-data text-xs">{r.totalItems} items</span>, align: 'right' },
  ]

  return (
    <div>
      <PageHeader
        title="Prescription Analytics"
        description="Prescription classification (New, Repeat, Switch), volume intensity, and treatment duration analysis."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Prescription Analytics' }]}
      />
      <FilterBar />

      <div className="kpi-grid mb-6">
        <KpiCard title="Total Prescriptions" value={prescriptions.length} subtitle="Seeded Rx records" accent="blue" />
        <KpiCard title="New Therapy Rate" value={formatPercent(newRate)} subtitle="First-time starts" accent="emerald" />
        <KpiCard title="Repeat Therapy Rate" value={formatPercent(repeatRate)} subtitle="Maintenance treatments" accent="blue" />
        <KpiCard title="Brand Switch Rate" value={formatPercent(switchRate)} subtitle="Patient conversions" accent="amber" />
      </div>

      <div className="chart-grid mb-6">
        <ChartCard title="Prescription Classification Breakdown" subtitle="Distribution of New vs Repeat vs Switch therapies" height={280}>
          <DonutChart data={rxTypeData} height={260} centerLabel="Total Rx" centerValue={`${prescriptions.length}`} />
        </ChartCard>
      </div>

      <div className="card">
        <SectionHeader title="Recent Prescriptions Stream" subtitle="Latest recorded digital prescriptions" />
        <DataTable columns={rxColumns} data={prescriptions} keyExtractor={(r) => r.id} pageSize={10} />
      </div>
    </div>
  )
}

// ── Disease Intelligence Page ──────────────────────────────

export function DiseaseIntelligencePage() {
  const diseaseNameMap = useMemo(() => new Map(diseases.map((d) => [d.id, d.name])), [])
  const diseaseDist = useMemo(() => getDiseaseDistribution(prescriptions, diseaseNameMap), [diseaseNameMap])

  const diseaseColumns: ColumnDef<typeof diseaseDist[0]>[] = [
    { key: 'label', header: 'Disease / Diagnosis', accessor: (d) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{d.label}</span> },
    { key: 'count', header: 'Rx Volume', accessor: (d) => <span className="font-data text-xs">{d.count.toLocaleString()}</span>, align: 'right' },
    { key: 'percentage', header: 'Share of Diagnosis', accessor: (d) => <span className="badge badge-cyan font-data">{d.percentage}%</span>, align: 'right' },
  ]

  return (
    <div>
      <PageHeader
        title="Disease Intelligence"
        description="Prescription volume breakdown by disease indication, ICD-10 diagnosis, and therapeutic category."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Disease Intelligence' }]}
      />
      <div className="card">
        <SectionHeader title="Disease Prevalence & Prescription Frequency" subtitle="Distribution across 17 tracked disease indications" />
        <DataTable columns={diseaseColumns} data={diseaseDist} keyExtractor={(d) => d.label} pageSize={12} />
      </div>
    </div>
  )
}

// ── Co-Prescription Page ───────────────────────────────────

export function CoPrescriptionPage() {
  const coPrescriptions = [
    { pair: 'Metformin + Amlodipine', condition: 'Diabetes + Hypertension', frequency: 142, affinity: 'High (84%)' },
    { pair: 'Omeprazole + Diclofenac', condition: 'GI Protection + Pain', frequency: 118, affinity: 'High (76%)' },
    { pair: 'Atorvastatin + Losartan', condition: 'Dyslipidemia + Hypertension', frequency: 95, affinity: 'Medium (68%)' },
    { pair: 'Azithromycin + Paracetamol', condition: 'URI Infection + Fever', frequency: 87, affinity: 'Medium (62%)' },
    { pair: 'Salbutamol + Montelukast', condition: 'Asthma / Bronchospasm', frequency: 64, affinity: 'High (79%)' },
  ]

  return (
    <div>
      <PageHeader
        title="Co-Prescription Analytics"
        description="Identify which brands and generic molecules are prescribed together most frequently by doctors."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Co-Prescription' }]}
      />
      <div className="card">
        <SectionHeader title="Top Co-Prescribed Molecule Pairs" subtitle="Frequently co-administered drug combinations" />
        <DataTable
          columns={[
            { key: 'pair', header: 'Co-Prescribed Molecules', accessor: (r) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{r.pair}</span> },
            { key: 'condition', header: 'Therapeutic Rationale', accessor: (r) => <span className="text-xs text-[var(--color-text-muted)]">{r.condition}</span> },
            { key: 'frequency', header: 'Co-Occurrence Count', accessor: (r) => <span className="font-data text-xs">{r.frequency} Rx</span>, align: 'right' },
            { key: 'affinity', header: 'Affinity Score', accessor: (r) => <span className="badge badge-emerald font-data">{r.affinity}</span>, align: 'right' },
          ]}
          data={coPrescriptions}
          keyExtractor={(r) => r.pair}
          pageSize={10}
        />
      </div>
    </div>
  )
}
