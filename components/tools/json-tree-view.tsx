'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JsonTreeNodeProps {
  label?: string;
  value: unknown;
  depth: number;
  defaultExpanded?: boolean;
}

function valueColor(value: unknown): string {
  if (typeof value === 'string') return 'text-emerald-600';
  if (typeof value === 'number') return 'text-blue-600';
  if (typeof value === 'boolean' || value === null) return 'text-purple-600';
  return 'text-black';
}

function formatPrimitive(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  return String(value);
}

function JsonTreeNode({ label, value, depth, defaultExpanded = false }: JsonTreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isArray = Array.isArray(value);
  const isObject = !isArray && value !== null && typeof value === 'object';
  const isExpandable = isArray || isObject;

  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : isObject
    ? Object.entries(value as Record<string, unknown>)
    : [];

  const typeLabel = isArray ? `Array [${entries.length}]` : `Object {${entries.length}}`;

  return (
    <div>
      <div
        className="flex items-center gap-1 rounded py-0.5 hover:bg-black/5"
        style={{ paddingLeft: depth * 16 }}
      >
        {isExpandable ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-black/50 hover:text-black"
          >
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}

        <span className="truncate font-mono text-sm">
          {label !== undefined && (
            <>
              <span className="text-sky-700">{label}</span>
              <span className="text-black/40">: </span>
            </>
          )}
          {isExpandable ? (
            <span className="text-black/50">{typeLabel}</span>
          ) : (
            <span className={valueColor(value)}>{formatPrimitive(value)}</span>
          )}
        </span>
      </div>

      {isExpandable && expanded && (
        <div>
          {entries.length === 0 && (
            <p className="font-mono text-sm text-black/40" style={{ paddingLeft: (depth + 1) * 16 + 20 }}>
              empty
            </p>
          )}
          {entries.map(([key, childValue]) => (
            <JsonTreeNode key={key} label={key} value={childValue} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface JsonTreeViewProps {
  data: unknown;
  className?: string;
}

export function JsonTreeView({ data, className }: JsonTreeViewProps) {
  return (
    <div className={cn('overflow-auto', className)}>
      <JsonTreeNode value={data} depth={0} defaultExpanded />
    </div>
  );
}
