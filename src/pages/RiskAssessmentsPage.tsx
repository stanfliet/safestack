import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, getStatusColor } from '../lib/utils';
import { AlertTriangle, Plus, Search, Loader2, Upload, Eye, Edit3, Trash2, X, Bot, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';

export default function RiskAssessmentsPage() {
  const { user, isAdmin } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ project_id:'', title:'', hazard:'', risk_level:'medium', controls:'', likelihood:3, severity:3, status:'draft' });
  const [saving, setSaving] = useState(false);
  const [selectedRA, setSelectedRA] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadProjects(); loadAssessments(); }, []);

  async function loadProjects() {
    const { data } = await supabase.from('projects').select('id, name').order('name');
    if (data) setProjects(data);
  }

  async function loadAssessments() {
    setLoading(true);
    const { data } = await supabase.from('risk_assessments').select('*, projects(name)').order('created_at', { ascending: false });
    if (data) setAssessments(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!user) return; setSaving(true);
    const payload = {
      user_id: user.id, project_id: form.project_id || null,
      title: form.title, hazard: form.hazard || null,
      risk_level: form.risk_level, controls: form.controls || null,
      likelihood: form.likelihood, severity: form.severity, status: form.status,
    };
    if (editing) {
      await supabase.from('risk_assessments').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('risk_assessments').insert(payload);
    }
    setShowForm(false); setEditing(null);
    setForm({ project_id:'', title:'', hazard:'', risk_level:'medium', controls:'', likelihood:3, severity:3, status:'draft' });
    loadAssessments();
    setSaving(false);
  }

  async function deleteRA(id: string) {
    if (!confirm('Delete this risk assessment?')) return;
    await supabase.from('risk_assessments').delete().eq('id', id);
    loadAssessments();
  }

  async function handleUpload() {
    if (!uploadFile || !user) return;
    setUploading(true);
    const path = `risk-uploads/${Date.now()}_${uploadFile.name}`;
    const { error: uploadError } = await supabase.storage.from('uploads').upload(path, uploadFile);
    if (uploadError) { alert('Upload failed'); setUploading(false); return; }

    // AI extract from uploaded document
    let extractedRA = [];
    try {
      const text = await uploadFile.text();
      const lines = text.split('\n').filter((l: string) => l.trim());
      for (const line of lines) {
        if (line.includes('hazard') || line.includes('risk') || line.includes('danger')) {
          extractedRA.push({ title: `Risk from ${uploadFile.name}`, hazard: line.substring(0, 100), risk_level: 'medium', likelihood: 3, severity: 3, controls: '', status: 'draft' });
        }
      }
    } catch (e) { /* binary */ }

    if (extractedRA.length === 0) {
      // Create generic entry
      extractedRA.push({ title: `Risk Assessment - ${uploadFile.name}`, hazard: 'See uploaded document', risk_level: 'medium', likelihood: 3, severity: 3, controls: 'Refer to uploaded document for control measures', status: 'draft' });
    }

    for (const ra of extractedRA) {
      await supabase.from('risk_assessments').insert({
        user_id: user.id, project_id: form.project_id || null, ...ra,
      });
    }

    await supabase.from('document_analyses').insert({
      user_id: user.id, file_url: path, original_filename: uploadFile.name,
      analysis_type: 'risk_assessment', extracted_data: extractedRA, status: 'completed',
    });

    setUploading(false);
    setShowUpload(false);
    setUploadFile(null);
    loadAssessments();
  }

  const getRiskColor = (level: string) => {
    const c: Record<string, string> = { critical:'bg-red-100 text-red-800', high:'bg-orange-100 text-orange-800', medium:'bg-yellow-100 text-yellow-800', low:'bg-green-100 text-green-800' };
    return c[level] || 'bg-gray-100 text-gray-800';
  };

  const filtered = assessments.filter(a => {
    if (projectFilter !== 'all' && a.project_id !== projectFilter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.hazard?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Risk Assessments</h1>
          <p className="text-surface-500 mt-1">Identify, assess, and control construction site hazards</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUpload(true)} className="btn-secondary"><Upload className="h-4 w-4" /> Upload Document</button>
          <button onClick={() => { setEditing(null); setForm({ project_id:'', title:'', hazard:'', risk_level:'medium', controls:'', likelihood:3, severity:3, status:'draft' }); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" /> New Assessment</button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Upload Risk Document</h2>
            <p className="text-sm text-surface-500 mb-4">Upload a risk assessment document, method statement, or hazard analysis. AI will extract risk data.</p>
            <div className="mb-4">
              <label className="label">Project (optional)</label>
              <select className="input" value={form.project_id} onChange={e => setForm({...form, project_id: e.target.value})}>
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="border-2 border-dashed border-surface-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400"
              onClick={() => document.getElementById('risk-file-input')?.click()}>
              {uploadFile ? <p className="font-medium text-primary-600">{uploadFile.name}</p> : <div><Upload className="h-8 w-8 mx-auto mb-2 text-surface-400" /><p className="text-sm text-surface-500">Click to upload PDF, DOCX, or TXT</p></div>}
            </div>
            <input id="risk-file-input" type="file" className="hidden" onChange={e => setUploadFile(e.target.files?.[0] || null)} accept=".pdf,.docx,.txt" />
            <div className="flex justify-end gap-3 mt-4">
              <button className="btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
              <button className="btn-primary" disabled={!uploadFile || uploading} onClick={handleUpload}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                Extract & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" /><input className="input pl-10" placeholder="Search assessments..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        <select className="input w-auto" value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Assessment Cards */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 font-medium">No risk assessments found</p>
          <p className="text-sm text-surface-400 mt-1">Create a new assessment or upload a risk document</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(ra => (
            <div key={ra.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedRA(ra)}>
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-red-50">
                      <AlertTriangle className={`h-5 w-5 ${ra.risk_level === 'critical' ? 'text-red-600' : ra.risk_level === 'high' ? 'text-orange-600' : ra.risk_level === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{ra.title}</h3>
                      <p className="text-sm text-surface-500">{ra.projects?.name} — {ra.hazard?.substring(0, 80)}{ra.hazard?.length > 80 ? '...' : ''}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className="badge" style={{ background: ra.likelihood * ra.severity >= 15 ? '#fee2e2' : ra.likelihood * ra.severity >= 8 ? '#fef3c7' : '#dcfce7', color: ra.likelihood * ra.severity >= 15 ? '#991b1b' : ra.likelihood * ra.severity >= 8 ? '#92400e' : '#166534' }}>
                          Score: {ra.likelihood * ra.severity}
                        </span>
                        <span className={`badge ${getRiskColor(ra.risk_level)}`}>{ra.risk_level}</span>
                        <span className={`badge ${getStatusColor(ra.status)}`}>{ra.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedRA(ra); }} className="btn-secondary btn-sm"><Eye className="h-3.5 w-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); setEditing(ra); setForm({ project_id:ra.project_id||'', title:ra.title, hazard:ra.hazard||'', risk_level:ra.risk_level, controls:ra.controls||'', likelihood:ra.likelihood, severity:ra.severity, status:ra.status }); setShowForm(true); }} className="btn-secondary btn-sm"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteRA(ra.id); }} className="btn-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRA && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRA(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{selectedRA.title}</h2>
              <button onClick={() => setSelectedRA(null)} className="text-surface-400 hover:text-surface-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 text-sm">
              {selectedRA.projects?.name && <div className="flex justify-between"><span className="text-surface-500">Project:</span><span>{selectedRA.projects.name}</span></div>}
              <div className="flex justify-between"><span className="text-surface-500">Hazard:</span><span>{selectedRA.hazard}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-surface-500">Risk Level:</span>
                <span className={`badge ${getRiskColor(selectedRA.risk_level)}`}>{selectedRA.risk_level}</span>
              </div>
              <div>
                <span className="text-surface-500">Risk Score:</span>
                <div className="mt-1 flex items-center gap-3">
                  <span>Likelihood: {selectedRA.likelihood}/5</span>
                  <span>Severity: {selectedRA.severity}/5</span>
                  <span className="font-bold text-primary-600">Score: {selectedRA.likelihood * selectedRA.severity}</span>
                </div>
              </div>
              {selectedRA.controls && (
                <div>
                  <span className="text-surface-500">Control Measures:</span>
                  <p className="mt-1 p-3 bg-surface-50 rounded-lg">{selectedRA.controls}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button className="btn-secondary" onClick={() => setSelectedRA(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Risk Assessment' : 'New Risk Assessment'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="label">Title *</label><input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Excavation Collapse Risk" /></div>
                  <div className="col-span-2"><label className="label">Project</label>
                    <select className="input" value={form.project_id} onChange={e => setForm({...form, project_id: e.target.value})}>
                      <option value="">No project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2"><label className="label">Hazard Description</label><textarea className="input" rows={2} value={form.hazard} onChange={e => setForm({...form, hazard: e.target.value})} placeholder="Describe the hazard..." /></div>
                  <div><label className="label">Risk Level</label>
                    <select className="input" value={form.risk_level} onChange={e => setForm({...form, risk_level: e.target.value})}>
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
                    </select>
                  </div>
                  <div><label className="label">Status</label>
                    <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="draft">Draft</option><option value="review">Under Review</option><option value="approved">Approved</option>
                    </select>
                  </div>
                  <div><label className="label">Likelihood (1-5)</label><input type="number" min={1} max={5} className="input" value={form.likelihood} onChange={e => setForm({...form, likelihood: parseInt(e.target.value) || 1})} /></div>
                  <div><label className="label">Severity (1-5)</label><input type="number" min={1} max={5} className="input" value={form.severity} onChange={e => setForm({...form, severity: parseInt(e.target.value) || 1})} /></div>
                  <div className="col-span-2"><label className="label">Control Measures</label><textarea className="input" rows={3} value={form.controls} onChange={e => setForm({...form, controls: e.target.value})} placeholder="Describe control measures..." /></div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {editing ? 'Update' : 'Create'}
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
