import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getStatusColor } from '../lib/utils';
import { TrendingUp, Users, FileText, AlertTriangle, ClipboardCheck, AlertOctagon, Building2, DollarSign, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ projects:0, workers:0, inspections:0, incidents:0, riskAssessments:0, tenders:0, safetyScore:78 });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [upcomingInspections, setUpcomingInspections] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('workers').select('*', { count: 'exact', head: true }),
      supabase.from('inspections').select('*', { count: 'exact', head: true }),
      supabase.from('incidents').select('*', { count: 'exact', head: true }),
      supabase.from('risk_assessments').select('*', { count: 'exact', head: true }),
      supabase.from('tenders').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('incidents').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('inspections').select('*').in('status', ['scheduled', 'in_progress']).order('inspection_date', { ascending: true }).limit(5),
    ]).then(([pc, wc, ic, incC, rc, tc, prj, incList, inspList]) => {
      setStats({ projects: pc.count||0, workers: wc.count||0, inspections: ic.count||0, incidents: incC.count||0, riskAssessments: rc.count||0, tenders: tc.count||0, safetyScore:78 });
      setRecentProjects(prj.data||[]);
      setRecentIncidents(incList.data||[]);
      setUpcomingInspections(inspList.data||[]);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label:'Projects', value:stats.projects, icon:Building2, color:'bg-blue-500', href:'/projects' },
    { label:'Workers', value:stats.workers, icon:Users, color:'bg-green-500', href:'/workers' },
    { label:'Inspections', value:stats.inspections, icon:ClipboardCheck, color:'bg-purple-500', href:'/inspections' },
    { label:'Risk Assessments', value:stats.riskAssessments, icon:AlertTriangle, color:'bg-amber-500', href:'/risk-assessments' },
    { label:'Incidents', value:stats.incidents, icon:AlertOctagon, color:'bg-red-500', href:'/incidents' },
    { label:'Tenders', value:stats.tenders, icon:DollarSign, color:'bg-teal-500', href:'/tenders' },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Dashboard</h1><p className="text-surface-500 mt-1">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}</p></div>
        <Link to="/projects" className="btn-primary"><Building2 className="h-4 w-4" /> New Project</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map(({label,value,icon:Icon,color,href}) => (
          <Link key={label} to={href} className="stat-card group">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}><Icon className="h-5 w-5 text-white" /></div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-surface-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="card mb-6">
        <div className="card-header"><h2 className="section-title">Safety Compliance Score</h2></div>
        <div className="card-body">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#6366f1" strokeWidth="8"
                  strokeDasharray={`${2*Math.PI*42}`} strokeDashoffset={`${2*Math.PI*42*(1-0.78)}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary-600">78%</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Compliant: 65%</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span>Needs attention: 22%</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>Non-compliant: 13%</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="card-header flex items-center justify-between">
            <h2 className="section-title">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="card-body">
            {recentProjects.length === 0 ? (
              <div className="text-center py-8 text-surface-400"><Building2 className="h-12 w-12 mx-auto mb-2 text-surface-300" /><p className="font-medium">No projects yet</p></div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map(p => (
                  <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50">
                    <div><p className="font-medium">{p.name}</p><p className="text-sm text-surface-500">{p.client_name} - {formatDate(p.created_at)}</p></div>
                    <span className={`badge ${getStatusColor(p.status)}`}>{p.status.replace('_',' ')}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header"><h2 className="section-title">Upcoming Inspections</h2></div>
            <div className="card-body">
              {upcomingInspections.length === 0 ? <p className="text-sm text-surface-400 text-center py-4">No upcoming inspections</p> : (
                <div className="space-y-2">{upcomingInspections.map(insp => (
                  <div key={insp.id} className="p-2.5 rounded-lg bg-surface-50"><p className="text-sm font-medium">{insp.title}</p><p className="text-xs text-surface-500">{insp.area} - {formatDate(insp.inspection_date)}</p></div>
                ))}</div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h2 className="section-title">Recent Incidents</h2></div>
            <div className="card-body">
              {recentIncidents.length === 0 ? (
                <p className="text-sm text-surface-400 text-center py-4">No incidents</p>
              ) : (
                <div className="space-y-2">
                  {recentIncidents.slice(0,3).map(inc => (
                    <div key={inc.id} className="p-2.5 rounded-lg bg-red-50">
                      <p className="text-sm font-medium">{inc.title}</p>
                      <span className={`badge text-xs ${getStatusColor(inc.severity)}`}>{inc.severity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
