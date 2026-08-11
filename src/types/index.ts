// ─────────────────────────────────────────────────────────
// PHARMA INTELLIGENCE OS — Domain Types
// All data is fictional and intended for demonstration only.
// ─────────────────────────────────────────────────────────

// ── Shared ──────────────────────────────────────────────

export type ID = string

export interface TimeDimension {
  date: string // ISO 8601 date string YYYY-MM-DD
  month: number // 1–12
  quarter: 1 | 2 | 3 | 4
  year: number
}

export interface BaseEntity {
  id: ID
  createdAt: string
}

// ── Geographic ──────────────────────────────────────────

export interface Upazila extends BaseEntity {
  name: string
  districtId: ID
}

export interface District extends BaseEntity {
  name: string
  territoryId: ID
  division: string
  upazilas: ID[]
}

export interface Territory extends BaseEntity {
  name: string
  division: string
  districts: ID[]
  managerId?: ID // future: sales manager
}

// ── Therapeutic ──────────────────────────────────────────

export interface TherapeuticClass extends BaseEntity {
  name: string
  code: string
  description: string
}

export interface Molecule extends BaseEntity {
  name: string
  genericName: string
  therapeuticClassId: ID
  description: string
}

// ── Company & Product ────────────────────────────────────

export interface Company extends BaseEntity {
  name: string
  shortName: string
  country: string
  type: 'local' | 'multinational'
  description: string
}

export interface Brand extends BaseEntity {
  name: string
  companyId: ID
  moleculeId: ID
  therapeuticClassId: ID
  strength: string
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'inhaler' | 'cream' | 'drops' | 'other'
  unitPrice: number // BDT
  isActive: boolean
  launchDate: string
}

// ── Medical ──────────────────────────────────────────────

export interface Disease extends BaseEntity {
  name: string
  icdCode: string
  therapeuticClassId: ID
  description: string
  prevalenceLevel: 'low' | 'medium' | 'high'
}

export interface Diagnosis extends BaseEntity {
  diseaseId: ID
  diseaseName: string
  icdCode: string
  notes?: string
}

// ── Healthcare Providers ─────────────────────────────────

export interface Specialty extends BaseEntity {
  name: string
  code: string
  description: string
}

export interface Hospital extends BaseEntity {
  name: string
  type: 'government' | 'private' | 'clinic'
  districtId: ID
  territoryId: ID
  bedCount?: number
}

export interface Chamber extends BaseEntity {
  name: string
  address: string
  districtId: ID
  territoryId: ID
  doctorId: ID
  schedule: string // e.g. "Sat-Thu, 5PM-8PM"
}

export interface Doctor extends BaseEntity {
  doctorId: ID // same as id, aliased for clarity
  name: string
  degree: string
  specialtyId: ID
  territoryId: ID
  districtId: ID
  hospitalAffiliations: ID[]
  chamberIds: ID[]
  prescriptionCount: number
  tier: 'A' | 'B' | 'C' // engagement tier
  isActive: boolean
}

// ── Patient ──────────────────────────────────────────────
// Patient records are completely anonymized.
// No real names, phone numbers, national IDs, or addresses.

export interface Patient extends BaseEntity {
  patientId: ID // format: PAT-000001
  ageGroup: '<18' | '18-35' | '36-55' | '56-70' | '70+'
  gender: 'M' | 'F' | 'unknown'
  // No personally identifiable information
}

// ── Prescription ─────────────────────────────────────────

export type PrescriptionType = 'NEW' | 'REPEAT' | 'SWITCH'

export interface PrescriptionItem extends BaseEntity, TimeDimension {
  prescriptionId: ID
  brandId: ID
  brandName: string
  moleculeId: ID
  moleculeName: string
  quantity: number
  durationDays: number
  dosage: string
  notes?: string
}

export interface Prescription extends BaseEntity, TimeDimension {
  prescriptionId: ID // same as id
  doctorId: ID
  patientId: ID
  territoryId: ID
  districtId: ID
  diagnosisIds: ID[]
  prescriptionType: PrescriptionType
  items: PrescriptionItem[]
  totalItems: number
  previousBrandId?: ID // for SWITCH type
}

// ── Competitor ───────────────────────────────────────────

export interface Competitor extends BaseEntity {
  name: string
  shortName: string
  country: string
  type: 'local' | 'multinational'
  trackedBrands: ID[]
}

// ── Market & Sales ───────────────────────────────────────

export interface SalesRecord extends BaseEntity, TimeDimension {
  brandId: ID
  territoryId: ID
  companyId: ID
  units: number
  revenue: number // BDT
}

export interface MarketRecord extends BaseEntity, TimeDimension {
  therapeuticClassId: ID
  totalPrescriptions: number
  totalRevenue: number
  marketShareByBrand: Record<ID, number> // brandId → percentage
  marketShareByCompany: Record<ID, number> // companyId → percentage
}

// ── Intelligence ─────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AlertCategory =
  | 'market_share'
  | 'brand_decline'
  | 'territory_gap'
  | 'competitor_move'
  | 'anomaly'
  | 'opportunity'

export interface Alert extends BaseEntity, TimeDimension {
  title: string
  description: string
  severity: AlertSeverity
  category: AlertCategory
  isRead: boolean
  entityType?: 'brand' | 'territory' | 'doctor' | 'competitor'
  entityId?: ID
  actionable: boolean
}

export interface Insight extends BaseEntity, TimeDimension {
  title: string
  summary: string
  body: string
  insightType: 'descriptive' | 'diagnostic' | 'predictive' | 'prescriptive'
  confidence: number // 0-100
  tags: string[]
  relatedEntityIds: ID[]
  isAiGenerated: boolean
  isFlagged: boolean
}

export interface Opportunity extends BaseEntity, TimeDimension {
  title: string
  description: string
  opportunityType: 'white_space' | 'growth' | 'new_doctor' | 'competitor_switch' | 'seasonal'
  potentialRevenue: number
  territoryId?: ID
  brandId?: ID
  doctorId?: ID
  confidence: number // 0-100
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'closed'
}

// ── Forecasting ──────────────────────────────────────────

export type ForecastLabel = 'SIMULATED FORECAST'

export interface Forecast extends BaseEntity {
  forecastLabel: ForecastLabel
  entityType: 'brand' | 'molecule' | 'territory' | 'prescription'
  entityId: ID
  entityName: string
  horizon: 'monthly' | 'quarterly' | 'yearly'
  predictions: ForecastPoint[]
  confidence: number
  methodology: string
  generatedAt: string
}

export interface ForecastPoint {
  date: string
  month: number
  quarter: 1 | 2 | 3 | 4
  year: number
  predictedValue: number
  lowerBound: number
  upperBound: number
}

// ── Campaign ─────────────────────────────────────────────

export interface Campaign extends BaseEntity, TimeDimension {
  name: string
  type: 'detailing' | 'cme' | 'sample' | 'event'
  targetBrandId: ID
  targetTerritoryIds: ID[]
  targetDoctorIds: ID[]
  startDate: string
  endDate: string
  budget: number
  status: 'planned' | 'active' | 'completed'
}

// ── Filter State ─────────────────────────────────────────

export interface DateRange {
  startDate: string
  endDate: string
}

export interface AnalyticsFilters {
  dateRange: DateRange | null
  division: string | null
  district: ID | null
  upazila: ID | null
  territory: ID | null
  specialty: ID | null
  doctor: ID | null
  disease: ID | null
  therapeuticClass: ID | null
  molecule: ID | null
  brand: ID | null
  company: ID | null
}

// ── Analytics Results ────────────────────────────────────

export interface GrowthResult {
  current: number
  previous: number
  growth: number // percentage
  growthDirection: 'up' | 'down' | 'flat'
}

export interface ShareResult {
  entityId: ID
  entityName: string
  value: number
  share: number // percentage
  rank: number
}

export interface DistributionResult {
  label: string
  count: number
  percentage: number
}

export interface TimeSeriesPoint {
  date: string
  month: number
  quarter: 1 | 2 | 3 | 4
  year: number
  label: string
  value: number
}
