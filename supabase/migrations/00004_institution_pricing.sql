-- SAFESTACK Institution Pricing
-- Migration 00004: Add institution columns + seed 2026 institutional rates

-- ===== CREATE SYSTEM USER FOR REFERENCE ROWS =====
-- Required because pricing_data.user_id has FK -> profiles(id) -> auth.users(id)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_token, email_change_token_new, email_change, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin, phone_confirmed_at)
VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'system@safestack.app', '', now(), now(), '', '', '', '', '{"provider":"email"}', '{}', now(), now(), false, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name)
VALUES ('00000000-0000-0000-0000-000000000000', 'system@safestack.app', 'System')
ON CONFLICT (id) DO NOTHING;

-- ===== ADD COLUMNS TO PRICING_DATA =====
ALTER TABLE pricing_data ADD COLUMN IF NOT EXISTS institution TEXT;
ALTER TABLE pricing_data ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE pricing_data ADD COLUMN IF NOT EXISTS valid_from DATE;

CREATE INDEX IF NOT EXISTS idx_pricing_institution ON pricing_data(institution);

-- ===== SANRAL 2026 SCHEDULE OF RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Site Clearance', 'SAN-CLR-001', 'Clear & grub site (light vegetation)', 'm2', 12.50, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Site Clearance', 'SAN-CLR-002', 'Clear & grub site (medium vegetation)', 'm2', 18.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Site Clearance', 'SAN-CLR-003', 'Clear & grub site (heavy vegetation)', 'm2', 28.50, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Earthworks', 'SAN-EAR-001', 'Excavation in bulk (common earth)', 'm3', 45.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Earthworks', 'SAN-EAR-002', 'Excavation in rock (rippable)', 'm3', 95.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Earthworks', 'SAN-EAR-003', 'Excavation in rock (hard/blasting)', 'm3', 185.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Earthworks', 'SAN-EAR-004', 'Fill & compact to 95% MOD AASHTO', 'm3', 55.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Earthworks', 'SAN-EAR-005', 'Fill & compact to 100% MOD AASHTO', 'm3', 72.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Layers', 'SAN-LYR-001', 'G2 Base Course (compacted)', 'm3', 210.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Layers', 'SAN-LYR-002', 'G3 Subbase (compacted)', 'm3', 175.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Layers', 'SAN-LYR-003', 'G5 Selected Layer (compacted)', 'm3', 95.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Layers', 'SAN-LYR-004', 'G6 General Fill (compacted)', 'm3', 65.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Surfacing', 'SAN-SRF-001', 'Asphalt Base Course (40mm thick)', 'm2', 185.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Surfacing', 'SAN-SRF-002', 'Asphalt Wearing Course (30mm thick)', 'm2', 165.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Surfacing', 'SAN-SRF-003', 'Slurry Seal (single layer)', 'm2', 55.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Surfacing', 'SAN-SRF-004', 'Cape Seal (single seal + slurry)', 'm2', 85.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Concrete', 'SAN-CON-001', 'Concrete Class 20MPa (supply & place)', 'm3', 1550.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Concrete', 'SAN-CON-002', 'Concrete Class 25MPa (supply & place)', 'm3', 1680.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Concrete', 'SAN-CON-003', 'Concrete Class 30MPa (supply & place)', 'm3', 1820.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Concrete', 'SAN-CON-004', 'Reinforcement (supply, cut, bend & fix)', 'kg', 28.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Concrete', 'SAN-CON-005', 'Formwork (vertical surfaces)', 'm2', 250.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Drainage', 'SAN-DRN-001', '700mm diam. RC Pipe Culvert Class 100D', 'm', 1250.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Drainage', 'SAN-DRN-002', '1050mm diam. RC Pipe Culvert Class 100D', 'm', 1850.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Drainage', 'SAN-DRN-003', 'Concrete Lined Channel (0.5m depth)', 'm', 650.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Drainage', 'SAN-DRN-004', 'V-drain concrete lined', 'm', 480.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Traffic', 'SAN-TRF-001', 'Road Marking (thermoplastic 100mm wide)', 'm', 45.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Traffic', 'SAN-TRF-002', 'Road Marking (thermoplastic solid line)', 'm', 85.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Traffic', 'SAN-TRF-003', 'Guide Sign (3mm alupanel, 1.2m x 0.6m)', 'each', 2500.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Traffic', 'SAN-TRF-004', 'Road Stud (raised reflective)', 'each', 85.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Traffic', 'SAN-TRF-005', 'Steel W-beam Guardrail (single sided)', 'm', 950.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Traffic', 'SAN-TRF-006', 'Pedestrian Handrail (galvanized steel)', 'm', 650.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Traffic', 'SAN-TRF-007', 'Fencing - Diamond Mesh (1.8m high)', 'm', 280.00, 'National', 'SANRAL', 'SANRAL Schedule 2026', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== BCCEI 2026 CIVIL ENGINEERING RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-001', 'General Worker (Level 1)', 'hour', 28.50, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-002', 'General Worker (Level 2)', 'hour', 34.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-003', 'General Worker (Level 3)', 'hour', 38.50, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-004', 'General Worker (Level 4)', 'hour', 43.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-005', 'Skilled Worker (Level 5)', 'hour', 52.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-006', 'Skilled Worker (Level 6)', 'hour', 58.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-007', 'Artisan (Level 7)', 'hour', 68.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-008', 'Artisan (Level 8)', 'hour', 76.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-009', 'Foreman (Level 9)', 'hour', 85.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BCC-LAB-010', 'Foreman (Level 10)', 'hour', 95.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'BCC-PLN-001', 'Concrete Mixer (1/2 bag) - operator incl.', 'hour', 185.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'BCC-PLN-002', 'Vibrating Compactor Plate', 'hour', 120.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'BCC-PLN-003', 'Scaffolding hire (per m2 of scaffold face)', 'm2', 25.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Allowances', 'BCC-ALL-001', 'Travel Allowance (per km)', 'km', 4.50, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Allowances', 'BCC-ALL-002', 'Subsistence (overnight stay)', 'day', 450.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Allowances', 'BCC-ALL-003', 'Tool Allowance per month', 'month', 250.00, 'National', 'BCCEI', 'BCCEI Main Agreement 2026', '2026-03-01')
ON CONFLICT DO NOTHING;

-- ===== COLTO 2026 STANDARD RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Preliminaries', 'COL-PRE-001', 'Establish & maintain site camp', 'item', 85000.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Preliminaries', 'COL-PRE-002', 'Traffic accommodation & control', 'month', 25000.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Preliminaries', 'COL-PRE-003', 'Environmental management (ECO)', 'month', 18000.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Preliminaries', 'COL-PRE-004', 'Survey & setting out', 'month', 22000.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Preliminaries', 'COL-PRE-005', 'Quality control testing', 'month', 15000.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Roadworks', 'COL-RDW-001', 'Pothole repair (machine cut & fill)', 'm2', 320.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Roadworks', 'COL-RDW-002', 'Crack sealing (routed & sealed)', 'm', 65.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Roadworks', 'COL-RDW-003', 'Patch overlay (40mm asphalt)', 'm2', 285.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Roadworks', 'COL-RDW-004', 'Fog spray / rejuvenation seal', 'm2', 25.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Roadworks', 'COL-RDW-005', 'Milled road surface (10mm depth)', 'm2', 35.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Roadworks', 'COL-RDW-006', 'Milled road surface (40mm depth)', 'm2', 65.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Roadworks', 'COL-RDW-007', 'Gravel road grading (motor grader)', 'km', 3500.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Roadworks', 'COL-RDW-008', 'Gravel road re-sheeting (150mm)', 'm3', 120.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Drainage', 'COL-DRN-001', 'Desilt & clean catchpit / inlet', 'each', 185.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Drainage', 'COL-DRN-002', 'Desilt & clean stormwater pipe (per m)', 'm', 45.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Drainage', 'COL-DRN-003', 'Concrete kerb & channel repair', 'm', 285.00, 'National', 'COLTO', 'COLTO Standard 2026', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== NHBRC 2026 REGISTRATION & LEVY RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Registration', 'NHB-REG-001', 'Home Builder Registration (annual)', 'each', 650.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01'),
('00000000-0000-0000-0000-000000000000', 'Registration', 'NHB-REG-002', 'Home Builder Renewal (annual)', 'each', 550.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01'),
('00000000-0000-0000-0000-000000000000', 'Levies', 'NHB-LEV-001', 'Enrolment Levy (homes up to R500k)', 'each', 350.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01'),
('00000000-0000-0000-0000-000000000000', 'Levies', 'NHB-LEV-002', 'Enrolment Levy (homes R500k - R1M)', 'each', 750.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01'),
('00000000-0000-0000-0000-000000000000', 'Levies', 'NHB-LEV-003', 'Enrolment Levy (homes R1M - R3M)', 'each', 1500.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01'),
('00000000-0000-0000-0000-000000000000', 'Levies', 'NHB-LEV-004', 'Enrolment Levy (homes R3M+ )', 'each', 2500.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'NHB-FEE-001', 'Inspection Fee (per inspection)', 'each', 480.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'NHB-FEE-002', 'Late Enrolment Penalty', 'each', 1500.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'NHB-FEE-003', 'Certificate of Occupancy (application)', 'each', 350.00, 'National', 'NHBRC', 'NHBRC Fee Schedule 2026', '2026-04-01')
ON CONFLICT DO NOTHING;

-- ===== DOL 2026 SECTORAL DETERMINATION =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-001', 'General Worker (Area A - Metro)', 'hour', 27.50, 'Area A', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-002', 'General Worker (Area B - Urban)', 'hour', 24.00, 'Area B', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-003', 'General Worker (Area C - Rural)', 'hour', 21.50, 'Area C', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-004', 'Skilled Worker (Area A)', 'hour', 42.00, 'Area A', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-005', 'Skilled Worker (Area B)', 'hour', 37.50, 'Area B', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-006', 'Skilled Worker (Area C)', 'hour', 34.00, 'Area C', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-007', 'Apprentice (Year 1)', 'hour', 16.00, 'National', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-008', 'Apprentice (Year 2)', 'hour', 19.00, 'National', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-009', 'Apprentice (Year 3)', 'hour', 22.00, 'National', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'Minimum Wages', 'DOL-WGE-010', 'Apprentice (Year 4)', 'hour', 25.00, 'National', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'UIF', 'DOL-UIF-001', 'UIF Contribution (employer - % of wage)', 'percent', 1.00, 'National', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'UIF', 'DOL-UIF-002', 'UIF Contribution (employee - % of wage)', 'percent', 1.00, 'National', 'DOL', 'Sectoral Determination 2026', '2026-03-01'),
('00000000-0000-0000-0000-000000000000', 'SDL', 'DOL-SDL-001', 'SDL (Skills Dev Levy - % of payroll)', 'percent', 1.00, 'National', 'DOL', 'Sectoral Determination 2026', '2026-03-01')
ON CONFLICT DO NOTHING;

-- ===== BIBC 2026 BUILDING RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-001', 'Bricklayer', 'hour', 58.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-002', 'Carpenter', 'hour', 56.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-003', 'Concretor', 'hour', 54.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-004', 'Plasterer', 'hour', 55.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-005', 'Painter', 'hour', 48.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-006', 'Plumber', 'hour', 65.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-007', 'Electrician', 'hour', 72.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-008', 'Tile Layer', 'hour', 52.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-009', 'General Worker', 'hour', 30.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'BIB-LAB-010', 'Foreman', 'hour', 85.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Allowances', 'BIB-ALL-001', 'Travel Allowance per day', 'day', 35.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Allowances', 'BIB-ALL-002', 'Night Work Allowance (additional)', 'hour', 12.50, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Allowances', 'BIB-ALL-003', 'Overtime (1.5x basic rate)', 'hour', 0.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01'),
('00000000-0000-0000-0000-000000000000', 'Allowances', 'BIB-ALL-004', 'Sunday work (2x basic rate)', 'hour', 0.00, 'National', 'BIBC', 'BIBC Main Agreement 2026', '2026-06-01')
ON CONFLICT DO NOTHING;

-- ===== WIETA 2026 AUDIT & CERTIFICATION =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Certification', 'WIE-CER-001', 'Initial Certification Audit (small - 1-50 workers)', 'each', 12000.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Certification', 'WIE-CER-002', 'Initial Certification Audit (medium - 51-200 workers)', 'each', 18500.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Certification', 'WIE-CER-003', 'Initial Certification Audit (large - 200+ workers)', 'each', 25000.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Certification', 'WIE-CER-004', 'Annual Surveillance Audit', 'each', 8000.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Certification', 'WIE-CER-005', 'Re-certification Audit (3-year cycle)', 'each', 10000.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'WIE-FEE-001', 'Annual Membership Fee (small)', 'year', 2500.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'WIE-FEE-002', 'Annual Membership Fee (medium)', 'year', 5500.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'WIE-FEE-003', 'Annual Membership Fee (large)', 'year', 9500.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'WIE-FEE-004', 'Certificate Issuance Fee', 'each', 500.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'WIE-FEE-005', 'Appeal Fee', 'each', 2000.00, 'National', 'WIETA', 'WIETA Fee Schedule 2026', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== TJEKA 2026 TRAINING RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-001', 'Construction Health & Safety NQF Level 1', 'learner', 3500.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-002', 'Construction Health & Safety NQF Level 2', 'learner', 4200.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-003', 'Construction Health & Safety NQF Level 3', 'learner', 5200.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-004', 'Scaffolding Erection NQF Level 3', 'learner', 4800.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-005', 'Plumbing NQF Level 2', 'learner', 4500.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-006', 'Bricklaying NQF Level 2', 'learner', 3800.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-007', 'Carpentry NQF Level 2', 'learner', 4200.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-008', 'Rigging NQF Level 3', 'learner', 5500.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-009', 'Road Construction NQF Level 2', 'learner', 4600.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'TJE-TRN-010', 'Concrete Structures NQF Level 3', 'learner', 5100.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'TJE-FEE-001', 'Skills Levy Contribution (SETA)', 'percent', 1.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'TJE-FEE-002', 'RPL Assessment (Recognition Prior Learning)', 'each', 1800.00, 'National', 'TJEKA', 'TJEKA Training Schedule 2026', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== ASAQWA 2026 QUARRY RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-001', 'G1 Crushed Stone (road base)', 'ton', 195.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-002', 'G2 Crushed Stone (road base)', 'ton', 175.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-003', 'G3 Crushed Stone (subbase)', 'ton', 145.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-004', 'G4 Crushed Stone (selected layer)', 'ton', 125.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-005', 'G5 Crushed Stone (selected layer)', 'ton', 110.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-006', '13mm Crushed Stone', 'ton', 185.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-007', '19mm Crushed Stone', 'ton', 175.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-008', 'Crusher Run / G7 Material', 'ton', 95.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-009', 'Concrete Sand', 'ton', 95.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-010', 'Plaster Sand', 'ton', 105.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-011', 'River Sand', 'ton', 120.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-012', 'Blinding Fill', 'ton', 65.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-013', 'Gabion Stone (50mm-200mm)', 'ton', 145.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Aggregates', 'ASQ-AGR-014', 'Riprap Stone (300mm-500mm)', 'ton', 160.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Transport', 'ASQ-TRN-001', 'Delivery (local, 0-20km per ton)', 'ton', 25.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Transport', 'ASQ-TRN-002', 'Delivery (regional, 20-50km per ton)', 'ton', 45.00, 'National', 'ASAQWA', 'ASAQWA Schedule 2026', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== GCC 2010 + 2026 RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Contract', 'GCC-CNT-001', 'Performance Guarantee (standard rate per year)', 'percent', 1.50, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'GCC-CNT-002', 'Retention Bond (standard)', 'percent', 1.25, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'GCC-CNT-003', 'Advance Payment Guarantee', 'percent', 1.75, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'GCC-CNT-004', 'Insurance - All Risks (contract value)', 'percent', 0.35, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'GCC-CNT-005', 'Public Liability Insurance (annual)', 'year', 4500.00, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'GCC-CNT-006', 'Adjudication fee (standard dispute)', 'each', 8500.00, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Rates', 'GCC-RAT-001', 'Preliminary & General (as % of contract)', 'percent', 8.00, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Rates', 'GCC-RAT-002', 'Contingency (design-stage allowance)', 'percent', 5.00, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Rates', 'GCC-RAT-003', 'Contingency (construction-stage)', 'percent', 3.00, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Rates', 'GCC-RAT-004', 'Escalation allowance (annual, materials)', 'percent', 7.50, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Rates', 'GCC-RAT-005', 'Profit & overhead (contractor markup)', 'percent', 15.00, 'National', 'GCC', 'GCC 2026 Schedule', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== FIDIC 2026 RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-001', 'Engineering Design (as % of construction value)', 'percent', 8.50, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-002', 'Project Management (as % of construction value)', 'percent', 4.50, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-003', 'Construction Supervision (as % of construction value)', 'percent', 3.50, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-004', 'Quantity Surveying Services (as % of construction value)', 'percent', 3.00, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-005', 'Environmental Impact Assessment', 'each', 85000.00, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-006', 'Geotechnical Investigation (per borehole)', 'borehole', 12000.00, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-007', 'Structural Engineering (per m2 of floor area)', 'm2', 85.00, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-008', 'Civil Engineering (per project value bracket)', 'percent', 6.50, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-009', 'Electrical Engineering (per project value bracket)', 'percent', 5.50, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Consulting', 'FID-CON-010', 'Mechanical Engineering (per project value bracket)', 'percent', 6.00, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Dispute', 'FID-DSP-001', 'Adjudication Board (3 member panel) per day', 'day', 45000.00, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Dispute', 'FID-DSP-002', 'DAAB (Dispute Avoidance/Adjudication Board) annual retainer', 'year', 120000.00, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Dispute', 'FID-DSP-003', 'Expert Witness (per hour)', 'hour', 2500.00, 'National', 'FIDIC', 'FIDIC Fee Schedule 2026', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== JBBCC 2026 RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Contract', 'JBB-CNT-001', 'JBBCC Contract Document Set (JBCC Series 6.1)', 'set', 2500.00, 'National', 'JBBCC', 'JBBCC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'JBB-CNT-002', 'Principal Building Agreement (per copy)', 'each', 850.00, 'National', 'JBBCC', 'JBBCC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'JBB-CNT-003', 'Nominated Subcontractor Agreement', 'each', 650.00, 'National', 'JBBCC', 'JBBCC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'JBB-CNT-004', 'JBCC Minor Works Agreement', 'each', 550.00, 'National', 'JBBCC', 'JBBCC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'JBB-FEE-001', 'JBCC Annual Subscription (main contractor)', 'year', 3500.00, 'National', 'JBBCC', 'JBBCC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'JBB-FEE-002', 'JBCC Annual Subscription (subcontractor)', 'year', 2500.00, 'National', 'JBBCC', 'JBBCC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'JBB-FEE-003', 'JBCC Annual Subscription (professional)', 'year', 2000.00, 'National', 'JBBCC', 'JBBCC Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Fees', 'JBB-FEE-004', 'Training Course - JBCC Contract Administration', 'each', 4500.00, 'National', 'JBBCC', 'JBBCC Fee Schedule 2026', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== NEC 2026 RATES =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'Contract', 'NEC-CNT-001', 'NEC4 Engineering & Construction Contract (ECC)', 'set', 3500.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'NEC-CNT-002', 'NEC4 Professional Service Contract (PSC)', 'set', 2800.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'NEC-CNT-003', 'NEC4 Short Contract (ECSC)', 'set', 1800.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'NEC-CNT-004', 'NEC4 Term Service Contract (TSC)', 'set', 2500.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Contract', 'NEC-CNT-005', 'NEC4 Design Build & Operate (DBO)', 'set', 3200.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'NEC-TRN-001', 'NEC4 Project Manager Accreditation', 'each', 12000.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'NEC-TRN-002', 'NEC4 Supervisor Accreditation', 'each', 9500.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'NEC-TRN-003', 'NEC4 ECC Workshop (2-day)', 'each', 7500.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'NEC-TRN-004', 'NEC4 Online Self-Paced Course', 'each', 3500.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Software', 'NEC-SFT-001', 'NEC Software Annual Licence (single user)', 'year', 8500.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Software', 'NEC-SFT-002', 'NEC Software Annual Licence (team - 5 users)', 'year', 28000.00, 'National', 'NEC', 'NEC4 Fee Schedule 2026', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ===== HEALTH & SAFETY BODIES 2026 =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, institution, source, valid_from) VALUES
('00000000-0000-0000-0000-000000000000', 'SACPCMP', 'HSE-SAC-001', 'CHSM Registration (Construction H&S Manager)', 'year', 2500.00, 'National', 'Health & Safety Bodies', 'SACPCMP Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'SACPCMP', 'HSE-SAC-002', 'CHSP Registration (Construction H&S Practitioner)', 'year', 2200.00, 'National', 'Health & Safety Bodies', 'SACPCMP Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'SACPCMP', 'HSE-SAC-003', 'CHSO Registration (H&S Officer)', 'year', 1500.00, 'National', 'Health & Safety Bodies', 'SACPCMP Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'SACPCMP', 'HSE-SAC-004', 'Annual Renewal Fee (CHSM)', 'year', 1500.00, 'National', 'Health & Safety Bodies', 'SACPCMP Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'SACPCMP', 'HSE-SAC-005', 'Annual Renewal Fee (CHSP)', 'year', 1200.00, 'National', 'Health & Safety Bodies', 'SACPCMP Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'SACPCMP', 'HSE-SAC-006', 'Annual Renewal Fee (CHSO)', 'year', 800.00, 'National', 'Health & Safety Bodies', 'SACPCMP Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'SACPCMP', 'HSE-SAC-007', 'Late Renewal Penalty', 'each', 500.00, 'National', 'Health & Safety Bodies', 'SACPCMP Fee Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'OHS Act', 'HSE-OHS-001', 'OHS Act Compliance Audit (small site, 2 days)', 'audit', 8500.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'OHS Act', 'HSE-OHS-002', 'OHS Act Compliance Audit (medium site, 3-4 days)', 'audit', 14500.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'OHS Act', 'HSE-OHS-003', 'OHS Act Compliance Audit (large site, 5+ days)', 'audit', 22500.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'OHS Act', 'HSE-OHS-004', 'Incident Investigation Report', 'each', 5500.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'OHS Act', 'HSE-OHS-005', 'Safety File Development (small contractor)', 'file', 12000.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'OHS Act', 'HSE-OHS-006', 'Safety File Development (medium contractor)', 'file', 18500.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'SANS', 'HSE-SAN-001', 'SANS 10085-1 Fire Compliance Assessment', 'each', 6500.00, 'National', 'Health & Safety Bodies', 'SANS Standards 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'SANS', 'HSE-SAN-002', 'SANS 10400-Building Regs Compliance Review', 'each', 8500.00, 'National', 'Health & Safety Bodies', 'SANS Standards 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'HSE-TRN-001', 'SHE Representative Training (1-day)', 'learner', 1800.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'HSE-TRN-002', 'SAMTRAC Certificate (5-day)', 'learner', 7500.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'HSE-TRN-003', 'First Aid Level 1 (3-day)', 'learner', 1500.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'HSE-TRN-004', 'First Aid Level 2 (4-day)', 'learner', 2200.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'HSE-TRN-005', 'First Aid Level 3 (5-day)', 'learner', 3200.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01'),
('00000000-0000-0000-0000-000000000000', 'Training', 'HSE-TRN-006', 'Fire Fighting Training (1-day)', 'learner', 1200.00, 'National', 'Health & Safety Bodies', 'OHS Act 85 Schedule 2026', '2026-01-01')
ON CONFLICT DO NOTHING;
