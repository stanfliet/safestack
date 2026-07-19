import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatCurrency, getStatusColor } from '../lib/utils';
import { FileSpreadsheet, Plus, Search, Loader2, Calendar, DollarSign } from 'lucide-react';

export default function TendersPage() {
  const { user } = useAuth();
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ title:'', client_name:'', tender_number:'', issue_date:'', submission_date:'', budget:'', description:'', notes:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadTenders(); }, []);

  async function loadTenders() {
    setLoading(true);
    const { data } = await supabase.from('tenders').select('*').order('submission_date', { ascending: false });
    if (data) setTenders(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!user) return; setSaving(true);
    const { error } = await supabase.from('tenders').insert({
      user_id: user.id, title: form.title, client_name: form.client_name, tender_number: form.tender_number,
      issue_date: form.issue_date||null, submission_date: form.submission_date||null,
      budget: form.budget ? parseFloat(form.budget) : null, description: form.description, notes: form.notes, status: 'draft',
    });
    if (!error) { setShowForm(false); setForm({ title:'',client_name:'',tender_number:'',issue_date:'',submission_date:'',budget:'',description:'',notes:'' }); loadTenders(); }
    setSaving(false);
  }

  async function updateStatus(id: string, s: string) { await supabase.from('tenders').update({ status: s }).eq('id', id); loadTenders(); }

  const filtered = tenders.filter(t => {
    if (statusFilter!=='all' && t.status!==statusFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.client_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Tenders</h1><p className="text-surface-500 mt-1">Manage tenders and track bid status</p></div>
        <button onClick={()=>setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" /> New Tender</button>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" /><input className="input pl-10" placeholder="Search tenders..." value={search} onChange={e=>setSearch(e.target.value)} /></div></div>
        <select className="input w-auto" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All</option><option value="draft">Draft</option><option value="submitted">Submitted</option><option value="won">Won</option><option value="lost">Lost</option><option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="grid gap-4">
        {filtered.length===0 ? (
          <div className="card p-12 text-center"><FileSpreadsheet className="h-12 w-12 mx-auto mb-3 text-surface-300" /><p className="text-surface-500 font-medium">No tenders found</p>
            <button onClick={()=>setShowForm(true)} className="btn-primary mt-4"><Plus className="h-4 w-4" /> New Tender</button></div>
        ) : filtered.map(t=>(
          <div key={t.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={()=>setSelected(t)}>
            <div className="card-body">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-100"><FileSpreadsheet className="h-5 w-5 text-teal-600" /></div>
                  <div><h3 className="font-semibold">{t.title}</h3><p className="text-sm text-surface-500">{t.client_name}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  {['draft','submitted'].includes(t.status) && <div className="flex gap-1">
                    {t.status==='draft' && <button onClick={(e)=>{e.stopPropagation();updateStatus(t.id,'submitted')}} className="btn-primary btn-sm">Submit</button>}
                    {t.status==='submitted' && <><button onClick={(e)=>{e.stopPropagation();updateStatus(t.id,'won')}} className="btn-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Won</button>
                      <button onClick={(e)=>{e.stopPropagation();updateStatus(t.id,'lost')}} className="btn-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">Lost</button></>}
                  </div>}
                  <span className={`badge ${getStatusColor(t.status)}`}>{t.status}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-surface-500">
                {t.tender_number && <span className="flex items-center gap-1"><FileSpreadsheet className="h-3.5 w-3.5" />Ref: {t.tender_number}</span>}
                {t.submission_date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Due: {formatDate(t.submission_date)}</span>}
                {t.budget && <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{formatCurrency(t.budget)}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6" onClick={e=>e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">New Tender</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Title *</label><input className="input" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
                <div><label className="label">Client Name</label><input className="input" value={form.client_name} onChange={e=>setForm({...form,client_name:e.target.value})} /></div>
                <div><label className="label">Tender No.</label><input className="input" value={form.tender_number} onChange={e=>setForm({...form,tender_number:e.target.value})} /></div>
                <div><label className="label">Issue Date</label><input type="date" className="input" value={form.issue_date} onChange={e=>setForm({...form,issue_date:e.target.value})} /></div>
                <div><label className="label">Submission Date</label><input type="date" className="input" value={form.submission_date} onChange={e=>setForm({...form,submission_date:e.target.value})} /></div>
                <div className="col-span-2"><label className="label">Budget (ZAR)</label><input type="number" className="input" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} /></div>
                <div className="col-span-2"><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
                <div className="col-span-2"><label className="label">Notes</label><textarea className="input" rows={2} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">{selected.title}</h2><span className={`badge ${getStatusColor(selected.status)}`}>{selected.status}</span></div>
            <div className="space-y-3 text-sm">
              {selected.client_name && <div className="flex justify-between"><span className="text-surface-500">Client:</span><span>{selected.client_name}</span></div>}
              {selected.tender_number && <div className="flex justify-between"><span className="text-surface-500">Ref:</span><span>{selected.tender_number}</span></div>}
              {selected.submission_date && <div className="flex justify-between"><span className="text-surface-500">Submission:</span><span>{formatDate(selected.submission_date)}</span></div>}
              {selected.budget && <div className="flex justify-between"><span className="text-surface-500">Budget:</span><span className="font-semibold">{formatCurrency(selected.budget)}</span></div>}
              {selected.description && <div><span className="text-surface-500">Description:</span><p className="mt-1 text-surface-700">{selected.description}</p></div>}
            </div>
            <div className="flex justify-end mt-6"><button className="btn-secondary" onClick={()=>setSelected(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
