import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, getStatusColor } from '../lib/utils';
import { UserPlus, Search, Loader2, ChevronRight, ChevronLeft, CheckCircle2, Building2, FileText, ShieldCheck, ClipboardCheck } from 'lucide-react';

const steps = [
  { id:'company', label:'Company Info', icon:Building2 },
  { id:'contact', label:'Contact Details', icon:UserPlus },
  { id:'documents', label:'Documents', icon:FileText },
  { id:'compliance', label:'Compliance', icon:ShieldCheck },
  { id:'review', label:'Review', icon:ClipboardCheck },
];

export default function ContractorOnboardingPage() {
  const { user } = useAuth();
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ company_name:'', registration_number:'', tax_number:'', contact_person:'', email:'', phone:'', address:'', services:'', insurance_doc_url:'', safety_file_url:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadContractors(); }, []);
  async function loadContractors() {
    setLoading(true);
    const { data } = await supabase.from('contractors').select('*').order('created_at', { ascending: false });
    if (data) setContractors(data);
    setLoading(false);
  }

  async function handleSubmit() {
    if (!user) return; setSaving(true);
    const { error } = await supabase.from('contractors').insert({ user_id: user.id, ...form, status:'pending_onboarding', onboarding_step:5 });
    if (!error) { setShowWizard(false); setStep(0); setForm({ company_name:'',registration_number:'',tax_number:'',contact_person:'',email:'',phone:'',address:'',services:'',insurance_doc_url:'',safety_file_url:'' }); loadContractors(); }
    setSaving(false);
  }

  const filtered = contractors.filter(c => !search || c.company_name?.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="space-y-4">
          <div><label className="label">Company Name *</label><input className="input" required value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} /></div>
          <div><label className="label">Registration Number</label><input className="input" value={form.registration_number} onChange={e=>setForm({...form,registration_number:e.target.value})} /></div>
          <div><label className="label">Tax Number</label><input className="input" value={form.tax_number} onChange={e=>setForm({...form,tax_number:e.target.value})} /></div>
        </div>
      );
      case 1: return (
        <div className="space-y-4">
          <div><label className="label">Contact Person *</label><input className="input" required value={form.contact_person} onChange={e=>setForm({...form,contact_person:e.target.value})} /></div>
          <div><label className="label">Email *</label><input type="email" className="input" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
          <div><label className="label">Phone *</label><input className="input" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
          <div><label className="label">Address</label><textarea className="input" rows={2} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
        </div>
      );
      case 2: return (
        <div className="space-y-4">
          <div><label className="label">Services Provided</label><textarea className="input" rows={3} value={form.services} onChange={e=>setForm({...form,services:e.target.value})} placeholder="Describe services offered..." /></div>
          <div><label className="label">Insurance Document URL</label><input className="input" value={form.insurance_doc_url} onChange={e=>setForm({...form,insurance_doc_url:e.target.value})} /></div>
          <div><label className="label">Safety File URL</label><input className="input" value={form.safety_file_url} onChange={e=>setForm({...form,safety_file_url:e.target.value})} /></div>
        </div>
      );
      case 3: return (
        <div className="space-y-4">
          <p className="text-sm text-surface-600">Confirm the following compliance items:</p>
          {['Valid COID registration','Public liability insurance','SHEQ documentation','BEE certificate','Tax clearance'].map((item,i)=>(
            <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 cursor-pointer hover:bg-surface-50">
              <input type="checkbox" className="h-4 w-4 rounded border-surface-300 text-primary-600" />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      );
      case 4: return (
        <div className="space-y-4">
          <p className="text-sm text-surface-600">Please review all information before submitting.</p>
          <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
            <p><strong>Company:</strong> {form.company_name}</p>
            <p><strong>Reg:</strong> {form.registration_number||'N/A'}</p>
            <p><strong>Contact:</strong> {form.contact_person}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Phone:</strong> {form.phone}</p>
            <p><strong>Services:</strong> {form.services||'N/A'}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">Contractor Onboarding</h1><p className="text-surface-500 mt-1">Multi-step contractor registration wizard</p></div>
        <button onClick={()=>{setShowWizard(true);setStep(0)}} className="btn-primary"><UserPlus className="h-4 w-4" /> Onboard Contractor</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" /><input className="input pl-10" placeholder="Search contractors..." value={search} onChange={e=>setSearch(e.target.value)} /></div></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length===0 ? (
          <div className="card p-12 text-center md:col-span-2"><Building2 className="h-12 w-12 mx-auto mb-3 text-surface-300" /><p className="text-surface-500 font-medium">No contractors yet</p></div>
        ) : filtered.map(c=>(
          <div key={c.id} className="card">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">{c.company_name?.charAt(0)||'?'}</div>
                <div><h3 className="font-semibold">{c.company_name}</h3><p className="text-xs text-surface-500">{c.contact_person}</p></div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-surface-500 mb-3">{c.email && <span>{c.email}</span>}{c.phone && <span>{c.phone}</span>}</div>
              <div className="flex items-center justify-between">
                <span className={`badge ${getStatusColor(c.status)}`}>{c.status.replace('_',' ')}</span>
                {c.onboarding_step > 0 && <span className="text-xs text-surface-400">Step {c.onboarding_step}/5</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showWizard && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={()=>setShowWizard(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6" onClick={e=>e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-6">Onboard Contractor</h2>
            <div className="flex items-center justify-between mb-8">
              {steps.map((s,i)=>(
                <div key={s.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${i<=step?'bg-primary-600 text-white':'bg-surface-200 text-surface-500'}`}><s.icon className="h-4 w-4" /></div>
                  <p className={`text-xs mt-1 ${i<=step?'text-primary-600 font-medium':'text-surface-400'}`}>{s.label}</p>
                </div>
              ))}
            </div>
            {renderStep()}
            <div className="flex justify-between mt-8">
              <button onClick={()=>step>0?setStep(step-1):setShowWizard(false)} className="btn-secondary">{step===0?'Cancel':'Back'}</button>
              {step<4 ? (
                <button onClick={()=>setStep(step+1)} className="btn-primary" disabled={step===0 && !form.company_name}>Next <ChevronRight className="h-4 w-4" /></button>
              ) : (
                <button onClick={handleSubmit} className="btn-primary" disabled={saving}>{saving?<Loader2 className="h-4 w-4 animate-spin" />:<CheckCircle2 className="h-4 w-4" />} Submit</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
