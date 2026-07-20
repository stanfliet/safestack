-- ============================================================
-- SAFESTACK - MISSING TABLES & FIXES (Migration 00005)
-- ============================================================

-- 1. Ensure pricing_data table exists with all required columns
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS institution TEXT;
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS supply_rate DECIMAL(12,2);
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS install_rate DECIMAL(12,2);
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS total_rate DECIMAL(12,2);
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'national';
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS auto_update_schedule TEXT;
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS effective_date DATE;
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS pricing_data ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pricing_data_category ON pricing_data(category);
CREATE INDEX IF NOT EXISTS idx_pricing_data_institution ON pricing_data(institution);
CREATE INDEX IF NOT EXISTS idx_pricing_data_user_id ON pricing_data(user_id);

-- 3. Update existing seed data with institution info
UPDATE pricing_data SET institution = 'SANRAL' WHERE category IN ('Transport', 'Materials') AND institution IS NULL;
UPDATE pricing_data SET institution = 'BIBC' WHERE category = 'Labour' AND institution IS NULL;
UPDATE pricing_data SET institution = 'BCCEI' WHERE category = 'Plant' AND institution IS NULL;

-- 4. Verify pricing_data table structure
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pricing_data' ORDER BY ordinal_position;
