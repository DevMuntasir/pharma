// ─────────────────────────────────────────────────────────
// GEO DATA: Territory & Division Coordinates
// Approximate lat/lng for map visualization (demo purposes).
// Geographic names match real Bangladesh administrative areas.
// ─────────────────────────────────────────────────────────

export interface TerritoryCoord {
  id: string
  name: string
  division: string
  lat: number
  lng: number
}

export interface DivisionCoord {
  name: string
  lat: number
  lng: number
  color: string
}

// Approximate center coordinates for each of the 22 territories
export const TERRITORY_COORDS: Record<string, { lat: number; lng: number }> = {
  'TER-001': { lat: 23.72,  lng: 90.40 }, // Dhaka Central
  'TER-002': { lat: 23.99,  lng: 90.42 }, // Dhaka North
  'TER-003': { lat: 23.52,  lng: 90.43 }, // Dhaka South
  'TER-004': { lat: 22.36,  lng: 91.84 }, // Chittagong Metro
  'TER-005': { lat: 22.92,  lng: 91.55 }, // Chittagong North
  'TER-006': { lat: 24.89,  lng: 91.87 }, // Sylhet Metro
  'TER-007': { lat: 24.37,  lng: 88.61 }, // Rajshahi Metro
  'TER-008': { lat: 22.85,  lng: 89.54 }, // Khulna Metro
  'TER-009': { lat: 22.70,  lng: 90.36 }, // Barisal Metro
  'TER-010': { lat: 24.75,  lng: 90.42 }, // Mymensingh Metro
  'TER-011': { lat: 25.74,  lng: 89.28 }, // Rangpur Metro
  'TER-012': { lat: 23.46,  lng: 91.18 }, // Comilla Zone
  'TER-013': { lat: 24.00,  lng: 90.43 }, // Gazipur Zone
  'TER-014': { lat: 23.62,  lng: 90.50 }, // Narayanganj Zone
  'TER-015': { lat: 21.44,  lng: 92.01 }, // Cox's Bazar Zone
  'TER-016': { lat: 23.17,  lng: 89.21 }, // Jessore Zone
  'TER-017': { lat: 24.85,  lng: 89.37 }, // Bogra Zone
  'TER-018': { lat: 24.25,  lng: 89.92 }, // Tangail Zone
  'TER-019': { lat: 23.60,  lng: 89.84 }, // Faridpur Zone
  'TER-020': { lat: 22.87,  lng: 91.10 }, // Noakhali Zone
  'TER-021': { lat: 23.92,  lng: 90.72 }, // Narsingdi Zone
  'TER-022': { lat: 24.00,  lng: 89.02 }, // Pabna Zone
}

// 8 Bangladesh division centers with accent colors
export const DIVISION_CENTERS: DivisionCoord[] = [
  { name: 'Dhaka',      lat: 23.81,  lng: 90.41,  color: '#6366f1' },
  { name: 'Chittagong', lat: 22.36,  lng: 91.78,  color: '#0ea5e9' },
  { name: 'Rajshahi',   lat: 24.37,  lng: 88.60,  color: '#10b981' },
  { name: 'Khulna',     lat: 22.85,  lng: 89.54,  color: '#f59e0b' },
  { name: 'Barisal',    lat: 22.70,  lng: 90.35,  color: '#ec4899' },
  { name: 'Sylhet',     lat: 24.89,  lng: 91.87,  color: '#8b5cf6' },
  { name: 'Rangpur',    lat: 25.74,  lng: 89.28,  color: '#14b8a6' },
  { name: 'Mymensingh', lat: 24.75,  lng: 90.42,  color: '#f97316' },
]

// Map center and default zoom for Bangladesh
export const BANGLADESH_CENTER: [number, number] = [23.68, 90.35]
export const BANGLADESH_ZOOM = 7
