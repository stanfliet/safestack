import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, getStatusColor } from '../lib/utils';
import { ShieldCheck, Plus, Search, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function ComplianceDashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ regulation:'', requirement:'', due_date:'', notes:'' });
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ compliant:0, nonCompliant:0, pending:0, total:0 });

  useEffect(() => { loadItems(); }, []);
  async function loadItems() {
    setLoading(true);
    const { data } = await supabase.from('compliance_items').select('*').order('due_date', { ascending: true });
    if (data) {
      setItems(data);
      setStats({ total:data.length, compliant:data.filter(i=>i.status==='compliant').length, nonCompliant:data.filter(i=>i.status==='non_compliant').length, pending:data.filter(i=>i.status==='pending').length });
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!user) return; setSaving(true);
    const { error } = await supabase.from('compliance_items').insert({ user_id:user.id, regulation:form.regulation, requirement:form.requirement, due_date:form.due_date||null, notes:form.notes, status:'pending' });
    if (!error) { setShowForm(false); setForm({ regulation:'',requirement:'',due_date:'',notes:'' }); loadItems(); }
    setSaving(false);
  }

  async function updateStatus(id: string, s: string) { await supabase.from('compliance_items').update({ status: s }).eq('id', id); loadItems(); }

  const complianceRate = stats.total > 0 ? Math.round((stats.compliant/stats.total)*100) : 0;
  const filtered = items.filter(i => {
    if (statusFilter!=='all' && i.status!==statusFilter) return false;
    if (search && !i.regulation.toLowerCase().includes(search.toLowerCase()) && !i.requirement?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Compliance Dashboard</h1><p className="text-surface-500 mt-1">Regulation tracking and audit readiness</p></div>
        <button onClick={()=>setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Item</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card"><div className="flex items-center gap-2 text-green-600 mb-1"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-medium">Compliant</span></div><p className="text-2xl font-bold">{stats.compliant}</p><p className="text-xs text-surface-500">of {stats.total} items</p></div>
        <div className="stat-card"><div className="flex items-center gap-2 text-red-600 mb-1"><XCircle className="h-4 w-4" /><span className="text-xs font-medium">Non-Compliant</span></div><p className="text-2xl font-bold">{stats.nonCompliant}</p></div>
        <div className="stat-card"><div className="flex items-center gap-2 text-amber-600 mb-1"><AlertTriangle className="h-4 w-4" /><span className="text-xs font-medium">Pending</span></div><p className="text-2xl font-bold">{stats.pending}</p></div>
        <div className="stat-card"><div className="flex items-center gap-2 text-primary-600 mb-1"><ShieldCheck className="h-4 w-4" /><span className="text-xs font-medium">Compliance Rate</span></div><p className="text-2xl font-bold">{complianceRate}%</p><div className="mt-1 h-1.5 bg-surface-200 rounded-full overflow-hidden"><div className="h-full bg-primary-600 rounded-full" style={{width:complianceRate+'%'}} /></div></div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" /><input className="input pl-10" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} /></div></div>
        <select className="input w-auto" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All</option><option value="compliant">Compliant</option><option value="non_compliant">Non-Compliant</option><option value="pending">Pending</option><option value="not_applicable">N/A</option>
        </select>
      </div>
      <div className="space-y-3">
        {filtered.length===0 ? (
          <div className="card p-12 text-center"><ShieldCheck className="h-12 w-12 mx-auto mb-3 text-surface-300" /><p className="text-surface-500 font-medium">No compliance items found</p></div>
        ) : filtered.map(item=>(
          <div key={item.id} className="card">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${getStatusColor(item.status)}`}>{item.status.replace('_',' ')}</span>
                    {item.due_date && new Date(item.due_date)<new Date() && item.status!=='compliant' && <span className="badge bg-red-100 text-red-700">Overdue</span>}
                  </div>
                  <h3 className="font-semibold">{item.regulation}</h3>
                  {item.requirement && <p className="text-sm text-surface-600 mt-1">{item.requirement}</p>}
                  {item.due_date && <p className="text-xs text-surface-500 mt-1">Due: {formatDate(item.due_date)}</p>}
                </div>
                <div className="flex gap-1 ml-4">
                  {['compliant','non_compliant','pending'].filter(s=>s!==item.status).map(s=>(
                    <button key={s} onClick={()=>updateStatus(item.id,s)}
                      className={`btn-sm rounded-lg text-xs ${s==='compliant'?'bg-green-100 text-green-700 hover:bg-green-200':s==='non_compliant'?'bg-red-100 text-red-700 hover:bg-red-200':'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>{s.replace('_',' ')}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e=>e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add Compliance Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Regulation *</label><input className="input" required value={form.regulation} onChange={e=>setForm({...form,regulation:e.target.value})} placeholder="e.g., OHSA Section 8" /></div>
              <div><label className="label">Requirement</label><textarea className="input" rows={3} value={form.requirement} onChange={e=>setForm({...form,requirement:e.target.value})} /></div>
              <div><label className="label">Due Date</label><input type="date" className="input" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})} /></div>
              <div><label className="label">Notes</label><textarea className="input" rows={2} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving?<Loader2 className="h-4 w-4 animate-spin" />:null}Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
