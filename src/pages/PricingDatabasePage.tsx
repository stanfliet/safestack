import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { DollarSign, Plus, Search, Loader2, Edit3, Trash2 } from 'lucide-react';

export default function PricingDatabasePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ category:'', item_code:'', description:'', unit:'', unit_price:'', region:'', supplier:'', auto_update_schedule:'monthly' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadItems(); }, []);
  async function loadItems() {
    setLoading(true);
    const { data } = await supabase.from('pricing_data').select('*').order('category').order('item_code');
    if (data) setItems(data);
    setLoading(false);
  }

  function openEdit(item: any) {
    setEditing(item);
    setForm({ category:item.category, item_code:item.item_code||'', description:item.description||'', unit:item.unit||'', unit_price:String(item.unit_price||''), region:item.region||'', supplier:item.supplier||'', auto_update_schedule:item.auto_update_schedule||'monthly' });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!user) return; setSaving(true);
    const payload = { ...form, unit_price: parseFloat(form.unit_price)||0, effective_date: new Date().toISOString().split('T')[0] };
    if (editing) { await supabase.from('pricing_data').update(payload).eq('id', editing.id); }
    else { await supabase.from('pricing_data').insert({ user_id: user.id, ...payload }); }
    setShowForm(false); setEditing(null);
    setForm({ category:'',item_code:'',description:'',unit:'',unit_price:'',region:'',supplier:'',auto_update_schedule:'monthly' });
    loadItems(); setSaving(false);
  }

  async function handleDelete(id: string) { if (confirm('Delete this item?')) { await supabase.from('pricing_data').delete().eq('id', id); loadItems(); } }

  const categories = [...new Set(items.map(i=>i.category))].filter(Boolean);
  const filtered = items.filter(i => {
    if (categoryFilter!=='all' && i.category!==categoryFilter) return false;
    if (search && !i.description?.toLowerCase().includes(search.toLowerCase()) && !i.item_code?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Pricing Database</h1><p className="text-surface-500 mt-1">Regional pricing with auto-update scheduling</p></div>
        <button onClick={()=>{setEditing(null);setForm({category:'',item_code:'',description:'',unit:'',unit_price:'',region:'',supplier:'',auto_update_schedule:'monthly'});setShowForm(true)}} className="btn-primary"><Plus className="h-4 w-4" /> Add Item</button>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" /><input className="input pl-10" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} /></div></div>
        <select className="input w-auto" value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-surface-50">
              <th className="text-left px-4 py-3 font-medium text-surface-600">Code</th>
              <th className="text-left px-4 py-3 font-medium text-surface-600">Description</th>
              <th className="text-left px-4 py-3 font-medium text-surface-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-surface-600">Unit</th>
              <th className="text-right px-4 py-3 font-medium text-surface-600">Price</th>
              <th className="text-left px-4 py-3 font-medium text-surface-600">Region</th>
              <th className="text-left px-4 py-3 font-medium text-surface-600">Schedule</th>
              <th className="text-right px-4 py-3 font-medium text-surface-600">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-surface-400"><DollarSign className="h-8 w-8 mx-auto mb-2 text-surface-300" /><p>No items found</p></td></tr>
              ) : filtered.map(item=>(
                <tr key={item.id} className="border-b border-surface-100 hover:bg-surface-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.item_code||'-'}</td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3"><span className="badge bg-blue-100 text-blue-700">{item.category}</span></td>
                  <td className="px-4 py-3">{item.unit||'-'}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.unit_price)}</td>
                  <td className="px-4 py-3">{item.region||'-'}</td>
                  <td className="px-4 py-3">{item.auto_update_schedule}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={()=>openEdit(item)} className="p-1.5 rounded-lg hover:bg-surface-100"><Edit3 className="h-4 w-4 text-surface-500" /></button>
                      <button onClick={()=>handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6" onClick={e=>e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing?'Edit Item':'Add Pricing Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category *</label>
                  <select className="input" required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    <option value="">Select...</option><option>Materials</option><option>Labour</option><option>Plant</option><option>Subcontractor</option><option>Transport</option><option>Other</option>
                  </select></div>
                <div><label className="label">Item Code</label><input className="input" value={form.item_code} onChange={e=>setForm({...form,item_code:e.target.value})} /></div>
                <div className="col-span-2"><label className="label">Description *</label><input className="input" required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
                <div><label className="label">Unit</label><input className="input" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="m2, ton, hour" /></div>
                <div><label className="label">Unit Price *</label><input type="number" step="0.01" className="input" required value={form.unit_price} onChange={e=>setForm({...form,unit_price:e.target.value})} /></div>
                <div><label className="label">Region</label><input className="input" value={form.region} onChange={e=>setForm({...form,region:e.target.value})} /></div>
                <div><label className="label">Supplier</label><input className="input" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} /></div>
                <div className="col-span-2"><label className="label">Auto-Update</label>
                  <select className="input" value={form.auto_update_schedule} onChange={e=>setForm({...form,auto_update_schedule:e.target.value})}>
                    <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="none">None</option>
                  </select></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={()=>{setShowForm(false);setEditing(null)}}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving?<Loader2 className="h-4 w-4 animate-spin" />:editing?'Update':'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
