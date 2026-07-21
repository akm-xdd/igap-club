'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generateLorem, type LoremUnit } from '@/lib/tools/lorem';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

const UNIT_OPTIONS: { label: string; value: LoremUnit }[] = [
  { label: 'Words', value: 'words' },
  { label: 'Sentences', value: 'sentences' },
  { label: 'Paragraphs', value: 'paragraphs' },
];

export default function LoremGenerator() {
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState(() =>
    generateLorem({ unit: 'paragraphs', count: 3, startWithLorem: true })
  );

  const handleGenerate = () => {
    setOutput(generateLorem({ unit, count, startWithLorem }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Unit</label>
          <div className="flex items-center gap-1 rounded-lg border-2 border-black bg-white p-0.5 text-sm">
            {UNIT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setUnit(opt.value)}
                className={cn(
                  'rounded-md px-2.5 py-1',
                  unit === opt.value ? 'bg-black text-white' : 'text-black/60 hover:text-black'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Count&nbsp;</label>
          <Input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min={1}
            max={500}
            className="w-24"
          />
        </div>

        <label className="flex items-center gap-2 pb-1.5 text-sm">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="size-4 accent-black"
          />
          Start with &quot;Lorem ipsum...&quot;
        </label>

        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Output</label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{wordCount} words</span>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy size={14} className="mr-2" />
              Copy
            </Button>
          </div>
        </div>
        <Textarea value={output} readOnly rows={14} className="font-mono text-sm" />
      </div>
    </div>
  );
}
