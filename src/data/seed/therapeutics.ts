// ─────────────────────────────────────────────────────────
// MOCK DATA: Therapeutic Classes, Molecules, Diseases
// All data is fictional and for demonstration only.
// ─────────────────────────────────────────────────────────

import type { TherapeuticClass, Molecule, Disease } from '@/types'

export const therapeuticClasses: TherapeuticClass[] = [
  { id: 'TC-001', name: 'Cardiovascular', code: 'CV', description: 'Heart and blood vessel conditions', createdAt: '2020-01-01' },
  { id: 'TC-002', name: 'Antibiotics', code: 'AB', description: 'Bacterial infection treatment', createdAt: '2020-01-01' },
  { id: 'TC-003', name: 'Antidiabetic', code: 'AD', description: 'Diabetes management', createdAt: '2020-01-01' },
  { id: 'TC-004', name: 'Respiratory', code: 'RS', description: 'Respiratory tract conditions', createdAt: '2020-01-01' },
  { id: 'TC-005', name: 'Gastrointestinal', code: 'GI', description: 'Digestive system conditions', createdAt: '2020-01-01' },
  { id: 'TC-006', name: 'Analgesics & NSAIDs', code: 'AN', description: 'Pain and inflammation management', createdAt: '2020-01-01' },
  { id: 'TC-007', name: 'Neurological', code: 'NR', description: 'Nervous system disorders', createdAt: '2020-01-01' },
  { id: 'TC-008', name: 'Dermatology', code: 'DM', description: 'Skin conditions', createdAt: '2020-01-01' },
  { id: 'TC-009', name: 'Ophthalmology', code: 'OP', description: 'Eye conditions', createdAt: '2020-01-01' },
  { id: 'TC-010', name: 'Vitamins & Supplements', code: 'VS', description: 'Nutritional supplementation', createdAt: '2020-01-01' },
  { id: 'TC-011', name: 'Antihypertensive', code: 'AH', description: 'High blood pressure management', createdAt: '2020-01-01' },
  { id: 'TC-012', name: 'Antifungal', code: 'AF', description: 'Fungal infection treatment', createdAt: '2020-01-01' },
  { id: 'TC-013', name: 'Psychotropic', code: 'PT', description: 'Mental health conditions', createdAt: '2020-01-01' },
  { id: 'TC-014', name: 'Hormonal', code: 'HM', description: 'Hormonal regulation', createdAt: '2020-01-01' },
  { id: 'TC-015', name: 'Antiparasitic', code: 'AP', description: 'Parasitic infection treatment', createdAt: '2020-01-01' },
]

export const molecules: Molecule[] = [
  { id: 'MOL-001', name: 'Amlodipine', genericName: 'amlodipine besylate', therapeuticClassId: 'TC-001', description: 'Calcium channel blocker', createdAt: '2020-01-01' },
  { id: 'MOL-002', name: 'Atorvastatin', genericName: 'atorvastatin calcium', therapeuticClassId: 'TC-001', description: 'HMG-CoA reductase inhibitor (statin)', createdAt: '2020-01-01' },
  { id: 'MOL-003', name: 'Metformin', genericName: 'metformin hydrochloride', therapeuticClassId: 'TC-003', description: 'Biguanide antidiabetic', createdAt: '2020-01-01' },
  { id: 'MOL-004', name: 'Glimepiride', genericName: 'glimepiride', therapeuticClassId: 'TC-003', description: 'Sulfonylurea antidiabetic', createdAt: '2020-01-01' },
  { id: 'MOL-005', name: 'Azithromycin', genericName: 'azithromycin dihydrate', therapeuticClassId: 'TC-002', description: 'Macrolide antibiotic', createdAt: '2020-01-01' },
  { id: 'MOL-006', name: 'Amoxicillin', genericName: 'amoxicillin trihydrate', therapeuticClassId: 'TC-002', description: 'Aminopenicillin antibiotic', createdAt: '2020-01-01' },
  { id: 'MOL-007', name: 'Salbutamol', genericName: 'salbutamol sulfate', therapeuticClassId: 'TC-004', description: 'Beta-2 adrenergic agonist', createdAt: '2020-01-01' },
  { id: 'MOL-008', name: 'Montelukast', genericName: 'montelukast sodium', therapeuticClassId: 'TC-004', description: 'Leukotriene receptor antagonist', createdAt: '2020-01-01' },
  { id: 'MOL-009', name: 'Omeprazole', genericName: 'omeprazole', therapeuticClassId: 'TC-005', description: 'Proton pump inhibitor', createdAt: '2020-01-01' },
  { id: 'MOL-010', name: 'Esomeprazole', genericName: 'esomeprazole magnesium', therapeuticClassId: 'TC-005', description: 'Proton pump inhibitor', createdAt: '2020-01-01' },
  { id: 'MOL-011', name: 'Diclofenac', genericName: 'diclofenac sodium', therapeuticClassId: 'TC-006', description: 'NSAID analgesic', createdAt: '2020-01-01' },
  { id: 'MOL-012', name: 'Paracetamol', genericName: 'paracetamol (acetaminophen)', therapeuticClassId: 'TC-006', description: 'Analgesic and antipyretic', createdAt: '2020-01-01' },
  { id: 'MOL-013', name: 'Losartan', genericName: 'losartan potassium', therapeuticClassId: 'TC-011', description: 'Angiotensin II receptor blocker', createdAt: '2020-01-01' },
  { id: 'MOL-014', name: 'Valsartan', genericName: 'valsartan', therapeuticClassId: 'TC-011', description: 'Angiotensin II receptor blocker', createdAt: '2020-01-01' },
  { id: 'MOL-015', name: 'Clobetasol', genericName: 'clobetasol propionate', therapeuticClassId: 'TC-008', description: 'Corticosteroid for skin conditions', createdAt: '2020-01-01' },
  { id: 'MOL-016', name: 'Clonazepam', genericName: 'clonazepam', therapeuticClassId: 'TC-013', description: 'Benzodiazepine anxiolytic', createdAt: '2020-01-01' },
  { id: 'MOL-017', name: 'Fluconazole', genericName: 'fluconazole', therapeuticClassId: 'TC-012', description: 'Triazole antifungal', createdAt: '2020-01-01' },
  { id: 'MOL-018', name: 'Metronidazole', genericName: 'metronidazole', therapeuticClassId: 'TC-015', description: 'Antiprotozoal and antibacterial', createdAt: '2020-01-01' },
  { id: 'MOL-019', name: 'Levothyroxine', genericName: 'levothyroxine sodium', therapeuticClassId: 'TC-014', description: 'Synthetic thyroid hormone', createdAt: '2020-01-01' },
  { id: 'MOL-020', name: 'Vitamin D3', genericName: 'cholecalciferol', therapeuticClassId: 'TC-010', description: 'Fat-soluble vitamin supplement', createdAt: '2020-01-01' },
  { id: 'MOL-021', name: 'Pregabalin', genericName: 'pregabalin', therapeuticClassId: 'TC-007', description: 'Anticonvulsant and neuropathic pain agent', createdAt: '2020-01-01' },
  { id: 'MOL-022', name: 'Rosuvastatin', genericName: 'rosuvastatin calcium', therapeuticClassId: 'TC-001', description: 'HMG-CoA reductase inhibitor (statin)', createdAt: '2020-01-01' },
  { id: 'MOL-023', name: 'Sitagliptin', genericName: 'sitagliptin phosphate', therapeuticClassId: 'TC-003', description: 'DPP-4 inhibitor antidiabetic', createdAt: '2020-01-01' },
  { id: 'MOL-024', name: 'Cetirizine', genericName: 'cetirizine hydrochloride', therapeuticClassId: 'TC-004', description: 'Second-generation antihistamine', createdAt: '2020-01-01' },
  { id: 'MOL-025', name: 'Ciprofloxacin', genericName: 'ciprofloxacin hydrochloride', therapeuticClassId: 'TC-002', description: 'Fluoroquinolone antibiotic', createdAt: '2020-01-01' },
  { id: 'MOL-026', name: 'Pantoprazole', genericName: 'pantoprazole sodium', therapeuticClassId: 'TC-005', description: 'Proton pump inhibitor', createdAt: '2020-01-01' },
  { id: 'MOL-027', name: 'Gabapentin', genericName: 'gabapentin', therapeuticClassId: 'TC-007', description: 'Anticonvulsant', createdAt: '2020-01-01' },
  { id: 'MOL-028', name: 'Lisinopril', genericName: 'lisinopril', therapeuticClassId: 'TC-011', description: 'ACE inhibitor antihypertensive', createdAt: '2020-01-01' },
]

export const diseases: Disease[] = [
  { id: 'DIS-001', name: 'Hypertension', icdCode: 'I10', therapeuticClassId: 'TC-011', description: 'Elevated blood pressure', prevalenceLevel: 'high', createdAt: '2020-01-01' },
  { id: 'DIS-002', name: 'Type 2 Diabetes', icdCode: 'E11', therapeuticClassId: 'TC-003', description: 'Non-insulin-dependent diabetes mellitus', prevalenceLevel: 'high', createdAt: '2020-01-01' },
  { id: 'DIS-003', name: 'Upper Respiratory Infection', icdCode: 'J06', therapeuticClassId: 'TC-002', description: 'Acute upper respiratory tract infection', prevalenceLevel: 'high', createdAt: '2020-01-01' },
  { id: 'DIS-004', name: 'Bronchial Asthma', icdCode: 'J45', therapeuticClassId: 'TC-004', description: 'Chronic inflammatory airway disease', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-005', name: 'Gastroesophageal Reflux', icdCode: 'K21', therapeuticClassId: 'TC-005', description: 'Acid reflux disease', prevalenceLevel: 'high', createdAt: '2020-01-01' },
  { id: 'DIS-006', name: 'Dyslipidemia', icdCode: 'E78', therapeuticClassId: 'TC-001', description: 'Abnormal lipid levels', prevalenceLevel: 'high', createdAt: '2020-01-01' },
  { id: 'DIS-007', name: 'Osteoarthritis', icdCode: 'M15', therapeuticClassId: 'TC-006', description: 'Degenerative joint disease', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-008', name: 'Anxiety Disorder', icdCode: 'F41', therapeuticClassId: 'TC-013', description: 'Generalized anxiety disorder', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-009', name: 'Hypothyroidism', icdCode: 'E03', therapeuticClassId: 'TC-014', description: 'Underactive thyroid gland', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-010', name: 'Urinary Tract Infection', icdCode: 'N39', therapeuticClassId: 'TC-002', description: 'Bacterial infection of urinary tract', prevalenceLevel: 'high', createdAt: '2020-01-01' },
  { id: 'DIS-011', name: 'Vitamin D Deficiency', icdCode: 'E55', therapeuticClassId: 'TC-010', description: 'Inadequate vitamin D levels', prevalenceLevel: 'high', createdAt: '2020-01-01' },
  { id: 'DIS-012', name: 'Peptic Ulcer Disease', icdCode: 'K27', therapeuticClassId: 'TC-005', description: 'Ulcers of the stomach or duodenum', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-013', name: 'Neuropathic Pain', icdCode: 'G62', therapeuticClassId: 'TC-007', description: 'Nerve damage related pain', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-014', name: 'Fungal Skin Infection', icdCode: 'B35', therapeuticClassId: 'TC-012', description: 'Dermatophytosis and related conditions', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-015', name: 'Intestinal Parasitosis', icdCode: 'B82', therapeuticClassId: 'TC-015', description: 'Parasitic intestinal infection', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-016', name: 'Ischemic Heart Disease', icdCode: 'I25', therapeuticClassId: 'TC-001', description: 'Reduced blood supply to heart', prevalenceLevel: 'medium', createdAt: '2020-01-01' },
  { id: 'DIS-017', name: 'Allergic Rhinitis', icdCode: 'J30', therapeuticClassId: 'TC-004', description: 'Allergic inflammation of nasal airways', prevalenceLevel: 'high', createdAt: '2020-01-01' },
]
