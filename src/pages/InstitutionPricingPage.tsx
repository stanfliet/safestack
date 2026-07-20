import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import { Search, Loader2, Building2, ArrowLeft } from 'lucide-react';

const INSTITUTION_INFO: Record<string, { name: string; description: string }> = {
  sanral: { name: 'SANRAL', description: 'South African National Roads Agency - Toll & Road Infrastructure' },
  dol: { name: 'DOL', description: 'Department of Labour - Sectoral Determination & Minimum Wage' },
  bibc: { name: 'BIBC', description: 'Building Industry Bargaining Council - Main Agreement' },
  bccei: { name: 'BCCEI', description: 'Bargaining Council for Civil Engineering Industry' },
  nhbrc: { name: 'NHBRC', description: 'National Home Builders Registration Council' },
  wieta: { name: 'WIETA', description: 'Wine & Agricultural Ethical Trade Association' },
};

const CATEGORY_MAP: Record<string, string[]> = {
  sanral: ['Transport', 'Materials', 'Subcontractor'],
  dol: ['Labour', 'Other'],
  bibc: ['Labour', 'Subcontractor'],
  bccei: ['Labour', 'Plant'],
  nhbrc: ['Other', 'Subcontractor'],
  wieta: ['Other', 'Labour'],
};

export default function InstitutionPricingPage() {
  const { institution } = useParams();
  const info = institution ? INSTITUTION_INFO[institution] : null;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!institution || !info) { setLoading(false); return; }
    setLoading(true);
    setError('');
    const cats = CATEGORY_MAP[institution] || [];
    let query = supabase.from('pricing_data').select('*');
    if (cats.length > 0) {
      query = query.in('category', cats);
    }
    query.order('category').order('description')
      .then(({ data, error: err }) => {
        if (err) { setError(err.message); setItems([]); }
        else if (data) setItems(data);
        else setItems([]);
        setLoading(false);
      });
  }, [institution]);

  if (!institution || !info) {
    return <div className="text-center py-20 text-surface-500">Institution not found</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const categories = [...new Set(items.map((i: any) => i.category))].filter(Boolean);
  const filtered = items.filter((i: any) => {
    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
    if (search && !i.description?.toLowerCase().includes(search.toLowerCase()) && !i.item_code?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/pricing-database" className="p-2 hover:bg-surface-100 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-surface-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary-600" /> {info.name}
          </h1>
          <p className="text-surface-500 text-sm">{info.description}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input type="text" placeholder="Search items..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-surface-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="border border-surface-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-sm text-surface-500">{filtered.length} items</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-surface-400">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No pricing data available</p>
          <p className="text-sm mt-1">Seed the database from the Pricing Database page to load {info.name} rates.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Unit</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filtered.map((item: any) => (
                  <tr key={item.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-surface-600">{item.item_code || '-'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-surface-900">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-surface-500">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-surface-500">{item.unit || '-'}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-surface-900">
                      {item.unit_price ? formatCurrency(item.unit_price) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
