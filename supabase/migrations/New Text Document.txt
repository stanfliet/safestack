INSERT INTO pricing_data (user_id, category, item_code, description, unit, unit_price, region, auto_update_schedule) VALUES
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Materials', 'MAT-CEM-001', 'Cement 42.5N (50kg bag)', 'bag', 95.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Materials', 'MAT-CEM-002', 'Cement 32.5N (50kg bag)', 'bag', 82.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Materials', 'MAT-STL-001', 'Y10 Reinforcing Steel (6m)', 'length', 85.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Labour', 'LAB-GEN-001', 'General Worker (Basic)', 'hour', 28.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Labour', 'LAB-BRC-001', 'Bricklayer', 'hour', 52.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Labour', 'LAB-ELC-001', 'Electrician', 'hour', 72.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Plant', 'PLN-EXC-001', 'Excavator 20ton (with operator)', 'hour', 850.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Plant', 'PLN-TLB-001', 'TLB Backhoe Loader (with operator)', 'hour', 550.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Subcontractor', 'SUB-CON-001', 'Concrete Supply & Pump (per m³)', 'm3', 1650.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Transport', 'TRN-MAT-001', 'Materials Delivery (local up to 50km)', 'load', 850.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Other', 'OTH-PPE-001', 'Safety Hard Hat (Standard)', 'each', 85.00, 'Gauteng', 'monthly'),
('9d4dbca0-06da-4566-b701-abdd2bdae1a0', 'Other', 'OTH-FNC-001', 'Heras Fencing Panel (3.5m x 2m) - Hire/week', 'week', 35.00, 'Gauteng', 'monthly')
ON CONFLICT DO NOTHING;