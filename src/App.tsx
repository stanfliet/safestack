import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const SafetyFilesPage = lazy(() => import('./pages/SafetyFilesPage'));
const RiskAssessmentsPage = lazy(() => import('./pages/RiskAssessmentsPage'));
const InspectionsPage = lazy(() => import('./pages/InspectionsPage'));
const IncidentsPage = lazy(() => import('./pages/IncidentsPage'));
const WorkersPage = lazy(() => import('./pages/WorkersPage'));
const AIGeneratorPage = lazy(() => import('./pages/AIGeneratorPage'));
const AIAgentsPage = lazy(() => import('./pages/AIAgentsPage'));
const TendersPage = lazy(() => import('./pages/TendersPage'));
const PricingDatabasePage = lazy(() => import('./pages/PricingDatabasePage'));
const ComplianceDashboardPage = lazy(() => import('./pages/ComplianceDashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ContractorOnboardingPage = lazy(() => import('./pages/ContractorOnboardingPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const SmartUploadPage = lazy(() => import('./pages/SmartUploadPage'));
const UserManualPage = lazy(() => import('./pages/UserManualPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));

function Loading() { return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>; }

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/" element={user ? <AppLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="safety-files" element={<SafetyFilesPage />} />
          <Route path="risk-assessments" element={<RiskAssessmentsPage />} />
          <Route path="inspections" element={<InspectionsPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="workers" element={<WorkersPage />} />
          <Route path="ai-generator" element={<AIGeneratorPage />} />
          <Route path="ai-agents" element={<AIAgentsPage />} />
          <Route path="tenders" element={<TendersPage />} />
          <Route path="pricing-database" element={<PricingDatabasePage />} />
          <Route path="compliance" element={<ComplianceDashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="contractor-onboarding" element={<ContractorOnboardingPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="smart-upload" element={<SmartUploadPage />} />
          <Route path="user-manual" element={<UserManualPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  );
}
