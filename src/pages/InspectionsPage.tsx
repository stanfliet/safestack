import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, getStatusColor } from '../lib/utils';
import { ClipboardCheck, Plus, Search, Filter, Loader2, CheckCircle2, Clock, AlertTriangle, Eye } from 'lucide-react';
import type { Inspection } from '../types';

const statusIcons: Record<string, any> = {
  scheduled: Clock, in_progress: Loader2, completed: CheckCircle2, overdue: AlertTriangle,
};

export default function InspectionsPage() {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', area: '', inspection_date: '', inspector_name: '' });
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    loadInspections();
  }, []);

  async function loadInspections() {
    setLoading(true);
    const { data } = await supabase
      .from('inspections').select('*, projects(name)')
      .order('inspection_date', { ascending: false });
    if (data) setInspections(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('inspections').insert({
      user_id: user.id, title: form.title, area: form.area,
      inspection_date: form.inspection_date, inspector_name: form.inspector_name,
      status: 'scheduled',
    });
    if (!error) { setShowForm(false); setForm({ title: '', area: '', inspection_date: '', inspector_name: '' }); loadInspections(); }
    setSaving(false);
  }

  const filtered = inspections.filter(i => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.area?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Inspections</h1><p className="text-surface-500 mt-1">Manage inspection checklists and schedules</p></div>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" /> New Inspection</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input className="input pl-10" placeholder="Search inspections..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="input w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center"><ClipboardCheck className="h-12 w-12 mx-auto mb-3 text-surface-300" />
            <p className="text-surface-500 font-medium">No inspections found</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4"><Plus className="h-4 w-4" /> Schedule Inspection</button>
          </div>
        ) : filtered.map(insp => {
          const Icon = statusIcons[insp.status] || ClipboardCheck;
          return (
            <div key={insp.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(insp)}>
              <div className="card-body flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${insp.status === 'completed' ? 'bg-green-100' : insp.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <Icon className={`h-5 w-5 ${insp.status === 'completed' ? 'text-green-600' : insp.status === 'overdue' ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{insp.title}</h3>
                    <p className="text-sm text-surface-500 mt-0.5">
                      {insp.area && <span>{insp.area} &middot; </span>}
                      {formatDate(insp.inspection_date)}
                      {insp.inspector_name && <span> &middot; {insp.inspector_name}</span>}
                    </p>
                    {insp.score && <p className="text-sm text-primary-600 mt-1">Score: {insp.score}%</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusColor(insp.status)}`}>{insp.status.replace('_', ' ')}</span>
                  <Eye className="h-4 w-4 text-surface-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Schedule Inspection</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Title *</label><input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="label">Area</label><input className="input" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g., Site A, Scaffolding" /></div>
              <div><label className="label">Inspection Date *</label><input type="date" className="input" required value={form.inspection_date} onChange={e => setForm({ ...form, inspection_date: e.target.value })} /></div>
              <div><label className="label">Inspector Name</label><input className="input" value={form.inspector_name} onChange={e => setForm({ ...form, inspector_name: e.target.value })} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{selected.title}</h2>
              <span className={`badge ${getStatusColor(selected.status)}`}>{selected.status.replace('_', ' ')}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-surface-500">Area:</span><span>{selected.area || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Date:</span><span>{formatDate(selected.inspection_date)}</span></div>
              {selected.inspector_name && <div className="flex justify-between"><span className="text-surface-500">Inspector:</span><span>{selected.inspector_name}</span></div>}
              {selected.score && <div className="flex justify-between"><span className="text-surface-500">Score:</span><span className="font-medium">{selected.score}%</span></div>}
              {selected.project_id && <div className="flex justify-between"><span className="text-surface-500">Project:</span><span>{selected.projects?.name || 'N/A'}</span></div>}
              {selected.description && <div><span className="text-surface-500">Notes:</span><p className="mt-1 text-surface-700">{selected.description}</p></div>}
              {selected.findings?.length > 0 && (
                <div><span className="text-surface-500">Findings ({selected.findings.length}):</span>
                  <div className="mt-2 space-y-1">{selected.findings.map((f: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${f.severity === 'critical' ? 'bg-red-500' : f.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                      <span>{f.description || f}</span>
                    </div>
                  ))}</div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6"><button className="btn-secondary" onClick={() => setSelected(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
