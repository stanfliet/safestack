// SafeStack - Health & Safety Compliance Pricing Database (July 2026)
// SACPCMP, OHS Act, SANS - Compliance Audits, Registration & Training
// Rates in ZAR

export const HEALTH_SAFETY_CATEGORIES = {
  sacpcmp: {
    name: 'SACPCMP Registration & CPD',
    items: [
      { code: 'HSE-SAC-REG-CON', description: 'SACPCMP Construction Manager registration (annual) - per year', unit: 'year', national: 2850, gauteng: 2850, western_cape: 2850, kwazulu_natal: 2850, eastern_cape: 2850, limpopo: 2850, mpumalanga: 2850, north_west: 2850, free_state: 2850, northern_cape: 2850, data_source: 'SACPCMP Fee Schedule Jul 2026' },
      { code: 'HSE-SAC-REG-SO', description: 'SACPCMP Safety Officer registration (annual) - per year', unit: 'year', national: 1950, gauteng: 1950, western_cape: 1950, kwazulu_natal: 1950, eastern_cape: 1950, limpopo: 1950, mpumalanga: 1950, north_west: 1950, free_state: 1950, northern_cape: 1950, data_source: 'SACPCMP Fee Schedule Jul 2026' },
      { code: 'HSE-SAC-CPD', description: 'SACPCMP CPD point (per hour of CPD activity) - per hr', unit: 'hr', national: 0, gauteng: 0, western_cape: 0, kwazulu_natal: 0, eastern_cape: 0, limpopo: 0, mpumalanga: 0, north_west: 0, free_state: 0, northern_cape: 0, data_source: 'SACPCMP CPD Policy - No fee (CPD activity cost varies)' },
      { code: 'HSE-SAC-REINSTATE', description: 'SACPCMP reinstatement fee (lapsed registration) - each', unit: 'each', national: 1200, gauteng: 1200, western_cape: 1200, kwazulu_natal: 1200, eastern_cape: 1200, limpopo: 1200, mpumalanga: 1200, north_west: 1200, free_state: 1200, northern_cape: 1200, data_source: 'SACPCMP Fee Schedule Jul 2026' },
    ]
  },
  ohsAct: {
    name: 'OHS Act Compliance & Audits',
    items: [
      { code: 'HSE-OHS-AUDIT', description: 'OHS Act compliance audit (full, per day) - per day', unit: 'day', national: 8500, gauteng: 8200, western_cape: 9200, kwazulu_natal: 8800, eastern_cape: 8500, limpopo: 7800, mpumalanga: 8200, north_west: 8300, free_state: 8100, northern_cape: 9500, data_source: 'Industry Average Jul 2026' },
      { code: 'HSE-OHS-AUDIT-S', description: 'OHS Act compliance audit (scoping, half day) - per half day', unit: 'half-day', national: 4500, gauteng: 4300, western_cape: 4900, kwazulu_natal: 4600, eastern_cape: 4500, limpopo: 4200, mpumalanga: 4400, north_west: 4400, free_state: 4300, northern_cape: 5200, data_source: 'Industry Average Jul 2026' },
      { code: 'HSE-OHS-FILE', description: 'Safety file compilation (per project) - per project', unit: 'each', national: 15000, gauteng: 14500, western_cape: 16500, kwazulu_natal: 15500, eastern_cape: 15000, limpopo: 14000, mpumalanga: 14800, north_west: 15000, free_state: 14800, northern_cape: 18000, data_source: 'Industry Average Jul 2026' },
      { code: 'HSE-OHS-24', description: 'Section 24 incident investigation report - each', unit: 'each', national: 5000, gauteng: 4800, western_cape: 5500, kwazulu_natal: 5200, eastern_cape: 5000, limpopo: 4600, mpumalanga: 4800, north_west: 4900, free_state: 4800, northern_cape: 6000, data_source: 'Industry Average Jul 2026' },
    ]
  },
  sans: {
    name: 'SANS Standards & Certification',
    items: [
      { code: 'HSE-SANS-3000', description: 'SANS 3000 series (OHS management) - per standard', unit: 'each', national: 850, gauteng: 850, western_cape: 850, kwazulu_natal: 850, eastern_cape: 850, limpopo: 850, mpumalanga: 850, north_west: 850, free_state: 850, northern_cape: 850, data_source: 'SANS Pricing Jul 2026' },
      { code: 'HSE-SANS-10400', description: 'SANS 10400 (Building regulations, Part A-W) - per part', unit: 'each', national: 450, gauteng: 450, western_cape: 450, kwazulu_natal: 450, eastern_cape: 450, limpopo: 450, mpumalanga: 450, north_west: 450, free_state: 450, northern_cape: 450, data_source: 'SANS Pricing Jul 2026' },
      { code: 'HSE-SANS-10090', description: 'SANS 10090 (Personal protective equipment) - each', unit: 'each', national: 550, gauteng: 550, western_cape: 550, kwazulu_natal: 550, eastern_cape: 550, limpopo: 550, mpumalanga: 550, north_west: 550, free_state: 550, northern_cape: 550, data_source: 'SANS Pricing Jul 2026' },
    ]
  },
  training: {
    name: 'H&S Training',
    items: [
      { code: 'HSE-TRN-SHEILD', description: 'SHE Representative training (1 day) - per delegate', unit: 'each', national: 2000, gauteng: 1950, western_cape: 2200, kwazulu_natal: 2050, eastern_cape: 2000, limpopo: 1900, mpumalanga: 1950, north_west: 2000, free_state: 1950, northern_cape: 2400, data_source: 'Industry Average Jul 2026' },
      { code: 'HSE-TRN-FALL', description: 'Fall Protection training (1 day) - per delegate', unit: 'each', national: 2500, gauteng: 2400, western_cape: 2700, kwazulu_natal: 2550, eastern_cape: 2500, limpopo: 2350, mpumalanga: 2450, north_west: 2480, free_state: 2400, northern_cape: 3000, data_source: 'Industry Average Jul 2026' },
      { code: 'HSE-TRN-FIRE', description: 'Fire Safety & Fire Marshal training (1 day) - per delegate', unit: 'each', national: 1800, gauteng: 1750, western_cape: 1950, kwazulu_natal: 1850, eastern_cape: 1800, limpopo: 1700, mpumalanga: 1750, north_west: 1780, free_state: 1720, northern_cape: 2200, data_source: 'Industry Average Jul 2026' },
      { code: 'HSE-TRN-FIRST', description: 'First Aid Level 1 (3 days) - per delegate', unit: 'each', national: 2800, gauteng: 2700, western_cape: 3000, kwazulu_natal: 2850, eastern_cape: 2800, limpopo: 2600, mpumalanga: 2700, north_west: 2750, free_state: 2650, northern_cape: 3300, data_source: 'Industry Average Jul 2026' },
    ]
  }
};

export function searchHEALTH_SAFETY(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const cat of Object.values(HEALTH_SAFETY_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default HEALTH_SAFETY_CATEGORIES;
