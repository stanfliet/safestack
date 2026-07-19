import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div><h3 className="font-semibold text-white mb-3">SafeStack</h3><p>OHS Compliance Platform for SA Construction.</p></div>
          <div><h4 className="font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
              <li><Link to="/compliance" className="hover:text-white">Compliance</Link></li>
              <li><Link to="/analytics" className="hover:text-white">Analytics</Link></li>
            </ul>
          </div>
          <div><h4 className="font-semibold text-white mb-3">AI Tools</h4>
            <ul className="space-y-2">
              <li><Link to="/ai-generator" className="hover:text-white">AI Generator</Link></li>
              <li><Link to="/ai-agents" className="hover:text-white">AI Agents</Link></li>
              <li><Link to="/smart-upload" className="hover:text-white">Smart Upload</Link></li>
            </ul>
          </div>
          <div><h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-surface-700 pt-6 text-sm text-center">&copy; {new Date().getFullYear()} SafeStack. All rights reserved.</div>
      </div>
    </footer>
  );
}
