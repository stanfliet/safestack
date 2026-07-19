export default function UserManualPage() {
  return (
    <div className="p-4 max-w-4xl mx-auto prose prose-sm">
      <h1>User Manual</h1>
      <p className="text-gray-600">Version 1.0 — SAFESTACK Safety Management Platform</p>

      <hr className="my-4" />

      <h2>1. Getting Started</h2>
      <p>
        SAFESTACK is a cloud-based safety management platform. Log in with your credentials.
        If you do not have an account, contact your administrator.
      </p>

      <h2>2. Dashboard</h2>
      <p>
        The Dashboard provides an overview of recent inspections, open incidents, worker certifications,
        and compliance status. Use the sidebar to navigate between modules.
      </p>

      <h2>3. Inspections</h2>
      <p>
        Create, schedule, and complete safety inspections. Each inspection can include a checklist,
        photo evidence, and digital signatures. Completed inspections are stored for compliance reporting.
      </p>

      <h2>4. Incidents</h2>
      <p>
        Report and track safety incidents. Use the incident report form to capture details, root cause,
        corrective actions, and lessons learned. Incidents can be linked to inspections and workers.
      </p>

      <h2>5. Workers</h2>
      <p>
        Manage worker profiles, certifications, training records, and site access. The system
        automatically flags expired certifications and missing training.
      </p>

      <h2>6. AI Generator</h2>
      <p>
        Use the AI-powered generator to create safety documents, risk assessments, method statements,
        and toolbox talk content. Select a template, fill in the details, and let SAFESTACK generate
        the document.
      </p>

      <h2>7. AI Agents</h2>
      <p>
        Deploy AI agents to monitor compliance, review incident trends, and provide safety insights.
        Configure agent schedules and notification preferences.
      </p>

      <h2>8. Tenders</h2>
      <p>
        Manage tenders and bid opportunities. Track deadlines, submit documentation, and monitor
        the status of submitted tenders.
      </p>

      <h2>9. Pricing Database</h2>
      <p>
        Maintain a database of material and labour pricing. Use this for cost estimation,
        tendering, and budget tracking.
      </p>

      <h2>10. Compliance Dashboard</h2>
      <p>
        View compliance metrics across all sites and departments. Track audit findings,
        corrective actions, and regulatory reporting deadlines.
      </p>

      <h2>11. Analytics</h2>
      <p>
        Access charts and reports on safety performance, incident trends, inspection completion
        rates, and worker compliance. Export data for external reporting.
      </p>

      <h2>12. Contractor Onboarding</h2>
      <p>
        Onboard new contractors with digital forms, document collection, and approval workflows.
        Track onboarding status for each contractor.
      </p>

      <h2>13. Billing</h2>
      <p>
        Manage invoices, payment records, and billing history. Generate invoices linked to
        projects, tenders, or contractor services.
      </p>

      <h2>14. Smart Upload</h2>
      <p>
        Batch-upload files with automatic categorisation. Supported formats include PDF, JPG,
        PNG, DOCX, XLSX, and CSV.
      </p>

      <h2>15. Settings</h2>
      <p>
        Configure your profile, notification preferences, and account settings from the user
        menu in the top-right corner.
      </p>

      <hr className="my-4" />

      <h2>Support</h2>
      <p>
        For technical support, contact your system administrator or submit a ticket through
        the Help menu.
      </p>
    </div>
  );
}
