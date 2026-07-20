import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate, getStatusColor, generateCertNumber } from '../lib/utils';
import { GraduationCap, Search, BookOpen, Clock, Award, DollarSign, ChevronRight, Play, FileText, CheckCircle, Lock, Loader2, ShieldCheck, Building2, BarChart3, UserPlus, AlertCircle, X, Download, ExternalLink, Users, Library, Video, BookMarked, HelpCircle, FolderOpen } from 'lucide-react';

export default function TrainingPage() {
  const { user, profile, isAdmin } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [showBooking, setShowBooking] = useState<any>(null);
  const [showStudy, setShowStudy] = useState(false);
  const [studyEnrollment, setStudyEnrollment] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadData(); if (user) { loadEnrollments(); loadCertificates(); } }, [user]);

  async function loadData() {
    setLoading(true);
    const [catRes, trainRes] = await Promise.all([
      supabase.from('training_categories').select('*').order('display_order'),
      supabase.from('trainings').select('*, training_categories!inner(*)').eq('status', 'published').order('title'),
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (trainRes.data) setTrainings(trainRes.data);
    setLoading(false);
  }

  async function loadEnrollments() {
    if (!user) return;
    const { data } = await supabase.from('enrollments').select('*, trainings(*)').eq('user_id', user.id);
    if (data) setEnrollments(data);
  }

  async function loadCertificates() {
    if (!user) return;
    const { data } = await supabase.from('certificates').select('*, trainings(title)').eq('user_id', user.id).order('issue_date', { ascending: false });
    if (data) setCertificates(data);
  }

  const RESOURCE_LIBRARY = [
    { id:'ohs-act', title:'OHS Act 85 of 1993', category:'legislation', type:'pdf', desc:'Full text of the Occupational Health and Safety Act, South African primary OHS legislation.', url:'#' },
    { id:'const-regs', title:'Construction Regulations 2014', category:'legislation', type:'pdf', desc:'Construction-specific regulations under the OHS Act covering all construction work requirements.', url:'#' },
    { id:'sans-10085', title:'SANS 10085: PPE Standard', category:'standards', type:'pdf', desc:'South African National Standard for personal protective equipment selection and use.', url:'#' },
    { id:'sans-10400', title:'SANS 10400: Building Regulations', category:'standards', type:'pdf', desc:'National building regulations covering structural safety, fire, and accessibility.', url:'#' },
    { id:'sans-50001', title:'SANS 50001: OH&S Management', category:'standards', type:'pdf', desc:'Standard for occupational health and safety management systems requirements.', url:'#' },
    { id:'iso-45001', title:'ISO 45001:2018 OH&S Management', category:'standards', type:'pdf', desc:'International standard for occupational health and safety management systems.', url:'#' },
    { id:'risk-man', title:'Risk Assessment Methodology Guide', category:'guide', type:'document', desc:'Step-by-step guide to conducting construction risk assessments using the 5x5 matrix.', url:'#' },
    { id:'inc-inv', title:'Incident Investigation Procedure', category:'guide', type:'document', desc:'Complete procedure for investigating workplace incidents including root cause analysis.', url:'#' },
    { id:'safety-file', title:'Safety File Index & Checklist', category:'guide', type:'document', desc:'Comprehensive checklist of all documents required for a compliant construction safety file.', url:'#' },
    { id:'method-state', title:'Method Statement Template Guide', category:'guide', type:'document', desc:'Guide to writing effective method statements with examples for common construction activities.', url:'#' },
    { id:'fall-protect', title:'Fall Protection Plan Template', category:'template', type:'document', desc:'Editable fall protection plan template compliant with Construction Regulation 10.', url:'#' },
    { id:'emerg-plan', title:'Emergency Response Plan Template', category:'template', type:'document', desc:'Site-specific emergency response plan template covering fire, medical, and evacuation.', url:'#' },
    { id:'toolbox-talk', title:'Toolbox Talk Schedule', category:'template', type:'document', desc:'Weekly toolbox talk topics schedule covering all construction safety topics.', url:'#' },
    { id:'ppe-register', title:'PPE Issue & Inspection Register', category:'template', type:'document', desc:'Register for tracking PPE issuance, inspection, and replacement schedules.', url:'#' },
    { id:'site-induct', title:'Site Induction Presentation', category:'training', type:'video', desc:'Comprehensive site induction covering all safety requirements for visitors and workers.', url:'#' },
    { id:'scaffold-safe', title:'Scaffolding Safety Training', category:'training', type:'video', desc:'Training module on safe scaffolding erection, inspection, and use.', url:'#' },
    { id:'excavation', title:'Excavation Safety Training', category:'training', type:'video', desc:'Training on safe excavation practices including trench support and access.', url:'#' },
    { id:'confined-space', title:'Confined Space Entry Training', category:'training', type:'video', desc:'Training module on confined space identification, entry procedures, and rescue.', url:'#' },
    { id:'fire-safety', title:'Fire Safety & Extinguisher Training', category:'training', type:'video', desc:'Training on fire prevention, types of fires, and extinguisher operation.', url:'#' },
    { id:'first-aid', title:'Basic First Aid Guide', category:'resource', type:'document', desc:'Quick reference guide for common construction site injuries and first aid procedures.', url:'#' },
    { id:'heat-stress', title:'Heat Stress Management Guide', category:'resource', type:'document', desc:'Guide to preventing and managing heat stress on construction sites in South Africa.', url:'#' },
    { id:'covid-19', title:'COVID-19 Workplace Protocol', category:'resource', type:'document', desc:'Workplace health and safety protocols for infectious disease management.', url:'#' },
    { id:'drug-alcohol', title:'Drug & Alcohol Policy Template', category:'template', type:'document', desc:'Substance abuse policy template for construction sites including testing procedures.', url:'#' },
    { id:'env-plan', title:'Environmental Management Plan Template', category:'template', type:'document', desc:'Site EMP template covering waste, water, dust, noise, and flora/fauna management.', url:'#' },
    { id:'plant-safe', title:'Plant & Equipment Safety Checklist', category:'checklist', type:'document', desc:'Daily pre-use inspection checklist for common construction plant and equipment.', url:'#' },
    { id:'elec-safe', title:'Electrical Safety Checklist', category:'checklist', type:'document', desc:'Monthly electrical installation inspection checklist for construction sites.', url:'#' },
    { id:'ladder-safe', title:'Ladder Inspection Checklist', category:'checklist', type:'document', desc:'Weekly ladder inspection checklist compliant with SANS standards.', url:'#' },
    { id:'crane-lift', title:'Crane Lift Plan Template', category:'template', type:'document', desc:'Template for planning and documenting critical and routine crane lifts.', url:'#' },
    { id:'waste-man', title:'Construction Waste Management Plan', category:'guide', type:'document', desc:'Guide to managing construction waste including recycling and disposal requirements.', url:'#' },
    { id:'noise-survey', title:'Noise Survey Report Template', category:'template', type:'document', desc:'Template for conducting and reporting workplace noise assessments.', url:'#' },
  ];

  async function loadResources() {
    setLoadingResources(true);
    // Check if resources exist in DB, if not load from library
    const { data, error } = await supabase.from('training_resources').select('*').order('title');
    if (error || !data || data.length === 0) {
      // Seed from library if table exists
      try {
        for (const r of RESOURCE_LIBRARY) {
          await supabase.from('training_resources').insert({
            title: r.title, category: r.category, resource_type: r.type,
            description: r.desc, url: r.url, is_public: true, status: 'published',
          }).maybeSingle();
        }
      } catch (e) { /* table may not exist */ }
      setResources(RESOURCE_LIBRARY);
    } else {
      setResources(data);
    }
    setLoadingResources(false);
  }



  async function requestBooking(training: any) {
    if (!user || !profile) return;
    setGenerating(true);
    const isFree = training.is_free || isAdmin;
    const { error } = await supabase.from('enrollments').insert({
      user_id: user.id, training_id: training.id,
      status: isFree ? 'active' : 'pending_payment',
      amount_paid: isFree ? 0 : training.price,
      payment_ref: isFree ? 'FREE-' + Date.now() : null,
      payment_date: isFree ? new Date().toISOString() : null,
    });
    if (!error) {
      setShowBooking(null);
      loadEnrollments();
    }
    setGenerating(false);
  }

  async function generateCert(enrollment: any) {
    if (!user || !profile) return;
    setGenerating(true);
    const certNum = generateCertNumber();
    const { error } = await supabase.from('certificates').insert({
      user_id: user.id, enrollment_id: enrollment.id,
      training_id: enrollment.training_id,
      certificate_number: certNum,
      full_name: profile.full_name || user.email || 'Student',
      course_name: enrollment.trainings?.title || 'Course',
      issue_date: new Date().toISOString().split('T')[0],
      status: 'issued',
    });
    if (!error) loadCertificates();
    setGenerating(false);
  }

  async function markComplete(enrollment: any) {
    await supabase.from('enrollments').update({ progress_pct: 100, status: 'completed', completed_at: new Date().toISOString() }).eq('id', enrollment.id);
    loadEnrollments();
  }

  const filtered = trainings.filter(t => {
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getEnrollment = (tid: string) => enrollments.find(e => e.training_id === tid);
  const getCert = (tid: string) => certificates.find(c => c.training_id === tid);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Training & Development</h1>
          <p className="text-surface-500 mt-1">Browse courses, book training, study online, and earn accredited certificates</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('browse')} className={`btn-sm rounded-xl ${activeTab === 'browse' ? 'bg-primary-600 text-white' : 'btn-secondary'}`}><BookOpen className="h-4 w-4" /> Browse</button>
          <button onClick={() => setActiveTab('my')} className={`btn-sm rounded-xl ${activeTab === 'my' ? 'bg-primary-600 text-white' : 'btn-secondary'}`}><GraduationCap className="h-4 w-4" /> My Courses</button>
          <button onClick={() => setActiveTab('certificates')} className={`btn-sm rounded-xl ${activeTab === 'certificates' ? 'bg-primary-600 text-white' : 'btn-secondary'}`}><Award className="h-4 w-4" /> Certificates</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" /><input className="input pl-10" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setCategoryFilter('all')} className={`px-4 py-1.5 rounded-xl text-xs font-medium ${categoryFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>All</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setCategoryFilter(c.id)} className={`px-4 py-1.5 rounded-xl text-xs font-medium ${categoryFilter === c.id ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>{c.name}</button>
        ))}
      </div>

      {/* Browse */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full card p-12 text-center"><BookOpen className="h-12 w-12 mx-auto mb-3 text-surface-300" /><p className="text-surface-500 font-medium">No courses found</p></div>
          ) : filtered.map(course => {
            const enrollment = getEnrollment(course.id);
            const cert = getCert(course.id);
            return (
              <div key={course.id} className="card hover:shadow-lg transition-all cursor-pointer group overflow-hidden" onClick={() => setSelectedCourse(course)}>
                <div className="h-40 bg-gradient-to-br from-primary-600 to-indigo-800 flex items-center justify-center relative">
                  <GraduationCap className="h-16 w-16 text-white/20" />
                  <span className="absolute top-3 right-3 badge bg-white/90 text-surface-700 text-xs">{course.level}</span>
                  {course.is_free && <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-2 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                  <p className="text-sm text-surface-500 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-surface-400">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration_hours}h</span>
                      {course.accreditation && <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" />CPD</span>}
                    </div>
                    {enrollment ? (
                      <span className={`badge ${getStatusColor(enrollment.status)}`}>{enrollment.status.replace('_', ' ')}</span>
                    ) : (
                      <span className="font-semibold text-primary-600">{course.is_free ? 'Free' : formatCurrency(course.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Courses */}
      {activeTab === 'my' && (
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="card p-12 text-center"><GraduationCap className="h-12 w-12 mx-auto mb-3 text-surface-300" /><p className="text-surface-500 font-medium">No enrolled courses</p><p className="text-sm text-surface-400 mt-1">Browse and book a course to get started</p></div>
          ) : enrollments.map(enrollment => (
            <div key={enrollment.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-100"><GraduationCap className="h-6 w-6 text-primary-600" /></div>
                    <div>
                      <h3 className="font-semibold">{enrollment.trainings?.title}</h3>
                      <p className="text-sm text-surface-500 mt-1">Enrolled: {formatDate(enrollment.created_at)}</p>
                      {enrollment.progress_pct > 0 && (
                        <div className="mt-2 flex items-center gap-2 max-w-xs">
                          <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${enrollment.progress_pct}%` }} /></div>
                          <span className="text-xs text-surface-500">{enrollment.progress_pct}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${getStatusColor(enrollment.status)}`}>{enrollment.status.replace('_', ' ')}</span>
                    {enrollment.status === 'active' && (
                      <button onClick={() => { setStudyEnrollment(enrollment); setShowStudy(true); }} className="btn-primary btn-sm"><Play className="h-3.5 w-3.5" /> Study</button>
                    )}
                    {enrollment.status === 'completed' && !getCert(enrollment.training_id) && (
                      <button onClick={() => generateCert(enrollment)} disabled={generating} className="btn-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                        {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Award className="h-3.5 w-3.5" />} Get Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.length === 0 ? (
            <div className="col-span-full card p-12 text-center"><Award className="h-12 w-12 mx-auto mb-3 text-surface-300" /><p className="text-surface-500 font-medium">No certificates yet. Complete a course to earn one.</p></div>
          ) : certificates.map(cert => (
            <div key={cert.id} className="card border-l-4 border-l-primary-500">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100"><Award className="h-6 w-6 text-amber-600" /></div>
                    <div>
                      <h3 className="font-semibold">{cert.course_name}</h3>
                      <p className="text-sm text-surface-500">{cert.full_name}</p>
                      <p className="text-xs text-surface-400 mt-1">Cert#: {cert.certificate_number}</p>
                      <p className="text-xs text-surface-400">Issued: {formatDate(cert.issue_date)}</p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(cert.status)}`}>{cert.status}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-surface-100 flex gap-2">
                  <button className="btn-secondary btn-sm"><Download className="h-3.5 w-3.5" /> Download PDF</button>
                  <button className="btn-secondary btn-sm"><ExternalLink className="h-3.5 w-3.5" /> Verify</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input className="input pl-10" placeholder="Search resources..." value={resourceSearch}
                  onChange={e => setResourceSearch(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all','legislation','standards','guide','template','training','resource','checklist'].map(cat => (
              <button key={cat} onClick={() => setResourceFilter(cat === 'all' ? '' : cat)}
                className={'px-3 py-1.5 text-sm rounded-lg transition-colors ' + (resourceFilter === cat || (cat === 'all' && !resourceFilter) ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-surface-100 text-surface-600 hover:bg-surface-200')}>
                {cat === 'all' ? 'All' : cat.replace(/\w/g, (l: string) => l.toUpperCase())}
              </button>
            ))}
          </div>

          {loadingResources ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources
                .filter((r: any) => !resourceFilter || r.category === resourceFilter)
                .filter((r: any) => !resourceSearch || r.title.toLowerCase().includes(resourceSearch.toLowerCase()) || r.description?.toLowerCase().includes(resourceSearch.toLowerCase()))
                .map((r: any) => (
                  <div key={r.id} className="card hover:shadow-md transition-shadow">
                    <div className="card-body">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={'p-2 rounded-lg ' + (r.type === 'pdf' ? 'bg-red-100' : r.type === 'video' ? 'bg-purple-100' : r.type === 'document' ? 'bg-blue-100' : 'bg-green-100')}>
                          {r.type === 'pdf' ? <FileText className={'h-5 w-5 text-red-600'} /> :
                           r.type === 'video' ? <Video className={'h-5 w-5 text-purple-600'} /> :
                           r.type === 'document' ? <BookMarked className={'h-5 w-5 text-blue-600'} /> :
                           <HelpCircle className={'h-5 w-5 text-green-600'} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{r.title}</h3>
                          <p className="text-xs text-surface-500 mt-0.5">
                            <span className="badge bg-surface-100 text-surface-600 text-[10px]">{r.category}</span>
                            <span className="badge bg-surface-100 text-surface-600 text-[10px] ml-1">{r.type}</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-surface-600 line-clamp-2">{r.desc || r.description}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100">
                        <button className="btn-primary btn-sm flex-1 justify-center"><Download className="h-3.5 w-3.5" /> Download</button>
                        <button className="btn-secondary btn-sm flex-1 justify-center"><FileText className="h-3.5 w-3.5" /> View</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {!loadingResources && resources.length === 0 && (
            <div className="card p-12 text-center">
              <Library className="h-12 w-12 mx-auto mb-3 text-surface-300" />
              <p className="text-surface-500 font-medium">No resources available</p>
              <p className="text-sm text-surface-400 mt-1">Resources will be available from the learning library.</p>
            </div>
          )}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={() => setSelectedCourse(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="h-40 bg-gradient-to-br from-primary-600 to-indigo-800 rounded-t-2xl flex items-center justify-center relative">
              <GraduationCap className="h-16 w-16 text-white/20" />
              <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 text-white/70 hover:text-white"><X className="h-6 w-6" /></button>
              <div className="absolute bottom-4 left-6"><h2 className="text-xl font-bold text-white">{selectedCourse.title}</h2></div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1 text-surface-500"><Clock className="h-4 w-4" /> {selectedCourse.duration_hours}h</span>
                <span className={`badge ${getStatusColor(selectedCourse.level)}`}>{selectedCourse.level}</span>
                {selectedCourse.accreditation && <span className="flex items-center gap-1 text-amber-600"><Award className="h-4 w-4" /> {selectedCourse.accreditation}</span>}
                <span className="font-semibold text-primary-600">{selectedCourse.is_free ? 'Free' : formatCurrency(selectedCourse.price)}</span>
              </div>
              <p className="text-surface-700">{selectedCourse.description}</p>
              {selectedCourse.learning_objectives?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Learning Objectives</h3>
                  <ul className="space-y-1">{selectedCourse.learning_objectives.map((obj: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-600"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{obj}</li>
                  ))}</ul>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                {getEnrollment(selectedCourse.id) ? (
                  <div className="text-sm text-green-600 font-medium flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Already enrolled</div>
                ) : (
                  <>
                    <button onClick={() => setShowBooking(selectedCourse)} className="btn-primary">
                      {selectedCourse.is_free || isAdmin ? 'Start Free Course' : `Book Now - ${formatCurrency(selectedCourse.price)}`}
                    </button>
                    <button className="btn-secondary">View Syllabus</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBooking(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Confirm Booking</h2>
            <p className="font-semibold mb-1">{showBooking.title}</p>
            <p className="text-sm text-surface-500 mb-4">{showBooking.is_free || isAdmin ? 'Free access' : `Price: ${formatCurrency(showBooking.price)}`}</p>
            {!showBooking.is_free && !isAdmin && (
              <div className="p-3 bg-amber-50 rounded-xl mb-4 text-sm text-amber-700">After booking, payment must be received before course access is granted.</div>
            )}
            <div className="flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setShowBooking(null)}>Cancel</button>
              <button onClick={() => requestBooking(showBooking)} disabled={generating} className="btn-primary">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Modal */}
      {showStudy && studyEnrollment && (
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowStudy(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-surface-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold">{studyEnrollment.trainings?.title}</h2>
              <button onClick={() => setShowStudy(false)} className="text-surface-400 hover:text-surface-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="prose">
                    <h2>Course Content</h2>
                    <p>{studyEnrollment.trainings?.description}</p>
                    {studyEnrollment.trainings?.learning_objectives?.length > 0 && (
                      <>
                        <h3>What you will learn:</h3>
                        <ul>{studyEnrollment.trainings.learning_objectives.map((obj: string, i: number) => <li key={i}>{obj}</li>)}</ul>
                      </>
                    )}
                    <h3>Study Materials</h3>
                    <p>Access your comprehensive study materials below. Read online or download for offline study.</p>
                    <div className="flex gap-2 mt-4">
                      <button className="btn-primary"><Download className="h-4 w-4" /> Download PDF</button>
                      <button className="btn-secondary"><FileText className="h-4 w-4" /> View Online</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="card p-4">
                    <h3 className="font-semibold text-sm mb-3">Course Progress</h3>
                    <div className="h-2 bg-surface-200 rounded-full overflow-hidden mb-2"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${studyEnrollment.progress_pct || 0}%` }} /></div>
                    <p className="text-xs text-surface-500">{studyEnrollment.progress_pct || 0}% Complete</p>
                    <button onClick={() => markComplete(studyEnrollment)} className="w-full mt-3 btn-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Mark as Complete</button>
                  </div>
                  <div className="card p-4">
                    <h3 className="font-semibold text-sm mb-2">Certificate</h3>
                    <p className="text-xs text-surface-500">Complete the course to earn your accredited certificate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
