-- SAFESTACK Storage Buckets
-- Migration 00002: Create all required storage buckets with RLS policies
-- Each bucket uses ON CONFLICT DO NOTHING so this is safe to re-run

-- ===== CREATE ALL BUCKETS =====
INSERT INTO storage.buckets (id, name, public) VALUES ('compliance_docs', 'compliance_docs', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('safety_file_attachments', 'safety_file_attachments', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('incident_evidence', 'incident_evidence', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('inspection_photos', 'inspection_photos', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('contractor_docs', 'contractor_docs', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('tender_attachments', 'tender_attachments', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('ai_generated_docs', 'ai_generated_docs', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('training_materials', 'training_materials', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('rate_charts', 'rate_charts', true) ON CONFLICT (id) DO NOTHING;

-- ===== RLS POLICIES FOR PRIVATE BUCKETS =====
-- Each authenticated user can CRUD their own files in the private buckets
DO $$
DECLARE
  b TEXT;
  private_buckets TEXT[] := ARRAY[
    'compliance_docs',
    'safety_file_attachments',
    'incident_evidence',
    'inspection_photos',
    'contractor_docs',
    'tender_attachments',
    'ai_generated_docs'
  ];
BEGIN
  FOREACH b IN ARRAY private_buckets
  LOOP
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = ''authenticated'');',
      b || '_insert', b
    );
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR SELECT USING (bucket_id = %L AND (auth.role() = ''authenticated'' OR auth.role() = ''anon''));',
      b || '_select', b
    );
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.uid() = owner);',
      b || '_update', b
    );
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.uid() = owner);',
      b || '_delete', b
    );
  END LOOP;
END $$;

-- ===== RLS POLICIES FOR PUBLIC BUCKETS =====
-- avatars: anyone can read, authenticated users can insert/update/delete their own
CREATE POLICY "avatars_select" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "avatars_update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
CREATE POLICY "avatars_delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- training_materials: anyone can read, only authenticated can write
CREATE POLICY "training_materials_select" ON storage.objects FOR SELECT USING (bucket_id = 'training_materials');
CREATE POLICY "training_materials_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'training_materials' AND auth.role() = 'authenticated');
CREATE POLICY "training_materials_update" ON storage.objects FOR UPDATE USING (bucket_id = 'training_materials' AND auth.role() = 'authenticated');
CREATE POLICY "training_materials_delete" ON storage.objects FOR DELETE USING (bucket_id = 'training_materials' AND auth.role() = 'authenticated');

-- rate_charts: anyone can read, only authenticated can write
CREATE POLICY "rate_charts_select" ON storage.objects FOR SELECT USING (bucket_id = 'rate_charts');
CREATE POLICY "rate_charts_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'rate_charts' AND auth.role() = 'authenticated');
CREATE POLICY "rate_charts_update" ON storage.objects FOR UPDATE USING (bucket_id = 'rate_charts' AND auth.role() = 'authenticated');
CREATE POLICY "rate_charts_delete" ON storage.objects FOR DELETE USING (bucket_id = 'rate_charts' AND auth.role() = 'authenticated');
