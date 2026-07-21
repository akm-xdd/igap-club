'use client';

import { Tooltip } from 'radix-ui';
import { formatEpochMs } from '@/lib/tools/epoch';
import type { ClaimInfo } from '@/lib/tools/jwt';

interface JsonClaimsViewProps {
  data: Record<string, unknown>;
  claimInfo?: Record<string, ClaimInfo>;
}

function valueColor(value: unknown): string {
  if (typeof value === 'string') return 'text-emerald-600';
  if (typeof value === 'number') return 'text-blue-600';
  if (typeof value === 'boolean' || value === null) return 'text-purple-600';
  return 'text-black';
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function JsonClaimsView({ data, claimInfo = {} }: JsonClaimsViewProps) {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return <pre className="font-mono text-sm text-black">{'{}'}</pre>;
  }

  return (
    <Tooltip.Provider delayDuration={150}>
      <pre className="font-mono text-sm leading-relaxed text-black">
        <span className="block">{'{'}</span>
        {entries.map(([key, value], i) => {
          const info = claimInfo[key];
          const isLast = i === entries.length - 1;

          const row = (
            <>
              <span className="text-sky-700">&quot;{key}&quot;</span>
              <span>: </span>
              <span className={valueColor(value)}>{formatValue(value)}</span>
              {!isLast && <span>,</span>}
            </>
          );

          if (!info) {
            return (
              <span key={key} className="block pl-4">
                {row}
              </span>
            );
          }

          const dateDetail =
            info.isDate && typeof value === 'number' ? formatEpochMs(value * 1000) : null;

          return (
            <Tooltip.Root key={key}>
              <Tooltip.Trigger asChild>
                <span className="block cursor-help pl-4 decoration-dotted decoration-black/40 hover:underline">
                  {row}
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={6}
                  className="z-50 max-w-xs rounded-lg border-2 border-black bg-white px-3 py-2 text-xs text-black shadow-[3px_3px_0_black]"
                >
                  <p className="font-medium">{info.label}</p>
                  {dateDetail && (
                    <p className="mt-1 text-black/70">
                      {dateDetail.local} ({dateDetail.relative})
                    </p>
                  )}
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
        <span className="block">{'}'}</span>
      </pre>
    </Tooltip.Provider>
  );
}
