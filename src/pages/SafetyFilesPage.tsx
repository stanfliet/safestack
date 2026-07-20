import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, getStatusColor } from '../lib/utils';
import { 
  FileText, Plus, Search, Loader2, Upload, Download, Eye, 
  Edit3, Trash2, X, Bot, CheckCircle, AlertCircle, Printer,
  FileSpreadsheet, ChevronRight, Tag, Clock, User, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SafetyFilesPage() {
  const { user, profile } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProject, setUploadProject] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState('safety_file');
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [editingContent, setEditingContent] = useState(false);
  const [editContent, setEditContent] = useState('');

  const docTypes = [
    'safety_file', 'hs_policy', 'risk_assessment', 'method_statement',
    'safe_work_procedure', 'appointment_letter', 'emergency_plan',
    'induction_checklist', 'toolbox_talk', 'fall_protection_plan',
    'traffic_management_plan', 'ppe_register', 'plant_register',
    'inspection_checklist', 'visitor_register', 'incident_report',
    'scaffold_inspection', 'ladder_inspection', 'vehicle_inspection'
  ];

  useEffect(() => {
    loadProjects();
    loadFiles();
  }, []);

  async function loadProjects() {
    const { data } = await supabase.from('projects').select('id, name').order('name');
    if (data) setProjects(data);
  }

  async function loadFiles() {
    setLoading(true);
    const { data } = await supabase.from('safety_files').select('*, projects(name)').order('created_at', { ascending: false });
    if (data) setFiles(data);
    setLoading(false);
  }

  async function handleUpload() {
    if (!uploadFile || !uploadProject || !user) return;
    setUploading(true);
    
    const ext = uploadFile.name.split('.').pop();
    const path = `safety-files/${Date.now()}_${uploadFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('uploads').upload(path, uploadFile);
    if (uploadError) { alert('Upload failed: ' + uploadError.message); setUploading(false); return; }
    
    const { error } = await supabase.from('safety_files').insert({
      project_id: uploadProject,
      title: uploadTitle || uploadFile.name.replace(/\.[^.]+$/, ''),
      document_type: uploadDocType,
      file_url: path,
      content: null,
      version: 1,
      status: 'draft',
    });
    
    if (!error) {
      loadFiles();
      setShowUpload(false);
      setUploadFile(null);
      setUploadTitle('');
    }
    setUploading(false);
  }

  async function generateAIDocument(file: any) {
    if (!user) return;
    setPreviewFile(null);
    
    const project = projects.find(p => p.id === file.project_id);
    const prompt = `Generate a professional ${file.document_type?.replace(/_/g, ' ')} document for the project "${project?.name || 'Construction Project'}". 
Include: company letterhead, OHS compliance references to Act 85 of 1993, Construction Regulations 2014, relevant SANS standards, 
signature blocks for responsible persons, document control number, and revision history. Write in a professional OHS practitioner tone.`;

    // Insert as pending first
    await supabase.from('safety_files').update({ status: 'generating' }).eq('id', file.id);
    
    // Generate content using LLM via OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are SafeStack AI, a senior OHS practitioner with 20 years experience in South African construction safety. Generate complete, professional OHS documents with specific site details, references to SA OHS Act 85 of 1993, Construction Regulations 2014, SANS standards, and professional formatting. Return ONLY valid HTML content.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0].message.content;
      const htmlContent = content.startsWith('<') ? content : `<div class="prose">${content.replace(/\n/g, '<br/>')}</div>`;
      
      await supabase.from('safety_files').update({ 
        content: htmlContent, 
        status: 'approved',
        generated_by_ai: true,
        version: (file.version || 0) + 1,
      }).eq('id', file.id);
    } else {
      await supabase.from('safety_files').update({ status: 'draft' }).eq('id', file.id);
    }
    
    loadFiles();
  }

  async function saveEditedContent() {
    if (!previewFile) return;
    await supabase.from('safety_files').update({ content: editContent }).eq('id', previewFile.id);
    setEditingContent(false);
    loadFiles();
  }

  async function downloadAsPDF(file: any) {
    const content = file.content || `<h1>${file.title}</h1><p>No content generated yet.</p>`;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<html><head><title>${file.title}</title>
        <style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto;}
        .letterhead{border-bottom:2px solid #1e40af;padding-bottom:20px;margin-bottom:30px;}
        .letterhead h1{color:#1e40af;margin:0;font-size:24px;}
        .letterhead p{color:#64748b;margin:2px 0;font-size:12px;}
        .compliance-bar{background:#1e40af;color:white;padding:10px 20px;margin-bottom:30px;font-size:12px;display:flex;justify-content:space-between;}
        .signature-block{margin-top:50px;border-top:1px solid #e2e8f0;padding-top:30px;}
        .signature-line{margin-top:40px;border-top:1px solid #333;width:250px;}
        @media print{body{padding:20px;}}</style></head><body>
        <div class="letterhead"><h1>SafeStack</h1><p>OHS Compliance Documents</p><p>South Africa</p></div>
        <div class="compliance-bar"><span>Document: ${file.title}</span><span>Ref: SS-${file.id?.substring(0,8)}</span><span>Version: ${file.version || 1}</span></div>
        ${content}
        <div class="signature-block"><p><strong>Prepared by:</strong></p><div class="signature-line"></div><p style="margin-top:5px;font-size:12px;color:#64748b;">Date: ${new Date().toLocaleDateString()}</p></div>
        </body></html>`);
      win.document.close();
      setTimeout(() => { win.print(); }, 500);
    }
  }

  async function downloadAsWord(file: any) {
    const content = file.content || `<h1>${file.title}</h1><p>No content.</p>`;
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>${file.title}</title></head>
    <body>${content}</body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = files.filter(f => {
    if (projectFilter !== 'all' && f.project_id !== projectFilter) return false;
    if (typeFilter !== 'all' && f.document_type !== typeFilter) return false;
    if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Safety Files</h1>
          <p className="text-surface-500 mt-1">OHS compliance documents — store, generate, preview & download</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUpload(true)} className="btn-secondary">
            <Upload className="h-4 w-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Upload Safety Document</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Project *</label>
                <select className="input" value={uploadProject} onChange={e => setUploadProject(e.target.value)}>
                  <option value="">Select project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Document Title</label>
                <input className="input" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Copy of safety file..." />
              </div>
              <div>
                <label className="label">Document Type</label>
                <select className="input" value={uploadDocType} onChange={e => setUploadDocType(e.target.value)}>
                  {docTypes.map(dt => <option key={dt} value={dt}>{dt.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                </select>
              </div>
              <div>
                <label className="label">File</label>
                <input type="file" className="input" onChange={e => setUploadFile(e.target.files?.[0] || null)} accept=".pdf,.docx,.doc,.txt" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                <button className="btn-primary" disabled={!uploadFile || !uploadProject || uploading} onClick={handleUpload}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input className="input pl-10" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <select className="input w-auto" value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="input w-auto" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          {docTypes.map(dt => <option key={dt} value={dt}>{dt.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
        </select>
      </div>

      {/* Document List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 font-medium">No safety documents found</p>
          <p className="text-sm text-surface-400 mt-1">Upload a document or use AI Generator to create one</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(f => (
            <div key={f.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl ${
                      f.status === 'approved' ? 'bg-green-100' :
                      f.status === 'generating' ? 'bg-blue-100' : 'bg-amber-100'
                    }`}>
                      <FileText className={`h-5 w-5 ${
                        f.status === 'approved' ? 'text-green-600' :
                        f.status === 'generating' ? 'text-blue-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{f.title}</h3>
                      <p className="text-sm text-surface-500">{f.projects?.name} — {f.document_type?.replace(/_/g, ' ')}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-surface-400">
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" />v{f.version || 1}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(f.created_at)}</span>
                        {f.generated_by_ai && <span className="flex items-center gap-1 text-primary-600"><Bot className="h-3 w-3" />AI Generated</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!f.content && (
                      <button onClick={() => generateAIDocument(f)} className="btn-primary btn-sm">
                        <Bot className="h-3.5 w-3.5" /> Generate
                      </button>
                    )}
                    {f.content && (
                      <>
                        <button onClick={() => { setPreviewFile(f); setEditContent(f.content); }} className="btn-secondary btn-sm">
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </button>
                        <button onClick={() => downloadAsWord(f)} className="btn-secondary btn-sm">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    <span className={`badge ${getStatusColor(f.status)}`}>{f.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={() => setPreviewFile(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-surface-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-semibold">{previewFile.title}</h2>
                <p className="text-xs text-surface-400">Ref: SS-{previewFile.id?.substring(0,8)} | v{previewFile.version || 1}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingContent(!editingContent)} className="btn-secondary btn-sm">
                  <Edit3 className="h-3.5 w-3.5" /> {editingContent ? 'View' : 'Edit'}
                </button>
                <button onClick={() => downloadAsPDF(previewFile)} className="btn-secondary btn-sm">
                  <Printer className="h-3.5 w-3.5" /> Print/PDF
                </button>
                <button onClick={() => downloadAsWord(previewFile)} className="btn-secondary btn-sm">
                  <Download className="h-3.5 w-3.5" /> Word
                </button>
                <button onClick={() => setPreviewFile(null)} className="text-surface-400 hover:text-surface-600"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="p-6">
              {/* Company Letterhead */}
              <div className="border-b-2 border-primary-700 pb-5 mb-6">
                <h1 className="text-2xl font-bold text-primary-700">SafeStack</h1>
                <p className="text-xs text-surface-400">OHS Compliance Documentation System</p>
                <p className="text-xs text-surface-400">South Africa</p>
              </div>
              
              {/* Compliance Bar */}
              <div className="bg-primary-700 text-white px-4 py-2 rounded-lg mb-6 flex flex-wrap justify-between text-xs">
                <span>Document: {previewFile.title}</span>
                <span>Ref: SS-{previewFile.id?.substring(0,8)}</span>
                <span>Version: {previewFile.version || 1}</span>
                <span>Status: {previewFile.status?.toUpperCase()}</span>
              </div>

              {editingContent ? (
                <div>
                  <textarea className="input font-mono text-xs" rows={30} value={editContent} onChange={e => setEditContent(e.target.value)} />
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="btn-secondary" onClick={() => setEditingContent(false)}>Cancel</button>
                    <button className="btn-primary" onClick={saveEditedContent}>Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewFile.content || '<p>No content available. Click Generate to create document.</p>' }} />
              )}

              {/* Signature Block */}
              <div className="mt-12 pt-8 border-t border-surface-200">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="font-semibold text-sm mb-8">Prepared by:</p>
                    <div className="border-t border-surface-400 w-64 pt-1">
                      <p className="text-xs text-surface-500">Date: {new Date().toLocaleDateString('en-ZA')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-8">Approved by:</p>
                    <div className="border-t border-surface-400 w-64 pt-1">
                      <p className="text-xs text-surface-500">Date: _______________</p>
                    </div>
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