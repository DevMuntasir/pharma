// ─────────────────────────────────────────────────────────
// COMPONENT: ComingSoonPage
// Professional placeholder for unimplemented route pages.
// ─────────────────────────────────────────────────────────

import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import { PageHeader } from '@/components/ui/Headers'

interface ComingSoonPageProps {
  title: string
  description: string
  milestone?: string
  icon?: LucideIcon
  breadcrumbs?: Array<{ label: string }>
  className?: string
}

export function ComingSoonPage({
  title,
  description,
  milestone = 'Milestone 2',
  icon: Icon = Construction,
  breadcrumbs,
  className,
}: ComingSoonPageProps) {
  return (
    <div className={className}>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      <div className="coming-soon-container card">
        <Icon className="coming-soon-icon" aria-hidden="true" />
        <h2 className="coming-soon-title">{title}</h2>
        <p className="coming-soon-desc">{description}</p>
        <p className="coming-soon-milestone">
          Analytics module will be implemented in {milestone}.
        </p>
      </div>
    </div>
  )
}

// ── Feature page exports (one per major feature area) ─────

export function DashboardPage() {
  return (
    <ComingSoonPage
      title="Executive Overview"
      description="High-level KPIs, trends, and alerts across the entire Bangladesh pharmaceutical market."
      breadcrumbs={[{ label: 'Command Center' }, { label: 'Executive Overview' }]}
      milestone="Milestone 2"
    />
  )
}

export function MarketOverviewPage() {
  return <ComingSoonPage title="Market Overview" description="Total market size, growth rates, and leading brands across all therapeutic classes." breadcrumbs={[{ label: 'Analytics' }, { label: 'Market Overview' }]} />
}

export function MarketExplorerPage() {
  return <ComingSoonPage title="Market Explorer" description="Drill into any segment, territory, or time period to understand market dynamics." breadcrumbs={[{ label: 'Analytics' }, { label: 'Market Explorer' }]} />
}

export function MarketSharePage() {
  return <ComingSoonPage title="Market Share" description="Competitive share analysis by brand, molecule, and therapeutic class." breadcrumbs={[{ label: 'Analytics' }, { label: 'Market Share' }]} />
}

export function MarketTrendsPage() {
  return <ComingSoonPage title="Market Trends" description="Long-term trend lines, growth trajectories, and momentum signals." breadcrumbs={[{ label: 'Analytics' }, { label: 'Market Trends' }]} />
}

export function PrescriptionAnalyticsPage() {
  return <ComingSoonPage title="Prescription Analytics" description="New, repeat, and switch prescription rates across doctors, territories, and brands." breadcrumbs={[{ label: 'Analytics' }, { label: 'Prescription Analytics' }]} />
}

export function DiseaseIntelligencePage() {
  return <ComingSoonPage title="Disease Intelligence" description="Prescriptions by disease, therapeutic class, and ICD classification." breadcrumbs={[{ label: 'Analytics' }, { label: 'Disease Intelligence' }]} />
}

export function CoPrescriptionPage() {
  return <ComingSoonPage title="Co-Prescription Analytics" description="Identify which brands and molecules are prescribed together most frequently." breadcrumbs={[{ label: 'Analytics' }, { label: 'Co-Prescription' }]} />
}

export function DoctorIntelligencePage() {
  return <ComingSoonPage title="Doctor Intelligence" description="Prescriber profiles, tier analysis, engagement metrics, and specialty breakdown." breadcrumbs={[{ label: 'Analytics' }, { label: 'Doctor Intelligence' }]} />
}

export function DoctorDetailPage() {
  return <ComingSoonPage title="Doctor Detail" description="Deep-dive into a single doctor's prescription history, brand preferences, and trends." breadcrumbs={[{ label: 'Doctors' }, { label: 'Doctor Profile' }]} />
}

export function BrandIntelligencePage() {
  return <ComingSoonPage title="Brand Intelligence" description="Brand-level analytics including growth, share, and lifecycle stage." breadcrumbs={[{ label: 'Analytics' }, { label: 'Brand Intelligence' }]} />
}

export function MoleculeIntelligencePage() {
  return <ComingSoonPage title="Molecule Intelligence" description="Molecule-level prescription volume, trends, and competitive position." breadcrumbs={[{ label: 'Analytics' }, { label: 'Molecule Intelligence' }]} />
}

export function ProductLifecyclePage() {
  return <ComingSoonPage title="Product Lifecycle" description="Track brand maturity stages: launch, growth, maturity, and decline." breadcrumbs={[{ label: 'Analytics' }, { label: 'Product Lifecycle' }]} />
}

export function TerritoriesPage() {
  return <ComingSoonPage title="Bangladesh Market" description="Geographic heat maps and territory-level market analysis across all divisions and districts." breadcrumbs={[{ label: 'Geography' }, { label: 'Bangladesh Market' }]} />
}

export function TerritoryDetailPage() {
  return <ComingSoonPage title="Territory Detail" description="Full territory performance: prescription volume, doctors, brands, and growth." breadcrumbs={[{ label: 'Geography' }, { label: 'Territory Detail' }]} />
}

export function WhiteSpacePage() {
  return <ComingSoonPage title="White Space Analysis" description="Identify unserved or underserved territories and specialties with high prescription potential." breadcrumbs={[{ label: 'Geography' }, { label: 'White Space' }]} />
}

export function CompetitionPage() {
  return <ComingSoonPage title="Competitor Intelligence" description="Track competitor brands, molecules, and market movements in real time." breadcrumbs={[{ label: 'Competition' }, { label: 'Competitor Intelligence' }]} />
}

export function CompetitionSharePage() {
  return <ComingSoonPage title="Share Movement" description="Period-over-period market share movements across all tracked competitors." breadcrumbs={[{ label: 'Competition' }, { label: 'Share Movement' }]} />
}

export function BrandSwitchingPage() {
  return <ComingSoonPage title="Brand Switching" description="Track which brands are gaining and losing patients to competitors." breadcrumbs={[{ label: 'Competition' }, { label: 'Brand Switching' }]} />
}

export function DemandAnalyticsPage() {
  return <ComingSoonPage title="Demand Analytics" description="Prescription demand volume trends across all dimensions." breadcrumbs={[{ label: 'Demand' }, { label: 'Demand Analytics' }]} />
}

export function SeasonalityPage() {
  return <ComingSoonPage title="Seasonality Analytics" description="Identify seasonal prescription patterns and disease prevalence cycles." breadcrumbs={[{ label: 'Demand' }, { label: 'Seasonality' }]} />
}

export function AvailabilityPage() {
  return <ComingSoonPage title="Availability Analytics" description="Track product availability gaps and stockout risks by territory." breadcrumbs={[{ label: 'Demand' }, { label: 'Availability' }]} />
}

export function DemandForecastPage() {
  return <ComingSoonPage title="Demand Forecast" description="Simulated 6-month prescription demand forecasts by therapeutic class and territory." breadcrumbs={[{ label: 'Predictive' }, { label: 'Demand Forecast' }]} milestone="Milestone 3" />
}

export function ProductForecastPage() {
  return <ComingSoonPage title="Product Forecast" description="Brand and molecule-level prescription volume predictions for the next 1–3 quarters." breadcrumbs={[{ label: 'Predictive' }, { label: 'Product Forecast' }]} milestone="Milestone 3" />
}

export function TerritoryForecastPage() {
  return <ComingSoonPage title="Territory Forecast" description="Territory-level demand forecasts to guide field force allocation decisions." breadcrumbs={[{ label: 'Predictive' }, { label: 'Territory Forecast' }]} milestone="Milestone 3" />
}

export function ScenarioSimulatorPage() {
  return <ComingSoonPage title="Scenario Simulator" description="Model what-if scenarios: new brand launches, competitor exits, and market changes." breadcrumbs={[{ label: 'Predictive' }, { label: 'Scenario Simulator' }]} milestone="Milestone 3" />
}

export function InsightsFeedPage() {
  return <ComingSoonPage title="Intelligence Feed" description="AI-generated and rule-based insights, market signals, and action triggers." breadcrumbs={[{ label: 'Intelligence' }, { label: 'Intelligence Feed' }]} />
}

export function AnomaliesPage() {
  return <ComingSoonPage title="Anomaly Detection" description="Automated detection of unusual prescription patterns, volume spikes, and market anomalies." breadcrumbs={[{ label: 'Intelligence' }, { label: 'Anomalies' }]} />
}

export function AlertsPage() {
  return <ComingSoonPage title="Early Warnings" description="Proactive alerts for brand decline, territory gaps, and competitive threats." breadcrumbs={[{ label: 'Intelligence' }, { label: 'Early Warnings' }]} />
}

export function OpportunitiesPage() {
  return <ComingSoonPage title="Growth Opportunities" description="Ranked list of high-probability growth opportunities by territory, brand, and doctor." breadcrumbs={[{ label: 'Intelligence' }, { label: 'Growth Opportunities' }]} />
}

export function AiCopilotPage() {
  return <ComingSoonPage title="Pharma Copilot" description="Conversational AI assistant for on-demand pharmaceutical market intelligence." breadcrumbs={[{ label: 'AI' }, { label: 'Pharma Copilot' }]} milestone="Milestone 4" />
}

export function AnalyticsStudioPage() {
  return <ComingSoonPage title="Analytics Studio" description="Custom chart builder and ad-hoc query interface for power users." breadcrumbs={[{ label: 'Tools' }, { label: 'Analytics Studio' }]} />
}

export function ReportsPage() {
  return <ComingSoonPage title="Reports" description="Scheduled and on-demand PDF/Excel exports for executive reporting." breadcrumbs={[{ label: 'Tools' }, { label: 'Reports' }]} />
}

export function NotFoundPage() {
  return (
    <ComingSoonPage
      title="Page Not Found"
      description="The page you are looking for does not exist or has been moved."
      milestone="N/A"
    />
  )
}
