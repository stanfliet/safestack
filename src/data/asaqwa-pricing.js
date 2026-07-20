// SafeStack - ASAQS/AQWA Aggregate Pricing Database (July 2026)
// Aggregates & Sand Quarry Association of Southern Africa - Aggregate & Material Rates
// Rates in ZAR (per ton delivered - excl. transport where indicated)

export const ASAQA_CATEGORIES = {
  aggregates: {
    name: 'Crushed Aggregates',
    notes: 'Ex-works prices. Transport quoted separately based on distance.',
    items: [
      { code: 'ASA-AGG-6.7', description: '6.7mm crushed aggregate (concrete) - per ton', unit: 'ton', national: 280, gauteng: 260, western_cape: 310, kwazulu_natal: 290, eastern_cape: 275, limpopo: 320, mpumalanga: 300, north_west: 290, free_state: 280, northern_cape: 360, data_source: 'ASAQS Aggregate Survey Jul 2026' },
      { code: 'ASA-AGG-13', description: '13mm crushed aggregate (concrete) - per ton', unit: 'ton', national: 260, gauteng: 245, western_cape: 290, kwazulu_natal: 270, eastern_cape: 255, limpopo: 300, mpumalanga: 280, north_west: 270, free_state: 260, northern_cape: 340, data_source: 'ASAQS Aggregate Survey Jul 2026' },
      { code: 'ASA-AGG-19', description: '19mm crushed aggregate (concrete) - per ton', unit: 'ton', national: 250, gauteng: 235, western_cape: 280, kwazulu_natal: 260, eastern_cape: 245, limpopo: 290, mpumalanga: 270, north_west: 260, free_state: 250, northern_cape: 330, data_source: 'ASAQS Aggregate Survey Jul 2026' },
      { code: 'ASA-AGG-26', description: '26.5mm crushed aggregate - per ton', unit: 'ton', national: 240, gauteng: 225, western_cape: 270, kwazulu_natal: 250, eastern_cape: 235, limpopo: 280, mpumalanga: 260, north_west: 250, free_state: 240, northern_cape: 320, data_source: 'ASAQS Aggregate Survey Jul 2026' },
      { code: 'ASA-AGG-GAB', description: 'Gabion stone (150-300mm) - per ton', unit: 'ton', national: 220, gauteng: 205, western_cape: 245, kwazulu_natal: 230, eastern_cape: 215, limpopo: 260, mpumalanga: 240, north_west: 230, free_state: 220, northern_cape: 300, data_source: 'ASAQS Aggregate Survey Jul 2026' },
    ]
  },
  sands: {
    name: 'Sand & Fine Aggregates',
    items: [
      { code: 'ASA-SND-RVR', description: 'River sand (concrete & plaster) - per ton', unit: 'ton', national: 180, gauteng: 170, western_cape: 200, kwazulu_natal: 190, eastern_cape: 175, limpopo: 210, mpumalanga: 195, north_west: 185, free_state: 180, northern_cape: 240, data_source: 'ASAQS Aggregate Survey Jul 2026' },
      { code: 'ASA-SND-PLT', description: 'Plaster sand (washed) - per ton', unit: 'ton', national: 195, gauteng: 185, western_cape: 215, kwazulu_natal: 205, eastern_cape: 190, limpopo: 225, mpumalanga: 210, north_west: 200, free_state: 195, northern_cape: 260, data_source: 'ASAQS Aggregate Survey Jul 2026' },
      { code: 'ASA-SND-FILL', description: 'Fill sand (G5 quality) - per ton', unit: 'ton', national: 110, gauteng: 100, western_cape: 125, kwazulu_natal: 115, eastern_cape: 105, limpopo: 130, mpumalanga: 120, north_west: 115, free_state: 110, northern_cape: 150, data_source: 'ASAQS Aggregate Survey Jul 2026' },
      { code: 'ASA-SND-FILT', description: 'Filter sand (water treatment grade) - per ton', unit: 'ton', national: 350, gauteng: 340, western_cape: 380, kwazulu_natal: 360, eastern_cape: 345, limpopo: 400, mpumalanga: 370, north_west: 360, free_state: 350, northern_cape: 440, data_source: 'ASAQS Aggregate Survey Jul 2026' },
      { code: 'ASA-SND-BLK', description: 'Building sand (blended) - per ton', unit: 'ton', national: 165, gauteng: 155, western_cape: 185, kwazulu_natal: 175, eastern_cape: 160, limpopo: 195, mpumalanga: 180, north_west: 170, free_state: 165, northern_cape: 225, data_source: 'ASAQS Aggregate Survey Jul 2026' },
    ]
  },
  transport: {
    name: 'Transport & Delivery',
    items: [
      { code: 'ASA-TRN-10T', description: 'Transport (10-ton load, 0-25km) - per load', unit: 'each', national: 850, gauteng: 800, western_cape: 920, kwazulu_natal: 880, eastern_cape: 850, limpopo: 980, mpumalanga: 920, north_west: 880, free_state: 860, northern_cape: 1100, data_source: 'ASAQS Transport Index Jul 2026' },
      { code: 'ASA-TRN-10T50', description: 'Transport (10-ton load, 26-50km) - per load', unit: 'each', national: 1200, gauteng: 1150, western_cape: 1300, kwazulu_natal: 1250, eastern_cape: 1200, limpopo: 1400, mpumalanga: 1300, north_west: 1250, free_state: 1220, northern_cape: 1550, data_source: 'ASAQS Transport Index Jul 2026' },
      { code: 'ASA-TRN-20T', description: 'Transport (20-ton load, 0-25km) - per load', unit: 'each', national: 1400, gauteng: 1350, western_cape: 1550, kwazulu_natal: 1450, eastern_cape: 1400, limpopo: 1650, mpumalanga: 1550, north_west: 1450, free_state: 1420, northern_cape: 1800, data_source: 'ASAQS Transport Index Jul 2026' },
    ]
  }
};

export function searchASAQA(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(ASAQA_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default ASAQA_CATEGORIES;
