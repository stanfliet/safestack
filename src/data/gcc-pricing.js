// SafeStack - GCC Contract Pricing Database (July 2026)
// General Conditions of Contract (GCC 2026) - Contract & Insurance Rates
// Rates in ZAR

export const GCC_CATEGORIES = {
  contract: {
    name: 'GCC Documentation & Administration',
    items: [
      { code: 'GCC-DOC-TENDER', description: 'GCC tender document set (printed) - per set', unit: 'each', national: 2500, gauteng: 2500, western_cape: 2500, kwazulu_natal: 2500, eastern_cape: 2500, limpopo: 2500, mpumalanga: 2500, north_west: 2500, free_state: 2500, northern_cape: 2500, data_source: 'GCC Standard Fee Schedule Jul 2026' },
      { code: 'GCC-DOC-ELECTRONIC', description: 'GCC tender document set (electronic) - per set', unit: 'each', national: 1200, gauteng: 1200, western_cape: 1200, kwazulu_natal: 1200, eastern_cape: 1200, limpopo: 1200, mpumalanga: 1200, north_west: 1200, free_state: 1200, northern_cape: 1200, data_source: 'GCC Standard Fee Schedule Jul 2026' },
      { code: 'GCC-DOC-ADDENDUM', description: 'GCC addendum / corrigenda issuance - per document', unit: 'each', national: 350, gauteng: 350, western_cape: 350, kwazulu_natal: 350, eastern_cape: 350, limpopo: 350, mpumalanga: 350, north_west: 350, free_state: 350, northern_cape: 350, data_source: 'GCC Standard Fee Schedule Jul 2026' },
    ]
  },
  rates: {
    name: 'Insurance & Guarantee Rates',
    items: [
      { code: 'GCC-INS-PI', description: 'Professional Indemnity insurance (annual, per R1M cover) - per R1M', unit: 'rate', national: 8500, gauteng: 8500, western_cape: 9000, kwazulu_natal: 8500, eastern_cape: 8500, limpopo: 9200, mpumalanga: 8800, north_west: 8600, free_state: 8500, northern_cape: 9500, data_source: 'GCC Insurance Schedule Jul 2026' },
      { code: 'GCC-INS-PUBLIC', description: 'Public liability insurance (annual, per R5M cover) - per R5M', unit: 'rate', national: 12000, gauteng: 12000, western_cape: 13000, kwazulu_natal: 12000, eastern_cape: 12000, limpopo: 13500, mpumalanga: 12500, north_west: 12200, free_state: 12000, northern_cape: 14500, data_source: 'GCC Insurance Schedule Jul 2026' },
      { code: 'GCC-INS-LATENT', description: 'Latent defects insurance (10 year, per R1M cover) - per R1M', unit: 'rate', national: 15000, gauteng: 15000, western_cape: 16500, kwazulu_natal: 15500, eastern_cape: 15000, limpopo: 17000, mpumalanga: 16000, north_west: 15500, free_state: 15000, northern_cape: 18500, data_source: 'GCC Insurance Schedule Jul 2026' },
      { code: 'GCC-GUA-TENDER', description: 'Tender guarantee (per R100K, per month) - per R100K', unit: 'month', national: 350, gauteng: 350, wester
