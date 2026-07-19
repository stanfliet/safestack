import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, getStatusColor } from '../lib/utils';
import { AlertOctagon, Plus, Search, Filter, Loader2, Eye, Flag } from 'lucide-react';

const severityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800', high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800', low: 'bg-green-100 text-green-800',
};

export default function IncidentsPage() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', incident_date: '', severity: 'medium', reported_by: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadIncidents(); }, []);

  async function loadIncidents() {
    setLoading(true);
    const { data } = await supabase.from('incidents').select('*, projects(name)').order('incident_date', { ascending: false });
    if (data) setIncidents(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('incidents').insert({
      user_id: user.id, title: form.title, description: form.description, location: form.location,
      incident_date: form.incident_date, severity: form.severity, reported_by: form.reported_by, status: 'open',
    });
    if (!error) { setShowForm(false); setForm({ title: '', description: '', location: '', incident_date: '', severity: 'medium', reported_by: '' }); loadIncidents(); }
    setSaving(false);
  }

  const filtered = incidents.filter(i => {
    if (severityFilter !== 'all' && i.severity !== severityFilter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Incidents</h1><p className="text-surface-500 mt-1">Report and investigate safety incidents</p></div>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" /> Report Incident</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input className="input pl-10" placeholder="Search incidents..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="input w-auto" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center"><AlertOctagon className="h-12 w-12 mx-auto mb-3 text-surface-300" />
            <p className="text-surface-500 font-medium">No incidents reported</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4"><Plus className="h-4 w-4" /> Report Incident</button>
          </div>
        ) : filtered.map(inc => (
          <div key={inc.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(inc)}>
            <div className="card-body flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${inc.severity === 'critical' ? 'bg-red-100' : inc.severity === 'high' ? 'bg-orange-100' : inc.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                  <AlertOctagon className={`h-5 w-5 ${inc.severity === 'critical' ? 'text-red-600' : inc.severity === 'high' ? 'text-orange-600' : inc.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{inc.title}</h3>
                  <p className="text-sm text-surface-500 mt-0.5">
                    {formatDate(inc.incident_date)}
                    {inc.location && <span> &middot; {inc.location}</span>}
                    {inc.reported_by && <span> &middot; Reported by: {inc.reported_by}</span>}
                  </p>
                  {inc.description && <p className="text-sm text-surface-600 mt-1 line-clamp-2">{inc.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${severityColors[inc.severity] || 'bg-gray-100'}`}>{inc.severity}</span>
                <span className={`badge ${getStatusColor(inc.status)}`}>{inc.status}</span>
                <Eye className="h-4 w-4 text-surface-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Report Incident</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Title *</label><input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="label">Location</label><input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Date *</label><input type="date" className="input" required value={form.incident_date} onChange={e => setForm({ ...form, incident_date: e.target.value })} /></div>
                <div><label className="label">Severity</label><select className="input" value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                  <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                </select></div>
              </div>
              <div><label className="label">Reported By</label><input className="input" value={form.reported_by} onChange={e => setForm({ ...form, reported_by: e.target.value })} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{selected.title}</h2>
              <span className={`badge ${severityColors[selected.severity]}`}>{selected.severity}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-surface-500">Status:</span><span className={`badge ${getStatusColor(selected.status)}`}>{selected.status}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Date:</span><span>{formatDate(selected.incident_date)}</span></div>
              {selected.location && <div className="flex justify-between"><span className="text-surface-500">Location:</span><span>{selected.location}</span></div>}
              {selected.reported_by && <div className="flex justify-between"><span className="text-surface-500">Reported by:</span><span>{selected.reported_by}</span></div>}
              {selected.description && <div><span className="text-surface-500">Description:</span><p className="mt-1 text-surface-700">{selected.description}</p></div>}
              {selected.investigation_notes && <div><span className="text-surface-500">Investigation Notes:</span><p className="mt-1 text-surface-700">{selected.investigation_notes}</p></div>}
              {selected.root_cause && <div><span className="text-surface-500">Root Cause:</span><p className="mt-1 text-surface-700">{selected.root_cause}</p></div>}
              {selected.corrective_actions && <div><span className="text-surface-500">Corrective Actions:</span><p className="mt-1 text-surface-700">{selected.corrective_actions}</p></div>}
            </div>
            <div className="flex justify-end mt-6"><button className="btn-secondary" onClick={() => setSelected(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
