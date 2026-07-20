// SafeStack - TJEKA Training Pricing Database (July 2026)
// Tjeka Training - Construction & Health & Safety Skills Development
// Rates in ZAR

export const TJEKA_CATEGORIES = {
  training: {
    name: 'Health & Safety Training',
    notes: 'Training rates per delegate. Group discounts available for 10+ delegates.',
    items: [
      { code: 'TJK-TRN-SHEILD', description: 'Safety Representative (SHEILD) training (1 day) - per delegate', unit: 'each', national: 1850, gauteng: 1850, western_cape: 1950, kwazulu_natal: 1800, eastern_cape: 1750, limpopo: 1850, mpumalanga: 1800, north_west: 1800, free_state: 1780, northern_cape: 1900, data_source: 'Tjeka Training Fee Schedule Jul 2026' },
      { code: 'TJK-TRN-FALL', description: 'Fall Protection Planner (3 days) - per delegate', unit: 'each', national: 4500, gauteng: 4500, western_cape: 4800, kwazulu_natal: 4400, eastern_cape: 4300, limpopo: 4500, mpumalanga: 4400, north_west: 4400, free_state: 4300, northern_cape: 4600, data_source: 'Tjeka Training Fee Schedule Jul 2026' },
      { code: 'TJK-TRN-EHS', description: 'Environmental, Health & Safety Representative (2 days) - per delegate', unit: 'each', national: 3200, gauteng: 3200, western_cape: 3400, kwazulu_natal: 3100, eastern_cape: 3000, limpopo: 3200, mpumalanga: 3100, north_west: 3100, free_state: 3000, northern_cape: 3300, data_source: 'Tjeka Training Fee Schedule Jul 2026' },
      { code: 'TJK-TRN-INCIDENT', description: 'Incident Investigation (1 day) - per delegate', unit: 'each', national: 2200, gauteng: 2200, western_cape: 2350, kwazulu_natal: 2150, eastern_cape: 2100, limpopo: 2200, mpumalanga: 2150, north_west: 2150, free_state: 2100, northern_cape: 2300, data_source: 'Tjeka Training Fee Schedule Jul 2026' },
      { code: 'TJK-TRN-RISK', description: 'Risk Assessment & HIRA (1 day) - per delegate', unit: 'each', national: 2200, gauteng: 2200, western_cape: 2350, kwazulu_natal: 2150, eastern_cape: 2100, limpopo: 2200, mpumalanga: 2150, north_west: 2150, free_state: 2100, northern_cape: 2300, data_source: 'Tjeka Training Fee Schedule Jul 2026' },
      { code: 'TJK-TRN-SAMS', description: 'SAMS (Safety Management System) training (2 days) - per delegate', unit: 'each', national: 3800, gauteng: 3800, western_cape: 4000, kwazulu_natal: 3700, eastern_cape: 3600, limpopo: 3800, mpumalanga: 3700, north_west: 3700, free_state: 3600, northern_cape: 3900, data_source: 'Tjeka Training Fee Schedule Jul 2026' },
    ]
  },
  fees: {
    name: 'Registration & Assessment Fees',
    items: [
      { code: 'TJK-FEE-REG', description: 'Tjeka training registration (annual) - per company', unit: 'each', national: 2500, gauteng: 2500, western_cape: 2500, kwazulu_natal: 2500, eastern_cape: 2500, limpopo: 2500, mpumalanga: 2500, north_west: 2500, free_state: 2500, northern_cape: 2500, data_source: 'Tjeka Fee Schedule Jul 2026' },
      { code: 'TJK-FEE-ASSESS', description: 'Competency assessment - per delegate', unit: 'each', national: 850, gauteng: 850, western_cape: 900, kwazulu_natal: 820, eastern_cape: 800, limpopo: 850, mpumalanga: 830, north_west: 830, free_state: 810, northern_cape: 880, data_source: 'Tjeka Fee Schedule Jul 2026' },
      { code: 'TJK-FEE-CERT', description: 'Certificate issuance (replacement) - each', unit: 'each', national: 250, gauteng: 250, western_cape: 250, kwazulu_natal: 250, eastern_cape: 250, limpopo: 250, mpumalanga: 250, north_west: 250, free_state: 250, northern_cape: 250, data_source: 'Tjeka Fee Schedule Jul 2026' },
    ]
  }
};

export function searchTJEKA(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(TJEKA_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default TJEKA_CATEGORIES;
