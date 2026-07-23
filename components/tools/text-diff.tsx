'use client';

import { useMemo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { diffLines, type DiffRow, type DiffToken } from '@/lib/tools/diff';
import { cn } from '@/lib/utils';

const ROW_BG: Record<DiffRow['type'], string> = {
  equal: '',
  insert: 'bg-emerald-50',
  delete: 'bg-red-50',
  modify: 'bg-amber-50',
};

function TokenizedLine({ tokens }: { tokens: DiffToken[] }) {
  return (
    <>
      {tokens.map((token, i) => (
        <span
          key={i}
          className={cn(
            token.type === 'added' && 'bg-emerald-200',
            token.type === 'removed' && 'bg-red-200 line-through'
          )}
        >
          {token.text}
        </span>
      ))}
    </>
  );
}

function Cell({
  line,
  lineNumber,
  tokens,
  side,
}: {
  line: string | null;
  lineNumber: number | null;
  tokens?: DiffToken[];
  side: 'left' | 'right';
}) {
  if (line === null) {
    return <div className="bg-black/5 px-2 py-0.5" />;
  }

  return (
    <div className="flex gap-3 px-2 py-0.5">
      <span className="w-8 shrink-0 select-none text-right text-black/30">{lineNumber}</span>
      <span className="whitespace-pre-wrap break-all">
        {tokens ? <TokenizedLine tokens={tokens} /> : line || ' '}
      </span>
      <span className="sr-only">{side}</span>
    </div>
  );
}

export default function TextDiff() {
  const [original, setOriginal] = useState('');
  const [changed, setChanged] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const result = useMemo(() => {
    try {
      return { diff: diffLines(original, changed, { ignoreWhitespace }), error: null };
    } catch (e) {
      return { diff: null, error: e instanceof Error ? e.message : 'Could not diff these inputs' };
    }
  }, [original, changed, ignoreWhitespace]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Original</label>
          <Textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste the original text"
            rows={10}
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Changed</label>
          <Textarea
            value={changed}
            onChange={(e) => setChanged(e.target.value)}
            placeholder="Paste the changed text"
            rows={10}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={ignoreWhitespace}
          onChange={(e) => setIgnoreWhitespace(e.target.checked)}
          className="size-4 accent-black"
        />
        Ignore leading/trailing whitespace
      </label>

      {result.error && (
        <p className="rounded bg-destructive/10 p-3 text-sm text-destructive">{result.error}</p>
      )}

      {result.diff && (original || changed) && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="text-emerald-700">+{result.diff.summary.additions} additions</span>
            <span className="text-red-700">-{result.diff.summary.deletions} deletions</span>
            <span className="text-amber-700">{result.diff.summary.modifications} modified</span>
            <span className="text-muted-foreground">{result.diff.summary.unchanged} unchanged</span>
          </div>

          <div className="overflow-hidden rounded-lg border-2 border-black">
            <div className="grid grid-cols-2 border-b-2 border-black bg-black text-xs font-medium text-white">
              <div className="px-2 py-1">Original</div>
              <div className="border-l-2 border-white/20 px-2 py-1">Changed</div>
            </div>
            <div className="grid grid-cols-2 divide-x-2 divide-black/10 font-mono text-sm">
              {result.diff.rows.map((row, i) => (
                <div key={i} className="contents">
                  <div className={ROW_BG[row.type]}>
                    <Cell line={row.leftLine} lineNumber={row.leftLineNumber} tokens={row.leftTokens} side="left" />
                  </div>
                  <div className={ROW_BG[row.type]}>
                    <Cell line={row.rightLine} lineNumber={row.rightLineNumber} tokens={row.rightTokens} side="right" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
