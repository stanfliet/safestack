export interface Inspection {
  id: string;
  title: string;
  area: string;
  inspection_date: string;
  inspector_name: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Worker {
  id: string;
  full_name: string;
  email: string;
  role: string;
  certifications: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}
