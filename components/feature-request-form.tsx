'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FORMSPREE_ENDPOINT } from '@/lib/config/feature-request';
import { CheckCircle2, XCircle } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function FeatureRequestForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feature, setFeature] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, feature }),
      });

      if (res.ok) {
        setStatus('success');
        return;
      }

      const data = await res.json().catch(() => null);
      setErrorMessage(data?.errors?.[0]?.message ?? 'Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setErrorMessage('Could not reach the server. Check your connection and try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0_black]">
        <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
        <p className="text-sm">Thanks! Your feature request has been sent.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="fr-name">Name</label>
        <Input
          id="fr-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="fr-email">Email</label>
        <Input
          id="fr-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ada@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="fr-feature">What would you like to see?</label>
        <Textarea
          id="fr-feature"
          required
          rows={5}
          value={feature}
          onChange={(e) => setFeature(e.target.value)}
          placeholder="Describe the tool, article, or improvement you'd like to see..."
        />
      </div>

      {status === 'error' && (
        <p className="flex items-center gap-2 rounded bg-destructive/10 p-3 text-sm text-destructive">
          <XCircle size={14} className="shrink-0" />
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send Request'}
      </Button>
    </form>
  );
}
