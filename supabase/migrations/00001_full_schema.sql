-- SAFESTACK Full Schema
-- Migration 00001: All tables, enums, RLS policies

-- ===== ENUMS =====
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
    CREATE TYPE project_status AS ENUM ('planning', 'construction', 'handover', 'completed', 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inspection_status') THEN
    CREATE TYPE inspection_status AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_severity') THEN
    CREATE TYPE incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_status') THEN
    CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'resolved', 'closed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tender_status') THEN
    CREATE TYPE tender_status AS ENUM ('draft', 'submitted', 'won', 'lost', 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'worker_status') THEN
    CREATE TYPE worker_status AS ENUM ('active', 'inactive', 'suspended');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'compliance_status') THEN
    CREATE TYPE compliance_status AS ENUM ('compliant', 'non_compliant', 'not_applicable', 'pending');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_plan') THEN
    CREATE TYPE billing_plan AS ENUM ('free', 'starter', 'professional', 'enterprise');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_status') THEN
    CREATE TYPE billing_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_doc_type') THEN
    CREATE TYPE ai_doc_type AS ENUM ('template', 'smart', 'custom');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_doc_status') THEN
    CREATE TYPE ai_doc_status AS ENUM ('draft', 'generating', 'completed', 'failed');
  END IF;
END $$;

-- ===== TABLES =====

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  budget NUMERIC(12,2),
  status project_status DEFAULT 'planning',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Safety Files
CREATE TABLE IF NOT EXISTS safety_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  version INT DEFAULT 1,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Risk Assessments
CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  hazard TEXT,
  risk_level TEXT,
  controls TEXT,
  likelihood INT CHECK (likelihood BETWEEN 1 AND 5),
  severity INT CHECK (severity BETWEEN 1 AND 5),
  score INT GENERATED ALWAYS AS (likelihood * severity) STORED,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inspections
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  area TEXT,
  inspection_date DATE NOT NULL,
  inspector_name TEXT,
  status inspection_status DEFAULT 'scheduled',
  score NUMERIC(5,2),
  findings JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  incident_date DATE NOT NULL,
  severity incident_severity DEFAULT 'medium',
  status incident_status DEFAULT 'open',
  reported_by TEXT,
  investigation_notes TEXT,
  root_cause TEXT,
  corrective_actions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Workers
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  id_number TEXT,
  phone TEXT,
  email TEXT,
  position TEXT,
  status worker_status DEFAULT 'active',
  induction_date DATE,
  induction_expiry DATE,
  certifications JSONB DEFAULT '[]',
  training_records JSONB DEFAULT '[]',
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tenders
CREATE TABLE IF NOT EXISTS tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  tender_number TEXT,
  issue_date DATE,
  submission_date DATE,
  budget NUMERIC(12,2),
  status tender_status DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing Database
CREATE TABLE IF NOT EXISTS pricing_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_code TEXT,
  description TEXT,
  unit TEXT,
  unit_price NUMERIC(10,2),
  region TEXT,
  supplier TEXT,
  effective_date DATE,
  auto_update_schedule TEXT DEFAULT 'monthly',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compliance Items
CREATE TABLE IF NOT EXISTS compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  regulation TEXT NOT NULL,
  requirement TEXT,
  status compliance_status DEFAULT 'pending',
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contractors (onboarding)
CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  tax_number TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  services TEXT,
  insurance_doc_url TEXT,
  safety_file_url TEXT,
  status TEXT DEFAULT 'pending_onboarding',
  onboarding_step INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions / Billing
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan billing_plan DEFAULT 'free',
  status billing_status DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  status TEXT DEFAULT 'pending',
  stripe_invoice_id TEXT,
  invoice_url TEXT,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Generated Documents
CREATE TABLE IF NOT EXISTS ai_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  doc_type ai_doc_type DEFAULT 'template',
  prompt TEXT,
  content TEXT,
  status ai_doc_status DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cookie Consent
CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  consent_type TEXT NOT NULL,
  functional BOOLEAN DEFAULT false,
  analytics BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  consented_at TIMESTAMPTZ DEFAULT now()
);

-- ===== INDEXES =====
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_inspections_project_id ON inspections(project_id);
CREATE INDEX idx_inspections_user_id ON inspections(user_id);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_inspections_date ON inspections(inspection_date);
CREATE INDEX idx_incidents_project_id ON incidents(project_id);
CREATE INDEX idx_incidents_user_id ON incidents(user_id);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_workers_user_id ON workers(user_id);
CREATE INDEX idx_workers_project_id ON workers(project_id);
CREATE INDEX idx_tenders_user_id ON tenders(user_id);
CREATE INDEX idx_tenders_status ON tenders(status);
CREATE INDEX idx_pricing_user_id ON pricing_data(user_id);
CREATE INDEX idx_pricing_category ON pricing_data(category);
CREATE INDEX idx_compliance_user_id ON compliance_items(user_id);
CREATE INDEX idx_compliance_project_id ON compliance_items(project_id);
CREATE INDEX idx_contractors_user_id ON contractors(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_ai_documents_user_id ON ai_documents(user_id);
CREATE INDEX idx_safety_files_project_id ON safety_files(project_id);
CREATE INDEX idx_risk_assessments_project_id ON risk_assessments(project_id);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile; admins can read all
CREATE POLICY profiles_self ON profiles FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY profiles_admin_select ON profiles FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- Projects: user manages own projects
CREATE POLICY projects_user ON projects FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Safety Files: through project ownership
CREATE POLICY safety_files_user ON safety_files FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = safety_files.project_id AND projects.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = safety_files.project_id AND projects.user_id = auth.uid())
);

-- Risk Assessments: through project ownership
CREATE POLICY risk_assessments_user ON risk_assessments FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = risk_assessments.project_id AND projects.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = risk_assessments.project_id AND projects.user_id = auth.uid())
);

-- Inspections: user manages own
CREATE POLICY inspections_user ON inspections FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY inspections_project_access ON inspections FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = inspections.project_id AND projects.user_id = auth.uid())
);

-- Incidents: user manages own
CREATE POLICY incidents_user ON incidents FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY incidents_project_access ON incidents FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = incidents.project_id AND projects.user_id = auth.uid())
);

-- Workers: user manages own
CREATE POLICY workers_user ON workers FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Tenders: user manages own
CREATE POLICY tenders_user ON tenders FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Pricing Data: user manages own
CREATE POLICY pricing_user ON pricing_data FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Compliance Items: user manages own
CREATE POLICY compliance_user ON compliance_items FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Contractors: user manages own
CREATE POLICY contractors_user ON contractors FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Subscriptions: user sees own; admins see all
CREATE POLICY subscriptions_self ON subscriptions FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY subscriptions_admin ON subscriptions FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- Invoices: user sees own
CREATE POLICY invoices_user ON invoices FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- AI Documents: user manages own
CREATE POLICY ai_documents_user ON ai_documents FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Cookie Consents: insert-only for anon; select own for auth
CREATE POLICY cookie_consents_insert ON cookie_consents FOR INSERT WITH CHECK (true);
CREATE POLICY cookie_consents_select ON cookie_consents FOR SELECT USING (user_id = auth.uid());

-- ===== AUTO-UPDATE TRIGGER FOR updated_at =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_files_updated_at BEFORE UPDATE ON safety_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risk_assessments_updated_at BEFORE UPDATE ON risk_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenders_updated_at BEFORE UPDATE ON tenders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON pricing_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_updated_at BEFORE UPDATE ON compliance_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_documents_updated_at BEFORE UPDATE ON ai_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
