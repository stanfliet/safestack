import { useState } from 'react';
import { BookOpen, Search, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { id: 'overview', title: '1. System Overview', icon: '🏠',
    content: 'SAFESTACK is a comprehensive construction health & safety management platform. It centralizes project management, safety documentation, risk assessments, inspections, incident tracking, worker management, training records, AI-powered document generation, tenders, pricing databases, compliance tracking, analytics, and contractor onboarding into a single integrated system.' },
  { id: 'dashboard', title: '2. Dashboard', icon: '📊',
    content: 'The Dashboard provides a real-time overview of your construction operations. Key metrics displayed include: active projects count, open incidents, pending inspections, upcoming training sessions, recent safety files, overdue risk assessments, compliance status, and billing information. Each widget is clickable to drill down into the relevant section.' },
  { id: 'projects', title: '3. Projects', icon: '📁',
    content: 'Manage all your construction projects from a single interface. Create new projects with details like client name, location, start/end dates, budget, and status. Track project progress through stages (planning, construction, handover, completed, cancelled). Each project has sub-sections for safety files, risk assessments, workers, inspections, and incidents specific to that project.' },
  { id: 'safety-files', title: '4. Safety Files', icon: '📄',
    content: 'Generate and manage Section 37(2) safety files required by the OHS Act. Includes: company profile, organizational structure, health & safety policy, risk assessments, method statements, site rules, emergency plans, medical surveillance records, PPE registers, plant registers, training records, and appointment letters. Files can be generated manually or via AI.' },
  { id: 'risk-assessments', title: '5. Risk Assessments', icon: '⚠️',
    content: 'Create and manage comprehensive risk assessments following the hierarchy of controls. Each assessment includes: hazard identification, risk rating (consequence × likelihood), control measures, residual risk rating, review dates, and responsible persons. Supports baseline, issue-based, and continuous risk assessments.' },
  { id: 'inspections', title: '6. Inspections', icon: '✅',
    content: 'Schedule and conduct site inspections with customizable checklists. Track inspection status (scheduled, in_progress, completed, overdue). Record findings, assign corrective actions, upload photos, set follow-up dates, and generate inspection reports. Supports daily, weekly, and monthly inspection frequencies.' },
  { id: 'incidents', title: '7. Incidents', icon: '🔴',
    content: 'Record and manage all workplace incidents including near misses, first aid cases, medical treatment cases, lost time injuries, and fatalities. Each incident tracks: date, time, location, description, severity (critical, high, medium, low), root cause, corrective actions, witness statements, and investigation status. Generate incident reports and statistical analysis.' },
  { id: 'workers', title: '8. Workers', icon: '👷',
    content: 'Maintain a complete register of all workers on site. Track: personal details, ID numbers, qualifications, training records, medical certificates, PPE issued, site access dates, employment status (active, inactive, suspended), and disciplinary records. Supports both company employees and subcontractor workers.' },
  { id: 'training', title: '9. Training', icon: '🎓',
    content: 'Manage training records for all workers. Track courses completed, certificates, expiry dates, training providers, and costs. Supports automatic reminders for expiring certificates. Includes training needs analysis per worker role. Integrates with the Workers module for a complete skills matrix.' },
  { id: 'ai-generator', title: '10. AI Generator', icon: '🤖',
    content: 'Use AI (powered by Gemini) to automatically generate construction documents. Supported document types: safety files, risk assessments, method statements, inspection checklists, training records, incident reports, emergency plans, environmental plans, medical surveillance records, PPE registers, and plant registers. Simply describe what you need and the AI generates it instantly.' },
  { id: 'ai-agents', title: '11. AI Agents', icon: '💬',
    content: 'Interactive AI assistants that help you navigate SAFESTACK and answer questions about construction safety, regulations, and best practices. Agents include: Safety Advisor, Compliance Expert, Document Assistant, Training Advisor, and General Assistant. Each agent specializes in different areas of construction health & safety.' },
  { id: 'tenders', title: '12. Tenders', icon: '📋',
    content: 'Manage the complete tender lifecycle from draft to submission to award. Track: tender documents, pricing schedules, submission deadlines, award status (draft, submitted, won, lost, cancelled), client details, and bid amounts. Generate tender reports and track win/loss ratios.' },
  { id: 'pricing-database', title: '13. Pricing Database', icon: '💰',
    content: 'Comprehensive construction pricing database with material, labour, plant, and subcontractor rates for South Africa. Features: search and filter by category/region/institution, CRUD operations, AI-powered auto-updates, institution-specific views (SANRAL, DOL, BIBC, BCCEI, NHBRC, WIETA). Rates are auto-seeded and can be updated monthly.' },
  { id: 'compliance', title: '14. Compliance Dashboard', icon: '🛡️',
    content: 'Monitor compliance across all OHS requirements. Tracks: legal appointments, training compliance, medical surveillance, PPE compliance, plant inspections, safety file completeness, risk assessment currency, incident reporting compliance, and regulatory submissions. Color-coded status indicators (compliant, non-compliant, pending, N/A).' },
  { id: 'analytics', title: '15. Analytics', icon: '📈',
    content: 'Advanced analytics and reporting with charts and graphs. Includes: incident trends (by month, severity, type), project performance metrics, safety statistics, training completion rates, compliance scores, financial summaries, and customizable date ranges. Data exportable for external reporting.' },
  { id: 'contractor-onboarding', title: '16. Contractor Onboarding', icon: '👤',
    content: 'Streamlined contractor onboarding process. Collect: company details, BBBEE level, tax clearance, COIDA letter, insurance certificates, safety files, worker lists, training records, and bank verification. Track onboarding status and compliance documentation expiry dates.' },
  { id: 'smart-upload', title: '17. Smart Upload', icon: '📤',
    content: 'Upload documents (PDF, Word, Excel, images) for AI-powered processing. Upload modes: Create Project (extract project details from documents), Build Safety File (generate safety docs from uploads), Price BOQ (extract and price bill of quantities from pricing database), and OHS Document uploads for all safety-related files. Supports drag-and-drop and bulk upload.' },
  { id: 'billing', title: '18. Billing', icon: '💳',
    content: 'Subscription management with Stripe integration. Plans: Free, Starter, Professional, Enterprise. Features per plan: project limits, worker limits, AI document generation, analytics, API access, and priority support. Manage invoices, payment methods, and subscription upgrades/downgrades.' },
  { id: 'user-settings', title: '19. User Settings & Profile', icon: '⚙️',
    content: 'Manage your profile, change password, update company information, configure notification preferences, API keys for integrations, and theme settings. Admin users can manage team members, roles (user, admin, super_admin), and permissions.' },
];

export default function UserManualPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [search, setSearch] = useState('');
  const active = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];
  const filtered = SECTIONS.filter(s => !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-7 w-7 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-surface-900">User Manual</h1>
          <p className="text-surface-500 text-sm">Complete SAFESTACK platform guide — 19 sections</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
        <input type="text" placeholder="Search manual..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-surface-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-surface-200 p-3 shadow-sm max-h-[70vh] overflow-y-auto">
          {filtered.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 ${
                activeSection === s.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-surface-600 hover:bg-surface-50'
              }`}>
              <span>{s.icon}</span>
              <span className="flex-1">{s.title}</span>
              {activeSection === s.id && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm min-h-[400px]">
          <h2 className="text-xl font-bold text-surface-900 mb-4 flex items-center gap-2">
            <span>{active.icon}</span> {active.title}
          </h2>
          <p className="text-surface-700 leading-relaxed">{active.content}</p>
        </div>
      </div>
    </div>
  );
}
