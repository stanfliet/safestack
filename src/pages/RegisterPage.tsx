import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, User, Mail, Lock, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName);
    if (signUpError) setError(signUpError.message);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Building2 className="h-8 w-8 text-green-600" /></div>
        <h2 className="text-2xl font-bold mb-2">Account created</h2>
        <p className="text-surface-500 mb-6">Check your email to confirm your account.</p>
        <Link to="/login" className="btn-primary">Go to Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Building2 className="h-10 w-10 text-primary-400" />
            <span className="text-3xl font-bold text-white">SafeStack</span>
          </div>
          <p className="text-surface-400">Create your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-1">Get started</h2>
          <p className="text-surface-500 mb-6">Register for SafeStack</p>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input type="text" className="input pl-10" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input type="email" className="input pl-10" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input type="password" className="input pl-10" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Create Account
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-surface-500">
            Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
