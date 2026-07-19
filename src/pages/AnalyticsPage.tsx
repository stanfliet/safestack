import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#6366f1','#22c55e','#ef4444','#f59e0b','#3b82f6','#8b5cf6'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [incidentTrends, setIncidentTrends] = useState<any[]>([]);
  const [severityBreakdown, setSeverityBreakdown] = useState<any[]>([]);
  const [complianceByCategory, setComplianceByCategory] = useState<any[]>([]);
  const [monthlyInspections, setMonthlyInspections] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalProjects:0, totalIncidents:0, inspectionsDone:0, complianceRate:0, tendersWon:0 });

  useEffect(() => { loadAnalytics(); }, []);

  async function loadAnalytics() {
    setLoading(true);
    const [projects, incidents, inspections, compliance, tenders] = await Promise.all([
      supabase.from('projects').select('created_at,status'),
      supabase.from('incidents').select('severity,created_at'),
      supabase.from('inspections').select('status,created_at'),
      supabase.from('compliance_items').select('status'),
      supabase.from('tenders').select('status'),
    ]);

    const inc = incidents.data||[];
    const comp = compliance.data||[];
    const insp = inspections.data||[];

    const now = new Date();
    const monthly: Record<string,number> = {};
    for (let i=5; i>=0; i--) { const d=new Date(now.getFullYear(),now.getMonth()-i,1); monthly[d.toLocaleString('en-ZA',{month:'short',year:'2-digit'})]=0; }
    inc.forEach(i => { const k=new Date(i.created_at).toLocaleString('en-ZA',{month:'short',year:'2-digit'}); if (monthly[k]!==undefined) monthly[k]++; });
    setIncidentTrends(Object.entries(monthly).map(([m,c])=>({month:m,count:c})));

    const sev: Record<string,number> = {};
    inc.forEach(i => { sev[i.severity]=(sev[i.severity]||0)+1; });
    setSeverityBreakdown(Object.entries(sev).map(([n,v])=>({name:n,value:v})));

    const cs: Record<string,number> = { compliant:0, non_compliant:0, pending:0 };
    comp.forEach(c => { if (cs[c.status]!==undefined) cs[c.status]++; });
    setComplianceByCategory(Object.entries(cs).map(([n,v])=>({name:n,value:v})));

    const im: Record<string,number> = {};
    for (let i=5; i>=0; i--) { const d=new Date(now.getFullYear(),now.getMonth()-i,1); im[d.toLocaleString('en-ZA',{month:'short',year:'2-digit'})]=0; }
    insp.forEach(i => { const k=new Date(i.created_at).toLocaleString('en-ZA',{month:'short',year:'2-digit'}); if (im[k]!==undefined) im[k]++; });
    setMonthlyInspections(Object.entries(im).map(([m,v])=>({month:m, inspections:v})));

    setSummary({
      totalProjects: projects.data?.length||0, totalIncidents: inc.length,
      inspectionsDone: insp.filter(i=>i.status==='completed').length,
      complianceRate: comp.length>0 ? Math.round((comp.filter(c=>c.status==='compliant').length/comp.length)*100) : 0,
      tendersWon: (tenders.data||[]).filter(t=>t.status==='won').length,
    });
    setLoading(false);
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">Analytics</h1><p className="text-surface-500 mt-1">Dashboards and performance metrics</p></div></div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[{label:'Projects',value:summary.totalProjects,color:'text-blue-600',bg:'bg-blue-100'},{label:'Incidents',value:summary.totalIncidents,color:'text-red-600',bg:'bg-red-100'},{label:'Inspections Done',value:summary.inspectionsDone,color:'text-green-600',bg:'bg-green-100'},{label:'Compliance Rate',value:summary.complianceRate+'%',color:'text-primary-600',bg:'bg-primary-100'},{label:'Tenders Won',value:summary.tendersWon,color:'text-teal-600',bg:'bg-teal-100'}].map((s,i)=>(
          <div key={i} className="stat-card"><div className={'w-9 h-9 '+s.bg+' rounded-xl flex items-center justify-center mb-3'}><TrendingUp className={'h-5 w-5 '+s.color} /></div><p className="text-2xl font-bold">{s.value}</p><p className="text-sm text-surface-500">{s.label}</p></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card"><div className="card-header"><h2 className="section-title">Incident Trends</h2></div><div className="card-body"><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={incidentTrends}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{fontSize:12}} /><YAxis tick={{fontSize:12}} allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} dot={{fill:'#ef4444'}} /></LineChart></ResponsiveContainer></div></div></div>
        <div className="card"><div className="card-header"><h2 className="section-title">Severity Breakdown</h2></div><div className="card-body"><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={severityBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({name,percent}: {name:string;percent:number})=>`${name} ${(percent*100).toFixed(0)}%`}>{severityBreakdown.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div></div>
        <div className="card"><div className="card-header"><h2 className="section-title">Compliance Status</h2></div><div className="card-body"><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={complianceByCategory}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="name" tick={{fontSize:12}} /><YAxis tick={{fontSize:12}} allowDecimals={false} /><Tooltip /><Bar dataKey="value" radius={[6,6,0,0]}>{complianceByCategory.map((_,i)=><Cell key={i} fill={['#22c55e','#ef4444','#f59e0b'][i]||COLORS[i]} />)}</Bar></BarChart></ResponsiveContainer></div></div></div>
        <div className="card"><div className="card-header"><h2 className="section-title">Monthly Inspections</h2></div><div className="card-body"><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyInspections}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{fontSize:12}} /><YAxis tick={{fontSize:12}} allowDecimals={false} /><Tooltip /><Bar dataKey="inspections" fill="#6366f1" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div></div></div>
      </div>
    </div>
  );
}
