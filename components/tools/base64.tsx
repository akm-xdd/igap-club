'use client';

import { useState } from 'react';
import { encodeBase64, decodeBase64 } from '@/lib/tools/base64';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    setError('');
    try {
      setOutput(encodeBase64(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to encode');
    }
  };

  const handleDecode = () => {
    setError('');
    try {
      setOutput(decodeBase64(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid Base64 string');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Input</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or Base64 to decode"
          rows={6}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleEncode}>Encode</Button>
        <Button onClick={handleDecode} variant="outline">Decode</Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Output</label>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy size={14} className="mr-2" />
              Copy
            </Button>
          </div>
          <Textarea value={output} readOnly rows={6} />
        </div>
      )}
    </div>
  );
}