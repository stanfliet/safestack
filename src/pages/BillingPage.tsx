import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatCurrency, getStatusColor } from '../lib/utils';
import { CreditCard, Loader2, CheckCircle2, XCircle, Download } from 'lucide-react';

const plans = [
  { id:'free', name:'Free', price:0, desc:'For individuals testing the platform', features:['1 active project','Basic documents','Community support'] },
  { id:'starter', name:'Starter', price:299, desc:'For small contractors', features:['5 active projects','AI document generator','Email support','Basic analytics'] },
  { id:'professional', name:'Professional', price:799, desc:'For growing construction firms', features:['Unlimited projects','Full AI agent suite','Advanced analytics','Priority support','Contractor onboarding'] },
  { id:'enterprise', name:'Enterprise', price:1999, desc:'For large construction companies', features:['Everything in Professional','Custom integrations','Dedicated account manager','API access','Custom branding','SLA guarantee'] },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBilling(); }, []);

  async function loadBilling() {
    setLoading(true);
    const [subRes, invRes] = await Promise.all([
      supabase.from('subscriptions').select('*').eq('user_id', user?.id).single().then(r=>r,()=>({data:null})),
      supabase.from('invoices').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
    ]);
    if (subRes.data) setSubscription(subRes.data);
    if (invRes.data) setInvoices(invRes.data);
    setLoading(false);
  }

  const currentPlan = plans.find(p => p.id === subscription?.plan) || plans[0];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">Billing</h1><p className="text-surface-500 mt-1">Subscription management and invoices</p></div></div>

      <div className="card mb-6">
        <div className="card-header flex items-center justify-between"><h2 className="section-title">Current Plan</h2>
          {subscription && <span className={`badge ${getStatusColor(subscription.status)}`}>{subscription.status.replace('_',' ')}</span>}
        </div>
        <div className="card-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center"><CreditCard className="h-7 w-7 text-primary-600" /></div>
            <div><h3 className="text-xl font-bold">{currentPlan.name}</h3>
              <p className="text-sm text-surface-500">R{currentPlan.price}/month &middot; {currentPlan.desc}</p>
              {subscription?.current_period_end && <p className="text-xs text-surface-400 mt-1">Next billing: {formatDate(subscription.current_period_end)}</p>}
            </div>
          </div>
          {subscription?.status === 'active' && <button className="btn-secondary btn-sm">Manage in Stripe</button>}
        </div>
      </div>

      <h2 className="section-title mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {plans.map(p => (
          <div key={p.id} className={`card ${p.id===currentPlan.id?'ring-2 ring-primary-500':''}`}>
            <div className="card-body">
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-3xl font-bold mt-2">R{p.price}<span className="text-sm font-normal text-surface-500">/mo</span></p>
              <p className="text-sm text-surface-500 mt-2 mb-4">{p.desc}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map((f,i)=>(
                  <li key={i} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              {p.id === currentPlan.id ? (
                <span className="btn-secondary w-full justify-center block text-center">Current Plan</span>
              ) : (
                <button className={`btn-primary w-full justify-center ${p.id==='enterprise'?'btn-secondary':''}`}>
                  {p.id==='free'?'Downgrade':p.id==='enterprise'?'Contact Sales':'Upgrade'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h2 className="section-title">Invoice History</h2></div>
        <div className="card-body">
          {invoices.length===0 ? (
            <p className="text-sm text-surface-400 text-center py-4">No invoices yet</p>
          ) : (
            <div className="space-y-2">
              {invoices.map(inv=>(
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${inv.status==='paid'?'bg-green-100':'bg-amber-100'}`}>
                      {inv.status==='paid'?<CheckCircle2 className="h-4 w-4 text-green-600" />:<XCircle className="h-4 w-4 text-amber-600" />}
                    </div>
                    <div><p className="text-sm font-medium">{formatCurrency(inv.amount)}</p><p className="text-xs text-surface-500">{formatDate(inv.created_at)}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${getStatusColor(inv.status)}`}>{inv.status}</span>
                    {inv.invoice_url && <a href={inv.invoice_url} target="_blank" className="p-1.5 rounded-lg hover:bg-surface-100"><Download className="h-4 w-4 text-surface-500" /></a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
