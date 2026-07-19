import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, FolderOpen, FileText, AlertTriangle, ClipboardCheck, AlertOctagon,
  Users, Bot, MessageSquare, FileSpreadsheet, DollarSign, ShieldCheck, BarChart3,
  UserPlus, CreditCard, Upload, BookOpen, Building2, LogOut } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/safety-files', label: 'Safety Files', icon: FileText },
  { to: '/risk-assessments', label: 'Risk Assessments', icon: AlertTriangle },
  { to: '/inspections', label: 'Inspections', icon: ClipboardCheck },
  { to: '/incidents', label: 'Incidents', icon: AlertOctagon },
  { to: '/workers', label: 'Workers', icon: Users },
  { to: '/ai-generator', label: 'AI Generator', icon: Bot },
  { to: '/ai-agents', label: 'AI Agents', icon: MessageSquare },
  { to: '/tenders', label: 'Tenders', icon: FileSpreadsheet },
  { to: '/pricing-database', label: 'Pricing DB', icon: DollarSign },
  { to: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/contractor-onboarding', label: 'Onboarding', icon: UserPlus },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/smart-upload', label: 'Smart Upload', icon: Upload },
  { to: '/user-manual', label: 'User Manual', icon: BookOpen },
];

export default function Sidebar() {
  const { profile, signOut } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-surface-900 max-lg:hidden">
      <div className="flex items-center gap-2 h-16 px-4 border-b border-surface-700">
        <Building2 className="h-7 w-7 text-primary-400" />
        <span className="text-lg font-bold text-white">SafeStack</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-surface-700 p-3">
        {profile && <div className="px-2 mb-2 truncate"><p className="text-sm font-medium text-white">{profile.full_name}</p></div>}
        <button onClick={signOut} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-700/50 rounded-xl transition-colors">
          <LogOut className="h-4 w-4" /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
