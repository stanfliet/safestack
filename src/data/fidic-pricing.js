// SafeStack - FIDIC Contract Pricing Database (July 2026)
// International Federation of Consulting Engineers - Fee Schedules & Dispute Resolution
// Rates in ZAR

export const FIDIC_CATEGORIES = {
  consulting: {
    name: 'Consulting & Fee Schedules',
    items: [
      { code: 'FID-FEE-PM', description: 'Project manager (FIDIC recognised) - per hour', unit: 'hr', national: 950, gauteng: 920, western_cape: 1050, kwazulu_natal: 980, eastern_cape: 950, limpopo: 850, mpumalanga: 900, north_west: 920, free_state: 900, northern_cape: 1000, data_source: 'FIDIC Fee Schedule Jul 2026' },
      { code: 'FID-FEE-ENG', description: 'Senior engineer (FIDIC recognised) - per hour', unit: 'hr', national: 850, gauteng: 820, western_cape: 920, kwazulu_natal: 880, eastern_cape: 850, limpopo: 780, mpumalanga: 820, north_west: 830, free_state: 810, northern_cape: 900, data_source: 'FIDIC Fee Schedule Jul 2026' },
      { code: 'FID-FEE-ARCH', description: 'Senior architect (FIDIC recognised) - per hour', unit: 'hr', national: 900, gauteng: 880, western_cape: 980, kwazulu_natal: 930, eastern_cape: 900, limpopo: 820, mpumalanga: 860, north_west: 880, free_state: 860, northern_cape: 950, data_source: 'FIDIC Fee Schedule Jul 2026' },
      { code: 'FID-FEE-QS', description: 'Quantity surveyor (FIDIC recognised) - per hour', unit: 'hr', national: 780, gauteng: 750, western_cape: 850, kwazulu_natal: 800, eastern_cape: 780, limpopo: 720, mpumalanga: 750, north_west: 760, free_state: 740, northern_cape: 830, data_source: 'FIDIC Fee Schedule Jul 2026' },
      { code: 'FID-FEE-TECH', description: 'Technician / technologist - per hour', unit: 'hr', national: 520, gauteng: 500, western_cape: 570, kwazulu_natal: 540, eastern_cape: 520, limpopo: 480, mpumalanga: 500, north_west: 510, free_state: 500, northern_cape: 560, data_source: 'FIDIC Fee Schedule Jul 2026' },
    ]
  },
  dispute: {
    name: 'Dispute Resolution & Adjudication',
    items: [
      { code: 'FID-DRB-DAY', description: 'Dispute Adjudication Board (DAB) member - per day', unit: 'day', national: 12000, gauteng: 12000, western_cape: 13000, kwazulu_natal: 12000, eastern_cape: 12000, limpopo: 12000, mpumalanga: 12000, north_west: 12000, free_state: 12000, northern_cape: 13000, data_source: 'FIDIC DAB Fee Schedule Jul 2026' },
      { code: 'FID-DRB-CHAIR', description: 'DAB Chairperson - per day', unit: 'day', national: 15000, gauteng: 15000, western_cape: 16000, kwazulu_natal: 15000, eastern_cape: 15000, limpopo: 15000, mpumalanga: 15000, north_west: 15000, free_state: 15000, northern_cape: 16000, data_source: 'FIDIC DAB Fee Schedule Jul 2026' },
      { code: 'FID-DRB-MOB', description: 'DAB site visit (travel + accommodation) - per visit', unit: 'each', national: 5000, gauteng: 4000, western_cape: 5500, kwazulu_natal: 5000, eastern_cape: 5000, limpopo: 6500, mpumalanga: 5500, north_west: 5500, free_state: 5000, northern_cape: 7000, data_source: 'FIDIC DAB Fee Schedule Jul 2026' },
      { code: 'FID-DRB-RET', description: 'DAB monthly retainer (standby) - per month', unit: 'month', national: 6000, gauteng: 6000, western_cape: 6500, kwazulu_natal: 6000, eastern_cape: 6000, limpopo: 6000, mpumalanga: 6000, north_west: 6000, free_state: 6000, northern_cape: 6500, data_source: 'FIDIC DAB Fee Schedule Jul 2026' },
    ]
  },
  training: {
    name: 'FIDIC Training & Certification',
    items: [
      { code: 'FID-TRN-BASIC', description: 'FIDIC Contracts (Basic) training - per delegate', unit: 'each', national: 8500, gauteng: 8500, western_cape: 9000, kwazulu_natal: 8500, eastern_cape: 8500, limpopo: 8500, mpumalanga: 8500, north_west: 8500, free_state: 8500, northern_cape: 9000, data_source: 'FIDIC Training Schedule Jul 2026' },
      { code: 'FID-TRN-ADV', description: 'FIDIC Contracts (Advanced) training - per delegate', unit: 'each', national: 12000, gauteng: 12000, western_cape: 13000, kwazulu_natal: 12000, eastern_cape: 12000, limpopo: 12000, mpumalanga: 12000, north_west: 12000, free_state: 12000, northern_cape: 13000, data_source: 'FIDIC Training Schedule Jul 2026' },
      { code: 'FID-TRN-MOD', description: 'FIDIC module (per e-learning module) - per module', unit: 'module', national: 2500, gauteng: 2500, western_cape: 2500, kwazulu_natal: 2500, eastern_cape: 2500, limpopo: 2500, mpumalanga: 2500, north_west: 2500, free_state: 2500, northern_cape: 2500, data_source: 'FIDIC Training Schedule Jul 2026' },
    ]
  }
};

export function searchFIDIC(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(FIDIC_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default FIDIC_CATEGORIES;
