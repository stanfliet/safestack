-- SAFESTACK Storage Buckets
-- Migration 00002: Create all required storage buckets and RLS policies

-- ===== CREATE ALL BUCKETS =====
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES 
('safety_documents', 'safety_documents', false, false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/webp']),
('contractor_documents', 'contractor_documents', false, false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
('inspection_photos', 'inspection_photos', false, false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
('incident_evidence', 'incident_evidence', false, false, 104857600, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'application/pdf']),
('worker_certifications', 'worker_certifications', false, false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
('ai_documents', 'ai_documents', false, false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown']),
('tender_documents', 'tender_documents', false, false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
('project_photos', 'project_photos', false, false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('smart_uploads', 'smart_uploads', false, false, 209715200, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
('public_assets', 'public_assets', true, false, 10485760, ARRAY['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- ===== RLS POLICIES FOR ALL BUCKETS =====
DO $$
DECLARE
  buckets TEXT[] := ARRAY['safety_documents','contractor_documents','inspection_photos','incident_evidence','worker_certifications','ai_documents','tender_documents','project_photos','smart_uploads'];
  b TEXT;
BEGIN
  FOREACH b IN ARRAY buckets
  LOOP
    EXECUTE format('CREATE POLICY %I ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = ''authenticated'');', b || '_insert', b);
    EXECUTE format('CREATE POLICY %I ON storage.objects FOR SELECT USING (bucket_id = %L AND auth.role() = ''authenticated'');', b || '_select', b);
    EXECUTE format('CREATE POLICY %I ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.role() = ''authenticated'');', b || '_update', b);
    EXECUTE format('CREATE POLICY %I ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.role() = ''authenticated'');', b || '_delete', b);
  END LOOP;
END $$;

-- Public assets: anyone can read, only authenticated can write
CREATE POLICY "public_assets_select" ON storage.objects FOR SELECT USING (bucket_id = 'public_assets');
CREATE POLICY "public_assets_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'public_assets' AND auth.role() = 'authenticated');
CREATE POLICY "public_assets_update" ON storage.objects FOR UPDATE USING (bucket_id = 'public_assets' AND auth.role() = 'authenticated');
CREATE POLICY "public_assets_delete" ON storage.objects FOR DELETE USING (bucket_id = 'public_assets' AND auth.role() = 'authenticated');