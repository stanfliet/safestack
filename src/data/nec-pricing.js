// SafeStack - NEC Contract Pricing Database (July 2026)
// NEC4 Engineering & Construction Contract Suite - Contracts, Training & Software
// Rates in ZAR

export const NEC_CATEGORIES = {
  contract: {
    name: 'NEC Contracts & Documentation',
    items: [
      { code: 'NEC-DOC-ECC', description: 'NEC4 Engineering & Construction Contract (ECC) - per copy', unit: 'each', national: 950, gauteng: 950, western_cape: 950, kwazulu_natal: 950, eastern_cape: 950, limpopo: 950, mpumalanga: 950, north_west: 950, free_state: 950, northern_cape: 950, data_source: 'NEC UK / SA Distributor Jul 2026' },
      { code: 'NEC-DOC-ECS', description: 'NEC4 Engineering & Construction Subcontract (ECS) - per copy', unit: 'each', national: 550, gauteng: 550, western_cape: 550, kwazulu_natal: 550, eastern_cape: 550, limpopo: 550, mpumalanga: 550, north_west: 550, free_state: 550, northern_cape: 550, data_source: 'NEC UK / SA Distributor Jul 2026' },
      { code: 'NEC-DOC-PSC', description: 'NEC4 Professional Service Contract (PSC) - per copy', unit: 'each', national: 750, gauteng: 750, western_cape: 750, kwazulu_natal: 750, eastern_cape: 750, limpopo: 750, mpumalanga: 750, north_west: 750, free_state: 750, northern_cape: 750, data_source: 'NEC UK / SA Distributor Jul 2026' },
      { code: 'NEC-DOC-ALC', description: 'NEC4 Annual Liability Contract (ALC) - per copy', unit: 'each', national: 650, gauteng: 650, western_cape: 650, kwazulu_natal: 650, eastern_cape: 650, limpopo: 650, mpumalanga: 650, north_west: 650, free_state: 650, northern_cape: 650, data_source: 'NEC UK / SA Distributor Jul 2026' },
    ]
  },
  training: {
    name: 'NEC Training & Accreditation',
    items: [
      { code: 'NEC-TRN-INTRO', description: 'NEC4 Introduction (1 day) - per delegate', unit: 'each', national: 4500, gauteng: 4500, western_cape: 4800, kwazulu_natal: 4500, eastern_cape: 4500, limpopo: 4500, mpumalanga: 4500, north_west: 4500, free_state: 4500, northern_cape: 4800, data_source: 'NEC Training SA Jul 2026' },
      { code: 'NEC-TRN-PROJ', description: 'NEC4 Project Manager accreditation (3 days) - per delegate', unit: 'each', national: 12000, gauteng: 12000, western_cape: 13000, kwazulu_natal: 12000, eastern_cape: 12000, limpopo: 12000, mpumalanga: 12000, north_west: 12000, free_state: 12000, northern_cape: 13000, data_source: 'NEC Training SA Jul 2026' },
      { code: 'NEC-TRN-SUP', description: 'NEC4 Supervisor training (2 days) - per delegate', unit: 'each', national: 8000, gauteng: 8000, western_cape: 8500, kwazulu_natal: 8000, eastern_cape: 8000, limpopo: 8000, mpumalanga: 8000, north_west: 8000, free_state: 8000, northern_cape: 8500, data_source: 'NEC Training SA Jul 2026' },
      { code: 'NEC-TRN-REF', description: 'NEC4 Refresher / Update (1 day) - per delegate', unit: 'each', national: 3500, gauteng: 3500, western_cape: 3800, kwazulu_natal: 3500, eastern_cape: 3500, limpopo: 3500, mpumalanga: 3500, north_west: 3500, free_state: 3500, northern_cape: 3800, data_source: 'NEC Training SA Jul 2026' },
    ]
  },
  software: {
    name: 'NEC Software & Licences',
    items: [
      { code: 'NEC-SW-ONLINE', description: 'NEC Online software (annual licence) - per year', unit: 'year', national: 8500, gauteng: 8500, western_cape: 8500, kwazulu_natal: 8500, eastern_cape: 8500, limpopo: 8500, mpumalanga: 8500, north_west: 8500, free_state: 8500, northern_cape: 8500, data_source: 'NEC Software Schedule Jul 2026' },
      { code: 'NEC-SW-ENTERPRISE', description: 'NEC Online Enterprise (multi-user, annual) - per year', unit: 'year', national: 25000, gauteng: 25000, western_cape: 25000, kwazulu_natal: 25000, eastern_cape: 25000, limpopo: 25000, mpumalanga: 25000, north_west: 25000, free_state: 25000, northern_cape: 25000, data_source: 'NEC Software Schedule Jul 2026' },
    ]
  }
};

export function searchNEC(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const cat of Object.values(NEC_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default NEC_CATEGORIES;
