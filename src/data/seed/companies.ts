// ─────────────────────────────────────────────────────────
// MOCK DATA: Companies
// All entities are fictional and for demonstration only.
// ─────────────────────────────────────────────────────────

import type { Company } from '@/types'

export const companies: Company[] = [
  {
    id: 'COMP-001',
    name: 'NovaCare Pharma',
    shortName: 'NovaCare',
    country: 'Bangladesh',
    type: 'local',
    description: 'Leading Bangladeshi pharmaceutical manufacturer',
    createdAt: '2010-01-15',
  },
  {
    id: 'COMP-002',
    name: 'MedAxis',
    shortName: 'MedAxis',
    country: 'Bangladesh',
    type: 'local',
    description: 'Specialty pharmaceutical company focused on generics',
    createdAt: '2008-03-20',
  },
  {
    id: 'COMP-003',
    name: 'Zenith Therapeutics',
    shortName: 'Zenith',
    country: 'Bangladesh',
    type: 'local',
    description: 'Innovative therapeutics and branded generics',
    createdAt: '2012-07-10',
  },
  {
    id: 'COMP-004',
    name: 'ApexBio',
    shortName: 'ApexBio',
    country: 'Bangladesh',
    type: 'local',
    description: 'Biotechnology and pharmaceutical research company',
    createdAt: '2015-11-05',
  },
  {
    id: 'COMP-005',
    name: 'HealthCore',
    shortName: 'HealthCore',
    country: 'Bangladesh',
    type: 'local',
    description: 'Consumer and prescription health products',
    createdAt: '2009-06-01',
  },
  {
    id: 'COMP-006',
    name: 'PrimeMed',
    shortName: 'PrimeMed',
    country: 'Bangladesh',
    type: 'local',
    description: 'Primary care and OTC pharmaceutical solutions',
    createdAt: '2011-09-14',
  },
  {
    id: 'COMP-007',
    name: 'Orion Therapeutics',
    shortName: 'Orion',
    country: 'India',
    type: 'multinational',
    description: 'Regional multinational with broad therapeutic portfolio',
    createdAt: '2005-02-28',
  },
  {
    id: 'COMP-008',
    name: 'CuraLife',
    shortName: 'CuraLife',
    country: 'Bangladesh',
    type: 'local',
    description: 'Chronic disease management pharmaceutical specialist',
    createdAt: '2013-04-18',
  },
]

export const competitors = companies.map((c) => ({
  id: `CMPET-${c.id.split('-')[1]}`,
  name: c.name,
  shortName: c.shortName,
  country: c.country,
  type: c.type,
  trackedBrands: [] as string[],
  createdAt: c.createdAt,
}))
