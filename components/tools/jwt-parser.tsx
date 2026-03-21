'use client';

import { useState } from 'react';
import { decodeJWT, type JWTDecoded } from '@/lib/tools/jwt';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function JWTParser() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<JWTDecoded | null>(null);
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError('');
    setDecoded(null);
    
    try {
      const result = decodeJWT(token.trim());
      setDecoded(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JWT');
    }
  };

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

      <Button onClick={handleDecode}>Decode JWT</Button>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {error}
        </p>
      )}

      {decoded && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Header</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payload</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Signature</CardTitle>
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