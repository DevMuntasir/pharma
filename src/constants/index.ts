// ─────────────────────────────────────────────────────────
// CONSTANTS: Application-wide constants
// ─────────────────────────────────────────────────────────

export const APP_NAME = 'Pharma Intelligence OS'
export const APP_TAGLINE = 'From Prescription Data to Predictive Pharma Intelligence'
export const APP_VERSION = '0.1.0' // Milestone 1 — Bootstrap
export const DEMO_MODE = true
export const DEMO_DISCLAIMER = 'All data shown in this prototype is fictional and intended for product demonstration only.'

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Mymensingh',
  'Rangpur',
] as const

export type BangladeshDivision = typeof BANGLADESH_DIVISIONS[number]

export const PRESCRIPTION_TYPES = ['NEW', 'REPEAT', 'SWITCH'] as const

export const DOCTOR_TIERS = ['A', 'B', 'C'] as const

export const FORECAST_DISCLAIMER = 'SIMULATED FORECAST — For demonstration purposes only. Not based on real market data.'

export const CHART_DEFAULT_HEIGHT = 280
export const TABLE_DEFAULT_PAGE_SIZE = 20
