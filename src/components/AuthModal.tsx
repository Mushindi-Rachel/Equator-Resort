import { useState } from 'react';
import { X, Eye, EyeOff, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.fullName } },
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: form.fullName,
            email: form.email,
            phone: form.phone,
            is_admin: false,
          });
          onSuccess();
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) throw signInError;
        onSuccess();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="modal-content bg-cream-50 w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="bg-sanctuary-900 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-gold-400" />
            <div>
              <p className="font-display text-cream-50 text-xl tracking-[0.2em] uppercase">Admin</p>
              <p className="font-sans text-gold-400 text-[10px] tracking-[0.3em] uppercase">Christian Retreat Centre</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-200/60 hover:text-gold-400 transition-colors cursor-none">
            <X size={20} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-sanctuary-100">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-4 font-sans text-[12px] tracking-[0.15em] uppercase font-semibold transition-all cursor-none border-b-2
              ${mode === 'login' ? 'text-sanctuary-900 border-b-2 border-gold-500 bg-white' : 'text-sanctuary-400 hover:text-sanctuary-700 border-transparent'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-4 font-sans text-[12px] tracking-[0.15em] uppercase font-semibold transition-all cursor-none border-b-2
              ${mode === 'signup' ? 'text-sanctuary-900 border-b-2 border-gold-500 bg-white' : 'text-sanctuary-400 hover:text-sanctuary-700 border-transparent'}`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {mode === 'signup' && (
            <>
              <div>
                <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={e => set('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="input-luxury w-full font-sans text-sm text-sanctuary-900 placeholder-sanctuary-300 bg-transparent"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+254 700 123 456"
                  className="input-luxury w-full font-sans text-sm text-sanctuary-900 placeholder-sanctuary-300 bg-transparent"
                />
              </div>
            </>
          )}

          <div>
            <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="admin@equatorchristian.org"
              className="input-luxury w-full font-sans text-sm text-sanctuary-900 placeholder-sanctuary-300 bg-transparent"
            />
          </div>

          <div>
            <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="--------"
                className="input-luxury w-full font-sans text-sm text-sanctuary-900 placeholder-sanctuary-300 bg-transparent pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-sanctuary-400 hover:text-gold-500 transition-colors cursor-none"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 font-sans text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-sanctuary-900/30 border-t-sanctuary-900 rounded-full animate-spin" />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          <p className="text-center font-sans text-[12px] text-sanctuary-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-gold-600 hover:text-gold-700 font-semibold cursor-none"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
