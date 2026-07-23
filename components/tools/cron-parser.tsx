'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { describeCron, getNextRuns, parseCron } from '@/lib/tools/cron';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const EXAMPLES = [
  { label: 'Every day at 3am', value: '0 3 * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Weekdays at 9am', value: '0 9 * * 1-5' },
  { label: 'First of the month', value: '0 0 1 * *' },
  { label: '@daily', value: '@daily' },
];

const FIELD_LABELS = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'];

export default function CronParser() {
  const [expression, setExpression] = useState('0 3 * * *');

  const result = useMemo(() => {
    try {
      const parsed = parseCron(expression);
      return { parsed, error: null };
    } catch (e) {
      return { parsed: null, error: e instanceof Error ? e.message : 'Invalid cron expression' };
    }
  }, [expression]);

  const nextRuns = useMemo(() => {
    if (!result.parsed) return [];
    return getNextRuns(result.parsed, new Date(), 8);
  }, [result.parsed]);

  const fieldValues = expression.trim().split(/\s+/);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Cron Expression</label>
        <Input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="0 3 * * *"
          className="font-mono"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.value}
            type="button"
            onClick={() => setExpression(ex.value)}
            className="cursor-pointer rounded-md border-2 border-black bg-white px-2.5 py-1 font-mono text-xs hover:bg-black hover:text-white"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium',
          result.error
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        )}
      >
        {result.error ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
        {result.error ?? 'Valid cron expression'}
      </div>

      {result.parsed && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">In plain English</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{describeCron(result.parsed)}</p>
            </CardContent>
          </Card>

          {fieldValues.length === 5 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {FIELD_LABELS.map((label, i) => (
                <div key={label} className="rounded-lg border-2 border-black bg-white p-2 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-black/50">{label}</p>
                  <p className="font-mono text-sm font-medium">{fieldValues[i]}</p>
                </div>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next runs</CardTitle>
            </CardHeader>
            <CardContent>
              {nextRuns.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No matching run found in the next 4 years.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {nextRuns.map((date) => (
                    <li key={date.toISOString()} className="font-mono text-sm">
                      {new Intl.DateTimeFormat(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(date)}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
