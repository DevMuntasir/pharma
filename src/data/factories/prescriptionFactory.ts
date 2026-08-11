// ─────────────────────────────────────────────────────────
// MOCK DATA FACTORY: Prescription Generator
// Produces 500+ deterministic prescriptions with 1000+ items.
// Patient data is fully anonymized — no personal information.
// ─────────────────────────────────────────────────────────

import type { Prescription, PrescriptionItem, PrescriptionType, TimeDimension } from '@/types'

// ── Deterministic seeded pseudo-random ──────────────────
// Uses a simple LCG (linear congruential generator) for reproducibility.
// NOT for cryptographic use. Only for deterministic mock data generation.

class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff
    return (this.seed >>> 0) / 0xffffffff
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)]
  }
}

// ── Time dimension helpers ───────────────────────────────

function getTimeDimension(dateStr: string): TimeDimension {
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  const quarter = Math.ceil(month / 3) as 1 | 2 | 3 | 4
  return {
    date: dateStr,
    month,
    quarter,
    year: d.getFullYear(),
  }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

// ── Seed parameters ──────────────────────────────────────

const START_DATE = '2023-01-01'
const TOTAL_DAYS = 730 // ~2 years

// Doctor → brand affinity map (which brands each doctor prefers)
// Index = doctorIndex (0-49), values are preferred brandIds
const DOCTOR_BRAND_AFFINITY: Record<string, string[]> = {
  'DOC-001': ['BRAND-001', 'BRAND-002', 'BRAND-003', 'BRAND-048'],  // Cardiologist
  'DOC-002': ['BRAND-005', 'BRAND-006', 'BRAND-014', 'BRAND-015'],  // Diabetologist
  'DOC-003': ['BRAND-022', 'BRAND-037', 'BRAND-038', 'BRAND-007'],  // GP
  'DOC-004': ['BRAND-012', 'BRAND-013', 'BRAND-016', 'BRAND-017'],  // Internal Med
  'DOC-005': ['BRAND-018', 'BRAND-019', 'BRAND-020', 'BRAND-033'],  // Pulmonologist
  'DOC-006': ['BRAND-022', 'BRAND-037', 'BRAND-034', 'BRAND-010'],  // GP
  'DOC-007': ['BRAND-031', 'BRAND-032', 'BRAND-016', 'BRAND-017'],  // Gastroenterologist
  'DOC-008': ['BRAND-005', 'BRAND-006', 'BRAND-049', 'BRAND-051'],  // Diabetologist
  'DOC-009': ['BRAND-021', 'BRAND-041', 'BRAND-042', 'BRAND-037'],  // Orthopedic
  'DOC-010': ['BRAND-022', 'BRAND-007', 'BRAND-010', 'BRAND-011'],  // GP
  'DOC-011': ['BRAND-001', 'BRAND-002', 'BRAND-043', 'BRAND-044'],  // Cardiologist
  'DOC-012': ['BRAND-035', 'BRAND-036', 'BRAND-005', 'BRAND-006'],  // Gynecologist
  'DOC-013': ['BRAND-022', 'BRAND-037', 'BRAND-007', 'BRAND-010'],  // GP
  'DOC-014': ['BRAND-053', 'BRAND-023', 'BRAND-021', 'BRAND-033'],  // Dermatologist
  'DOC-015': ['BRAND-012', 'BRAND-016', 'BRAND-005', 'BRAND-006'],  // Internal Med
  'DOC-016': ['BRAND-022', 'BRAND-007', 'BRAND-034', 'BRAND-033'],  // GP
  'DOC-017': ['BRAND-039', 'BRAND-040', 'BRAND-045', 'BRAND-046'],  // Neurologist
  'DOC-018': ['BRAND-005', 'BRAND-014', 'BRAND-028', 'BRAND-029'],  // Diabetologist
  'DOC-019': ['BRAND-022', 'BRAND-037', 'BRAND-010', 'BRAND-034'],  // GP
  'DOC-020': ['BRAND-022', 'BRAND-037', 'BRAND-038', 'BRAND-007'],  // Pediatrician
  'DOC-021': ['BRAND-008', 'BRAND-009', 'BRAND-001', 'BRAND-052'],  // Cardiologist
  'DOC-022': ['BRAND-022', 'BRAND-037', 'BRAND-010', 'BRAND-034'],  // GP
  'DOC-023': ['BRAND-039', 'BRAND-040', 'BRAND-016', 'BRAND-017'],  // Psychiatrist
  'DOC-024': ['BRAND-031', 'BRAND-032', 'BRAND-016', 'BRAND-012'],  // Gastroenterologist
  'DOC-025': ['BRAND-022', 'BRAND-007', 'BRAND-034', 'BRAND-010'],  // GP
  'DOC-026': ['BRAND-014', 'BRAND-015', 'BRAND-028', 'BRAND-029'],  // Diabetologist
  'DOC-027': ['BRAND-012', 'BRAND-013', 'BRAND-005', 'BRAND-049'],  // Internal Med
  'DOC-028': ['BRAND-022', 'BRAND-037', 'BRAND-007', 'BRAND-033'],  // GP
  'DOC-029': ['BRAND-018', 'BRAND-019', 'BRAND-020', 'BRAND-033'],  // Pulmonologist
  'DOC-030': ['BRAND-053', 'BRAND-023', 'BRAND-015', 'BRAND-021'],  // Dermatologist
  'DOC-031': ['BRAND-022', 'BRAND-037', 'BRAND-010', 'BRAND-011'],  // GP
  'DOC-032': ['BRAND-035', 'BRAND-036', 'BRAND-014', 'BRAND-005'],  // Gynecologist
  'DOC-033': ['BRAND-001', 'BRAND-002', 'BRAND-003', 'BRAND-043'],  // Cardiologist
  'DOC-034': ['BRAND-022', 'BRAND-037', 'BRAND-034', 'BRAND-007'],  // GP
  'DOC-035': ['BRAND-045', 'BRAND-046', 'BRAND-041', 'BRAND-042'],  // Neurologist
  'DOC-036': ['BRAND-005', 'BRAND-006', 'BRAND-051', 'BRAND-054'],  // Diabetologist
  'DOC-037': ['BRAND-022', 'BRAND-037', 'BRAND-010', 'BRAND-011'],  // GP
  'DOC-038': ['BRAND-021', 'BRAND-009', 'BRAND-041', 'BRAND-046'],  // Orthopedic
  'DOC-039': ['BRAND-012', 'BRAND-013', 'BRAND-005', 'BRAND-006'],  // Internal Med
  'DOC-040': ['BRAND-022', 'BRAND-037', 'BRAND-007', 'BRAND-034'],  // GP
  'DOC-041': ['BRAND-031', 'BRAND-032', 'BRAND-016', 'BRAND-017'],  // Gastroenterologist
  'DOC-042': ['BRAND-022', 'BRAND-038', 'BRAND-033', 'BRAND-011'],  // Pediatrician
  'DOC-043': ['BRAND-022', 'BRAND-037', 'BRAND-010', 'BRAND-034'],  // GP
  'DOC-044': ['BRAND-039', 'BRAND-040', 'BRAND-023', 'BRAND-016'],  // Psychiatrist
  'DOC-045': ['BRAND-003', 'BRAND-004', 'BRAND-001', 'BRAND-048'],  // Cardiologist
  'DOC-046': ['BRAND-022', 'BRAND-007', 'BRAND-034', 'BRAND-010'],  // GP
  'DOC-047': ['BRAND-005', 'BRAND-006', 'BRAND-012', 'BRAND-013'],  // Internal Med
  'DOC-048': ['BRAND-014', 'BRAND-015', 'BRAND-051', 'BRAND-054'],  // Diabetologist
  'DOC-049': ['BRAND-022', 'BRAND-037', 'BRAND-007', 'BRAND-010'],  // GP
  'DOC-050': ['BRAND-018', 'BRAND-019', 'BRAND-033', 'BRAND-020'],  // Pulmonologist
}

// Brand → molecule map for quick lookup
const BRAND_MOLECULE: Record<string, string> = {
  'BRAND-001': 'MOL-001', 'BRAND-002': 'MOL-001', 'BRAND-003': 'MOL-002', 'BRAND-004': 'MOL-002',
  'BRAND-005': 'MOL-003', 'BRAND-006': 'MOL-003', 'BRAND-007': 'MOL-005', 'BRAND-008': 'MOL-013',
  'BRAND-009': 'MOL-013', 'BRAND-010': 'MOL-006', 'BRAND-011': 'MOL-006', 'BRAND-012': 'MOL-010',
  'BRAND-013': 'MOL-010', 'BRAND-014': 'MOL-004', 'BRAND-015': 'MOL-004', 'BRAND-016': 'MOL-026',
  'BRAND-017': 'MOL-026', 'BRAND-018': 'MOL-007', 'BRAND-019': 'MOL-008', 'BRAND-020': 'MOL-008',
  'BRAND-021': 'MOL-011', 'BRAND-022': 'MOL-012', 'BRAND-023': 'MOL-017', 'BRAND-024': 'MOL-022',
  'BRAND-025': 'MOL-022', 'BRAND-026': 'MOL-025', 'BRAND-027': 'MOL-025', 'BRAND-028': 'MOL-023',
  'BRAND-029': 'MOL-023', 'BRAND-030': 'MOL-020', 'BRAND-031': 'MOL-009', 'BRAND-032': 'MOL-009',
  'BRAND-033': 'MOL-024', 'BRAND-034': 'MOL-018', 'BRAND-035': 'MOL-019', 'BRAND-036': 'MOL-019',
  'BRAND-037': 'MOL-012', 'BRAND-038': 'MOL-012', 'BRAND-039': 'MOL-016', 'BRAND-040': 'MOL-016',
  'BRAND-041': 'MOL-021', 'BRAND-042': 'MOL-021', 'BRAND-043': 'MOL-002', 'BRAND-044': 'MOL-014',
  'BRAND-045': 'MOL-027', 'BRAND-046': 'MOL-027', 'BRAND-047': 'MOL-028', 'BRAND-048': 'MOL-002',
  'BRAND-049': 'MOL-003', 'BRAND-050': 'MOL-004', 'BRAND-051': 'MOL-023', 'BRAND-052': 'MOL-001',
  'BRAND-053': 'MOL-015', 'BRAND-054': 'MOL-020', 'BRAND-055': 'MOL-013',
}

const BRAND_NAMES: Record<string, string> = {
  'BRAND-001': 'NovaCor 5', 'BRAND-002': 'NovaCor 10', 'BRAND-003': 'NovaLip 10', 'BRAND-004': 'NovaLip 20',
  'BRAND-005': 'NovaMet 500', 'BRAND-006': 'NovaMet 850', 'BRAND-007': 'NovaZith 250',
  'BRAND-008': 'Axilosartan 50', 'BRAND-009': 'Axilosartan 100', 'BRAND-010': 'AxiMox 500',
  'BRAND-011': 'AxiMox 250 Syrup', 'BRAND-012': 'AxiEso 20', 'BRAND-013': 'AxiEso 40',
  'BRAND-014': 'AxiGlim 1', 'BRAND-015': 'AxiGlim 2', 'BRAND-016': 'ZenPan 40', 'BRAND-017': 'ZenPan 20',
  'BRAND-018': 'ZenSal Inhaler', 'BRAND-019': 'ZenMont 10', 'BRAND-020': 'ZenMont 5',
  'BRAND-021': 'ZenDic 75', 'BRAND-022': 'ZenPara 500', 'BRAND-023': 'ZenFlu 150',
  'BRAND-024': 'ApexRosu 10', 'BRAND-025': 'ApexRosu 20', 'BRAND-026': 'ApexCip 500',
  'BRAND-027': 'ApexCip 250', 'BRAND-028': 'ApexSita 100', 'BRAND-029': 'ApexSita 50',
  'BRAND-030': 'ApexVit D3', 'BRAND-031': 'CoreOme 20', 'BRAND-032': 'CoreOme 40',
  'BRAND-033': 'CoreCeti 10', 'BRAND-034': 'CoreMetro 400', 'BRAND-035': 'CoreThyro 50',
  'BRAND-036': 'CoreThyro 100', 'BRAND-037': 'PrimePara 650', 'BRAND-038': 'PrimePara Syrup',
  'BRAND-039': 'PrimeClona 0.5', 'BRAND-040': 'PrimeClona 1', 'BRAND-041': 'PrimePrega 75',
  'BRAND-042': 'PrimePrega 150', 'BRAND-043': 'OrionAtor 40', 'BRAND-044': 'OrionVals 160',
  'BRAND-045': 'OrionGab 300', 'BRAND-046': 'OrionGab 100', 'BRAND-047': 'OrionLis 10',
  'BRAND-048': 'OrionAtor 40', 'BRAND-049': 'CuraMet 1000', 'BRAND-050': 'CuraGlim 3',
  'BRAND-051': 'CuraSita 100', 'BRAND-052': 'CuraCor 5', 'BRAND-053': 'CuraClobet Cream',
  'BRAND-054': 'CuraVitD 1000', 'BRAND-055': 'CuraLos 25',
}

const MOL_NAMES: Record<string, string> = {
  'MOL-001': 'Amlodipine', 'MOL-002': 'Atorvastatin', 'MOL-003': 'Metformin', 'MOL-004': 'Glimepiride',
  'MOL-005': 'Azithromycin', 'MOL-006': 'Amoxicillin', 'MOL-007': 'Salbutamol', 'MOL-008': 'Montelukast',
  'MOL-009': 'Omeprazole', 'MOL-010': 'Esomeprazole', 'MOL-011': 'Diclofenac', 'MOL-012': 'Paracetamol',
  'MOL-013': 'Losartan', 'MOL-014': 'Valsartan', 'MOL-015': 'Clobetasol', 'MOL-016': 'Clonazepam',
  'MOL-017': 'Fluconazole', 'MOL-018': 'Metronidazole', 'MOL-019': 'Levothyroxine', 'MOL-020': 'Vitamin D3',
  'MOL-021': 'Pregabalin', 'MOL-022': 'Rosuvastatin', 'MOL-023': 'Sitagliptin', 'MOL-024': 'Cetirizine',
  'MOL-025': 'Ciprofloxacin', 'MOL-026': 'Pantoprazole', 'MOL-027': 'Gabapentin', 'MOL-028': 'Lisinopril',
}

const DOCTOR_TERRITORY: Record<string, string> = {
  'DOC-001': 'TER-001', 'DOC-002': 'TER-001', 'DOC-003': 'TER-001', 'DOC-004': 'TER-001',
  'DOC-005': 'TER-002', 'DOC-006': 'TER-002', 'DOC-007': 'TER-002', 'DOC-008': 'TER-003',
  'DOC-009': 'TER-003', 'DOC-010': 'TER-003', 'DOC-011': 'TER-004', 'DOC-012': 'TER-004',
  'DOC-013': 'TER-004', 'DOC-014': 'TER-005', 'DOC-015': 'TER-006', 'DOC-016': 'TER-006',
  'DOC-017': 'TER-006', 'DOC-018': 'TER-007', 'DOC-019': 'TER-007', 'DOC-020': 'TER-007',
  'DOC-021': 'TER-008', 'DOC-022': 'TER-008', 'DOC-023': 'TER-008', 'DOC-024': 'TER-009',
  'DOC-025': 'TER-009', 'DOC-026': 'TER-010', 'DOC-027': 'TER-010', 'DOC-028': 'TER-011',
  'DOC-029': 'TER-011', 'DOC-030': 'TER-012', 'DOC-031': 'TER-012', 'DOC-032': 'TER-013',
  'DOC-033': 'TER-013', 'DOC-034': 'TER-014', 'DOC-035': 'TER-014', 'DOC-036': 'TER-015',
  'DOC-037': 'TER-016', 'DOC-038': 'TER-016', 'DOC-039': 'TER-017', 'DOC-040': 'TER-017',
  'DOC-041': 'TER-018', 'DOC-042': 'TER-018', 'DOC-043': 'TER-019', 'DOC-044': 'TER-019',
  'DOC-045': 'TER-020', 'DOC-046': 'TER-020', 'DOC-047': 'TER-021', 'DOC-048': 'TER-021',
  'DOC-049': 'TER-022', 'DOC-050': 'TER-022',
}

const DOCTOR_DISTRICT: Record<string, string> = {
  'DOC-001': 'DIST-001', 'DOC-002': 'DIST-001', 'DOC-003': 'DIST-001', 'DOC-004': 'DIST-002',
  'DOC-005': 'DIST-003', 'DOC-006': 'DIST-003', 'DOC-007': 'DIST-004', 'DOC-008': 'DIST-005',
  'DOC-009': 'DIST-005', 'DOC-010': 'DIST-006', 'DOC-011': 'DIST-007', 'DOC-012': 'DIST-007',
  'DOC-013': 'DIST-008', 'DOC-014': 'DIST-009', 'DOC-015': 'DIST-010', 'DOC-016': 'DIST-010',
  'DOC-017': 'DIST-011', 'DOC-018': 'DIST-012', 'DOC-019': 'DIST-012', 'DOC-020': 'DIST-013',
  'DOC-021': 'DIST-014', 'DOC-022': 'DIST-014', 'DOC-023': 'DIST-015', 'DOC-024': 'DIST-016',
  'DOC-025': 'DIST-016', 'DOC-026': 'DIST-018', 'DOC-027': 'DIST-018', 'DOC-028': 'DIST-020',
  'DOC-029': 'DIST-020', 'DOC-030': 'DIST-022', 'DOC-031': 'DIST-022', 'DOC-032': 'DIST-024',
  'DOC-033': 'DIST-025', 'DOC-034': 'DIST-026', 'DOC-035': 'DIST-026', 'DOC-036': 'DIST-027',
  'DOC-037': 'DIST-028', 'DOC-038': 'DIST-028', 'DOC-039': 'DIST-030', 'DOC-040': 'DIST-030',
  'DOC-041': 'DIST-032', 'DOC-042': 'DIST-032', 'DOC-043': 'DIST-033', 'DOC-044': 'DIST-033',
  'DOC-045': 'DIST-034', 'DOC-046': 'DIST-034', 'DOC-047': 'DIST-035', 'DOC-048': 'DIST-035',
  'DOC-049': 'DIST-036', 'DOC-050': 'DIST-036',
}

const PRESCRIPTION_TYPES: PrescriptionType[] = ['NEW', 'REPEAT', 'REPEAT', 'REPEAT', 'SWITCH'] // weighted distribution
const DOSAGES = ['Once daily', 'Twice daily', 'Three times daily', 'At bedtime', 'As needed', 'With meals']

// ── Generator ─────────────────────────────────────────────

function generatePrescriptions(): { prescriptions: Prescription[]; prescriptionItems: PrescriptionItem[] } {
  const rng = new SeededRandom(42) // deterministic seed
  const prescriptions: Prescription[] = []
  const prescriptionItems: PrescriptionItem[] = []

  const doctorIds = Object.keys(DOCTOR_BRAND_AFFINITY)
  let itemCounter = 1

  // Generate ~10-12 prescriptions per doctor spread over 2 years
  doctorIds.forEach((doctorId, dIdx) => {
    const docBrands = DOCTOR_BRAND_AFFINITY[doctorId]
    const rxCount = rng.nextInt(10, 14)
    const territory = DOCTOR_TERRITORY[doctorId]
    const district = DOCTOR_DISTRICT[doctorId]

    for (let i = 0; i < rxCount; i++) {
      const dayOffset = rng.nextInt(0, TOTAL_DAYS - 1)
      const dateStr = addDays(START_DATE, dayOffset)
      const timeDim = getTimeDimension(dateStr)
      const rxIndex = dIdx * 15 + i + 1
      const prescriptionId = `RX-${String(rxIndex).padStart(6, '0')}`
      const patientId = `PAT-${String(rng.nextInt(1, 5000)).padStart(6, '0')}` // anonymous ID only
      const prescriptionType: PrescriptionType = rng.pick(PRESCRIPTION_TYPES)
      const itemCount = rng.nextInt(1, 4)
      const items: PrescriptionItem[] = []
      const diagnosisIds = [`DIS-${String(rng.nextInt(1, 17)).padStart(3, '0')}`]


      for (let j = 0; j < itemCount; j++) {
        const brandId = rng.pick(docBrands)
        const moleculeId = BRAND_MOLECULE[brandId] ?? 'MOL-001'
        const itemId = `RXI-${String(itemCounter).padStart(7, '0')}`
        itemCounter++

        const item: PrescriptionItem = {
          id: itemId,
          prescriptionId,
          brandId,
          brandName: BRAND_NAMES[brandId] ?? brandId,
          moleculeId,
          moleculeName: MOL_NAMES[moleculeId] ?? moleculeId,
          quantity: rng.nextInt(1, 3),
          durationDays: rng.pick([7, 10, 14, 28, 30, 60, 90]),
          dosage: rng.pick(DOSAGES),
          createdAt: dateStr,
          ...timeDim,
        }
        items.push(item)
        prescriptionItems.push(item)
      }

      const prescription: Prescription = {
        id: prescriptionId,
        prescriptionId,
        doctorId,
        patientId,
        territoryId: territory,
        districtId: district,
        diagnosisIds,
        prescriptionType,
        items,
        totalItems: items.length,
        previousBrandId: prescriptionType === 'SWITCH' ? rng.pick(docBrands) : undefined,
        createdAt: dateStr,
        ...timeDim,
      }

      prescriptions.push(prescription)
    }
  })

  // Sort by date for natural ordering
  prescriptions.sort((a, b) => a.date.localeCompare(b.date))
  prescriptionItems.sort((a, b) => a.date.localeCompare(b.date))

  return { prescriptions, prescriptionItems }
}

// ── Export ───────────────────────────────────────────────
// Generated once at module load time (lazy initialization pattern)
let _cached: ReturnType<typeof generatePrescriptions> | null = null

function getPrescriptionData() {
  if (!_cached) {
    _cached = generatePrescriptions()
  }
  return _cached
}

export const prescriptions: Prescription[] = (() => getPrescriptionData().prescriptions)()
export const prescriptionItems: PrescriptionItem[] = (() => getPrescriptionData().prescriptionItems)()
