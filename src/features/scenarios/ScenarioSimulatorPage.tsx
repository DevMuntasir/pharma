// ─────────────────────────────────────────────────────────
// FEATURE: Interactive Scenario Simulator
// What-if simulator for pricing, detailing visits, and marketing
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import { Sliders, RefreshCw } from 'lucide-react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { KpiCard } from '@/components/cards/KpiCard'
import { LineChart, ChartCard } from '@/components/charts'
import { formatCurrency, formatPercent } from '@/utils'
import { PatientJourneySimulator } from './PatientJourneySimulator'

export function ScenarioSimulatorPage() {
  const [priceChange, setPriceChange] = useState<number>(0) // %
  const [visitMultiplier, setVisitMultiplier] = useState<number>(1.0) // x
  const [cmeBudget, setCmeBudget] = useState<number>(100000) // BDT
  const [competitorAggression, setCompetitorAggression] = useState<number>(0) // %

  // Baseline metrics
  const baseRx = 450
  const basePrice = 12.50 // BDT
  const baseRevenue = baseRx * basePrice * 30 // ~৳168,750 / mo

  // Calculate simulated impacts
  // Price elasticity assumption: -1.2 elasticity (10% price decrease ➔ +12% volume)
  const priceVolumeImpact = (priceChange * -1.2) / 100
  // Detailing visit impact: 1x baseline, +15% volume per 0.5x increase
  const visitImpact = (visitMultiplier - 1.0) * 0.3
  // Marketing budget impact: ৳100k baseline, +5% volume per ৳100k addition
  const marketingImpact = ((cmeBudget - 100000) / 100000) * 0.05
  // Competitor aggression impact
  const competitorImpact = (competitorAggression * -0.8) / 100

  const totalVolumeChangePct = (priceVolumeImpact + visitImpact + marketingImpact + competitorImpact) * 100
  const simulatedRx = Math.max(0, Math.round(baseRx * (1 + totalVolumeChangePct / 100)))

  const newPrice = basePrice * (1 + priceChange / 100)
  const simulatedRevenue = simulatedRx * newPrice * 30
  const revenueChangePct = baseRevenue === 0 ? 0 : ((simulatedRevenue - baseRevenue) / baseRevenue) * 100

  const chartData = [
    { month: 'Month 1', Baseline: baseRx, Simulated: Math.round(baseRx * (1 + (totalVolumeChangePct * 0.3) / 100)) },
    { month: 'Month 2', Baseline: baseRx, Simulated: Math.round(baseRx * (1 + (totalVolumeChangePct * 0.6) / 100)) },
    { month: 'Month 3', Baseline: baseRx, Simulated: Math.round(baseRx * (1 + (totalVolumeChangePct * 0.85) / 100)) },
    { month: 'Month 4', Baseline: baseRx, Simulated: simulatedRx },
    { month: 'Month 5', Baseline: baseRx, Simulated: simulatedRx },
    { month: 'Month 6', Baseline: baseRx, Simulated: simulatedRx },
  ]

  const handleReset = () => {
    setPriceChange(0)
    setVisitMultiplier(1.0)
    setCmeBudget(100000)
    setCompetitorAggression(0)
  }

  return (
    <div>
      <PageHeader
        title="Scenario Simulator"
        description="Model what-if commercial scenarios: pricing adjustments, field force detailing intensity, CME budget, and competitor moves."
        badge="Interactive Simulation Engine"
        breadcrumbs={[{ label: 'Predictive' }, { label: 'Scenario Simulator' }]}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={handleReset}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Inputs</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Controls Panel */}
        <div className="card lg:col-span-1 border-l-4 border-l-[var(--color-accent-primary)] space-y-5">
          <SectionHeader title="Simulation Controls" subtitle="Adjust decision variables in real time" actions={<Sliders className="w-4 h-4 text-[var(--color-accent-primary)]" />} />

          {/* Slider 1: Price Change */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[var(--color-text-primary)]">Price Adjustment</span>
              <span className="font-data text-[var(--color-accent-primary)]">{priceChange > 0 ? `+${priceChange}` : priceChange}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              className="w-full h-1.5 bg-[var(--color-bg-elevated)] rounded cursor-pointer accent-[var(--color-accent-primary)]"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
            />
            <div className="flex justify-between text-2xs text-[var(--color-text-muted)] mt-1">
              <span>-20% (Discount)</span>
              <span>+20% (Premium)</span>
            </div>
          </div>

          {/* Slider 2: Field Detailing Visit Frequency */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[var(--color-text-primary)]">Field Detailing Visits</span>
              <span className="font-data text-[var(--color-accent-secondary)]">{visitMultiplier.toFixed(1)}x Baseline</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              className="w-full h-1.5 bg-[var(--color-bg-elevated)] rounded cursor-pointer accent-[var(--color-accent-secondary)]"
              value={visitMultiplier}
              onChange={(e) => setVisitMultiplier(Number(e.target.value))}
            />
            <div className="flex justify-between text-2xs text-[var(--color-text-muted)] mt-1">
              <span>0.5x (Low)</span>
              <span>2.5x (Aggressive)</span>
            </div>
          </div>

          {/* Slider 3: CME / Marketing Budget */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[var(--color-text-primary)]">CME / Event Budget</span>
              <span className="font-data text-[var(--color-accent-emerald)]">৳{(cmeBudget / 1000).toFixed(0)}K</span>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="25000"
              className="w-full h-1.5 bg-[var(--color-bg-elevated)] rounded cursor-pointer accent-[var(--color-accent-emerald)]"
              value={cmeBudget}
              onChange={(e) => setCmeBudget(Number(e.target.value))}
            />
            <div className="flex justify-between text-2xs text-[var(--color-text-muted)] mt-1">
              <span>৳0</span>
              <span>৳500K</span>
            </div>
          </div>

          {/* Slider 4: Competitor Aggression */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[var(--color-text-primary)]">Competitor Pressure</span>
              <span className="font-data text-[var(--color-accent-rose)]">{competitorAggression > 0 ? `+${competitorAggression}` : competitorAggression}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="5"
              className="w-full h-1.5 bg-[var(--color-bg-elevated)] rounded cursor-pointer accent-[var(--color-accent-rose)]"
              value={competitorAggression}
              onChange={(e) => setCompetitorAggression(Number(e.target.value))}
            />
            <div className="flex justify-between text-2xs text-[var(--color-text-muted)] mt-1">
              <span>Competitor Weak</span>
              <span>Aggressive Campaign</span>
            </div>
          </div>
        </div>

        {/* Outputs Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="kpi-grid">
            <KpiCard
              title="Simulated Monthly Rx"
              value={simulatedRx}
              change={totalVolumeChangePct}
              changeLabel="vs baseline"
              subtitle="Projected prescription volume"
              accent="blue"
            />
            <KpiCard
              title="Simulated Monthly Revenue"
              value={formatCurrency(simulatedRevenue)}
              change={revenueChangePct}
              changeLabel="vs baseline"
              subtitle="Projected gross revenue"
              accent="emerald"
            />
            <KpiCard
              title="Net Elasticity Effect"
              value={formatPercent(totalVolumeChangePct)}
              subtitle="Combined impact multiplier"
              accent="violet"
            />
          </div>

          <ChartCard title="Simulated 6-Month Trajectory vs Baseline" subtitle="Dynamic prescription volume projection" height={280}>
            <LineChart
              data={chartData}
              lines={[
                { key: 'Simulated', label: 'Simulated Scenario', color: '#10b981' },
                { key: 'Baseline', label: 'Baseline Trend', color: '#4d6480' },
              ]}
              height={260}
            />
          </ChartCard>
        </div>
      </div>

      <PatientJourneySimulator />
    </div>
  )
}
