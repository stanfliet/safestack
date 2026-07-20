// SafeStack - JBCC Contract Pricing Database (July 2026)
// Joint Building Contracts Committee - Contract Documentation & Subscriptions
// Rates in ZAR

export const JBCC_CATEGORIES = {
  contract: {
    name: 'JBCC Documentation & Contracts',
    items: [
      { code: 'JBC-DOC-PRIN', description: 'JBCC Principal Building Agreement (printed) - per copy', unit: 'each', national: 850, gauteng: 850, western_cape: 850, kwazulu_natal: 850, eastern_cape: 850, limpopo: 850, mpumalanga: 850, north_west: 850, free_state: 850, northern_cape: 850, data_source: 'JBCC Fee Schedule Jul 2026' },
      { code: 'JBC-DOC-NSUB', description: 'JBCC Nominated Subcontract Agreement - per copy', unit: 'each', national: 450, gauteng: 450, western_cape: 450, kwazulu_natal: 450, eastern_cape: 450, limpopo: 450, mpumalanga: 450, north_west: 450, free_state: 450, northern_cape: 450, data_source: 'JBCC Fee Schedule Jul 2026' },
      { code: 'JBC-DOC-SUB', description: 'JBCC Subcontract Agreement - per copy', unit: 'each', national: 350, gauteng: 350, western_cape: 350, kwazulu_natal: 350, eastern_cape: 350, limpopo: 350, mpumalanga: 350, north_west: 350, free_state: 350, northern_cape: 350, data_source: 'JBCC Fee Schedule Jul 2026' },
      { code: 'JBC-DOC-SUPP', description: 'JBCC Supply Agreement - per copy', unit: 'each', national: 300, gauteng: 300, western_cape: 300, kwazulu_natal: 300, eastern_cape: 300, limpopo: 300, mpumalanga: 300, north_west: 300, free_state: 300, northern_cape: 300, data_source: 'JBCC Fee Schedule Jul 2026' },
    ]
  },
  fees: {
    name: 'Subscription & Registration Fees',
    items: [
      { code: 'JBC-FEE-MEMBER', description: 'JBCC membership (annual, corporate) - per year', unit: 'year', national: 8500, gauteng: 8500, western_cape: 8500, kwazulu_natal: 8500, eastern_cape: 8500, limpopo: 8500, mpumalanga: 8500, north_west: 8500, free_state: 8500, northern_cape: 8500, data_source: 'JBCC Fee Schedule Jul 2026' },
      { code: 'JBC-FEE-INDIV', description: 'JBCC membership (annual, individual) - per year', unit: 'year', national: 2500, gauteng: 2500, western_cape: 2500, kwazulu_natal: 2500, eastern_cape: 2500, limpopo: 2500, mpumalanga: 2500, north_west: 2500, free_state: 2500, northern_cape: 2500, data_source: 'JBCC Fee Schedule Jul 2026' },
      { code: 'JBC-FEE-ELECTRONIC', description: 'JBCC electronic document licence (annual) - per year', unit: 'year', national: 3500, gauteng: 3500, western_cape: 3500, kwazulu_natal: 3500, eastern_cape: 3500, limpopo: 3500, mpumalanga: 3500, north_west: 3500, free_state: 3500, northern_cape: 3500, data_source: 'JBCC Fee Schedule Jul 2026' },
      { code: 'JBC-FEE-WORKSHOP', description: 'JBCC contract workshop (per delegate) - each', unit: 'each', national: 3500, gauteng: 3500, western_cape: 3800, kwazulu_natal: 3500, eastern_cape: 3500, limpopo: 3500, mpumalanga: 3500, north_west: 3500, free_state: 3500, northern_cape: 3800, data_source: 'JBCC Fee Schedule Jul 2026' },
    ]
  }
};

export function searchJBCC(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(JBCC_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default JBCC_CATEGORIES;
