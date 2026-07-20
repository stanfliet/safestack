import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { callOpenAI, callAI, callGemini, generateDocumentHTML } from '../lib/openai';
import { Bot, FileText, AlertTriangle, ClipboardCheck, Loader2, Copy, Check, Download, Edit3, Save, X, Upload, Eye, FileUp } from 'lucide-react';
import { formatDate } from '../lib/utils';

const MODES = [
  { id: 'document', label: 'OHS Document', icon: FileText, desc: 'Generate policies, plans, registers, method statements' },
  { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle, desc: 'Generate risk assessments with controls & ratings' },
  { id: 'checklist', label: 'Inspection Checklist', icon: ClipboardCheck, desc: 'Generate site-specific inspection checklists' },
];

const DOC_TYPES = [
  'Health & Safety Policy', 'Method Statement', 'Safe Work Procedure',
  'Emergency Response Plan', 'Fall Protection Plan', 'Traffic Management Plan',
  'Toolbox Talk', 'Induction Checklist', 'Construction Work Permit',
  'Environmental Management Plan', 'Site Establishment Plan',
];

export default function AIGeneratorPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('document');
  const [docType, setDocType] = useState('Health & Safety Policy');
  const [projectContext, setProjectContext] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [resultHtml, setResultHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadResult, setUploadResult] = useState('');
  const [tab, setTab] = useState<'generate' | 'upload' | 'history'>('generate');
  const [aiProvider, setAiProvider] = useState<'auto' | 'gemini'>('gemini');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadHistory() {
    if (!user) return;
    setLoadingHistory(true);
    const { data } = await supabase.from('ai_generations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
    if (data) setHistory(data);
    setLoadingHistory(false);
  }

  async function generate() {
    setGenerating(true);
    setResult('');
    setResultHtml('');
    setEditing(false);
    try {
      let prompt = '';
      if (mode === 'document') {
        prompt = 'Generate a professional ' + docType + ' for a construction project in South Africa.\n\nProject Context: ' + (projectContext || 'General construction site') + '\n\nInclude: Clear purpose and scope, Legal references to OHS Act 85 of 1993, Specific responsibilities for all roles, Practical implementation steps, Review and approval process';
      } else if (mode === 'risk') {
        prompt = 'Generate a comprehensive risk assessment for a construction project in South Africa.\n\nProject Context: ' + (projectContext || 'General construction site') + '\n\nInclude: At least 8 specific hazards with detailed descriptions, Risk ratings (L x S = R) with proper scoring, Specific control measures for each hazard, Residual risk ratings after controls, Review and approval section';
      } else {
        prompt = 'Generate a detailed inspection checklist for a construction project in South Africa.\n\nProject Context: ' + (projectContext || 'General construction site') + '\n\nInclude: At least 20 specific check items across categories, Yes/No/N/A columns, Comments section for each item, Inspector sign-off section, Date and project reference fields';
      }
      const systemMsg = 'You are a professional OHS document writer for construction in South Africa. Generate comprehensive, regulation-compliant documents in valid Markdown with proper headings, tables, and formatting.';
            let content;
      if (aiProvider === 'gemini') {
        content = await callGemini(systemMsg, prompt);
      } else {
        content = await callAI(systemMsg, prompt);
      }
      setResult(content);
      const html = await generateDocumentHTML(content, docType);
      setResultHtml(html);
    } catch (err: any) {
      setResult('Error: ' + (err.message || 'Generation failed'));
    } finally {
      setGenerating(false);
    }
  }

  function startEdit() { setEditContent(result); setEditing(true); setShowPreview(false); }
  function saveEdit() { setResult(editContent); setEditing(false); }

  function downloadDoc() {
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = docType.replace(/\\s+/g, '_') + '.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadHTML() {
    const fullHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + docType + '</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}h1,h2{color:#1a365d}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px}</style></head><body>' + resultHtml + '</body></html>';
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = docType.replace(/\\s+/g, '_') + '.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  function useHistoryItem(item: any) {
    setResult(item.generated_content || '');
    setMode(item.generation_type || 'document');
    setResultHtml('');
    setEditing(false);
    setTab('generate');
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    setUploadResult('');
    try {
      const text = await file.text();
      const sysMsg = 'You are an OHS document analyst. Extract key information, risks, legislative references, and compliance gaps. Format as Markdown.';
      const analysis = await callAI(sysMsg, 'Analyze this OHS document and extract all key information:\\n\\n' + text.slice(0, 15000));
      setUploadResult(analysis);
    } catch (err: any) {
      setUploadResult('Error: ' + (err.message || 'Analysis failed'));
    } finally {
      setUploadingDoc(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Document Generator</h1>
        <p className="text-gray-500 text-sm mt-1">Generate, upload, and manage OHS documents with AI</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['generate', 'upload', 'history'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); if (t === 'history') loadHistory(); }}
            className={'px-4 py-2 rounded-lg text-sm font-medium capitalize ' + (tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700')}>
            {t === 'generate' && <><Bot className="h-4 w-4 inline mr-1.5 -mt-0.5" />Generate</>}
            {t === 'upload' && <><Upload className="h-4 w-4 inline mr-1.5 -mt-0.5" />Upload &amp; Analyze</>}
            {t === 'history' && <><FileText className="h-4 w-4 inline mr-1.5 -mt-0.5" />History</>}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-3">
        <span className="text-xs text-gray-400 font-medium">AI Provider:</span>
        <button onClick={() => setAiProvider('gemini')}
          className={'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ' + (aiProvider === 'gemini' ? 'bg-green-600 text-white shadow-sm' : 'bg-white border text-gray-600 hover:bg-gray-50')}>
          <Bot className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />Gemini
        </button>
        <button onClick={() => setAiProvider('auto')}
          className={'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ' + (aiProvider === 'auto' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border text-gray-600 hover:bg-gray-50')}>
          Auto (Fallback)
        </button>
        {aiProvider === 'gemini' && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <Check className="h-3 w-3" />Primary
          </span>
        )}
      </div>

      {tab === 'generate' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {MODES.map(m => (
              <button key={m.id} onClick={() => { setMode(m.id); setResult(''); setResultHtml(''); }}
                className={'bg-white rounded-xl shadow-sm border p-5 text-left hover:shadow-md transition-all ' + (mode === m.id ? 'ring-2 ring-blue-500 bg-blue-50/30' : '')}>
                <div className={'w-10 h-10 rounded-xl flex items-center justify-center mb-3 ' + (mode === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600')}><m.icon className="h-5 w-5" /></div>
                <h3 className="font-semibold text-sm">{m.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-6 py-4 border-b"><h2 className="font-semibold">Input</h2></div>
              <div className="p-6 space-y-4">
                {mode === 'document' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm" value={docType} onChange={e => setDocType(e.target.value)}>
                      {DOC_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Context</label>
                  <textarea className="w-full px-3 py-2 border rounded-lg text-sm resize-none" rows={4}
                    placeholder="e.g., 3-storey office building, Bedfordview, 12-month project"
                    value={projectContext} onChange={e => setProjectContext(e.target.value)} />
                </div>
                <button onClick={generate} disabled={generating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Bot className="h-4 w-4" /> Generate Document</>}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="font-semibold">Output</h2>
                {result && (
                  <div className="flex items-center gap-2">
                    {resultHtml && (
                      <button onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 border rounded-lg hover:bg-gray-50">
                        <Eye className="h-3 w-3" />{showPreview ? 'Markdown' : 'Preview'}
                      </button>
                    )}
                    <button onClick={startEdit}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 border rounded-lg hover:bg-gray-50">
                      <Edit3 className="h-3 w-3" /> Edit
                    </button>
                    <button onClick={downloadDoc}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 border rounded-lg hover:bg-gray-50">
                      <Download className="h-3 w-3" /> .md
                    </button>
                    {resultHtml && (
                      <button onClick={downloadHTML}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 border rounded-lg hover:bg-gray-50">
                        <Download className="h-3 w-3" /> .html
                      </button>
                    )}
                    <button onClick={async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 border rounded-lg hover:bg-gray-50">
                      {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}{copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                {!result ? (
                  <div className="text-center py-12 text-gray-400">
                    <Bot className="h-12 w-12 mx-auto mb-2" />
                    <p>{generating ? 'Generating...' : 'Configure options and click Generate'}</p>
                  </div>
                ) : editing ? (
                  <div className="space-y-3">
                    <textarea className="w-full h-[400px] px-3 py-2 border rounded-lg text-sm font-mono resize-none"
                      value={editContent} onChange={e => setEditContent(e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={saveEdit}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        <Save className="h-3 w-3" /> Save
                      </button>
                      <button onClick={() => setEditing(false)}
                        className="flex items-center gap-1 px-3 py-1.5 border text-sm rounded-lg hover:bg-gray-50">
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : showPreview && resultHtml ? (
                  <div className="border rounded-lg p-4 max-h-[500px] overflow-y-auto prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: resultHtml }} />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm font-sans bg-gray-50 p-4 rounded-xl max-h-[500px] overflow-y-auto">{result}</pre>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'upload' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileUp className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Upload Document for AI Analysis</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Upload any OHS document (PDF, DOCX, TXT) and our AI will extract and organize all key information
            </p>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc,.txt,.csv" onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploadingDoc}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {uploadingDoc ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Upload className="h-4 w-4" /> Select &amp; Upload</>}
            </button>
          </div>
          {uploadResult && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold mb-3">Analysis Result</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <pre className="whitespace-pre-wrap text-sm font-sans max-h-[500px] overflow-y-auto">{uploadResult}</pre>
              </div>
              <button onClick={async () => { await navigator.clipboard.writeText(uploadResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="flex items-center gap-1 text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50 mt-3">
                {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}{copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b"><h2 className="font-semibold">Generation History</h2></div>
          <div className="divide-y">
            {loadingHistory ? (
              <div className="p-6 text-center text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />Loading...
              </div>
            ) : history.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <FileText className="h-8 w-8 mx-auto mb-2" />No previous generations found
              </div>
            ) : (
              history.map((item: any) => (
                <button key={item.id} onClick={() => useHistoryItem(item)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{item.generation_type}: {item.prompt?.slice(0, 60)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.created_at ? formatDate(item.created_at) : 'Unknown'} &middot; {item.model_used || 'N/A'}</p>
                    </div>
                    <span className="text-xs text-gray-400">{(item.tokens_used || 0).toLocaleString()} chars</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
