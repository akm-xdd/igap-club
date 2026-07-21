'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { JsonTreeView } from '@/components/tools/json-tree-view';
import { formatJson, minifyJson, parseJson, type IndentOption } from '@/lib/tools/json-format';
import { CheckCircle2, Copy, Download, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const INDENT_OPTIONS: { label: string; value: IndentOption }[] = [
  { label: '2 spaces', value: 2 },
  { label: '4 spaces', value: 4 },
  { label: '8 spaces', value: 8 },
  { label: 'Tab', value: 'tab' },
];

const SAMPLE = `{
  "name": "Ada Lovelace",
  "active": true,
  "tags": ["math", "computing"],
  "meta": { "born": 1815, "notes": null }
}`;

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState<IndentOption>(2);

  const result = useMemo(() => parseJson(input), [input]);

  const handleFormat = () => {
    try {
      setInput(formatJson(input, indent));
    } catch {
      // parse error is already surfaced by the status banner
    }
  };

  const handleCompact = () => {
    try {
      setInput(minifyJson(input));
    } catch {
      // parse error is already surfaced by the status banner
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleFormat} disabled={!input.trim()}>Format</Button>
        <Button variant="outline" onClick={handleCompact} disabled={!input.trim()}>Compact</Button>
        <Button
          variant="outline"
          onClick={() => copyToClipboard(input)}
          disabled={!input.trim()}
        >
          <Copy size={14} className="mr-2" />
          Copy
        </Button>
        <Button
          variant="outline"
          onClick={() => download('data.json', input)}
          disabled={!input.trim()}
        >
          <Download size={14} className="mr-2" />
          Download
        </Button>

        <div className="ml-auto flex items-center gap-1 rounded-lg border-2 border-black bg-white p-0.5 text-sm">
          {INDENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setIndent(opt.value)}
              className={cn(
                'rounded-md px-2 py-1',
                indent === opt.value ? 'bg-black text-white' : 'text-black/60 hover:text-black'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {input.trim() && (
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium',
            result.error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          )}
        >
          {result.error ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          {result.error
            ? `Invalid JSON${result.error.line ? ` — line ${result.error.line}, column ${result.error.column}` : ''}: ${result.error.message}`
            : 'Valid JSON'}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={SAMPLE}
          rows={20}
          className="font-mono text-sm"
        />

        <div className="rounded-lg border-2 border-black bg-white p-3">
          {result.data !== undefined ? (
            <JsonTreeView data={result.data} />
          ) : (
            <p className="text-sm text-black/40">
              {input.trim() ? 'Fix the error above to see the tree view' : 'Paste JSON to see its structure here'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
