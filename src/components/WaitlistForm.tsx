'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

type SubmitMode = 'free' | 'paid';

export function WaitlistForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitMode, setSubmitMode] = useState<SubmitMode | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent, mode: SubmitMode) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMode(mode);
    setStatus('idle');

    try {
      if (mode === 'paid') {
        // Create Stripe Checkout Session
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok && data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
          return;
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to start checkout. Please try again.');
        }
      } else {
        // Free waitlist submission
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message);
          setFormData({ firstName: '', lastName: '', companyName: '', email: '' });
        } else {
          setStatus('error');
          setMessage(data.error || 'Something went wrong');
        }
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setSubmitMode(null);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">You're on the list</h3>
        <p className="text-slate-400">{message}</p>
      </div>
    );
  }

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            placeholder="Satoshi"
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            placeholder="Nakamoto"
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Acme Inc (optional)"
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="satoshi@example.com"
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>
      
      {status === 'error' && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {message}
        </div>
      )}

      {/* Paid Option - Primary */}
      <button
        type="button"
        onClick={(e) => handleSubmit(e, 'paid')}
        disabled={loading}
        className="group relative w-full px-4 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden"
        style={{
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/30 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        {loading && submitMode === 'paid' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Redirecting to checkout...
          </>
        ) : (
          <>
            <Zap className="h-5 w-5 text-yellow-300" />
            <span>Skip the Queue — $49/mo</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
      
      {/* Value props for paid */}
      <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-purple-400" />
          Immediate access
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-purple-400" />
          First shift tonight
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-purple-400" />
          Cancel anytime
        </span>
      </div>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0f0f19] px-4 text-xs text-slate-500">or</span>
        </div>
      </div>

      {/* Free Option - Secondary */}
      <button
        type="button"
        onClick={(e) => handleSubmit(e, 'free')}
        disabled={loading}
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && submitMode === 'free' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          'Join Free Waitlist'
        )}
      </button>
      
      <p className="text-xs text-center text-slate-500">
        Limited spots available. Free waitlist: 2-4 week wait. Paid: instant access.
      </p>
    </form>
  );
}
