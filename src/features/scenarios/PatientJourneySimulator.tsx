// ─────────────────────────────────────────────────────────
// FEATURE: Patient Journey & Therapy Escalation Simulator
// Visualizes patient transition steps from initial diagnosis ➔ monotherapy ➔ escalation
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import { SectionHeader } from '@/components/ui/Headers'
import { DonutChart, ChartCard } from '@/components/charts'

export function PatientJourneySimulator() {
  const [diseaseFilter, setDiseaseFilter] = useState<'diabetes' | 'hypertension'>('diabetes')

  const journeySteps = diseaseFilter === 'diabetes' ? [
    { step: 1, stage: 'Initial Diagnosis', therapy: 'Lifestyle & Diet Advice', retention: '100%', patients: 1000 },
    { step: 2, stage: 'First-Line Monotherapy', therapy: 'Metformin 500mg (NovaMet 500)', retention: '82%', patients: 820 },
    { step: 3, stage: 'Dual Combination Escalation', therapy: 'Metformin + Glimepiride (AxiGlim)', retention: '64%', patients: 640 },
    { step: 4, stage: 'Advanced Triple Therapy', therapy: 'DPP-4 Inhibitor (ApexSita 100)', retention: '48%', patients: 480 },
  ] : [
    { step: 1, stage: 'Initial Diagnosis', therapy: 'BP Monitoring & Lifestyle', retention: '100%', patients: 1000 },
    { step: 2, stage: 'First-Line Monotherapy', therapy: 'Amlodipine 5mg (NovaCor 5)', retention: '85%', patients: 850 },
    { step: 3, stage: 'ARB Combination Escalation', therapy: 'Losartan 50mg (Axilosartan 50)', retention: '68%', patients: 680 },
    { step: 4, stage: 'Triple Combination Therapy', therapy: 'Amlodipine + ARB + Diuretic', retention: '52%', patients: 520 },
  ]

  const funnelData = journeySteps.map((s) => ({
    label: s.stage,
    value: s.patients,
  }))

  return (
    <div className="mt-8">
      <SectionHeader
        title="Patient Journey & Therapy Escalation Simulator"
        subtitle="Track patient progression from initial diagnosis through monotherapy and escalation"
        actions={
          <div className="flex items-center gap-2">
            <button
              className={`btn btn-sm ${diseaseFilter === 'diabetes' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiseaseFilter('diabetes')}
            >
              Type 2 Diabetes Flow
            </button>
            <button
              className={`btn btn-sm ${diseaseFilter === 'hypertension' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDiseaseFilter('hypertension')}
            >
              Hypertension Flow
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {journeySteps.map((s) => (
          <div key={s.step} className="card relative border-t-4 border-t-[var(--color-accent-primary)]">
            <div className="flex items-center justify-between mb-2">
              <span className="badge badge-blue font-data">Step {s.step}</span>
              <span className="text-2xs font-bold font-data text-[var(--color-accent-emerald)]">{s.retention} Retained</span>
            </div>
            <h4 className="text-xs font-bold text-[var(--color-text-primary)] mb-1">{s.stage}</h4>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">{s.therapy}</p>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)] text-2xs">
              <span className="text-[var(--color-text-muted)]">Active Cohort:</span>
              <span className="font-data font-bold text-white">{s.patients} Patients</span>
            </div>
          </div>
        ))}
      </div>

      <ChartCard title="Therapy Retention Funnel" subtitle="Patient cohort retention across treatment stages" height={260}>
        <DonutChart data={funnelData} height={240} centerLabel="Cohort" centerValue="1,000" />
      </ChartCard>
    </div>
  )
}
