// ─────────────────────────────────────────────────────────
// DATA INTEGRITY CHECKER
// Development-only utility. Not included in production builds.
// Validates referential integrity of mock data relationships.
// ─────────────────────────────────────────────────────────

import { companies, therapeuticClasses, molecules, diseases, brands, specialties, territories, districts, upazilas, doctors, prescriptions, prescriptionItems } from '../index'
import type { ID } from '@/types'

interface IntegrityIssue {
  severity: 'ERROR' | 'WARNING'
  entity: string
  entityId: ID
  issue: string
}

interface IntegrityReport {
  passed: boolean
  totalEntities: number
  totalIssues: number
  errors: number
  warnings: number
  issues: IntegrityIssue[]
  entityCounts: Record<string, number>
  patientPrivacyCheck: { passed: boolean; message: string }
}

function buildIdSet(arr: { id: ID }[]): Set<ID> {
  return new Set(arr.map((e) => e.id))
}

function checkDuplicateIds(arr: { id: ID }[], entityName: string): IntegrityIssue[] {
  const seen = new Map<ID, number>()
  const issues: IntegrityIssue[] = []
  arr.forEach(({ id }) => {
    seen.set(id, (seen.get(id) ?? 0) + 1)
  })
  seen.forEach((count, id) => {
    if (count > 1) {
      issues.push({ severity: 'ERROR', entity: entityName, entityId: id, issue: `Duplicate ID found (appears ${count} times)` })
    }
  })
  return issues
}

export function runIntegrityCheck(): IntegrityReport {
  const issues: IntegrityIssue[] = []

  // Build ID sets for reference checking
  const companyIds = buildIdSet(companies)
  const tcIds = buildIdSet(therapeuticClasses)
  const molIds = buildIdSet(molecules)
  const brandIds = buildIdSet(brands)
  const specialtyIds = buildIdSet(specialties)
  const territoryIds = buildIdSet(territories)
  const districtIds = buildIdSet(districts)
  const upazilaIds = buildIdSet(upazilas)
  const doctorIds = buildIdSet(doctors)
  const prescriptionIds = buildIdSet(prescriptions)

  // ── 1. Duplicate ID checks ─────────────────────────────
  issues.push(...checkDuplicateIds(companies, 'Company'))
  issues.push(...checkDuplicateIds(therapeuticClasses, 'TherapeuticClass'))
  issues.push(...checkDuplicateIds(molecules, 'Molecule'))
  issues.push(...checkDuplicateIds(brands, 'Brand'))
  issues.push(...checkDuplicateIds(diseases, 'Disease'))
  issues.push(...checkDuplicateIds(specialties, 'Specialty'))
  issues.push(...checkDuplicateIds(territories, 'Territory'))
  issues.push(...checkDuplicateIds(districts, 'District'))
  issues.push(...checkDuplicateIds(upazilas, 'Upazila'))
  issues.push(...checkDuplicateIds(doctors, 'Doctor'))
  issues.push(...checkDuplicateIds(prescriptions, 'Prescription'))
  issues.push(...checkDuplicateIds(prescriptionItems, 'PrescriptionItem'))

  // ── 2. Molecule → TherapeuticClass references ──────────
  molecules.forEach((mol) => {
    if (!tcIds.has(mol.therapeuticClassId)) {
      issues.push({ severity: 'ERROR', entity: 'Molecule', entityId: mol.id, issue: `therapeuticClassId "${mol.therapeuticClassId}" not found` })
    }
  })

  // ── 3. Brand → Molecule and Company and TC references ──
  brands.forEach((brand) => {
    if (!molIds.has(brand.moleculeId)) {
      issues.push({ severity: 'ERROR', entity: 'Brand', entityId: brand.id, issue: `moleculeId "${brand.moleculeId}" not found` })
    }
    if (!companyIds.has(brand.companyId)) {
      issues.push({ severity: 'ERROR', entity: 'Brand', entityId: brand.id, issue: `companyId "${brand.companyId}" not found` })
    }
    if (!tcIds.has(brand.therapeuticClassId)) {
      issues.push({ severity: 'ERROR', entity: 'Brand', entityId: brand.id, issue: `therapeuticClassId "${brand.therapeuticClassId}" not found` })
    }
  })

  // ── 4. Doctor → Specialty, Territory, District ─────────
  doctors.forEach((doc) => {
    if (!specialtyIds.has(doc.specialtyId)) {
      issues.push({ severity: 'ERROR', entity: 'Doctor', entityId: doc.id, issue: `specialtyId "${doc.specialtyId}" not found` })
    }
    if (!territoryIds.has(doc.territoryId)) {
      issues.push({ severity: 'ERROR', entity: 'Doctor', entityId: doc.id, issue: `territoryId "${doc.territoryId}" not found` })
    }
    if (!districtIds.has(doc.districtId)) {
      issues.push({ severity: 'ERROR', entity: 'Doctor', entityId: doc.id, issue: `districtId "${doc.districtId}" not found` })
    }
  })

  // ── 5. District → Territory, Upazila ──────────────────
  districts.forEach((dist) => {
    if (!territoryIds.has(dist.territoryId)) {
      issues.push({ severity: 'ERROR', entity: 'District', entityId: dist.id, issue: `territoryId "${dist.territoryId}" not found` })
    }
    dist.upazilas.forEach((uzId) => {
      if (!upazilaIds.has(uzId)) {
        issues.push({ severity: 'WARNING', entity: 'District', entityId: dist.id, issue: `upazilaId "${uzId}" not found in upazila list` })
      }
    })
  })

  // ── 6. Upazila → District ─────────────────────────────
  upazilas.forEach((uz) => {
    if (!districtIds.has(uz.districtId)) {
      issues.push({ severity: 'ERROR', entity: 'Upazila', entityId: uz.id, issue: `districtId "${uz.districtId}" not found` })
    }
  })

  // ── 7. Prescription → Doctor references ───────────────
  prescriptions.forEach((rx) => {
    if (!doctorIds.has(rx.doctorId)) {
      issues.push({ severity: 'ERROR', entity: 'Prescription', entityId: rx.id, issue: `doctorId "${rx.doctorId}" not found` })
    }
    if (!territoryIds.has(rx.territoryId)) {
      issues.push({ severity: 'ERROR', entity: 'Prescription', entityId: rx.id, issue: `territoryId "${rx.territoryId}" not found` })
    }
  })

  // ── 8. PrescriptionItem → Prescription + Brand ────────
  prescriptionItems.forEach((item) => {
    if (!prescriptionIds.has(item.prescriptionId)) {
      issues.push({ severity: 'ERROR', entity: 'PrescriptionItem', entityId: item.id, issue: `prescriptionId "${item.prescriptionId}" not found` })
    }
    if (!brandIds.has(item.brandId)) {
      issues.push({ severity: 'ERROR', entity: 'PrescriptionItem', entityId: item.id, issue: `brandId "${item.brandId}" not found` })
    }
  })

  // ── 9. Patient privacy check ──────────────────────────
  // Verify no PII patterns exist in prescription data
  const piiPatterns = [/\d{10,}/, /01[3-9]\d{8}/] // phone numbers, national IDs
  let piiFound = false
  prescriptions.forEach((rx) => {
    piiPatterns.forEach((pattern) => {
      if (pattern.test(rx.patientId)) piiFound = true
    })
  })

  const patientPrivacyCheck = {
    passed: !piiFound,
    message: piiFound
      ? '⚠ Potential PII detected in patient IDs'
      : '✓ Patient records are anonymized (ID-only format)',
  }

  const errors = issues.filter((i) => i.severity === 'ERROR').length
  const warnings = issues.filter((i) => i.severity === 'WARNING').length

  return {
    passed: errors === 0,
    totalEntities:
      companies.length + therapeuticClasses.length + molecules.length + brands.length +
      diseases.length + specialties.length + territories.length + districts.length +
      upazilas.length + doctors.length + prescriptions.length + prescriptionItems.length,
    totalIssues: issues.length,
    errors,
    warnings,
    issues,
    entityCounts: {
      companies: companies.length,
      therapeuticClasses: therapeuticClasses.length,
      molecules: molecules.length,
      brands: brands.length,
      diseases: diseases.length,
      specialties: specialties.length,
      territories: territories.length,
      districts: districts.length,
      upazilas: upazilas.length,
      doctors: doctors.length,
      prescriptions: prescriptions.length,
      prescriptionItems: prescriptionItems.length,
    },
    patientPrivacyCheck,
  }
}

export function logIntegrityReport(): void {
  if (import.meta.env.PROD) return // never run in production

  const report = runIntegrityCheck()

  console.group('📋 PHARMA INTELLIGENCE OS — Data Integrity Report')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  console.group('📊 Entity Counts')
  Object.entries(report.entityCounts).forEach(([entity, count]) => {
    console.log(`  ${entity}: ${count.toLocaleString()}`)
  })
  console.log(`  TOTAL: ${report.totalEntities.toLocaleString()}`)
  console.groupEnd()

  console.group('🔒 Patient Privacy Check')
  console.log(`  ${report.patientPrivacyCheck.message}`)
  console.groupEnd()

  if (report.issues.length === 0) {
    console.log('✅ All integrity checks passed. No issues found.')
  } else {
    if (report.errors > 0) {
      console.group(`❌ Errors (${report.errors})`)
      report.issues.filter((i) => i.severity === 'ERROR').forEach((issue) => {
        console.error(`  [${issue.entity}] ${issue.entityId}: ${issue.issue}`)
      })
      console.groupEnd()
    }
    if (report.warnings > 0) {
      console.group(`⚠️ Warnings (${report.warnings})`)
      report.issues.filter((i) => i.severity === 'WARNING').forEach((issue) => {
        console.warn(`  [${issue.entity}] ${issue.entityId}: ${issue.issue}`)
      })
      console.groupEnd()
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Result: ${report.passed ? '✅ PASSED' : '❌ FAILED'} | Errors: ${report.errors} | Warnings: ${report.warnings}`)
  console.groupEnd()
}
