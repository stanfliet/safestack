import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, FolderOpen, FileText, AlertTriangle, ClipboardCheck, AlertOctagon,
  Users, Bot, MessageSquare, FileSpreadsheet, DollarSign, ShieldCheck, BarChart3,
  UserPlus, CreditCard, Upload, BookOpen, Building2, ChevronDown, ChevronRight, 
  LogOut, GraduationCap 
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/safety-files', label: 'Safety Files', icon: FileText },
  { to: '/risk-assessments', label: 'Risk Assessments', icon: AlertTriangle },
  { to: '/inspections', label: 'Inspections', icon: ClipboardCheck },
  { to: '/incidents', label: 'Incidents', icon: AlertOctagon },
  { to: '/workers', label: 'Workers', icon: Users },
  { to: '/training', label: 'Training', icon: GraduationCap },
  { to: '/ai-generator', label: 'AI Generator', icon: Bot },
  { to: '/ai-agents', label: 'AI Agents', icon: MessageSquare },
  { to: '/tenders', label: 'Tenders', icon: FileSpreadsheet },
  { to: '/pricing-database', label: 'Pricing Database', icon: DollarSign },
  { to: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/contractor-onboarding', label: 'Onboarding', icon: UserPlus },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/smart-upload', label: 'Smart Upload', icon: Upload },
  { to: '/user-manual', label: 'User Manual', icon: BookOpen },
];

export default function Sidebar() {
  const { profile, signOut } = useAuth();
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-surface-900 shadow-2xl max-lg:hidden">
      {/* Logo header - fixed */}
      <div className="flex items-center gap-2 h-16 px-4 border-b border-surface-700 flex-shrink-0">
        <Building2 className="h-7 w-7 text-primary-400" />
        <span className="text-lg font-bold text-white tracking-tight">SafeStack</span>
      </div>

      {/* Scrollable nav area */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin scrollbar-thumb-surface-700">
        {navItems.map(({ to, label, icon: Icon }) => {
          if (to === '/pricing-database') {
            return (
              <div key={to}>
                <button onClick={() => setPricingOpen(!pricingOpen)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-700/50 rounded-xl transition-colors">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {pricingOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {pricingOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-surface-700 pl-2">
                    <NavLink to={to} end
                      className={({ isActive }) => `block px-3 py-1.5 text-xs rounded-lg transition-colors${isActive ? ' bg-primary-600/20 text-primary-400' : ' text-surface-400 hover:text-white hover:bg-surface-700/50'}`}>
                      All Items
                    </NavLink>
                    {['sanral','dol','bibc','bccei','nhbrc','wieta','tjeka','colto','asaqwa','gcc','fidic','jbbcc','nec','health-safety'].map(s => (
                      <NavLink key={s} to={`/pricing-database/${s}`}
                        className={({ isActive }) => `block px-3 py-1.5 text-xs rounded-lg transition-colors${isActive ? ' bg-primary-600/20 text-primary-400' : ' text-surface-400 hover:text-white hover:bg-surface-700/50'}`}>
                        {s.toUpperCase()}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink key={to} to={to} end={to === '/dashboard'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom profile/signout - fixed */}
      <div className="border-t border-surface-700 p-3 flex-shrink-0 bg-surface-900">
        {profile && (
          <div className="px-2 mb-2 truncate">
            <p className="text-sm font-medium text-white">{profile.full_name}</p>
            <p className="text-xs text-surface-400">
              {profile.role === 'admin' ? 'Administrator' : profile.role === 'super_admin' ? 'Super Admin' : 'User'}
            </p>
          </div>
        )}
        <button onClick={signOut} 
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-700/50 rounded-xl transition-colors">
          <LogOut className="h-4 w-4" /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
