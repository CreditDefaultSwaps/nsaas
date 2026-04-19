'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function WaitlistForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
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
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          'Request Early Access'
        )}
      </button>

      <p className="text-xs text-center text-slate-500">
        Limited spots available. We'll reach out within 48 hours.
      </p>
    </form>
  );
}
