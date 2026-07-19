import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, getStatusColor, getInitials } from '../lib/utils';
import { Users, Plus, Search, Loader2, Mail, Phone, Award, BookOpen, Calendar, Eye } from 'lucide-react';

export default function WorkersPage() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ full_name: '', id_number: '', phone: '', email: '', position: '', induction_date: '', induction_expiry: '', emergency_contact: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadWorkers(); }, []);

  async function loadWorkers() {
    setLoading(true);
    const { data } = await supabase.from('workers').select('*, projects(name)').order('full_name');
    if (data) setWorkers(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('workers').insert({
      user_id: user.id, ...form,
      induction_date: form.induction_date || null, induction_expiry: form.induction_expiry || null,
    });
    if (!error) { setShowForm(false); setForm({ full_name: '', id_number: '', phone: '', email: '', position: '', induction_date: '', induction_expiry: '', emergency_contact: '' }); loadWorkers(); }
    setSaving(false);
  }

  const filtered = workers.filter(w => {
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    if (search && !w.full_name?.toLowerCase().includes(search.toLowerCase()) && !w.position?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Workers</h1><p className="text-surface-500 mt-1">Workforce management with inductions and certifications</p></div>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Worker</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input className="input pl-10" placeholder="Search workers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="input w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center md:col-span-2"><Users className="h-12 w-12 mx-auto mb-3 text-surface-300" />
            <p className="text-surface-500 font-medium">No workers found</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4"><Plus className="h-4 w-4" /> Add Worker</button>
          </div>
        ) : filtered.map(w => {
          const inductionExpiring = w.induction_expiry && new Date(w.induction_expiry) < new Date(Date.now() + 30 * 86400000);
          return (
            <div key={w.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(w)}>
              <div className="card-body">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">{getInitials(w.full_name)}</div>
                    <div><h3 className="font-semibold">{w.full_name}</h3><p className="text-xs text-surface-500">{w.position || 'No position'}</p></div>
                  </div>
                  <span className={`badge ${getStatusColor(w.status)}`}>{w.status}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-surface-500">
                  {w.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{w.email}</span>}
                  {w.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{w.phone}</span>}
                  {w.induction_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Induction: {formatDate(w.induction_date)}</span>}
                </div>
                {(w.certifications?.length > 0 || inductionExpiring) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {inductionExpiring && <span className="badge bg-amber-100 text-amber-800 text-xs"><Calendar className="h-3 w-3 inline mr-1" />Expiring soon</span>}
                    {w.certifications?.slice(0, 2).map((c: any, i: number) => (
                      <span key={i} className="badge bg-green-100 text-green-700 text-xs"><Award className="h-3 w-3 inline mr-1" />{c.name || c}</span>
                    ))}
                    {w.certifications?.length > 2 && <span className="badge bg-surface-100 text-surface-600 text-xs">+{w.certifications.length - 2}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add Worker</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Full Name *</label><input className="input" required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
                <div><label className="label">ID Number</label><input className="input" value={form.id_number} onChange={e => setForm({ ...form, id_number: e.target.value })} /></div>
                <div><label className="label">Position</label><input className="input" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} /></div>
                <div><label className="label">Phone</label><input className="input" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><label className="label">Induction Date</label><input type="date" className="input" value={form.induction_date} onChange={e => setForm({ ...form, induction_date: e.target.value })} /></div>
                <div><label className="label">Induction Expiry</label><input type="date" className="input" value={form.induction_expiry} onChange={e => setForm({ ...form, induction_expiry: e.target.value })} /></div>
                <div className="col-span-2"><label className="label">Emergency Contact</label><input className="input" value={form.emergency_contact} onChange={e => setForm({ ...form, emergency_contact: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Add Worker</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-bold">{getInitials(selected.full_name)}</div>
              <div><h2 className="text-lg font-semibold">{selected.full_name}</h2><p className="text-sm text-surface-500">{selected.position}</p></div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-surface-500">Status:</span><span className={`badge ${getStatusColor(selected.status)}`}>{selected.status}</span></div>
              {selected.id_number && <div className="flex justify-between"><span className="text-surface-500">ID Number:</span><span>{selected.id_number}</span></div>}
              {selected.email && <div className="flex justify-between"><span className="text-surface-500">Email:</span><span>{selected.email}</span></div>}
              {selected.phone && <div className="flex justify-between"><span className="text-surface-500">Phone:</span><span>{selected.phone}</span></div>}
              {selected.induction_date && <div className="flex justify-between"><span className="text-surface-500">Induction:</span><span>{formatDate(selected.induction_date)} {selected.induction_expiry ? `- ${formatDate(selected.induction_expiry)}` : ''}</span></div>}
              {selected.emergency_contact && <div className="flex justify-between"><span className="text-surface-500">Emergency:</span><span>{selected.emergency_contact}</span></div>}
              {selected.certifications?.length > 0 && (
                <div><span className="text-surface-500">Certifications:</span>
                  <div className="mt-1 flex flex-wrap gap-2">{selected.certifications.map((c: any, i: number) => (
                    <span key={i} className="badge bg-green-100 text-green-700"><Award className="h-3 w-3 inline mr-1" />{c.name || c}</span>
                  ))}</div>
                </div>
              )}
              {selected.training_records?.length > 0 && (
                <div><span className="text-surface-500">Training Records:</span>
                  <div className="mt-1 flex flex-wrap gap-2">{selected.training_records.map((t: any, i: number) => (
                    <span key={i} className="badge bg-blue-100 text-blue-700"><BookOpen className="h-3 w-3 inline mr-1" />{t.name || t}</span>
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
