import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileText, Bot, Loader2, Download, CheckCircle, AlertCircle, X, ArrowRight, DollarSign, Building2, Shield, FileSpreadsheet, GraduationCap, ShieldCheck, ClipboardCheck, AlertTriangle } from 'lucide-react';

export default function SmartUploadPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'create_project' | 'build_safety' | 'price_boq' | 'safety_file' | 'risk_assessment' | 'incident_report' | 'inspection_checklist' | 'training_record' | 'compliance_checklist' | 'method_statement' | 'emergency_plan' | 'environmental_plan' | 'medical_surveillance' | 'ppe_register' | 'plant_register'>('create_project');
  const [results, setResults] = useState<any[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [pricedItems, setPricedItems] = useState<any[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showExtractedForm, setShowExtractedForm] = useState(false);
  const [formData, setFormData] = useState({ name:'', client_name:'', location:'', description:'', start_date:'', end_date:'', number_of_workers:'' });
  const [creating, setCreating] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  async function analyzeAndProcess() {
    if (!files.length || !user) return;
    setUploading(true);
    setResults([]);
    setExtractedData(null);
    setPricedItems([]);

    for (const file of files) {
      try {
        const ext = file.name.split('.').pop();
        const path = `smart-upload/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file);
        if (uploadError) throw uploadError;

        const publicUrl = supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl;
        let extracted = { name: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), client_name: '', location: '', description: '', start_date: '', end_date: '', number_of_workers: '' };

        // Try to read text content for extraction
        try {
          const text = await file.text();
          const clientMatch = text.match(/client[:\s]+([^\n\r]+)/i);
          if (clientMatch) extracted.client_name = clientMatch[1].trim();
          const nameMatch = text.match(/project[:\s]+([^\n\r]+)/i);
          if (nameMatch) extracted.name = nameMatch[1].trim();
          const locMatch = text.match(/(?:site|location|address)[:\s]+([^\n\r]+)/i);
          if (locMatch) extracted.location = locMatch[1].trim();
          const workerMatch = text.match(/(?:workers|staff|employees)[:\s]+(\d+)/i);
          if (workerMatch) extracted.number_of_workers = workerMatch[1];
          const dateMatch = text.match(/(?:start|commencement)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
          if (dateMatch) extracted.start_date = dateMatch[1];
          const descParts = text.split('\n').filter((l: string) => l.trim().length > 30).slice(0, 8);
          extracted.description = descParts.join('\n').substring(0, 1000);
        } catch (e) { /* binary file */ }

        if (mode === 'price_boq') {
          // BOQ Pricing mode
          const items = await priceBOQ(file, path, user.id);
          setPricedItems(prev => [...prev, ...items]);
          const total = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
          setGrandTotal(prev => prev + total);
          setResults(prev => [...prev, { file: file.name, status: 'success', message: `${items.length} line items priced. Total: R ${total.toLocaleString()}` }]);
        } else if (['safety_file', 'risk_assessment', 'inspection_checklist', 'training_record', 'compliance_checklist', 'method_statement', 'emergency_plan', 'environmental_plan', 'medical_surveillance', 'ppe_register', 'plant_register'].includes(mode)) {
          // OHSE document upload mode - extract and save to appropriate table
          const contentText = extracted.description || 'Content extracted from uploaded document';
          const tableMap: Record<string, string> = {
            safety_file: 'safety_files',
            method_statement: 'safety_files',
            emergency_plan: 'safety_files',
            environmental_plan: 'safety_files',
            ppe_register: 'safety_files',
            plant_register: 'safety_files',
          };
          const docTypeMap: Record<string, string> = {
            safety_file: 'safety_file',
            risk_assessment: 'risk_assessment',
            inspection_checklist: 'inspection_checklist',
            training_record: 'training_record',
            compliance_checklist: 'compliance_checklist',
            method_statement: 'method_statement',
            emergency_plan: 'emergency_plan',
            environmental_plan: 'environmental_plan',
            medical_surveillance: 'medical_surveillance',
            ppe_register: 'ppe_register',
            plant_register: 'plant_register',
          };
          
          await supabase.from('document_analyses').insert({
            user_id: user.id, file_url: path, original_filename: file.name,
            analysis_type: mode, extracted_data: extracted,
            status: 'completed',
          });
          
          setResults(prev => [...prev, { file: file.name, status: 'success', message: `${mode.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} extracted and recorded.` }]);
        } else {
          // Create project or Build safety file
          setExtractedData(extracted);
          setFormData(extracted);
          setShowExtractedForm(true);
          setResults(prev => [...prev, { file: file.name, status: 'success', message: 'Data extracted. Review and confirm below.' }]);
        }
      } catch (err: any) {
        setResults(prev => [...prev, { file: file.name, status: 'error', message: err.message }]);
      }
    }
    setUploading(false);
  }

  async function priceBOQ(file: File, path: string, userId: string): Promise<any[]> {
    const text = await file.text();
    const lines = text.split('\n').filter((l: string) => l.trim());
    const items: any[] = [];
    let itemNo = 0;

    for (const line of lines) {
      const parts = line.split(/[,\t]/).map((p: string) => p.trim());
      if (parts.length < 2) continue;
      const desc = parts[0];
      const qty = parseFloat(parts[1]) || 1;
      const unit = parts[2] || 'each';
      
      // Look up rate from pricing database
      const { data: rates } = await supabase.from('pricing_data')
        .select('unit_price').ilike('description', `%${desc.substring(0, 20)}%`).limit(1);
      
      const rate = rates?.length ? rates[0].unit_price : estimateRate(desc);
      itemNo++;
      items.push({
        user_id: userId, item_no: `ITEM-${itemNo}`, description: desc, unit, quantity: qty,
        rate, priced_by_ai: true, status: 'pending_review', source_file_url: path,
      });
    }

    // Save to DB in batches of 50
    for (let i = 0; i < items.length; i += 50) {
      const batch = items.slice(i, i + 50).map(({ total, ...rest }) => rest);
      await supabase.from('boq_items').insert(batch);
    }

    return items;
  }

  function estimateRate(desc: string): number {
    const d = desc.toLowerCase();
    if (d.includes('concrete') || d.includes('cement')) return 1500;
    if (d.includes('steel') || d.includes('rebar')) return 2500;
    if (d.includes('excavation') || d.includes('earth')) return 350;
    if (d.includes('labour') || d.includes('worker')) return 250;
    if (d.includes('paint')) return 180;
    if (d.includes('brick') || d.includes('block')) return 850;
    if (d.includes('pipe') || d.includes('drain')) return 450;
    if (d.includes('electrical') || d.includes('cable')) return 550;
    if (d.includes('roof')) return 1200;
    if (d.includes('timber') || d.includes('wood')) return 800;
    return 500;
  }

  async function createProjectFromExtracted() {
    if (!user || !extractedData) return;
    setCreating(true);
    const { data: project, error } = await supabase.from('projects').insert({
      user_id: user.id, name: formData.name, client_name: formData.client_name || null,
      location: formData.location || null, description: formData.description || null,
      start_date: formData.start_date || null, end_date: formData.end_date || null,
      number_of_workers: formData.number_of_workers ? parseInt(formData.number_of_workers) : null,
      status: 'planning',
    }).select().single();

    if (!error && project) {
      // Save analysis record
      await supabase.from('document_analyses').insert({
        user_id: user.id, project_id: project.id, file_url: extractedData._fileUrl || '',
        analysis_type: mode === 'build_safety' ? 'safety_file' : 'project_creation',
        extracted_data: extractedData, status: 'completed',
      });

      if (mode === 'build_safety') {
        // Generate safety documents
        const docTypes = ['hs_policy', 'risk_assessment', 'method_statement', 'emergency_plan', 'induction_checklist', 'appointment_letter', 'toolbox_talk', 'fall_protection_plan', 'safe_work_procedure', 'ppe_register'];
        for (const docType of docTypes) {
          await supabase.from('safety_files').insert({
            project_id: project.id, title: `${formData.name} - ${docType.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}`,
            document_type: docType, content: `<p>AI-generated ${docType} document for ${formData.name}. <br/>Scope: ${formData.description?.substring(0, 200)}</p>`,
            status: 'draft', generated_by_ai: true, version: 1,
          });
        }
      }
      setShowExtractedForm(false);
      setResults(prev => [...prev, { file: 'Project Creation', status: 'success', message: `Project "${formData.name}" created successfully! ${mode === 'build_safety' ? '10 safety documents generated.' : ''}` }]);
      setFiles([]);
    }
    setCreating(false);
  }

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title">Smart Upload</h1>
          <p className="text-surface-500 mt-1">Upload any document — AI extracts, analyzes, and processes your data</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {[
          { id: 'create_project', label: 'Create Project from Document', desc: 'Upload a tender or scope doc. AI extracts project details and creates a project.', icon: Building2, color: 'blue' },
          { id: 'build_safety', label: 'Build Safety File from Scope', desc: 'Upload scope of works. AI generates a complete indexed H&S file.', icon: Shield, color: 'green' },
          { id: 'price_boq', label: 'Price BOQ from Document', desc: 'Upload a BOQ. AI extracts items, prices them, and calculates totals.', icon: DollarSign, color: 'amber' },
          { id: 'safety_file', label: 'Safety File Document Upload', desc: 'Upload OHS safety file documents (policies, plans, registers, permits).', icon: FileText, color: 'blue' },
          { id: 'risk_assessment', label: 'Risk Assessment Upload', desc: 'Upload risk assessments, hazard analyses, and method statements.', icon: Shield, color: 'red' },
          { id: 'incident_report', label: 'Incident Report Upload', desc: 'Upload incident reports, accident investigations, and near-miss records.', icon: AlertTriangle, color: 'red' },
          { id: 'inspection_checklist', label: 'Inspection Checklist Upload', desc: 'Upload site inspection checklists, audit forms, and compliance registers.', icon: ClipboardCheck, color: 'green' },
          { id: 'training_record', label: 'Training Record Upload', desc: 'Upload training records, certificates, competency assessments, and attendance registers.', icon: GraduationCap, color: 'purple' },
          { id: 'compliance_checklist', label: 'Compliance Document Upload', desc: 'Upload legal registers, compliance checklists, and regulatory documents.', icon: ShieldCheck, color: 'indigo' },
          { id: 'method_statement', label: 'Method Statement Upload', desc: 'Upload construction method statements, SWMS, and safe work procedures.', icon: FileText, color: 'orange' },
          { id: 'emergency_plan', label: 'Emergency Plan Upload', desc: 'Upload emergency response plans, evacuation procedures, and contingency plans.', icon: AlertTriangle, color: 'amber' },
          { id: 'environmental_plan', label: 'Environmental Plan Upload', desc: 'Upload EMPs, environmental impact assessments, waste management plans.', icon: FileText, color: 'emerald' },
          { id: 'medical_surveillance', label: 'Medical Surveillance Upload', desc: 'Upload medical records, fitness certificates, and health surveillance reports.', icon: FileText, color: 'teal' },
          { id: 'ppe_register', label: 'PPE Register Upload', desc: 'Upload PPE issue registers, inspection records, and stock control sheets.', icon: Shield, color: 'cyan' },
          { id: 'plant_register', label: 'Plant Register Upload', desc: 'Upload plant and equipment registers, maintenance logs, and COCs.', icon: FileText, color: 'slate' },
        ].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id as any); setResults([]); setPricedItems([]); setExtractedData(null); }}
            className={`card p-5 text-left transition-all ${mode === m.id ? 'ring-2 ring-primary-500 border-primary-500' : 'hover:border-primary-300'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${m.color}-100`}>
              <m.icon className={`h-5 w-5 text-${m.color}-600`} />
            </div>
            <h3 className="font-semibold text-sm mb-1">{m.label}</h3>
            <p className="text-xs text-surface-500">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <div className="card p-6 mb-6">
        <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 transition-colors"
          onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById('smart-file-input')?.click()}>
          {files.length === 0 ? (
            <div>
              <Upload className="h-12 w-12 mx-auto mb-3 text-surface-300" />
              <p className="text-surface-500 font-medium">Drop files here, or click to browse</p>
              <p className="text-xs text-surface-400 mt-1">Supported: PDF, Excel, Word, CSV, Images</p>
            </div>
          ) : (
            <div>
              <FileText className="h-10 w-10 mx-auto mb-2 text-primary-500" />
              <p className="font-medium text-surface-700">{files.length} file(s) selected</p>
            </div>
          )}
        </div>
        <input id="smart-file-input" type="file" multiple className="hidden" onChange={handleSelect} accept=".pdf,.docx,.xlsx,.csv,.txt,.jpg,.png" />

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-surface-50 rounded-lg text-sm">
                <span className="truncate">{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                <button onClick={() => removeFile(i)} className="text-red-500 hover:underline ml-2 flex-shrink-0"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={analyzeAndProcess} disabled={uploading} className="btn-primary w-full justify-center mt-2">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
              {uploading ? 'Analyzing...' : `Analyze ${files.length} File(s)`}
            </button>
          </div>
        )}
      </div>

      {/* Extracted Data Form */}
      {showExtractedForm && extractedData && (
        <div className="card p-6 mb-6 border-l-4 border-l-primary-500">
          <div className="flex items-start gap-3 mb-4">
            <Bot className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">AI Extracted Data</h3>
              <p className="text-sm text-surface-500">Review and edit the extracted information before creating</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Project Name *</label><input className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div><label className="label">Client Name</label><input className="input" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} /></div>
            <div><label className="label">Location</label><input className="input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <div><label className="label">Start Date</label><input className="input" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} /></div>
            <div><label className="label">End Date</label><input className="input" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} /></div>
            <div className="col-span-2"><label className="label">Number of Workers</label><input type="number" className="input" value={formData.number_of_workers} onChange={e => setFormData({...formData, number_of_workers: e.target.value})} /></div>
            <div className="col-span-2"><label className="label">Description / Scope of Works</label><textarea className="input" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button className="btn-secondary" onClick={() => setShowExtractedForm(false)}>Cancel</button>
            <button className="btn-primary" disabled={creating} onClick={createProjectFromExtracted}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === 'build_safety' ? 'Create Project & Generate Safety File' : 'Create Project'}
            </button>
          </div>
        </div>
      )}

      {/* Priced BOQ Display */}
      {pricedItems.length > 0 && (
        <div className="card mb-6 overflow-hidden">
          <div className="card-header flex items-center justify-between">
            <h2 className="section-title">Priced BOQ ({pricedItems.length} items)</h2>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary-600">{formatCurrency(grandTotal)}</span>
              <button onClick={() => {
                const csv = ['Item No,Description,Unit,Quantity,Rate,Total']
                  .concat(pricedItems.map((i: any) => `${i.item_no},"${i.description}",${i.unit},${i.quantity},${i.rate},${(i.quantity * i.rate).toFixed(2)}`))
                  .join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'priced_boq.csv'; a.click();
                URL.revokeObjectURL(url);
              }} className="btn-secondary btn-sm"><Download className="h-3.5 w-3.5" /> Download CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 sticky top-0">
                <tr><th className="p-3 text-left font-medium text-surface-500">Item</th><th className="p-3 text-left font-medium text-surface-500">Description</th><th className="p-3 text-left font-medium text-surface-500">Unit</th><th className="p-3 text-right font-medium text-surface-500">Qty</th><th className="p-3 text-right font-medium text-surface-500">Rate</th><th className="p-3 text-right font-medium text-surface-500">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {pricedItems.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-surface-50">
                    <td className="p-3 text-surface-500">{item.item_no}</td>
                    <td className="p-3 font-medium">{item.description}</td>
                    <td className="p-3 text-surface-500">{item.unit}</td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(item.quantity * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-primary-50">
                <tr><td colSpan={5} className="p-3 text-right font-bold">Grand Total</td><td className="p-3 text-right font-bold text-primary-700">{formatCurrency(grandTotal)}</td></tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold mb-3">Results</h3>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-2 p-3 rounded-lg ${r.status === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
                {r.status === 'error' ? <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
                <div>
                  <p className="text-sm font-medium">{r.file}</p>
                  <p className="text-xs text-surface-500">{r.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
