import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import { Search, Loader2, Building2 } from 'lucide-react';

const INSTITUTION_INFO: Record<string, { name: string; description: string }> = {
  sanral: { name: 'SANRAL', description: 'South African National Roads Agency - 2026 Schedule of Rates' },
  dol: { name: 'DOL', description: 'Department of Labour - Sectoral Determination 2026' },
  bibc: { name: 'BIBC', description: 'Building Industry Bargaining Council - Main Agreement 2026' },
  bccei: { name: 'BCCEI', description: 'Bargaining Council for Civil Engineering Industry 2026' },
  nhbrc: { name: 'NHBRC', description: 'National Home Builders Registration Council 2026' },
  wieta: { name: 'WIETA', description: 'Wine & Agricultural Ethical Trade Association 2026' },
  tjeka: { name: 'TJEKA', description: 'Tjeka Training Matters - 2026 Training Schedule' },
  colto: { name: 'COLTO', description: 'Committee of Land Transport Officials 2026' },
  asaqwa: { name: 'ASAQWA', description: 'Aggregate & Sand Quarry Association 2026' },
  gcc: { name: 'GCC', description: 'General Conditions of Contract 2010 - 2026 Rates' },
  fidic: { name: 'FIDIC', description: 'International Federation of Consulting Engineers 2026' },
  jbbcc: { name: 'JBBCC', description: 'Joint Building Contracts Committee 2026' },
  nec: { name: 'NEC', description: 'New Engineering Contract - 2026 Rates' },
  'health-safety': { name: 'Health & Safety Bodies', description: 'OHS Act 85, SACPCMP, SANS Standards 2026' },
};

export default function InstitutionPricingPage() {
  const { institution } = useParams();
  const info = institution ? INSTITUTION_INFO[institution] : null;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (!institution || !info) return;
    setLoading(true);
    supabase.from('pricing_data').select('*')
      .eq('institution', info.name)
      .order('category').order('item_code')
      .then(({ data }) => { if (data) setItems(data); setLoading(false); });
  }, [institution]);

  if (!institution || !info) return <div className="text-center py-20 text-surface-500">Institution not found</div>;
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  const categories = [...new Set(items.map((i: any) => i.category))].filter(Boolean);
  const filtered = items.filter((i: any) => {
    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
    if (search && !i.description?.toLowerCase().includes(search.toLowerCase()) && !i.item_code?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary-600" />
            <div><h1 className="page-title">{info.name}</h1><p className="text-surface-500 mt-1">{info.description}</p></div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input className="input pl-10" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="input w-auto" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-surface-50">
                <th className="text-left px-4 py-3 font-medium text-surface-600">Code</th>
                <th className="text-left px-4 py-3 font-medium text-surface-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-surface-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-surface-600">Unit</th>
                <th className="text-right px-4 py-3 font-medium text-surface-600">Price (ZAR)</th>
                <th className="text-left px-4 py-3 font-medium text-surface-600">Source</th>
                <th className="text-left px-4 py-3 font-medium text-surface-600">Valid From</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-surface-400">No items found for this institution</td></tr>
              ) : filtered.map((item: any) => (
                <tr key={item.id} className="border-b border-surface-100 hover:bg-surface-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.item_code || '-'}</td>
                  <td className="px-4 py-3"><span className="badge bg-blue-100 text-blue-700">{item.category}</span></td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">{item.unit || '-'}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.unit_price)}</td>
                  <td className="px-4 py-3 text-xs text-surface-500">{item.source || '-'}</td>
                  <td className="px-4 py-3 text-xs">{item.valid_from ? new Date(item.valid_from).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}