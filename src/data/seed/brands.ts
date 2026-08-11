// ─────────────────────────────────────────────────────────
// MOCK DATA: Brands (50+ fictional pharmaceutical brands)
// All brands are fictional and for demonstration only.
// ─────────────────────────────────────────────────────────

import type { Brand } from '@/types'

export const brands: Brand[] = [
  // NovaCare (COMP-001)
  { id: 'BRAND-001', name: 'NovaCor 5', companyId: 'COMP-001', moleculeId: 'MOL-001', therapeuticClassId: 'TC-001', strength: '5mg', form: 'tablet', unitPrice: 8.50, isActive: true, launchDate: '2018-03-01', createdAt: '2018-03-01' },
  { id: 'BRAND-002', name: 'NovaCor 10', companyId: 'COMP-001', moleculeId: 'MOL-001', therapeuticClassId: 'TC-001', strength: '10mg', form: 'tablet', unitPrice: 12.00, isActive: true, launchDate: '2018-03-01', createdAt: '2018-03-01' },
  { id: 'BRAND-003', name: 'NovaLip 10', companyId: 'COMP-001', moleculeId: 'MOL-002', therapeuticClassId: 'TC-001', strength: '10mg', form: 'tablet', unitPrice: 18.00, isActive: true, launchDate: '2019-01-15', createdAt: '2019-01-15' },
  { id: 'BRAND-004', name: 'NovaLip 20', companyId: 'COMP-001', moleculeId: 'MOL-002', therapeuticClassId: 'TC-001', strength: '20mg', form: 'tablet', unitPrice: 22.00, isActive: true, launchDate: '2019-01-15', createdAt: '2019-01-15' },
  { id: 'BRAND-005', name: 'NovaMet 500', companyId: 'COMP-001', moleculeId: 'MOL-003', therapeuticClassId: 'TC-003', strength: '500mg', form: 'tablet', unitPrice: 6.00, isActive: true, launchDate: '2017-06-01', createdAt: '2017-06-01' },
  { id: 'BRAND-006', name: 'NovaMet 850', companyId: 'COMP-001', moleculeId: 'MOL-003', therapeuticClassId: 'TC-003', strength: '850mg', form: 'tablet', unitPrice: 8.00, isActive: true, launchDate: '2017-06-01', createdAt: '2017-06-01' },
  { id: 'BRAND-007', name: 'NovaZith 250', companyId: 'COMP-001', moleculeId: 'MOL-005', therapeuticClassId: 'TC-002', strength: '250mg', form: 'capsule', unitPrice: 45.00, isActive: true, launchDate: '2020-02-01', createdAt: '2020-02-01' },

  // MedAxis (COMP-002)
  { id: 'BRAND-008', name: 'Axilosartan 50', companyId: 'COMP-002', moleculeId: 'MOL-013', therapeuticClassId: 'TC-011', strength: '50mg', form: 'tablet', unitPrice: 14.00, isActive: true, launchDate: '2019-05-01', createdAt: '2019-05-01' },
  { id: 'BRAND-009', name: 'Axilosartan 100', companyId: 'COMP-002', moleculeId: 'MOL-013', therapeuticClassId: 'TC-011', strength: '100mg', form: 'tablet', unitPrice: 18.00, isActive: true, launchDate: '2019-05-01', createdAt: '2019-05-01' },
  { id: 'BRAND-010', name: 'AxiMox 500', companyId: 'COMP-002', moleculeId: 'MOL-006', therapeuticClassId: 'TC-002', strength: '500mg', form: 'capsule', unitPrice: 12.00, isActive: true, launchDate: '2018-08-01', createdAt: '2018-08-01' },
  { id: 'BRAND-011', name: 'AxiMox 250 Syrup', companyId: 'COMP-002', moleculeId: 'MOL-006', therapeuticClassId: 'TC-002', strength: '250mg/5ml', form: 'syrup', unitPrice: 55.00, isActive: true, launchDate: '2018-08-01', createdAt: '2018-08-01' },
  { id: 'BRAND-012', name: 'AxiEso 20', companyId: 'COMP-002', moleculeId: 'MOL-010', therapeuticClassId: 'TC-005', strength: '20mg', form: 'capsule', unitPrice: 16.00, isActive: true, launchDate: '2021-01-01', createdAt: '2021-01-01' },
  { id: 'BRAND-013', name: 'AxiEso 40', companyId: 'COMP-002', moleculeId: 'MOL-010', therapeuticClassId: 'TC-005', strength: '40mg', form: 'capsule', unitPrice: 22.00, isActive: true, launchDate: '2021-01-01', createdAt: '2021-01-01' },
  { id: 'BRAND-014', name: 'AxiGlim 1', companyId: 'COMP-002', moleculeId: 'MOL-004', therapeuticClassId: 'TC-003', strength: '1mg', form: 'tablet', unitPrice: 10.00, isActive: true, launchDate: '2020-09-01', createdAt: '2020-09-01' },
  { id: 'BRAND-015', name: 'AxiGlim 2', companyId: 'COMP-002', moleculeId: 'MOL-004', therapeuticClassId: 'TC-003', strength: '2mg', form: 'tablet', unitPrice: 14.00, isActive: true, launchDate: '2020-09-01', createdAt: '2020-09-01' },

  // Zenith Therapeutics (COMP-003)
  { id: 'BRAND-016', name: 'ZenPan 40', companyId: 'COMP-003', moleculeId: 'MOL-026', therapeuticClassId: 'TC-005', strength: '40mg', form: 'tablet', unitPrice: 14.00, isActive: true, launchDate: '2019-03-01', createdAt: '2019-03-01' },
  { id: 'BRAND-017', name: 'ZenPan 20', companyId: 'COMP-003', moleculeId: 'MOL-026', therapeuticClassId: 'TC-005', strength: '20mg', form: 'tablet', unitPrice: 10.00, isActive: true, launchDate: '2019-03-01', createdAt: '2019-03-01' },
  { id: 'BRAND-018', name: 'ZenSal Inhaler', companyId: 'COMP-003', moleculeId: 'MOL-007', therapeuticClassId: 'TC-004', strength: '100mcg', form: 'inhaler', unitPrice: 180.00, isActive: true, launchDate: '2021-06-01', createdAt: '2021-06-01' },
  { id: 'BRAND-019', name: 'ZenMont 10', companyId: 'COMP-003', moleculeId: 'MOL-008', therapeuticClassId: 'TC-004', strength: '10mg', form: 'tablet', unitPrice: 20.00, isActive: true, launchDate: '2020-04-01', createdAt: '2020-04-01' },
  { id: 'BRAND-020', name: 'ZenMont 5', companyId: 'COMP-003', moleculeId: 'MOL-008', therapeuticClassId: 'TC-004', strength: '5mg', form: 'tablet', unitPrice: 15.00, isActive: true, launchDate: '2020-04-01', createdAt: '2020-04-01' },
  { id: 'BRAND-021', name: 'ZenDic 75', companyId: 'COMP-003', moleculeId: 'MOL-011', therapeuticClassId: 'TC-006', strength: '75mg', form: 'tablet', unitPrice: 8.00, isActive: true, launchDate: '2018-01-01', createdAt: '2018-01-01' },
  { id: 'BRAND-022', name: 'ZenPara 500', companyId: 'COMP-003', moleculeId: 'MOL-012', therapeuticClassId: 'TC-006', strength: '500mg', form: 'tablet', unitPrice: 4.00, isActive: true, launchDate: '2017-01-01', createdAt: '2017-01-01' },
  { id: 'BRAND-023', name: 'ZenFlu 150', companyId: 'COMP-003', moleculeId: 'MOL-017', therapeuticClassId: 'TC-012', strength: '150mg', form: 'capsule', unitPrice: 60.00, isActive: true, launchDate: '2021-02-01', createdAt: '2021-02-01' },

  // ApexBio (COMP-004)
  { id: 'BRAND-024', name: 'ApexRosu 10', companyId: 'COMP-004', moleculeId: 'MOL-022', therapeuticClassId: 'TC-001', strength: '10mg', form: 'tablet', unitPrice: 20.00, isActive: true, launchDate: '2020-07-01', createdAt: '2020-07-01' },
  { id: 'BRAND-025', name: 'ApexRosu 20', companyId: 'COMP-004', moleculeId: 'MOL-022', therapeuticClassId: 'TC-001', strength: '20mg', form: 'tablet', unitPrice: 28.00, isActive: true, launchDate: '2020-07-01', createdAt: '2020-07-01' },
  { id: 'BRAND-026', name: 'ApexCip 500', companyId: 'COMP-004', moleculeId: 'MOL-025', therapeuticClassId: 'TC-002', strength: '500mg', form: 'tablet', unitPrice: 25.00, isActive: true, launchDate: '2019-10-01', createdAt: '2019-10-01' },
  { id: 'BRAND-027', name: 'ApexCip 250', companyId: 'COMP-004', moleculeId: 'MOL-025', therapeuticClassId: 'TC-002', strength: '250mg', form: 'tablet', unitPrice: 18.00, isActive: true, launchDate: '2019-10-01', createdAt: '2019-10-01' },
  { id: 'BRAND-028', name: 'ApexSita 100', companyId: 'COMP-004', moleculeId: 'MOL-023', therapeuticClassId: 'TC-003', strength: '100mg', form: 'tablet', unitPrice: 55.00, isActive: true, launchDate: '2022-01-01', createdAt: '2022-01-01' },
  { id: 'BRAND-029', name: 'ApexSita 50', companyId: 'COMP-004', moleculeId: 'MOL-023', therapeuticClassId: 'TC-003', strength: '50mg', form: 'tablet', unitPrice: 38.00, isActive: true, launchDate: '2022-01-01', createdAt: '2022-01-01' },
  { id: 'BRAND-030', name: 'ApexVit D3', companyId: 'COMP-004', moleculeId: 'MOL-020', therapeuticClassId: 'TC-010', strength: '50000IU', form: 'capsule', unitPrice: 30.00, isActive: true, launchDate: '2021-09-01', createdAt: '2021-09-01' },

  // HealthCore (COMP-005)
  { id: 'BRAND-031', name: 'CoreOme 20', companyId: 'COMP-005', moleculeId: 'MOL-009', therapeuticClassId: 'TC-005', strength: '20mg', form: 'capsule', unitPrice: 12.00, isActive: true, launchDate: '2018-05-01', createdAt: '2018-05-01' },
  { id: 'BRAND-032', name: 'CoreOme 40', companyId: 'COMP-005', moleculeId: 'MOL-009', therapeuticClassId: 'TC-005', strength: '40mg', form: 'capsule', unitPrice: 18.00, isActive: true, launchDate: '2018-05-01', createdAt: '2018-05-01' },
  { id: 'BRAND-033', name: 'CoreCeti 10', companyId: 'COMP-005', moleculeId: 'MOL-024', therapeuticClassId: 'TC-004', strength: '10mg', form: 'tablet', unitPrice: 8.00, isActive: true, launchDate: '2019-02-01', createdAt: '2019-02-01' },
  { id: 'BRAND-034', name: 'CoreMetro 400', companyId: 'COMP-005', moleculeId: 'MOL-018', therapeuticClassId: 'TC-015', strength: '400mg', form: 'tablet', unitPrice: 6.00, isActive: true, launchDate: '2017-11-01', createdAt: '2017-11-01' },
  { id: 'BRAND-035', name: 'CoreThyro 50', companyId: 'COMP-005', moleculeId: 'MOL-019', therapeuticClassId: 'TC-014', strength: '50mcg', form: 'tablet', unitPrice: 7.00, isActive: true, launchDate: '2020-03-01', createdAt: '2020-03-01' },
  { id: 'BRAND-036', name: 'CoreThyro 100', companyId: 'COMP-005', moleculeId: 'MOL-019', therapeuticClassId: 'TC-014', strength: '100mcg', form: 'tablet', unitPrice: 10.00, isActive: true, launchDate: '2020-03-01', createdAt: '2020-03-01' },

  // PrimeMed (COMP-006)
  { id: 'BRAND-037', name: 'PrimePara 650', companyId: 'COMP-006', moleculeId: 'MOL-012', therapeuticClassId: 'TC-006', strength: '650mg', form: 'tablet', unitPrice: 5.00, isActive: true, launchDate: '2016-01-01', createdAt: '2016-01-01' },
  { id: 'BRAND-038', name: 'PrimePara Syrup', companyId: 'COMP-006', moleculeId: 'MOL-012', therapeuticClassId: 'TC-006', strength: '120mg/5ml', form: 'syrup', unitPrice: 42.00, isActive: true, launchDate: '2016-01-01', createdAt: '2016-01-01' },
  { id: 'BRAND-039', name: 'PrimeClona 0.5', companyId: 'COMP-006', moleculeId: 'MOL-016', therapeuticClassId: 'TC-013', strength: '0.5mg', form: 'tablet', unitPrice: 12.00, isActive: true, launchDate: '2021-04-01', createdAt: '2021-04-01' },
  { id: 'BRAND-040', name: 'PrimeClona 1', companyId: 'COMP-006', moleculeId: 'MOL-016', therapeuticClassId: 'TC-013', strength: '1mg', form: 'tablet', unitPrice: 16.00, isActive: true, launchDate: '2021-04-01', createdAt: '2021-04-01' },
  { id: 'BRAND-041', name: 'PrimePrega 75', companyId: 'COMP-006', moleculeId: 'MOL-021', therapeuticClassId: 'TC-007', strength: '75mg', form: 'capsule', unitPrice: 25.00, isActive: true, launchDate: '2022-06-01', createdAt: '2022-06-01' },
  { id: 'BRAND-042', name: 'PrimePrega 150', companyId: 'COMP-006', moleculeId: 'MOL-021', therapeuticClassId: 'TC-007', strength: '150mg', form: 'capsule', unitPrice: 35.00, isActive: true, launchDate: '2022-06-01', createdAt: '2022-06-01' },

  // Orion Therapeutics (COMP-007)
  { id: 'BRAND-043', name: 'OrionVals 80', companyId: 'COMP-007', moleculeId: 'MOL-014', therapeuticClassId: 'TC-011', strength: '80mg', form: 'tablet', unitPrice: 22.00, isActive: true, launchDate: '2018-10-01', createdAt: '2018-10-01' },
  { id: 'BRAND-044', name: 'OrionVals 160', companyId: 'COMP-007', moleculeId: 'MOL-014', therapeuticClassId: 'TC-011', strength: '160mg', form: 'tablet', unitPrice: 30.00, isActive: true, launchDate: '2018-10-01', createdAt: '2018-10-01' },
  { id: 'BRAND-045', name: 'OrionGab 300', companyId: 'COMP-007', moleculeId: 'MOL-027', therapeuticClassId: 'TC-007', strength: '300mg', form: 'capsule', unitPrice: 22.00, isActive: true, launchDate: '2020-11-01', createdAt: '2020-11-01' },
  { id: 'BRAND-046', name: 'OrionGab 100', companyId: 'COMP-007', moleculeId: 'MOL-027', therapeuticClassId: 'TC-007', strength: '100mg', form: 'capsule', unitPrice: 14.00, isActive: true, launchDate: '2020-11-01', createdAt: '2020-11-01' },
  { id: 'BRAND-047', name: 'OrionLis 10', companyId: 'COMP-007', moleculeId: 'MOL-028', therapeuticClassId: 'TC-011', strength: '10mg', form: 'tablet', unitPrice: 15.00, isActive: true, launchDate: '2019-07-01', createdAt: '2019-07-01' },
  { id: 'BRAND-048', name: 'OrionAtor 40', companyId: 'COMP-007', moleculeId: 'MOL-002', therapeuticClassId: 'TC-001', strength: '40mg', form: 'tablet', unitPrice: 28.00, isActive: true, launchDate: '2021-03-01', createdAt: '2021-03-01' },

  // CuraLife (COMP-008)
  { id: 'BRAND-049', name: 'CuraMet 1000', companyId: 'COMP-008', moleculeId: 'MOL-003', therapeuticClassId: 'TC-003', strength: '1000mg', form: 'tablet', unitPrice: 10.00, isActive: true, launchDate: '2020-01-01', createdAt: '2020-01-01' },
  { id: 'BRAND-050', name: 'CuraGlim 3', companyId: 'COMP-008', moleculeId: 'MOL-004', therapeuticClassId: 'TC-003', strength: '3mg', form: 'tablet', unitPrice: 18.00, isActive: true, launchDate: '2021-08-01', createdAt: '2021-08-01' },
  { id: 'BRAND-051', name: 'CuraSita 100', companyId: 'COMP-008', moleculeId: 'MOL-023', therapeuticClassId: 'TC-003', strength: '100mg', form: 'tablet', unitPrice: 52.00, isActive: true, launchDate: '2022-03-01', createdAt: '2022-03-01' },
  { id: 'BRAND-052', name: 'CuraCor 5', companyId: 'COMP-008', moleculeId: 'MOL-001', therapeuticClassId: 'TC-001', strength: '5mg', form: 'tablet', unitPrice: 9.00, isActive: true, launchDate: '2021-01-01', createdAt: '2021-01-01' },
  { id: 'BRAND-053', name: 'CuraClobet Cream', companyId: 'COMP-008', moleculeId: 'MOL-015', therapeuticClassId: 'TC-008', strength: '0.05%', form: 'cream', unitPrice: 45.00, isActive: true, launchDate: '2022-05-01', createdAt: '2022-05-01' },
  { id: 'BRAND-054', name: 'CuraVitD 1000', companyId: 'COMP-008', moleculeId: 'MOL-020', therapeuticClassId: 'TC-010', strength: '1000IU', form: 'tablet', unitPrice: 8.00, isActive: true, launchDate: '2021-11-01', createdAt: '2021-11-01' },
  { id: 'BRAND-055', name: 'CuraLos 25', companyId: 'COMP-008', moleculeId: 'MOL-013', therapeuticClassId: 'TC-011', strength: '25mg', form: 'tablet', unitPrice: 10.00, isActive: true, launchDate: '2020-06-01', createdAt: '2020-06-01' },
]
