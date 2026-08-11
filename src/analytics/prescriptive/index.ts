// ─────────────────────────────────────────────────────────
// ANALYTICS: Prescriptive Foundation
// Returns deterministic demo results.
// Future: real scoring models.
// ─────────────────────────────────────────────────────────

import type { Opportunity } from '@/types'

export interface OpportunityScore {
  entityId: string
  entityName: string
  entityType: 'territory' | 'brand' | 'doctor'
  score: number // 0-100
  factors: string[]
  priority: 'low' | 'medium' | 'high'
}

export interface RiskScore {
  entityId: string
  entityName: string
  entityType: 'territory' | 'brand' | 'doctor'
  score: number // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  factors: string[]
}

export interface WhiteSpaceResult {
  territoryId: string
  territoryName: string
  targetSpecialty: string
  estimatedPrescriptionPotential: number
  currentCoverage: number // 0-100
  gapScore: number // 0-100
}

export interface RecommendedAction {
  id: string
  title: string
  description: string
  actionType: 'visit' | 'campaign' | 'sample' | 'training' | 'price_review'
  priority: 'low' | 'medium' | 'high'
  targetEntityId: string
  targetEntityType: 'territory' | 'brand' | 'doctor'
  estimatedImpact: string
}

// ── Opportunity scoring ────────────────────────────────────

export function calculateOpportunityScore(
  entityId: string,
  entityName: string,
  entityType: 'territory' | 'brand' | 'doctor',
  prescriptionCount: number,
  averageCount: number
): OpportunityScore {
  // Deterministic demo scoring: based on relative performance gap
  const ratio = averageCount === 0 ? 1 : prescriptionCount / averageCount
  const gap = Math.max(0, 1 - ratio)
  const score = Math.min(100, Math.round(gap * 100 + (prescriptionCount < 50 ? 20 : 0)))

  const factors: string[] = []
  if (prescriptionCount < averageCount * 0.7) factors.push('Below average prescription volume')
  if (prescriptionCount < 30) factors.push('Low engagement detected')
  if (gap > 0.5) factors.push('Significant market gap identified')

  return {
    entityId,
    entityName,
    entityType,
    score,
    factors,
    priority: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
  }
}

// ── Risk scoring ───────────────────────────────────────────

export function calculateRiskScore(
  entityId: string,
  entityName: string,
  entityType: 'territory' | 'brand' | 'doctor',
  recentCount: number,
  historicalAverage: number
): RiskScore {
  // Deterministic demo: risk based on decline from historical average
  const decline = historicalAverage === 0 ? 0 : (historicalAverage - recentCount) / historicalAverage
  const score = Math.min(100, Math.round(Math.max(0, decline * 100)))

  const factors: string[] = []
  if (decline > 0.3) factors.push('30%+ decline from historical average')
  if (decline > 0.5) factors.push('Critical volume drop detected')
  if (recentCount === 0) factors.push('Zero prescriptions in recent period')

  return {
    entityId,
    entityName,
    entityType,
    score,
    riskLevel: score > 75 ? 'critical' : score > 50 ? 'high' : score > 25 ? 'medium' : 'low',
    factors,
  }
}

// ── White space detection ─────────────────────────────────

export function detectWhiteSpace(
  territoryId: string,
  territoryName: string,
  doctorCountInTerritory: number,
  prescribingDoctorCount: number,
  specialtyName: string
): WhiteSpaceResult {
  const coverage = doctorCountInTerritory === 0
    ? 0
    : Math.round((prescribingDoctorCount / doctorCountInTerritory) * 100)
  const gapScore = Math.max(0, 100 - coverage)
  const estimatedPotential = (doctorCountInTerritory - prescribingDoctorCount) * 15 // ~15 Rx/doctor estimate

  return {
    territoryId,
    territoryName,
    targetSpecialty: specialtyName,
    estimatedPrescriptionPotential: estimatedPotential,
    currentCoverage: coverage,
    gapScore,
  }
}

// ── Recommended actions ────────────────────────────────────

export function generateRecommendedActions(
  opportunities: OpportunityScore[],
  risks: RiskScore[]
): RecommendedAction[] {
  const actions: RecommendedAction[] = []
  let counter = 1

  // Actions for high-opportunity entities
  opportunities
    .filter((o) => o.priority === 'high')
    .slice(0, 5)
    .forEach((opp) => {
      actions.push({
        id: `ACTION-${String(counter++).padStart(3, '0')}`,
        title: `Increase engagement: ${opp.entityName}`,
        description: `Prioritize detailing visits and sampling for high-opportunity ${opp.entityType}`,
        actionType: 'visit',
        priority: 'high',
        targetEntityId: opp.entityId,
        targetEntityType: opp.entityType,
        estimatedImpact: `+${Math.round(opp.score * 0.3)} est. prescriptions/month`,
      })
    })

  // Actions for high-risk entities
  risks
    .filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical')
    .slice(0, 5)
    .forEach((risk) => {
      actions.push({
        id: `ACTION-${String(counter++).padStart(3, '0')}`,
        title: `Risk mitigation: ${risk.entityName}`,
        description: `Urgent follow-up required. Investigate root cause of decline`,
        actionType: 'campaign',
        priority: risk.riskLevel === 'critical' ? 'high' : 'medium',
        targetEntityId: risk.entityId,
        targetEntityType: risk.entityType,
        estimatedImpact: `Prevent further loss of ${risk.score}% volume`,
      })
    })

  return actions

}

// ── Demo opportunities ────────────────────────────────────
// Pre-generated demo opportunities for the Intelligence Feed

export const demoOpportunities: Opportunity[] = [
  {
    id: 'OPP-001',
    title: 'White Space: Sylhet Diabetologists',
    description: 'Low NovaMet penetration in Sylhet territory among diabetologists. Estimated 45 untapped doctors.',
    opportunityType: 'white_space',
    potentialRevenue: 450000,
    territoryId: 'TER-006',
    brandId: 'BRAND-005',
    confidence: 82,
    priority: 'high',
    status: 'open',
    date: '2024-09-01',
    month: 9,
    quarter: 3,
    year: 2024,
    createdAt: '2024-09-01',
  },
  {
    id: 'OPP-002',
    title: 'Growth: ZenPan 40 in Chittagong',
    description: 'Rapid PPI market growth in Chittagong Metro. ZenPan 40 has <12% share vs 28% national average.',
    opportunityType: 'growth',
    potentialRevenue: 280000,
    territoryId: 'TER-004',
    brandId: 'BRAND-016',
    confidence: 76,
    priority: 'high',
    status: 'open',
    date: '2024-09-15',
    month: 9,
    quarter: 3,
    year: 2024,
    createdAt: '2024-09-15',
  },
  {
    id: 'OPP-003',
    title: 'Competitor Switch: Losartan vs Axilosartan',
    description: 'OrionVals showing 3-month decline in Rajshahi. Opportunity to capture switching patients.',
    opportunityType: 'competitor_switch',
    potentialRevenue: 180000,
    territoryId: 'TER-007',
    brandId: 'BRAND-008',
    confidence: 65,
    priority: 'medium',
    status: 'open',
    date: '2024-08-01',
    month: 8,
    quarter: 3,
    year: 2024,
    createdAt: '2024-08-01',
  },
]
