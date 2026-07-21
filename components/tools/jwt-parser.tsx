'use client';

import { useMemo, useState } from 'react';
import {
  decodeJWT,
  getExpiryStatus,
  isInsecureAlg,
  REGISTERED_CLAIMS,
  type JWTDecoded,
} from '@/lib/tools/jwt';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JsonClaimsView } from '@/components/tools/json-claims-view';
import { AlertTriangle, CheckCircle2, Clock, Copy, XCircle } from 'lucide-react';

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

function ExpiryBadge({ payload }: { payload: Record<string, unknown> }) {
  const status = getExpiryStatus(payload);

  if (status.state === 'none') return null;

  const styles: Record<string, string> = {
    expired: 'text-red-700 bg-red-50 border-red-200',
    'not-yet-valid': 'text-amber-700 bg-amber-50 border-amber-200',
    valid: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  };

  const icons: Record<string, React.ReactNode> = {
    expired: <XCircle size={14} />,
    'not-yet-valid': <Clock size={14} />,
    valid: <CheckCircle2 size={14} />,
  };

  return (
    <div
      className={`flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-medium ${styles[status.state]}`}
    >
      {icons[status.state]}
      {status.label}
    </div>
  );
}

export default function JWTParser() {
  const [token, setToken] = useState('');

  const { decoded, error } = useMemo<{ decoded: JWTDecoded | null; error: string }>(() => {
    const trimmed = token.trim();
    if (!trimmed) return { decoded: null, error: '' };
    try {
      return { decoded: decodeJWT(trimmed), error: '' };
    } catch (e) {
      return { decoded: null, error: e instanceof Error ? e.message : 'Invalid JWT' };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">JWT Token</label>
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here"
          rows={4}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {error}
        </p>
      )}

      {decoded && (
        <div className="space-y-4">
          {isInsecureAlg(decoded.header.alg) && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <p>
                This token uses <span className="font-mono font-medium">alg: {String(decoded.header.alg ?? 'missing')}</span>.
                It is not cryptographically signed, so anyone can forge or edit its claims.
              </p>
            </div>
          )}

          <ExpiryBadge payload={decoded.payload} />

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Header</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => copy(JSON.stringify(decoded.header, null, 2))}
              >
                <Copy size={13} />
              </Button>
            </CardHeader>
            <CardContent>
              <JsonClaimsView data={decoded.header} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Payload</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => copy(JSON.stringify(decoded.payload, null, 2))}
              >
                <Copy size={13} />
              </Button>
            </CardHeader>
            <CardContent>
              <JsonClaimsView data={decoded.payload} claimInfo={REGISTERED_CLAIMS} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Signature</CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={() => copy(decoded.signature)}>
                <Copy size={13} />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono break-all">{decoded.signature}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
