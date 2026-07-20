// SafeStack - COLTO Road Construction Pricing Database (July 2026)
// Committee of Land Transport Officials - Road Construction Standards & Rates
// Rates in ZAR

export const COLTO_CATEGORIES = {
  preliminaries: {
    name: 'Preliminaries & General',
    items: [
      { code: 'COL-PREL-MOB', description: 'Mobilisation & demobilisation - per project', unit: 'ls', national: 250000, gauteng: 240000, western_cape: 270000, kwazulu_natal: 260000, eastern_cape: 250000, limpopo: 285000, mpumalanga: 270000, north_west: 260000, free_state: 255000, northern_cape: 310000, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-PREL-TRAF', description: 'Traffic accommodation & management - per month', unit: 'month', national: 85000, gauteng: 82000, western_cape: 92000, kwazulu_natal: 88000, eastern_cape: 85000, limpopo: 98000, mpumalanga: 92000, north_west: 88000, free_state: 86000, northern_cape: 108000, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-PREL-ENV', description: 'Environmental management & monitoring - per month', unit: 'month', national: 45000, gauteng: 43000, western_cape: 48000, kwazulu_natal: 46000, eastern_cape: 45000, limpopo: 52000, mpumalanga: 48000, north_west: 46000, free_state: 45000, northern_cape: 58000, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-PREL-SURV', description: 'Survey & setting out (full time) - per month', unit: 'month', national: 55000, gauteng: 53000, western_cape: 60000, kwazulu_natal: 57000, eastern_cape: 55000, limpopo: 63000, mpumalanga: 60000, north_west: 57000, free_state: 56000, northern_cape: 68000, data_source: 'COLTO Standard Rates Jul 2026' },
    ]
  },
  roadworks: {
    name: 'Roadworks (Earthworks & Pavement)',
    items: [
      { code: 'COL-RD-CLEAR', description: 'Site clearance (topsoil strip 150mm) - per m²', unit: 'm2', national: 8.50, gauteng: 8.00, western_cape: 9.50, kwazulu_natal: 9.00, eastern_cape: 8.50, limpopo: 10.00, mpumalanga: 9.50, north_west: 9.00, free_state: 8.80, northern_cape: 12.00, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-RD-EXC', description: 'Bulk excavation (cut to fill) - per m³', unit: 'm3', national: 65, gauteng: 62, western_cape: 72, kwazulu_natal: 68, eastern_cape: 65, limpopo: 78, mpumalanga: 72, north_west: 68, free_state: 66, northern_cape: 85, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-RD-G7', description: 'G7 selected subgrade layer (150mm) - per m²', unit: 'm2', national: 35, gauteng: 33, western_cape: 38, kwazulu_natal: 36, eastern_cape: 35, limpopo: 42, mpumalanga: 38, north_west: 36, free_state: 35, northern_cape: 48, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-RD-G5', description: 'G5 subbase layer (150mm) - per m²', unit: 'm2', national: 42, gauteng: 40, western_cape: 46, kwazulu_natal: 44, eastern_cape: 42, limpopo: 50, mpumalanga: 46, north_west: 44, free_state: 43, northern_cape: 56, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-RD-G1', description: 'G1 base course layer (150mm) - per m²', unit: 'm2', national: 65, gauteng: 62, western_cape: 72, kwazulu_natal: 68, eastern_cape: 65, limpopo: 78, mpumalanga: 72, north_west: 68, free_state: 66, northern_cape: 85, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-RD-PRIME', description: 'Prime coat (SS1) - per m²', unit: 'm2', national: 18, gauteng: 17, western_cape: 20, kwazulu_natal: 19, eastern_cape: 18, limpopo: 22, mpumalanga: 20, north_west: 19, free_state: 18, northern_cape: 25, data_source: 'COLTO Standard Rates Jul 2026' },
    ]
  },
  drainage: {
    name: 'Drainage & Culverts',
    items: [
      { code: 'COL-DRN-CULV', description: 'Concrete pipe culvert (900mm) - per m', unit: 'm', national: 2800, gauteng: 2700, western_cape: 3050, kwazulu_natal: 2900, eastern_cape: 2800, limpopo: 3200, mpumalanga: 3050, north_west: 2900, free_state: 2850, northern_cape: 3500, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-DRN-CULV600', description: 'Concrete pipe culvert (600mm) - per m', unit: 'm', national: 1800, gauteng: 1720, western_cape: 1950, kwazulu_natal: 1860, eastern_cape: 1800, limpopo: 2100, mpumalanga: 1950, north_west: 1860, free_state: 1820, northern_cape: 2300, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-DRN-LINED', description: 'Lined open drain (concrete 600mm wide) - per m', unit: 'm', national: 450, gauteng: 430, western_cape: 490, kwazulu_natal: 460, eastern_cape: 450, limpopo: 520, mpumalanga: 490, north_west: 460, free_state: 455, northern_cape: 580, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-DRN-GAB', description: 'Gabion mattress (300mm thick) - per m²', unit: 'm2', national: 550, gauteng: 530, western_cape: 600, kwazulu_natal: 570, eastern_cape: 550, limpopo: 630, mpumalanga: 600, north_west: 570, free_state: 560, northern_cape: 700, data_source: 'COLTO Standard Rates Jul 2026' },
    ]
  },
  structures: {
    name: 'Structures (Bridges & Retaining Walls)',
    items: [
      { code: 'COL-STR-BRIDGE', description: 'Reinforced concrete bridge deck - per m²', unit: 'm2', national: 8500, gauteng: 8200, western_cape: 9200, kwazulu_natal: 8800, eastern_cape: 8500, limpopo: 9800, mpumalanga: 9200, north_west: 8800, free_state: 8600, northern_cape: 10800, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-STR-RET', description: 'Reinforced concrete retaining wall (3m high) - per m²', unit: 'm2', national: 3200, gauteng: 3100, western_cape: 3500, kwazulu_natal: 3300, eastern_cape: 3200, limpopo: 3700, mpumalanga: 3500, north_west: 3300, free_state: 3250, northern_cape: 4000, data_source: 'COLTO Standard Rates Jul 2026' },
      { code: 'COL-STR-ABUT', description: 'Bridge abutment (RC, per m³) - per m³', unit: 'm3', national: 4500, gauteng: 4300, western_cape: 4900, kwazulu_natal: 4600, eastern_cape: 4500, limpopo: 5200, mpumalanga: 4900, north_west: 4600, free_state: 4550, northern_cape: 5800, data_source: 'COLTO Standard Rates Jul 2026' },
    ]
  }
};

export function searchCOLTO(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(COLTO_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default COLTO_CATEGORIES;
