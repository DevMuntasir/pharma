// ─────────────────────────────────────────────────────────
// FEATURE: Intelligence Feed, Anomalies, Early Warnings & Growth Opportunities
// ─────────────────────────────────────────────────────────

import { Gem, ArrowUpRight } from 'lucide-react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { FilterBar } from '@/components/filters/FilterBar'
import { DataTable } from '@/components/tables/DataTable'
import { demoOpportunities } from '@/analytics'
import { formatCurrency } from '@/utils'

export function InsightsFeedPage() {
  const insights = [
    { id: 'INS-001', type: 'predictive', title: 'High Growth Expected in Antidiabetic Category', confidence: 88, body: 'Metformin & Glimepiride prescriptions in Dhaka North are projected to grow +14% QoQ based on regional prescriber activity.' },
    { id: 'INS-002', type: 'diagnostic', title: 'OrionVals Share Shift Detected in Rajshahi', confidence: 79, body: 'Competitive switching data indicates 12.4% of OrionVals prescribers are shifting towards Axilosartan 50.' },
    { id: 'INS-003', type: 'prescriptive', title: 'Sylhet Territory Detailing Allocation Recommended', confidence: 92, body: 'Reallocating 2 field reps from Chittagong North to Sylhet Metro is predicted to yield +৳350K monthly Rx revenue.' },
  ]

  return (
    <div>
      <PageHeader
        title="Intelligence Feed"
        description="AI-generated and rule-based insights, confidence scores, and strategic recommendation feed."
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Intelligence Feed' }]}
      />
      <FilterBar />

      <div className="space-y-4">
        {insights.map((ins) => (
          <div key={ins.id} className="card border-l-4 border-l-[var(--color-accent-primary)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <Gem className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
                {ins.title}
              </span>
              <span className="badge badge-emerald font-data">{ins.confidence}% Confidence</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{ins.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnomaliesPage() {
  const anomalies = [
    { date: '2024-06-12', territory: 'Chittagong Metro', entity: 'ZenPan 40', event: 'Unusual +45% Rx Spike', severity: 'HIGH' },
    { date: '2024-05-28', territory: 'Dhaka Central', entity: 'NovaCor 5', event: '-30% Sudden Volume Drop', severity: 'CRITICAL' },
    { date: '2024-05-14', territory: 'Sylhet Metro', entity: 'Dr. Tariq Hassan', event: 'New Brand Adoption Spike', severity: 'MEDIUM' },
  ]

  return (
    <div>
      <PageHeader
        title="Anomaly Detection Engine"
        description="Automated statistical anomaly detection for unusual volume spikes, sudden drops, and prescribing shifts."
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Anomalies' }]}
      />
      <div className="card border-l-4 border-l-[var(--color-accent-rose)]">
        <SectionHeader title="Detected Anomaly Stream" subtitle="Statistical outliers exceeding 2.5 standard deviations" />
        <DataTable
          columns={[
            { key: 'date', header: 'Date', accessor: (a) => <span className="text-xs text-[var(--color-text-muted)]">{a.date}</span> },
            { key: 'territory', header: 'Territory', accessor: (a) => <span className="text-xs">{a.territory}</span> },
            { key: 'entity', header: 'Subject Entity', accessor: (a) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{a.entity}</span> },
            { key: 'event', header: 'Anomaly Event', accessor: (a) => <span className="text-xs">{a.event}</span> },
            { key: 'severity', header: 'Severity', accessor: (a) => <span className={`badge ${a.severity === 'CRITICAL' ? 'badge-rose' : a.severity === 'HIGH' ? 'badge-amber' : 'badge-blue'}`}>{a.severity}</span>, align: 'center' },
          ]}
          data={anomalies}
          keyExtractor={(a) => `${a.date}-${a.entity}`}
          pageSize={10}
        />
      </div>
    </div>
  )
}

export function AlertsPage() {
  const alerts = [
    { category: 'Brand Decline', title: 'Axilosartan 100 — 2 Consecutive Months Decline', territory: 'Dhaka North', level: 'WARNING' },
    { category: 'Competitor Move', title: 'ApexBio Launching Aggressive Detailing in Rajshahi', territory: 'Rajshahi Metro', level: 'INFO' },
    { category: 'Territory Gap', title: 'Barisal Prescriber Engagement Under Target (42%)', territory: 'Barisal Metro', level: 'CRITICAL' },
  ]

  return (
    <div>
      <PageHeader
        title="Early Warnings & Alerts"
        description="Proactive risk detection and early warning triggers across brands, territories, and competitors."
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Early Warnings' }]}
      />
      <div className="card">
        <SectionHeader title="Active Early Warning Triggers" subtitle="Proactive risk alerts needing attention" />
        <DataTable
          columns={[
            { key: 'category', header: 'Category', accessor: (a) => <span className="badge badge-cyan">{a.category}</span> },
            { key: 'title', header: 'Alert Description', accessor: (a) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{a.title}</span> },
            { key: 'territory', header: 'Territory', accessor: (a) => <span className="text-xs text-[var(--color-text-muted)]">{a.territory}</span> },
            { key: 'level', header: 'Level', accessor: (a) => <span className={`badge ${a.level === 'CRITICAL' ? 'badge-rose' : a.level === 'WARNING' ? 'badge-amber' : 'badge-blue'}`}>{a.level}</span>, align: 'center' },
          ]}
          data={alerts}
          keyExtractor={(a) => a.title}
          pageSize={10}
        />
      </div>
    </div>
  )
}

export function OpportunitiesPage() {
  return (
    <div>
      <PageHeader
        title="Growth Opportunities"
        description="Ranked revenue growth opportunities identified by white space detection and competitor switching models."
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Growth Opportunities' }]}
      />
      <div className="space-y-4">
        {demoOpportunities.map((opp) => (
          <div key={opp.id} className="card border-l-4 border-l-[var(--color-accent-emerald)] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{opp.title}</span>
                <span className="badge badge-emerald font-data">+{formatCurrency(opp.potentialRevenue)} Est. Potential</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-2">{opp.description}</p>
              <div className="flex items-center gap-3 text-2xs text-[var(--color-text-muted)]">
                <span>Confidence: <strong>{opp.confidence}%</strong></span>
                <span>Type: <strong className="uppercase">{opp.opportunityType}</strong></span>
              </div>
            </div>
            <button className="btn btn-primary btn-sm flex-shrink-0">
              <span>Execute Action</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
