-- SAFESTACK Pricing Database Seed Data
-- Migration 00003: Reference construction pricing for South Africa

-- ===== MATERIALS =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, auto_update_schedule) VALUES
('00000000-0000-0000-0000-000000000000', 'Materials', 'MAT-CEM-001', 'Cement 42.5N (50kg bag)', 'bag', 95.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Materials', 'MAT-CEM-002', 'Cement 32.5N (50kg bag)', 'bag', 82.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Materials', 'MAT-STL-001', 'Y10 Reinforcing Steel (6m)', 'length', 85.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Materials', 'MAT-STL-002', 'Y12 Reinforcing Steel (6m)', 'length', 120.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Materials', 'MAT-STL-003', 'Y16 Reinforcing Steel (6m)', 'length', 215.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Materials', 'MAT-BRK-001', 'Maxi Clay Brick (per 1000)', 'thousand', 4500.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Materials', 'MAT-BRK-002', 'Concrete Hollow Block 190mm (per 1000)', 'thousand', 8500.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-GEN-002', 'General Worker (Skilled)', 'hour', 38.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-BRC-001', 'Bricklayer', 'hour', 52.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-CRP-001', 'Carpenter', 'hour', 55.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-CRP-002', 'Carpenter (Formwork)', 'hour', 58.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-STL-001', 'Steel Fixer', 'hour', 54.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-PMB-001', 'Plumber', 'hour', 65.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-ELC-001', 'Electrician', 'hour', 72.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-PNT-001', 'Painter', 'hour', 45.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-TIL-001', 'Tiler', 'hour', 50.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-PLH-001', 'Plasterer', 'hour', 52.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-SUP-001', 'Site Supervisor', 'hour', 85.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Labour', 'LAB-QTY-001', 'Quantity Surveyor', 'hour', 120.00, 'Gauteng', 'monthly')
ON CONFLICT DO NOTHING;

-- ===== PLANT & EQUIPMENT =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, auto_update_schedule) VALUES
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-EXC-001', 'Excavator 20ton (with operator)', 'hour', 850.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-EXC-002', 'Excavator 14ton (with operator)', 'hour', 650.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-EXC-003', 'Excavator 8ton (with operator)', 'hour', 480.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-TLB-001', 'TLB Backhoe Loader (with operator)', 'hour', 550.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-BUL-001', 'Bulldozer D6 (with operator)', 'hour', 1200.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-GRD-001', 'Grader (with operator)', 'hour', 950.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-CMP-001', 'Compactor Roller (with operator)', 'hour', 650.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-CRN-001', 'Mobile Crane 25ton (with operator)', 'hour', 1100.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-CRN-002', 'Mobile Crane 50ton (with operator)', 'hour', 1800.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-FRK-001', 'Forklift 3ton (with operator)', 'hour', 380.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-TRP-001', 'Tipper Truck 10m³ (with driver)', 'hour', 520.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-TRP-002', 'Tipper Truck 20m³ (with driver)', 'hour', 750.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-MIX-001', 'Concrete Mixer (with operator)', 'hour', 280.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-GEN-001', 'Generator 10kVA (fuel not incl.)', 'hour', 180.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Plant', 'PLN-WLD-001', 'Welding Machine (with operator)', 'hour', 250.00, 'Gauteng', 'monthly')
ON CONFLICT DO NOTHING;

-- ===== SUBCONTRACTOR =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, auto_update_schedule) VALUES
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-CON-001', 'Concrete Supply & Pump (per m³)', 'm3', 1650.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-STL-001', 'Structural Steel Supply & Erect (per kg)', 'kg', 45.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-ROF-001', 'Roof Trusses Supply & Install (per m²)', 'm2', 185.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-ROF-002', 'Ceiling Supply & Install (per m²)', 'm2', 140.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-PMB-001', 'Plumbing Supply & Install (per point)', 'point', 2500.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-ELC-001', 'Electrical Supply & Install (per point)', 'point', 1800.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-PNT-001', 'Painting Supply & Apply (per m²)', 'm2', 65.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-TIL-001', 'Tiling Supply & Install (per m²)', 'm2', 220.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-GLA-001', 'Glazing Supply & Install (per m²)', 'm2', 580.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Subcontractor', 'SUB-WAT-001', 'Waterproofing Supply & Apply (per m²)', 'm2', 175.00, 'Gauteng', 'monthly')
ON CONFLICT DO NOTHING;

-- ===== TRANSPORT =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, auto_update_schedule) VALUES
('00000000-0000-0000-0000-000000000000', 'Transport', 'TRN-MAT-001', 'Materials Delivery (local up to 50km)', 'load', 850.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Transport', 'TRN-MAT-002', 'Materials Delivery (regional 50-150km)', 'load', 1800.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Transport', 'TRN-RUB-001', 'Rubber-Tyred Mobile Crane Transport', 'trip', 3500.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Transport', 'TRN-EXC-001', 'Excavator Low-Bed Transport', 'trip', 4500.00, 'Gauteng', 'monthly')
ON CONFLICT DO NOTHING;

-- ===== OTHER =====
INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, auto_update_schedule) VALUES
('00000000-0000-0000-0000-000000000000', 'Other', 'OTH-PPE-001', 'Safety Hard Hat (Standard)', 'each', 85.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Other', 'OTH-PPE-002', 'Safety Vest (Hi-Vis)', 'each', 45.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Other', 'OTH-PPE-003', 'Safety Boots (Steel Toe)', 'pair', 450.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Other', 'OTH-PPE-004', 'Safety Harness (Full Body)', 'each', 850.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Other', 'OTH-SGN-001', 'Warning Sign (Standard 600x400)', 'each', 120.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Other', 'OTH-SGN-002', 'Construction Site Board (1.2m x 0.9m)', 'each', 650.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Other', 'OTH-FNC-001', 'Heras Fencing Panel (3.5m x 2m) - Hire/week', 'week', 35.00, 'Gauteng', 'monthly'),
('00000000-0000-0000-0000-000000000000', 'Other', 'OTH-TOI-001', 'Chemical Toilet - Hire/week', 'week', 180.00, 'Gauteng', 'monthly')
ON CONFLICT DO NOTHING;