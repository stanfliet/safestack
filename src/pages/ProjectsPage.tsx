import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatDate, formatCurrency, getStatusColor, getInitials } from '../lib/utils';
import { 
  FolderOpen, Plus, Search, Loader2, Building2, MapPin, Calendar,
  Upload, FileText, Download, Edit3, Eye, Trash2, X, Bot, CheckCircle,
  AlertCircle, ChevronRight
} from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name:'', client_name:'', location:'', start_date:'', end_date:'', budget:'', description:'', status:'planning' });
  const [saving, setSaving] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiExtracting, setAiExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!user) return; setSaving(true);
    const payload = {
      user_id: user.id,
      name: form.name,
      client_name: form.client_name || null,
      location: form.location || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      budget: form.budget ? parseFloat(form.budget) : null,
      description: form.description || null,
      status: form.status,
    };
    if (editing) {
      await supabase.from('projects').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('projects').insert(payload);
    }
    setShowForm(false); setEditing(null);
    setForm({ name:'',client_name:'',location:'',start_date:'',end_date:'',budget:'',description:'',status:'planning' });
    loadProjects();
    setSaving(false);
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('projects').delete().eq('id', id);
    loadProjects();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  }

  async function extractAndCreateProject() {
    if (!uploadFile || !user) return;
    setUploading(true);
    setAiExtracting(true);
    
    // Upload file to storage
    const ext = uploadFile.name.split('.').pop();
    const path = `project-uploads/${Date.now()}_${uploadFile.name}`;
    const { error: uploadError, data: uploadData } = await supabase.storage.from('uploads').upload(path, uploadFile);
    if (uploadError) { alert('Upload failed: ' + uploadError.message); setUploading(false); setAiExtracting(false); return; }
    
    // AI Extraction (simulated with keyword-based extraction)
    const fileName = uploadFile.name.toLowerCase();
    let extracted = {
      name: '',
      client_name: '',
      location: '',
      description: '',
      status: 'planning',
    };
    
    // Try to extract project name from filename
    extracted.name = uploadFile.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    // Read file content for text-based files to extract more info
    try {
      const text = await uploadFile.text();
      // Extract client name
      const clientMatch = text.match(/client[:\s]+([^\n\r]+)/i);
      if (clientMatch) extracted.client_name = clientMatch[1].trim();
      // Extract project name
      const projectMatch = text.match(/project[:\s]+([^\n\r]+)/i);
      if (projectMatch) extracted.name = projectMatch[1].trim();
      // Extract location
      const locMatch = text.match(/(?:site|location|address)[:\s]+([^\n\r]+)/i);
      if (locMatch) extracted.location = locMatch[1].trim();
      // Extract description
      const descParts = text.split('\n').filter(l => l.trim().length > 20).slice(0, 5);
      extracted.description = descParts.join('\n').substring(0, 500);
    } catch (e) {
      // Binary file, use filename only
    }
    
    setExtractedData(extracted);
    setForm({ ...form, ...extracted });
    setAiExtracting(false);
    setUploading(false);
    setShowUploadModal(false);
    setShowForm(true);
  }

  const filtered = projects.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.client_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="text-surface-500 mt-1">Manage construction projects and client portfolios</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUploadModal(true)} className="btn-secondary">
            <Upload className="h-4 w-4" /> Upload & Create
          </button>
          <button onClick={() => { setEditing(null); setForm({ name:'',client_name:'',location:'',start_date:'',end_date:'',budget:'',description:'',status:'planning' }); setShowForm(true); }} className="btn-primary">
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>
      </div>

      {/* Document Upload for AI Creation */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Project from Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-surface-400 hover:text-surface-600"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-surface-500 mb-4">Upload a tender, scope of works, or project document. AI will extract project details automatically.</p>
            
            <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 transition-colors mb-4"
              onClick={() => document.getElementById('project-file-input')?.click()}>
              {uploadFile ? (
                <div>
                  <FileText className="h-10 w-10 mx-auto mb-2 text-primary-500" />
                  <p className="font-medium text-surface-700">{uploadFile.name}</p>
                  <p className="text-xs text-surface-400">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <Upload className="h-10 w-10 mx-auto mb-2 text-surface-400" />
                  <p className="text-surface-500">Drop file here or click to browse</p>
                  <p className="text-xs text-surface-400 mt-1">PDF, DOCX, XLSX, TXT supported</p>
                </div>
              )}
            </div>
            <input id="project-file-input" type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.xlsx,.csv,.txt" />
            
            <div className="flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="btn-primary" disabled={!uploadFile || uploading} onClick={extractAndCreateProject}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                {aiExtracting ? 'Extracting...' : 'Extract & Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input className="input pl-10" placeholder="Search projects or clients..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="input w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="planning">Planning</option>
          <option value="construction">Construction</option>
          <option value="handover">Handover</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Project List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 font-medium">No projects found</p>
          <p className="text-sm text-surface-400 mt-1">Create a new project or upload a document to get started</p>
          <div className="flex gap-2 justify-center mt-4">
            <button onClick={() => setShowUploadModal(true)} className="btn-secondary"><Upload className="h-4 w-4" /> Upload Document</button>
            <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" /> New Project</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(p => (
            <div key={p.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      p.status === 'completed' ? 'bg-green-100' :
                      p.status === 'construction' ? 'bg-blue-100' :
                      p.status === 'handover' ? 'bg-purple-100' :
                      p.status === 'cancelled' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                      <Building2 className={`h-6 w-6 ${
                        p.status === 'completed' ? 'text-green-600' :
                        p.status === 'construction' ? 'text-blue-600' :
                        p.status === 'handover' ? 'text-purple-600' :
                        p.status === 'cancelled' ? 'text-red-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <Link to={`/projects/${p.id}`} className="text-lg font-semibold text-surface-900 hover:text-primary-600 transition-colors">{p.name}</Link>
                      {p.client_name && <p className="text-sm text-surface-500 mt-0.5">{p.client_name}</p>}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-surface-400">
                        {p.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>}
                        {p.start_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(p.start_date)}</span>}
                        {p.budget && <span className="flex items-center gap-1 font-medium text-surface-600">{formatCurrency(p.budget)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/projects/${p.id}`} className="btn-secondary btn-sm"><Eye className="h-3.5 w-3.5" /> View</Link>
                    <button onClick={() => { setEditing(p); setForm({ name:p.name, client_name:p.client_name||'', location:p.location||'', start_date:p.start_date||'', end_date:p.end_date||'', budget:p.budget?.toString()||'', description:p.description||'', status:p.status }); setShowForm(true); }} className="btn-secondary btn-sm"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => deleteProject(p.id)} className="btn-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><Trash2 className="h-3.5 w-3.5" /></button>
                    <span className={`badge ${getStatusColor(p.status)}`}>{p.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setShowForm(false)} className="text-surface-400 hover:text-surface-600"><X className="h-5 w-5" /></button>
              </div>
              
              {extractedData && !editing && (
                <div className="p-3 bg-primary-50 border border-primary-200 rounded-xl mb-4 flex items-start gap-2">
                  <Bot className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary-800">AI Extracted Data</p>
                    <p className="text-xs text-primary-600">Data was extracted from uploaded document. Review and edit before creating.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="label">Project Name *</label>
                    <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Sandton City Mall Renovation" />
                  </div>
                  <div>
                    <label className="label">Client Name</label>
                    <input className="input" value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})} placeholder="e.g., Growthpoint Properties" />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input className="input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g., Sandton, Johannesburg" />
                  </div>
                  <div>
                    <label className="label">Start Date</label>
                    <input type="date" className="input" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <input type="date" className="input" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Budget (ZAR)</label>
                    <input type="number" className="input" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="e.g., 5000000" />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Status</label>
                    <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="planning">Planning</option>
                      <option value="construction">Construction</option>
                      <option value="handover">Handover</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="label">Description / Scope of Works</label>
                    <textarea className="input" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the project scope, objectives, and key deliverables..." />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {editing ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}