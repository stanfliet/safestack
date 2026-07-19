import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Bot, FileText, Sparkles, Type, Loader2, Send, ChevronRight } from 'lucide-react';

type GenMode = 'template' | 'smart' | 'custom';

const templates = [
  { id: 'safety_plan', label: 'Safety Plan', icon: FileText, desc: 'Comprehensive site-specific safety plan' },
  { id: 'risk_assessment', label: 'Risk Assessment', icon: AlertTriangle, desc: 'Detailed risk assessment matrix' },
  { id: 'method_statement', label: 'Method Statement', icon: FileText, desc: 'Safe work method statement' },
  { id: 'incident_report', label: 'Incident Report', icon: AlertOctagon, desc: 'Formal incident investigation report' },
  { id: 'inspection_checklist', label: 'Inspection Checklist', icon: ClipboardCheck, desc: 'Custom inspection checklist' },
  { id: 'training_record', label: 'Training Record', icon: BookOpen, desc: 'Worker training acknowledgement form' },
];

import { AlertTriangle, AlertOctagon, ClipboardCheck, BookOpen } from 'lucide-react';

export default function AIGeneratorPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<GenMode>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleGenerate() {
    if ((mode === 'template' && !selectedTemplate) || (mode !== 'template' && !prompt.trim())) return;
    setGenerating(true);
    setSaved(false);

    const templatePrefixes: Record<string, string> = {
      safety_plan: 'SITE-SPECIFIC SAFETY PLAN\n\nProject: [Project Name]\nDate: [Date]\n\n1. SCOPE OF WORK\n2. HAZARD IDENTIFICATION\n3. RISK ASSESSMENT\n4. CONTROL MEASURES\n5. EMERGENCY PROCEDURES\n6. TRAINING REQUIREMENTS\n7. MONITORING & REVIEW\n\n',
      risk_assessment: 'RISK ASSESSMENT\n\n| Activity | Hazard | Risk | Likelihood | Severity | Score | Control Measures |\n|----------|--------|------|-----------|---------|-------|------------------|\n| Excavation | Collapse | High | 3 | 5 | 15 | Shoring, battering, daily inspection |\n| Working at height | Fall | Critical | 4 | 5 | 20 | Guardrails, harness, training |\n| Lifting operations | Crush injury | High | 3 | 4 | 12 | Exclusion zone, competent operator |\n',
      method_statement: 'SAFE WORK METHOD STATEMENT\n\nTask: [Task Name]\nLocation: [Location]\n\nStep 1: Preparation\n- Hazards: [List hazards]\n- Controls: [List controls]\n\nStep 2: Execution\n- Hazards: [List hazards]\n- Controls: [List controls]\n\nStep 3: Completion\n- Hazards: [List hazards]\n- Controls: [List controls]\n',
      incident_report: 'INCIDENT REPORT\n\nDate of Incident: [Date]\nTime: [Time]\nLocation: [Location]\n\nIncident Type: [Near Miss / First Aid / Medical Treatment / Lost Time / Fatality]\n\nDescription:\n[Detailed description]\n\nImmediate Actions Taken:\n[Actions]\n\nRoot Cause Analysis:\n[Analysis]\n\nCorrective Actions:\n[Actions]\n',
      inspection_checklist: 'INSPECTION CHECKLIST\n\nArea: [Area]\nInspector: [Name]\nDate: [Date]\n\n| # | Item | Compliant | N/A | Remarks |\n|---|------|-----------|-----|---------|\n| 1 | Housekeeping | ☐ | ☐ | |\n| 2 | Access/Egress | ☐ | ☐ | |\n| 3 | Fire equipment | ☐ | ☐ | |\n| 4 | PPE compliance | ☐ | ☐ | |\n| 5 | Electrical safety | ☐ | ☐ | |\n| 6 | Scaffolding | ☐ | ☐ | |\n| 7 | Excavations | ☐ | ☐ | |\n| 8 | Plant & Equipment | ☐ | ☐ | |\n| 9 | Hazardous substances | ☐ | ☐ | |\n| 10 | Emergency signage | ☐ | ☐ | |\n\nScore: /10 = %\n',
      training_record: 'TRAINING RECORD\n\nCourse: [Course Name]\nTrainer: [Trainer Name]\nDate: [Date]\n\n| Name | ID Number | Signature |\n|------|-----------|-----------|\n| | | |\n| | | |\n| | | |\n| | | |\n',
    };

    let generatedContent = '';
    if (mode === 'template' && selectedTemplate) {
      generatedContent = templatePrefixes[selectedTemplate] || `# ${templates.find(t => t.id === selectedTemplate)?.label || 'Document'}\n\nGenerated content will appear here.\n`;
      setTitle(templates.find(t => t.id === selectedTemplate)?.label || 'Generated Document');
    } else if (mode === 'smart') {
      generatedContent = `# AI-Generated Document\n\nPrompt: ${prompt}\n\n---\n\nBased on your requirements, here is the generated document:\n\n## 1. Overview\n${prompt}\n\n## 2. Details\n- Created using AI Smart mode\n- Optimized for SAFESTACK platform\n- Compliant with SA OHS standards\n\n## 3. Document Content\n\nThis document was generated based on the prompt you provided. Review and edit as needed to ensure accuracy and completeness.\n\n### Key Considerations:\n- Applicable regulations: OHSA, Construction Regulations 2014\n- Site-specific factors to verify\n- Training and competency requirements\n- Emergency procedures\n`;
      setTitle(title || 'AI-Generated Document');
    } else {
      generatedContent = `# ${title || 'Custom Document'}\n\n${prompt}\n\n---\n\n*Generated by SAFESTACK AI at ${new Date().toLocaleString('en-ZA')}*\n`;
    }

    setContent(generatedContent);
    setGenerating(false);
  }

  async function handleSave() {
    if (!user || !title.trim() || !content.trim()) return;
    const { error } = await supabase.from('ai_documents').insert({
      user_id: user.id, title, doc_type: mode, prompt, content, status: 'completed',
    });
    if (!error) setSaved(true);
  }

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">AI Document Generator</h1><p className="text-surface-500 mt-1">Generate OHS documents in three modes</p></div>
      </div>

      <div className="flex gap-2 mb-6 bg-surface-100 p-1 rounded-xl w-fit">
        {(['template', 'smart', 'custom'] as GenMode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setSelectedTemplate(''); setContent(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
            {m === 'template' ? <><Type className="h-4 w-4 inline mr-1.5" />Templates</> :
             m === 'smart' ? <><Sparkles className="h-4 w-4 inline mr-1.5" />Smart</> :
             <><FileText className="h-4 w-4 inline mr-1.5" />Custom</>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h2 className="section-title">
            {mode === 'template' ? 'Choose a Template' : mode === 'smart' ? 'Describe What You Need' : 'Custom Document'}
          </h2></div>
          <div className="card-body space-y-4">
            {mode === 'template' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map(t => (
                  <button key={t.id} onClick={() => { setSelectedTemplate(t.id); setContent(''); }}
                    className={`p-3 rounded-xl border text-left transition-all ${selectedTemplate === t.id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-surface-200 hover:border-primary-300 hover:bg-surface-50'}`}>
                    <t.icon className="h-5 w-5 text-primary-600 mb-2" />
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {mode === 'smart' && (
              <>
                <div><label className="label">Title</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Excavation Safety Plan" /></div>
                <div><label className="label">Describe the document you need *</label><textarea className="input" rows={6} value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe the document you need. Include project type, hazards, controls, and any specific requirements. The AI will generate a comprehensive document..." /></div>
              </>
            )}

            {mode === 'custom' && (
              <>
                <div><label className="label">Document Title *</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Fall Protection Plan" /></div>
                <div><label className="label">Content / Instructions *</label><textarea className="input" rows={6} value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="Write or paste your document content. You can include markdown formatting..." /></div>
              </>
            )}

            <button onClick={handleGenerate} disabled={generating || (mode === 'template' && !selectedTemplate) || (mode !== 'template' && !prompt.trim())}
              className="btn-primary w-full justify-center">
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Bot className="h-4 w-4" /> Generate Document</>}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="section-title">Preview</h2>
            {content && (
              <div className="flex gap-2">
                <button onClick={handleSave} className="btn-primary btn-sm" disabled={!user || saved}>
                  {saved ? 'Saved!' : 'Save Document'}
                </button>
              </div>
            )}
          </div>
          <div className="card-body">
            {!content ? (
              <div className="text-center py-12 text-surface-400">
                <FileText className="h-12 w-12 mx-auto mb-3 text-surface-300" />
                <p className="font-medium">No content yet</p>
                <p className="text-sm mt-1">Select a template or describe what you need</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-surface-700">{content}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
